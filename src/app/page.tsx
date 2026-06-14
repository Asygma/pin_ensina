"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import styles from './page.module.css';

export default function Home() {
  const [name, setName] = useState('');
  const router = useRouter();

  useEffect(() => {
    // If name is already in local storage, we could redirect or show a welcome back
  }, []);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      localStorage.setItem('studentName', name.trim());
      router.push('/materias');
    }
  };

  return (
    <>
      <Header />
      <main className="container animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, textAlign: 'center', marginTop: '4rem' }}>
        <h1 className={styles.heroTitle}>
          Pronto para aprender com o <span style={{ color: 'var(--primary)' }}>Pin</span>?
        </h1>
        <p className={styles.heroSubtitle}>
          Testes dinâmicos, muita diversão e tudo que você precisa para arrasar no 4º ano!
        </p>

        <form onSubmit={handleStart} className={styles.nameForm}>
          <input 
            type="text" 
            placeholder="Qual é o seu primeiro nome?" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.input}
            required
            maxLength={15}
          />
          <button type="submit" className="btn-primary animate-pop">
            Começar Aventura!
          </button>
        </form>
      </main>
    </>
  );
}
