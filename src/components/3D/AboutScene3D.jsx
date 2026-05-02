// AboutScene3D.jsx
import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Environment, useGLTF, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function fixMaterials(scene) {
    scene.traverse((child) => {
        if (!child.isMesh) return;
        const mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.forEach((m) => {
            if (m.isMeshStandardMaterial || m.isMeshPhysicalMaterial) {
                m.roughness = Math.min(m.roughness ?? 0.5, 0.6);
                m.envMapIntensity = 2.4;
            }
            m.needsUpdate = true;
        });
        child.castShadow = true;
    });
}

function AIRobotModel() {
    const { scene } = useGLTF("/ai_robot.glb");
    const ref = useRef();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setIsMobile(window.innerWidth < 768);
    }, []);

    useEffect(() => {
        fixMaterials(scene);
    }, [scene]);

    useFrame(({ clock }) => {
        if (!ref.current) return;
        ref.current.rotation.y = clock.elapsedTime * 0.45;
        ref.current.position.y = -0.8 + Math.sin(clock.elapsedTime * 1.1) * 0.1;
    });

    return (
        <Float speed={isMobile ? 1 : 1.2} floatIntensity={isMobile ? 0.4 : 0.6} rotationIntensity={0.2}>
            <primitive ref={ref} object={scene} scale={isMobile ? 1.5 : 2.2} position={[0, -0.8, 0]} />
        </Float>
    );
}

// PCB-style grid lines on the ground plane
function CircuitGrid() {
    const ref = useRef();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setIsMobile(window.innerWidth < 768);
    }, []);

    const geo = useMemo(() => {
        const g = new THREE.BufferGeometry();
        const verts = [];
        const size = 6; const step = 0.6;
        for (let x = -size; x <= size; x += step) {
            verts.push(x, -2.2, -size, x, -2.2, size);
        }
        for (let z = -size; z <= size; z += step) {
            verts.push(-size, -2.2, z, size, -2.2, z);
        }
        g.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
        return g;
    }, []);

    useFrame(({ clock }) => {
        if (ref.current) ref.current.material.opacity = 0.12 + Math.sin(clock.elapsedTime * 1.5) * 0.05;
    });

    return (
        <lineSegments ref={ref} geometry={geo}>
            <lineBasicMaterial color="#06b6d4" transparent opacity={isMobile ? 0.08 : 0.15} />
        </lineSegments>
    );
}

// Floating binary bit particles
function BinaryParticles({ count = 60 }) {
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
            pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
        }
        return pos;
    }, [count, isMobile]);

    const posAttr = useRef();

    useFrame(() => {
        if (!posAttr.current) return;
        const arr = posAttr.current.array;
        for (let i = 0; i < (isMobile ? count / 2 : count); i++) {
            arr[i * 3 + 1] += 0.008;
            if (arr[i * 3 + 1] > 4) arr[i * 3 + 1] = -4;
        }
        posAttr.current.needsUpdate = true;
    });

    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute ref={posAttr} attach="attributes-position" args={[positions, 3]} />
            </bufferGeometry>
            <pointsMaterial size={isMobile ? 0.03 : 0.055} color="#22d3ee" transparent opacity={isMobile ? 0.4 : 0.55} sizeAttenuation />
        </points>
    );
}

// Electric arc rings (hexagonal tech rings)
function TechRing({ radius, y, speed, color }) {
    const ref = useRef();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setIsMobile(window.innerWidth < 768);
    }, []);

    const pts = useMemo(() => {
        const arr = [];
        for (let i = 0; i <= 6; i++) {
            const a = (i / 6) * Math.PI * 2;
            arr.push(new THREE.Vector3(Math.cos(a) * radius, y, Math.sin(a) * radius));
        }
        return arr;
    }, [radius, y]);

    const geo = useMemo(() => new THREE.BufferGeometry().setFromPoints(pts), [pts]);

    useFrame(({ clock }) => {
        if (ref.current) {
            ref.current.rotation.y = clock.elapsedTime * (isMobile ? speed * 0.5 : speed);
            ref.current.material.opacity = (isMobile ? 0.2 : 0.3) + Math.sin(clock.elapsedTime * 2 + radius) * 0.15;
        }
    });

    return (
        <line ref={ref} geometry={geo}>
            <lineBasicMaterial color={color} transparent opacity={isMobile ? 0.25 : 0.4} />
        </line>
    );
}

