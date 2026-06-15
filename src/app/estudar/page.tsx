"use client";

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import { TEMAS_FIXOS, TemaFixo } from '@/config/temas';
import styles from './page.module.css';

function EstudarContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const materia = searchParams.get('materia');

  const [studentName, setStudentName] = useState('');
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedTema, setSelectedTema] = useState<TemaFixo | null>(null);

  useEffect(() => {
    const name = localStorage.getItem('studentName');
    if (!name || !materia) {
      router.push('/');
      return;
    }
    setStudentName(name);
  }, [materia, router]);

  const fetchContent = async (temaId?: string) => {
    setLoading(true);
    setContent(null);
    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ materia, temaId })
      });
      const data = await response.json();
      setContent(data);
    } catch (error) {
      console.error("Error fetching content:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTemaClick = (tema: TemaFixo) => {
    setSelectedTema(tema);
    fetchContent(tema.id);
  };

  const temasDaMateria = TEMAS_FIXOS.filter(t => t.materiaId === materia);

  // ESTADO 1: Galeria de Temas
  if (!loading && !content) {
    return (
      <main className="container animate-fade-in" style={{ padding: '2rem' }}>
        <h1 className={styles.title}>O que vamos aprender hoje?</h1>
        <p style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '1.2rem', color: 'var(--text-light)' }}>
          Escolhe um tema abaixo para veres o resumo ilustrado, ou gera um resumo surpresa!
        </p>

        <div className={styles.temasGrid}>
          {temasDaMateria.map(tema => (
            <div key={tema.id} className={styles.temaCard} onClick={() => handleTemaClick(tema)}>
              <img src={tema.imagem} alt={tema.titulo} className={styles.temaImage} />
              <div className={styles.temaTitle}>{tema.titulo}</div>
            </div>
          ))}
          <div className={styles.temaCard} onClick={() => fetchContent()}>
            <div className={styles.randomTemaIcon}>🎲</div>
            <div className={styles.temaTitle}>Resumo Surpresa!</div>
          </div>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
           <button className="btn-secondary" onClick={() => router.push(`/materia/${materia}`)}>Voltar</button>
        </div>
      </main>
    );
  }

  // ESTADO 2: Carregando
  if (loading) {
    return (
      <main className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div className={styles.loading}>
          <div className="animate-float" style={{ fontSize: '3rem' }}>💡</div>
          <h2>O Pin está a escrever o teu resumo...</h2>
        </div>
      </main>
    );
  }

  // ESTADO 3: Mostrando Conteúdo
  return (
    <main className="container animate-fade-in">
      <div className={styles.contentCard}>
        {selectedTema && (
          <img src={selectedTema.imagem} alt={selectedTema.titulo} className={styles.bannerImage} />
        )}
        <h1 className={styles.title}>{content?.title || "Revisão"}</h1>
        
        <div className={styles.textContent}>
          {content?.content?.split('\n').map((paragraph: string, idx: number) => {
            if (!paragraph.trim()) return null;
            return <p key={idx} className={styles.paragraph}>{paragraph}</p>;
          })}
        </div>

        <div className={styles.actionRow}>
          <button className="btn-secondary" onClick={() => { setContent(null); setSelectedTema(null); }}>
            Ler Outro Tema
          </button>
          <button className="btn-primary" onClick={() => router.push(`/quiz?materia=${materia}`)}>
            Fazer o Teste Agora!
          </button>
        </div>
      </div>
    </main>
  );
}

export default function Estudar() {
  return (
    <>
      <Header />
      <Suspense fallback={<div style={{textAlign: 'center', marginTop: '5rem'}}>A carregar...</div>}>
        <EstudarContent />
      </Suspense>
    </>
  );
}
