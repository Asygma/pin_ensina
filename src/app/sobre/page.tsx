import Image from 'next/image';
import Header from '@/components/Header';
import styles from './page.module.css';

export default function Sobre() {
  return (
    <>
      <Header />
      <main className="container animate-fade-in" style={{ padding: '2rem' }}>
        <div className={styles.aboutCard}>
          <div className={styles.imageContainer}>
            <Image 
              src="/gigi.jpeg" 
              alt="Gigi" 
              width={250} 
              height={250} 
              className={styles.profileImage}
            />
          </div>
          
          <div className={styles.textContent}>
            <h1 className={styles.title}>Quem é a Gigi?</h1>
            
            <p className={styles.paragraph}>
              A Gigi é uma menina brasileira super criativa que se mudou para Portugal! 🇧🇷 ✈️ 🇵🇹
            </p>
            
            <p className={styles.paragraph}>
              Ela sabe que estudar é muito importante para o futuro, mas vamos ser sinceros... às vezes pode ser um pouquinho chato, não é? 
            </p>
            
            <p className={styles.paragraph}>
              Foi pensando nisso que a Gigi teve uma ideia genial: ela pediu ajuda ao <strong>Pin</strong>, um personagem super legal que ela mesma inventou, para criar um site incrível! O objetivo? Transformar os estudos numa brincadeira divertida e poder compartilhar esse espaço com todos os seus amigos da escola, para que aprendam e cresçam juntos. 🚀
            </p>
            
            <p className={styles.paragraph}>
              Com o Pin Ensina, o 4º ano vai ser a melhor aventura de todas!
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
