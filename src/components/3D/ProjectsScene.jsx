import { useRef, useMemo, useState, useEffect } from "react";
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
                m.envMapIntensity = 2.2;
            }
            m.needsUpdate = true;
        });
        child.castShadow = true;
    });
}

function BrainModel() {
    const { scene } = useGLTF("/brain_point_cloud.glb");
    const ref = useRef();
    useEffect(() => { fixMaterials(scene); }, [scene]);
    useFrame(({ clock }) => {
        if (!ref.current) return;
        ref.current.rotation.y = clock.elapsedTime * 0.25;
        ref.current.rotation.z = Math.sin(clock.elapsedTime * 0.4) * 0.06;
        ref.current.position.y = 0 + Math.sin(clock.elapsedTime * 0.7) * 0.12;
    });
    return (
        <Float speed={1.0} floatIntensity={0.5}>
            <primitive ref={ref} object={scene} scale={2.0} position={[0, 0, 0]} />
        </Float>
    );
}

// Synapse connection lines between random nodes
function SynapseWeb({ nodeCount = 18 }) {
    const nodesRef = useRef([]);
    const posAttr = useRef();

    const { nodes, linePositions } = useMemo(() => {
        const ns = Array.from({ length: nodeCount }, () => ({
            x: (Math.random() - 0.5) * 7,
            y: (Math.random() - 0.5) * 5,
            z: (Math.random() - 0.5) * 5,
            vx: (Math.random() - 0.5) * 0.004,
            vy: (Math.random() - 0.5) * 0.004,
            vz: (Math.random() - 0.5) * 0.004,
        }));
        nodesRef.current = ns;
        const maxDist = 3.2;
        const segs = [];
        for (let i = 0; i < ns.length; i++) {
            for (let j = i + 1; j < ns.length; j++) {
                const dx = ns[i].x - ns[j].x, dy = ns[i].y - ns[j].y, dz = ns[i].z - ns[j].z;
                if (Math.sqrt(dx * dx + dy * dy + dz * dz) < maxDist) {
                    segs.push(i, j);
                }
            }
        }
        const pos = new Float32Array(segs.length * 2 * 3);
        return { nodes: ns, linePositions: pos, segs };
    }, [nodeCount]);

    const lineRef = useRef();
    useFrame(() => {
        const ns = nodesRef.current;
        ns.forEach((n) => {
            n.x += n.vx; n.y += n.vy; n.z += n.vz;
            if (Math.abs(n.x) > 3.5) n.vx *= -1;
            if (Math.abs(n.y) > 2.5) n.vy *= -1;
            if (Math.abs(n.z) > 2.5) n.vz *= -1;
        });
        if (posAttr.current) {
            const arr = posAttr.current.array;
            let k = 0;
            for (let i = 0; i < ns.length; i++) {
                for (let j = i + 1; j < ns.length; j++) {
                    const dx = ns[i].x - ns[j].x, dy = ns[i].y - ns[j].y, dz = ns[i].z - ns[j].z;
                    const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
                    if (d < 3.2) {
                        arr[k++] = ns[i].x; arr[k++] = ns[i].y; arr[k++] = ns[i].z;
                        arr[k++] = ns[j].x; arr[k++] = ns[j].y; arr[k++] = ns[j].z;
                    }
                }
            }
            posAttr.current.needsUpdate = true;
        }
    });

    const lineGeo = useMemo(() => {
        const g = new THREE.BufferGeometry();
        const arr = new Float32Array(nodeCount * nodeCount * 6);
        g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
        return g;
    }, [nodeCount]);

    return (
        <lineSegments ref={lineRef} geometry={lineGeo}>
            <bufferGeometry>
                <bufferAttribute ref={posAttr} attach="attributes-position"
                    args={[new Float32Array(nodeCount * nodeCount * 6), 3]} />
            </bufferGeometry>
            <lineBasicMaterial color="#f0abfc" transparent opacity={0.22} />
        </lineSegments>
    );
}

