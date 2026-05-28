/**
 * 网络搜索服务
 * 提供实时网络搜索功能，用于获取比特币价格等实时信息
 */

// 配置
const SEARCH_CONFIG = {
  // 使用DuckDuckGo即时答案API（无需API密钥）
  duckDuckGoUrl: 'https://api.duckduckgo.com/',
  
  // 备用搜索API
  googleSearchUrl: 'https://www.google.com/search',
  
  // 加密货币API
  cryptoApiUrl: 'https://api.coingecko.com/api/v3/simple/price',
  
  // 新闻API
  newsApiUrl: 'https://newsapi.org/v2/everything',
  
  // 请求超时时间（毫秒）
  timeout: 10000,
};

// 搜索关键词检测
const SEARCH_KEYWORDS = {
  crypto: ['比特币', 'bitcoin', 'btc', '以太坊', 'ethereum', 'eth', '加密货币', 'crypto'],
  price: ['价格', 'price', '多少钱', 'current price', '实时价格'],
  news: ['新闻', 'news', '最新消息', '最近'],
  weather: ['天气', 'weather', '温度', 'temperature'],
  stock: ['股票', 'stock', '股市', '股价'],
};

/**
 * 检测是否需要网络搜索
 */
export function needsWebSearch(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  
  // 检查是否包含搜索关键词
  const allKeywords = [
    ...SEARCH_KEYWORDS.crypto,
    ...SEARCH_KEYWORDS.price,
    ...SEARCH_KEYWORDS.news,
    ...SEARCH_KEYWORDS.weather,
    ...SEARCH_KEYWORDS.stock,
    '实时', '最新', '今天', '现在', 'current', 'latest', 'today', 'now'
  ];
  
  return allKeywords.some(keyword => 
    lowerMessage.includes(keyword.toLowerCase())
  );
}

/**
 * 获取比特币实时价格
 */