// Touch rotation handler (like hero section)
function TouchRotationHandler() {
    const { camera } = useThree();
    const [targetRotation, setTargetRotation] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setIsMobile(window.innerWidth < 768);

        const handleMouseMove = (e) => {
            if (!isMobile) {
                const x = (e.clientX / window.innerWidth) * 2 - 1;
                const y = (e.clientY / window.innerHeight) * 2 - 1;
                setTargetRotation({ x: x * 0.5, y: y * 0.3 });
            }
        };

        const handleTouchRotate = (e) => {
            if (isDragging && isMobile) {
                const { x, y } = e.detail || e;
                setTargetRotation({ x: x * 0.5, y: y * 0.3 });
            }
        };

        const handleTouchStart = () => setIsDragging(true);
        const handleTouchEnd = () => {
            setIsDragging(false);
            setTargetRotation({ x: 0, y: 0 });
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("touch-rotate", handleTouchRotate);
        window.addEventListener("touch-start", handleTouchStart);
        window.addEventListener("touch-end", handleTouchEnd);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("touch-rotate", handleTouchRotate);
            window.removeEventListener("touch-start", handleTouchStart);
            window.removeEventListener("touch-end", handleTouchEnd);
        };
    }, [isDragging, isMobile]);

    useFrame(() => {
        if (camera) {
            camera.position.x += (targetRotation.x - camera.position.x) * 0.05;
            camera.position.y += (targetRotation.y - camera.position.y) * 0.05;
            camera.lookAt(0, 0, 0);
        }
    });

    return null;
}

export default function AboutScene3D({ height = "100%" }) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setIsMobile(window.innerWidth < 768);
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
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
                camera={{ position: [0, 0, isMobile ? 6 : 5.5], fov: isMobile ? 50 : 52 }}
                gl={{ alpha: true, antialias: true }}
                shadows
                style={{ background: "transparent" }}
            >
                <ambientLight intensity={isMobile ? 0.2 : 0.3} />
                <pointLight position={[10, 10, 10]} intensity={isMobile ? 0.8 : 1.5} color="#a855f7" />
                <pointLight position={[-10, -10, -10]} intensity={isMobile ? 0.4 : 0.8} color="#06b6d4" />
                <pointLight position={[0, 10, -10]} intensity={isMobile ? 0.3 : 0.5} color="#f59e0b" />
                <pointLight position={[3, 4, 3]} intensity={isMobile ? 0.5 : 1} color="#22d3ee" />
                <pointLight position={[-3, -3, 3]} intensity={isMobile ? 0.4 : 0.8} color="#a855f7" />
                <Environment preset="dawn" />

                <AIRobotModel />
                <CircuitGrid />
                <BinaryParticles count={isMobile ? 30 : 50} />
                <TechRing radius={isMobile ? 1.8 : 2.6} y={0} speed={0.5} color="#06b6d4" />
                <TechRing radius={isMobile ? 2.2 : 3.2} y={0.5} speed={-0.3} color="#a855f7" />
                <TechRing radius={isMobile ? 1.5 : 2} y={-0.5} speed={0.7} color="#22d3ee" />

                {/* Mouse/Touch interaction for 3D scene like hero */}
                <TouchRotationHandler />

                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    autoRotate={!isMobile}
                    autoRotateSpeed={0.8}
                    maxPolarAngle={Math.PI / 1.8}
                    minPolarAngle={Math.PI / 3.5}
                    enableRotate={false}
                />
            </Canvas>
        </div>
    );
}