"use client";

import { SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "Specialized Knowledge",
    description:
      "Trained on extensive blockchain documentation and resources for accurate, in-depth information about blockchain technology.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-blue-400"
      >
        <path
          d="M12 2L2 7L12 12L22 7L12 2Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M2 17L12 22L22 17"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M2 12L12 17L22 12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Multiple AI Models",
    description:
      "Choose from different language models to get varied perspectives and explanations for your blockchain questions.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-purple-400"
      >
        <path
          d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4.92969 4.92969L8.99969 8.99969"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15 15L19.0699 19.0699"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4.92969 19.0699L8.99969 15"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15 9L19.0699 4.93005"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export default function WelcomeScreen() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-black/95 px-4 text-center overflow-hidden">
      <BackgroundBeams className="opacity-25" />

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="mb-6"
          >
            <h1 className="text-5xl md:text-6xl font-bold inline-block pb-4">
              <span
                className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-200 
      relative inline-block after:absolute after:inset-0 after:bg-blue-400/20 after:blur-xl after:-z-10 px-1"
              >
                Block
              </span>{" "}
              <span
                className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-300
      relative inline-block after:absolute after:inset-0 after:bg-purple-400/20 after:blur-xl after:-z-10 px-1 pb-2"
              >
                Query
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="text-xl text-blue-200 mb-6"
          >
            Interactive AI-powered blockchain knowledge assistant
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.8 }}
            className="text-md text-gray-400 mb-10 max-w-2xl mx-auto"
          >
            Ask questions about blockchain technology, smart contracts,
            cryptocurrency, and more. Get accurate, detailed answers from our
            advanced language models.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.7 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + index * 0.2, duration: 0.5 }}
              className="relative group"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-70 transition duration-1000"></div>
              <div className="relative bg-gray-900 p-6 rounded-lg border border-gray-800">
                <div className="flex items-center justify-center mb-3">
                  {feature.icon}
                  <h3 className="text-xl font-semibold text-white ml-2">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-gray-300 text-center">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.6, duration: 0.5 }}
          className="mb-8"
        >
          <SignInButton mode="modal">
            <Button
              className={cn(
                "relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600",
                "text-white font-bold py-3 px-8 rounded-md text-lg",
                "transition-all duration-300 hover:shadow-[0_0_30px_-5px_rgba(79,70,229,0.5)]"
              )}
            >
              <span className="relative z-10">Sign In to Get Started</span>
              <span className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
            </Button>
          </SignInButton>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.5 }}
            className="mt-4 text-sm text-gray-400"
          >
            Create an account to save your conversations and continue learning.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.0, duration: 0.5 }}
          className="text-sm text-gray-500 mt-10"
        >
          <p>© 2025 Block Query. All rights reserved.</p>
        </motion.div>
      </div>
    </div>
  );
}
