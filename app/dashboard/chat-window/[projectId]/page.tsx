"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, ArrowLeft } from "lucide-react";
import Link from 'next/link';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";



import { useProject } from "../../../context/projectContext";

interface Message {
  id: string;
  projectId: string;
  senderId: string;
  content: string;
  createdAt: string;
}

interface User {
  id: string;
  initials: string;
}

export default function ChatWindowPage() {

  const { currentProject } = useProject();
  const projectId = currentProject?.id;

  // Hardcode a "current user" for the example
  const currentUserId = "addd061b-6883-4bab-a355-4479bf659623";

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  
  // Mock users data (in a real app, you would fetch this)
  const users: Record<string, User> = {
    "addd061b-6883-4bab-a355-4479bf659623": { id: "addd061b-6883-4bab-a355-4479bf659623", initials: "RJ" },
    "946d962a-da03-452a-a6ec-e747cfc67aa1": { id: "946d962a-da03-452a-a6ec-e747cfc67aa1", initials: "TM" },
  };

  // Check if user is at bottom of scroll before new messages arrive
  const checkIfNearBottom = () => {
    if (!chatContainerRef.current) return false;
    
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    // If user is within 100px of bottom, consider them "at bottom"
    return scrollHeight - scrollTop - clientHeight < 100;
  };

  // Handle scroll events
  const handleScroll = () => {
    setShouldAutoScroll(checkIfNearBottom());
  };

  // 1) Fetch messages on mount + poll every 5 seconds
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;

    const fetchMessages = async () => {
      if (!projectId) return;
      
      try {
        const res = await fetch(`/api/chat/${projectId}/messages`);
        if (!res.ok) throw new Error("Failed to fetch messages");
        const data: Message[] = await res.json();
        
        // Only update if there are new messages to prevent unnecessary re-renders
        if (messages.length !== data.length || 
            (data.length > 0 && messages.length > 0 && data[data.length-1].id !== messages[messages.length-1].id)) {
          setMessages(data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchMessages();
    intervalId = setInterval(fetchMessages, 5000); // Poll every 5s

    return () => {
      clearInterval(intervalId);
    };
  }, [projectId, messages.length]);

  // 2) Smart scroll behavior
  useEffect(() => {
    if (shouldAutoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, shouldAutoScroll]);

  // 3) Send new message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !projectId) return;
    
    // Force scroll to bottom when sending a new message
    setShouldAutoScroll(true);
    
    try {
      const res = await fetch(`/api/chat/${projectId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: currentUserId,
          content: newMessage.trim(),
        }),
      });
      if (!res.ok) throw new Error("Failed to send message");
      
      const createdMessage = await res.json();
      setMessages((prev) => [...prev, createdMessage]);
      setNewMessage("");
    } catch (error) {
      console.error(error);
    }
  };

  // 4) Handle Enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getFormattedTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const [details, setDetails] = useState(false);

  return (
    

    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center p-4 bg-white border-b shadow-sm">
        <Link href="/projects" className="mr-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h2 className="text-xl font-semibold flex-grow">Project Chat: {projectId ? projectId.substring(0, 8) : 'Loading'}...</h2>
        <Link href={`/project/${projectId}`}>
          <Button variant="outline" size="sm">Project Details</Button>
        </Link>
      </div>

      {/* Messages container */}
      <div 
        ref={chatContainerRef}
        className="flex-grow overflow-y-auto p-4"
        onScroll={handleScroll}
      >
        <Card className="border-0 shadow-sm mb-4">
          <CardContent className="p-0">
            <div className="space-y-4 p-4">
              {messages.map((msg) => {
                const isCurrentUser = msg.senderId === currentUserId;
                const user = users[msg.senderId] || { initials: "??" };
                
                return (
                  <div 
                    key={msg.id} 
                    className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex max-w-[80%] ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
                      <Avatar className={`${isCurrentUser ? 'ml-2' : 'mr-2'} h-8 w-8`}>
                        <AvatarFallback className="bg-blue-600 text-white text-xs">
                          {user.initials}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <div 
                          className={`rounded-lg p-3 ${
                            isCurrentUser 
                              ? 'bg-blue-100 text-blue-900' 
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          {msg.content}
                        </div>
                        <div className={`text-xs text-gray-500 mt-1 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
                          {getFormattedTime(msg.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Input area */}
      <div className="p-4 bg-white border-t">
        <div className="flex items-center max-w-4xl mx-auto">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your message..."
            className="flex-grow mr-2 h-12 rounded-full border-gray-300"
          />
          <Button 
            onClick={handleSendMessage} 
            size="icon" 
            className="h-12 w-12 rounded-full bg-blue-600 hover:bg-blue-700"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}