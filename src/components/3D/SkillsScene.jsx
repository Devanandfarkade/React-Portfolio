import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, useGLTF, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function fixMaterials(scene) {
    scene.traverse((child) => {
        if (!child.isMesh) return;
        const mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.forEach((m) => {
            if (m.isMeshStandardMaterial || m.isMeshPhysicalMaterial) {
                m.roughness = Math.min(m.roughness ?? 0.4, 0.55);
                m.envMapIntensity = 2.5;
            }
            m.needsUpdate = true;
        });
        child.castShadow = true;
    });
}

function LaptopModel() {
    const { scene } = useGLTF("/cyberpunk_laptop.glb");
    const ref = useRef();
    useEffect(() => { fixMaterials(scene); }, [scene]);
    useFrame(({ clock }) => {
        if (!ref.current) return;
        ref.current.rotation.y = Math.sin(clock.elapsedTime * 0.4) * 0.3;
        ref.current.position.y = -0.5 + Math.sin(clock.elapsedTime * 0.9) * 0.08;
    });
    return (
        <Float speed={1.3} floatIntensity={0.7}>
            <primitive ref={ref} object={scene} scale={1.15} position={[0, -0.5, 0]} />
        </Float>
    );
}

// Holographic scan line sweeping up
function HoloScan() {
    const ref = useRef();
    const geo = useMemo(() => {
        const g = new THREE.PlaneGeometry(5, 0.06);
        return g;
    }, []);
    useFrame(({ clock }) => {
        if (!ref.current) return;
        const t = (clock.elapsedTime * 0.6) % 1;
        ref.current.position.y = -3 + t * 6;
        ref.current.material.opacity = 0.25 - Math.abs(t - 0.5) * 0.4;
    });
    return (
        <mesh ref={ref} geometry={geo} rotation={[0, 0, 0]}>
            <meshBasicMaterial color="#00e5ff" transparent opacity={0.3} side={THREE.DoubleSide} />
        </mesh>
    );
}

// Vertical neon data stream columns
function DataStream({ x, z, speed, color }) {
    const ref = useRef();
    const count = 15;
    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = x;
            pos[i * 3 + 1] = (i / count) * 8 - 4;
            pos[i * 3 + 2] = z;
        }
        return pos;
    }, [x, z, count]);
    const posAttr = useRef();
    useFrame(({ clock }) => {
        if (!posAttr.current) return;
        const arr = posAttr.current.array;
        for (let i = 0; i < count; i++) {
            arr[i * 3 + 1] -= speed * 0.04;
            if (arr[i * 3 + 1] < -4) arr[i * 3 + 1] = 4;
        }
        posAttr.current.needsUpdate = true;
    });
    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute ref={posAttr} attach="attributes-position" args={[positions, 3]} />
            </bufferGeometry>
            <pointsMaterial size={0.07} color={color} transparent opacity={0.5} sizeAttenuation />
        </points>
    );
}

// Neon grid floor
function NeonGrid() {
    const ref = useRef();
    const geo = useMemo(() => {
        const g = new THREE.BufferGeometry();
        const verts = [];
        const size = 5; const step = 0.8;
        for (let x = -size; x <= size; x += step) { verts.push(x, -2, -size, x, -2, size); }
        for (let z = -size; z <= size; z += step) { verts.push(-size, -2, z, size, -2, z); }
        g.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
        return g;
    }, []);
    useFrame(({ clock }) => {
        if (ref.current) ref.current.material.opacity = 0.1 + Math.sin(clock.elapsedTime * 2) * 0.05;
    });
    return (
        <lineSegments ref={ref} geometry={geo}>
            <lineBasicMaterial color="#39ff14" transparent opacity={0.15} />
        </lineSegments>
    );
}

// Floating wireframe cube
function HoloCube() {
    const ref = useRef();
    useFrame(({ clock }) => {
        if (!ref.current) return;
        ref.current.rotation.x = clock.elapsedTime * 0.3;
        ref.current.rotation.y = clock.elapsedTime * 0.5;
        ref.current.rotation.z = clock.elapsedTime * 0.2;
    });
    return (
        <mesh ref={ref} scale={3.5} position={[0, 0, 0]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color="#00e5ff" wireframe transparent opacity={0.08} />
        </mesh>
    );
}

export default function SkillsScene() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setIsMobile(window.innerWidth < 768);
    }, []);

    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                position: "relative",
                zIndex: 1,
                pointerEvents: "auto",
            }}
        >
            <Canvas camera={{ position: [0, 0.5, 5.5], fov: 55 }}
                gl={{ alpha: true, antialias: true }} shadows style={{ background: "transparent" }}>
                <ambientLight intensity={1.8} color="#ffffff" />
                <directionalLight position={[5, 8, 5]} intensity={2.5} color="#ffffff" castShadow />
                <directionalLight position={[-4, 2, -4]} intensity={2.0} color="#39ff14" />
                <pointLight position={[3, 4, 3]} intensity={3.0} color="#00e5ff" />
                <pointLight position={[-3, -3, 3]} intensity={2.5} color="#ff007f" />
                <pointLight position={[0, -1, 4]} intensity={3.0} color="#00e5ff" />
                <Environment preset="night" />

                <LaptopModel />
                <HoloScan />
                <NeonGrid />
                <HoloCube />
                <DataStream x={-3.5} z={-1} speed={1.2} color="#00e5ff" />
                <DataStream x={3.5} z={-1} speed={0.8} color="#39ff14" />
                <DataStream x={-2} z={-3} speed={1.5} color="#ff007f" />
                <DataStream x={2} z={-3} speed={1.0} color="#00e5ff" />

                <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.7}
                    maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 4} enableRotate={true} />
            </Canvas>
        </div>
    );
}