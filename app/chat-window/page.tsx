"use client"

// ChatWindow.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

// Types
interface User {
  id: string;
  name: string;
  role: 'Student' | 'Professor' | 'Mentor';
  avatarUrl?: string;
}

interface Message {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  content: string;
  timestamp: Date;
}

interface ChatWindowProps {
  projectId: string;
  projectName: string;
  currentUser: User;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ 
  projectId, 
  projectName,
  currentUser 
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Mock data for demonstration - in a real app, fetch from API
  useEffect(() => {
    // Sample data based on your screenshot
    const sampleMessages: Message[] = [
      {
        id: '1',
        userId: 'chaitanya1',
        userName: 'Chaitanya',
        userRole: 'Student',
        content: "Hi everyone! I've started working on the API scheduling task.",
        timestamp: new Date('2025-03-01T10:30:00')
      },
      
      {
        id: '2',
        userId: 'prof1',
        userName: 'Prof. Sriparna Saha',
        userRole: 'Professor',
        content: "Great! Make sure to follow the WAI-ARIA design pattern we discussed.",
        timestamp: new Date('2025-03-01T10:35:00')
      },
      {
        id: '3',
        userId: 'olivia1',
        userName: 'Olivia',
        userRole: 'Mentor',
        content: "Let me know if you need any help with the implementation. I can review your code.",
        timestamp: new Date('2025-03-01T10:40:00')
      },
      {
        id: '4',
        userId: 'chaitanya1',
        userName: 'Chaitanya',
        userRole: 'Student',
        content: "Thanks, Olivia! I'll share my progress by the end of the day.",
        timestamp: new Date('2025-03-01T10:45:00')
      },
      {
        id: '5',
        userId: 'jackson1',
        userName: 'Jackson Lee',
        userRole: 'Student',
        content: "I can help with the testing part once you're done with the implementation.",
        timestamp: new Date('2025-03-01T11:00:00')
      }
    ];
    
    setMessages(sampleMessages);
  }, [projectId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Format time from Date object
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Handle sending a new message
  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      content: newMessage,
      timestamp: new Date()
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="flex flex-col h-full border rounded-md shadow-sm">
      {/* Project Header */}
      <div className="flex items-center p-4 border-b bg-white">
        <Button 
          variant="ghost" 
          size="icon" 
          className="mr-2"
          aria-label="Go back"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Button>
        <div>
          <h2 className="text-xl font-semibold">{projectName}</h2>
          <p className="text-sm text-gray-500">Project ID: {projectId}</p>
        </div>
      </div>
      
      {/* Messages Container */}
      <CardContent className="flex-grow p-4 overflow-y-auto bg-gray-50">
        {messages.map((message) => (
          <div key={message.id} className="mb-4 flex items-start">
            <Avatar className="h-10 w-10 mr-3 mt-1 bg-blue-500 text-white flex items-center justify-center">
              <span>{message.userName.charAt(0)}</span>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-baseline">
                <span className="font-medium mr-2">{message.userName}</span>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                  {message.userRole}
                </span>
                <span className="text-xs text-gray-500 ml-2">
                  {formatTime(message.timestamp)}
                </span>
              </div>
              <p className="mt-1 text-gray-800">{message.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </CardContent>
      
      {/* Message Input */}
      <div className="p-3 border-t flex items-center bg-white">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your message..."
          className="flex-grow mr-2"
        />
        <Button 
          onClick={handleSendMessage}
          size="icon"
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </Card>
  );
};

export default ChatWindow;