"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ChatInputFormProps = {
  placeholder?: string;
  disabled?: boolean;
};

export default function ChatInput({
  placeholder = "Type a message...",
  disabled = false,
}: ChatInputFormProps) {
  const [inputValue, setInputValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      //later
      setInputValue(""); // Clear input after successful submission
    } catch (error) {
      console.error("Error submitting message:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl flex gap-2 px-4"
      >
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder}
          disabled={disabled || isSubmitting}
          className="flex-grow"
          autoComplete="off"
        />
        <Button
          type="submit"
          disabled={disabled || isSubmitting || !inputValue.trim()}
        >
          {isSubmitting ? "Sending..." : "Send"}
        </Button>
      </form>
    </div>
  );
}
