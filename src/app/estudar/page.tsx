"use client";

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import styles from './page.module.css';

function EstudarContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const materia = searchParams.get('materia');

  const [studentName, setStudentName] = useState('');
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const name = localStorage.getItem('studentName');
    if (!name || !materia) {
      router.push('/');
      return;
    }
    setStudentName(name);

    const fetchContent = async () => {
      try {
        const response = await fetch('/api/generate-content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ materia })
        });
        const data = await response.json();
        setContent(data);
      } catch (error) {
        console.error("Erro ao buscar conteúdo:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [materia, router]);

  if (loading) {
    return (
      <main className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div className={styles.loading}>
          <div className="animate-float" style={{ fontSize: '3rem' }}>🤔</div>
          <h2>O Pin está a preparar o teu resumo...</h2>
        </div>
      </main>
    );
  }

  if (!content) {
    return <main className="container"><h2>Erro ao carregar o conteúdo!</h2></main>;
  }

  return (
    <main className="container animate-fade-in">
      <div className={styles.contentCard}>
        <h1 className={styles.title}>{content.title}</h1>
        <div className={styles.textContent}>
          {content.content.split('\n').map((paragraph: string, index: number) => (
            paragraph.trim() !== '' && <p key={index} className={styles.paragraph}>{paragraph}</p>
          ))}
        </div>

        <div className={styles.actionRow}>
          <button className="btn-secondary" onClick={() => router.push(`/materia/${materia}`)}>
            Voltar
          </button>
          <button className="btn-primary" onClick={() => router.push(`/quiz?materia=${materia}`)}>
            Ir para o Teste!
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
      <Suspense fallback={<div style={{textAlign: 'center', marginTop: '5rem'}}>A carregar resumo...</div>}>
        <EstudarContent />
      </Suspense>
    </>
  );
}
