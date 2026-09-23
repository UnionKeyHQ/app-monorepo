import { useCallback, useEffect, useState } from 'react';

import {
  Box,
  Button,
  Center,
  Image,
  Pressable,
  Spinner,
  Typography,
} from '@unionkeyhq/components';

import backgroundApiProxy from '../../background/instance/backgroundApiProxy';
import { useActiveWalletAccount } from '../../hooks/crossHooks/useActiveWalletAccount';

type INFTMarketItem = {
  id: string;
  name: string;
  description: string;
  image: string;
};

type ISerialValidation = {
  valid?: boolean;
  type?: string;
  canClaim?: boolean;
  message?: string;
};

const API_BASE_URL = 'https://api.unionkey.io';
const SOLANA_NETWORK_ID = 'sol--101';

function resolveImageUrl(image: string) {
  if (/^https?:\/\//i.test(image)) return image;
  return `${API_BASE_URL}${image.startsWith('/') ? '' : '/'}${image}`;
}

function getDeviceSerial(device: { features?: string; uuid?: string }) {
  let features: Record<string, unknown> = {};
  try {
    features = device.features ? JSON.parse(device.features) : {};
  } catch {
    features = {};
  }

  const serial =
    features.serial_no ??
    features.onekey_serial_no ??
    features.onekey_serial ??
    device.uuid;
  return typeof serial === 'string' ? serial : '';
}

export function NFTMarket() {
  const { wallet } = useActiveWalletAccount();
  const [items, setItems] = useState<INFTMarketItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<INFTMarketItem>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState('');
  const [serial, setSerial] = useState('');
  const [solanaAddress, setSolanaAddress] = useState('');
  const [solanaAccountId, setSolanaAccountId] = useState('');
  const [validation, setValidation] = useState<ISerialValidation>();

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${API_BASE_URL}/nfts`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error(`NFT API ${response.status}`);
        return response.json() as Promise<INFTMarketItem[]>;
      })
      .then((result) => {
        setItems(Array.isArray(result) ? result : []);
        setError(false);
      })
      .catch((requestError) => {
        if ((requestError as Error).name !== 'AbortError') setError(true);
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const prepareClaim = useCallback(
    async (item: INFTMarketItem) => {
      setSelectedItem(item);
      setActionLoading(true);
      setActionMessage('正在检查硬件钱包资格…');
      setValidation(undefined);
      setSerial('');
      setSolanaAddress('');
      setSolanaAccountId('');

      try {
        if (!wallet || wallet.type !== 'hw') {
          throw new Error('请先连接并选择 UnionKey 硬件钱包');
        }

        const device = await backgroundApiProxy.engine.getHWDeviceByWalletId(
          wallet.id,
        );
        if (!device) throw new Error('未找到已连接的硬件钱包');
        const deviceSerial = getDeviceSerial(device);
        if (!deviceSerial) throw new Error('无法读取硬件钱包序列号');

        const validationResponse = await fetch(
          `${API_BASE_URL}/check-serial?serial=${encodeURIComponent(
            deviceSerial,
          )}`,
        );
        if (!validationResponse.ok) {
          throw new Error('资格校验服务暂时不可用');
        }
        const result = (await validationResponse.json()) as ISerialValidation;
        if (!result.valid) throw new Error(result.message || '设备资格无效');
        if (result.type !== item.id) throw new Error('该设备不符合此 NFT 类型');

        const accounts = await backgroundApiProxy.engine.getAccounts(
          wallet.accounts,
          SOLANA_NETWORK_ID,
        );
        const account = accounts[0];
        if (!account?.address) {
          throw new Error('请先为当前硬件钱包创建 Solana 账户');
        }

        setSerial(deviceSerial);
        setSolanaAddress(account.address);
        setSolanaAccountId(account.id);
        setValidation(result);
        setActionMessage(
          result.canClaim ? '资格校验通过，可以领取' : '该设备已经领取过此 NFT',
        );
      } catch (requestError) {
        setActionMessage(
          requestError instanceof Error ? requestError.message : '资格检查失败',
        );
      } finally {
        setActionLoading(false);
      }
    },
    [wallet],
  );

  const claim = useCallback(async () => {
    if (!selectedItem || !validation?.canClaim) return;
    setActionLoading(true);
    setActionMessage('正在提交领取请求…');
    try {
      const response = await fetch(`${API_BASE_URL}/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userAddress: solanaAddress,
          accountId: solanaAccountId,
          networkId: SOLANA_NETWORK_ID,
          type: selectedItem.id,
          serial,
        }),
      });
      const result = (await response.json()) as {
        message?: string;
        error?: string;
      };
      if (!response.ok) {
        throw new Error(result.error || result.message || '领取失败');
      }
      setValidation((current) => ({ ...current, canClaim: false }));
      setActionMessage(result.message || '领取成功');
    } catch (requestError) {
      setActionMessage(
        requestError instanceof Error ? requestError.message : '领取失败',
      );
    } finally {
      setActionLoading(false);
    }
  }, [selectedItem, serial, solanaAccountId, solanaAddress, validation]);

  if (loading) {
    return (
      <Center minH="360px">
        <Spinner size="lg" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center minH="360px">
        <Typography.Body1 color="text-subdued">
          NFT 数据加载失败
        </Typography.Body1>
      </Center>
    );
  }

  if (selectedItem) {
    return (
      <Box>
        <Button
          type="plain"
          alignSelf="flex-start"
          onPress={() => setSelectedItem(undefined)}
        >
          返回 NFT 列表
        </Button>
        <Image
          source={{ uri: resolveImageUrl(selectedItem.image) }}
          w="full"
          h={{ base: '280px', md: '448px' }}
          mt="3"
          borderRadius="12px"
          resizeMode="contain"
          bg="surface-neutral-default"
          alt={selectedItem.name}
        />
        <Typography.DisplayLarge mt="5">
          {selectedItem.name}
        </Typography.DisplayLarge>
        <Typography.Body1 mt="2" color="text-subdued">
          {selectedItem.description}
        </Typography.Body1>
        <Typography.Body2 mt="4" color="text-subdued">
          {actionMessage}
        </Typography.Body2>
        <Button
          type="primary"
          size="lg"
          mt="5"
          isLoading={actionLoading}
          isDisabled={!validation?.canClaim}
          onPress={claim}
        >
          领取 NFT
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {items.map((item) => (
        <Pressable
          key={item.id}
          mb="4"
          borderRadius="12px"
          overflow="hidden"
          onPress={() => prepareClaim(item)}
        >
          <Image
            source={{ uri: resolveImageUrl(item.image) }}
            w="full"
            h={{ base: '280px', md: '448px' }}
            resizeMode="contain"
            bg="surface-neutral-default"
            alt={item.name}
          />
          <Box py="3">
            <Typography.Heading numberOfLines={1}>
              {item.name}
            </Typography.Heading>
            <Typography.Body2 mt="1" color="text-subdued" numberOfLines={2}>
              {item.description}
            </Typography.Body2>
          </Box>
        </Pressable>
      ))}
    </Box>
  );
}
