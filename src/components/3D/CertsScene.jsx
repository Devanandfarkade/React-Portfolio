import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

// Central medal — stacked discs
function Medal() {
    const ref = useRef();
    useFrame(({ clock }) => {
        if (!ref.current) return;
        ref.current.rotation.y = clock.elapsedTime * 0.6;
        ref.current.rotation.x = Math.sin(clock.elapsedTime * 0.4) * 0.2;
        ref.current.position.y = Math.sin(clock.elapsedTime * 0.8) * 0.15;
    });
    return (
        <Float speed={1.2} floatIntensity={0.8}>
            <group ref={ref}>
                {/* Base disc */}
                <mesh position={[0, 0, 0]}>
                    <cylinderGeometry args={[1.1, 1.1, 0.12, 64]} />
                    <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.1} />
                </mesh>
                {/* Inner star */}
                <mesh position={[0, 0.07, 0]}>
                    <cylinderGeometry args={[0.7, 0.7, 0.05, 6]} />
                    <meshStandardMaterial color="#fde68a" metalness={0.95} roughness={0.05} />
                </mesh>
                {/* Core gem */}
                <mesh position={[0, 0.12, 0]}>
                    <octahedronGeometry args={[0.38, 0]} />
                    <meshPhysicalMaterial color="#a855f7" metalness={0.2} roughness={0} transmission={0.6} thickness={0.5} />
                </mesh>
                {/* Outer rim */}
                <mesh position={[0, 0, 0]}>
                    <torusGeometry args={[1.1, 0.06, 16, 80]} />
                    <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.1} />
                </mesh>
            </group>
        </Float>
    );
}

// Ribbon/laurel rings
function RibbonRing({ radius, y, speed, color, segments = 12 }) {
    const ref = useRef();
    const pts = useMemo(() => {
        const arr = [];
        for (let i = 0; i <= segments * 3; i++) {
            const a = (i / (segments * 3)) * Math.PI * 2;
            const r = radius + (i % 3 === 1 ? 0.2 : 0);
            arr.push(new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r));
        }
        return arr;
    }, [radius, y, segments]);
    const geo = useMemo(() => new THREE.BufferGeometry().setFromPoints(pts), [pts]);
    useFrame(({ clock }) => {
        if (!ref.current) ref.current.rotation.y = clock.elapsedTime * speed;
    });
    return (
        <line ref={ref} geometry={geo}>
            <lineBasicMaterial color={color} transparent opacity={0.5} />
        </line>
    );
}

// Star burst particles emanating outward
function StarBurst({ count = 60 }) {
    const posAttr = useRef();
    const data = useMemo(() => Array.from({ length: count }, () => {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const r = 1.5 + Math.random() * 3;
        return {
            x: r * Math.sin(phi) * Math.cos(theta),
            y: r * Math.cos(phi),
            z: r * Math.sin(phi) * Math.sin(theta),
            phase: Math.random() * Math.PI * 2,
        };
    }), [count]);
    const initPos = useMemo(() => {
        const arr = new Float32Array(count * 3);
        data.forEach((d, i) => { arr[i * 3] = d.x; arr[i * 3 + 1] = d.y; arr[i * 3 + 2] = d.z; });
        return arr;
    }, [data, count]);
    useFrame(({ clock }) => {
        if (!posAttr.current) return;
        const arr = posAttr.current.array;
        data.forEach((d, i) => {
            const pulse = 1 + Math.sin(clock.elapsedTime * 1.5 + d.phase) * 0.08;
            arr[i * 3] = d.x * pulse;
            arr[i * 3 + 1] = d.y * pulse;
            arr[i * 3 + 2] = d.z * pulse;
        });
        posAttr.current.needsUpdate = true;
    });
    return (
        <points>
            <bufferGeometry>
                <bufferAttribute ref={posAttr} attach="attributes-position" args={[initPos, 3]} />
            </bufferGeometry>
            <pointsMaterial size={0.06} color="#fde68a" transparent opacity={0.7} sizeAttenuation />
        </points>
    );
}

// Confetti-like colored flakes
function ConfettiFlakes({ count = 40 }) {
    const ref = useRef();
    const positions = useMemo(() => {
        const arr = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            arr[i * 3] = (Math.random() - 0.5) * 9;
            arr[i * 3 + 1] = (Math.random() - 0.5) * 7;
            arr[i * 3 + 2] = (Math.random() - 0.5) * 5;
        }
        return arr;
    }, [count]);
    const posAttr = useRef();
    useFrame(({ clock }) => {
        if (!posAttr.current) return;
        const arr = posAttr.current.array;
        for (let i = 0; i < count; i++) {
            arr[i * 3 + 1] -= 0.006;
            if (arr[i * 3 + 1] < -3.5) arr[i * 3 + 1] = 3.5;
        }
        posAttr.current.needsUpdate = true;
        if (ref.current) ref.current.rotation.y = clock.elapsedTime * 0.03;
    });
    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute ref={posAttr} attach="attributes-position" args={[positions, 3]} />
            </bufferGeometry>
            <pointsMaterial size={0.08} color="#c084fc" transparent opacity={0.5} sizeAttenuation />
        </points>
    );
}

export default function CertsScene() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
    const rawX = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], [-70, 0, 0, 50]);
    const rawOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
    const x = useSpring(rawX, { stiffness: 65, damping: 22 });

    return (
        <motion.div ref={ref} style={{ x, opacity: rawOpacity }} className="w-full h-full">
            <Canvas camera={{ position: [0, 0, 5.5], fov: 55 }}
                gl={{ alpha: true, antialias: true }} shadows style={{ background: "transparent" }}>
                <ambientLight intensity={2.5} color="#ffffff" />
                <directionalLight position={[5, 8, 5]} intensity={3.5} color="#ffffff" castShadow />
                <directionalLight position={[-4, 2, -4]} intensity={2.2} color="#fbbf24" />
                <pointLight position={[3, 4, 3]} intensity={5} color="#f59e0b" />
                <pointLight position={[-3, -3, 3]} intensity={3} color="#a855f7" />
                <pointLight position={[0, 5, 2]} intensity={3} color="#fde68a" />
                <Environment preset="studio" />

                <Medal />
                <RibbonRing radius={2.2} y={0} speed={0.35} color="#f59e0b" segments={12} />
                <RibbonRing radius={3.0} y={0} speed={-0.22} color="#a855f7" segments={16} />
                <RibbonRing radius={3.8} y={0} speed={0.15} color="#06b6d4" segments={20} />
                <StarBurst count={55} />
                <ConfettiFlakes count={35} />

                <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1.0}
                    maxPolarAngle={Math.PI / 1.8} minPolarAngle={Math.PI / 3.5} enableRotate={false} />
            </Canvas>
        </motion.div>
    );
}