"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { JSX } from "react";
import { Button } from "./ui/button";
import { UserButton } from "@clerk/nextjs";
import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/clerk-react";
import { ChevronDown, Plus } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";

export function AppSidebar(): JSX.Element {
  const { isLoaded, user } = useUser();
  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center justify-between w-full h-[5vh]">
            {/* <SidebarTrigger /> */}
            <div className="w-6 h-full bg-inherit" />
            <div className="w-full h-full rounded-full flex items-center justify-left px-2">
              <h1 className="text-base font-bold">Block Query</h1>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <div className="w-full h-[5vh] rounded-full flex items-center justify-left mt-4">
              <Button size={"icon"} className="w-5 h-5 ml-1 mr-2">
                <Plus />
              </Button>
              <p className="text-sm">New Chat</p>
            </div>
          </SidebarGroup>
          <Collapsible defaultOpen className="group/collapsible">
            <SidebarGroup className="w-full">
              <SidebarGroupLabel asChild>
                <CollapsibleTrigger>
                  Recent Chats
                  <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent className="flex items-center justify-left w-full p-2 h-[5vh]">
                  <p>Chat 1</p>
                </SidebarGroupContent>
                <SidebarGroupContent className="flex items-center justify-left w-full p-2 h-[5vh]">
                  <p>Chat 2</p>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        </SidebarContent>
        <SidebarFooter>
          <SignedIn>
            <UserButton>
              <Button className="w-full h-[3vh]">{user?.fullName}</Button>
            </UserButton>
          </SignedIn>
          <SignedOut>
            <SignInButton>
              <Button className="w-full h-[5vh] rounded-sm">Sign In</Button>
            </SignInButton>
          </SignedOut>
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
export default AppSidebar;
