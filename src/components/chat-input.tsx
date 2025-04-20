"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { ModelSelector } from "@/components/model-selector";
import { QuestionRequest } from "@/types/server-types";
import { Send } from "lucide-react";

type ChatInputFormProps = {
  placeholder?: string;
  disabled?: boolean;
  onMessageSent?: (message: string, modelUsed: string) => void;
  onResponseReceived?: (content: string, modelUsed: string) => void;
  currentChatId?: string | null;
  onNewChatCreated?: (chatId: string) => void;
};

export default function ChatInput({
  placeholder = "Type a message...",
  disabled = false,
  onMessageSent,
  onResponseReceived,
  currentChatId,
  onNewChatCreated,
}: ChatInputFormProps) {
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);

  const handleModelSelect = useCallback((models: string[]) => {
    setSelectedModels(models);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const modelUsed =
        selectedModels.length > 0 ? selectedModels[0].toUpperCase() : "BART";

      const requestData: QuestionRequest = {
        question: inputValue,
        models: selectedModels.length > 0 ? selectedModels : undefined,
        parameters: {
          max_length: 200,
          temperature: 1.0,
          num_beams: 4,
        },
      };

      const aiResponse = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!aiResponse.ok) {
        const errorData = await aiResponse.json();
        throw new Error(
          `API error: ${errorData.detail || aiResponse.statusText}`
        );
      }

      const result = await aiResponse.json();
      console.log("API response:", result);

      if (!result.answers || result.answers.length === 0) {
        throw new Error("No response received from the model");
      }

      if (!currentChatId) {
        try {
          const answers = result.answers.map((answer: any) => ({
            content: answer.answer,
            modelUsed: answer.model_name.toUpperCase(),
          }));

          const chatResponse = await fetch("/api/chats", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: inputValue.slice(0, 50),
              firstMessage: inputValue,
              modelUsed: modelUsed,
              answers: answers,
            }),
          });

          if (!chatResponse.ok) {
            throw new Error("Failed to create chat");
          }

          const data = await chatResponse.json();
          const newChatId = data.id.toString();

          if (onNewChatCreated) {
            onNewChatCreated(newChatId);
          }

          router.push(`/?chatId=${newChatId}`);

          setInputValue("");
          return;
        } catch (error) {
          console.error("Error creating new chat:", error);
          alert("Failed to create a new chat. Please try again.");
          return;
        }
      } else {
        if (onMessageSent) {
          onMessageSent(inputValue, modelUsed);
        }

        if (onResponseReceived) {
          result.answers.forEach((answer: any) => {
            onResponseReceived(answer.answer, answer.model_name.toUpperCase());
          });
        }

        try {
          const updateResponse = await fetch(
            `/api/chats/${currentChatId}/messages`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                userMessage: {
                  content: inputValue,
                  modelUsed: modelUsed,
                },
                botResponses: result.answers.map((answer: any) => ({
                  content: answer.answer,
                  modelUsed: answer.model_name.toUpperCase(),
                })),
              }),
            }
          );

          if (!updateResponse.ok) {
            console.error("Failed to save messages to database");
          }
        } catch (error) {
          console.error("Error saving messages:", error);
        }
      }

      setInputValue("");
    } catch (error) {
      console.error("Error submitting message:", error);
      alert("Failed to get a response. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full px-4 py-3 border-t border-gray-800/30 backdrop-blur-sm bg-gray-900/70">
      <div className="w-full max-w-4xl mx-auto">
        {isSubmitting ? (
          <div className="py-2.5 text-center">
            <div className="flex items-center justify-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse delay-100"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse delay-200"></div>
              <span className="text-sm text-gray-300 font-medium ml-1">
                Generating response...
              </span>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="relative flex items-center gap-2 w-full"
          >
            <div className="w-full relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600/40 to-purple-600/40 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative bg-gray-900/80 rounded-xl border border-gray-800/50 shadow-inner overflow-hidden w-full flex items-center">
                <div className="pl-0">
                  <ModelSelector
                    onModelSelect={handleModelSelect}
                    disabled={disabled}
                  />
                </div>

                <Input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={placeholder}
                  disabled={disabled}
                  className="border-none bg-transparent pl-2 pr-14 py-3 text-white shadow-none text-sm focus-visible:ring-0 focus-visible:ring-offset-0 flex-1"
                  autoComplete="off"
                />

                <button
                  type="submit"
                  disabled={disabled || !inputValue.trim()}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-all duration-200 ${
                    !inputValue.trim() || disabled
                      ? "bg-gray-700/70 text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-md hover:shadow-blue-900/30"
                  }`}
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
