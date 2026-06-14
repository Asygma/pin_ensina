import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const PROMPTS: Record<string, string> = {
  portugues: "Crie um pequeno quiz de 5 perguntas de Português para uma criança do 4º ano (ensino de Portugal). Temas: interpretação de texto, determinantes interrogativos, preposições, e pronomes. Faça 4 perguntas de múltipla escolha e 1 escrita. Responda APENAS com um JSON válido contendo um array 'questions' onde cada questão tem 'id' (string), 'type' ('multiple_choice' ou 'written'), 'text' (a pergunta), e 'options' (se for múltipla escolha, um array de 4 strings).",
  matematica: "Crie um quiz de 5 perguntas de Matemática para uma criança do 4º ano (ensino de Portugal). Temas: Valor posicional até centenas de milhar, adição/subtração com decimais, simetria de rotação, probabilidade simples. Faça 4 de múltipla escolha e 1 escrita (ex: pedindo para justificar). Responda APENAS com um JSON válido no formato {'questions': [{id, type, text, options}]}.",
  'estudo-do-meio': "Crie um quiz de 5 perguntas de Estudo do Meio para o 4º ano (Portugal). Temas: Sistema Solar, camadas da Terra, sismos e vulcões, e tecnologia. Faça 4 de múltipla escolha e 1 escrita. Responda APENAS com um JSON válido no formato {'questions': [{id, type, text, options}]}.",
  ingles: "Crie um quiz de Inglês (nível 4º ano indo para o 5º) focado em conversação básica e gramática introdutória. Faça 4 perguntas de múltipla escolha e 1 escrita (ex: perguntando como se apresentar). Responda APENAS com um JSON válido no formato {'questions': [{id, type, text, options}]}."
};

export async function POST(request: Request) {
  try {
    const { materia } = await request.json();
    const prompt = PROMPTS[materia];

    if (!prompt) {
      return NextResponse.json({ error: 'Matéria inválida' }, { status: 400 });
    }

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        }
    });

    const resultText = response.text || "{}";
    const data = JSON.parse(resultText);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Erro ao gerar quiz:", error);
    return NextResponse.json({ error: 'Failed to generate quiz' }, { status: 500 });
  }
}
