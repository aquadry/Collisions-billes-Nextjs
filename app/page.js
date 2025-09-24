'use client'
import MarbleSimulator from '@/components/MarbleSimulator'
import styles from './page.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Simulateur de Collision de Billes</h1>
      <MarbleSimulator />
    </div>
  )
}
