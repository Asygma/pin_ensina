import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: Request) {
  try {
    const { materia, studentName, questions, answers } = await request.json();

    const prompt = `Você é o Pin, um professor divertido que ajuda crianças do 4º ano em Portugal. Você DEVE responder utilizando EXCLUSIVAMENTE o Português de Portugal (pt-PT).
    O aluno ${studentName} acabou de responder um teste de ${materia}.
    Aqui estão as perguntas e as respostas dele:
    ${JSON.stringify({ questions, answers }, null, 2)}
    
    Avalie o teste. Responda APENAS com um JSON contendo:
    'score': um número de 0 a 100 indicando a pontuação geral.
    'feedback': uma mensagem divertida e encorajadora do Pin (1 parágrafo).
    'improvements': um array de strings curtas listando os pontos que a Gigi (ou o aluno) precisa reforçar.`;

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
    console.error("Erro ao avaliar quiz:", error);
    return NextResponse.json({ error: 'Failed to evaluate quiz' }, { status: 500 });
  }
}
