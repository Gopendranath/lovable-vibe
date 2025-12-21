import Image from "next/image";
import { useState, useEffect } from "react";

const ShimmerMessage = () => {
  const messages = [
    "Thinking...",
    "loading...",
    "Generating...",
    "Analyzing your request...",
    "Building your website...",
    "Crafting components...",
    "Optimizing layout...",
    "Adding final touches...",
    "Almost ready...",
  ];

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval((prev) => {
      setCurrentMessageIndex((prev + 1) % messages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="flex items-center gap-2">
      <span className="text-base text-muted-foreground animate-pulse">
        {messages[currentMessageIndex]}
      </span>
    </div>
  );
};

export const MessageLoading = () => {
  return (
    <div className="flex flex-col group px-2 pb-4">
      <div className="flex items-center gap-23 pl-2 mb-2">
        <Image src="/logo.svg" alt="Lovable_Vibe" width={18} height={18} className="shrink-0"/>
        <span className="text-sm font-medium">Lovable Vibe</span>
      </div>
      <div className="pl-8.5 flex flex-col gap-y-4">
        <ShimmerMessage />
      </div>
    </div>
  );
};
