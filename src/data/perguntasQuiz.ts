export type Pergunta = {
  id: number;
  texto: string;
  imagem_url?: string | null;
  alternativas: { [letra: string]: string };
  correta: string;
  categoria: string;
  origem: 'enem' | 'FATEC';
  exame_id: string;
  exame_questao_num?: number;
  ano?: number;
};