export async function getBitcoinPrice(): Promise<string> {
  try {
    const response = await fetch(
      `${SEARCH_CONFIG.cryptoApiUrl}?ids=bitcoin&vs_currencies=usd,cny&include_24hr_change=true`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'OpenClaw-AI-Chat/1.0',
        },
        signal: AbortSignal.timeout(SEARCH_CONFIG.timeout),
      }
    );
    
    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.bitcoin) {
      const btc = data.bitcoin;
      const usdPrice = btc.usd.toLocaleString('en-US', { 
        style: 'currency', 
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
      
      const cnyPrice = btc.cny.toLocaleString('zh-CN', { 
        style: 'currency', 
        currency: 'CNY',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
      
      const change24h = btc.usd_24h_change?.toFixed(2) || '0.00';
      const changeEmoji = parseFloat(change24h) >= 0 ? '📈' : '📉';
      
      return `💰 **比特币实时价格**\n\n` +
             `💵 美元: ${usdPrice}\n` +
             `🇨🇳 人民币: ${cnyPrice}\n` +
             `${changeEmoji} 24小时变化: ${change24h}%\n\n` +
             `📊 数据来源: CoinGecko API\n` +
             `⏰ 更新时间: ${new Date().toLocaleString('zh-CN')}`;
    } else {
      throw new Error('未找到比特币价格数据');
    }
    
  } catch (error) {
    console.error('获取比特币价格失败:', error);
    return `⚠️ 无法获取比特币实时价格\n\n` +
           `错误信息: ${error.message}\n` +
           `请稍后重试或访问: https://www.coingecko.com/zh`;
  }
}

/**
 * 使用DuckDuckGo搜索
 */
export async function searchWeb(query: string): Promise<string> {
  try {
    const response = await fetch(
      `${SEARCH_CONFIG.duckDuckGoUrl}?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'OpenClaw-AI-Chat/1.0',
        },
        signal: AbortSignal.timeout(SEARCH_CONFIG.timeout),
      }
    );
    
    if (!response.ok) {
      throw new Error(`搜索请求失败: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // 解析DuckDuckGo响应
    let result = `🔍 **搜索结果: "${query}"**\n\n`;
    
    if (data.AbstractText) {
      result += `📖 **摘要**: ${data.AbstractText}\n\n`;
    }
    
    if (data.AbstractURL) {
      result += `🔗 **来源**: ${data.AbstractURL}\n\n`;
    }
    
    if (data.RelatedTopics && data.RelatedTopics.length > 0) {
      result += `📚 **相关内容**:\n`;
      data.RelatedTopics.slice(0, 3).forEach((topic: any, index: number) => {
        if (topic.Text) {
          result += `${index + 1}. ${topic.Text}\n`;
        }
      });
      result += '\n';
    }
    
    if (!data.AbstractText && (!data.RelatedTopics || data.RelatedTopics.length === 0)) {
      result += `⚠️ 未找到相关信息\n\n`;
    }
    
    result += `🌐 **搜索来源**: DuckDuckGo Instant Answers\n`;
    result += `⏰ **搜索时间**: ${new Date().toLocaleString('zh-CN')}`;
    
    return result;
    
  } catch (error) {
    console.error('网络搜索失败:', error);
    return `⚠️ 网络搜索失败\n\n` +
           `错误信息: ${error.message}\n` +
           `请尝试:\n` +
           `1. 检查网络连接\n` +
           `2. 稍后重试\n` +
           `3. 直接访问: https://duckduckgo.com/?q=${encodeURIComponent(query)}`;
  }
}

/**
 * 获取加密货币价格
 */
export async function getCryptoPrice(cryptoName: string): Promise<string> {
  const cryptoMap: Record<string, string> = {
    '比特币': 'bitcoin',
    'bitcoin': 'bitcoin',
    'btc': 'bitcoin',
    '以太坊': 'ethereum',
    'ethereum': 'ethereum',
    'eth': 'ethereum',
    '狗狗币': 'dogecoin',
    'dogecoin': 'dogecoin',
    'doge': 'dogecoin',
    '瑞波币': 'ripple',
    'ripple': 'ripple',
    'xrp': 'ripple',
    '莱特币': 'litecoin',
    'litecoin': 'litecoin',
    'ltc': 'litecoin',
  };
  
  const cryptoId = cryptoMap[cryptoName.toLowerCase()] || cryptoName.toLowerCase();
  
  try {
    const response = await fetch(
      `${SEARCH_CONFIG.cryptoApiUrl}?ids=${cryptoId}&vs_currencies=usd,cny&include_24hr_change=true`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'OpenClaw-AI-Chat/1.0',
        },
        signal: AbortSignal.timeout(SEARCH_CONFIG.timeout),
      }
    );
    
    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data[cryptoId]) {
      const crypto = data[cryptoId];
      const usdPrice = crypto.usd.toLocaleString('en-US', { 
        style: 'currency', 
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
      
      const cnyPrice = crypto.cny.toLocaleString('zh-CN', { 
        style: 'currency', 
        currency: 'CNY',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
      
      const change24h = crypto.usd_24h_change?.toFixed(2) || '0.00';
      const changeEmoji = parseFloat(change24h) >= 0 ? '📈' : '📉';
      
      return `💰 **${cryptoName} 实时价格**\n\n` +
             `💵 美元: ${usdPrice}\n` +
             `🇨🇳 人民币: ${cnyPrice}\n` +
             `${changeEmoji} 24小时变化: ${change24h}%\n\n` +
             `📊 数据来源: CoinGecko API\n` +
             `⏰ 更新时间: ${new Date().toLocaleString('zh-CN')}`;
    } else {
      return `⚠️ 未找到 ${cryptoName} 的价格数据\n\n` +
             `支持的加密货币: 比特币(BTC), 以太坊(ETH), 狗狗币(DOGE), 瑞波币(XRP), 莱特币(LTC)\n` +
             `请访问: https://www.coingecko.com/zh 查看更多`;
    }
    
  } catch (error) {
    console.error('获取加密货币价格失败:', error);
    return `⚠️ 无法获取 ${cryptoName} 实时价格\n\n` +
           `错误信息: ${error.message}\n` +
           `请稍后重试或访问: https://www.coingecko.com/zh`;
  }
}

/**
 * 智能处理消息 - 结合AI和网络搜索
 */
export async function processMessageWithWebSearch(message: string): Promise<string> {
  const lowerMessage = message.toLowerCase();
  
  // 检查特定类型的问题
  if (lowerMessage.includes('比特币') || 
      (lowerMessage.includes('bitcoin') && lowerMessage.includes('价格'))) {
    return await getBitcoinPrice();
  }
  
  // 检查其他加密货币
  const cryptoKeywords = ['以太坊', 'ethereum', 'eth', '狗狗币', 'dogecoin', 'doge', '瑞波币', 'ripple', 'xrp', '莱特币', 'litecoin', 'ltc'];
  for (const crypto of cryptoKeywords) {
    if (lowerMessage.includes(crypto.toLowerCase()) && 
        (lowerMessage.includes('价格') || lowerMessage.includes('price'))) {
      return await getCryptoPrice(crypto);
    }
  }
  
  // 检查是否需要网络搜索
  if (needsWebSearch(message)) {
    try {
      const searchResult = await searchWeb(message);
      return searchResult;
    } catch (error) {
      return `⚠️ 网络搜索功能暂时不可用\n\n` +
             `错误信息: ${error.message}\n\n` +
             `💡 你可以:\n` +
             `1. 稍后重试\n` +
             `2. 直接访问搜索引擎\n` +
             `3. 询问其他不需要实时信息的问题`;
    }
  }
  
  // 不需要网络搜索，返回null让AI处理
  return null;
}

/**
 * 测试网络搜索功能
 */
export async function testWebSearch(): Promise<string> {
  const tests = [
    { query: '比特币价格', expected: 'bitcoin' },
    { query: '今天天气', expected: 'weather' },
    { query: '最新新闻', expected: 'news' },
  ];
  
  let results = '🔧 **网络搜索功能测试**\n\n';
  
  for (const test of tests) {
    try {
      const needsSearch = needsWebSearch(test.query);
      results += `📝 查询: "${test.query}"\n`;
      results += `🔍 需要搜索: ${needsSearch ? '✅ 是' : '❌ 否'}\n`;
      results += `📊 预期类型: ${test.expected}\n`;
      results += '---\n';
    } catch (error) {
      results += `❌ 测试失败: ${error.message}\n`;
      results += '---\n';
    }
  }
  
  // 测试比特币价格API
  try {
    results += '\n💰 **比特币价格API测试**\n';
    const bitcoinPrice = await getBitcoinPrice();
    results += `✅ API连接正常\n`;
    results += `📊 响应包含价格信息: ${bitcoinPrice.includes('美元') ? '✅ 是' : '❌ 否'}\n`;
  } catch (error) {
    results += `❌ 比特币API测试失败: ${error.message}\n`;
  }
  
  results += `\n⏰ 测试时间: ${new Date().toLocaleString('zh-CN')}`;
  
  return results;
}