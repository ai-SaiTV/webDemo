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
        teaching_plan: { text: '' },
        class_design: { text: '' },
        tp_MindMap: { url: '' },
        courseware: { videos: [], Courseware: [], exercises: [] }
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
  async updateTeachingPlan(sessionId: string, data: { text: string, }) {
    console.log('更新教案资源:', sessionId, data)
    const session = this.data.value.find(s => s.id === sessionId)
    if (session) {
      session.resources.teaching_plan = {
        text: data.text,
      }
      session.metadata.lastUpdate = Date.now()
      await this.saveToFile()
    }
  }

  // 更新课堂设计
  async updateClassDesign(sessionId: string, data: { text: string, }) {
    console.log('更新课堂设计:', sessionId, data)
    const session = this.data.value.find(s => s.id === sessionId)
    if (session) {
      session.resources.class_design = {
        text: data.text,
      }
      session.metadata.lastUpdate = Date.now()
      await this.saveToFile()
    }
  }


  // 更新思维导图资源
  async updateTeachingMindMap(sessionId: string, data: { url: string, }) {
    console.log('更新思维导图资源:', sessionId, data)
    const session = this.data.value.find(s => s.id === sessionId)
    if (session) {
      session.resources.tp_MindMap = {
        url: data.url,
      }
      session.metadata.lastUpdate = Date.now()
      await this.saveToFile()
    }
  }

  // 更新课件资源
  async updateCourseware(sessionId: string, data: {
    videos?: { name: string, url: string }[],
    Courseware?: { name: string, url: string }[],
    exercises?: { name: string, url: string }[]
  }) {
    console.log('更新课件资源:', sessionId, data)
    const session = this.data.value.find(s => s.id === sessionId)
    if (session) {
      if (data.videos) {
        session.resources.courseware.videos = data.videos
      }
      if (data.Courseware) {
        session.resources.courseware.Courseware = data.Courseware
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
        let session: StorageData | undefined;
        
        // 如果 sessionId 为 "0"，获取最后一条数据
        if (sessionId === "0") {
            session = this.data.value[this.data.value.length - 1];
        } else {
            // 否则按 id 查找
            session = this.data.value.find(s => s.id === sessionId);
        }
        
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