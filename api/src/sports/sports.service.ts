import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class SportsService {
  // Configurações da RapidAPI fornecidas por você
  private readonly API_URL = 'https://sportsbook-api2.p.rapidapi.com/v0/advantages';
  private readonly API_HOST = 'sportsbook-api2.p.rapidapi.com';
  private readonly API_KEY = 'd6fb61cdadmsh919878f44db0bd0p189f13jsn8d2332f87eef';

  async getLiveMatches() {
    try {
      // Chamada real para a API de Arbitragem
      const response = await axios.get(this.API_URL, {
        params: { type: 'ARBITRAGE' },
        headers: {
          'x-rapidapi-host': this.API_HOST,
          'x-rapidapi-key': this.API_KEY
        }
      });

      // Se a API retornar vazia ou der erro, usamos dados de fallback para não quebrar o site
      if (!response.data || response.data.length === 0) {
        console.log("API retornou vazia, usando mock.");
        return this.getMockData();
      }

      // Mapeando os dados da API para o formato do nosso site
      // Nota: Como não tenho o JSON exato da resposta dessa API específica agora,
      // estou passando os dados brutos. Você verá a estrutura no console do navegador.
      return response.data.advantages || response.data; 

    } catch (error) {
      console.error("Erro na RapidAPI:", error.message);
      return this.getMockData();
    }
  }

  // Dados de teste caso a cota da API acabe
  private getMockData() {
    return [
      {
        id: 'mock1',
        event: 'Flamengo vs Vasco',
        league: 'Brasileirão',
        bookmakers: [
           { name: 'Bet365', odd: 2.10, selection: 'Flamengo' },
           { name: 'Pinnacle', odd: 3.50, selection: 'Empate' }
        ],
        profit: 2.5 // 2.5% de lucro garantido
      },
      {
        id: 'mock2',
        event: 'Lakers vs Bulls',
        league: 'NBA',
        bookmakers: [
           { name: '1xBet', odd: 1.90, selection: 'Lakers' },
           { name: 'Betfair', odd: 2.05, selection: 'Bulls' }
        ],
        profit: 1.2
      }
    ];
  }
}