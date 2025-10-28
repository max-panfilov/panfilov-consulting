"use client"

// Компонент 3D Card из shadcn для создания интерактивных 3D карточек
import { cn } from "@/utilities/ui"
import React, {
  createContext,
  useState,
  useContext,
  useRef,
  useEffect,
} from "react"

// Контекст для отслеживания наведения мыши на карточку
const MouseEnterContext = createContext<
  [boolean, React.Dispatch<React.SetStateAction<boolean>>] | undefined
>(undefined)

export type CardContainerProps = {
  children?: React.ReactNode
  className?: string
  containerClassName?: string
}

// Контейнер для 3D карточки с эффектом наклона при наведении
export const CardContainer = ({
  children,
  className,
  containerClassName,
}: CardContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMouseEntered, setIsMouseEntered] = useState(false)

  // Обработчик движения мыши для создания эффекта наклона
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const { left, top, width, height } =
      containerRef.current.getBoundingClientRect()
    const x = (e.clientX - left - width / 2) / 25
    const y = (e.clientY - top - height / 2) / 25
    containerRef.current.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`
  }

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsMouseEntered(true)
    if (!containerRef.current) return
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    setIsMouseEntered(false)
    containerRef.current.style.transform = `rotateY(0deg) rotateX(0deg)`
  }

  return (
    <MouseEnterContext.Provider value={[isMouseEntered, setIsMouseEntered]}>
      <div
        className={cn(
          "py-20 flex items-center justify-center",
          containerClassName
        )}
        style={{
          perspective: "1000px",
        }}
      >
        <div
          ref={containerRef}
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={cn(
            "flex items-center justify-center relative transition-all duration-200 ease-linear",
            className
          )}
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          {children}
        </div>
      </div>
    </MouseEnterContext.Provider>
  )
}

export type CardBodyProps = {
  children: React.ReactNode
  className?: string
}

// Тело 3D карточки
export const CardBody = ({ children, className }: CardBodyProps) => {
  return (
    <div
      className={cn(
        "h-96 w-96 [transform-style:preserve-3d] [&>*]:[transform-style:preserve-3d]",
        className
      )}
    >
      {children}
    </div>
  )
}

export type CardItemProps = {
  as?: React.ElementType
  children: React.ReactNode
  className?: string
  translateX?: number | string
  translateY?: number | string
  translateZ?: number | string
  rotateX?: number | string
  rotateY?: number | string
  rotateZ?: number | string
} & Record<string, any>

// Элемент внутри 3D карточки с возможностью трансформации
export const CardItem = ({
  as: Tag = "div",
  children,
  className,
  translateX = 0,
  translateY = 0,
  translateZ = 0,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  ...rest
}: CardItemProps) => {
  const ref = useRef<any>(null)
  const [isMouseEntered] = useMouseEnter()

  useEffect(() => {
    handleAnimations()
  }, [isMouseEntered])

  // Применение трансформаций при наведении мыши
  const handleAnimations = () => {
    if (!ref.current) return
    if (isMouseEntered) {
      ref.current.style.transform = `translateX(${translateX}px) translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`
    } else {
      ref.current.style.transform = `translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)`
    }
  }

  return React.createElement(
    Tag,
    {
      ref,
      className: cn("w-fit transition duration-200 ease-linear", className),
      ...rest,
    },
    children
  )
}

// Хук для использования контекста наведения мыши
export const useMouseEnter = () => {
  const context = useContext(MouseEnterContext)
  if (context === undefined) {
    throw new Error("useMouseEnter must be used within a MouseEnterProvider")
  }
  return context
}
