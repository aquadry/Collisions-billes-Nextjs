// ===== components/MarbleBag.js =====
'use client'
import styles from './MarbleBag.module.css'

export default function MarbleBag({ onAddMarble }) {
  return (
    <div 
      className={styles.marbleBag}
      onClick={onAddMarble}
    >
      Lancer une bille
    </div>
  )
}
