import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, useGLTF, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

function fixMaterials(scene) {
    scene.traverse((child) => {
        if (!child.isMesh) return;
        const mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.forEach((m) => {
            if (m.isMeshStandardMaterial || m.isMeshPhysicalMaterial) {
                m.roughness = Math.min(m.roughness ?? 0.5, 0.6);
                m.envMapIntensity = 2.3;
            }
            m.needsUpdate = true;
        });
        child.castShadow = true;
    });
}

function RobotCharacter() {
    const { scene } = useGLTF("/robot_character.glb");
    const ref = useRef();
    useEffect(() => { fixMaterials(scene); }, [scene]);
    useFrame(({ clock }) => {
        if (!ref.current) return;
        ref.current.rotation.y = clock.elapsedTime * 0.4;
        ref.current.position.y = -1 + Math.sin(clock.elapsedTime * 1.0) * 0.1;
    });
    return (
        <Float speed={1.4} floatIntensity={0.8}>
            <primitive ref={ref} object={scene} scale={1.9} position={[0, -1, 0]} />
        </Float>
    );
}

// Gear-like toothed ring
function GearRing({ radius, y, speed, color, teeth = 16 }) {
    const ref = useRef();
    const geo = useMemo(() => {
        const pts = [];
        const toothH = 0.18;
        for (let i = 0; i <= teeth * 2; i++) {
            const a = (i / (teeth * 2)) * Math.PI * 2;
            const r = i % 2 === 0 ? radius : radius + toothH;
            pts.push(new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r));
        }
        return new THREE.BufferGeometry().setFromPoints(pts);
    }, [radius, y, teeth]);
    useFrame(({ clock }) => {
        if (ref.current) ref.current.rotation.y = clock.elapsedTime * speed;
    });
    return (
        <line ref={ref} geometry={geo}>
            <lineBasicMaterial color={color} transparent opacity={0.45} />
        </line>
    );
}

// Crystal shard decorations
function CrystalShard({ position, color, scale }) {
    const ref = useRef();
    useFrame(({ clock }) => {
        if (!ref.current) return;
        ref.current.rotation.y = clock.elapsedTime * 0.8;
        ref.current.rotation.x = Math.sin(clock.elapsedTime * 0.6 + position[0]) * 0.3;
        ref.current.material.opacity = 0.25 + Math.sin(clock.elapsedTime * 2 + position[1]) * 0.12;
    });
    return (
        <mesh ref={ref} position={position} scale={scale}>
            <octahedronGeometry args={[0.5, 0]} />
            <meshBasicMaterial color={color} wireframe transparent opacity={0.3} />
        </mesh>
    );
}

// Timeline flowing particles
function TimelineParticles({ count = 80 }) {
    const ref = useRef();
    const posAttr = useRef();
    const data = useMemo(() => Array.from({ length: count }, () => ({
        x: (Math.random() - 0.5) * 9,
        y: (Math.random() - 0.5) * 8,
        z: (Math.random() - 0.5) * 6,
        speed: 0.005 + Math.random() * 0.012,
    })), [count]);
    const initPos = useMemo(() => {
        const arr = new Float32Array(count * 3);
        data.forEach((d, i) => { arr[i * 3] = d.x; arr[i * 3 + 1] = d.y; arr[i * 3 + 2] = d.z; });
        return arr;
    }, [data, count]);

    useFrame(() => {
        if (!posAttr.current) return;
        const arr = posAttr.current.array;
        data.forEach((d, i) => {
            arr[i * 3 + 1] -= d.speed;
            if (arr[i * 3 + 1] < -4) arr[i * 3 + 1] = 4;
        });
        posAttr.current.needsUpdate = true;
    });

    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute ref={posAttr} attach="attributes-position" args={[initPos, 3]} />
            </bufferGeometry>
            <pointsMaterial size={0.05} color="#f59e0b" transparent opacity={0.5} sizeAttenuation />
        </points>
    );
}

export default function ExperienceScene() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
    const rawX = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], [90, 0, 0, -50]);
    const rawOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
    const x = useSpring(rawX, { stiffness: 65, damping: 22 });

    return (
        <motion.div ref={ref} style={{ x, opacity: rawOpacity }} className="w-full h-full">
            <Canvas camera={{ position: [0, 0, 5.5], fov: 55 }}
                gl={{ alpha: true, antialias: true }} shadows style={{ background: "transparent" }}>
                <ambientLight intensity={2.8} color="#ffffff" />
                <directionalLight position={[5, 8, 5]} intensity={3.5} color="#ffffff" castShadow />
                <directionalLight position={[-4, 2, -4]} intensity={2} color="#fbbf24" />
                <pointLight position={[3, 4, 3]} intensity={5} color="#f59e0b" />
                <pointLight position={[-3, -3, 3]} intensity={3} color="#a855f7" />
                <pointLight position={[0, 6, 0]} intensity={2.5} color="#fde68a" />
                <Environment preset="forest" />

                <RobotCharacter />
                <GearRing radius={2.5} y={0} speed={0.3} color="#f59e0b" teeth={16} />
                <GearRing radius={3.2} y={0} speed={-0.2} color="#a855f7" teeth={20} />
                <GearRing radius={3.9} y={0} speed={0.12} color="#06b6d4" teeth={24} />
                <CrystalShard position={[-3.5, 1, -1]} color="#f59e0b" scale={0.7} />
                <CrystalShard position={[3.5, 0.5, -1]} color="#a855f7" scale={0.5} />
                <CrystalShard position={[0, 2.8, -2]} color="#06b6d4" scale={0.6} />
                <CrystalShard position={[-2, -2, 1]} color="#fbbf24" scale={0.4} />
                <TimelineParticles count={70} />

                <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.9}
                    maxPolarAngle={Math.PI / 1.8} minPolarAngle={Math.PI / 3.5} enableRotate={false} />
            </Canvas>
        </motion.div>
    );
}