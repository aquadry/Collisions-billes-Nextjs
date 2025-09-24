// ===== hooks/useMarbles.js =====
'use client'
import { useState, useCallback } from 'react'
import * as THREE from 'three'

export function useMarbles(scene) {
  const [marbles, setMarbles] = useState([])

  const createMarbleTexture = useCallback(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const ctx = canvas.getContext('2d')

    const colors = [
      '#FFD700', '#FF6347', '#4682B4', '#ADFF2F', '#8A2BE2',
      '#FF4500', '#00BFFF', '#32CD32', '#FF1493', '#1E90FF'
    ]

    ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)]
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    for (let i = 0; i < 10; i++) {
      ctx.beginPath()
      ctx.arc(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        20 + Math.random() * 50,
        0,
        Math.PI * 2
      )
      ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)]
      ctx.globalAlpha = 0.6 + Math.random() * 0.3
      ctx.fill()
    }

    ctx.globalAlpha = 1
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
    ctx.beginPath()
    ctx.arc(canvas.width * 0.3, canvas.height * 0.3, 40, 0, Math.PI * 2)
    ctx.fill()

    return new THREE.CanvasTexture(canvas)
  }, [])

  const addMarble = useCallback(() => {
    if (!scene) return

    const boxSize = 30
    const halfBoxSize = boxSize / 2
    const radius = 1.5 + Math.random() * 1.5
    const geometry = new THREE.SphereGeometry(radius, 24, 24)

    const texture = createMarbleTexture()
    const material = new THREE.MeshPhongMaterial({
      map: texture,
      transparent: false,
      shininess: 100,
      specular: 0x222222
    })

    const marble = new THREE.Mesh(geometry, material)
    marble.castShadow = true
    marble.receiveShadow = true

    // Position de lancement
    marble.position.x = halfBoxSize - radius - 2
    marble.position.y = halfBoxSize - radius - 2
    marble.position.z = (Math.random() - 0.5) * 10

    marble.velocity = new THREE.Vector3(
      -Math.random() * 10 - 5,
      -Math.random() * 5 - 2,
      (Math.random() - 0.5) * 5
    )
    
    marble.radius = radius
    marble.mass = Math.PI * 4/3 * Math.pow(radius, 3)

    scene.add(marble)
    setMarbles(prev => [...prev, marble])
  }, [scene, createMarbleTexture])

  const handleCollision = useCallback((marble1, marble2) => {
    const restitution = 0.8
    const distanceVec = new THREE.Vector3().subVectors(marble2.position, marble1.position)
    const distance = distanceVec.length()
    const minDistance = marble1.radius + marble2.radius

    if (distance < minDistance) {
      const overlap = minDistance - distance
      const normal = distanceVec.normalize()
      const correction = normal.clone().multiplyScalar(overlap * 0.5)

      marble1.position.sub(correction)
      marble2.position.add(correction)

      const v1_normal = marble1.velocity.dot(normal)
      const v2_normal = marble2.velocity.dot(normal)

      const v1_tangent = marble1.velocity.clone().sub(normal.clone().multiplyScalar(v1_normal))
      const v2_tangent = marble2.velocity.clone().sub(normal.clone().multiplyScalar(v2_normal))

      const new_v1_normal = (v1_normal * (marble1.mass - marble2.mass) + 2 * marble2.mass * v2_normal) / (marble1.mass + marble2.mass)
      const new_v2_normal = (v2_normal * (marble2.mass - marble1.mass) + 2 * marble1.mass * v1_normal) / (marble1.mass + marble2.mass)

      const final_v1_normal = new_v1_normal * restitution
      const final_v2_normal = new_v2_normal * restitution

      marble1.velocity = v1_tangent.add(normal.clone().multiplyScalar(final_v1_normal))
      marble2.velocity = v2_tangent.add(normal.clone().multiplyScalar(final_v2_normal))
    }
  }, [])

  const updateMarbles = useCallback((deltaTime, gravity, gravityMode) => {
    const boxSize = 30
    const halfBoxSize = boxSize / 2
    const restitution = 0.8

    marbles.forEach(marble => {
      let currentGravity = gravity.clone()
      
      // Gravité orbitale
      if (gravityMode === 'orbital') {
        const centerForce = new THREE.Vector3().subVectors(new THREE.Vector3(0, 0, 0), marble.position)
        const distance = centerForce.length()
        if (distance > 0) {
          centerForce.normalize().multiplyScalar(gravity.length() * 2)
          currentGravity = centerForce
        }
      }
      
      marble.velocity.addScaledVector(currentGravity, deltaTime)
      marble.position.addScaledVector(marble.velocity, deltaTime)

      // Collisions avec les murs
      if (marble.position.x + marble.radius > halfBoxSize) {
        marble.position.x = halfBoxSize - marble.radius
        marble.velocity.x *= -restitution
      } else if (marble.position.x - marble.radius < -halfBoxSize) {
        marble.position.x = -halfBoxSize + marble.radius
        marble.velocity.x *= -restitution
      }

      if (marble.position.y + marble.radius > halfBoxSize) {
        marble.position.y = halfBoxSize - marble.radius
        marble.velocity.y *= -restitution
      } else if (marble.position.y - marble.radius < -halfBoxSize) {
        marble.position.y = -halfBoxSize + marble.radius
        marble.velocity.y *= -restitution
      }

      if (marble.position.z + marble.radius > halfBoxSize) {
        marble.position.z = halfBoxSize - marble.radius
        marble.velocity.z *= -restitution
      } else if (marble.position.z - marble.radius < -halfBoxSize) {
        marble.position.z = -halfBoxSize + marble.radius
        marble.velocity.z *= -restitution
      }
    })

    // Collisions entre billes
    for (let i = 0; i < marbles.length; i++) {
      for (let j = i + 1; j < marbles.length; j++) {
        handleCollision(marbles[i], marbles[j])
      }
    }
  }, [marbles, handleCollision])

  return {
    marbles,
    addMarble,
    updateMarbles
  }
}
