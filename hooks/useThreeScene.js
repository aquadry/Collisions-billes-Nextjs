// ===== hooks/useThreeScene.js =====
'use client'
import { useEffect, useState } from 'react'
import * as THREE from 'three'

export function useThreeScene(canvasRef) {
  const [sceneData, setSceneData] = useState({
    scene: null,
    camera: null,
    renderer: null
  })

  useEffect(() => {
    if (!canvasRef.current) return

    // Créer la scène
    const scene = new THREE.Scene()
    
    // Créer la caméra
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    
    // Créer le renderer
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current,
      antialias: true 
    })
    
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap

    // Configuration des lumières
    const ambientLight = new THREE.AmbientLight(0x404040, 1.5)
    scene.add(ambientLight)
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2)
    directionalLight.position.set(10, 10, 5)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.width = 2048
    directionalLight.shadow.mapSize.height = 2048
    scene.add(directionalLight)

    const pointLight = new THREE.PointLight(0xffffff, 1, 100)
    pointLight.position.set(0, 0, 20)
    scene.add(pointLight)

    // Créer l'environnement (boîte)
    const boxSize = 30
    const boxGeometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize)
    const boxMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x333333, 
      side: THREE.BackSide,
      transparent: true,
      opacity: 0.8
    })
    const boundingBox = new THREE.Mesh(boxGeometry, boxMaterial)
    scene.add(boundingBox)

    // Positionner la caméra
    camera.position.set(0, 0, 50)
    camera.lookAt(0, 0, 0)

    // Gérer le redimensionnement
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', handleResize)

    setSceneData({ scene, camera, renderer })

    return () => {
      window.removeEventListener('resize', handleResize)
      renderer.dispose()
    }
  }, [])

  return sceneData
}