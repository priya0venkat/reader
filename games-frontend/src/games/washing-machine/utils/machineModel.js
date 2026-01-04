import * as THREE from 'three';

/**
 * Creates the washing machine body (cabinet)
 */
export function createBody() {
    const group = new THREE.Group();

    // Main cabinet
    const bodyGeometry = new THREE.BoxGeometry(2.2, 2.8, 2);
    const bodyMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        specular: 0x222222,
        shininess: 30,
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 1.4;
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);

    // Front panel (slightly darker)
    const frontGeometry = new THREE.BoxGeometry(2.18, 2.78, 0.05);
    const frontMaterial = new THREE.MeshPhongMaterial({
        color: 0xf5f5f5,
        specular: 0x111111,
        shininess: 40,
    });
    const front = new THREE.Mesh(frontGeometry, frontMaterial);
    front.position.set(0, 1.4, 1.02);
    group.add(front);

    // Base/feet
    const baseGeometry = new THREE.BoxGeometry(2.1, 0.1, 1.9);
    const baseMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = 0.05;
    group.add(base);

    // Four feet
    const footGeometry = new THREE.CylinderGeometry(0.08, 0.1, 0.1, 16);
    const footMaterial = new THREE.MeshPhongMaterial({ color: 0x222222 });
    const footPositions = [
        [-0.9, 0, 0.8],
        [0.9, 0, 0.8],
        [-0.9, 0, -0.8],
        [0.9, 0, -0.8],
    ];
    footPositions.forEach(pos => {
        const foot = new THREE.Mesh(footGeometry, footMaterial);
        foot.position.set(pos[0], 0, pos[2]);
        group.add(foot);
    });

    return group;
}

/**
 * Creates the door with glass window
 */
export function createDoor() {
    const group = new THREE.Group();
    group.name = 'door';

    // Door frame (ring)
    const frameGeometry = new THREE.TorusGeometry(0.65, 0.1, 16, 32);
    const frameMaterial = new THREE.MeshPhongMaterial({
        color: 0xcccccc,
        specular: 0x444444,
        shininess: 60,
    });
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);
    frame.rotation.y = Math.PI / 2;
    group.add(frame);

    // Glass window
    const glassGeometry = new THREE.CircleGeometry(0.55, 32);
    const glassMaterial = new THREE.MeshPhongMaterial({
        color: 0x88aacc,
        transparent: true,
        opacity: 0.4,
        specular: 0xffffff,
        shininess: 100,
        side: THREE.DoubleSide,
    });
    const glass = new THREE.Mesh(glassGeometry, glassMaterial);
    glass.position.z = 0.05;
    group.add(glass);

    // Door handle
    const handleGeometry = new THREE.BoxGeometry(0.08, 0.3, 0.05);
    const handleMaterial = new THREE.MeshPhongMaterial({
        color: 0x888888,
        specular: 0xffffff,
        shininess: 80,
    });
    const handle = new THREE.Mesh(handleGeometry, handleMaterial);
    handle.position.set(0.6, 0, 0.08);
    group.add(handle);

    // Hinge point is at the left side
    group.position.set(-0.65, 1.3, 1.1);
    group.userData.hingeX = -0.65;

    return group;
}

/**
 * Creates the internal drum
 */
export function createDrum() {
    const group = new THREE.Group();
    group.name = 'drum';

    // Outer drum cylinder
    const drumGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1.2, 32, 1, true);
    const drumMaterial = new THREE.MeshPhongMaterial({
        color: 0xaaaaaa,
        specular: 0x555555,
        shininess: 50,
        side: THREE.DoubleSide,
    });
    const drum = new THREE.Mesh(drumGeometry, drumMaterial);
    drum.rotation.x = Math.PI / 2;
    group.add(drum);

    // Drum back plate
    const backGeometry = new THREE.CircleGeometry(0.5, 32);
    const backMaterial = new THREE.MeshPhongMaterial({
        color: 0x999999,
        specular: 0x444444,
        shininess: 40,
    });
    const back = new THREE.Mesh(backGeometry, backMaterial);
    back.position.z = -0.6;
    group.add(back);

    // Add perforation pattern (small dots)
    const dotGeometry = new THREE.CircleGeometry(0.03, 8);
    const dotMaterial = new THREE.MeshBasicMaterial({ color: 0x333333 });
    for (let i = 0; i < 24; i++) {
        const angle = (i / 24) * Math.PI * 2;
        for (let row = 0; row < 3; row++) {
            const z = -0.4 + row * 0.3;
            const dot = new THREE.Mesh(dotGeometry, dotMaterial);
            dot.position.set(Math.cos(angle) * 0.35, Math.sin(angle) * 0.35, z);
            group.add(dot);
        }
    }

    // Internal paddles (lifters)
    const paddleGeometry = new THREE.BoxGeometry(0.08, 0.15, 0.8);
    const paddleMaterial = new THREE.MeshPhongMaterial({ color: 0xcccccc });
    for (let i = 0; i < 3; i++) {
        const angle = (i / 3) * Math.PI * 2;
        const paddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
        paddle.position.set(Math.cos(angle) * 0.38, Math.sin(angle) * 0.38, 0);
        paddle.rotation.z = angle;
        group.add(paddle);
    }

    group.position.set(0, 1.3, 0.3);

    return group;
}

