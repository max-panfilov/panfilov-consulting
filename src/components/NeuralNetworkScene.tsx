'use client'

import React, { useRef, useMemo, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useTheme } from '@/providers/Theme'

// Интерфейс для узла нейросети
interface Node {
  position: THREE.Vector3
  basePosition: THREE.Vector3
  connections: number[]
  velocity: THREE.Vector3
}

// Компонент отдельного узла
const NetworkNode: React.FC<{
  position: THREE.Vector3
  scale: number
  color: string
}> = ({ position, scale, color }) => {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime()
      // Обновляем позицию из переданного вектора
      meshRef.current.position.copy(position)
      // Пульсация
      meshRef.current.scale.setScalar(
        scale + Math.sin(time * 2 + position.x) * 0.15
      )
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.12, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.8}
        metalness={0.3}
        roughness={0.4}
      />
    </mesh>
  )
}

// Компонент связи между узлами
const Connection: React.FC<{
  start: THREE.Vector3
  end: THREE.Vector3
  color: string
}> = ({ start, end, color }) => {
  const lineRef = useRef<THREE.Line>(null)

  const points = useMemo(() => [start.clone(), end.clone()], [])

  useFrame((state) => {
    if (lineRef.current && lineRef.current.geometry) {
      // Обновляем позиции концов линии
      const positions = lineRef.current.geometry.attributes.position
      positions.setXYZ(0, start.x, start.y, start.z)
      positions.setXYZ(1, end.x, end.y, end.z)
      positions.needsUpdate = true

      // Анимация прозрачности
      const material = lineRef.current.material as THREE.LineBasicMaterial
      material.opacity = 0.3 + Math.sin(state.clock.getElapsedTime() * 3) * 0.2
    }
  })

  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry().setFromPoints(points)
    return geom
  }, [points])

  return (
    // @ts-ignore - Three.js primitive type compatibility
    <line ref={lineRef} geometry={geometry}>
      <lineBasicMaterial color={color} transparent opacity={0.4} />
    </line>
  )
}

// Основная сцена нейросети
const NeuralNetwork: React.FC<{
  theme?: 'dark' | 'light' | null
}> = ({ theme }) => {
  const groupRef = useRef<THREE.Group>(null)

  // Генерируем узлы сети
  const nodes = useMemo(() => {
    const nodeCount = 50
    const generatedNodes: Node[] = []

    for (let i = 0; i < nodeCount; i++) {
      // Компактное сферическое распределение
      const radius = 2.5 + Math.random() * 1.5
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)

      const x = radius * Math.sin(phi) * Math.cos(theta)
      const y = radius * Math.sin(phi) * Math.sin(theta)
      const z = radius * Math.cos(phi)

      const basePos = new THREE.Vector3(x, y, z)
      generatedNodes.push({
        position: basePos.clone(),
        basePosition: basePos.clone(),
        connections: [],
        velocity: new THREE.Vector3(0, 0, 0),
      })
    }

    // Создаем связи между ближайшими узлами
    generatedNodes.forEach((node, i) => {
      const distances = generatedNodes
        .map((otherNode, j) => ({
          index: j,
          distance: node.basePosition.distanceTo(otherNode.basePosition),
        }))
        .filter((d) => d.index !== i)
        .sort((a, b) => a.distance - b.distance)

      const connectionCount = 3 + Math.floor(Math.random() * 3)
      node.connections = distances.slice(0, connectionCount).map((d) => d.index)
    })

    return generatedNodes
  }, [])

  // Цветовая палитра в зависимости от темы
  const getNodeColor = (index: number) => {
    const isDark = theme === 'dark' || !theme

    if (isDark) {
      const colors = ['#ffffff', '#f0f0f0', '#e8e8e8', '#d0d0d0', '#c0c0c0']
      return colors[index % colors.length]
    } else {
      const colors = ['#000000', '#1a1a1a', '#2a2a2a', '#3a3a3a', '#4a4a4a']
      return colors[index % colors.length]
    }
  }

  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    // Плавное вращение всей сцены
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001
      groupRef.current.rotation.x = Math.sin(time * 0.2) * 0.1
    }

    // Обновляем позиции узлов с волновым движением
    nodes.forEach((node, index) => {
      const frequency = 0.4 + (index % 7) * 0.08
      const amplitude = 0.35

      const waveOffset = new THREE.Vector3(
        Math.sin(time * frequency + node.basePosition.x * 0.5) * amplitude,
        Math.cos(time * frequency * 0.7 + node.basePosition.y * 0.5) * amplitude,
        Math.sin(time * frequency * 0.5 + node.basePosition.z * 0.5) * amplitude * 0.8
      )

      // Обновляем позицию с учетом базовой позиции и волнового смещения
      node.position.copy(node.basePosition).add(waveOffset)
    })

    // Динамическое обновление связей каждые 3 секунды
    const connectionUpdateInterval = 3
    const currentCycle = Math.floor(time / connectionUpdateInterval)

    if (
      groupRef.current &&
      groupRef.current.userData.lastConnectionUpdate !== currentCycle
    ) {
      groupRef.current.userData.lastConnectionUpdate = currentCycle

      // Обновляем 30% узлов
      const nodesToUpdate = Math.floor(nodes.length * 0.3)
      for (let i = 0; i < nodesToUpdate; i++) {
        const randomIndex = Math.floor(Math.random() * nodes.length)
        const node = nodes[randomIndex]

        // Пересчитываем ближайших соседей
        const distances = nodes
          .map((otherNode, j) => ({
            index: j,
            distance: node.position.distanceTo(otherNode.position),
          }))
          .filter((d) => d.index !== randomIndex)
          .sort((a, b) => a.distance - b.distance)

        const connectionCount = 3 + Math.floor(Math.random() * 3)
        node.connections = distances.slice(0, connectionCount).map((d) => d.index)
      }
    }
  })

  return (
    <group ref={groupRef}>
      {/* Рендерим все связи */}
      {nodes.map((node, i) =>
        node.connections.map((connIndex) => (
          <Connection
            key={`${i}-${connIndex}`}
            start={node.position}
            end={nodes[connIndex].position}
            color={getNodeColor(i)}
          />
        ))
      )}

      {/* Рендерим все узлы */}
      {nodes.map((node, i) => (
        <NetworkNode
          key={i}
          position={node.position}
          scale={1}
          color={getNodeColor(i)}
        />
      ))}

      {/* Освещение */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
    </group>
  )
}

// Главный экспортируемый компонент
export const NeuralNetworkScene: React.FC = () => {
  const { theme } = useTheme()

  return (
    <div
      className="h-full w-full flex items-center justify-center overflow-hidden"
      style={{ minHeight: '384px', maxWidth: '100%' }}
    >
      <Canvas
        camera={{ position: [0, 0, 11], fov: 45 }}
        style={{ background: 'transparent', width: '100%', height: '100%', maxWidth: '100%' }}
        gl={{ alpha: true, antialias: true }}
      >
        <NeuralNetwork theme={theme} />
      </Canvas>
    </div>
  )
}
