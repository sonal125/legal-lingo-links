
import React, { useState } from 'react';
import { Phone, Send, Calendar, Star, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { DashboardLayout } from '@/components/DashboardLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

// Mock conversation data
const MOCK_CONVERSATIONS = [
  {
    id: "1",
    name: "John Doe",
    lastMessage: "Yes, you can file a complaint with the consumer forum.",
    time: "10:30 AM",
    unread: true,
    role: "student",
    isPrime: true,
    rating: 4.8,
    avatar: "J"
  },
  {
    id: "2",
    name: "Priya Singh",
    lastMessage: "According to the Consumer Protection Act, the company must...",
    time: "Yesterday",
    unread: false,
    role: "student",
    isPrime: false,
    rating: 4.2,
    avatar: "P"
  },
  {
    id: "3",
    name: "Vikram Patel",
    lastMessage: "I've reviewed your case and here's my advice...",
    time: "2 days ago",
    unread: false,
    role: "student",
    isPrime: true,
    rating: 4.9,
    avatar: "V"
  }
];

// Mock messages for a conversation
const MOCK_MESSAGES = [
  {
    id: "1",
    text: "Hello, I'm having issues with a defective product I purchased online. The seller is refusing to replace or refund it. What should I do?",
    sender: "client",
    timestamp: new Date(2023, 10, 15, 10, 30)
  },
  {
    id: "2",
    text: "Hi there! I'm sorry to hear about your issue. According to the Consumer Protection Act, 2019, you have the right to return defective products and get a refund or replacement. When did you purchase this item?",
    sender: "advisor",
    timestamp: new Date(2023, 10, 15, 10, 35)
  },
  {
    id: "3",
    text: "I bought it last week. I've already contacted the seller but they're saying that the return period is over, even though their policy states 14 days.",
    sender: "client",
    timestamp: new Date(2023, 10, 15, 10, 40)
  },
  {
    id: "4",
    text: "In that case, you should: 1) Document all communications with the seller, 2) Take screenshots of their stated return policy, 3) File a complaint on the e-commerce platform, and 4) If that doesn't work, you can file a formal complaint with the Consumer Forum in your district. Would you like more details about filing a consumer complaint?",
    sender: "advisor",
    timestamp: new Date(2023, 10, 15, 10, 45)
  }
];

export default function Messages() {
  const { translate } = useLanguage();
  const { user } = useAuth();
  const [activeChat, setActiveChat] = useState<string | null>("1");
  const [newMessage, setNewMessage] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [ratingValue, setRatingValue] = useState<number | null>(null);
  
  const isStudent = user?.role === 'student';
  
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    // In a real app, this would send a message to the backend
    // For demo purposes, we'll just clear the input
    setNewMessage("");
    toast({
      title: translate("Message Sent"),
      description: translate("Your message has been sent successfully."),
    });
  };
  
  const handleScheduleCall = () => {
    if (!date) {
      toast({
        variant: "destructive",
        title: translate("Select a Date"),
        description: translate("Please select a date for the call."),
      });
      return;
    }
    
    toast({
      title: translate("Call Scheduled"),
      description: translate("Your call has been scheduled successfully."),
    });
  };
  
  const handleSubmitRating = () => {
    if (!ratingValue) {
      toast({
        variant: "destructive",
        title: translate("Select a Rating"),
        description: translate("Please select a rating before submitting."),
      });
      return;
    }
    
    toast({
      title: translate("Rating Submitted"),
      description: translate("Thank you for rating your experience."),
    });
    setRatingValue(null);
  };
  
  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-10rem)] overflow-hidden rounded-md border">
        {/* Chat List */}
        <div className="w-80 border-r overflow-auto bg-card">
          <div className="p-4">
            <h2 className="font-semibold mb-4">{translate("Conversations")}</h2>
            <div className="space-y-2">
              {MOCK_CONVERSATIONS.map((conversation) => (
                <button
                  key={conversation.id}
                  className={cn(
                    "flex items-start gap-3 w-full p-3 text-left rounded-md transition-colors",
                    activeChat === conversation.id
                      ? "bg-primary/10"
                      : "hover:bg-secondary"
                  )}
                  onClick={() => setActiveChat(conversation.id)}
                >
                  <div className={cn(
                    "flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-primary-foreground",
                    conversation.isPrime ? "bg-primary" : "bg-muted"
                  )}>
                    {conversation.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium truncate">
                        {conversation.name}
                        {conversation.isPrime && (
                          <Award className="h-3 w-3 text-warning inline ml-1" />
                        )}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {conversation.time}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {conversation.lastMessage}
                    </p>
                  </div>
                  {conversation.unread && (
                    <span className="h-2 w-2 bg-primary rounded-full flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Window */}
        {activeChat ? (
          <div className="flex-1 flex flex-col overflow-hidden bg-background">
            {/* Chat Header */}
            <div className="p-4 border-b flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center text-primary-foreground",
                  MOCK_CONVERSATIONS.find(c => c.id === activeChat)?.isPrime 
                    ? "bg-primary" 
                    : "bg-muted"
                )}>
                  {MOCK_CONVERSATIONS.find(c => c.id === activeChat)?.avatar}
                </div>
                <div>
                  <p className="font-medium">
                    {MOCK_CONVERSATIONS.find(c => c.id === activeChat)?.name}
                    {MOCK_CONVERSATIONS.find(c => c.id === activeChat)?.isPrime && (
                      <Award className="h-4 w-4 text-warning inline ml-1" />
                    )}
                  </p>
                  {MOCK_CONVERSATIONS.find(c => c.id === activeChat)?.role === "student" && (
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Star className="h-3 w-3 text-warning mr-1" />
                      <span>
                        {MOCK_CONVERSATIONS.find(c => c.id === activeChat)?.rating} {translate("rating")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Calendar className="h-4 w-4" />
                      {translate("Schedule Call")}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{translate("Schedule a Call")}</DialogTitle>
                      <DialogDescription>
                        {translate("Pick a date and time for your call.")}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 flex flex-col items-center space-y-4">
                      <CalendarComponent
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md border shadow"
                        disabled={(date) => date < new Date()}
                      />
                      
                      <div className="w-full">
                        <label className="text-sm font-medium">
                          {translate("Selected Date")}
                        </label>
                        <Input
                          value={date ? format(date, "PPP") : ""}
                          readOnly
                          className="mt-1"
                        />
                      </div>
                      
                      <div className="w-full">
                        <label className="text-sm font-medium">
                          {translate("Preferred Time")}
                        </label>
                        <select className="w-full mt-1 p-2 border rounded-md">
                          <option value="9:00">9:00 AM</option>
                          <option value="10:00">10:00 AM</option>
                          <option value="11:00">11:00 AM</option>
                          <option value="12:00">12:00 PM</option>
                          <option value="13:00">1:00 PM</option>
                          <option value="14:00">2:00 PM</option>
                          <option value="15:00">3:00 PM</option>
                          <option value="16:00">4:00 PM</option>
                          <option value="17:00">5:00 PM</option>
                        </select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleScheduleCall}>
                        {translate("Schedule Call")}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                {!isStudent && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-1">
                        <Star className="h-4 w-4 text-warning" />
                        {translate("Rate Advisor")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-4">
                        <h3 className="font-medium">
                          {translate("Rate your experience")}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {translate("How would you rate the legal advice provided?")}
                        </p>
                        <div className="flex justify-center py-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              className="p-1"
                              onClick={() => setRatingValue(star)}
                            >
                              <Star
                                className={cn(
                                  "h-6 w-6",
                                  star <= (ratingValue || 0)
                                    ? "text-warning fill-warning"
                                    : "text-muted-foreground"
                                )}
                              />
                            </button>
                          ))}
                        </div>
                        <Textarea
                          placeholder={translate("Additional feedback (optional)")}
                          className="resize-none"
                        />
                        <Button className="w-full" onClick={handleSubmitRating}>
                          {translate("Submit Rating")}
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
                
                <Button variant="outline" size="sm" className="gap-1">
                  <Phone className="h-4 w-4" />
                  {translate("Call")}
                </Button>
              </div>
            </div>
            
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {MOCK_MESSAGES.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "max-w-[75%] rounded-lg px-4 py-2",
                    message.sender === "client"
                      ? "ml-auto bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  )}
                >
                  <p>{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              ))}
            </div>
            
            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={translate("Type your message...")}
                  className="min-h-10 flex-1 resize-none"
                />
                <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            {translate("Select a conversation to start chatting")}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
