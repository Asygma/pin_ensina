import Image from 'next/image';
import Link from 'next/link';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.headerContainer}`}>
        <Link href="/" className={styles.logoGroup}>
          <div className={`${styles.avatar} animate-float`}>
            <Image src="/pin.jpeg" alt="Pin" width={50} height={50} className={styles.avatarImage} />
          </div>
          <h1 className={styles.title}>Pin Ensina</h1>
        </Link>
        <nav className={styles.nav}>
          <Link href="/materias" className={styles.navLink}>Matérias</Link>
          <Link href="/sobre" className={styles.navLink}>Sobre</Link>
        </nav>
      </div>
    </header>
  );
}
