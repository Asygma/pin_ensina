"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import styles from './page.module.css';

const materias = [
  { id: 'portugues', name: 'Português', color: 'var(--portuguese)', icon: '📖' },
  { id: 'matematica', name: 'Matemática', color: 'var(--math)', icon: '🔢' },
  { id: 'estudo-do-meio', name: 'Estudo do Meio', color: 'var(--science)', icon: '🌍' },
  { id: 'ingles', name: 'Inglês', color: 'var(--english)', icon: '🗣️' },
];

export default function Materias() {
  const [studentName, setStudentName] = useState('');
  const router = useRouter();

  useEffect(() => {
    const name = localStorage.getItem('studentName');
    if (!name) {
      router.push('/');
    } else {
      setStudentName(name);
    }
  }, [router]);

  return (
    <>
      <Header />
      <main className="container animate-fade-in" style={{ padding: '2rem' }}>
        <div className={styles.headerSection}>
          <h1 className={styles.title}>
            Olá, <span style={{ color: 'var(--primary)' }}>{studentName}</span>! 👋
          </h1>
          <p className={styles.subtitle}>O que vamos aprender hoje com o Pin?</p>
        </div>

        <div className={styles.grid}>
          {materias.map((materia) => (
            <button
              key={materia.id}
              className={`${styles.card} animate-pop`}
              style={{ '--card-color': materia.color } as React.CSSProperties}
              onClick={() => router.push(`/quiz?materia=${materia.id}`)}
            >
              <div className={styles.icon}>{materia.icon}</div>
              <h2 className={styles.cardTitle}>{materia.name}</h2>
            </button>
          ))}
        </div>
      </main>
    </>
  );
}
