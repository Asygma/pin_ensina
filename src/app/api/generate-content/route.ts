import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: Request) {
  try {
    const { materia } = await request.json();

    const prompt = `Você é o Pin, um professor divertido que ajuda crianças do 4º ano em Portugal.
    Você DEVE responder utilizando exclusivamente o Português de Portugal (pt-PT). Utilize termos adequados ao currículo do 4º ano do Ensino Básico de Portugal.
    
    Gere um material de estudo/revisão muito simples, curto e focado sobre a matéria de "${materia}".
    O material deve ser focado em preparar o aluno para perguntas básicas dessa matéria.
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
