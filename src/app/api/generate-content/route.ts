import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { TEMAS_FIXOS } from '@/config/temas';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const PROMPTS: Record<string, string> = {
  portugues: "Faça um resumo bem divertido e direto sobre Português para o 4º ano (ensino de Portugal). Foque em interpretação de texto, preposições e pronomes.",
  matematica: "Faça um resumo divertido de Matemática para o 4º ano (ensino de Portugal). Foque em valor posicional até centenas de milhar e simetria.",
  'estudo-do-meio': "Faça um resumo divertido sobre Estudo do Meio para o 4º ano (Portugal). Foque no Sistema Solar, camadas da Terra e vulcões.",
  ingles: "Faça um resumo divertido de Inglês focado em conversação básica para o 4º ano (em Português de Portugal)."
};

export async function POST(request: Request) {
  try {
    const { materia, temaId } = await request.json();
    
    let basePrompt = '';
    
    if (temaId) {
      const temaFixo = TEMAS_FIXOS.find(t => t.id === temaId);
      if (temaFixo) {
        basePrompt = `Você é o Pin, um professor divertido que ensina crianças de Portugal. Responda APENAS em Português de Portugal (pt-PT). ${temaFixo.prompt}`;
      }
    }

    if (!basePrompt) {
      basePrompt = `Você é o Pin, um professor divertido que ensina crianças de Portugal. Responda APENAS em Português de Portugal (pt-PT). ${PROMPTS[materia] || `Gere um material de estudo sobre ${materia}.`}`;
    }

    if (!PROMPTS[materia] && !temaId) {
      return NextResponse.json({ error: 'Matéria inválida' }, { status: 400 });
    }

    const prompt = `${basePrompt}
    Não seja muito extenso. Use no máximo 4 parágrafos curtos, utilizando emojis para torná-lo divertido.
    
    Responda APENAS com um JSON contendo as seguintes chaves:
    'title': O título divertido da revisão (ex: "Revisão Mágica de Matemática").
    'content': O texto da revisão, formatado com quebras de linha (\\n) onde apropriado, para ler de forma fácil.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        }
    });

    const data = JSON.parse(response.text || "{}");
    return NextResponse.json(data);
  } catch (error) {
    console.error("Erro ao gerar conteúdo:", error);
    return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 });
  }
}
