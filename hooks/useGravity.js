// ===== hooks/useGravity.js =====
'use client'
import { useState, useCallback, useMemo } from 'react'
import * as THREE from 'three'

export function useGravity() {
  const [gravityIntensity, setGravityIntensity] = useState(9.8)
  const [activeDirection, setActiveDirection] = useState('down')
  const [gravityMode, setGravityMode] = useState('normal')
  const [gravity, setGravity] = useState(new THREE.Vector3(0, -9.8, 0))

  const updateGravityDirection = useCallback((direction, intensity = gravityIntensity) => {
    setActiveDirection(direction)
    setGravityMode('directional')
    
    switch(direction) {
      case 'up': setGravity(new THREE.Vector3(0, intensity, 0)); break
      case 'down': setGravity(new THREE.Vector3(0, -intensity, 0)); break
      case 'left': setGravity(new THREE.Vector3(-intensity, 0, 0)); break
      case 'right': setGravity(new THREE.Vector3(intensity, 0, 0)); break
      case 'up-left': setGravity(new THREE.Vector3(-intensity * 0.7, intensity * 0.7, 0)); break
      case 'up-right': setGravity(new THREE.Vector3(intensity * 0.7, intensity * 0.7, 0)); break
      case 'down-left': setGravity(new THREE.Vector3(-intensity * 0.7, -intensity * 0.7, 0)); break
      case 'down-right': setGravity(new THREE.Vector3(intensity * 0.7, -intensity * 0.7, 0)); break
      case 'center': 
        setGravityMode('orbital')
        break
    }
  }, [gravityIntensity])

  const updateGravityIntensity = useCallback((newIntensity) => {
    setGravityIntensity(newIntensity)
    updateGravityDirection(activeDirection, newIntensity)
  }, [activeDirection, updateGravityDirection])

  const setGravityPreset = useCallback((presetValue) => {
    setGravityIntensity(presetValue)
    updateGravityDirection(activeDirection, presetValue)
  }, [activeDirection, updateGravityDirection])

  const setSpecialMode = useCallback((mode) => {
    setGravityMode(mode)
    if (mode === 'orbital') {
      setActiveDirection('center')
    }
  }, [])

  const resetGravity = useCallback(() => {
    setGravityMode('directional')
    setGravityIntensity(9.8)
    setActiveDirection('down')
    setGravity(new THREE.Vector3(0, -9.8, 0))
  }, [])

  const updateGravityMode = useCallback((time) => {
    switch(gravityMode) {
      case 'chaos':
        if (Math.floor(time / 2000) !== Math.floor((time - 16) / 2000)) {
          const directions = [
            [0, -gravityIntensity, 0], [0, gravityIntensity, 0],
            [-gravityIntensity, 0, 0], [gravityIntensity, 0, 0],
            [gravityIntensity * 0.7, gravityIntensity * 0.7, 0],
            [-gravityIntensity * 0.7, -gravityIntensity * 0.7, 0]
          ]
          const randomDir = directions[Math.floor(Math.random() * directions.length)]
          setGravity(new THREE.Vector3(randomDir[0], randomDir[1], randomDir[2]))
        }
        break
        
      case 'pulse':
        const pulseFactor = Math.sin(time * 0.003) * 0.5 + 0.5
        const pulseIntensity = gravityIntensity * (0.2 + pulseFactor * 0.8)
        setGravity(new THREE.Vector3(0, -pulseIntensity, 0))
        break
    }
  }, [gravityMode, gravityIntensity])

  const controls = useMemo(() => ({
    gravityIntensity,
    activeDirection,
    setGravityDirection: updateGravityDirection,
    setGravityIntensity: updateGravityIntensity,
    setGravityPreset,
    setSpecialMode,
    resetGravity
  }), [
    gravityIntensity,
    activeDirection,
    updateGravityDirection,
    updateGravityIntensity,
    setGravityPreset,
    setSpecialMode,
    resetGravity
  ])

  return {
    gravity,
    gravityMode,
    updateGravityMode,
    controls
  }
}