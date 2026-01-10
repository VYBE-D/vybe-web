"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "../../lib/supabase";

interface Message {
  id: string;
  request_id: string;
  sender: string;
  message: string;
  created_at: string;
}

interface Profile {
  id: string;
  name: string;
}

export default function Chat({ requestId }: { requestId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [profiles, setProfiles] = useState<Record<string, string>>({});
  const [myId, setMyId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // 1. Get current user on mount
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setMyId(data.user.id);
    });
  }, []);

  // 2. Scroll to bottom whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 3. Main Data Fetching & Subscription
  useEffect(() => {
    const fetchData = async () => {
      // Fetch Messages
      const { data: msgData, error } = await supabase
        .from("messages")
        .select("*")
        .eq("request_id", requestId)
        .order("created_at", { ascending: true });

      if (error) return console.error("Error fetching messages:", error);
      if (msgData) {
        setMessages(msgData as Message[]);
        
        // Fetch Profiles for these messages
        const senderIds = Array.from(new Set(msgData.map((m) => m.sender)));
        if (senderIds.length > 0) {
          const { data: profData } = await supabase
            .from("profiles")
            .select("id, name")
            .in("id", senderIds);

          if (profData) {
            const map: Record<string, string> = {};
            profData.forEach((p) => (map[p.id] = p.name));
            setProfiles(map);
          }
        }
      }
    };

    fetchData();

    // Real-time subscription
    const channel = supabase
      .channel(`chat-${requestId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `request_id=eq.${requestId}`,
        },
        async (payload) => {
          const newMsg = payload.new as Message;
          setMessages((prev) => [...prev, newMsg]);

          // Fetch profile for new sender if we don't have it yet
          setProfiles((prev) => {
            if (!prev[newMsg.sender]) {
              fetchProfile(newMsg.sender);
            }
            return prev;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [requestId]); // Profiles removed from here to prevent loops

  // Helper to fetch a single profile
  const fetchProfile = async (id: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("id, name")
      .eq("id", id)
      .single();
    if (data) {
      setProfiles((prev) => ({ ...prev, [data.id]: data.name }));
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !myId) return;

    const content = newMessage.trim();
    setNewMessage(""); // Clear input early for better UX

    const { error } = await supabase.from("messages").insert({
      request_id: requestId,
      sender: myId,
      message: content,
    });

    if (error) {
      console.error("Send error:", error);
      alert("Failed to send message");
    }
  };

  return (
    <div className="flex flex-col h-[500px] w-full max-w-2xl mx-auto bg-gray-900 rounded-xl overflow-hidden border border-gray-800">
      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => {
          const isMe = m.sender === myId;
          const senderName = profiles[m.sender] || "Loading...";

          return (
            <div key={m.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
              {!isMe && <span className="text-xs text-gray-400 ml-2 mb-1">{senderName}</span>}
              <div
                className={`max-w-[80%] px-4 py-2 rounded-2xl break-words text-sm ${
                  isMe 
                    ? "bg-red-600 text-white rounded-tr-none" 
                    : "bg-gray-800 text-gray-100 rounded-tl-none"
                }`}
              >
                {m.message}
              </div>
              <span className="text-[10px] text-gray-500 mt-1 px-1">
                {new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={sendMessage} className="p-4 bg-gray-800/50 flex gap-2">
        <input
          className="flex-1 bg-gray-800 border border-gray-700 text-white text-sm rounded-full px-4 py-2 outline-none focus:border-red-600 transition-colors"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button 
          type="submit"
          className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-full text-sm font-medium transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
}