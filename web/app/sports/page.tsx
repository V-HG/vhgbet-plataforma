"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { ArrowLeft, Trophy, DollarSign, Timer, Loader2 } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3000";

// Dados Fictícios de Jogos (Mock)
const MATCHES = [
  { id: 1, home: "Flamengo", away: "Vasco", time: "16:00", odds: { home: 1.85, draw: 3.20, away: 4.50 } },
  { id: 2, home: "Palmeiras", away: "Corinthians", time: "18:30", odds: { home: 2.10, draw: 3.00, away: 3.40 } },
  { id: 3, home: "Real Madrid", away: "Barcelona", time: "20:00", odds: { home: 2.50, draw: 3.50, away: 2.80 } },
];

export default function SportsBetting() {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<any>(null);
  const [selectedOdd, setSelectedOdd] = useState<{ type: string, val: number } | null>(null);
  const [betAmount, setBetAmount] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "/login";
        return;
    }
    fetchBalance(token);
  }, []);

  const fetchBalance = async (token: string) => {
    try {
        const { data } = await axios.get(`${API_URL}/users/profile`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setBalance(Number(data.wallet.balance));
    } catch (error) {
        console.error("Erro ao carregar saldo");
    }
  };

  const placeBet = async () => {
    if (!betAmount || Number(betAmount) <= 0) return alert("Valor inválido");
    if (Number(betAmount) > balance) return alert("Saldo insuficiente");
    
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      // 1. Desconta o dinheiro (Usa a mesma lógica do Tigre para debitar)
      await axios.post(
        `${API_URL}/games/tiger/spin`, // Usamos a rota de spin como "genérica" para debitar por enquanto
        { amount: Number(betAmount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 2. Atualiza visualmente
      setBalance(prev => prev - Number(betAmount));
      alert(`✅ Aposta de R$ ${betAmount} confirmada no ${selectedMatch.home} vs ${selectedMatch.away}!`);
      
      // Limpa seleção
      setSelectedMatch(null);
      setSelectedOdd(null);
      setBetAmount("");

    } catch (error) {
      alert("Erro ao processar aposta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 pb-24">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button onClick={() => window.location.href = "/"} className="text-slate-400 hover:text-white flex items-center gap-2">
            <ArrowLeft size={20}/> Voltar
        </button>
        <div className="bg-slate-900 px-4 py-2 rounded-full border border-slate-800 flex items-center gap-2">
            <span className="text-xs text-slate-400 uppercase font-bold">Saldo</span>
            <span className="text-emerald-400 font-mono font-bold">R$ {balance.toFixed(2)}</span>
        </div>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold flex items-center justify-center gap-2 text-emerald-500">
            <Trophy /> Apostas Esportivas
        </h1>
        <p className="text-slate-500 text-sm">As melhores odds do mercado ao vivo.</p>
      </div>

      {/* Lista de Jogos */}
      <div className="space-y-4 max-w-2xl mx-auto">
        {MATCHES.map((match) => (
            <div key={match.id} className="bg-slate-900 rounded-xl p-4 border border-slate-800 hover:border-emerald-500/30 transition">
                <div className="flex justify-between items-center mb-4 text-xs text-slate-500 font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-1"><Timer size={12}/> {match.time} • Ao Vivo</span>
                    <span>Brasileirão Série A</span>
                </div>

                <div className="flex justify-between items-center mb-6">
                    <div className="text-center w-1/3">
                        <div className="w-10 h-10 bg-slate-800 rounded-full mx-auto mb-2 flex items-center justify-center font-bold text-slate-300">
                            {match.home.charAt(0)}
                        </div>
                        <span className="font-bold text-sm block">{match.home}</span>
                    </div>
                    <div className="text-slate-600 font-bold text-xs">VS</div>
                    <div className="text-center w-1/3">
                        <div className="w-10 h-10 bg-slate-800 rounded-full mx-auto mb-2 flex items-center justify-center font-bold text-slate-300">
                            {match.away.charAt(0)}
                        </div>
                        <span className="font-bold text-sm block">{match.away}</span>
                    </div>
                </div>

                {/* Botões de Odds */}
                <div className="grid grid-cols-3 gap-2">
                    <button 
                        onClick={() => { setSelectedMatch(match); setSelectedOdd({ type: 'home', val: match.odds.home }) }}
                        className={`py-3 rounded-lg font-bold text-sm transition border
                        ${selectedMatch?.id === match.id && selectedOdd?.type === 'home' 
                            ? 'bg-emerald-600 border-emerald-500 text-white' 
                            : 'bg-slate-950 border-slate-800 text-emerald-400 hover:bg-slate-800'}`}
                    >
                        <span className="block text-[10px] text-slate-500 mb-1">CASA</span>
                        {match.odds.home.toFixed(2)}
                    </button>
                    
                    <button 
                         onClick={() => { setSelectedMatch(match); setSelectedOdd({ type: 'draw', val: match.odds.draw }) }}
                         className={`py-3 rounded-lg font-bold text-sm transition border
                         ${selectedMatch?.id === match.id && selectedOdd?.type === 'draw' 
                             ? 'bg-emerald-600 border-emerald-500 text-white' 
                             : 'bg-slate-950 border-slate-800 text-emerald-400 hover:bg-slate-800'}`}
                    >
                        <span className="block text-[10px] text-slate-500 mb-1">EMPATE</span>
                        {match.odds.draw.toFixed(2)}
                    </button>

                    <button 
                         onClick={() => { setSelectedMatch(match); setSelectedOdd({ type: 'away', val: match.odds.away }) }}
                         className={`py-3 rounded-lg font-bold text-sm transition border
                         ${selectedMatch?.id === match.id && selectedOdd?.type === 'away' 
                             ? 'bg-emerald-600 border-emerald-500 text-white' 
                             : 'bg-slate-950 border-slate-800 text-emerald-400 hover:bg-slate-800'}`}
                    >
                        <span className="block text-[10px] text-slate-500 mb-1">FORA</span>
                        {match.odds.away.toFixed(2)}
                    </button>
                </div>
            </div>
        ))}
      </div>

      {/* Modal de Aposta (Aparece quando seleciona algo) */}
      {selectedMatch && selectedOdd && (
          <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 p-6 animate-in slide-in-from-bottom-10 shadow-2xl">
              <div className="max-w-2xl mx-auto">
                  <div className="flex justify-between items-center mb-4">
                      <div>
                          <p className="text-slate-400 text-xs uppercase font-bold">Sua Aposta</p>
                          <p className="font-bold text-white">Vencedor: {selectedOdd.type === 'draw' ? 'Empate' : (selectedOdd.type === 'home' ? selectedMatch.home : selectedMatch.away)}</p>
                          <p className="text-emerald-400 text-sm font-bold">Odd: {selectedOdd.val.toFixed(2)}</p>
                      </div>
                      <button onClick={() => setSelectedMatch(null)} className="text-slate-500 hover:text-white">Cancelar</button>
                  </div>
                  
                  <div className="flex gap-2">
                      <div className="relative flex-1">
                          <span className="absolute left-3 top-3 text-slate-500 font-bold">R$</span>
                          <input 
                            type="number" 
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg py-3 pl-10 text-white font-bold outline-none focus:border-emerald-500"
                            placeholder="Valor"
                            value={betAmount}
                            onChange={(e) => setBetAmount(e.target.value)}
                          />
                      </div>
                      <button 
                        onClick={placeBet}
                        disabled={loading}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 rounded-lg flex items-center gap-2"
                      >
                        {loading ? <Loader2 className="animate-spin"/> : <><DollarSign size={18}/> APOSTAR</>}
                      </button>
                  </div>
                  {betAmount && (
                      <p className="text-xs text-slate-500 mt-2 text-center">
                          Retorno Potencial: <span className="text-emerald-400 font-bold">R$ {(Number(betAmount) * selectedOdd.val).toFixed(2)}</span>
                      </p>
                  )}
              </div>
          </div>
      )}

    </div>
  );
}