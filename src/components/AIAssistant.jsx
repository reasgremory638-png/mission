import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader2, ChevronDown } from 'lucide-react';
import { chatWithAI } from '../lib/gemini';
import { useChallenge } from '../context/ChallengeContext';

const QUICK_PROMPTS = [
  'ما الذي يجب أن أفعله اليوم؟',
  'أحتاج مساعدة في مهمتي',
  'اقترح لي فكرة',
  'كيف أحافظ على حافزيتي؟',
];

export default function AIAssistant() {
  const { challenge, stats } = useChallenge();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: `مرحباً! أنا مساعدك في رحلة "${challenge?.title}". كيف يمكنني مساعدتك اليوم؟ 🌿`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: msg }]);
    setLoading(true);
    try {
      const currentDay = stats?.currentDay || 1;
      const reply = await chatWithAI(msg, challenge?.title || 'التحدي', currentDay);
      setMessages(prev => [...prev, { role: 'ai', text: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: 'عذراً، حدث خطأ. حاول مرة أخرى! 🙏' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-6 left-6 z-40 w-14 h-14 bg-nature-500 text-white rounded-full shadow-lg shadow-nature-300/50 flex items-center justify-center"
        aria-label="فتح المساعد"
      >
        <motion.span
          animate={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          className="text-2xl"
        >
          🤖
        </motion.span>
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-24 left-4 z-50 w-[340px] max-w-[calc(100vw-2rem)] rounded-3xl bg-sand-50 shadow-2xl border border-sand-200 flex flex-col overflow-hidden"
            style={{ maxHeight: 'min(500px, calc(100vh - 120px))' }}
            dir="rtl"
          >
            {/* Header */}
            <div className="bg-nature-600 text-white p-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🤖</span>
                <div>
                  <p className="font-display font-bold text-sm">مساعد AI</p>
                  <p className="text-nature-200 text-xs">{challenge?.title}</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-nature-200 hover:text-white transition-colors p-1">
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${m.role === 'user' ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed
                    ${m.role === 'user'
                      ? 'bg-nature-500 text-white rounded-tr-sm'
                      : 'bg-white text-warm-700 border border-sand-200 rounded-tl-sm'
                    }`}
                  >
                    {m.text}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <div className="flex justify-end">
                  <div className="bg-white border border-sand-200 rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex gap-1">
                      {[0, 1, 2].map(i => (
                        <motion.div key={i} className="w-2 h-2 bg-nature-400 rounded-full"
                          animate={{ y: [-3, 3, -3] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Quick prompts */}
            <div className="px-3 py-2 flex gap-2 overflow-x-auto scrollbar-thin flex-shrink-0">
              {QUICK_PROMPTS.map((p, i) => (
                <button key={i} onClick={() => sendMessage(p)}
                  className="flex-shrink-0 text-xs bg-nature-50 border border-nature-200 text-nature-700 rounded-full px-3 py-1.5 hover:bg-nature-100 transition-colors whitespace-nowrap">
                  {p}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-sand-200 flex gap-2 flex-shrink-0">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="اكتب سؤالك..."
                className="flex-1 px-3 py-2 bg-white border border-sand-200 rounded-xl text-sm focus:outline-none focus:border-nature-400 text-warm-700"
              />
              <motion.button
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                className="w-10 h-10 bg-nature-500 text-white rounded-xl flex items-center justify-center disabled:opacity-40 flex-shrink-0"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
