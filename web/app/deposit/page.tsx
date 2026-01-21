"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { ArrowLeft, Copy, CheckCircle, Smartphone, Loader2, Wallet } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3000";

export default function Deposit() {
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [pixData, setPixData] = useState<any>(null);
  const [userWalletId, setUserWalletId] = useState("");

  useEffect(() => {
    // Busca o ID da carteira para usar no botão de teste
    const token = localStorage.getItem("token");
    if(token) {
        axios.get(`${API_URL}/users/profile`, {
            headers: { Authorization: `Bearer ${token}` }
        }).then(res => setUserWalletId(res.data.wallet.id));
    }
  }, []);

  const handleGeneratePix = async () => {
    if (!amount || Number(amount) <= 0) return alert("Digite um valor válido");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        `${API_URL}/payment/deposit`,
        { amount: Number(amount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPixData(data);
    } catch (error) {
      alert("Erro ao gerar PIX. Verifique se o Access Token do MP está configurado no Backend.");
    } finally {
      setLoading(false);
    }
  };

  const copyPix = () => {
    navigator.clipboard.writeText(pixData.qr_code);
    alert("Código PIX copiado!");
  };

  // --- FUNÇÃO PARA SIMULAR PAGAMENTO (DEV ONLY) ---
  const simulatePayment = async () => {
    try {
        await axios.post(`${API_URL}/payment/test/approve`, {
            walletId: userWalletId,
            amount: Number(amount)
        });
        alert("✅ Pagamento Simulado com Sucesso! Seu saldo deve ter subido.");
        window.location.href = "/";
    } catch (error) {
        alert("Erro na simulação");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 p-6 rounded-2xl border border-slate-700 shadow-2xl relative">
        
        <button 
            onClick={() => window.location.href = "/"} 
            className="absolute top-6 left-6 text-slate-400 hover:text-white flex items-center gap-1 text-sm transition"
        >
            <ArrowLeft size={16}/> Voltar
        </button>

        <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-emerald-500 mb-1 flex items-center justify-center gap-2">
                <Smartphone /> Depósito via PIX
            </h1>
            <p className="text-slate-400 text-sm">Adicione saldo instantaneamente.</p>
        </div>

        {!pixData ? (
            // TELA 1: Escolher Valor
            <div className="space-y-4">
                <div>
                    <label className="text-xs text-slate-400 font-bold uppercase ml-1">Valor do Depósito (R$)</label>
                    <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg px-3 py-3 mt-1 focus-within:border-emerald-500 transition">
                        <span className="text-emerald-500 font-bold mr-2">R$</span>
                        <input 
                            type="number" 
                            placeholder="50.00"
                            className="bg-transparent w-full text-white outline-none placeholder-slate-600 font-mono text-lg"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                    {[20, 50, 100].map(val => (
                        <button key={val} onClick={() => setAmount(val.toString())} className="bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold py-2 rounded border border-slate-700 text-sm transition">
                            R$ {val}
                        </button>
                    ))}
                </div>

                <button 
                    onClick={handleGeneratePix}
                    disabled={loading}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl mt-4 flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-900/20"
                >
                    {loading ? <Loader2 className="animate-spin"/> : "GERAR QR CODE"}
                </button>
            </div>
        ) : (
            // TELA 2: Pagar
            <div className="flex flex-col items-center animate-in zoom-in duration-300">
                <div className="bg-white p-2 rounded-lg mb-4">
                    {/* Imagem do QR Code Base64 retornada pelo MP */}
                    <img src={`data:image/jpeg;base64,${pixData.qr_code_base64}`} alt="QR Code Pix" className="w-48 h-48" />
                </div>

                <p className="text-white font-bold text-lg mb-4">R$ {Number(amount).toFixed(2)}</p>

                <div className="w-full bg-slate-950 p-3 rounded-lg border border-slate-800 mb-4 break-all">
                    <p className="text-[10px] text-slate-500 font-mono text-center line-clamp-3">{pixData.qr_code}</p>
                </div>

                <button 
                    onClick={copyPix}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl mb-4 flex items-center justify-center gap-2 transition border border-slate-600"
                >
                    <Copy size={18}/> COPIAR CÓDIGO PIX
                </button>

                <div className="w-full pt-4 border-t border-slate-800 mt-2">
                    <p className="text-center text-xs text-yellow-500 mb-2">AMBIENTE DE TESTE (LOCALHOST)</p>
                    <button 
                        onClick={simulatePayment}
                        className="w-full bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-400 border border-yellow-600/50 font-bold py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition"
                    >
                        <CheckCircle size={16}/> SIMULAR "PAGUEI"
                    </button>
                    <p className="text-[10px] text-slate-500 text-center mt-2">
                        (Clica aqui para fingir que o banco aprovou e ver o saldo cair)
                    </p>
                </div>
            </div>
        )}

      </div>
    </div>
  );
}