"use client";

import { useState, useEffect, useRef } from "react";
import { IoSend } from "react-icons/io5";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useAuth } from "@/context/AuthContext";
import { BsFillTrashFill } from "react-icons/bs";
import { IoMdExit } from "react-icons/io";
import { useConversation } from "@/context/useConversation";
import { useRouter } from "next/navigation";

export default function Orquestrador() {
  const [inputValue, setInputValue] = useState("");
  const [logoff, setLogoff] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  const {
    conversations,
    messages,
    sendMessage,
    selectConversation,
    startConversation,
    deleteConversation,
  } = useConversation(user?._id || "");

  const chatRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  // const enviarMensagem = () => {
  //   if (!inputValue.trim()) return;

  //   setMensagens((prev) => [...prev, { autor: "user", texto: inputValue }]);

  //   if (socketRef.current) {
  //     socketRef.current.emit("message", { text: inputValue });
  //   }

  //   setInputValue("");
  // };
  if (!user) {
    return <div>Carregando usuário...</div>;
  }
  return (
    <div className="flex w-full h-dvh gap-5">
      {/* sidebar */}
      <div className="flex flex-col h-full justify-between w-1/6 shadow-md bg-gray-100 border-gray-300 p-5">
        <div className="flex flex-col gap-5 min-w-0">
          <div className="flex justify-center items-center">
            <button
              className="w-52 border-2 mt-5 h-10 border-black rounded-md hover:bg-gray-800 hover:text-white"
              onClick={async () => {
                const novaConversa = await startConversation("");
                if (novaConversa?._id) {
                  selectConversation(novaConversa._id);
                }
              }}
            >
              Iniciar um novo chat
            </button>
          </div>
          <div className="flex flex-col gap-2 overflow-y-auto max-h-dvh">
            <h1>Chat Anteriores</h1>
            {conversations.map((conversations) => (
              <div
                key={conversations._id}
                onClick={() => selectConversation(conversations._id)}
                className="bg-transparent hover:bg-gray-800 hover:text-white rounded-lg p-1 flex justify-between items-center"
              >
                <h2>{conversations.title}</h2>
                <BsFillTrashFill
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteConversation(conversations._id);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
        <div
          className="bg-white shadow-xl p-4 rounded-xl relative bottom-5"
          onMouseEnter={() => setLogoff(true)}
          onMouseLeave={() => setLogoff(false)}
        >
          <h3 className="flex justify-between">
            Usuário <span>{user?.name ?? "carregando"}</span>
          </h3>
          <p className="flex justify-between">
            Empresa <span>{user?.enterprise ?? "carregando"}</span>
          </p>
          {logoff && (
            <div className="absolute w-full right-0 bottom-full bg-white rounded-md hover:bg-gray-800">
              <button
                className="block w-full p-2 cursor-pointer text-red-500 hover:text-white font-medium"
                onClick={handleLogout}
              >
                <span className="flex w-full items-center justify-between">
                  Sair
                  <IoMdExit size={20} />
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
      {/* fim da sidebar */}

      {/*Onde ficará o chat*/}
      <div className="flex flex-col w-full h-dvh bg-white p-10">
        <div
          ref={chatRef}
          className="flex-1 min-h-0 overflow-y-auto p-6 flex flex-col"
        >
          <div className="mt-auto flex flex-col gap-2">
            {messages.map((message, idx) => (
              <div
                key={idx}
                className={`p-3 ${
                  message.autor === "user"
                    ? "bg-gray-300 text-black ml-auto rounded-md"
                    : "bg-transparent max-w-prose"
                }`}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {message.texto}
                </ReactMarkdown>
              </div>
            ))}
          </div>
        </div>
        <div className="flex w-full justify-center items-center">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(inputValue);
              setInputValue("");
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
            <button type="submit">
              <IoSend />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
