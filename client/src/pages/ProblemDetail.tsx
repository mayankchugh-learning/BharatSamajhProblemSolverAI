import { useAuth } from "@/hooks/use-auth";
import { useProblem } from "@/hooks/use-problems";
import { useDiscussionMessages, useSendMessage } from "@/hooks/use-discussion";
import { useDocumentHead } from "@/hooks/use-document-head";
import { SocialShare } from "@/components/SocialShare";
import { BrandLogo } from "@/components/BrandLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Send,
  Loader2,
  MessageSquare,
  Bot,
  User as UserIcon,
  Globe,
  Camera,
  Paperclip,
  X,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import { useLocation } from "wouter";
import { useRef, useEffect, useState, useCallback } from "react";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { type DiscussionMessage, type Attachment, SUPPORTED_LANGUAGES, type SupportedLanguage } from "@shared/schema";

interface ProblemDetailProps {
  id: string;
}

function parseAttachments(attachmentsJson: string | null | undefined): Attachment[] {
  if (!attachmentsJson) return [];
  try {
    return JSON.parse(attachmentsJson);
  } catch {
    return [];
  }
}

function AttachmentDisplay({ attachment }: { attachment: Attachment }) {
  const isImage = attachment.mimeType.startsWith("image/");

  if (isImage) {
    return (
      <a href={attachment.url} target="_blank" rel="noopener noreferrer" className="block">
        <img
          src={attachment.url}
          alt={attachment.originalName}
          className="max-w-[240px] max-h-[200px] rounded-lg object-cover border cursor-pointer hover:opacity-90 transition-opacity"
          loading="lazy"
        />
      </a>
    );
  }

  return (
    <a
      href={attachment.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-background/50 hover:bg-background/80 transition-colors max-w-[240px]"
    >
      <FileText className="w-4 h-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium truncate">{attachment.originalName}</p>
        <p className="text-[10px] text-muted-foreground">
          {(attachment.size / 1024).toFixed(1)} KB
        </p>
      </div>
    </a>
  );
}

function ChatBubble({ message, isLast }: { message: DiscussionMessage; isLast: boolean }) {
  const isUser = message.role === "user";
  const attachments = parseAttachments(message.attachments);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-secondary-foreground"
        }`}
      >
        {isUser ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-primary text-primary-foreground rounded-tr-sm"
            : "bg-muted rounded-tl-sm"
        }`}
      >
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {attachments.map((att, i) => (
              <AttachmentDisplay key={i} attachment={att} />
            ))}
          </div>
        )}
        {message.content && (
          <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
        )}
        <p
          className={`text-[10px] mt-1.5 ${
            isUser ? "text-primary-foreground/60" : "text-muted-foreground/60"
          }`}
        >
          {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
        </p>
      </div>
    </motion.div>
  );
}

interface PendingFile {
  file: File;
  preview: string | null;
}

