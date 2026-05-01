import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Sphere,
  MeshDistortMaterial,
  Float,
  Stars,
  Trail,
  Environment,
  useGLTF,
} from "@react-three/drei";
import * as THREE from "three";

// Animated floating orb
function AstronautModel() {
  const { scene } = useGLTF("/Austranaut.glb");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  return (
    <Float speed={isMobile ? 1 : 2} floatIntensity={isMobile ? 0.8 : 1.5}>
      <primitive
        object={scene}
        scale={isMobile ? 1.2 : 2}
        position={[0, -1, 0]}
      />
    </Float>
  );
}

// Orbiting rings
function OrbitalRing({ radius, speed, tilt, color }) {
  const ref = useRef();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z =
        state.clock.elapsedTime * (isMobile ? speed * 0.5 : speed);
    }
  });

  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 128; i++) {
      const angle = (i / 128) * Math.PI * 2;
      pts.push(
        new THREE.Vector3(
          Math.cos(angle) * radius,
          Math.sin(angle) * radius,
          0,
        ),
      );
    }
    return pts;
  }, [radius]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    return geo;
  }, [points]);

  return (
    <group rotation={[tilt, 0, 0]} ref={ref}>
      <line geometry={geometry}>
        <lineBasicMaterial
          color={color}
          transparent
          opacity={isMobile ? 0.2 : 0.4}
        />
      </line>
    </group>
  );
}

// Floating particles
function Particles({ count = 80 }) {
  const ref = useRef();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  const positions = useMemo(() => {
    const actualCount = isMobile ? count / 2 : count;
    const pos = new Float32Array(actualCount * 3);
    for (let i = 0; i < actualCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, [count, isMobile]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.05;
      ref.current.rotation.x = state.clock.elapsedTime * 0.03;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={isMobile ? 0.02 : 0.04}
        color="#a855f7"
        transparent
        opacity={isMobile ? 0.4 : 0.6}
        sizeAttenuation
      />
    </points>
  );
}

// Icosahedron wireframe
function WireframeGeo() {
  const ref = useRef();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.15;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.3;
    }
  });

  return (
    <mesh ref={ref} scale={isMobile ? 1.5 : 2.5}>
      <icosahedronGeometry args={[1, 1]} />
      <meshBasicMaterial
        color="#a855f7"
        wireframe
        transparent
        opacity={isMobile ? 0.06 : 0.12}
      />
    </mesh>
  );
}

// Touch rotation handler
function TouchRotationHandler() {
  const { camera } = useThree();
  const [targetRotation, setTargetRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);

    const handleTouchRotate = (e) => {
      if (isDragging && isMobile) {
        const { x, y } = e.detail;
        setTargetRotation({ x: x * 0.5, y: y * 0.3 });
      }
    };

    const handleTouchStart = () => setIsDragging(true);
    const handleTouchEnd = () => {
      setIsDragging(false);
      setTargetRotation({ x: 0, y: 0 });
    };

    window.addEventListener("touch-rotate", handleTouchRotate);
    window.addEventListener("touch-start", handleTouchStart);
    window.addEventListener("touch-end", handleTouchEnd);

    return () => {
      window.removeEventListener("touch-rotate", handleTouchRotate);
      window.removeEventListener("touch-start", handleTouchStart);
      window.removeEventListener("touch-end", handleTouchEnd);
    };
  }, [isDragging, isMobile]);

  useFrame(() => {
    if (isDragging && isMobile && camera) {
      camera.position.x += (targetRotation.x - camera.position.x) * 0.1;
      camera.position.y += (targetRotation.y - camera.position.y) * 0.1;
      camera.lookAt(0, 0, 0);
    }
  });

  return null;
}

export default function Scene3D({ height = "100%" }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height,
        position: "absolute",
        inset: 0,
        zIndex: 1,
        pointerEvents: isMobile ? "auto" : "none",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, isMobile ? 6 : 5], fov: isMobile ? 50 : 60 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={isMobile ? 0.2 : 0.3} />
        <pointLight
          position={[10, 10, 10]}
          intensity={isMobile ? 0.8 : 1.5}
          color="#a855f7"
        />
        <pointLight
          position={[-10, -10, -10]}
          intensity={isMobile ? 0.4 : 0.8}
          color="#06b6d4"
        />
        <pointLight
          position={[0, 10, -10]}
          intensity={isMobile ? 0.3 : 0.5}
          color="#f59e0b"
        />

        <AstronautModel />
        <WireframeGeo />
        <OrbitalRing
          radius={isMobile ? 1.8 : 2.2}
          speed={isMobile ? 0.2 : 0.4}
          tilt={Math.PI / 4}
          color="#a855f7"
        />
        <OrbitalRing
          radius={isMobile ? 2.2 : 2.8}
          speed={isMobile ? -0.12 : -0.25}
          tilt={Math.PI / 6}
          color="#06b6d4"
        />
        <OrbitalRing
          radius={isMobile ? 2.6 : 3.4}
          speed={isMobile ? 0.08 : 0.15}
          tilt={Math.PI / 3}
          color="#f59e0b"
        />
        <Particles count={isMobile ? 40 : 100} />
        <Stars
          radius={isMobile ? 20 : 30}
          depth={isMobile ? 15 : 20}
          count={isMobile ? 150 : 300}
          factor={isMobile ? 1.5 : 2}
          fade
          speed={isMobile ? 0.3 : 0.5}
        />

        <TouchRotationHandler />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={!isMobile}
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 3}
          enableRotate={!isMobile}
        />
      </Canvas>
    </div>
  );
}
