import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import confetti from 'canvas-confetti';
import { playWashingMachineSound, playButtonClick, playDoorSound } from '../utils/audio';
import trackingService from '../../../services/trackingService';

export function WashingMachine3D() {
    const containerRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);
    const machineRef = useRef(null);
    const animationRef = useRef(null);

    // State
    const [isDoorOpen, setIsDoorOpen] = useState(false);
    const [isWashing, setIsWashing] = useState(false);
    const [washMode, setWashMode] = useState('Normal');

    // Animation Refs
    const doorAngle = useRef(0);
    const drumAngle = useRef(0);
    const washStartTime = useRef(0);

    // Targets (for smooth animation)
    const targetDoorAngle = useRef(0);

    // Helpers to access state in loop
    const isWashingRef = useRef(false);
    useEffect(() => { isWashingRef.current = isWashing; }, [isWashing]);

    // -- Handlers --

    const handleDoorToggle = useCallback(() => {
        if (isWashingRef.current) return;
        const newState = !isDoorOpen;
        setIsDoorOpen(newState);
        targetDoorAngle.current = newState ? -Math.PI / 2 : 0;
        playDoorSound();
        trackingService.trackInteraction('door', newState ? 'open' : 'close', true);
    }, [isDoorOpen]);

    const handleStartToggle = useCallback(() => {
        if (isDoorOpen) return; // Safety lock

        if (!isWashing) {
            // Start
            setIsWashing(true);
            washStartTime.current = Date.now();
            playWashingMachineSound();
            confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
        } else {
            // Stop
            setIsWashing(false);
        }
        playButtonClick();
        trackingService.trackInteraction('start_button', 'click', true);
    }, [isWashing, isDoorOpen]);

    // -- Scene Setup --
    useEffect(() => {
        if (!containerRef.current) return;

        // Scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x555555);
        sceneRef.current = scene;

        // Camera
        const camera = new THREE.PerspectiveCamera(50, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 100);
        camera.position.set(0, 2, 6);
        camera.lookAt(0, 1.5, 0);
        cameraRef.current = camera;

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        rendererRef.current = renderer;

        while (containerRef.current.firstChild) containerRef.current.removeChild(containerRef.current.firstChild);
        containerRef.current.appendChild(renderer.domElement);

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);
        const dirLight = new THREE.DirectionalLight(0xffffff, 1);
        dirLight.position.set(5, 10, 7);
        scene.add(dirLight);

        // Floor
        const floorGeo = new THREE.PlaneGeometry(20, 20);
        const floorMat = new THREE.MeshStandardMaterial({ color: 0x2a2a4a, roughness: 0.8 });
        const floor = new THREE.Mesh(floorGeo, floorMat);
        floor.rotation.x = -Math.PI / 2;
        scene.add(floor);

        // Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.target.set(0, 1.5, 0);

        // Load Model
        const loader = new GLTFLoader();
        loader.load('/games/washing-machine/washing_machine.glb', (gltf) => {
            const machine = gltf.scene;

            // Positioning fix
            const box = new THREE.Box3().setFromObject(machine);
            const size = box.getSize(new THREE.Vector3());
            const center = box.getCenter(new THREE.Vector3());
            const scale = 2.5 / Math.max(size.x, size.y, size.z);

            machine.scale.setScalar(scale);
            machine.position.x = -center.x * scale;
            machine.position.y = (-center.y + size.y / 2) * scale;
            machine.position.z = -center.z * scale;

            scene.add(machine);
            machineRef.current = machine;

            console.log("Model loaded for interactive mode");
        });

        // Loop
        const animate = () => {
            animationRef.current = requestAnimationFrame(animate);

            if (machineRef.current) {
                // 1. Animate Door (door01_10)
                const door = machineRef.current.getObjectByName('door01_10');
                if (door) {
                    // Smoothly interpolate angle
                    const diff = targetDoorAngle.current - doorAngle.current;
                    if (Math.abs(diff) > 0.001) {
                        doorAngle.current += diff * 0.1;
                        // Assuming Y rotation for door
                        door.rotation.y = doorAngle.current;
                        // Note: Original model rotation might need offset, but usually 0 is closed.
                    }
                }

                // 2. Animate Drum (inside_3)
                const drum = machineRef.current.getObjectByName('inside_3');
                if (drum && isWashingRef.current) {
                    drum.rotation.z += 0.15;
                }
            }

            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        // Cleanup
        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
            renderer.dispose();
            containerRef.current?.removeChild(renderer.domElement);
        };
    }, []);

    return (
        <div className="washing-machine-3d-container">
            <div ref={containerRef} className="canvas-container" style={{ width: '100%', height: '100%' }} />

            <div className="control-overlay">
                <div className="status-display">
                    <div className="status-item">
                        <span className="label">Status:</span>
                        <span className={`value ${isWashing ? 'washing' : ''}`}>
                            {isWashing ? '🌀 Washing...' : isDoorOpen ? '🚪 Door Open' : '✅ Ready'}
                        </span>
                    </div>
                </div>

                <div className="control-buttons">
                    <button
                        className={`control-btn ${isDoorOpen ? 'active' : ''}`}
                        onClick={handleDoorToggle}
                        disabled={isWashing}
                    >
                        {isDoorOpen ? 'Close Door' : 'Open Door'}
                    </button>

                    <button
                        className={`control-btn start-btn ${isWashing ? 'active' : ''}`}
                        onClick={handleStartToggle}
                        disabled={isDoorOpen}
                    >
                        {isWashing ? 'Stop' : 'Start'}
                    </button>
                </div>
            </div>
        </div>
    );
}
