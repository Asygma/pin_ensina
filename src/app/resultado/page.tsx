"use client";

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import styles from './page.module.css';

function ResultadoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const materia = searchParams.get('materia');

  const [studentName, setStudentName] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const name = localStorage.getItem('studentName');
    if (!name || !materia) {
      router.push('/');
      return;
    }
    setStudentName(name);

    // Na versão final real, os dados do teste (questões e respostas do aluno) 
    // seriam passados do estado global ou localStorage para aqui avaliar.
    // Para efeito de demonstração, simulamos que passamos para o backend:
    const evaluateTest = async () => {
      try {
        const response = await fetch('/api/evaluate-quiz', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            materia, 
            studentName: name,
            questions: [], // Em um ambiente real, pegaríamos de localStorage/Context
            answers: {} 
          })
        });
        const data = await response.json();
        setResult(data);
      } catch (error) {
        console.error("Error evaluating:", error);
      } finally {
        setLoading(false);
      }
    };

    evaluateTest();
  }, [materia, router]);

  if (loading) {
    return (
      <main className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div className={styles.loading}>
          <div className="animate-float" style={{ fontSize: '3rem' }}>🧐</div>
          <h2>O Pin está a corrigir as tuas respostas...</h2>
        </div>
      </main>
    );
  }

  if (!result) {
    return <main className="container"><h2>Erro ao carregar o resultado!</h2></main>;
  }

  return (
    <main className="container animate-fade-in">
      <div className={styles.resultCard}>
        <div className={styles.scoreCircle}>
          <span className={styles.scoreValue}>{result.score || 100}</span>
          <span className={styles.scoreLabel}>Pontos</span>
        </div>
        
        <h1 className={styles.title}>Feedback do Pin</h1>
        <p className={styles.feedback}>{result.feedback}</p>

        {result.improvements && result.improvements.length > 0 && (
          <div className={styles.improvementsBox}>
            <h3 className={styles.improvementsTitle}>Vamos melhorar juntos nestes pontos:</h3>
            <ul className={styles.improvementsList}>
              {result.improvements.map((item: string, idx: number) => (
                <li key={idx}>⭐ {item}</li>
              ))}
            </ul>
          </div>
        )}

        <button className="btn-primary" onClick={() => router.push('/materias')}>
          Fazer Novo Teste
        </button>
      </div>
    </main>
  );
}

export default function Resultado() {
  return (
    <>
      <Header />
      <Suspense fallback={<div style={{textAlign: 'center', marginTop: '5rem'}}>A carregar o resultado...</div>}>
        <ResultadoContent />
      </Suspense>
    </>
  );
}
