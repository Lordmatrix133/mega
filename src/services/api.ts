import { MegaSenaResult } from '../types';

/**
 * Fetches Mega Sena results from the API
 * @param timestamp Opcional: timestamp para evitar cache
 * @returns Promise with the results
 */
export const fetchMegaSenaResults = async (timestamp?: number): Promise<MegaSenaResult[]> => {
  try {
    // Obter todos os resultados diretamente da API
    const results = await fetchAllLoteriasResults(timestamp);
    
    if (!results || results.length === 0) {
      throw new Error('Nenhum resultado obtido da API');
    }
    
    console.log(`Obtido com sucesso ${results.length} resultados da Mega Sena`);
    return results;
  } catch (error) {
    console.error('Falha ao obter dados da API:', error);
    throw error; // Propagar o erro para ser tratado pelo componente
  }
};

/**
 * Obtém todos os resultados diretamente do endpoint da API loteriascaixa
 */
const fetchAllLoteriasResults = async (timestamp?: number): Promise<MegaSenaResult[]> => {
  try {
    // Usar o timestamp para evitar cache
    const ts = timestamp || new Date().getTime();
    const url = `https://loteriascaixa-api.herokuapp.com/api/megasena?_=${ts}`;
    
    const response = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    
    if (!response.ok) {
      throw new Error(`API de loterias falhou com status ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Formato de dados inválido');
    }
    
    // Mapear os dados para o formato usado na nossa aplicação
    return data.map(item => ({
      concurso: item.concurso,
      data: item.data, // Já está no formato DD/MM/YYYY
      dezenas: item.dezenas,
      dezenasOrdemSorteio: item.dezenasOrdemSorteio,
      local: item.local,
      trevos: item.trevos,
      timeCoracao: item.timeCoracao,
      mesSorte: item.mesSorte,
      localGanhadores: item.localGanhadores || [],
      estadosPremiados: item.estadosPremiados || [],
      premiacoes: item.premiacoes?.map((prem: any) => ({
        descricao: prem.descricao,
        faixa: prem.faixa,
        acertos: prem.descricao || `${prem.faixa === 1 ? '6' : prem.faixa === 2 ? '5' : '4'} acertos`,
        ganhadores: prem.ganhadores || 0,
        valorPremio: prem.valorPremio,
        premio: prem.valorPremio?.toString() || "0",
      })) || [],
      acumulou: item.acumulou === undefined ? (item.premiacoes?.[0]?.ganhadores === 0) : item.acumulou,
      valorAcumulado: item.valorAcumuladoProximoConcurso?.toString() || "0",
      dataProximoConcurso: item.dataProximoConcurso || "", // Pode ser vazio em concursos antigos
      valorEstimadoProximoConcurso: item.valorEstimadoProximoConcurso?.toString() || "0",
    }));
  } catch (error) {
    console.warn('API de loterias falhou:', error);
    throw error;
  }
};