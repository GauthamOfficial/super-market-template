"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function ContactForm() {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate submit — replace with your API route or server action when ready
    await new Promise((r) => setTimeout(r, 600));
    setSubmitting(false);
    setFormData({ name: "", email: "", phone: "", message: "" });
    toast({
      title: "Message sent",
      description: "Thank you for reaching out. We'll get back to you within 24 hours.",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="contact-name">Full Name *</Label>
        <Input
          id="contact-name"
          name="name"
          type="text"
          required
          placeholder="Your name"
          value={formData.name}
          onChange={handleChange}
          className="h-11"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact-phone">Phone *</Label>
        <Input
          id="contact-phone"
          name="phone"
          type="tel"
          required
          placeholder="Your phone number"
          value={formData.phone}
          onChange={handleChange}
          className="h-11"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact-email">Email *</Label>
        <Input
          id="contact-email"
          name="email"
          type="email"
          required
          placeholder="your@email.com"
          value={formData.email}
          onChange={handleChange}
          className="h-11"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact-message">Message *</Label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          placeholder="How can we help you?"
          value={formData.message}
          onChange={handleChange}
          className={cn(
            "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[120px] resize-y"
          )}
        />
      </div>
      <Button type="submit" size="lg" disabled={submitting} className="w-full gap-2">
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          "Send Message"
        )}
      </Button>
    </form>
  );
}
