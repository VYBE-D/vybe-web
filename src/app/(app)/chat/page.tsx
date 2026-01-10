"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase"; 
import EmptyState from "../../../component/EmptyState"; 
import { Send, ChevronLeft, Loader2, MessageSquare } from "lucide-react";

export default function ChatPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeChatId = searchParams.get("id"); // Check if we are in a specific chat

  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<string>("");
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // 1. INITIALIZE (Load User & Conversations)
  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setCurrentUser(user.id);

      // Fetch list of all conversations for this user
      const { data: convs } = await supabase
        .from("conversations")
        .select("*, discovery(name, image_url)")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });
      
      if (convs) setConversations(convs);
      setLoading(false);
    }
    init();
  }, []);

  // 2. FETCH MESSAGES (If a chat is active)
  useEffect(() => {
    if (!activeChatId) return;

    const fetchMessages = async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", activeChatId)
        .order("created_at", { ascending: true });
      if (data) setMessages(data);
      setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    };
    fetchMessages();

    // Subscribe to new messages
    const channel = supabase.channel(`chat:${activeChatId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${activeChatId}` }, (payload) => {
        setMessages((prev) => [...prev, payload.new]);
        setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [activeChatId]);

  // 3. SEND MESSAGE FUNCTION
  const sendMessage = async () => {
    if (!newMessage.trim() || !activeChatId) return;

    await supabase.from("messages").insert([{
      conversation_id: activeChatId,
      sender_id: currentUser,
      content: newMessage
    }]);

    await supabase.from("conversations").update({
        last_message: newMessage,
        updated_at: new Date()
    }).eq("id", activeChatId);

    setNewMessage("");
  };

  // --- RENDER: LOADING ---
  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="animate-spin text-red-600"/></div>;

  // --- RENDER: CHAT ROOM (If ID exists) ---
  if (activeChatId) {
    const activeChatInfo = conversations.find(c => c.id === activeChatId);
    
    return (
      <main className="min-h-screen bg-black text-white flex flex-col pb-safe">
        {/* Header */}
        <header className="p-4 border-b border-white/10 flex items-center gap-4 bg-zinc-900/80 backdrop-blur-md sticky top-0 z-50">
          <button onClick={() => router.push('/chat')} className="p-2 bg-white/5 rounded-full hover:bg-white/10">
            <ChevronLeft size={20} />
          </button>
          <div className="w-10 h-10 rounded-full overflow-hidden border border-red-600">
             <img src={activeChatInfo?.discovery?.image_url} className="w-full h-full object-cover" />
          </div>
          <div>
             <h1 className="font-black italic uppercase text-lg leading-none">{activeChatInfo?.discovery?.name || "Agent"}</h1>
             <p className="text-[9px] text-red-600 font-bold uppercase tracking-widest animate-pulse">Session Encrypted</p>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => {
            const isMe = msg.sender_id === currentUser;
            return (
              <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${isMe ? "bg-red-600 text-white rounded-br-none" : "bg-white/10 text-gray-200 rounded-bl-none"}`}>
                  {msg.content}
                </div>
              </div>
            );
          })}
          <div ref={scrollRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-black border-t border-white/10 sticky bottom-0">
          <div className="flex gap-2">
            <input 
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              placeholder="Negotiate details..."
              className="flex-1 bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-red-600 transition text-white"
            />
            <button onClick={sendMessage} className="bg-white text-black p-3 rounded-xl hover:bg-gray-200">
              <Send size={20} />
            </button>
          </div>
        </div>
      </main>
    );
  }

  // --- RENDER: INBOX LIST (If no ID) ---
  return (
    <main className="min-h-screen bg-black text-white pt-6 px-4 pb-20">
      <h1 className="text-3xl font-black italic uppercase tracking-tighter mb-6">Secure Inbox</h1>
      
      {conversations.length === 0 ? (
        <EmptyState text="No active bookings found." />
      ) : (
        <div className="space-y-3">
          {conversations.map((chat) => (
            <div 
              key={chat.id}
              onClick={() => router.push(`/chat?id=${chat.id}`)}
              className="flex items-center gap-4 p-4 bg-white/5 border border-white/5 rounded-2xl active:scale-95 transition cursor-pointer"
            >
              <div className="w-14 h-14 rounded-full bg-zinc-800 overflow-hidden border border-white/10">
                 <img src={chat.discovery?.image_url} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-black italic uppercase text-lg">{chat.discovery?.name}</h3>
                  <span className="text-[9px] text-gray-500 font-bold">{new Date(chat.updated_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
                <p className="text-xs text-gray-400 truncate">{chat.last_message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}