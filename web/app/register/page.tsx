"use client";

import { useState } from "react";
import axios from "axios";
import { User, Lock, FileText, ArrowRight, Loader2 } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3000";

export default function Register() {
  const [formData, setFormData] = useState({ name: "", cpf: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Envia para o Backend criar o Usuário + Carteira
      await axios.post(`${API_URL}/users`, formData);
      
      alert("✅ Conta criada com sucesso! Faça login para jogar.");
      window.location.href = "/login"; // Redireciona para o Login

    } catch (error: any) {
      // Mostra o erro que o Backend mandou (ex: "CPF já cadastrado" ou "Senha fraca")
      const msg = error.response?.data?.message || "Erro ao cadastrar";
      alert("❌ " + (Array.isArray(msg) ? msg[0] : msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-2xl">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Crie sua Conta</h1>
          <p className="text-slate-400 text-sm">Junte-se ao VHGBET e ganhe sua carteira digital.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Campo Nome */}
          <div>
            <label className="text-xs text-slate-400 font-bold uppercase ml-1">Nome Completo</label>
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg px-3 py-3 mt-1 focus-within:border-purple-500 transition">
                <User size={18} className="text-slate-500 mr-3"/>
                <input 
                    type="text" 
                    placeholder="Seu nome"
                    className="bg-transparent w-full text-white outline-none placeholder-slate-600"
                    required
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
            </div>
          </div>

          {/* Campo CPF */}
          <div>
            <label className="text-xs text-slate-400 font-bold uppercase ml-1">CPF (Apenas números)</label>
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg px-3 py-3 mt-1 focus-within:border-purple-500 transition">
                <FileText size={18} className="text-slate-500 mr-3"/>
                <input 
                    type="text" 
                    placeholder="000.000.000-00"
                    maxLength={11}
                    className="bg-transparent w-full text-white outline-none placeholder-slate-600"
                    required
                    onChange={(e) => setFormData({...formData, cpf: e.target.value})}
                />
            </div>
          </div>

          {/* Campo Senha */}
          <div>
            <label className="text-xs text-slate-400 font-bold uppercase ml-1">Senha Segura</label>
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg px-3 py-3 mt-1 focus-within:border-purple-500 transition">
                <Lock size={18} className="text-slate-500 mr-3"/>
                <input 
                    type="password" 
                    placeholder="Mínimo 8 caracteres, Maiúscula e Número"
                    className="bg-transparent w-full text-white outline-none placeholder-slate-600"
                    required
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 rounded-xl mt-6 flex items-center justify-center gap-2 transition active:scale-95 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin"/> : <>CRIAR CONTA <ArrowRight size={18}/></>}
          </button>

        </form>

        <p className="text-center mt-6 text-slate-500 text-sm">
          Já tem conta? <a href="/login" className="text-purple-400 hover:text-purple-300 font-bold">Faça Login</a>
        </p>
      </div>
    </div>
  );
}