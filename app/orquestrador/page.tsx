"use client";

import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { IoSend } from "react-icons/io5";
import { useAuth } from "@/context/AuthContext";

export default function Orquestrador() {
  const [mensagens, setMensagens] = useState([
    { autor: "bot", texto: "Olá! me chamo Nadinho, como posso te ajudar?" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const { user } = useAuth();
  console.log(user?.name);
  const chatRef = useRef<HTMLDivElement | null>(null);

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io("http://localhost:8080");

    socketRef.current.on("message", (msg) => {
      setMensagens((prev) => [...prev, { autor: "bot", texto: msg.original }]);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [mensagens]);

  const enviarMensagem = () => {
    if (!inputValue.trim()) return;

    setMensagens((prev) => [...prev, { autor: "user", texto: inputValue }]);

    if (socketRef.current) {
      socketRef.current.emit("message", { text: inputValue });
    }

    setInputValue("");
  };

  const arrayProvisorio = [
    {
      title: "alguma coisa",
      mensagem:
        "asehjiuaesophjasekjaeslçkjaeslçkjaesaeslkjaesklçaesçklaeskaesllakes",
    },
    {
      title: "alguma coisa",
      mensagem:
        "asehjiuaesophjasekjaeslçkjaeslçkjaesaeslkjaesklçaesçklaeskaesllakes",
    },
    {
      title: "alguma coisa",
      mensagem:
        "asehjiuaesophjasekjaeslçkjaeslçkjaesaeslkjaesklçaesçklaeskaesllakes",
    },
    {
      title: "alguma coisa",
      mensagem:
        "asehjiuaesophjasekjaeslçkjaeslçkjaesaeslkjaesklçaesçklaeskaesllakes",
    },
    {
      title: "alguma",
      mensagem:
        "asehjiuaesophjasekjaeslçkjaeslçkjaesaeslkjaesklçaesçklaeskaesllakes",
    },
    {
      title: " coisa",
      mensagem:
        "asehjiuaesophjasekjaeslçkjaeslçkjaesaeslkjaesklçaesçklaeskaesllakes",
    },
  ];

  return (
    <div className="flex w-full h-dvh gap-5">
      {/* sidebar */}
      <div className="flex flex-col h-screen justify-between w-1/6 shadow-md bg-gray-100 border-gray-300 p-5">
        <div className="flex flex-col gap-5 mt-20 min-w-0">
          <h1>Chat Anteriores</h1>
          {arrayProvisorio.map((conversation, idx) => (
            <div
              key={idx}
              className="bg-transparent hover:bg-gray-800 hover:text-white rounded-lg p-1"
            >
              <h2>{conversation.title}</h2>
              <p className="wrap-break-word truncate overflow-hidden text-ellipsis whitespace-nowrap w-full">
                {conversation.mensagem}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-auto bg-white shadow-xl p-4 rounded-xl">
          <h3 className="flex justify-between">
            Usuário <span>{user?.name ?? "carregando"}</span>
          </h3>
          <p className="flex justify-between">
            Empresa <span>{user?.enterprise ?? "carregando"}</span>
          </p>
        </div>
      </div>
      {/* fim da sidebar */}

      {/*Onde ficará o chat*/}
      <div className="flex flex-col w-full h-dvh bg-white p-10">
        <div
          ref={chatRef}
          className="flex-1 min-h-0 overflow-y-auto p-6 flex flex-col justify-end gap-4"
        >
          {mensagens.map((message, idx) => (
            <div
              key={idx}
              className={`max-w-2xl p-3 ${
                message.autor === "user"
                  ? "bg-gray-300 text-black ml-auto rounded-md"
                  : "bg-transparent"
              }`}
            >
              {message.texto}
            </div>
          ))}
        </div>
        <div className="flex w-full justify-center items-center">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              enviarMensagem();
            }}
            className="p-2 w-xl bg-white flex gap-3 border items-center rounded-lg"
          >
            <input
              type="text"
              placeholder="Digite sua mensagem..."
              className="flex-1  px-4 py-2 rounded-lg outline-0"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <IoSend type="submit" />
          </form>
        </div>
      </div>
    </div>
  );
}
