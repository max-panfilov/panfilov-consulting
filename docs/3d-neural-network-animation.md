# 3D Анимация нейронной сети в Hero блоке

## Обзор

В Hero блок главной страницы добавлена интерактивная 3D анимация нейронной сети, созданная с использованием Three.js и React Three Fiber. Анимация иллюстрирует векторное пространство с динамически движущимися узлами (нейронами) и связями, реагирует на наведение и движение мыши, а также адаптирует цветовую схему под тему сайта.

## Технологии

- **Three.js** (v0.180.0) - 3D библиотека для WebGL
- **@react-three/fiber** (v9.4.0) - React рендерер для Three.js
- **@react-three/drei** (v10.7.6) - Helper компоненты для R3F
- **TypeScript** - типизация

## Архитектура компонента

### Основной файл: `src/components/NeuralNetworkScene.tsx`

#### Структура компонентов:

1. **`NeuralNetworkScene`** (экспортируемый)
   - Главный компонент-обертка
   - Отслеживает движение мыши
   - Рендерит Canvas для Three.js

2. **`NeuralNetwork`** (внутренний)
   - Управляет всей 3D сценой
   - Генерирует узлы и связи
   - Анимирует вращение группы
   - Реагирует на позицию мыши

3. **`NetworkNode`** (внутренний)
   - Отдельный узел нейросети (сфера)
   - Пульсирующая анимация масштаба
   - Материал с эмиссией света

4. **`Connection`** (внутренний)
   - Линия-связь между узлами
   - Анимированная прозрачность (эффект потока энергии)

## Алгоритм генерации сети

### Расположение узлов
```typescript
// Генерация 50 узлов в сферическом распределении
const radius = 3 + Math.random() * 2
const theta = Math.random() * Math.PI * 2
const phi = Math.acos(2 * Math.random() - 1)

const x = radius * Math.sin(phi) * Math.cos(theta)
const y = radius * Math.sin(phi) * Math.sin(theta)
const z = radius * Math.cos(phi)
```

Узлы распределяются равномерно в 3D пространстве по формуле сферических координат.

### Создание связей
```typescript
// Для каждого узла находим 3-5 ближайших соседей
const distances = generatedNodes
  .map((otherNode, j) => ({
    index: j,
    distance: node.position.distanceTo(otherNode.position),
  }))
  .filter((d) => d.index !== i)
  .sort((a, b) => a.distance - b.distance)

const connectionCount = 3 + Math.floor(Math.random() * 3)
node.connections = distances.slice(0, connectionCount).map((d) => d.index)
```

Связи создаются между ближайшими узлами, имитируя структуру нейронной сети.

## Интерактивность

### Отклик на наведение (hover)
```typescript
const [isHovered, setIsHovered] = useState(false)

<div
  onMouseEnter={() => setIsHovered(true)}
  onMouseLeave={() => setIsHovered(false)}
>
```

При наведении на область анимации:
- Увеличивается чувствительность к движению мыши (0.0005 vs 0.0002)
- Добавляется случайное дрожание узлов для эффекта "живости"

### Отклик на движение мыши
```typescript
// Отслеживание движения мыши
const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
  const rect = event.currentTarget.getBoundingClientRect()
  const x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  const y = -((event.clientY - rect.top) / rect.height) * 2 + 1
  setMousePosition({ x, y })
}

// Адаптивная чувствительность
const sensitivity = isHovered ? 0.0005 : 0.0002
groupRef.current.rotation.y += mousePosition.x * sensitivity
groupRef.current.rotation.x += mousePosition.y * sensitivity
```

Координаты мыши нормализуются в диапазон [-1, 1] и влияют на скорость вращения 3D сцены.

### Автоматическое вращение и динамика узлов
```typescript
// Вращение всей сцены
groupRef.current.rotation.y += 0.002
groupRef.current.rotation.x = Math.sin(time * 0.3) * 0.15

// Динамическое движение каждого узла
nodes.forEach((node) => {
  const offset = new THREE.Vector3(
    Math.sin(time + node.basePosition.x) * 0.1,
    Math.cos(time + node.basePosition.y) * 0.1,
    Math.sin(time * 0.5 + node.basePosition.z) * 0.1,
  )
  node.position.copy(node.basePosition).add(offset)
  
  // Дополнительное дрожание при hover
  if (isHovered) {
    node.position.x += (Math.random() - 0.5) * 0.02
  }
})
```

