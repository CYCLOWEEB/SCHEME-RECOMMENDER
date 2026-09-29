'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  Send, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Languages, 
  HelpCircle, 
  ShieldAlert, 
  Bot, 
  User, 
  Loader2,
  RefreshCw,
  Award
} from 'lucide-react';

interface VoiceAIAssistantProps {
  language: string;
  setLanguage: (lang: string) => void;
  currentSchemeName?: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export default function VoiceAIAssistant({
  language,
  setLanguage,
  currentSchemeName
}: VoiceAIAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      text: `Namaste! I am **Yojna Mitra (योजना मित्र)**, your AI Scheme & Channel Finance Advisor powered by Gemini 3.8 Flash and Indic Voice intelligence. 

I can explain concessional credit schemes (NSFDC, NSKFDC, SCAs), help you calculate subsidies, guide you on required documents (Caste & Income Certificates), and instruct you on approaching authorized Channel Partners.

*Ask me anything by typing or tapping the microphone below!*`,
      timestamp: 'Just now'
    }
  ]);

  const [inputQuery, setInputQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const messageCounterRef = useRef<number>(1);

  // Suggested Prompts
  const suggestedPrompts = [
    { label: 'Collateral-free Micro Loan', query: 'How can an SC applicant get a loan up to ₹1.4 Lakh without collateral?' },
    { label: 'Mahila Samriddhi for SHG', query: 'What are the benefits and documents for Mahila Samriddhi Yojana?' },
    { label: 'Education Loan Abroad', query: 'Can I get an education loan for MS abroad if my family income is ₹3.2 Lakhs?' },
    { label: 'Avoid Middlemen & Fraud', query: 'What should I do if a bank manager or middleman asks for a commission?' },
    { label: 'Sanitation Equipment Grant', query: 'How does the Sanitation Entrepreneur Scheme provide a ₹5 Lakh capital subsidy?' }
  ];

  // Auto scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Web Speech API Voice Recognition Setup
  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      // Set language code based on user's choice
      const langCodeMap: Record<string, string> = {
        en: 'en-IN',
        hi: 'hi-IN',
        mr: 'mr-IN',
        ta: 'ta-IN',
        te: 'te-IN',
        bn: 'bn-IN'
      };
      recognition.lang = langCodeMap[language] || 'en-IN';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputQuery(transcript);
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [language]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech Recognition is not supported in this browser. Please type your query.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Recognition start error:', err);
      }
    }
  };

  // Text to Speech
  const speakText = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const cleanText = text.replace(/[*#_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    const langCodeMap: Record<string, string> = {
      en: 'en-IN',
      hi: 'hi-IN',
      mr: 'mr-IN',
      ta: 'ta-IN',
      te: 'te-IN',
      bn: 'bn-IN'
    };
    utterance.lang = langCodeMap[language] || 'en-IN';
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (queryToSend?: string) => {
    const query = queryToSend || inputQuery;
    if (!query.trim()) return;

    messageCounterRef.current += 1;
    const userMsgId = `user-${messageCounterRef.current}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: query,
      timestamp: 'Today'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/gemini/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          language,
          schemeName: currentSchemeName
        })
      });

      const data = await res.json();
      const reply = data.text || 'I could not process your query at this moment. Please try again.';

      messageCounterRef.current += 1;
      const aiMsgId = `ai-${messageCounterRef.current}`;
      const assistantMsg: ChatMessage = {
        id: aiMsgId,
        sender: 'assistant',
        text: reply,
        timestamp: 'Today'
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Advisor fetch error:', err);
      messageCounterRef.current += 1;
      const errMsgId = `err-${messageCounterRef.current}`;
      setMessages(prev => [
        ...prev,
        {
          id: errMsgId,
          sender: 'assistant',
          text: 'There was an error communicating with the advisor. Please check your internet connection and try again.',
          timestamp: 'Today'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 text-xs font-bold border border-sky-200 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Indic Voice & AI Scheme Advisor
            </span>
            <span className="text-xs text-slate-500">
              Multilingual Audio Synthesis • Vernacular Assistant
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            AI Scheme Advisor (योजना मित्र)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Vernacular voice and text assistance for marginalized beneficiaries. Get guidance on eligibility, application forms, and channel partners without middlemen.
          </p>
        </div>

        {/* Anti-Bribery Awareness Tag */}
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-800 flex items-start gap-2 max-w-sm">
          <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span>
            <b>Official Warning:</b> All NSFDC/SCA schemes are 100% free of agent fees. Never pay any tout or middleman. Report demands to 14566.
          </span>
        </div>
      </div>

      {/* Suggested Prompts Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="font-semibold text-slate-500 flex items-center gap-1 shrink-0">
          <HelpCircle className="w-3.5 h-3.5 text-sky-600" /> Quick Questions:
        </span>
        {suggestedPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(p.query)}
            className="px-3 py-1.5 rounded-lg bg-white hover:bg-sky-50 border border-slate-200 text-slate-700 hover:text-sky-800 hover:border-sky-300 transition-colors font-medium whitespace-nowrap shadow-2xs"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Main Chat Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col h-[520px]">
        {/* Chat Messages Log */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-2xs ${
                  msg.sender === 'user'
                    ? 'bg-sky-600 text-white rounded-tr-none'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-line prose prose-sm max-w-none text-inherit">
                  {msg.text}
                </div>

                <div className={`mt-2 pt-1.5 flex items-center justify-between text-[10px] ${
                  msg.sender === 'user' ? 'text-sky-200 border-t border-sky-500/40' : 'text-slate-400 border-t border-slate-100'
                }`}>
                  <span>{msg.timestamp}</span>

                  {msg.sender === 'assistant' && (
                    <button
                      onClick={() => speakText(msg.text)}
                      className="text-slate-500 hover:text-sky-600 flex items-center gap-1 font-medium cursor-pointer"
                      title="Read aloud"
                    >
                      {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-rose-500" /> : <Volume2 className="w-3.5 h-3.5" />}
                      <span>{isSpeaking ? 'Stop' : 'Speak'}</span>
                    </button>
                  )}
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-xs mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-sky-600 text-white flex items-center justify-center shrink-0 mt-1">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-3.5 shadow-2xs flex items-center gap-2 text-xs text-slate-600">
                <Loader2 className="w-4 h-4 animate-spin text-sky-600" />
                <span>Yojna Mitra is analyzing government guidelines...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Bar with Voice Button */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            {/* Voice Input Button */}
            <button
              type="button"
              id="voice-mic-btn"
              onClick={toggleListening}
              className={`p-2.5 rounded-xl border transition-all ${
                isListening
                  ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
              title={isListening ? 'Listening... click to stop' : 'Tap to speak query in your language'}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Input Text Box */}
            <input
              type="text"
              id="chat-query-input"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={
                isListening
                  ? 'Listening now... speak clearly in Hindi, English, etc.'
                  : 'Type your scheme or loan question (e.g. eligibility, subsidy, nearest SCA)...'
              }
              className="flex-1 text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50 focus:bg-white"
            />

            {/* Send Button */}
            <button
              type="submit"
              id="send-chat-btn"
              disabled={!inputQuery.trim() || isLoading}
              className="bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white p-2.5 rounded-xl shadow-xs transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
