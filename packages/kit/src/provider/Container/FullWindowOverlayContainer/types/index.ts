export interface Message {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp: Date;
  }
  
  export interface ChatSession {
    id: string;
    title: string;
    messages: Message[];
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface AgentConfig {
    name: string;
    description: string;
    model: string;
    temperature: number;
    maxTokens: number;
    systemPrompt: string;
  }