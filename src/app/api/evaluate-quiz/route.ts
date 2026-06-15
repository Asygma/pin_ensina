import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: Request) {
  try {
    const { materia, studentName, questions, answers } = await request.json();

    const prompt = `Você é o Pin, um professor divertido que ajuda crianças do 4º ano em Portugal. Você DEVE responder utilizando EXCLUSIVAMENTE o Português de Portugal (pt-PT).
    O aluno chama-se "${studentName}" e acabou de responder a um teste de ${materia}.
    Aqui estão as perguntas e as respostas dadas:
    ${JSON.stringify({ questions, answers }, null, 2)}
    
    Avalie o teste. Responda APENAS com um JSON contendo:
    "score": um número de 0 a 100 indicando a pontuação geral baseada nas respostas corretas.
    "feedback": uma mensagem divertida e encorajadora do Pin (1 parágrafo). Dirija-se sempre diretamente ao(à) "${studentName}". Evite usar palavras marcadas com gênero como "campeão" ou "campeã", utilize adjetivos neutros ou chame pelo nome.
    "improvements": um array de strings curtas listando exata e especificamente os temas da matéria em que o aluno errou e precisa de reforço. Seja específico (ex: "Tabuada do 7", "Diferença entre sismos e vulcões"). Se o aluno acertou tudo, coloque algo como "Continuar a ler muito!".`;

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
