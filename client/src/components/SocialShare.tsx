import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Share2, Copy, Check } from "lucide-react";
import { FaWhatsapp, FaXTwitter, FaFacebook, FaLinkedin, FaTelegram } from "react-icons/fa6";
import { useState, useRef } from "react";

interface SocialShareProps {
  url?: string;
  title: string;
  description?: string;
  variant?: "ghost" | "outline" | "default";
  size?: "sm" | "default" | "icon";
}

const SHARE_PLATFORMS = [
  {
    name: "WhatsApp",
    icon: FaWhatsapp,
    color: "text-green-600 hover:text-green-700",
    getUrl: (url: string, text: string) =>
      `https://api.whatsapp.com/send?text=${encodeURIComponent(`${text}\n${url}`)}`,
  },
  {
    name: "X (Twitter)",
    icon: FaXTwitter,
    color: "text-foreground hover:text-foreground/80",
    getUrl: (url: string, text: string) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
  },
  {
    name: "Facebook",
    icon: FaFacebook,
    color: "text-blue-600 hover:text-blue-700",
    getUrl: (url: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    name: "LinkedIn",
    icon: FaLinkedin,
    color: "text-blue-700 hover:text-blue-800",
    getUrl: (url: string, text: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  {
    name: "Telegram",
    icon: FaTelegram,
    color: "text-sky-500 hover:text-sky-600",
    getUrl: (url: string, text: string) =>
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
  },
] as const;

export function SocialShare({
  url,
  title,
  description,
  variant = "ghost",
  size = "sm",
}: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const supportsNativeShare = useRef(typeof navigator !== "undefined" && !!navigator.share);
  const shareUrl = url || window.location.href;
  const shareText = description ? `${title} — ${description}` : title;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for HTTP
      const textarea = document.createElement("textarea");
      textarea.value = shareUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClick = async () => {
    if (supportsNativeShare.current) {
      try {
        await navigator.share({ title, text: description, url: shareUrl });
        return;
      } catch {
        // User cancelled — fall through to popover
      }
    }
    setOpen(true);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant={variant} size={size} className="gap-1.5" onClick={handleClick}>
          <Share2 className="w-4 h-4" />
          <span className="hidden sm:inline">Share</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-3" align="end">
        <p className="text-xs font-medium text-muted-foreground mb-3">Share via</p>
        <div className="flex flex-col gap-1">
          {SHARE_PLATFORMS.map((platform) => (
            <a
              key={platform.name}
              href={platform.getUrl(shareUrl, shareText)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-2 py-1.5 rounded-md hover:bg-muted transition-colors text-sm"
            >
              <platform.icon className={`w-4 h-4 ${platform.color}`} />
              {platform.name}
            </a>
          ))}
          <button
            onClick={handleCopy}
            className="flex items-center gap-3 px-2 py-1.5 rounded-md hover:bg-muted transition-colors text-sm w-full text-left"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4 text-muted-foreground" />
            )}
            {copied ? "Copied!" : "Copy link"}
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
