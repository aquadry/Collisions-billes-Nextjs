// ===== components/MarbleSimulator.js =====
'use client'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import MarbleBag from './MarbleBag'
import GravityControls from './GravityControls'
import { useMarbles } from '../hooks/useMarbles'
import { useGravity } from '../hooks/useGravity'
import { useThreeScene } from '../hooks/useThreeScene'

export default function MarbleSimulator() {
  const canvasRef = useRef(null)
  const { scene, camera, renderer } = useThreeScene(canvasRef)
  const { marbles, addMarble, updateMarbles } = useMarbles(scene)
  const { gravity, gravityMode, updateGravityMode, controls } = useGravity()

  useEffect(() => {
    if (!scene || !camera || !renderer) return

    let animationId
    let lastTime = 0

    const animate = (time) => {
      const deltaTime = (time - lastTime) / 1000
      lastTime = time

      if (deltaTime > 0) {
        updateGravityMode(time)
        updateMarbles(deltaTime, gravity, gravityMode)
      }

      renderer.render(scene, camera)
      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [scene, camera, renderer, updateMarbles, updateGravityMode, gravity, gravityMode])

  return (
    <div>
      <canvas ref={canvasRef} />
      <MarbleBag onAddMarble={addMarble} />
      <GravityControls
        marbleCount={marbles.length}
        gravityControls={controls}
      />
    </div>
  )
}
