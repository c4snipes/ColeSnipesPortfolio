import { Suspense, useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Text, Stars } from '@react-three/drei'
import * as THREE from 'three'
import './ThreeHero.css'

const codeSnippets = [
  'const cole = new Developer();',
  'git commit -m "ship it"',
  'function solve(problem) {}',
  'SELECT * FROM skills;',
  'import { passion } from "heart";',
  'while(alive) { code(); }',
  'npm run build',
  '// TODO: change the world'
]

function FloatingCodeBlock({ position, code, rotation, speed = 1 }) {
  const meshRef = useRef()
  const initialRotation = useMemo(() => rotation || [0, 0, 0], [rotation])

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = initialRotation[1] + Math.sin(state.clock.elapsedTime * 0.3 * speed) * 0.1
      meshRef.current.rotation.x = initialRotation[0] + Math.cos(state.clock.elapsedTime * 0.2 * speed) * 0.05
    }
  })

  return (
    <Float
      speed={1.5 * speed}
      rotationIntensity={0.3}
      floatIntensity={0.5}
      position={position}
    >
      <group ref={meshRef}>
        {/* Background panel */}
        <mesh position={[0, 0, -0.05]}>
          <planeGeometry args={[code.length * 0.12 + 0.4, 0.5]} />
          <meshStandardMaterial
            color="#292e42"
            transparent
            opacity={0.85}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Border glow */}
        <mesh position={[0, 0, -0.06]}>
          <planeGeometry args={[code.length * 0.12 + 0.5, 0.6]} />
          <meshBasicMaterial
            color="#7aa2f7"
            transparent
            opacity={0.15}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Code text */}
        <Text
          fontSize={0.15}
          color="#c0caf5"
          anchorX="center"
          anchorY="middle"
          font="/fonts/JetBrainsMono-Regular.ttf"
          fallbackFont="monospace"
        >
          {code}
        </Text>
      </group>
    </Float>
  )
}

function ParticleField() {
  const particlesRef = useRef()
  const count = 200

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10
    }
    return pos
  }, [])

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02
      particlesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1
    }
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#7aa2f7"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}

function Scene() {
  const groupRef = useRef()

  useFrame((state) => {
    if (groupRef.current) {
      // Subtle mouse-based rotation
      const mouseX = state.mouse.x * 0.1
      const mouseY = state.mouse.y * 0.1
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mouseX, 0.05)
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -mouseY * 0.5, 0.05)
    }
  })

  // Generate random positions for code blocks
  const codeBlockPositions = useMemo(() => {
    return codeSnippets.map((_, i) => {
      const angle = (i / codeSnippets.length) * Math.PI * 2
      const radius = 2.5 + Math.random() * 1.5
      const height = (Math.random() - 0.5) * 3
      return {
        position: [
          Math.cos(angle) * radius,
          height,
          Math.sin(angle) * radius - 2
        ],
        rotation: [
          (Math.random() - 0.5) * 0.3,
          angle + Math.PI,
          (Math.random() - 0.5) * 0.2
        ],
        speed: 0.7 + Math.random() * 0.6
      }
    })
  }, [])

  return (
    <group ref={groupRef}>
      {/* Ambient lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#7aa2f7" />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#bb9af7" />

      {/* Stars background */}
      <Stars
        radius={100}
        depth={50}
        count={1000}
        factor={2}
        saturation={0}
        fade
        speed={0.5}
      />

      {/* Particle field */}
      <ParticleField />

      {/* Floating code blocks */}
      {codeSnippets.map((code, index) => (
        <FloatingCodeBlock
          key={index}
          code={code}
          position={codeBlockPositions[index].position}
          rotation={codeBlockPositions[index].rotation}
          speed={codeBlockPositions[index].speed}
        />
      ))}
    </group>
  )
}

export default function ThreeHero() {
  return (
    <div className="three-hero-container">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  )
}