function AttachmentPreview({ pending, onRemove }: { pending: PendingFile; onRemove: () => void }) {
  const isImage = pending.file.type.startsWith("image/");

  return (
    <div className="relative group">
      {isImage && pending.preview ? (
        <img
          src={pending.preview}
          alt={pending.file.name}
          className="w-16 h-16 rounded-lg object-cover border"
        />
      ) : (
        <div className="w-16 h-16 rounded-lg border bg-muted flex flex-col items-center justify-center gap-1 px-1">
          <FileText className="w-5 h-5 text-muted-foreground" />
          <span className="text-[8px] text-muted-foreground truncate w-full text-center">
            {pending.file.name.split(".").pop()?.toUpperCase()}
          </span>
        </div>
      )}
      <button
        onClick={onRemove}
        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
        type="button"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}

export default function ProblemDetail({ id }: ProblemDetailProps) {
  const problemId = Number(id);
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { data: problem, isLoading: problemLoading } = useProblem(problemId);
  const { data: messages, isLoading: messagesLoading } = useDiscussionMessages(problemId);
  const sendMessage = useSendMessage(problemId);
  const [input, setInput] = useState("");
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useDocumentHead({
    title: problem?.title || "Problem Detail",
    description: problem?.description?.slice(0, 155) || "View AI-powered solution for your problem on BharatSolve AI.",
    canonicalPath: `/problems/${id}`,
    noIndex: true,
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, sendMessage.isPending]);

  useEffect(() => {
    return () => {
      pendingFiles.forEach((pf) => {
        if (pf.preview) URL.revokeObjectURL(pf.preview);
      });
    };
  }, []);

  const addFiles = useCallback((fileList: FileList | null) => {
    if (!fileList) return;
    const newFiles: PendingFile[] = Array.from(fileList).map((file) => ({
      file,
      preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
    }));
    setPendingFiles((prev) => {
      const combined = [...prev, ...newFiles].slice(0, 5);
      return combined;
    });
  }, []);

  const removeFile = useCallback((index: number) => {
    setPendingFiles((prev) => {
      const removed = prev[index];
      if (removed?.preview) URL.revokeObjectURL(removed.preview);
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const handleSend = () => {
    const trimmed = input.trim();
    if ((!trimmed && pendingFiles.length === 0) || sendMessage.isPending) return;

    const files = pendingFiles.map((pf) => pf.file);
    setInput("");
    setPendingFiles([]);
    sendMessage.mutate({ content: trimmed, files: files.length > 0 ? files : undefined });

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 150) + "px";
  };

  if (problemLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <p className="text-muted-foreground">Problem not found</p>
        <Button variant="outline" onClick={() => navigate("/")}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Button>
      </div>
    );
  }

  const isSolved = problem.status === "solved" && problem.solution;
  const langKey = (problem.language || "english") as SupportedLanguage;
  const langInfo = SUPPORTED_LANGUAGES[langKey];
  const canSend = (input.trim().length > 0 || pendingFiles.length > 0) && !sendMessage.isPending;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-14 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="shrink-0"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <BrandLogo size="sm" className="hidden sm:flex shrink-0" />
          <Separator orientation="vertical" className="h-6 hidden sm:block" />
          <div className="min-w-0 flex-1">
            <h1 className="text-sm font-semibold truncate">{problem.title}</h1>
            <div className="flex items-center gap-2">
              {isSolved ? (
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200 text-[10px] px-1.5 py-0"
                >
                  <CheckCircle2 className="w-2.5 h-2.5 mr-0.5" />
                  Solved
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="bg-yellow-50 text-yellow-700 border-yellow-200 text-[10px] px-1.5 py-0"
                >
                  <Clock className="w-2.5 h-2.5 mr-0.5" />
                  Pending
                </Badge>
              )}
              {langKey !== "english" && langInfo && (
                <Badge
                  variant="secondary"
                  className="text-[10px] px-1.5 py-0 h-4 font-normal"
                >
                  <Globe className="w-2.5 h-2.5 mr-0.5" />
                  {langInfo.nativeLabel}
                </Badge>
              )}
              <span className="text-[10px] text-muted-foreground">
                {problem.createdAt &&
                  formatDistanceToNow(new Date(problem.createdAt), {
                    addSuffix: true,
                  })}
              </span>
            </div>
          </div>
          <SocialShare
            title={`BharatSolve AI helped me solve: ${problem.title}`}
            description="Get AI-powered solutions for life's challenges — culturally aware & in 12 Indian languages!"
            url="https://bharatsolve.ai"
            variant="ghost"
            size="icon"
          />
        </div>
      </header>

      {/* Main chat area */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-[calc(100vh-14rem)]">
          <div className="container mx-auto px-4 py-6 max-w-3xl space-y-6">
            {/* Original problem context */}
            <div className="bg-muted/40 border rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <MessageSquare className="w-4 h-4" />
                Original Problem
              </div>
              <div>
                <h2 className="text-lg font-bold mb-2">{problem.title}</h2>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {problem.description}
                </p>
              </div>
            </div>

            {/* Initial AI solution */}
            {isSolved && (
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="max-w-[85%] bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
                  <p className="text-xs font-medium text-secondary mb-2">
                    Initial AI Solution
                  </p>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    {problem.solution}
                  </p>
                </div>
              </div>
            )}

            {/* Discussion separator */}
            {messages && messages.length > 0 && (
              <div className="flex items-center gap-3 py-2">
                <Separator className="flex-1" />
                <span className="text-xs text-muted-foreground font-medium shrink-0">
                  Discussion
                </span>
                <Separator className="flex-1" />
              </div>
            )}

            {/* Discussion messages */}
            {messagesLoading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <AnimatePresence>
                <div className="space-y-4">
                  {messages?.map((msg, i) => (
                    <ChatBubble
                      key={msg.id}
                      message={msg}
                      isLast={i === messages.length - 1}
                    />
                  ))}
                </div>
              </AnimatePresence>
            )}

            {/* AI thinking indicator */}
            {sendMessage.isPending && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    AI is thinking...
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Input area */}
      <div className="border-t bg-background/80 backdrop-blur">
        <div className="container mx-auto px-4 py-3 max-w-3xl">
          {/* Attachment previews */}
          {pendingFiles.length > 0 && (
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              {pendingFiles.map((pf, i) => (
                <AttachmentPreview key={i} pending={pf} onRemove={() => removeFile(i)} />
              ))}
              {pendingFiles.length >= 5 && (
                <span className="text-[10px] text-muted-foreground ml-1">Max 5 files</span>
              )}
            </div>
          )}

          <div className="flex items-end gap-2">
            {/* Hidden file inputs */}
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => {
                addFiles(e.target.files);
                e.target.value = "";
              }}
            />
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.csv,.txt"
              className="hidden"
              onChange={(e) => {
                addFiles(e.target.files);
                e.target.value = "";
              }}
            />

            {/* Camera button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 shrink-0 text-muted-foreground hover:text-foreground"
              onClick={() => cameraInputRef.current?.click()}
              disabled={sendMessage.isPending || pendingFiles.length >= 5}
              title="Take photo"
              type="button"
            >
              <Camera className="w-5 h-5" />
            </Button>

            {/* File upload button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 shrink-0 text-muted-foreground hover:text-foreground"
              onClick={() => fileInputRef.current?.click()}
              disabled={sendMessage.isPending || pendingFiles.length >= 5}
              title="Attach files"
              type="button"
            >
              <Paperclip className="w-5 h-5" />
            </Button>

            {/* Text input */}
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleTextareaInput}
                onKeyDown={handleKeyDown}
                placeholder="Ask a follow-up question or discuss further..."
                className="w-full resize-none rounded-xl border border-input bg-background px-4 py-3 pr-12 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[48px] max-h-[150px]"
                rows={1}
                disabled={sendMessage.isPending}
              />
            </div>

            {/* Send button */}
            <Button
              size="icon"
              className="h-12 w-12 rounded-xl shrink-0"
              onClick={handleSend}
              disabled={!canSend}
            >
              {sendMessage.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground mt-2 text-center">
            Press Enter to send, Shift+Enter for new line. Attach photos or files to share with AI.
          </p>
        </div>
      </div>
    </div>
  );
}
