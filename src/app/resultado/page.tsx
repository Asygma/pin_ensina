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

    const savedData = sessionStorage.getItem('lastQuizData');
    let quizData = { questions: [], answers: {} };
    if (savedData) {
      try {
        quizData = JSON.parse(savedData);
      } catch (e) {
        console.error('Error parsing quiz data', e);
      }
    }

    const evaluateTest = async () => {
      try {
        const response = await fetch('/api/evaluate-quiz', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            materia, 
            studentName: name,
            questions: quizData.questions,
            answers: quizData.answers 
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
          <span className={styles.scoreValue}>{result.score || 0}</span>
          <span className={styles.scoreLabel}>Pontos</span>
        </div>
        
        <img src="/pin.jpeg" alt="O Pin" style={{ width: '100px', height: '100px', borderRadius: '50%', marginBottom: '1rem', border: '4px solid var(--secondary)' }} />
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
            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
              <button className="btn-secondary" onClick={() => router.push(`/estudar?materia=${materia}`)}>
                Ir para Revisão (Aprender com o Pin)
              </button>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button className="btn-primary" onClick={() => router.push(`/quiz?materia=${materia}`)}>
            Refazer o Teste
          </button>
          <button className="btn-secondary" onClick={() => router.push(`/materia/${materia}`)}>
            Voltar ao Menu
          </button>
        </div>
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
