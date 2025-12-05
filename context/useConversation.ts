

import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import {
  getConversasUser,
  getConversaHistorico,
  criarConversa,
  deleteConversa,
} from "@/service/conversation";

export interface Conversation {
  _id: string;
  title?: string;
  messages?: any[];
}

type Message = {
  autor: "user" | "assistant";
  texto: string;
};


export function useConversation(userId: string) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const selectedConversationRef = useRef<string | null>(null);

  /** Mantém referência sempre atualizada */
  useEffect(() => {
    selectedConversationRef.current = selectedConversation;
  }, [selectedConversation]);

  /** Inicializa Socket.io */
  useEffect(() => {
    const socket = io("http://localhost:8080", { withCredentials: true });
    socketRef.current = socket;

    socket.on("connect", () => {
      if (selectedConversationRef.current) {
        socket.emit("join", selectedConversationRef.current);
      }
    });

    socket.on("joined", (data) => {
      console.log("🏠 Confirmação JOIN recebida:", data);
    });

    socket.on("message", (msg) => {
      setMessages((prev) => [...prev, { autor: msg.sender, texto: msg.text }]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchConversations = async () => {
      const data = await getConversasUser(userId);
      setConversations(data);
    };

    fetchConversations();
  }, [userId]);

  /** Carrega conversas do usuário */
  const loadConversations = async () => {
    if (!userId) {
      console.warn("userId ainda não carregou");
      return;
    }
    const data = await getConversasUser(userId);
    setConversations(data);

    if (data.length > 0 && !selectedConversationRef.current) {
      selectConversation(data[0]._id);
    }
  };

  useEffect(() => {
    if (!userId) {
      setConversations([]);
      return;
    }

    loadConversations();
  }, [userId]);

  const selectConversation = async (conversationId: string) => {
    setSelectedConversation(conversationId);
    selectedConversationRef.current = conversationId;

    setLoading(true);

    if (!userId) return;

    socketRef.current?.emit("join", conversationId);

    const historico = await getConversaHistorico(conversationId) as any[];

    const formatado: Message[] = historico.map((m) => ({
      autor: m.sender,
      texto: m.text,
    }));

    setMessages(formatado);

    setLoading(false);
  };

  /** Criar nova conversa */
  const startConversation = async (title: string) => {
    const conversa = await criarConversa({ userId, title: title ?? "" });

    if (!conversa || !conversa._id) {
      console.error("Conversa criada sem _id:", conversa);
      return null;
    }

    await loadConversations();
    setSelectedConversation(conversa._id);

    return conversa;
  };

  const sendMessage = async (text: string) => {
    let conversaId = selectedConversationRef.current;

    if (!conversaId) {
      const nova = await startConversation(
        text.slice(0, 20) || "Nova conversa"
      );
      if (!userId) return;

      conversaId = nova._id;
      selectedConversationRef.current = conversaId;
    }

    setMessages((prev) => [...prev, { autor: "user", texto: text }]);

    socketRef.current?.emit("message", {
      conversationId: conversaId,
      text,
    });
    await loadConversations();
  };

  const deleteConversation = async (conversationId: string) => {
    await deleteConversa(conversationId);

    setConversations((prev) => prev.filter((c) => c._id !== conversationId));

    if (selectedConversationRef.current === conversationId) {
      setSelectedConversation(null);
      setMessages([]);
    }
  };

  return {
    conversations,
    selectedConversation,
    messages,
    loading,
    sendMessage,
    selectConversation,
    startConversation,
    deleteConversation,
  };
}
