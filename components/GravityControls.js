// ===== components/GravityControls.js =====
'use client'
import { useState } from 'react'
import useDraggable from '@/hooks/useDraggable'
import styles from './GravityControls.module.css'

export default function GravityControls({ marbleCount, gravityControls }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { elementRef, isDragging } = useDraggable()

  const {
    gravityIntensity,
    activeDirection,
    setGravityDirection,
    setGravityIntensity,
    setGravityPreset,
    setSpecialMode,
    resetGravity
  } = gravityControls

  return (
    <div 
      ref={elementRef}
      className={`${styles.controls} ${isCollapsed ? styles.collapsed : ''} ${isDragging ? styles.dragging : ''}`}
    >
      <div className={styles.header}>
        <h3 className={styles.title}>⚙️ Contrôles Gravité</h3>
        <button 
          className={styles.collapseBtn}
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? '+' : '−'}
        </button>
      </div>

      <div className={styles.content}>
        <DirectionControls 
          activeDirection={activeDirection}
          onDirectionChange={setGravityDirection}
        />
        
        <IntensityControls
          intensity={gravityIntensity}
          onIntensityChange={setGravityIntensity}
          onPresetClick={setGravityPreset}
        />
        
        <SpecialModeControls
          onModeClick={setSpecialMode}
          onReset={resetGravity}
        />

        <div className={styles.marbleInfo}>
          🔮 Billes actives: {marbleCount}
        </div>
      </div>
    </div>
  )
}

function DirectionControls({ activeDirection, onDirectionChange }) {
  const directions = [
    ['up-left', '↖'], ['up', '↑'], ['up-right', '↗'],
    ['left', '←'], ['center', '⊕'], ['right', '→'],
    ['down-left', '↙'], ['down', '↓'], ['down-right', '↘']
  ]

  return (
    <div className={styles.controlGroup}>
      <h4>🎯 Direction de la gravité</h4>
      <div className={styles.gravityButtons}>
        {directions.map(([direction, symbol]) => (
          <button
            key={direction}
            className={`${styles.gravityBtn} ${activeDirection === direction ? styles.active : ''}`}
            onClick={() => onDirectionChange(direction)}
          >
            {symbol}
          </button>
        ))}
      </div>
    </div>
  )
}

function IntensityControls({ intensity, onIntensityChange, onPresetClick }) {
  const presets = [
    ['1.6', 'Lune'],
    ['9.8', 'Terre'],
    ['24.8', 'Jupiter'],
    ['0', 'Zéro G']
  ]

  return (
    <div className={styles.controlGroup}>
      <h4>⚡ Intensité de la gravité</h4>
      <div className={styles.sliderContainer}>
        <input
          type="range"
          min="0"
          max="30"
          step="0.1"
          value={intensity}
          onChange={(e) => onIntensityChange(parseFloat(e.target.value))}
          className={styles.slider}
        />
        <div>Force: {intensity} m/s²</div>
      </div>
      <div className={styles.presetButtons}>
        {presets.map(([value, label]) => (
          <button
            key={value}
            className={styles.presetBtn}
            onClick={() => onPresetClick(parseFloat(value))}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}

function SpecialModeControls({ onModeClick, onReset }) {
  const modes = ['orbital', 'chaos', 'pulse']

  return (
    <div className={styles.controlGroup}>
      <h4>🌀 Modes spéciaux</h4>
      <div className={styles.presetButtons}>
        {modes.map((mode) => (
          <button
            key={mode}
            className={styles.presetBtn}
            onClick={() => onModeClick(mode)}
          >
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </button>
        ))}
        <button className={styles.presetBtn} onClick={onReset}>
          Reset
        </button>
      </div>
    </div>
  )
}