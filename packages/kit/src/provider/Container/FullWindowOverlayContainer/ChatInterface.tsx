// OneKeyChatInterface.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  Stack,
  Text,
  Button,
  Icon,
  Input,
  ScrollView,
  Spinner,
  useTheme,
} from '@onekeyhq/components';
import { Message } from './types';
import { getAgentResponse, generateMessageId, testAPIConnection } from './agentService';

interface OneKeyChatInterfaceProps {
  title?: string;
  onBack?: () => void;
  initialMessages?: Message[];
}

export function OneKeyChatInterface({
  title = 'OneKey AI助手',
  onBack,
  initialMessages = [],
}: OneKeyChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const scrollViewRef = useRef<any>(null);
  const theme = useTheme();

  // 初始化欢迎消息
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: generateMessageId(),
        content: '你好！我是OneKey AI助手。有什么可以帮助你的吗？',
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }

    // 检查API连接
    checkAPIConnection();
  }, []);

  const checkAPIConnection = async () => {
    setApiStatus('checking');
    try {
      const result = await testAPIConnection();
      if (result.success) {
        setApiStatus('connected');
      } else {
        setApiStatus('disconnected');
      }
    } catch {
      setApiStatus('disconnected');
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    // 添加用户消息
    const userMessage: Message = {
      id: generateMessageId(),
      content: inputText,
      role: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // 获取AI响应
      const response = await getAgentResponse([...messages, userMessage]);
      
      // 添加AI响应消息
      const assistantMessage: Message = {
        id: generateMessageId(),
        content: response,
        role: 'assistant',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // 更新API状态
      if (apiStatus === 'disconnected') {
        setApiStatus('connected');
      }
    } catch (error) {
      console.error('获取AI响应失败:', error);
      
      // 添加错误消息
      const errorMessage: Message = {
        id: generateMessageId(),
        content: '抱歉，暂时无法处理您的请求。请稍后重试。',
        role: 'assistant',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
      setApiStatus('disconnected');
    } finally {
      setIsLoading(false);
    }
  };

  // 滚动到底部
  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Stack flex={1}>
      {/* 消息区域 */}
      <ScrollView 
        ref={scrollViewRef}
        flex={1}
        p="$4"
        bg="$bgApp"
      >
        <Stack space="$4">
          {messages.map((message) => (
            <Stack
              key={message.id}
              alignSelf={message.role === 'user' ? 'flex-end' : 'flex-start'}
              maxWidth="80%"
            >
              <Stack
                bg={message.role === 'user' ? '$bgPrimary' : '$bgStrong'}
                p="$3"
                borderRadius="$3"
                borderTopLeftRadius={message.role === 'user' ? '$3' : '$1'}
                borderTopRightRadius={message.role === 'user' ? '$1' : '$3'}
              >
                <Text color={message.role === 'user' ? 'textOnColor' : 'text'}>
                  {message.content}
                </Text>
              </Stack>
              <Text
                fontSize="$1"
                color="$textSubdued"
                mt="$1"
                alignSelf={message.role === 'user' ? 'flex-end' : 'flex-start'}
              >
                {new Date(message.timestamp).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </Text>
            </Stack>
          ))}
          
          {isLoading && (
            <Stack alignSelf="flex-start" maxWidth="80%">
              <Stack bg="$bgStrong" p="$3" borderRadius="$3">
                <Stack flexDirection="row" alignItems="center" space="$2">
                  <Spinner size="small" />
                  <Text color="$textSubdued">AI正在思考...</Text>
                </Stack>
              </Stack>
            </Stack>
          )}
        </Stack>
      </ScrollView>

      {/* 输入区域 */}
      <Stack 
        p="$4" 
        borderTopWidth={1} 
        borderTopColor="$borderSubdued"
        bg="$bgApp"
      >
        <Stack flexDirection="row" space="$2">
          <Input
            flex={1}
            value={inputText}
            onChangeText={setInputText}
            placeholder="输入您的问题..."
            onSubmitEditing={handleSendMessage}
            returnKeyType="send"
            disabled={isLoading}
          />
          <Button
            onPress={handleSendMessage}
            disabled={!inputText.trim() || isLoading}
            icon="ArrowUpSolid"
            circle
          />
        </Stack>
        
        <Stack flexDirection="row" justifyContent="space-between" mt="$2">
          <Text fontSize="$1" color="$textSubdued">
            {apiStatus === 'connected' ? '✅ 已连接' : 
             apiStatus === 'disconnected' ? '❌ 未连接' : 
             '🔄 检查连接...'}
          </Text>
          <Text fontSize="$1" color="$textSubdued">
            按 Enter 发送
          </Text>
        </Stack>
      </Stack>
    </Stack>
  );
}