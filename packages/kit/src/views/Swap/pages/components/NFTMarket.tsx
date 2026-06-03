import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';  
import { useIntl } from 'react-intl';  
import {  
  Button,  
  Page,  
  Stack,  
  XStack,  
  YStack,  
  SizableText,  
  Spinner,  
  Heading,  
  Image,
} from '@unionkey/components';  
import backgroundApiProxy from '@unionkey/kit/src/background/instance/backgroundApiProxy';  
import {   
  useActiveAccount,  
  useAccountSelectorActions   
} from '@unionkey/kit/src/states/jotai/contexts/accountSelector';  
import { AccountSelectorProviderMirror } from '@unionkey/kit/src/components/AccountSelector';  
import { EAccountSelectorSceneName } from '@unionkey/shared/types';  
import accountUtils from '@unionkey/shared/src/utils/accountUtils';  
import { ETranslations } from '@unionkey/shared/src/locale';

interface NFT {  
  id: string;  
  name: string;  
  description: string;  
  image: string;  
}  
  
interface SerialValidation {  
  valid: boolean;  
  type?: string;  
  status?: string;  
  canClaim?: boolean;  
  error?: string;  
}  
  
const NFTMarket: React.FC = () => {  
  const [nfts, setNfts] = useState<NFT[]>([]);  
  const [loading, setLoading] = useState(true);  
  const [solanaAddress, setSolanaAddress] = useState('');  
  const [deviceSerialNo, setDeviceSerialNo] = useState('');  
  const [serialValidation, setSerialValidation] = useState<SerialValidation>({ valid: false });  
  const [isValidatingSerial, setIsValidatingSerial] = useState(false);  
  
  // 按钮相关状态
  const [buttonState, setButtonState] = useState<{ [key: string]: 'idle' | 'claiming' | 'success' | 'error' }>({});
  const [buttonContentKey, setButtonContentKey] = useState(0); // 强制按钮内容刷新
  
  const intl = useIntl();  
  const { activeAccount } = useActiveAccount({ num: 0 });  
  const { updateSelectedAccountNetwork } = useAccountSelectorActions().current;  
  
  const SOLANA_NETWORK_ID = 'sol--101';  
  
  // 检测是否为硬件钱包  
  const isHardwareWallet = useMemo(() => {  
    if (!activeAccount?.wallet?.id) {  
      return false;  
    }  
    return accountUtils.isHwWallet({ walletId: activeAccount.wallet.id });  
  }, [activeAccount?.wallet?.id]);  
  
  // 获取硬件设备序列号  
  const getDeviceSerialNo = useCallback(() => {  
    if (!isHardwareWallet || !activeAccount?.device) {  
      return '';  
    }  
  
    try {  
      const device = activeAccount.device;  
        
      // 尝试从 featuresInfo 获取序列号  
      if (device.featuresInfo) {  
        const features = typeof device.featuresInfo === 'string'   
          ? JSON.parse(device.featuresInfo)   
          : device.featuresInfo;  
          
        // 按照UnionKey的序列号字段优先级获取  
        const serialNo = features.serial_no || features.unionkey_serial_no || features.unionkey_serial;  
          
        if (serialNo) {  
          console.log('Device serial number from features:', serialNo);  
          return serialNo;  
        }  
      }  
        
      // 备用方案：从设备UUID获取  
      if (device.uuid) {  
        console.log('Using device UUID as serial:', device.uuid);  
        return device.uuid;  
      }  
        
      console.log('No serial number found in device info');  
      return '';  
    } catch (error) {  
      console.error('解析设备序列号失败:', error);  
      return '';  
    }  
  }, [isHardwareWallet, activeAccount?.device]);  
  
  // 验证设备序列号  
  const validateDeviceSerial = useCallback(async (serial: string) => {  
    if (!serial.trim()) {  
      setSerialValidation({ valid: false });  
      return { valid: false, canClaim: false };  
    }  
      
    setIsValidatingSerial(true);  
    try {  
      const response = await fetch(`https://api.unionkey.io/check-serial?serial=${encodeURIComponent(serial)}`);  
      const data = await response.json();  
        
      if (data.valid) {  
        const validationResult = {  
          valid: true,  
          type: data.type,  
          status: data.status,  
          canClaim: data.canClaim  
        };  
        setSerialValidation(validationResult);  
        return validationResult; // 返回完整信息  
      } else {  
        const validationResult = { valid: false, canClaim: false };  
        setSerialValidation({ valid: false, error: 'error' });  
        return validationResult;  
      }  
    } catch (error) {  
      console.error('验证设备序列号失败:', error);  
      setSerialValidation({ valid: false, error: 'error' });  
      return { valid: false, canClaim: false };  
    } finally {  
      setIsValidatingSerial(false);  
    }  
  }, []);
  
  // 切换到Solana网络的函数  
  const switchToSolanaNetwork = useCallback(async () => {  
    try {  
      await updateSelectedAccountNetwork({  
        num: 0,  
        networkId: SOLANA_NETWORK_ID,  
      });  
    } catch (error) {  
      console.error('切换网络失败:', error);  
    }  
  }, [updateSelectedAccountNetwork]);  
  
  useEffect(() => {  
    console.log('ActiveAccount:', activeAccount);  
    console.log('Account:', activeAccount?.account);  
    console.log('Address:', activeAccount?.account?.address);  
    console.log('Network:', activeAccount?.network);  
    console.log('Ready:', activeAccount?.ready);  
    console.log('Is Hardware Wallet:', isHardwareWallet);  
    console.log('Device:', activeAccount?.device);  
  }, [activeAccount, isHardwareWallet]);  
  
  // 只获取序列号，不自动验证  
  useEffect(() => {  
    if (isHardwareWallet && activeAccount?.ready && activeAccount?.device) {  
      const serialNo = getDeviceSerialNo();  
      if (serialNo) {  
        setDeviceSerialNo(serialNo);  
      } else {  
        setDeviceSerialNo('');  
      }  
    } else {  
      setDeviceSerialNo('');  
      setSerialValidation({ valid: false });  
    }  
  }, [isHardwareWallet, activeAccount?.ready, activeAccount?.device, getDeviceSerialNo]);  
  
  const getSolanaAddress = useCallback(async () => {  
    if (!activeAccount?.account) {  
      console.log('Account not ready or missing');  
      return '';  
    }  
  
    try {  
      const address = await backgroundApiProxy.serviceAccount.getAccountAddressForApi({  
        accountId: activeAccount.account.id,  
        networkId: SOLANA_NETWORK_ID,  
      });  
      console.log('Solana address obtained:', address);  
      return address;  
    } catch (error) {  
      console.error('获取Solana地址失败:', error);  
      return '';  
    }  
  }, [activeAccount]);  
  
  useEffect(() => {  
    if (activeAccount?.ready) {  
      getSolanaAddress().then(setSolanaAddress);  
    }  
  }, [getSolanaAddress, activeAccount?.ready]);  
  
  useEffect(() => {  
    let canceled = false;  
    async function load() {  
    
      try {  
        const res = await fetch('https://api.unionkey.io/nfts');  
        const data: NFT[] = await res.json();       
        if (!canceled) {  
          setNfts(data);  
          // 初始化按钮状态
          const initialButtonState = {} as any;
          data.forEach(nft => (initialButtonState[nft.id] = 'idle'));
          setButtonState(initialButtonState);
        }  
      } catch (err) {  
        console.error('加载 NFT 列表失败', err);  
      } finally {  
        if (!canceled) setLoading(false);  
      }  
    }  
    load();  
    return () => {  
      canceled = true;  
    };  
  }, []);  
  
  // 关键：监听所有相关状态变化，自动刷新按钮内容
  useEffect(() => {
    // 每次相关状态变化时都强制刷新按钮内容
    setButtonContentKey(prev => prev + 1);
  }, [serialValidation, isValidatingSerial, buttonState, isHardwareWallet, deviceSerialNo]);
  
  // 获取按钮显示内容的核心函数
  const getButtonContent = useCallback((nft: NFT, validationOverride?: {   
    valid: boolean;   
    canClaim: boolean;   
    type?: string   
  }) => {
    const isValid = validationOverride?.valid ?? serialValidation.valid;  
    const canClaim = validationOverride?.canClaim ?? serialValidation.canClaim;  
    const type = validationOverride?.type ?? serialValidation.type;  
    // 1. 检查是否为硬件钱包
    if (!isHardwareWallet) {
      return intl.formatMessage({ id: ETranslations.OnlyHardwareWallet });
    }
    
    // 2. 检查设备序列号
    if (!deviceSerialNo) {
      return intl.formatMessage({ id: ETranslations.DetectingDevice });
    }
    
    // 3. 检查是否正在验证序列号
    if (isValidatingSerial) {
      return intl.formatMessage({ id: ETranslations.Verifying });
    }
    
    // 4. 检查设备验证状态
    if (!isValid) {    
      return intl.formatMessage({ id: ETranslations.DeviceUnauthorized });    
    }    
      
    
      
    // 6. 检查设备类型是否匹配（使用传入的参数）  
    if (type !== nft.id) {  
      return intl.formatMessage({ id: ETranslations.PrivilegeMismatch });  
    }  
    // 5. 检查设备是否可以使用（使用传入的参数）  
    if (!canClaim) {  
      return intl.formatMessage({ id: ETranslations.DeviceUsed });  
    }  
    // 7. 检查领取状态
    const currentButtonState = buttonState[nft.id] || 'idle';
    
    switch (currentButtonState) {
      case 'claiming':
        return (
          <XStack space="$2" alignItems="center">
            <Spinner size="small" />
            <SizableText>{intl.formatMessage({ id: ETranslations.Claiming })}</SizableText>
          </XStack>
        );
      case 'success':
        return (
          <XStack space="$2" alignItems="center">
            <SizableText color="$textSuccess">✓ </SizableText>
            <SizableText>{intl.formatMessage({ id: ETranslations.ClaimSuccess })}</SizableText>
          </XStack>
        );
      case 'error':
        return intl.formatMessage({ id: ETranslations.ClaimNow });
      case 'idle':
      default:
        return intl.formatMessage({ id: ETranslations.ClaimNow });
    }
  }, [isHardwareWallet, deviceSerialNo, isValidatingSerial, serialValidation, buttonState, intl]);

  const handleClaim = async (nftId: string,dialog: any) => {  
    if (!solanaAddress || !activeAccount?.account) {  
      const { Dialog } = require('@unionkey/components');
      let loadingDialog: any = null;  
      Dialog.show({
        icon: 'ErrorOutline',  
        tone: 'destructive',
        title: intl.formatMessage({ id: ETranslations.ClaimError }),
        description: intl.formatMessage({ id: ETranslations.DeviceUnauthorized }),
        onConfirmText:  intl.formatMessage({ id: ETranslations.global_confirm }),
        showCancelButton: false,
      });
      await dialog.close(); 
      return;  
    }  
  
    // 设置按钮状态为领取中
    setButtonState(prev => ({ ...prev, [nftId]: 'claiming' }));
    setButtonContentKey(prev => prev + 1); // 立即刷新按钮内容
    let loadingDialog: any = null; 
    try { 
      const { Dialog } = require('@unionkey/components'); 
       
      loadingDialog=Dialog.show({  
        renderIcon: (  
          <Stack p="$3" borderRadius="$full" bg="$bgSubdued">  
            <Spinner size="large" />  
          </Stack>  
        ),  
        title: intl.formatMessage({ id: ETranslations.Claiming }),  
        showFooter: false,  
        dismissOnOverlayPress: false,  
        disableDrag: true,            
        showExitButton: false,   
      });
      
      console.log('发送请求...');
      const response = await fetch('https://api.unionkey.io/claim', {  
        method: 'POST',  
        headers: { 'Content-Type': 'application/json' },  
        body: JSON.stringify({  
          userAddress: solanaAddress,  
          accountId: activeAccount.account.id,  
          networkId: SOLANA_NETWORK_ID,  
          type: nftId,  
          serial: deviceSerialNo,  
        }),  
      });  

      console.log('响应状态:', response.status);
      
      if (!response.ok) {  
        const errorData = await response.json();  
        throw new Error(errorData.error || '领取失败');  
      }  

      const result = await response.json();  
      console.log('领取成功:', result);
      
      // 设置按钮状态为成功
      setButtonState(prev => ({ ...prev, [nftId]: 'success' }));
      setButtonContentKey(prev => prev + 1); // 立即刷新按钮内容
        
      // 重新验证序列号状态  
      if (deviceSerialNo) {  
        await validateDeviceSerial(deviceSerialNo); 
      }  
      
      // 显示成功提示
      await loadingDialog.close(); 
      Dialog.show({  
        icon: 'CheckLargeOutline',  
        tone: 'success',  
        title: intl.formatMessage({ id: ETranslations.ClaimSuccess }),  
        
      });
      await dialog.close(); 
      
    } catch (error: any) {  
      console.error('领取失败:', error);
      await loadingDialog.close(); 
      // 设置按钮状态为错误
      setButtonState(prev => ({ ...prev, [nftId]: 'error' }));
      setButtonContentKey(prev => prev + 1); // 立即刷新按钮内容
      
      // 显示错误对话框
      const { Dialog } = require('@unionkey/components');
      // Dialog.show({
      //   title: intl.formatMessage({ id: ETranslations.ClaimError }),
      //   description: error.message,
      //   onConfirmText: '确定',
      //   showCancelButton: false,
      
      Dialog.show({  
        icon: 'ErrorOutline',  
        tone: 'destructive',  
        title: intl.formatMessage({ id: ETranslations.ClaimError }),  
         
        
      }); 
        
      // });
      
      
        await dialog.close();   
      
    }  
  };  
  // 检查按钮是否应该禁用
  const isButtonDisabled = useCallback((nftId: string,validationOverride?: {   
    valid: boolean;   
    canClaim: boolean;   
    type?: string   
  }) => {
    const currentButtonState = buttonState[nftId] || 'idle';
    const isValid = validationOverride?.valid ?? serialValidation.valid;  
    const canClaim = validationOverride?.canClaim ?? serialValidation.canClaim;  
    const type = validationOverride?.type ?? serialValidation.type; 
    // 特殊处理：当设备未授权时，按钮应该可以点击以重新验证
    // 只有以下情况才禁用按钮：
    // 1. 不是硬件钱包（显示"仅限硬件钱包"时）
    // 2. 没有设备序列号（显示"检测设备中"时）
    // 3. 正在验证中（显示"验证中"时）
    // 4. 正在领取中（显示"领取中"时）
    // 5. 领取成功（显示"领取成功"时）
    // 6. 设备已使用（显示"设备已使用"时）
    // 7. 权益不匹配（显示"权益不匹配"时）
    
    return (
      !isHardwareWallet ||
      !deviceSerialNo ||
      isValidatingSerial ||
      currentButtonState === 'claiming' ||
      currentButtonState === 'success' ||
      (isValid && (!canClaim || type!== nftId))
    );
  }, [isHardwareWallet, deviceSerialNo, isValidatingSerial, serialValidation, buttonState]);
  
  // 处理按钮点击
  const handleButtonClick = useCallback(async (nft: NFT, dialog: any,validationOverride?: {   
    valid: boolean;   
    canClaim: boolean;   
    type?: string   
  }) => {
    const currentButtonState = buttonState[nft.id] || 'idle';
    const isValid = validationOverride?.valid ?? serialValidation.valid;  
    const canClaim = validationOverride?.canClaim ?? serialValidation.canClaim;  
    const type = validationOverride?.type ?? serialValidation.type;  
    // 根据不同状态处理点击事件
    if (!isHardwareWallet) {
      // 显示仅限硬件钱包提示
      const { Dialog } = require('@unionkey/components');
      Dialog.show({
        title: '无法领取',
        description: '仅限硬件钱包领取',
        onConfirmText: '确定',
        showCancelButton: false,
      });
      return;
    }
    
    if (!deviceSerialNo) {
      // 显示未检测到设备提示
      const { Dialog } = require('@unionkey/components');
      Dialog.show({
        title: '无法领取',
        description: '未检测到设备，请确保硬件钱包已连接',
        onConfirmText: '确定',
        showCancelButton: false,
      });
      return;
    }
    
    if (!isValid) {
      setButtonContentKey(prev => prev + 1); 
      await dialog.close();    
      const isValid = await validateDeviceSerial(deviceSerialNo);  
        
      if (isValid) {  
        setButtonContentKey(prev => prev + 1); 
        showNftDetails(nft);  
        setButtonContentKey(prev => prev + 1); 
      }  
    
     
      
      return;
    }
    
    if (!canClaim) {
      // 设备已使用，显示提示
      const { Dialog } = require('@unionkey/components');
      Dialog.show({
        title: '无法领取',
        description: '此设备已被使用',
        onConfirmText: '确定',
        showCancelButton: false,
      });
      return;
    }
    
    if (type !== nft.id) {
      // 权益不匹配，显示提示
      const { Dialog } = require('@unionkey/components');
      Dialog.show({
        title: '无法领取',
        description: '设备类型与NFT不匹配',
        onConfirmText: '确定',
        showCancelButton: false,
      });
      return;
    }
    
    // 所有验证通过，开始领取
    if (currentButtonState === 'idle' || currentButtonState === 'error') {
      await handleClaim(nft.id,dialog);
    }
  }, [isHardwareWallet, deviceSerialNo, isValidatingSerial, serialValidation, buttonState, validateDeviceSerial, handleClaim]);
  
 
  
  // 修改 showNftDetails 函数
  const showNftDetails = useCallback(  
    async(nft: NFT) => {  
      const { Dialog } = require('@unionkey/components');  
        
      const validation = await validateDeviceSerial(deviceSerialNo); 
    
  // 确保状态更新完成  
  await new Promise(resolve => setTimeout(resolve, 100));  
    
  // 强制刷新按钮内容  
  setButtonContentKey(prev => prev + 1);  
   
    
      const dialog = Dialog.show({  
        title: nft.name,  
        estimatedContentHeight: 400,
       
        renderContent: (  
          <YStack space="$4" p="$4" key={`dialog-${nft.id}-${buttonContentKey}`}>  
            <Stack  
              alignSelf="center"  
              w="$64"  
              h="$64"  
              borderRadius="$3"  
              overflow="hidden"  
              bg="$bgStrong"  
              justifyContent="center"  
              alignItems="center"  
            >  
              <Image  
                src={`https://api.unionkey.io/${nft.image}`}  
                w="100%"  
                h="100%"  
                fallback={  
                  <Image.Fallback bg="$bgStrong" justifyContent="center" alignItems="center">  
                    <SizableText> {intl.formatMessage({ id: ETranslations.LoadingFailed})}</SizableText>  
                  </Image.Fallback> 
                }  
              />  
            </Stack>  
              
            <SizableText size="$bodyLg" color="$textSubdued" textAlign="center">  
              {nft.description}  
            </SizableText>  
    
            <Button  
              key={`claim-button-${nft.id}-${buttonContentKey}`}
              variant={buttonState[nft.id] === 'success' ? 'secondary' : 'primary'}  
              size="large"  
              disabled={isButtonDisabled(nft.id,validation)}
              onPress={() => handleButtonClick(nft, dialog,validation)}  
              alignSelf="center"  
              minWidth="$48"  
            >
               {getButtonContent(nft, validation)} 
            </Button>  
          </YStack>  
        ),  
      });  
    },  
    [deviceSerialNo, validateDeviceSerial, buttonContentKey, buttonState, isButtonDisabled, getButtonContent, handleButtonClick, intl],  
  );
 
 const renderWalletStatus = () => {  
   if (!activeAccount?.ready) {  
     return (  
       <Stack bg="$bgWarning" px="$4" py="$2" borderRadius="$3" borderWidth={1} borderColor="$borderWarning">  
         <SizableText color="$textWarning">{intl.formatMessage({ id: ETranslations.AccountInitializing })}</SizableText>  
       </Stack>  
     );  
   }  
 
   if (!activeAccount?.account) {  
     return (  
       <Stack bg="$bgCritical" px="$4" py="$2" borderRadius="$3" borderWidth={1} borderColor="$borderCritical">  
         <SizableText color="$textCritical">{intl.formatMessage({ id: ETranslations.NoAccountFound  })}</SizableText>  
       </Stack>  
     );  
   }  
 
   if (activeAccount?.network?.id !== 'sol--101') {  
     return (  
       <Stack   
         bg="$bgWarning"   
         px="$4"   
         py="$2"   
         borderRadius="$3"   
         borderWidth={1}   
         borderColor="$borderWarning"  
         onPress={switchToSolanaNetwork}  
         cursor="pointer"  
         hoverStyle={{  
           bg: '$bgWarningHover',  
         }}  
       >  
         <SizableText color="$textWarning">{intl.formatMessage({ id: ETranslations.SwitchToSolanaNetwork})}</SizableText>  
       </Stack>  
     );  
   }  
 
   if (!solanaAddress) {  
     return (  
       <Stack bg="$bgCritical" px="$4" py="$2" borderRadius="$3" borderWidth={1} borderColor="$borderCritical">  
         <SizableText color="$textCritical">{intl.formatMessage({ id: ETranslations.NoSolanaWalletDetected })}</SizableText>  
       </Stack>  
     );  
   }  
 
   return (  
     <YStack space="$2">  
       {!isHardwareWallet && (  
         <Stack bg="$bgWarning" px="$4" py="$2" borderRadius="$3" borderWidth={1} borderColor="$borderWarning">  
           <SizableText color="$textWarning">{intl.formatMessage({ id: ETranslations.HardwareWalletRequired  })}</SizableText>  
         </Stack>  
       )}  
         
       {isHardwareWallet && !deviceSerialNo && (  
         <Stack bg="$bgWarning" px="$4" py="$2" borderRadius="$3" borderWidth={1} borderColor="$borderWarning">  
           <SizableText color="$textWarning">{intl.formatMessage({ id: ETranslations.CheckingDeviceSerial   })}</SizableText>  
         </Stack>  
       )}  
     </YStack>  
   );  
 };  
 
 if (loading) {  
   return (  
     <Page>  
       <Page.Body>  
         <Stack flex={1} justifyContent="center" alignItems="center">  
           <Spinner size="large" />  
           <SizableText mt="$4">{intl.formatMessage({ id: ETranslations.Loading    })}</SizableText>  
         </Stack>  
       </Page.Body>  
     </Page>  
   );  
 }  
 
 return (  
   <AccountSelectorProviderMirror  
     config={{  
       sceneName: EAccountSelectorSceneName.home,  
       sceneUrl: '',  
     }}  
     enabledNum={[0]}  
   >  
     <Page>  
       <Page.Header title="Solana NFT" />  
       <Page.Body px="$5">  
         <XStack justifyContent="flex-end" mb="$5">  
           {renderWalletStatus()}  
         </XStack>  
 
         <YStack  
           space="$3"  
           flexWrap="wrap"  
           flexDirection="row"  
           justifyContent="space-between"  
         >  
           {nfts.map(nft => (  
             <Stack  
               key={nft.id}  
               p="$2"  
               width="45%"  
               mb="$4"  
               onPress={() => showNftDetails(nft)}  
             >  
               <Stack  
                 w="100%"  
                 aspectRatio={1}  
                 borderRadius="$3"  
                 overflow="hidden"  
                 bg="$bgStrong"  
                 mb="$2"  
               >  
                 <Image  
                   src={`https://api.unionkey.io${nft.image}`}  
                   w="100%"  
                   h="100%"  
                   resizeMode="cover"  
                   fallback={  
                     <Image.Fallback  
                       bg="$bgStrong"  
                       justifyContent="center"  
                       alignItems="center"  
                     >  
                       <SizableText>{intl.formatMessage({ id: ETranslations.LoadFailed     })}</SizableText>  
                     </Image.Fallback>  
                   }  
                 />  
               </Stack>  
 
               <YStack space="$1" alignItems="flex-start" mb="$3" px="$-1">  
                 <SizableText  
                   size="$headingMd"  
                   fontWeight="600"  
                   color="$text"  
                   textAlign="left"  
                   numberOfLines={1}  
                 >  
                   {nft.name}  
                 </SizableText>  
                 <SizableText  
                   size="$bodyMd"  
                   color="$textSubdued"  
                   textAlign="left"  
                   numberOfLines={2}  
                 >  
                   {nft.description}  
                 </SizableText>  
               </YStack>  
             </Stack>  
           ))}  
         </YStack>  
       </Page.Body>  
     </Page>  
   </AccountSelectorProviderMirror>  
 );  
};  
 
export default NFTMarket;