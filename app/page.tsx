"use client";

import Image from "next/image";
import Icon from "@/public/IconAvanade.svg";
import LogoAvanade from "@/public/logo.svg";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const [dados, setDados] = useState({ email: "", password: "" });
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(dados);
      window.location.href = "/orquestrador";
    } catch (error: any) {
      console.error("Credenciais inválidas.", error);
    }
  };

  const handleCadastro = () => {
    router.push("/cadastro");
  };

  return (
    <div>
      <main className="flex w-full h-screen">
        <div className="w-1/3 h-screen bg-branco-avanade flex flex-col justify-center items-center gap-10">
          <Image src={Icon} alt="Icone" />
          <form
            onSubmit={handleLogin}
            className="w-full flex flex-col justify-center items-center gap-5"
          >
            <input
              type="email"
              className="w-md h-10 bg-white border-black border-2  rounded-md p-2"
              placeholder="Email"
              value={dados.email}
              onChange={(e) => setDados({ ...dados, email: e.target.value })}
            />
            <input
              type="password"
              className="w-md h-10 bg-white border-2 border-black rounded-md p-2"
              placeholder="Password"
              value={dados.password}
              onChange={(e) => setDados({ ...dados, password: e.target.value })}
            />
            <button
              type="submit"
              className="w-60 h-10 rounded-md border-2 border-black hover:bg-gray-800 hover:text-white cursor-pointer"
            >
              Login
            </button>
          </form>
          <hr className="w-md" />
          <div className="flex flex-col justify-center items-center gap-6">
            <p>Não tem conta?</p>
            <button
              className="w-52 border-2 h-10 border-black rounded-md hover:bg-gray-800 hover:text-white cursor-pointer"
              onClick={handleCadastro}
            >
              Comece agora
            </button>
          </div>
        </div>
        <div className="w-2/3 flex flex-col justify-center items-center h-screen bg-gradient-to-br from-roxo-avanade via-laranja-avanade to-roxo-avanade transition-colors">
          <Image src={LogoAvanade} alt="logo da avanade" width={400} />
          <h4 className="text-white text-2xl">
            {" "}
            A informação certa, no momento exato. Orquestrado por IA
          </h4>
        </div>
      </main>
    </div>
  );
}