// Pulsing neuron orbs
function NeuronOrbs({ count = 14 }) {
    const refs = useRef([]);
    const orbs = useMemo(() => Array.from({ length: count }, (_, i) => ({
        x: (Math.random() - 0.5) * 7,
        y: (Math.random() - 0.5) * 5,
        z: (Math.random() - 0.5) * 4,
        phase: Math.random() * Math.PI * 2,
        size: 0.04 + Math.random() * 0.06,
    })), [count]);

    return (
        <group>
            {orbs.map((o, i) => (
                <NeuronOrb key={i} orb={o} />
            ))}
        </group>
    );
}

function NeuronOrb({ orb }) {
    const ref = useRef();
    useFrame(({ clock }) => {
        if (!ref.current) return;
        const s = 0.6 + Math.sin(clock.elapsedTime * 2.5 + orb.phase) * 0.4;
        ref.current.scale.setScalar(s);
        ref.current.material.opacity = 0.3 + Math.sin(clock.elapsedTime * 2 + orb.phase) * 0.2;
    });
    return (
        <mesh ref={ref} position={[orb.x, orb.y, orb.z]}>
            <sphereGeometry args={[orb.size, 8, 8]} />
            <meshBasicMaterial color="#e879f9" transparent opacity={0.5} />
        </mesh>
    );
}

// Thought wave concentric rings
function ThoughtWave({ radius, speed, color }) {
    const ref = useRef();
    const pts = useMemo(() => {
        const arr = [];
        for (let i = 0; i <= 80; i++) {
            const a = (i / 80) * Math.PI * 2;
            arr.push(new THREE.Vector3(Math.cos(a) * radius, Math.sin(a) * radius * 0.5, 0));
        }
        return arr;
    }, [radius]);
    const geo = useMemo(() => new THREE.BufferGeometry().setFromPoints(pts), [pts]);
    useFrame(({ clock }) => {
        if (!ref.current) return;
        ref.current.rotation.z = clock.elapsedTime * speed;
        ref.current.rotation.x = Math.sin(clock.elapsedTime * 0.3) * 0.4;
        ref.current.material.opacity = 0.18 + Math.sin(clock.elapsedTime * 1.5 + radius) * 0.1;
    });
    return (
        <line ref={ref} geometry={geo}>
            <lineBasicMaterial color={color} transparent opacity={0.22} />
        </line>
    );
}

export default function ProjectsScene() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
    const rawX = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], [-80, 0, 0, 60]);
    const rawOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
    const x = useSpring(rawX, { stiffness: 65, damping: 22 });

    return (
        <motion.div ref={ref} style={{ x, opacity: rawOpacity }} className="w-full h-full">
            <Canvas camera={{ position: [0, 0, 5.5], fov: 55 }}
                gl={{ alpha: true, antialias: true }} shadows style={{ background: "transparent" }}>
                <ambientLight intensity={2.5} color="#ffffff" />
                <directionalLight position={[5, 8, 5]} intensity={3} color="#ffffff" castShadow />
                <directionalLight position={[-4, 2, -4]} intensity={2} color="#e879f9" />
                <pointLight position={[3, 4, 3]} intensity={5} color="#c026d3" />
                <pointLight position={[-3, -3, 3]} intensity={3} color="#a855f7" />
                <pointLight position={[0, 6, 0]} intensity={2.5} color="#f0abfc" />
                <Environment preset="warehouse" />

                <BrainModel />
                <SynapseWeb nodeCount={16} />
                <NeuronOrbs count={12} />
                <ThoughtWave radius={3.2} speed={0.2} color="#e879f9" />
                <ThoughtWave radius={4.0} speed={-0.15} color="#a855f7" />
                <ThoughtWave radius={4.8} speed={0.1} color="#c084fc" />

                <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.8}
                    maxPolarAngle={Math.PI / 1.8} minPolarAngle={Math.PI / 3.5} enableRotate={false} />
            </Canvas>
        </motion.div>
    );
}