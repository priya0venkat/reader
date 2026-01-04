import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { createWashingMachine } from '../utils/machineModel';
import { playWashingMachineSound, playButtonClick, playDoorSound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import trackingService from '../../../services/trackingService';

export function WashingMachine3D() {
    const containerRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);
    const machineRef = useRef(null);
    const animationRef = useRef(null);

    const [isDoorOpen, setIsDoorOpen] = useState(false);
    const [isWashing, setIsWashing] = useState(false);
    const [washMode, setWashMode] = useState('Normal');
    const [temperature, setTemperature] = useState('40°C');

    // Use refs to store current state for the click handler
    const stateRef = useRef({ isDoorOpen: false, isWashing: false });

    // Keep stateRef in sync
    useEffect(() => {
        stateRef.current = { isDoorOpen, isWashing };
    }, [isDoorOpen, isWashing]);

    // Animation state refs
    const doorTargetAngle = useRef(0);
    const currentDoorAngle = useRef(0);
    const washStartTime = useRef(0);
    const isWashingRef = useRef(false);

    // Keep isWashingRef in sync for animation
    useEffect(() => {
        isWashingRef.current = isWashing;
    }, [isWashing]);

    // Initialize Three.js scene
    useEffect(() => {
        if (!containerRef.current) return;

        // Scene setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x555555); // Lighter background for debugging
        sceneRef.current = scene;

        // Camera setup
        const camera = new THREE.PerspectiveCamera(
            50,
            containerRef.current.clientWidth / containerRef.current.clientHeight,
            0.1,
            100
        );
        camera.position.set(0, 2, 6);
        camera.lookAt(0, 1.5, 0);
        cameraRef.current = camera;

        // Renderer setup
        console.log('Container dimensions:', containerRef.current.clientWidth, containerRef.current.clientHeight);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.setClearColor(0x555555);

        // Clear any existing canvas (Strict Mode fix)
        while (containerRef.current.firstChild) {
            containerRef.current.removeChild(containerRef.current.firstChild);
        }

        containerRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Interactive Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.target.set(0, 1.5, 0);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const mainLight = new THREE.DirectionalLight(0xffffff, 1);
        mainLight.position.set(5, 10, 7);
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 1024;
        mainLight.shadow.mapSize.height = 1024;
        scene.add(mainLight);

        const fillLight = new THREE.DirectionalLight(0x8888ff, 0.3);
        fillLight.position.set(-5, 5, -5);
        scene.add(fillLight);

        // Floor
        const floorGeometry = new THREE.PlaneGeometry(20, 20);
        const floorMaterial = new THREE.MeshStandardMaterial({
            color: 0x2a2a4a,
            roughness: 0.8,
        });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;
        scene.add(floor);

        // Load washing machine model
        const loader = new GLTFLoader();
        // Try to load external model first
        loader.load(
            '/games/washing-machine/washing_machine.glb',
            (gltf) => {
                console.log('GLTF Loaded successfully', gltf);
                const machine = gltf.scene;
                machine.name = 'washingMachine';

                // Scale and position adjustment to fit scene
                const box = new THREE.Box3().setFromObject(machine);
                const size = box.getSize(new THREE.Vector3());
                const center = box.getCenter(new THREE.Vector3());

                console.log('Model size:', size);
                console.log('Model center:', center);

                const scale = 2.5 / Math.max(size.x, size.y, size.z);
                console.log('Applying scale:', scale);

                machine.scale.setScalar(scale);

                // Center the model
                machine.position.x = -center.x * scale;
                machine.position.y = -center.y * scale; // This puts the center at y=0, we might want bottom at y=0
                machine.position.z = -center.z * scale;

                // Adjust so bottom is at 0 if preferred, or just keep centered
                // machine.position.y += (size.y * scale) / 2;

                scene.add(machine);
                machineRef.current = machine;

                // Add debug helpers

            },
            undefined, // onProgress
            (error) => {
                console.log('External model not found or error loading, falling back to procedural model:', error);

                // Fallback to procedural model
                const machine = createWashingMachine();
                scene.add(machine);
                machineRef.current = machine;
            }
        );


        // Handle resize
        const handleResize = () => {
            if (!containerRef.current) return;
            const width = containerRef.current.clientWidth;
            const height = containerRef.current.clientHeight;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        };
        window.addEventListener('resize', handleResize);

        // Raycaster for click detection
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        const handleClick = (event) => {
            const rect = renderer.domElement.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(machine.children, true);

            if (intersects.length > 0) {
                let clickedObject = intersects[0].object;

                // Traverse up to find named objects
                while (clickedObject) {
                    if (clickedObject.name === 'door') {
                        handleDoorClickInternal();
                        return;
                    }
                    if (clickedObject.userData?.isButton) {
                        handleButtonClickInternal(clickedObject.userData.type);
                        return;
                    }
                    clickedObject = clickedObject.parent;
                }

                // Check parent names as fallback
                let parent = intersects[0].object.parent;
                while (parent) {
                    if (parent.name === 'door') {
                        handleDoorClickInternal();
                        return;
                    }
                    if (parent.name === 'controlPanel') {
                        // Clicked somewhere on control panel, check for buttons more carefully
                        const buttonCheck = intersects[0].object;
                        if (buttonCheck.userData?.isButton) {
                            handleButtonClickInternal(buttonCheck.userData.type);
                            return;
                        }
                    }
                    parent = parent.parent;
                }
            }
        };

        // Internal handlers that read from refs
        const handleDoorClickInternal = () => {
            if (stateRef.current.isWashing) return;

            const newState = !stateRef.current.isDoorOpen;
            doorTargetAngle.current = newState ? -Math.PI / 2 : 0;
            playDoorSound();
            trackingService.trackInteraction('door', newState ? 'open' : 'close', true);
            setIsDoorOpen(newState);
        };

        const handleButtonClickInternal = (buttonType) => {
            playButtonClick();
            trackingService.trackInteraction(`button_${buttonType}`, 'click', true);

            switch (buttonType) {
                case 'start':
                    if (!stateRef.current.isWashing && !stateRef.current.isDoorOpen) {
                        washStartTime.current = Date.now();
                        setIsWashing(true);
                        playWashingMachineSound();
                        confetti({
                            particleCount: 50,
                            spread: 60,
                            origin: { y: 0.7 }
                        });
                        // Stop after 10 seconds
                        setTimeout(() => {
                            setIsWashing(false);
                        }, 10000);
                    }
                    break;
                case 'mode':
                    setWashMode(prev => {
                        const modes = ['Normal', 'Delicate', 'Quick', 'Heavy'];
                        const currentIndex = modes.indexOf(prev);
                        return modes[(currentIndex + 1) % modes.length];
                    });
                    break;
                case 'temp':
                    setTemperature(prev => {
                        const temps = ['30°C', '40°C', '60°C', '90°C'];
                        const currentIndex = temps.indexOf(prev);
                        return temps[(currentIndex + 1) % temps.length];
                    });
                    break;
                default:
                    break;
            }
        };

        renderer.domElement.addEventListener('click', handleClick);

        // Animation loop
        const animate = () => {
            animationRef.current = requestAnimationFrame(animate);

            if (!machineRef.current || !rendererRef.current || !sceneRef.current || !cameraRef.current) return;

            const door = machineRef.current.getObjectByName('door');
            const drum = machineRef.current.getObjectByName('drum');
            const waterEffect = machineRef.current.getObjectByName('waterEffect');

            // Animate door
            if (door) {
                const angleDiff = doorTargetAngle.current - currentDoorAngle.current;
                if (Math.abs(angleDiff) > 0.01) {
                    currentDoorAngle.current += angleDiff * 0.1;
                    door.rotation.y = currentDoorAngle.current;
                }
            }

            // Animate washing
            if (isWashingRef.current) {
                const elapsed = (Date.now() - washStartTime.current) / 1000;

                // Spin drum
                if (drum) {
                    drum.rotation.z += 0.15;
                }

                // Show and animate water effect
                if (waterEffect) {
                    waterEffect.visible = true;
                    waterEffect.children.forEach((bubble) => {
                        bubble.position.y = bubble.userData.originalY + Math.sin(elapsed * 3 + bubble.position.x * 5) * 0.1;
                        bubble.position.x += Math.sin(elapsed * 2 + bubble.position.z) * 0.002;
                    });
                }

                // Machine shake
                machineRef.current.position.x = Math.sin(elapsed * 20) * 0.01;
                machineRef.current.position.y = Math.sin(elapsed * 25) * 0.005;
            } else {
                // Reset position
                machineRef.current.position.x = 0;
                machineRef.current.position.y = 0;

                if (waterEffect) {
                    waterEffect.visible = false;
                }
            }


            controls.update();
            rendererRef.current.render(sceneRef.current, cameraRef.current);
        };

        animate();

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            renderer.domElement.removeEventListener('click', handleClick);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            renderer.dispose();
            containerRef.current?.removeChild(renderer.domElement);
        };
    }, []);

    return (
        <div className="washing-machine-3d-container">
            <div ref={containerRef} className="canvas-container" />

            <div className="control-overlay">
                <div className="status-display">
                    <div className="status-item">
                        <span className="label">Mode:</span>
                        <span className="value">{washMode}</span>
                    </div>
                    <div className="status-item">
                        <span className="label">Temp:</span>
                        <span className="value">{temperature}</span>
                    </div>
                    <div className="status-item">
                        <span className="label">Status:</span>
                        <span className={`value ${isWashing ? 'washing' : ''}`}>
                            {isWashing ? '🌀 Washing...' : isDoorOpen ? '🚪 Door Open' : '✅ Ready'}
                        </span>
                    </div>
                </div>

                <div className="instructions">
                    <p>🖱️ Click the <strong>door</strong> to open/close</p>
                    <p>🔘 Click the <strong>buttons</strong> on top to control</p>
                    <p style={{ color: '#4CAF50' }}>🟢 Green = Start</p>
                    <p style={{ color: '#2196F3' }}>🔵 Blue = Mode</p>
                    <p style={{ color: '#FF9800' }}>🟠 Orange = Temperature</p>
                </div>
            </div>
        </div>
    );
}
