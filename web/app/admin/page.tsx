"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Users, DollarSign, TrendingUp, ShieldAlert, ArrowLeft } from "lucide-react";

const API_URL = "http://127.0.0.1:3000";

export default function AdminPanel() {
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "/login";
        return;
    }
    fetchData(token);
  }, []);

  const fetchData = async (token: string) => {
    try {
      // 1. Busca Estatísticas
      const statsRes = await axios.get(`${API_URL}/users/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(statsRes.data);

      // 2. Busca Lista de Usuários
      const usersRes = await axios.get(`${API_URL}/users/admin/list`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(usersRes.data);

    } catch (error) {
      alert("ACESSO NEGADO: Você não é administrador.");
      window.location.href = "/";
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Carregando Painel...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-8">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-3">
            <ShieldAlert className="text-red-500" size={32} />
            <h1 className="text-3xl font-bold">Painel do Dono</h1>
        </div>
        <button onClick={() => window.location.href = "/"} className="flex items-center gap-2 text-slate-400 hover:text-white">
            <ArrowLeft size={18}/> Voltar ao Cassino
        </button>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        
        {/* Card 1: Lucro */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-slate-400 text-sm font-bold uppercase">Caixa da Casa</p>
                    <h2 className="text-3xl font-bold text-emerald-400">R$ {stats?.houseProfit.toFixed(2)}</h2>
                </div>
                <div className="p-3 bg-emerald-900/30 rounded-lg text-emerald-500"><TrendingUp /></div>
            </div>
            <p className="text-xs text-slate-500">Baseado no capital inicial - saldos dos jogadores</p>
        </div>

        {/* Card 2: Saldo dos Jogadores */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-slate-400 text-sm font-bold uppercase">Dinheiro em Jogo</p>
                    <h2 className="text-3xl font-bold text-orange-400">R$ {stats?.totalPlayerBalance.toFixed(2)}</h2>
                </div>
                <div className="p-3 bg-orange-900/30 rounded-lg text-orange-500"><DollarSign /></div>
            </div>
            <p className="text-xs text-slate-500">Soma de todas as carteiras de usuários</p>
        </div>

        {/* Card 3: Total Usuários */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-slate-400 text-sm font-bold uppercase">Total de Jogadores</p>
                    <h2 className="text-3xl font-bold text-blue-400">{stats?.totalUsers}</h2>
                </div>
                <div className="p-3 bg-blue-900/30 rounded-lg text-blue-500"><Users /></div>
            </div>
            <p className="text-xs text-slate-500">Usuários cadastrados na plataforma</p>
        </div>
      </div>

      {/* Tabela de Usuários */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-800">
            <h3 className="font-bold text-lg">Gerenciar Jogadores</h3>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-slate-950 text-slate-400 text-xs uppercase">
                    <tr>
                        <th className="p-4">Nome</th>
                        <th className="p-4">CPF</th>
                        <th className="p-4">Saldo</th>
                        <th className="p-4">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                    {users.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-800/50 transition">
                            <td className="p-4 font-bold flex items-center gap-2">
                                {user.isAdmin && <ShieldAlert size={14} className="text-red-500"/>}
                                {user.name}
                            </td>
                            <td className="p-4 font-mono text-slate-400">{user.cpf}</td>
                            <td className="p-4 font-mono text-emerald-400 font-bold">R$ {Number(user.wallet.balance).toFixed(2)}</td>
                            <td className="p-4">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${user.isAdmin ? 'bg-red-900 text-red-200' : 'bg-slate-700 text-slate-300'}`}>
                                    {user.isAdmin ? 'ADMIN' : 'JOGADOR'}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>

    </div>
  );
}