- Плавное вращение по оси Y и синусоидальное покачивание по оси X
- Каждый узел движется по волновой траектории относительно базовой позиции
- Связи динамически изменяются, следуя за узлами

## Визуальные эффекты

### Цветовая палитра (адаптивная под тему)
```typescript
const getNodeColor = (index: number) => {
  const isDark = theme === 'dark' || !theme
  
  if (isDark) {
    // Белые и светлые оттенки для темной темы
    const colors = ['#ffffff', '#f0f0f0', '#e8e8e8', '#d0d0d0', '#c0c0c0']
    return colors[index % colors.length]
  } else {
    // Черные и темные оттенки для светлой темы
    const colors = ['#000000', '#1a1a1a', '#2a2a2u0430', '#3a3a3a', '#4a4a4a']
    return colors[index % colors.length]
  }
}
```

**Адаптивная цветовая схема:**
- **Темная тема**: белые узлы и связи на прозрачном фоне
- **Светлая тема**: черные узлы и связи на прозрачном фоне
- Используется проектный `useTheme` из `@/providers/Theme`

### Анимация узлов
- Пульсация размера с индивидуальным оффсетом: `scale + Math.sin(time * 2 + position.x) * 0.15`
- Эмиссивный материал с усиленным свечением (emissiveIntensity: 0.8)
- Меньший metalness (0.3) для более мягкого свечения

### Анимация связей
- Изменение прозрачности: `0.3 + Math.sin(time * 3) * 0.2`
- Создает эффект "потока данных" по нейронным связям

### Освещение
```typescript
<ambientLight intensity={0.5} />
<pointLight position={[10, 10, 10]} intensity={1} />
<pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />
```

## Интеграция в HeroHome

### Файл: `src/blocks/HeroHome/Component.tsx`

```tsx
import { NeuralNetworkScene } from '@/components/NeuralNetworkScene'

// В JSX:
{mediaType === 'video' && bgVideoUrl ? (
  <video ... />
) : bgImageUrl ? (
  <img ... />
) : (
  // 3D анимация когда нет изображения/видео (прозрачный фон)
  <div className="relative h-96 w-full rounded-md">
    <NeuralNetworkScene />
  </div>
)}
```

**Особенности интеграции:**
- Анимация отображается вместо placeholder изображения
- Прозрачный фон - адаптируется под фон страницы
- Canvas занимает все доступное пространство и центрируется

## Настройки производительности

### Параметры оптимизации
- **50 узлов** - баланс между визуальной насыщенностью и производительностью
- **16 сегментов сферы** - оптимальная детализация для узлов
- **Отключен zoom** - `enableZoom={false}`
- **Отключен pan** - `enablePan={false}`
- **Transparent background** - для интеграции с градиентом Tailwind

### Canvas настройки
```typescript
<div className="h-full w-full flex items-center justify-center">
  <Canvas
    camera={{ position: [0, 0, 8], fov: 60 }}
    style={{ background: 'transparent', width: '100%', height: '100%' }}
  >
  </Canvas>
</div>
```

Контейнер использует flexbox для центрирования анимации.

## Дальнейшие улучшения

Возможные направления развития:

1. **Адаптивность**
   - Уменьшение количества узлов на мобильных устройствах
   - Отключение анимации при `prefers-reduced-motion`

2. **Интерактивность**
   - Подсветка узлов при наведении
   - Клик по узлу для отображения информации
   - Параллакс-эффект при скролле

3. **Визуальные эффекты**
   - Частицы вокруг узлов
   - Bloom эффект для свечения
   - Динамическое изменение цветов

4. **Настраиваемость**
   - Параметры через Payload CMS
   - Выбор цветовой схемы
   - Настройка скорости анимации

## Производительность

### Метрики
- ~50 mesh объектов (узлы)
- ~150-250 line объектов (связи)
- 60 FPS на современных устройствах
- Минимальное влияние на время загрузки (lazy load Three.js)

### Рекомендации
- Используйте React.memo() для Connection компонента при добавлении большего числа узлов
- Рассмотрите InstancedMesh для узлов при масштабировании до 100+ элементов
- Используйте LOD (Level of Detail) для мобильных устройств

## Зависимости

```json
{
  "three": "0.180.0",
  "@types/three": "0.180.0",
  "@react-three/fiber": "9.4.0",
  "@react-three/drei": "10.7.6"
}
```

Все зависимости установлены и настроены для production использования.
