import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Headset, User, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocation } from 'react-router-dom';

type Message = {
  id: string;
  sender: 'ai' | 'user';
  text: string;
};

const initialMessages: Message[] = [
  { id: '1', sender: 'ai', text: 'Hi! I am your VoyageX Support Concierge. Where would you like to travel today?' }
];

export const AIChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Don't show on admin pages
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = (overrideText?: string) => {
    const text = overrideText || input;
    if (!text.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Mock Concierge Response Logic
    setTimeout(() => {
      let aiResponseText = "I can definitely help with that! Head over to our 'Plan Trip' page to get a full personalized itinerary.";
      const lowerInput = userMsg.text.toLowerCase();

      if (lowerInput.includes('beach') || lowerInput.includes('ocean')) {
        aiResponseText = "For a perfect beach getaway, I highly recommend checking out Bali or the Maldives. Should I take you to the Maldives destination page?";
      } else if (lowerInput.includes('mountain') || lowerInput.includes('snow')) {
        aiResponseText = "If you love mountains, the Swiss Alps are breathtaking this time of year! You can find amazing packages in our Destinations tab.";
      } else if (lowerInput.includes('cheap') || lowerInput.includes('budget')) {
        aiResponseText = "We have several budget-friendly destinations! Try exploring Southeast Asia or Eastern Europe for the best value.";
      }

      setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'ai', text: aiResponseText }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-2xl hover:scale-110 transition-transform z-50 flex items-center justify-center animate-bounce-slow"
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-80 sm:w-96 shadow-2xl z-50 border-blue-200 flex flex-col h-[500px] max-h-[80vh] animate-slide-up">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg p-4 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-lg flex items-center gap-2">
              <Headset className="h-5 w-5" />
              VoyageX Concierge
            </CardTitle>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 flex flex-col" ref={scrollRef}>
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-2 max-w-[85%] animate-fade-in ${msg.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'user' ? 'bg-gray-200' : 'bg-gradient-to-r from-blue-500 to-purple-500'}`}>
                  {msg.sender === 'user' ? <User className="h-4 w-4 text-gray-600" /> : <Headset className="h-4 w-4 text-white" />}
                </div>
                <div className={`p-3 rounded-lg text-sm shadow-sm ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border text-gray-800 rounded-tl-none'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-2 self-start max-w-[85%] animate-fade-in">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500">
                  <Headset className="h-4 w-4 text-white" />
                </div>
                <div className="p-3 bg-white border rounded-lg rounded-tl-none flex gap-1 items-center h-10">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </CardContent>

          <div className="bg-white border-t rounded-b-lg flex flex-col">
            {/* Quick Replies */}
            {!isTyping && messages.length < 3 && (
              <div className="flex gap-2 p-3 overflow-x-auto border-b bg-gray-50/50">
                {['Recommend a beach trip 🏖️', 'I need a budget trip 💰', 'Show me the mountains ⛰️'].map((qr) => (
                  <button
                    key={qr}
                    onClick={() => handleSend(qr)}
                    className="whitespace-nowrap px-3 py-1.5 bg-blue-50 text-blue-700 font-medium text-xs rounded-full border border-blue-200 hover:bg-blue-100 transition-colors shadow-sm"
                  >
                    {qr}
                  </button>
                ))}
              </div>
            )}

            <div className="p-3 flex gap-2">
              <input
              type="text"
              placeholder="Ask me anything..."
              className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <Button size="icon" onClick={() => handleSend()} disabled={!input.trim() || isTyping}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};
