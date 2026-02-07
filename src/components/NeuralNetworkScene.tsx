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

/**
 * Пересчитывает связи для всех узлов на основе текущих позиций.
 * Гарантирует минимум MIN_CONNECTIONS связей для каждого узла.
 */
const MIN_CONNECTIONS = 2

function rebuildConnections(nodes: Node[], baseCount: number = 3, randomExtra: number = 3) {
  // Сначала назначаем связи каждому узлу по ближайшим соседям
  nodes.forEach((node, i) => {
    const distances = nodes
      .map((other, j) => ({ index: j, distance: node.position.distanceTo(other.position) }))
      .filter((d) => d.index !== i)
      .sort((a, b) => a.distance - b.distance)

    const count = baseCount + Math.floor(Math.random() * randomExtra)
    node.connections = distances.slice(0, count).map((d) => d.index)
  })

  // Гарантируем, что каждый узел имеет минимум MIN_CONNECTIONS связей.
  // Если узел A подключён к B, но B не подключён к A — добавляем обратную связь.
  nodes.forEach((node, i) => {
    if (node.connections.length >= MIN_CONNECTIONS) return

    // Находим ближайшие узлы, которых ещё нет в connections
    const distances = nodes
      .map((other, j) => ({ index: j, distance: node.position.distanceTo(other.position) }))
      .filter((d) => d.index !== i && !node.connections.includes(d.index))
      .sort((a, b) => a.distance - b.distance)

    const needed = MIN_CONNECTIONS - node.connections.length
    for (let k = 0; k < needed && k < distances.length; k++) {
      node.connections.push(distances[k].index)
    }
  })
}

/** Максимальное количество отрезков (line segments) для BufferGeometry */
const MAX_SEGMENTS = 400

// Основная сцена нейросети
const NeuralNetwork: React.FC<{
  theme?: 'dark' | 'light' | null
  pointer: PointerState
}> = ({ theme, pointer }) => {
  const groupRef = useRef<THREE.Group>(null)
  const linesRef = useRef<THREE.LineSegments>(null)
  // Целевые значения вращения для плавной интерполяции
  const targetRotation = useRef({ x: 0, y: 0 })

  // Предаллоцированная геометрия для связей (lineSegments: каждый сегмент = 2 вершины)
  const linesGeometry = useMemo(() => {
    const geom = new THREE.BufferGeometry()
    const positions = new Float32Array(MAX_SEGMENTS * 2 * 3) // 2 вершины * 3 координаты на сегмент
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geom
  }, [])

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

    // Создаем начальные связи между ближайшими узлами
    rebuildConnections(generatedNodes)

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

    // Перестройка связей: при наведении — каждые 0.3с, без наведения — каждые 3с
    const interval = pointer.active ? 0.3 : 3
    const currentCycle = Math.floor(time / interval)

    if (
      groupRef.current &&
      groupRef.current.userData.lastConnectionUpdate !== currentCycle
    ) {
      groupRef.current.userData.lastConnectionUpdate = currentCycle
      rebuildConnections(nodes)
    }

    // Обновляем геометрию связей (lineSegments)
    if (linesRef.current) {
      const posArr = linesRef.current.geometry.attributes.position as THREE.BufferAttribute
      let seg = 0
      for (let i = 0; i < nodes.length && seg < MAX_SEGMENTS; i++) {
        const node = nodes[i]
        for (let c = 0; c < node.connections.length && seg < MAX_SEGMENTS; c++) {
          const other = nodes[node.connections[c]]
          posArr.setXYZ(seg * 2, node.position.x, node.position.y, node.position.z)
          posArr.setXYZ(seg * 2 + 1, other.position.x, other.position.y, other.position.z)
          seg++
        }
      }
      // Обнуляем неиспользованные сегменты
      for (let i = seg; i < MAX_SEGMENTS; i++) {
        posArr.setXYZ(i * 2, 0, 0, 0)
        posArr.setXYZ(i * 2 + 1, 0, 0, 0)
      }
      posArr.needsUpdate = true

      // Анимация прозрачности
      const mat = linesRef.current.material as THREE.LineBasicMaterial
      mat.opacity = 0.3 + Math.sin(time * 3) * 0.2
    }
  })

  const lineColor = theme === 'dark' || !theme ? '#c0c0c0' : '#3a3a3a'

  return (
    <group ref={groupRef}>
      {/* Все связи — единый lineSegments с императивным обновлением */}
      <lineSegments ref={linesRef} geometry={linesGeometry}>
        <lineBasicMaterial color={lineColor} transparent opacity={0.4} />
      </lineSegments>

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
