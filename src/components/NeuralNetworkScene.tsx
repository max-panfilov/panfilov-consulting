'use client'

import React, { useRef, useMemo, useCallback } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useTheme } from '@/providers/Theme'

// Интерфейс для узла нейросети
interface Node {
  position: THREE.Vector3
  basePosition: THREE.Vector3
  connections: number[]
  velocity: THREE.Vector3
}

// Общий объект для передачи позиции указателя в Three.js сцену
interface PointerState {
  // Нормализованные координаты указателя (-1 до 1)
  x: number
  y: number
  // Активен ли указатель (мышь над канвасом или тач)
  active: boolean
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
  pointer: PointerState
}> = ({ theme, pointer }) => {
  const groupRef = useRef<THREE.Group>(null)
  // Целевые значения вращения для плавной интерполяции
  const targetRotation = useRef({ x: 0, y: 0 })

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

    // Вращение сцены: комбинация автовращения и реакции на указатель
    if (groupRef.current) {
      // Базовое автовращение
      targetRotation.current.y += 0.001

      if (pointer.active) {
        // Указатель активен — добавляем смещение вращения на основе позиции мыши/тача
        // pointer.x: -1 (лево) до 1 (право), pointer.y: -1 (верх) до 1 (низ)
        const pointerInfluenceX = pointer.y * 0.3 // вертикальное движение → вращение по X
        const pointerInfluenceY = pointer.x * 0.4 // горизонтальное движение → вращение по Y
        targetRotation.current.x = pointerInfluenceX
        targetRotation.current.y += pointerInfluenceY * 0.002
      } else {
        // Без указателя — плавная осцилляция
        targetRotation.current.x = Math.sin(time * 0.2) * 0.1
      }

      // Плавная интерполяция к целевому вращению (lerp)
      groupRef.current.rotation.x += (targetRotation.current.x - groupRef.current.rotation.x) * 0.05
      groupRef.current.rotation.y += (targetRotation.current.y - groupRef.current.rotation.y) * 0.05
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

      // Эффект притяжения/отталкивания узлов к указателю
      if (pointer.active) {
        // Проецируем позицию указателя в пространство сцены (приблизительно)
        const pointerWorld = new THREE.Vector3(
          pointer.x * 4, // масштабируем к размеру сцены
          -pointer.y * 4,
          0,
        )

        // Расстояние от узла до позиции указателя (в плоскости XY)
        const nodeXY = new THREE.Vector2(node.position.x, node.position.y)
        const pointerXY = new THREE.Vector2(pointerWorld.x, pointerWorld.y)
        const dist = nodeXY.distanceTo(pointerXY)

        // Узлы в радиусе 3 единиц притягиваются к указателю
        if (dist < 3) {
          const strength = (1 - dist / 3) * 0.15 // сила затухает с расстоянием
          const direction = new THREE.Vector3(
            pointerWorld.x - node.position.x,
            pointerWorld.y - node.position.y,
            0,
          ).normalize()
          node.position.add(direction.multiplyScalar(strength))
        }
      }
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
  const containerRef = useRef<HTMLDivElement>(null)
  const pointerRef = useRef<PointerState>({ x: 0, y: 0, active: false })

  // Вычисляем нормализованные координаты указателя (-1 до 1) относительно контейнера
  const updatePointer = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    pointerRef.current.x = ((clientX - rect.left) / rect.width) * 2 - 1
    pointerRef.current.y = ((clientY - rect.top) / rect.height) * 2 - 1
    pointerRef.current.active = true
  }, [])

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      updatePointer(e.clientX, e.clientY)
    },
    [updatePointer],
  )

  const handlePointerLeave = useCallback(() => {
    pointerRef.current.active = false
  }, [])

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0]
        updatePointer(touch.clientX, touch.clientY)
      }
    },
    [updatePointer],
  )

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0]
        updatePointer(touch.clientX, touch.clientY)
      }
    },
    [updatePointer],
  )

  const handleTouchEnd = useCallback(() => {
    pointerRef.current.active = false
  }, [])

  return (
    <div
      ref={containerRef}
      className="h-full w-full flex items-center justify-center overflow-hidden"
      style={{ minHeight: '384px', maxWidth: '100%' }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onTouchMove={handleTouchMove}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <Canvas
        camera={{ position: [0, 0, 11], fov: 45 }}
        style={{ background: 'transparent', width: '100%', height: '100%', maxWidth: '100%' }}
        gl={{ alpha: true, antialias: true }}
      >
        <NeuralNetwork theme={theme} pointer={pointerRef.current} />
      </Canvas>
    </div>
  )
}
