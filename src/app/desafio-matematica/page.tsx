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

// Levels: 1 (easy), 2 (medium), 3 (hard)
function generateProblems(operator: string, level: number): MathProblem[] {
  const problems: MathProblem[] = [];

  for (let i = 0; i < TOTAL_QUESTIONS; i++) {
    let num1 = 0;
    let num2 = 0;
    let answer = 0;

    switch (operator) {
      case '+':
        if (level === 1) {
          num1 = Math.floor(Math.random() * 9) + 1; // 1 to 9
          num2 = Math.floor(Math.random() * 9) + 1;
        } else if (level === 2) {
          num1 = Math.floor(Math.random() * 90) + 10; // 10 to 99
          num2 = Math.floor(Math.random() * 9) + 1; // Mixed 2-digit + 1-digit
        } else {
          num1 = Math.floor(Math.random() * 900) + 100; // 100 to 999
          num2 = Math.floor(Math.random() * 900) + 100;
        }
        answer = num1 + num2;
        break;
      case '-':
        if (level === 1) {
          num1 = Math.floor(Math.random() * 9) + 2; 
          num2 = Math.floor(Math.random() * (num1 - 1)) + 1;
        } else if (level === 2) {
          num1 = Math.floor(Math.random() * 90) + 10;
          num2 = Math.floor(Math.random() * 90) + 1;
          if (num2 > num1) {
            const temp = num1; num1 = num2; num2 = temp;
          }
        } else {
          num1 = Math.floor(Math.random() * 900) + 100;
          num2 = Math.floor(Math.random() * 900) + 100;
          if (num2 > num1) {
            const temp = num1; num1 = num2; num2 = temp;
          }
        }
        answer = num1 - num2;
        break;
      case 'x':
        if (level === 1) {
          num1 = Math.floor(Math.random() * 9) + 1;
          num2 = Math.floor(Math.random() * 9) + 1;
        } else if (level === 2) {
          num1 = Math.floor(Math.random() * 9) + 2;
          num2 = Math.floor(Math.random() * 90) + 10;
        } else {
          num1 = Math.floor(Math.random() * 90) + 10;
          num2 = Math.floor(Math.random() * 90) + 10;
        }
        answer = num1 * num2;
        break;
      case '÷':
        if (level === 1) {
          num2 = Math.floor(Math.random() * 9) + 1;
          answer = Math.floor(Math.random() * 9) + 1;
        } else if (level === 2) {
          num2 = Math.floor(Math.random() * 9) + 2;
          answer = Math.floor(Math.random() * 20) + 2;
        } else {
          num2 = Math.floor(Math.random() * 20) + 2;
          answer = Math.floor(Math.random() * 50) + 10;
        }
        num1 = num2 * answer;
        break;
    }

    problems.push({ num1, num2, operator, answer });
  }

  return problems;
}

