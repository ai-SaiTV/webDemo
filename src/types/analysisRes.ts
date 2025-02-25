export interface analysisRes {
    id: string
    timestamp: number
    conversation: {
        messages: {                    // user/agent messages
            role: 'user' | 'assistant'
            content: string
            timestamp: number
        }[]
    },
    analysis: string
    
  }