// Three.js 3D Background Animation
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.querySelector('#bg-canvas');
    if (!canvas) return;

    // Scene Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xf2f2f2, 10, 50); // Soft fog fading into background

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Objects Group
    const geometryGroup = new THREE.Group();
    scene.add(geometryGroup);

    // Varied Materials for more visibility
    const glassMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.1,
        roughness: 0.1,
        transparent: true,
        opacity: 0.8,
        transmission: 0.5,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });

    const accentMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x3366ff, // Blue tint
        metalness: 0.2,
        roughness: 0.2,
        transparent: true,
        opacity: 0.6,
        transmission: 0.2,
        clearcoat: 1.0
    });

    const geometries = [
        new THREE.IcosahedronGeometry(1, 0),
        new THREE.TorusGeometry(1.5, 0.4, 16, 100),
        new THREE.OctahedronGeometry(1.2),
        new THREE.SphereGeometry(0.8, 32, 32),
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.ConeGeometry(0.8, 1.5, 32)
    ];

    const meshes = [];

    // Scatter MORE shapes (Increased to 50)
    for (let i = 0; i < 50; i++) {
        const geo = geometries[Math.floor(Math.random() * geometries.length)];
        // Randomly pick material, mostly glass but some accents
        const mat = Math.random() > 0.8 ? accentMaterial : glassMaterial;
        const mesh = new THREE.Mesh(geo, mat);
        
        // Spread them out more widely
        mesh.position.x = (Math.random() - 0.5) * 40;
        mesh.position.y = (Math.random() - 0.5) * 40;
        mesh.position.z = (Math.random() - 0.5) * 20 - 10;
        
        mesh.rotation.x = Math.random() * Math.PI;
        mesh.rotation.y = Math.random() * Math.PI;
        
        const scale = Math.random() * 0.5 + 0.5;
        mesh.scale.set(scale, scale, scale);
        
        // Store initial scale for hover effect
        mesh.userData = { 
            initialScale: scale,
            rotationSpeed: Math.random() * 0.02 + 0.005
        };

        geometryGroup.add(mesh);
        meshes.push(mesh);
    }

    // Floating Particles for extra depth
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 200;
    const posArray = new Float32Array(particleCount * 3);
    
    for(let i = 0; i < particleCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 50;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particleMaterial = new THREE.PointsMaterial({
        size: 0.05,
        color: 0x000000,
        transparent: true,
        opacity: 0.2
    });
    
    const particlesMesh = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particlesMesh);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x3366ff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);
    
    const pointLight2 = new THREE.PointLight(0xff3366, 1);
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);

    camera.position.z = 5;

    // Raycaster for Mouse Interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        // Normalized coordinates for Raycaster (-1 to +1)
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // Custom coordinates for rotation
        mouseX = (event.clientX - windowHalfX) * 0.001;
        mouseY = (event.clientY - windowHalfY) * 0.001;
    });

    // Scroll Interaction
    let scrollY = 0;
    window.addEventListener('scroll', () => {
        scrollY = window.scrollY;
    });

    // Animation Loop
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();

        // 1. Scene Rotation based on Mouse
        targetX = mouseX * 0.5;
        targetY = mouseY * 0.5;
        geometryGroup.rotation.y += 0.05 * (targetX - geometryGroup.rotation.y);
        geometryGroup.rotation.x += 0.05 * (targetY - geometryGroup.rotation.x);

        // 2. Raycasting for Interaction
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(meshes);

        // Reset all scales first (smoothly)
        meshes.forEach(mesh => {
            const targetScale = mesh.userData.initialScale;
            mesh.scale.x += (targetScale - mesh.scale.x) * 0.1;
            mesh.scale.y += (targetScale - mesh.scale.y) * 0.1;
            mesh.scale.z += (targetScale - mesh.scale.z) * 0.1;
            
            // Constant rotation
            mesh.rotation.x += mesh.userData.rotationSpeed;
            mesh.rotation.y += mesh.userData.rotationSpeed;
            
            // Floating motion
            mesh.position.y += Math.sin(elapsedTime * 0.5 + mesh.id) * 0.002;
        });

        // Apply effect to intersected objects
        intersects.forEach(intersect => {
            const mesh = intersect.object;
            // Scale up on hover
            const hoverScale = mesh.userData.initialScale * 1.5;
            mesh.scale.x += (hoverScale - mesh.scale.x) * 0.2;
            mesh.scale.y += (hoverScale - mesh.scale.y) * 0.2;
            mesh.scale.z += (hoverScale - mesh.scale.z) * 0.2;
            
            // Spin faster on hover
            mesh.rotation.x += 0.1;
            mesh.rotation.y += 0.1;
        });

        // 3. Scroll Effects
        geometryGroup.position.y = scrollY * 0.005; 
        geometryGroup.rotation.z = scrollY * 0.001;
        geometryGroup.rotation.x = scrollY * 0.0005;
        
        // Particles slow drift
        particlesMesh.rotation.y = elapsedTime * 0.05;
        particlesMesh.rotation.x = elapsedTime * 0.02;

        renderer.render(scene, camera);
    }

    animate();

    // Handle Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});
