import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
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
  return (
    <Float speed={2} floatIntensity={1.5}>
      <primitive object={scene} scale={2} position={[0, -1, 0]} />
    </Float>
  );
}

// Orbiting rings
function OrbitalRing({ radius, speed, tilt, color }) {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = state.clock.elapsedTime * speed;
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
        <lineBasicMaterial color={color} transparent opacity={0.4} />
      </line>
    </group>
  );
}

// Floating particles
function Particles({ count = 80 }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, [count]);

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
        size={0.04}
        color="#a855f7"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// Icosahedron wireframe
function WireframeGeo() {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.15;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.3;
    }
  });
  return (
    <mesh ref={ref} scale={2.5}>
      <icosahedronGeometry args={[1, 1]} />
      <meshBasicMaterial color="#a855f7" wireframe transparent opacity={0.12} />
    </mesh>
  );
}

export default function Scene3D({ height = "100%" }) {
  return (
    <div
      style={{
        width: "100%",
        height,
        position: "absolute",
        inset: 0,
        zIndex: 1,
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#a855f7" />
        <pointLight
          position={[-10, -10, -10]}
          intensity={0.8}
          color="#06b6d4"
        />
        <pointLight position={[0, 10, -10]} intensity={0.5} color="#f59e0b" />

        <AstronautModel />
        <WireframeGeo />
        <OrbitalRing
          radius={2.2}
          speed={0.4}
          tilt={Math.PI / 4}
          color="#a855f7"
        />
        <OrbitalRing
          radius={2.8}
          speed={-0.25}
          tilt={Math.PI / 6}
          color="#06b6d4"
        />
        <OrbitalRing
          radius={3.4}
          speed={0.15}
          tilt={Math.PI / 3}
          color="#f59e0b"
        />
        <Particles count={100} />
        <Stars radius={30} depth={20} count={300} factor={2} fade speed={0.5} />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>
    </div>
  );
}
