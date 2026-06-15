export type TemaFixo = {
  id: string;
  materiaId: string;
  titulo: string;
  imagem: string;
  prompt: string;
};

export const TEMAS_FIXOS: TemaFixo[] = [
  // Estudo do Meio
  {
    id: 'sistema_solar',
    materiaId: 'estudo-do-meio',
    titulo: 'O Sistema Solar',
    imagem: '/temas/sistema_solar.png',
    prompt: 'Explique de forma divertida e simples o Sistema Solar, os planetas, e o sol. Use analogias que uma criança de 9 anos entenda.'
  },
  {
    id: 'sismos_vulcoes',
    materiaId: 'estudo-do-meio',
    titulo: 'Sismos e Vulcões',
    imagem: '/temas/sismos_vulcoes.png',
    prompt: 'Explique de forma divertida o que são sismos e como funcionam os vulcões, citando as camadas da Terra.'
  },

  // Matemática
  {
    id: 'matematica_numeros',
    materiaId: 'matematica',
    titulo: 'Valor Posicional e Decimais',
    imagem: '/temas/matematica_numeros.png',
    prompt: 'Ensine o conceito de valor posicional (unidade, dezena, centena de milhar) e explique como funcionam os números decimais após a vírgula.'
  },
  {
    id: 'matematica_simetria',
    materiaId: 'matematica',
    titulo: 'A Magia da Simetria',
    imagem: '/temas/matematica_simetria.png',
    prompt: 'Explique o que é simetria de rotação usando exemplos simples e práticos (como uma borboleta ou um catavento).'
  },

  // Português
  {
    id: 'portugues_letras',
    materiaId: 'portugues',
    titulo: 'Os Segredos das Palavras',
    imagem: '/temas/portugues_letras.png',
    prompt: 'Faça uma revisão divertida sobre como interpretar um texto, o que são preposições, pronomes e determinantes interrogativos.'
  },

  // Inglês
  {
    id: 'ingles_hello',
    materiaId: 'ingles',
    titulo: 'Hello! Conversação Básica',
    imagem: '/temas/ingles_hello.png',
    prompt: 'Ensine expressões básicas de conversação em Inglês: como dizer oi, perguntar o nome, idade e como se despedir. Coloque a tradução entre parênteses.'
  }
];
