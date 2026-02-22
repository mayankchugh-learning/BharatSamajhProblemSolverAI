import { isUsingDatabase, db } from "../../db";
import { conversations, messages } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IChatStorage {
  getConversation(id: number): Promise<any | undefined>;
  getAllConversations(): Promise<any[]>;
  createConversation(title: string): Promise<any>;
  deleteConversation(id: number): Promise<void>;
  getMessagesByConversation(conversationId: number): Promise<any[]>;
  createMessage(conversationId: number, role: string, content: string): Promise<any>;
}

class MemoryChatStorage implements IChatStorage {
  private convos: any[] = [];
  private msgs: any[] = [];
  private nextConvoId = 1;
  private nextMsgId = 1;

  async getConversation(id: number) {
    return this.convos.find((c) => c.id === id);
  }

  async getAllConversations() {
    return [...this.convos].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createConversation(title: string) {
    const convo = { id: this.nextConvoId++, title, createdAt: new Date() };
    this.convos.push(convo);
    return convo;
  }

  async deleteConversation(id: number) {
    this.msgs = this.msgs.filter((m) => m.conversationId !== id);
    this.convos = this.convos.filter((c) => c.id !== id);
  }

  async getMessagesByConversation(conversationId: number) {
    return this.msgs
      .filter((m) => m.conversationId === conversationId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async createMessage(conversationId: number, role: string, content: string) {
    const msg = { id: this.nextMsgId++, conversationId, role, content, createdAt: new Date() };
    this.msgs.push(msg);
    return msg;
  }
}

class DatabaseChatStorage implements IChatStorage {
  async getConversation(id: number) {
    const [conversation] = await db.select().from(conversations).where(eq(conversations.id, id));
    return conversation;
  }

  async getAllConversations() {
    return db.select().from(conversations).orderBy(desc(conversations.createdAt));
  }

  async createConversation(title: string) {
    const [conversation] = await db.insert(conversations).values({ title }).returning();
    return conversation;
  }

  async deleteConversation(id: number) {
    await db.delete(messages).where(eq(messages.conversationId, id));
    await db.delete(conversations).where(eq(conversations.id, id));
  }

  async getMessagesByConversation(conversationId: number) {
    return db.select().from(messages).where(eq(messages.conversationId, conversationId)).orderBy(messages.createdAt);
  }

  async createMessage(conversationId: number, role: string, content: string) {
    const [message] = await db.insert(messages).values({ conversationId, role, content }).returning();
    return message;
  }
}

export const chatStorage: IChatStorage = isUsingDatabase
  ? new DatabaseChatStorage()
  : new MemoryChatStorage();
