"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { JSX, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { UserButton } from "@clerk/nextjs";
import { useUser } from "@clerk/clerk-react";
import { ChevronDown, MessageSquare, Plus, Search, Trash2 } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Input } from "./ui/input";
import { format, parseISO } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface Chat {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
  messageCount?: number;
}

export function AppSidebar(): JSX.Element {
  const { user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const currentChatId = searchParams?.get("chatId");

  useEffect(() => {
    if (user) {
      fetchChats();
    } else {
      setIsLoading(false);
    }
  }, [user, currentChatId]);

  const fetchChats = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/chats");

      if (response.ok) {
        const data = await response.json();
        setChats(data);
      } else if (response.status === 401) {
        setChats([]);
      } else {
        console.error("Failed to fetch chats");
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    router.push("/");
    setTimeout(() => {
      fetchChats();
    }, 1000);
  };

  const handleChatClick = (chatId: number) => {
    router.push(`/?chatId=${chatId}`);
  };

  const truncateTitle = (title: string, maxLength: number = 20) => {
    if (title.length <= maxLength) return title;
    return title.substring(0, maxLength) + "...";
  };

  const handleDeleteChat = async (e: React.MouseEvent, chatId: number) => {
    e.stopPropagation();

    if (confirm("Are you sure you want to delete this chat?")) {
      try {
        setIsDeleting(chatId);
        const response = await fetch(`/api/chats/${chatId}`, {
          method: "DELETE",
        });

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          if (response.ok) {
            setChats((prevChats) =>
              prevChats.filter((chat) => chat.id !== chatId)
            );

            if (currentChatId === chatId.toString()) {
              router.push("/");
            }
          } else {
            const errorData = await response.json();
            console.error("Failed to delete chat:", errorData.error);
            alert(
              `Failed to delete chat: ${errorData.error || "Unknown error"}`
            );
          }
        } else {
          console.error("Server error - received non-JSON response");
          alert("An unexpected error occurred. Please try again later.");
        }
      } catch (error) {
        console.error("Error deleting chat:", error);
        alert("An error occurred while deleting the chat. Please try again.");
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const filteredChats = chats.filter((chat) =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isClient && !user) {
    return (
      <Sidebar className="border-r border-gray-800">
        <SidebarHeader className="border-b border-gray-800 pb-2">
          <div className="flex items-center justify-between w-full py-3 px-4">
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent ml-5 mt-[-10]">
                Block Query
              </h1>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent className="flex flex-col items-center justify-center h-full px-6 pb-16">
          <div className="text-center">
            <div className="bg-blue-600/20 rounded-full p-4 inline-block mb-4">
              <MessageSquare className="h-10 w-10 text-blue-400" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">
              Welcome to Block Query
            </h2>
            <p className="text-gray-400 mb-8">
              Sign in to start exploring blockchain knowledge with our advanced
              AI assistant.
            </p>
          </div>
        </SidebarContent>
        <SidebarFooter className="border-t border-gray-800 p-4">
          <p className="text-xs text-center text-gray-500">
            Blockchain knowledge at your fingertips
          </p>
        </SidebarFooter>
      </Sidebar>
    );
  }

  return (
    <Sidebar className="border-r border-gray-800">
      <SidebarHeader className="border-b border-gray-800 pb-2">
        <div className="flex items-center justify-between w-full py-3 px-4">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent ml-5 mt-[-10]">
              Block Query
            </h1>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-2">
        <SidebarGroup className="my-4">
          <Button
            onClick={handleNewChat}
            className="w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2 py-5"
          >
            <Plus className="h-5 w-5" />
            <span>New Chat</span>
          </Button>
        </SidebarGroup>

        <div className="relative my-4">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search conversations..."
            className="pl-8 bg-gray-800 border-gray-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroupLabel asChild>
            <CollapsibleTrigger className="flex items-center py-2 px-2 w-full text-sm font-medium text-gray-400 hover:text-white">
              Recent Chats
              <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
            </CollapsibleTrigger>
          </SidebarGroupLabel>
          <CollapsibleContent>
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">
                <div className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-blue-500 border-r-2 border-b-2 mr-2"></div>
                Loading conversations...
              </div>
            ) : filteredChats.length > 0 ? (
              <div className="space-y-1 mt-1">
                {filteredChats.map((chat) => (
                  <SidebarGroupContent
                    key={chat.id}
                    className={`flex flex-col w-full p-2 rounded-md cursor-pointer transition-colors ${
                      currentChatId === chat.id.toString()
                        ? "bg-gray-800 text-white"
                        : "hover:bg-gray-800/50 text-gray-300"
                    }`}
                    onClick={() => handleChatClick(chat.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center flex-1 min-w-0">
                        <MessageSquare className="h-4 w-4 mr-2 flex-shrink-0 text-gray-500" />
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <p className="text-sm font-medium truncate">
                                {truncateTitle(chat.title)}
                              </p>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                              <p>{chat.title}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <button
                        onClick={(e) => handleDeleteChat(e, chat.id)}
                        className={`text-gray-500 hover:text-red-500 transition-colors p-1 rounded ${
                          isDeleting === chat.id ? "opacity-50" : ""
                        }`}
                        disabled={isDeleting === chat.id}
                        aria-label="Delete chat"
                      >
                        {isDeleting === chat.id ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-t-2 border-red-500 border-r-2 border-b-2"></div>
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 ml-6 mt-1">
                      {format(parseISO(chat.updatedAt), "MMM d, yyyy")}
                    </p>
                  </SidebarGroupContent>
                ))}
              </div>
            ) : searchQuery ? (
              <div className="p-4 text-center text-gray-500">
                No matching conversations found
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">
                No conversations yet. Start a new chat!
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      </SidebarContent>
      <SidebarFooter className="border-t border-gray-800 p-4">
        <div className="flex items-center gap-3">
          <UserButton />
          {user && (
            <div className="text-sm">
              <p className="font-medium text-gray-800">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-gray-500 text-xs">
                {user.emailAddresses[0].emailAddress}
              </p>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
