"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import { Send, User, MessageSquare, Shield, ChevronLeft } from "lucide-react";

export default function AdminInbox() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const chatId = searchParams.get("id"); // This checks the URL for ?id=...

  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. Fetch the list of all active chats (The Inbox)
  useEffect(() => {
    const fetchInbox = async () => {
      const { data } = await supabase
        .from("conversations")
        .select(`*, discovery(name, image_url)`)
        .order("updated_at", { ascending: false });
      if (data) setConversations(data);
    };
    fetchInbox();
  }, []);

  // 2. Fetch specific messages ONLY if there is an ID in the URL
  useEffect(() => {
    if (!chatId) return;

    const fetchMessages = async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", chatId)
        .order("created_at", { ascending: true });
      if (data) setMessages(data);
      setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    };

    fetchMessages();

    // Subscribe to new messages for this specific ID
    const channel = supabase.channel(`admin_chat_${chatId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${chatId}` }, 
      (payload) => {
        setMessages((prev) => [...prev, payload.new]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [chatId]);

  const handleReply = async () => {
    if (!newMessage.trim() || !chatId) return;
    const { data: { user } } = await supabase.auth.getUser();

    await supabase.from("messages").insert([{
      conversation_id: chatId,
      sender_id: user?.id,
      content: newMessage
    }]);

    await supabase.from("conversations").update({ last_message: newMessage, updated_at: new Date() }).eq("id", chatId);
    setNewMessage("");
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col md:flex-row">
      
      {/* LEFT SIDE: INBOX LIST (Hidden on mobile if a chat is open) */}
      <div className={`${chatId ? "hidden md:flex" : "flex"} w-full md:w-80 border-r border-white/10 flex-col`}>
        <div className="p-6 border-b border-white/10 flex items-center gap-2">
          <Shield className="text-red-600" size={18} />
          <h1 className="font-black uppercase tracking-tighter">Admin Vault</h1>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {conversations.map((c) => (
            <div 
              key={c.id} 
              onClick={() => router.push(`/admin/inbox?id=${c.id}`)}
              className={`p-4 rounded-2xl mb-2 cursor-pointer transition ${chatId === c.id ? "bg-red-600" : "bg-white/5 hover:bg-white/10"}`}
            >
              <p className="font-bold text-xs uppercase">{c.discovery?.name}</p>
              <p className="text-[10px] opacity-60 truncate">{c.last_message}</p>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT SIDE: CHAT ROOM */}
      <div className={`${!chatId ? "hidden md:flex" : "flex"} flex-1 flex-col bg-zinc-900/20`}>
        {chatId ? (
          <>
            <header className="p-4 border-b border-white/10 flex items-center gap-4 bg-black">
              <button onClick={() => router.push('/admin/inbox')} className="md:hidden"><ChevronLeft/></button>
              <h2 className="font-black uppercase italic">Chat Protocol</h2>
            </header>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.sender_id === chatId ? "justify-start" : "justify-end"}`}>
                  <div className={`p-4 rounded-2xl max-w-[80%] text-sm ${m.sender_id === chatId ? "bg-white/10" : "bg-red-600"}`}>
                    {m.content}
                  </div>
                </div>
              ))}
              <div ref={scrollRef} />
            </div>

            <div className="p-4 bg-black border-t border-white/10 flex gap-2">
              <input 
                value={newMessage} 
                onChange={e => setNewMessage(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleReply()}
                placeholder="Type reply..."
                className="flex-1 bg-zinc-900 p-3 rounded-xl outline-none border border-white/5 focus:border-red-600"
              />
              <button onClick={handleReply} className="bg-white text-black px-6 rounded-xl font-bold uppercase text-xs">Send</button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-700 uppercase font-black italic">
            <MessageSquare size={40} className="mb-2 opacity-20" />
            <p>Select a transmission</p>
          </div>
        )}
      </div>
    </main>
  );
}