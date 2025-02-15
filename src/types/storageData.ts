export interface StorageData {
    id: string
    timestamp: number
    conversation: {
        messages: {                    // user/agent messages
            role: 'user' | 'assistant'
            content: string
            timestamp: number
        }[]
    }
    resources: {
        // 1. 教案纯文本
        teaching_plan: {
            text: string,
        },

        // 2. 思维导图
        tp_MindMap: {
            url: string
        },

        // 3. 课程资源
        courseware: {
            videos: {
                name: string,
                url: string
            }[],

            Courseware: {
                name: string,
                url: string
            }[],

            exercises: {
                name: string,
                url: string
            }[]
        },
    }
    metadata: {
        status: 'pending' | 'completed' | 'failed'
        lastUpdate: number
        version: string
    }
  }