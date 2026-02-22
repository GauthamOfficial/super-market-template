"use client";

import { useState } from "react";
import { MessageCircle, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getWhatsAppDeepLink } from "@/lib/orderWhatsApp";

interface OrderWhatsAppButtonsProps {
  /** Formatted order summary message to send or copy */
  message: string;
  /** Shop WhatsApp number (digits only). If null, only Copy is offered. */
  whatsappNumber: string | null;
}

export function OrderWhatsAppButtons({ message, whatsappNumber }: OrderWhatsAppButtonsProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "Paste the message in WhatsApp or any chat.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const href = whatsappNumber ? getWhatsAppDeepLink(whatsappNumber, message) : null;

  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-center">
      {href && (
        <Button asChild variant="default" size="lg" className="gap-2">
          <a href={href} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="h-4 w-4" />
            Send to Shop
          </a>
        </Button>
      )}
      <Button
        type="button"
        variant={href ? "outline" : "default"}
        size="lg"
        onClick={handleCopy}
        className="gap-2"
      >
        <Copy className="h-4 w-4" />
        {copied ? "Copied!" : "Copy Message"}
      </Button>
    </div>
  );
}