export default function DesafioMatematica() {
  const router = useRouter();
  const [studentName, setStudentName] = useState('');
  const [selectedOperator, setSelectedOperator] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  
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
    if (!selectedOperator || !selectedLevel) return;
    
    setProblems(generateProblems(selectedOperator, selectedLevel));
    setStartTime(Date.now());
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const loadLeaderboard = () => {
    const key = `mathLeaderboard_${selectedOperator}_${selectedLevel}`;
    const savedScores = localStorage.getItem(key);
    if (savedScores) {
      return JSON.parse(savedScores);
    }
    return [];
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
      if (currentIndex < TOTAL_QUESTIONS - 1) {
        setCurrentIndex(currentIndex + 1);
        setInputValue('');
      } else {
        finishChallenge();
      }
    } else {
      setInputValue(''); // Wrong answer, clear to retry
    }
  };

  const finishChallenge = () => {
    setIsFinished(true);
    if (timerRef.current) clearInterval(timerRef.current);
    
    const finalTime = Date.now() - (startTime || Date.now());
    
    // Update Leaderboard specific to this mode
    const key = `mathLeaderboard_${selectedOperator}_${selectedLevel}`;
    const currentBoard = loadLeaderboard();
    
    const newEntry = { name: studentName, time: finalTime, date: new Date().toISOString() };
    const updatedLeaderboard = [...currentBoard, newEntry]
      .sort((a, b) => a.time - b.time)
      .slice(0, 5); // Keep top 5
      
    setLeaderboard(updatedLeaderboard);
    localStorage.setItem(key, JSON.stringify(updatedLeaderboard));
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    const millis = Math.floor((ms % 1000) / 100);
    return `${mins > 0 ? `${mins}m ` : ''}${secs}.${millis}s`;
  };

  const getFeedbackMessage = () => {
    if (!elapsedTime) return "";
    const avgSeconds = (elapsedTime / 1000) / TOTAL_QUESTIONS;
    if (avgSeconds <= 3) return "Incrível! Foste super rápida, um verdadeiro relâmpago! ⚡";
    if (avgSeconds <= 6) return "Muito bem! Estás no bom caminho. Continua a treinar! 🏃‍♀️";
    return "Boa tentativa! Precisas treinar mais um pouco este nível para ficares super rápida. Não desistas! 💪";
  };

  if (isFinished) {
    return (
      <>
        <Header />
        <main className="container animate-fade-in">
          <div className={styles.challengeCard}>
            <h1 className={styles.title}>Fim do Desafio! 🎉</h1>
            <p className={styles.timeResult}>O teu tempo: <strong>{formatTime(elapsedTime)}</strong></p>
            <p className={styles.feedbackMessage}>{getFeedbackMessage()}</p>
            
            <div className={styles.leaderboardBox}>
              <h2>🏆 Recordes ({selectedOperator} - Nível {selectedLevel}) 🏆</h2>
              <ul className={styles.leaderboardList}>
                {leaderboard.map((entry, idx) => (
                  <li key={idx} className={entry.time === elapsedTime && entry.name === studentName ? styles.firstPlace : ''}>
                    <span>{idx + 1}º - {entry.name}</span>
                    <span>{formatTime(entry.time)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.actionRow}>
              <button className="btn-secondary" onClick={() => {
                setIsFinished(false);
                setStartTime(null);
                setElapsedTime(0);
                setCurrentIndex(0);
              }}>Mudar Nível/Conta</button>
              <button className="btn-primary" onClick={() => {
                setIsFinished(false);
                setCurrentIndex(0);
                setInputValue('');
                startChallenge();
              }}>Tentar Bater o Recorde!</button>
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
            <h1 className={styles.title}>Treino de Velocidade</h1>
            <p className={styles.description}>Escolhe a operação e o nível que queres treinar!</p>
            
            <div className={styles.selectorGroup}>
              <h3>1. Qual a operação?</h3>
              <div className={styles.buttonRow}>
                {['+', '-', 'x', '÷'].map((op) => (
                  <button 
                    key={op} 
                    className={`${styles.selectBtn} ${selectedOperator === op ? styles.selected : ''}`}
                    onClick={() => setSelectedOperator(op)}
                  >
                    {op}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.selectorGroup}>
              <h3>2. Qual o nível?</h3>
              <div className={styles.buttonRow}>
                {[1, 2, 3].map((lvl) => (
                  <button 
                    key={lvl} 
                    className={`${styles.selectBtn} ${selectedLevel === lvl ? styles.selected : ''}`}
                    onClick={() => setSelectedLevel(lvl)}
                  >
                    Nível {lvl}
                  </button>
                ))}
              </div>
            </div>

            <button 
              className="btn-primary" 
              onClick={startChallenge} 
              disabled={!selectedOperator || !selectedLevel}
              style={{ fontSize: '1.5rem', padding: '1rem 3rem', marginTop: '1rem' }}
            >
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
