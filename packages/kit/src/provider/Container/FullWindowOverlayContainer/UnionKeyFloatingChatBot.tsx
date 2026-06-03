import React, { useState } from 'react';  
import {  
  Stack,  
  Button,  
  Icon,  
  Badge,  
  Dialog,  
  useMedia,  
  IconButton,  
  SizableText,  
  LinearGradient,  
} from '@unionkey/components';  
import { ChatInterface } from './ChatInterface';  
import { XStack } from '@unionkey/components';  
import { TOAST_Z_INDEX } from '@unionkey/shared/src/utils/overlayUtils';  
  
interface UnionKeyFloatingChatBotProps {  
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';  
  iconSize?: 'small' | 'medium' | 'large';  
  iconColor?: string;  
  title?: string;  
  hasUnread?: boolean;  
}  
  
export function UnionKeyFloatingChatBot({  
  position = 'bottom-right',  
  iconSize = 'medium',  
  iconColor = '$iconPrimary',  
  title = 'UnionKey AI助手',  
  hasUnread = false,  
}: UnionKeyFloatingChatBotProps) {  
  const [open, setOpen] = useState(false);  
  const [unreadCount, setUnreadCount] = useState(0);  
  const media = useMedia();  
  
  // 图标尺寸映射  
  const iconSizes = {  
    small: 40,  
    medium: 56,  
    large: 72,  
  };  
  
  const handleOpenChat = () => {  
    Dialog.show({  
      title,  
      showFooter: false,  
      renderContent: (  
        <ChatInterface   
          onClose={() => setOpen(false)}  
        />  
      ),  
    });  
    setOpen(true);  
  };  
  
  return (  
    <Stack  
      style={{  
        position: 'fixed' as const,  
        bottom: 80,           // 避开菜单�? 
        right: 16,            // 右对�? 
        left: 'auto',         // 强制覆盖左对�? 
        top: 'auto',          // 强制覆盖顶部对齐  
        zIndex: TOAST_Z_INDEX + 1, // 使用更高层级  
        margin: 0,            // 清除边距  
        padding: 0,           // 清除内边�? 
        transform: 'none',    // 清除变换  
      }}  
      animation="quick"  
      hoverStyle={{  
        scale: 1.1,  
      }}  
      pressStyle={{  
        scale: 0.95,  
      }}  
    >  
      <Stack  
        width={iconSizes[iconSize]}  
        height={iconSizes[iconSize]}  
        borderRadius="$full"  
        bg={iconColor}  
        alignItems="center"  
        justifyContent="center"  
        // 使用平台特定的阴影样�? 
        $platform-web={{  
          boxShadow: '0 4px 6px 0 rgba(0, 0, 0, 0.04), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',  
        }}  
        $platform-ios={{  
          shadowColor: '#000',  
          shadowOffset: { width: 0, height: 0.5 },  
          shadowOpacity: 0.2,  
          shadowRadius: 0.5,  
        }}  
        $platform-android={{ elevation: 0.5 }}  
        borderWidth="$px"  
        borderColor="$border"  
      >  
        <Icon   
          name="MessageOutline"   
          color="iconOnColor"   
          size={iconSizes[iconSize] * 0.4}  
        />  
        {hasUnread && unreadCount > 0 && (  
          <Badge  
            position="absolute"  
            top={-4}  
            right={-4}  
            bg="$red10"  
            color="$white"  
            size="$2"  
            circular  
          >  
            {unreadCount > 99 ? '99+' : unreadCount}  
          </Badge>  
        )}  
      </Stack>  
    </Stack>  
  );  
}