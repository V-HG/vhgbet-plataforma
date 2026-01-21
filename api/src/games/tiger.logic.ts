// src/games/tiger.logic.ts

// Tabela de multiplicadores (Ex: 3 Wilds pagam 50x a aposta)
export const PAYTABLE = {
  wild: 50,
  pote: 20,
  saco: 10,
  envelope: 5,
  carteira: 3,
  laranja: 1,
  foguete: 0.5
};

// Lista de símbolos disponíveis para o sorteio
const SYMBOLS_LIST = Object.keys(PAYTABLE);

// As 5 linhas de pagamento (Coordenadas: Linha, Coluna)
const PAYLINES = [
  [{r:0, c:0}, {r:0, c:1}, {r:0, c:2}], // Linha 1 (Topo)
  [{r:1, c:0}, {r:1, c:1}, {r:1, c:2}], // Linha 2 (Meio)
  [{r:2, c:0}, {r:2, c:1}, {r:2, c:2}], // Linha 3 (Baixo)
  [{r:0, c:0}, {r:1, c:1}, {r:2, c:2}], // Linha 4 (Diagonal \)
  [{r:2, c:0}, {r:1, c:1}, {r:0, c:2}], // Linha 5 (Diagonal /)
];

export class TigerGameLogic {

  // Função que gira a roleta e gera a matriz 3x3
  static spin(): string[][] {
    const grid: string[][] = [];
    for (let i = 0; i < 3; i++) {
      // Tipagem explícita para evitar erro de 'never[]'
      const row: string[] = [];
      for (let j = 0; j < 3; j++) {
        const randomSymbol = SYMBOLS_LIST[Math.floor(Math.random() * SYMBOLS_LIST.length)];
        row.push(randomSymbol);
      }
      grid.push(row);
    }
    return grid;
  }

  // Função que calcula se houve vitória nas linhas
  static calculateWin(grid: string[][], betAmount: number) {
    let totalWin = 0;
    
    // Tipagem explícita do array de linhas vencedoras
    const winningLines: { lineIndex: number; symbol: string; amount: number }[] = [];
    
    for (let i = 0; i < PAYLINES.length; i++) {
      const line = PAYLINES[i];
      const s1 = grid[line[0].r][line[0].c];
      const s2 = grid[line[1].r][line[1].c];
      const s3 = grid[line[2].r][line[2].c];

      // Inicializa como nulo ou string
      let matchSymbol: string | null = null;

      // Lógica do Wild (Coringa)
      if (s1 !== 'wild') matchSymbol = s1;
      else if (s2 !== 'wild') matchSymbol = s2;
      else if (s3 !== 'wild') matchSymbol = s3;
      else matchSymbol = 'wild'; // Se todos forem wild

      const isMatch1 = (s1 === matchSymbol || s1 === 'wild');
      const isMatch2 = (s2 === matchSymbol || s2 === 'wild');
      const isMatch3 = (s3 === matchSymbol || s3 === 'wild');

      // Só processa se houver match e o símbolo não for nulo
      if (isMatch1 && isMatch2 && isMatch3 && matchSymbol !== null) {
        const multiplier = PAYTABLE[matchSymbol as keyof typeof PAYTABLE];
        const lineWin = betAmount * multiplier;
        
        totalWin += lineWin;
        winningLines.push({
          lineIndex: i + 1, // +1 para ser Linha 1 a 5 (mais amigável)
          symbol: matchSymbol,
          amount: lineWin
        });
      }
    }

    return {
      grid,
      totalWin,
      winningLines,
      isWin: totalWin > 0
    };
  }
}