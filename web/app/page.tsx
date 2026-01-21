"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Gamepad2, Wallet, LogOut, User, Trophy, ShieldAlert } from "lucide-react";

const API_URL = "http://127.0.0.1:3000";

export default function Home() {
  const [balance, setBalance] = useState(0);
  const [userName, setUserName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("user_name");

    // Proteção: Se não tem token, manda pro login
    if (!token) {
      window.location.href = "/login";
      return;
    }

    setUserName(name || "Jogador");
    fetchProfile(token);
  }, []);

  const fetchProfile = async (token: string) => {
    try {
      const { data } = await axios.get(`${API_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBalance(Number(data.wallet.balance));
      setIsAdmin(data.isAdmin); // Verifica se é o dono
    } catch (error) {
      console.error("Sessão expirada");
      logout();
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_name");
    window.location.href = "/login";
  }

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Carregando Cassino...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20">
      
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur border-b border-slate-800 p-4 flex justify-between shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center font-bold text-white">V</div>
          <h1 className="font-bold text-xl hidden md:block">VHG<span className="text-purple-500">BET</span></h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
             <p className="text-[10px] text-slate-400 uppercase font-bold">Saldo</p>
             <p className="font-mono font-bold text-lg text-emerald-400">R$ {balance.toFixed(2)}</p>
          </div>
          
          <div className="flex items-center gap-2 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
             <User size={14} className="text-purple-400"/>
             <span className="text-xs font-bold truncate max-w-[80px]">{userName}</span>
          </div>

          <button onClick={logout} className="text-slate-500 hover:text-red-500 transition">
            <LogOut size={20}/>
          </button>
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL (LOBBY) */}
      <main className="p-4 md:p-8 max-w-7xl mx-auto animate-fade-in">
        
        {/* Aviso de Admin (Só aparece para você) */}
        {isAdmin && (
            <div onClick={() => window.location.href = "/admin"} 
                 className="mb-8 bg-red-900/20 border border-red-900/50 p-4 rounded-xl flex items-center justify-between cursor-pointer hover:bg-red-900/30 transition">
                <div className="flex items-center gap-3">
                    <ShieldAlert className="text-red-500" />
                    <div>
                        <h3 className="font-bold text-red-100">Área do Dono</h3>
                        <p className="text-xs text-red-300">Acesse o painel administrativo</p>
                    </div>
                </div>
                <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold">ACESSAR</button>
            </div>
        )}

        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Gamepad2 className="text-purple-500"/> Jogos em Destaque
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Card do Jogo do Tigre */}
            <div className="relative group overflow-hidden rounded-2xl cursor-pointer shadow-2xl transition hover:-translate-y-1"
                 onClick={() => window.location.href = "/games/tiger"}> {/* <--- Link para a pasta nova */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-600 to-red-600 opacity-90 group-hover:opacity-100 transition"/>
                <div className="relative p-8 h-48 flex flex-col justify-center">
                    <h3 className="text-3xl font-bold text-white mb-1">Fortune Tiger</h3>
                    <p className="text-orange-100 text-sm">O jogo mais famoso do Brasil. Multiplicadores de até 10x!</p>
                    <span className="mt-4 inline-block bg-white text-orange-600 font-bold px-4 py-2 rounded-full text-sm w-fit shadow-lg">JOGAR AGORA</span>
                </div>
                <Trophy className="absolute -right-6 -bottom-6 text-white/20 w-32 h-32 rotate-12" />
            </div>

            {/* Card de Esportes */}
            <div className="relative group overflow-hidden rounded-2xl cursor-pointer shadow-2xl transition hover:-translate-y-1"
                 onClick={() => window.location.href = "/sports"}>
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-green-800 opacity-90 group-hover:opacity-100 transition"/>
                <div className="relative p-8 h-48 flex flex-col justify-center">
                    <h3 className="text-3xl font-bold text-white mb-1">Apostas Esportivas</h3>
                    <p className="text-emerald-100 text-sm">Futebol ao vivo com as melhores odds do mercado.</p>
                    <span className="mt-4 inline-block bg-white text-emerald-600 font-bold px-4 py-2 rounded-full text-sm w-fit shadow-lg">APOSTAR</span>
                </div>
                <Gamepad2 className="absolute -right-6 -bottom-6 text-white/20 w-32 h-32 rotate-12" />
            </div>

        </div>
      </main>
    </div>
  );
}