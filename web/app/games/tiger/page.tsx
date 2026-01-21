"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { ArrowLeft, Loader2, Gamepad2 } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3000";
const BET_AMOUNT = 5.00;

export default function TigerGame() {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [gridResult, setGridResult] = useState<string[][]>([]);

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
        console.error("Erro ao buscar saldo");
    }
  };

  const handleSpin = async () => {
    if (loading || balance < BET_AMOUNT) return;
    setLoading(true);
    setMessage("");
    setGridResult([]); 

    const token = localStorage.getItem("token");

    try {
      // 1. Desconta visualmente na hora (sensação de rapidez)
      setBalance((prev) => prev - BET_AMOUNT);

      // 2. Chama a API
      const { data } = await axios.post(
        `${API_URL}/games/tiger/spin`, 
        { amount: BET_AMOUNT },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 3. Atualiza com o resultado real
      setBalance(Number(data.newBalance));
      setGridResult(data.grid);

      if (data.winAmount > 0) {
        setMessage(`🎉 GANHOU R$ ${data.winAmount.toFixed(2)}!`);
      } else {
        setMessage("Tente novamente!");
      }

    } catch (err) {
      console.error(err);
      setBalance((prev) => prev + BET_AMOUNT); // Devolve o dinheiro se der erro de rede
      setMessage("❌ Erro de conexão");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      
      <div className="w-full max-w-md bg-slate-900 p-6 rounded-2xl border border-slate-700 shadow-2xl text-center relative">
        
        {/* Botão Sair */}
        <button 
            onClick={() => window.location.href = "/"} 
            className="absolute top-6 left-6 text-slate-400 hover:text-white flex items-center gap-1 text-sm transition"
        >
            <ArrowLeft size={16}/> Sair
        </button>

        <h1 className="text-2xl font-bold text-orange-500 mb-2">Fortune Tiger</h1>
        <p className="text-slate-400 text-sm mb-6">Saldo: <span className="text-white font-mono">R$ {balance.toFixed(2)}</span></p>

        {/* Grid do Jogo */}
        <div className="bg-slate-950 p-4 rounded-xl mb-6 border border-slate-800 min-h-[250px] flex flex-col justify-center relative overflow-hidden shadow-inner">
            {gridResult.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                    {gridResult.map((row, i) => (
                        row.map((symbol, j) => (
                            <div key={`${i}-${j}`} className={`aspect-square flex items-center justify-center rounded-lg bg-slate-800 text-xs md:text-sm font-bold capitalize border transition-all duration-500 animate-in zoom-in
                                ${symbol === 'wild' ? 'border-yellow-500 text-yellow-400 bg-yellow-900/20 shadow-[0_0_15px_rgba(234,179,8,0.4)]' : 
                                  symbol === 'pote' ? 'border-orange-500 text-orange-400' :
                                  'border-slate-700 text-slate-400'}`}>
                                {symbol}
                            </div>
                        ))
                    ))}
                </div>
            ) : (
                <div className="text-slate-600 flex flex-col items-center animate-pulse">
                    <Gamepad2 size={64} className="mb-4 opacity-20"/>
                    <p>Pressione Girar para começar</p>
                </div>
            )}
        </div>

        {/* Mensagem de Vitória */}
        <div className="h-8 mb-4">
           {message && <span className={`text-lg font-bold animate-pulse ${message.includes('GANHOU') ? 'text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]' : 'text-slate-400'}`}>{message}</span>}
        </div>

        {/* Botão de Ação */}
        <button
          onClick={handleSpin}
          disabled={loading || balance < BET_AMOUNT}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all active:scale-95 shadow-lg relative overflow-hidden group
              ${balance < BET_AMOUNT 
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white shadow-orange-900/20'}`}
        >
          {loading ? <Loader2 className="animate-spin mx-auto"/> : `GIRAR (R$ ${BET_AMOUNT.toFixed(2)})`}
        </button>
      </div>

    </div>
  );
}