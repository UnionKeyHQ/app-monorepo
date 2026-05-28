import { Message } from './types';
import { processMessageWithWebSearch, testWebSearch } from './webSearchService';

// DeepSeek API配置 - 支持环境变量和硬编码配置
const DEEPSEEK_CONFIG = {
  // 优先使用环境变量，否则使用硬编码值
  baseUrl: process.env.REACT_APP_DEEPSEEK_BASE_URL || 'https://api.deepseek.com',
  apiKey: process.env.REACT_APP_DEEPSEEK_API_KEY || 'sk-1536d8e4533a48a4bc7d59753db1ca6b',
  defaultModel: process.env.REACT_APP_DEEPSEEK_MODEL || 'deepseek-chat',
  defaultTemperature: parseFloat(process.env.REACT_APP_DEEPSEEK_TEMPERATURE || '0.7'),
  defaultMaxTokens: parseInt(process.env.REACT_APP_DEEPSEEK_MAX_TOKENS || '2000'),
};

// 构建完整的API URL
const getApiUrl = () => {
  return `${DEEPSEEK_CONFIG.baseUrl}/v1/chat/completions`;
};

// 检查API配置
console.log('🔧 DeepSeek API配置:', {
  baseUrl: DEEPSEEK_CONFIG.baseUrl,
  apiKey: DEEPSEEK_CONFIG.apiKey ? '已设置（部分隐藏）' : '未设置',
  model: DEEPSEEK_CONFIG.defaultModel,
  source: process.env.REACT_APP_DEEPSEEK_API_KEY ? '环境变量' : '硬编码',
  temperature: DEEPSEEK_CONFIG.defaultTemperature,
  maxTokens: DEEPSEEK_CONFIG.defaultMaxTokens,
});

// 验证配置
if (!DEEPSEEK_CONFIG.apiKey || DEEPSEEK_CONFIG.apiKey.includes('your_api_key')) {
  console.warn('⚠️ 警告: API密钥未正确配置！');
} else {
  console.log('✅ API配置验证通过');
}

// 连接到真实的DeepSeek API，集成网络搜索功能
export const getAgentResponse = async (
  messages: Message[],
  config?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    enableWebSearch?: boolean; // 新增：是否启用网络搜索
  }
): Promise<string> => {
  try {
    // 获取最后一条用户消息
    const lastUserMessage = messages.filter(msg => msg.role === 'user').pop();
    
    // 如果启用网络搜索，先尝试获取实时信息
    if (config?.enableWebSearch !== false && lastUserMessage) {
      console.log('🔍 检查是否需要网络搜索:', lastUserMessage.content.substring(0, 50));
      
      try {
        const webSearchResult = await processMessageWithWebSearch(lastUserMessage.content);
        
        if (webSearchResult) {
          console.log('✅ 使用网络搜索结果');
          return webSearchResult;
        } else {
          console.log('ℹ️ 不需要网络搜索，使用AI处理');
        }
      } catch (webSearchError) {
        console.warn('⚠️ 网络搜索失败，继续使用AI:', webSearchError);
        // 网络搜索失败不影响AI处理
      }
    }

    // 准备API请求数据
    const requestData = {
      model: config?.model || DEEPSEEK_CONFIG.defaultModel,
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
      temperature: config?.temperature || DEEPSEEK_CONFIG.defaultTemperature,
      max_tokens: config?.maxTokens || DEEPSEEK_CONFIG.defaultMaxTokens,
      stream: false,
    };

    const apiUrl = getApiUrl();
    
    console.log('📤 调用DeepSeek API:', {
      baseUrl: DEEPSEEK_CONFIG.baseUrl,
      apiUrl: apiUrl,
      model: requestData.model,
      messageCount: requestData.messages.length,
      lastMessage: messages[messages.length - 1]?.content?.substring(0, 50) + '...',
    });

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_CONFIG.apiKey}`,
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('DeepSeek API错误:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });
      
      throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // 提取AI响应
    const aiResponse = data.choices?.[0]?.message?.content;
    
    if (!aiResponse) {
      console.error('API响应格式异常:', data);
      throw new Error('API返回了空的响应');
    }

    console.log('DeepSeek API响应成功，字符数:', aiResponse.length);
    return aiResponse;

  } catch (error) {
    console.error('获取AI响应失败:', error);
    
    // 提供友好的错误信息
    if (error instanceof Error) {
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        return '网络连接失败，请检查网络连接后重试。';
      } else if (error.message.includes('401') || error.message.includes('403')) {
        return 'API密钥无效或已过期，请检查API配置。';
      } else if (error.message.includes('429')) {
        return '请求过于频繁，请稍后再试。';
      } else if (error.message.includes('500') || error.message.includes('503')) {
        return 'AI服务暂时不可用，请稍后再试。';
      }
    }
    
    return '抱歉，暂时无法处理您的请求。请稍后重试或检查API配置。';
  }
};

// 生成消息ID
export const generateMessageId = (): string => {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// 生成会话ID
export const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// 测试API连接
export const testAPIConnection = async (): Promise<{
  success: boolean;
  message: string;
  model?: string;
}> => {
  try {
    const testMessage = 'Hello, are you working?';
    const apiUrl = getApiUrl();
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_CONFIG.apiKey}`,
      },
      body: JSON.stringify({
        model: DEEPSEEK_CONFIG.defaultModel,
        messages: [{ role: 'user', content: testMessage }],
        temperature: 0.7,
        max_tokens: 100,
      }),
    });

    if (!response.ok) {
      return {
        success: false,
        message: `API连接失败: ${response.status} ${response.statusText}`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      message: 'API连接成功！',
      model: data.model,
    };
  } catch (error) {
    return {
      success: false,
      message: `连接错误: ${error instanceof Error ? error.message : '未知错误'}`,
    };
  }
};