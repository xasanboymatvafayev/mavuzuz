
import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, User, Bot, Loader2 } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { Message } from '../types';

interface AIStylistProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIStylist: React.FC<AIStylistProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Salom! Men MaviBoutique-ning AI stilistiman. Sizga kiyim tanlashda yoki kiyinish uslubingizni yaxshilashda yordam beraman. Qanday savolingiz bor?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      // Initialize GoogleGenAI with the required named parameter object
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        // Simplified content parameter for single-turn text generation
        contents: `Siz MaviBoutique kiyim do'koni uchun professional stilist va maslahatchisiz. 
                Foydalanuvchiga kiyimlar tanlashda, ranglar uyg'unligida va tantanali marosimlar uchun obraz yaratishda yordam bering. 
                Javobingiz faqat o'zbek tilida, muloyim va professional bo'lishi kerak. 
                Do'konda sotiladigan va ijaraga beriladigan kiyimlar borligini unutmang.
                
                Foydalanuvchi: ${userMsg}`,
        config: {
          temperature: 0.7,
          topP: 0.8,
          maxOutputTokens: 500,
        }
      });

      // Directly access the text property from the response object
      const aiText = response.text || "Uzr, hozircha javob bera olmayman. Iltimos qaytadan urinib ko'ring.";
      setMessages(prev => [...prev, { role: 'model', text: aiText }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: "Texnik nosozlik yuz berdi. Iltimos, birozdan so'ng qayta urinib ko'ring." }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-blue-900/20 backdrop-blur-md" onClick={onClose} />
      
      {/* Chat Box */}
      <div className="relative w-full max-w-md bg-white sm:rounded-3xl h-[80vh] sm:h-[600px] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="bg-blue-600 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="font-bold text-sm">AI Stilist Maslahati</h3>
              <p className="text-[10px] text-blue-100">Onlayn • Yordamga tayyor</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full">
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 no-scrollbar"
        >
          {messages.map((m, idx) => (
            <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] flex gap-2 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${m.role === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-white text-slate-400 border border-slate-100 shadow-sm'}`}>
                  {m.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>
                <div className={`p-3 rounded-2xl text-sm leading-relaxed ${m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-slate-700 shadow-sm border border-slate-100 rounded-tl-none'}`}>
                  {m.text}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-100 p-3 rounded-2xl flex items-center gap-2 text-slate-400">
                <Loader2 size={16} className="animate-spin" />
                <span className="text-xs">O'ylayapman...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t">
          <div className="flex items-center gap-2 bg-slate-100 rounded-2xl p-2 pr-2">
            <input 
              type="text"
              placeholder="Savol yozing..."
              className="flex-1 bg-transparent border-none outline-none px-3 text-sm text-slate-700"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center disabled:opacity-50 transition-all active:scale-90"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIStylist;
