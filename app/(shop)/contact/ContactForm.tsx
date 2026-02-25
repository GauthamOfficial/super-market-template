"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
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
    setSent(true);
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center">
        <CheckCircle2 className="h-14 w-14 sm:h-16 sm:w-16 text-primary mb-4" aria-hidden />
        <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">Message sent</h3>
        <p className="text-muted-foreground text-sm sm:text-base max-w-sm mb-6">
          Thank you for reaching out. We&apos;ll get back to you within 24 hours.
        </p>
        <Button type="button" variant="outline" onClick={() => setSent(false)}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-5">
      <div className="space-y-1.5 sm:space-y-2">
        <Label htmlFor="contact-name" className="text-sm sm:text-base">Full Name</Label>
        <Input
          id="contact-name"
          name="name"
          type="text"
          required
          placeholder="Your name"
          value={formData.name}
          onChange={handleChange}
          className="h-9 sm:h-11"
        />
      </div>
      <div className="space-y-1.5 sm:space-y-2">
        <Label htmlFor="contact-phone" className="text-sm sm:text-base">Phone</Label>
        <Input
          id="contact-phone"
          name="phone"
          type="tel"
          required
          placeholder="Your phone number"
          value={formData.phone}
          onChange={handleChange}
          className="h-9 sm:h-11"
        />
      </div>
      <div className="space-y-1.5 sm:space-y-2">
        <Label htmlFor="contact-email" className="text-sm sm:text-base">Email</Label>
        <Input
          id="contact-email"
          name="email"
          type="email"
          required
          placeholder="your@email.com"
          value={formData.email}
          onChange={handleChange}
          className="h-9 sm:h-11"
        />
      </div>
      <div className="space-y-1.5 sm:space-y-2">
        <Label htmlFor="contact-message" className="text-sm sm:text-base">Message</Label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={3}
          placeholder="How can we help you?"
          value={formData.message}
          onChange={handleChange}
          className={cn(
            "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[80px] sm:min-h-[120px] resize-y"
          )}
        />
      </div>
      <Button type="submit" size="default" disabled={submitting} className="w-full gap-2">
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
