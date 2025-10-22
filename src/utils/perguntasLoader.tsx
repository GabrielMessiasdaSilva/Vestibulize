import type { Pergunta } from '../data/perguntasQuiz';
import { perguntasMatematica } from '../data/perguntas/matematica';
import { perguntasCN } from '../data/perguntas/ciencias_natureza';
import { perguntasLinguagens } from '../data/perguntas/linguagens';
import { perguntasCH } from '../data/perguntas/ciencias_humanas';

const provasFatecMap: { [key: string]: () => Pergunta[] } = {
  'fatec_2024_s2': () => require('../data/perguntas/Fatec/2024_2s.json'),
  'fatec_2024_s1': () => require('../data/perguntas/Fatec/2024_1s.json'),
  'fatec_2023_s2': () => require('../data/perguntas/Fatec/2023_2s.json'),
  'fatec_2023_s1': () => require('../data/perguntas/Fatec/2023_1s.json'),
  'fatec_2022_s2': () => require('../data/perguntas/Fatec/2022_2s.json'),
  'fatec_2020_s1': () => require('../data/perguntas/Fatec/2020_1s.json'),
};

export function carregarPerguntasProva(exameId: string): Pergunta[] {
  const loadFunction = provasFatecMap[exameId];
  if (loadFunction) {
    const perguntas = loadFunction();
    return perguntas;
  } else {
    console.warn(`Prova com ID "${exameId}" não encontrada.`);
    return [];
  }
}

export function sortearPerguntas(categoria: Pergunta['categoria'], quantidade = 10): Pergunta[] {
    let perguntasFiltradas: Pergunta[] = [];

    switch (categoria) {
        case 'matematica':
            perguntasFiltradas = perguntasMatematica;
            break;
        case 'ciencias_natureza':
            perguntasFiltradas = perguntasCN;
            break;
        case 'linguagens':
            perguntasFiltradas = perguntasLinguagens;
            break;
        case 'ciencias_humanas':
            perguntasFiltradas = perguntasCH;
            break;
    }

    const sorteadas = [...perguntasFiltradas]
        .sort(() => Math.random() - 0.5)
        .slice(0, quantidade);

    return sorteadas;
}
