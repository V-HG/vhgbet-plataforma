"use client";

import { useState } from "react";
import axios from "axios";
import { FileText, Lock, LogIn, Loader2 } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3000";

export default function Login() {
  const [formData, setFormData] = useState({ cpf: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Pede o Token para o Backend
      const { data } = await axios.post(`${API_URL}/auth/login`, formData);
      
      // SALVA O TOKEN NO NAVEGADOR (Isso mantém o usuário logado)
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user_name", data.user.name); // Para mostrar "Olá, Fulano"
      
      // Vai para o Lobby
      window.location.href = "/"; 

    } catch (error) {
      alert("❌ CPF ou Senha incorretos!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-2xl">
        
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-purple-600 rounded mx-auto flex items-center justify-center font-bold text-white text-xl mb-4 shadow-[0_0_15px_rgba(147,51,234,0.5)]">V</div>
          <h1 className="text-2xl font-bold text-white">Bem-vindo de volta</h1>
          <p className="text-slate-400 text-sm">Entre para acessar sua carteira.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          
          <div>
            <label className="text-xs text-slate-400 font-bold uppercase ml-1">CPF</label>
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg px-3 py-3 mt-1 focus-within:border-purple-500 transition">
                <FileText size={18} className="text-slate-500 mr-3"/>
                <input 
                    type="text" 
                    placeholder="Seu CPF"
                    className="bg-transparent w-full text-white outline-none placeholder-slate-600"
                    onChange={(e) => setFormData({...formData, cpf: e.target.value})}
                />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 font-bold uppercase ml-1">Senha</label>
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg px-3 py-3 mt-1 focus-within:border-purple-500 transition">
                <Lock size={18} className="text-slate-500 mr-3"/>
                <input 
                    type="password" 
                    placeholder="Sua senha"
                    className="bg-transparent w-full text-white outline-none placeholder-slate-600"
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl mt-4 flex items-center justify-center gap-2 transition active:scale-95"
          >
            {loading ? <Loader2 className="animate-spin"/> : <>ENTRAR <LogIn size={18}/></>}
          </button>

        </form>

        <p className="text-center mt-6 text-slate-500 text-sm">
          Não tem conta? <a href="/register" className="text-purple-400 hover:text-purple-300 font-bold">Cadastre-se</a>
        </p>
      </div>
    </div>
  );
}