import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const basePrompt = `Você é o Pin, um professor divertido que ajuda crianças do 4º ano em Portugal. Você DEVE responder utilizando EXCLUSIVAMENTE o Português de Portugal (pt-PT). Utilize termos adequados ao currículo do 4º ano do Ensino Básico de Portugal.`;

const PROMPTS: Record<string, string> = {
  portugues: `${basePrompt} Gere um teste interativo sobre a matéria de Português (interpretação de texto, determinantes interrogativos, preposições, e pronomes). O teste deve ter exatamente 5 perguntas. A última pergunta (tipo "written") deve ser uma questão aberta/discursiva. As outras 4 devem ser de múltipla escolha. Responda APENAS com um JSON válido contendo um array "questions" onde cada questão tem "id" (string), "type" ("multiple_choice" ou "written"), "text" (a pergunta), e "options" (se for múltipla escolha, um array de 4 strings).`,
  matematica: `${basePrompt} Gere um teste de 5 perguntas de Matemática. Temas: Valor posicional, adição/subtração com decimais, simetria, probabilidade. Faça 4 de múltipla escolha e 1 escrita. Responda APENAS com um JSON válido contendo um array "questions" onde cada questão tem "id" (string), "type" ("multiple_choice" ou "written"), "text" (a pergunta), e "options" (se for múltipla escolha, um array de 4 strings).`,
  'estudo-do-meio': `${basePrompt} Gere um teste de 5 perguntas de Estudo do Meio. Temas: Sistema Solar, camadas da Terra, sismos e vulcões. Faça 4 de múltipla escolha e 1 escrita. Responda APENAS com um JSON válido contendo um array "questions" onde cada questão tem "id" (string), "type" ("multiple_choice" ou "written"), "text" (a pergunta), e "options" (se for múltipla escolha, um array de 4 strings).`,
  ingles: `${basePrompt} Gere um teste de Inglês focado em conversação básica e gramática introdutória. Faça 4 perguntas de múltipla escolha e 1 escrita (ex: perguntando como se apresentar). As perguntas podem ser em inglês, mas as instruções devem estar em Português de Portugal. Responda APENAS com um JSON válido contendo um array "questions" onde cada questão tem "id" (string), "type" ("multiple_choice" ou "written"), "text" (a pergunta), e "options" (se for múltipla escolha, um array de 4 strings).`
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

    let resultText = response.text || "{}";
    
    // Fallback: Remove markdown backticks if Gemini accidentally includes them
    if (resultText.startsWith('\`\`\`json')) {
      resultText = resultText.replace(/^\`\`\`json\n/, '').replace(/\n\`\`\`$/, '');
    } else if (resultText.startsWith('\`\`\`')) {
      resultText = resultText.replace(/^\`\`\`\n/, '').replace(/\n\`\`\`$/, '');
    }

    const data = JSON.parse(resultText);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Erro ao gerar quiz:", error);
    return NextResponse.json({ error: 'Failed to generate quiz', details: error?.message || 'Unknown error', stack: error?.stack }, { status: 500 });
  }
}
