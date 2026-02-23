import type { Express, Request, Response, RequestHandler } from "express";
import OpenAI from "openai";
import { chatStorage } from "./storage";
import { logger } from "../../utils/logger";

const apiKey = process.env.OPENAI_API_KEY || process.env.AI_INTEGRATIONS_OPENAI_API_KEY;
const openai = apiKey
  ? new OpenAI({
      apiKey,
      ...(process.env.AI_INTEGRATIONS_OPENAI_BASE_URL && {
        baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
      }),
    })
  : null;

export function registerChatRoutes(app: Express, auth: RequestHandler): void {
  app.get("/api/v1/conversations", auth, async (req: Request, res: Response) => {
    try {
      const conversations = await chatStorage.getAllConversations();
      res.json(conversations);
    } catch (error) {
      req.log?.error({ err: error }, "Error fetching conversations") ?? logger.error({ err: error }, "Error fetching conversations");
      res.status(500).json({ error: "Failed to fetch conversations" });
    }
  });

  app.get("/api/v1/conversations/:id", auth, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id as string, 10);
      const conversation = await chatStorage.getConversation(id);
      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }
      const messages = await chatStorage.getMessagesByConversation(id);
      res.json({ ...conversation, messages });
    } catch (error) {
      req.log?.error({ err: error }, "Error fetching conversation") ?? logger.error({ err: error }, "Error fetching conversation");
      res.status(500).json({ error: "Failed to fetch conversation" });
    }
  });

  app.post("/api/v1/conversations", auth, async (req: Request, res: Response) => {
    try {
      const { title } = req.body;
      const conversation = await chatStorage.createConversation(title || "New Chat");
      res.status(201).json(conversation);
    } catch (error) {
      req.log?.error({ err: error }, "Error creating conversation") ?? logger.error({ err: error }, "Error creating conversation");
      res.status(500).json({ error: "Failed to create conversation" });
    }
  });

  app.delete("/api/v1/conversations/:id", auth, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id as string, 10);
      await chatStorage.deleteConversation(id);
      res.status(204).send();
    } catch (error) {
      req.log?.error({ err: error }, "Error deleting conversation") ?? logger.error({ err: error }, "Error deleting conversation");
      res.status(500).json({ error: "Failed to delete conversation" });
    }
  });

  app.post("/api/v1/conversations/:id/messages", auth, async (req: Request, res: Response) => {
    try {
      if (!openai) {
        return res.status(503).json({
          error: "AI chat is not configured. Set OPENAI_API_KEY or AI_INTEGRATIONS_OPENAI_API_KEY in .env",
        });
      }

      const conversationId = parseInt(req.params.id as string, 10);
      const { content } = req.body;

      // Save user message
      await chatStorage.createMessage(conversationId, "user", content);

      // Get conversation history for context
      const messages = await chatStorage.getMessagesByConversation(conversationId);
      const chatMessages = messages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

      // Set up SSE
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      // Stream response from OpenAI
      const stream = await openai.chat.completions.create({
        model: "gpt-5.1",
        messages: chatMessages,
        stream: true,
        max_completion_tokens: 8192,
      });

      let fullResponse = "";

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        if (content) {
          fullResponse += content;
          res.write(`data: ${JSON.stringify({ content })}\n\n`);
        }
      }

      // Save assistant message
      await chatStorage.createMessage(conversationId, "assistant", fullResponse);

      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    } catch (error) {
      req.log?.error({ err: error }, "Error sending message") ?? logger.error({ err: error }, "Error sending message");
      // Check if headers already sent (SSE streaming started)
      if (res.headersSent) {
        res.write(`data: ${JSON.stringify({ error: "Failed to send message" })}\n\n`);
        res.end();
      } else {
        res.status(500).json({ error: "Failed to send message" });
      }
    }
  });
}

