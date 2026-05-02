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
                m.envMapIntensity = 2.2;
            }
            m.needsUpdate = true;
        });
        child.castShadow = true;
    });
}

function AirportsModel() {
    const { scene } = useGLTF("/airports_around_the_world.glb");
    const ref = useRef();
    useEffect(() => { fixMaterials(scene); }, [scene]);
    useFrame(({ clock }) => {
        if (!ref.current) return;
        ref.current.rotation.y = clock.elapsedTime * 0.2;
        ref.current.position.y = Math.sin(clock.elapsedTime * 0.6) * 0.1;
    });
    return (
        <Float speed={1.0} floatIntensity={0.5}>
            <primitive ref={ref} object={scene} scale={1.6} position={[0, 0, 0]} />
        </Float>
    );
}

// Globe wireframe with lat/long lines
function GlobeGrid({ radius = 2.5 }) {
    const ref = useRef();
    const geo = useMemo(() => {
        const verts = [];
        // Latitude rings
        for (let lat = -80; lat <= 80; lat += 20) {
            const y = Math.sin((lat * Math.PI) / 180) * radius;
            const r = Math.cos((lat * Math.PI) / 180) * radius;
            for (let i = 0; i <= 64; i++) {
                const a = (i / 64) * Math.PI * 2;
                verts.push(Math.cos(a) * r, y, Math.sin(a) * r);
            }
        }
        // Longitude lines
        for (let lon = 0; lon < 360; lon += 30) {
            for (let i = 0; i <= 32; i++) {
                const lat = (i / 32) * 180 - 90;
                const a = (lon * Math.PI) / 180;
                const y = Math.sin((lat * Math.PI) / 180) * radius;
                const r = Math.cos((lat * Math.PI) / 180) * radius;
                verts.push(Math.cos(a) * r, y, Math.sin(a) * r);
            }
        }
        const g = new THREE.BufferGeometry();
        g.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
        return g;
    }, [radius]);
    useFrame(({ clock }) => {
        if (ref.current) ref.current.rotation.y = clock.elapsedTime * 0.12;
    });
    return (
        <points ref={ref} geometry={geo}>
            <pointsMaterial size={0.025} color="#06b6d4" transparent opacity={0.35} sizeAttenuation />
        </points>
    );
}

// Curved flight arc between two sphere points
function FlightArc({ from, to, color, speed }) {
    const ref = useRef();
    const pts = useMemo(() => {
        const arr = [];
        for (let i = 0; i <= 40; i++) {
            const t = i / 40;
            const x = from[0] + (to[0] - from[0]) * t;
            const y = from[1] + (to[1] - from[1]) * t + Math.sin(t * Math.PI) * 1.2;
            const z = from[2] + (to[2] - from[2]) * t;
            arr.push(new THREE.Vector3(x, y, z));
        }
        return arr;
    }, [from, to]);
    const geo = useMemo(() => new THREE.BufferGeometry().setFromPoints(pts), [pts]);
    useFrame(({ clock }) => {
        if (!ref.current) return;
        ref.current.material.opacity = 0.25 + Math.sin(clock.elapsedTime * speed + from[0]) * 0.15;
    });
    return (
        <line ref={ref} geometry={geo}>
            <lineBasicMaterial color={color} transparent opacity={0.35} />
        </line>
    );
}

// Location dot pins on globe
function LocationDots() {
    const locations = useMemo(() => {
        const r = 2.7;
        return [
            { lat: 19, lon: 73 },  // India
            { lat: 40, lon: -74 }, // New York
            { lat: 51, lon: 0 },   // London
            { lat: 35, lon: 139 }, // Tokyo
            { lat: -33, lon: 151 },// Sydney
        ].map(({ lat, lon }) => {
            const phi = ((90 - lat) * Math.PI) / 180;
            const theta = ((lon + 180) * Math.PI) / 180;
            return [
                r * Math.sin(phi) * Math.cos(theta),
                r * Math.cos(phi),
                r * Math.sin(phi) * Math.sin(theta),
            ];
        });
    }, []);

    return (
        <group>
            {locations.map((pos, i) => (
                <LocationDot key={i} pos={pos} i={i} />
            ))}
        </group>
    );
}

function LocationDot({ pos, i }) {
    const ref = useRef();
    useFrame(({ clock }) => {
        if (!ref.current) return;
        const s = 0.5 + Math.sin(clock.elapsedTime * 2 + i * 1.2) * 0.5;
        ref.current.scale.setScalar(s);
        ref.current.material.opacity = 0.4 + Math.sin(clock.elapsedTime * 2 + i) * 0.3;
    });
    return (
        <mesh ref={ref} position={pos}>
            <sphereGeometry args={[0.07, 8, 8]} />
            <meshBasicMaterial color="#f59e0b" transparent opacity={0.6} />
        </mesh>
    );
}

export default function EducationScene() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
    const rawY = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], [60, 0, 0, -40]);
    const rawOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
    const y = useSpring(rawY, { stiffness: 65, damping: 22 });

    return (
        <motion.div ref={ref} style={{ y, opacity: rawOpacity }} className="w-full h-full">
            <Canvas camera={{ position: [0, 0, 6], fov: 52 }}
                gl={{ alpha: true, antialias: true }} shadows style={{ background: "transparent" }}>
                <ambientLight intensity={2.5} color="#ffffff" />
                <directionalLight position={[5, 8, 5]} intensity={3} color="#ffffff" castShadow />
                <directionalLight position={[-4, 2, -4]} intensity={2} color="#34d399" />
                <pointLight position={[3, 4, 3]} intensity={4.5} color="#10b981" />
                <pointLight position={[-3, -3, 3]} intensity={3} color="#06b6d4" />
                <pointLight position={[0, 6, 0]} intensity={2.5} color="#6ee7b7" />
                <Environment preset="park" />

                <AirportsModel />
                <GlobeGrid radius={2.6} />
                <LocationDots />
                <FlightArc from={[2.1, 0.8, 1.3]} to={[-1.8, 1.5, -1.5]} color="#f59e0b" speed={2} />
                <FlightArc from={[-2.0, 1.0, 1.0]} to={[1.5, -1.2, 2.0]} color="#10b981" speed={1.5} />
                <FlightArc from={[0.5, 2.5, 0.5]} to={[-1.0, -2.0, -1.8]} color="#06b6d4" speed={2.5} />

                <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.7}
                    maxPolarAngle={Math.PI / 1.8} minPolarAngle={Math.PI / 3} enableRotate={false} />
            </Canvas>
        </motion.div>
    );
}