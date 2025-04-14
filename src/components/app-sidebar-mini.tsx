"use client";
import { SidebarTrigger, useSidebar } from "./ui/sidebar";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { UserIcon } from "lucide-react";

export default function AppSidebarMini() {
  const { open } = useSidebar();
  console.log("open", open);
  return (
    <>
      {!open && (
        <div
          id="sidebar-div"
          className="w-[3vw] p-3 h-screen flex flex-col items-center justify-between bg-blue-500"
        >
          <div className="w-4 h-4 bg-inherit" />
          <SignedOut>
            <SignInButton>
              <Button size="icon" className="w-8 h-8 mb-[-5]">
                <UserIcon />
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      )}
    </>
  );
}
