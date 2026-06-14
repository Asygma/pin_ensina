"use client";

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import styles from './page.module.css';

export default function MateriaDashboard({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [studentName, setStudentName] = useState('');
  const unwrappedParams = use(params);
  const materiaId = unwrappedParams.id;

  useEffect(() => {
    const name = localStorage.getItem('studentName');
    if (!name) {
      router.push('/');
    } else {
      setStudentName(name);
    }
  }, [router]);

  const materiaNames: Record<string, string> = {
    'portugues': 'Português',
    'matematica': 'Matemática',
    'estudo-do-meio': 'Estudo do Meio',
    'ingles': 'Inglês',
  };

  const materiaName = materiaNames[materiaId] || materiaId;

  return (
    <>
      <Header />
      <main className="container animate-fade-in" style={{ padding: '2rem' }}>
        <div className={styles.headerSection}>
          <h1 className={styles.title}>Vamos lá, {studentName}! 🚀</h1>
          <p className={styles.subtitle}>O que queres fazer em {materiaName}?</p>
        </div>

        <div className={styles.dashboardGrid}>
          <button 
            className={`${styles.actionCard} animate-pop`} 
            style={{ '--card-color': 'var(--secondary)' } as React.CSSProperties}
            onClick={() => router.push(`/estudar?materia=${materiaId}`)}
          >
            <div className={styles.icon}>📚</div>
            <h2>Aprender com o Pin</h2>
            <p>Um pequeno resumo focado na matéria de hoje.</p>
          </button>

          <button 
            className={`${styles.actionCard} animate-pop`} 
            style={{ '--card-color': 'var(--primary)' } as React.CSSProperties}
            onClick={() => router.push(`/quiz?materia=${materiaId}`)}
          >
            <div className={styles.icon}>📝</div>
            <h2>Fazer o Teste</h2>
            <p>5 perguntinhas para testar o que sabes!</p>
          </button>

          {materiaId === 'matematica' && (
            <button 
              className={`${styles.actionCard} animate-pop`} 
              style={{ '--card-color': 'var(--math)' } as React.CSSProperties}
              onClick={() => router.push(`/desafio-matematica`)}
            >
              <div className={styles.icon}>⏱️</div>
              <h2>Treino de Velocidade</h2>
              <p>Sê o mais rápido nas contas!</p>
            </button>
          )}
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <button className="btn-secondary" onClick={() => router.push('/materias')}>
            Voltar para as matérias
          </button>
        </div>
      </main>
    </>
  );
}