/**
 * Creates the control panel with buttons
 */
export function createControlPanel() {
    const group = new THREE.Group();
    group.name = 'controlPanel';

    // Panel background
    const panelGeometry = new THREE.BoxGeometry(2, 0.5, 0.1);
    const panelMaterial = new THREE.MeshPhongMaterial({
        color: 0xeeeeee,
        specular: 0x222222,
        shininess: 30,
    });
    const panel = new THREE.Mesh(panelGeometry, panelMaterial);
    group.add(panel);

    // Create buttons
    const buttonColors = [0x4CAF50, 0x2196F3, 0xFF9800]; // Green, Blue, Orange
    const buttonLabels = ['start', 'mode', 'temp'];

    buttonColors.forEach((color, index) => {
        const buttonGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.06, 16);
        const buttonMaterial = new THREE.MeshPhongMaterial({
            color: color,
            specular: 0xffffff,
            shininess: 80,
        });
        const button = new THREE.Mesh(buttonGeometry, buttonMaterial);
        button.rotation.x = -Math.PI / 2;
        button.position.set(-0.5 + index * 0.4, 0, 0.08);
        button.name = `button_${buttonLabels[index]}`;
        button.userData.isButton = true;
        button.userData.type = buttonLabels[index];
        group.add(button);
    });

    // Display screen
    const screenGeometry = new THREE.PlaneGeometry(0.5, 0.2);
    const screenMaterial = new THREE.MeshBasicMaterial({
        color: 0x001122,
    });
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.set(0.6, 0, 0.06);
    screen.name = 'displayScreen';
    group.add(screen);

    group.position.set(0, 2.55, 1.05);

    return group;
}

/**
 * Creates the detergent drawer
 */
export function createDrawer() {
    const group = new THREE.Group();
    group.name = 'drawer';

    // Drawer front
    const frontGeometry = new THREE.BoxGeometry(0.6, 0.25, 0.08);
    const frontMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        specular: 0x333333,
        shininess: 40,
    });
    const front = new THREE.Mesh(frontGeometry, frontMaterial);
    group.add(front);

    // Drawer handle
    const handleGeometry = new THREE.BoxGeometry(0.3, 0.04, 0.02);
    const handleMaterial = new THREE.MeshPhongMaterial({ color: 0x888888 });
    const handle = new THREE.Mesh(handleGeometry, handleMaterial);
    handle.position.set(0, -0.05, 0.05);
    group.add(handle);

    group.position.set(-0.7, 2.2, 1.1);

    return group;
}

/**
 * Creates water/foam effect particles
 */
export function createWaterEffect() {
    const group = new THREE.Group();
    group.name = 'waterEffect';
    group.visible = false;

    // Create bubble particles
    const bubbleGeometry = new THREE.SphereGeometry(0.03, 8, 8);
    const bubbleMaterial = new THREE.MeshPhongMaterial({
        color: 0xaaddff,
        transparent: true,
        opacity: 0.6,
    });

    for (let i = 0; i < 30; i++) {
        const bubble = new THREE.Mesh(bubbleGeometry, bubbleMaterial.clone());
        bubble.position.set(
            (Math.random() - 0.5) * 0.8,
            (Math.random() - 0.5) * 0.8,
            (Math.random() - 0.5) * 0.6
        );
        bubble.userData.speed = Math.random() * 0.02 + 0.01;
        bubble.userData.originalY = bubble.position.y;
        group.add(bubble);
    }

    group.position.set(0, 1.3, 0.5);

    return group;
}

/**
 * Creates the complete washing machine
 */
export function createWashingMachine() {
    const machine = new THREE.Group();
    machine.name = 'washingMachine';

    const body = createBody();
    const door = createDoor();
    const drum = createDrum();
    const controlPanel = createControlPanel();
    const drawer = createDrawer();
    const waterEffect = createWaterEffect();

    machine.add(body);
    machine.add(door);
    machine.add(drum);
    machine.add(controlPanel);
    machine.add(drawer);
    machine.add(waterEffect);

    return machine;
}
