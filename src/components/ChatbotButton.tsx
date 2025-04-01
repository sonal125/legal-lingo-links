
import React from 'react';
import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';

export function ChatbotButton() {
  const { translate } = useLanguage();
  const navigate = useNavigate();
  
  const openChatbot = () => {
    // Navigate to the chatbot page in the same tab
    navigate('/chatbot');
  };

  return (
    <Button 
      className="fixed bottom-4 right-4 rounded-full shadow-lg z-50 w-12 h-12 p-0"
      onClick={openChatbot}
    >
      <MessageSquare className="h-5 w-5" />
    </Button>
  );
}
