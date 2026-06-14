"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import styles from './page.module.css';

type MathProblem = {
  num1: number;
  num2: number;
  operator: string;
  answer: number;
};

const TOTAL_QUESTIONS = 10;

function generateProblems(): MathProblem[] {
  const problems: MathProblem[] = [];
  const operators = ['+', '-', 'x', '÷'];

  for (let i = 0; i < TOTAL_QUESTIONS; i++) {
    const operator = operators[Math.floor(Math.random() * operators.length)];
    let num1 = 0;
    let num2 = 0;
    let answer = 0;

    switch (operator) {
      case '+':
        num1 = Math.floor(Math.random() * 90) + 10; // 10 a 99
        num2 = Math.floor(Math.random() * 90) + 10;
        answer = num1 + num2;
        break;
      case '-':
        num1 = Math.floor(Math.random() * 90) + 10;
        num2 = Math.floor(Math.random() * (num1 - 1)) + 1; // Garante que não é negativo
        answer = num1 - num2;
        break;
      case 'x':
        num1 = Math.floor(Math.random() * 9) + 2; // 2 a 10
        num2 = Math.floor(Math.random() * 9) + 2;
        answer = num1 * num2;
        break;
      case '÷':
        num2 = Math.floor(Math.random() * 9) + 2; // Divisor de 2 a 10
        answer = Math.floor(Math.random() * 9) + 2; // Resultado de 2 a 10
        num1 = num2 * answer; // Garante divisão exata
        break;
    }

    problems.push({ num1, num2, operator, answer });
  }

  return problems;
}

export default function DesafioMatematica() {
  const router = useRouter();
  const [studentName, setStudentName] = useState('');
  const [problems, setProblems] = useState<MathProblem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const name = localStorage.getItem('studentName');
    if (!name) {
      router.push('/');
      return;
    }
    setStudentName(name);
    setProblems(generateProblems());
    
    const savedScores = localStorage.getItem('mathLeaderboard');
    if (savedScores) {
      setLeaderboard(JSON.parse(savedScores));
    }
  }, [router]);

  useEffect(() => {
    if (startTime && !isFinished) {
      timerRef.current = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 100);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTime, isFinished]);

  const startChallenge = () => {
    setStartTime(Date.now());
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      checkAnswer();
    }
  };

  const checkAnswer = () => {
    const currentProblem = problems[currentIndex];
    const numAnswer = parseInt(inputValue, 10);
    
    if (numAnswer === currentProblem.answer) {
      // Correct! Move to next
      if (currentIndex < TOTAL_QUESTIONS - 1) {
        setCurrentIndex(currentIndex + 1);
        setInputValue('');
      } else {
        // Finished
        finishChallenge();
      }
    } else {
      // Wrong answer! Visual feedback could be added here
      // For now, clear input to try again
      setInputValue('');
    }
  };

  const finishChallenge = () => {
    setIsFinished(true);
    if (timerRef.current) clearInterval(timerRef.current);
    
    const finalTime = Date.now() - (startTime || Date.now());
    
    // Update Leaderboard
    const newEntry = { name: studentName, time: finalTime, date: new Date().toISOString() };
    const updatedLeaderboard = [...leaderboard, newEntry]
      .sort((a, b) => a.time - b.time)
      .slice(0, 10); // Keep top 10
      
    setLeaderboard(updatedLeaderboard);
    localStorage.setItem('mathLeaderboard', JSON.stringify(updatedLeaderboard));
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    const millis = Math.floor((ms % 1000) / 100);
    return `${mins > 0 ? `${mins}m ` : ''}${secs}.${millis}s`;
  };

  if (isFinished) {
    return (
      <>
        <Header />
        <main className="container animate-fade-in">
          <div className={styles.challengeCard}>
            <h1 className={styles.title}>Parabéns, {studentName}! 🎉</h1>
            <p className={styles.timeResult}>O teu tempo: <strong>{formatTime(elapsedTime)}</strong></p>
            
            <div className={styles.leaderboardBox}>
              <h2>🏆 Tabela de Líderes 🏆</h2>
              <ul className={styles.leaderboardList}>
                {leaderboard.map((entry, idx) => (
                  <li key={idx} className={idx === 0 ? styles.firstPlace : ''}>
                    <span>{idx + 1}º - {entry.name}</span>
                    <span>{formatTime(entry.time)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.actionRow}>
              <button className="btn-secondary" onClick={() => router.push('/materia/matematica')}>Voltar</button>
              <button className="btn-primary" onClick={() => {
                setProblems(generateProblems());
                setCurrentIndex(0);
                setInputValue('');
                setIsFinished(false);
                setStartTime(Date.now());
              }}>Jogar Novamente!</button>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="container animate-fade-in">
        {!startTime ? (
          <div className={styles.challengeCard}>
            <div className={styles.icon}>⏱️</div>
            <h1 className={styles.title}>Desafio de Velocidade</h1>
            <p className={styles.description}>
              Prepara-te para {TOTAL_QUESTIONS} continhas de Matemática! 
              Sê o mais rápido possível a acertar todas. O tempo só conta quando clicares em "Começar".
            </p>
            <button className="btn-primary" onClick={startChallenge} style={{ fontSize: '1.5rem', padding: '1rem 3rem' }}>
              Começar!
            </button>
          </div>
        ) : (
          <div className={styles.playCard}>
            <div className={styles.headerRow}>
              <span className={styles.counter}>{currentIndex + 1} / {TOTAL_QUESTIONS}</span>
              <span className={styles.timer}>{formatTime(elapsedTime)}</span>
            </div>
            
            <div className={styles.problemBox}>
              <span className={styles.number}>{problems[currentIndex].num1}</span>
              <span className={styles.operator}>{problems[currentIndex].operator}</span>
              <span className={styles.number}>{problems[currentIndex].num2}</span>
              <span className={styles.operator}>=</span>
            </div>
            
            <input 
              ref={inputRef}
              type="number"
              className={styles.answerInput}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              autoFocus
            />
            <p className={styles.hint}>Escreve o número e carrega no "Enter"!</p>
          </div>
        )}
      </main>
    </>
  );
}
