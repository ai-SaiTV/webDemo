import { ref } from 'vue'
import type { StorageData } from '@/types/storageData'

export class StorageService {
  private data = ref<StorageData[]>([])
  
  // 创建新会话
  async createSession(): Promise<string> {

    // 对接口内容直接初始化赋值
    const newSession: StorageData = {
      id: Date.now().toString(),  //用时间戳作为id
      timestamp: Date.now(),      
      conversation: { messages: [] },
      resources: { 
        teaching_plan: { text: '', downLoad_url: '' },
        tp_MindMap: { url: '' },
        courseware: { videos: [], images: [], exercises: [] }
      },
      metadata: {
        status: 'pending',
        lastUpdate: Date.now(),
        version: '1.0'
      }
    }


    this.data.value.push(newSession)
    await this.saveToFile()
    return newSession.id
  }

  // 更新消息
  async updateMessages(sessionId: string, message: { role: 'user' | 'assistant', content: string }) {
    const session = this.data.value.find(s => s.id === sessionId)
    if (session) {
      session.conversation.messages.push({
        ...message,
        timestamp: Date.now()
      })
      session.metadata.lastUpdate = Date.now()
      await this.saveToFile()
    }
  }

   // 更新教案资源
   async updateTeachingPlan(sessionId: string, data: { text: string, downLoad_url: string }) {
    const session = this.data.value.find(s => s.id === sessionId)
    if (session) {
      session.resources.teaching_plan = {
        text: data.text,
        downLoad_url: data.downLoad_url
      }
      session.metadata.lastUpdate = Date.now()
      await this.saveToFile()
    }
  }

  // 更新课件资源
  async updateCourseware(sessionId: string, data: {
    videos?: { name: string, url: string }[],
    images?: { name: string, url: string }[],
    exercises?: { name: string, url: string }[]
  }) {
    const session = this.data.value.find(s => s.id === sessionId)
    if (session) {
      if (data.videos) {
        session.resources.courseware.videos = data.videos
      }
      if (data.images) {
        session.resources.courseware.images = data.images
      }
      if (data.exercises) {
        session.resources.courseware.exercises = data.exercises
      }
      session.metadata.lastUpdate = Date.now()
      await this.saveToFile()
    }
  }

   // 获取指定会话数据
   async getSessionData(sessionId: string): Promise<StorageData | null> {
    try {
        // 从本地存储获取数据
        const session = this.data.value.find(s => s.id === sessionId);
        
        // 打印调试信息
        console.log('获取会话数据:', sessionId, session);
        
        return session || null;
    } catch (error) {
        console.error('获取会话数据失败:', error);
        return null;
    }
}


  // 保存到文件
  private async saveToFile() {
    try {
      localStorage.setItem('chat-storage', JSON.stringify(this.data.value))
    } catch (error) {
      console.error('Save failed:', error)
    }
  }

  // 加载数据
  async loadData() {
    const saved = localStorage.getItem('chat-storage')
    if (saved) {
      this.data.value = JSON.parse(saved)
    }
  }
}

export const storageService = new StorageService()