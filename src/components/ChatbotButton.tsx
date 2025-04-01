
import React from 'react';
import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

export function ChatbotButton() {
  const { translate } = useLanguage();
  
  const openSiteInNewTab = () => {
    // Open the main site in a new tab
    const siteUrl = window.location.origin;
    window.open(siteUrl, '_blank');
  };

  return (
    <Button 
      className="fixed bottom-4 right-4 rounded-full shadow-lg z-50 w-12 h-12 p-0"
      onClick={openSiteInNewTab}
    >
      <MessageSquare className="h-5 w-5" />
    </Button>
  );
}
