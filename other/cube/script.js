const speedVerticalSlider = document.getElementById('speed-vertical');
const speedHorizontalSlider = document.getElementById('speed-horizontal');
const changeColorButton = document.getElementById('change-color');
const zoomInButton = document.getElementById('zoom-in');
const zoomOutButton = document.getElementById('zoom-out');
const tunnelToggle = document.getElementById('tunnel-toggle');
const tunnelInverse = document.getElementById('tunnel-inverse');
const tunnelCurved = document.getElementById('tunnel-curved');
const tunnelSuboptions = document.getElementById('tunnel-suboptions');

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const wireframeMaterial = new THREE.LineBasicMaterial({ color: 0x000000 }); // black color for the wireframe
const wireframe = new THREE.LineSegments(new THREE.EdgesGeometry(geometry), wireframeMaterial);

let speedX = 0.01
let speedY = 0.01
scene.add(wireframe);

// Tunnel starfield, drawn behind the cube in the same scene. Hidden until toggled.
const clock = new THREE.Clock();
const tunnel = new Tunnel3D(scene);
tunnel.draw();
tunnel.setVisible(false);

const predefinedColors = [
    0xff0000, // Red
    0x00ff00, // Green
    0x0000ff, // Blue
    0xffff00, // Yellow
    0xff00ff, // Magenta
    0x00ffff, // Cyan
    0xaaaaaa, // gray
    0xffffff  // White
];

function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();

	speedX = speedVerticalSlider.value / 100;
	speedY = speedHorizontalSlider.value / 100;

    cube.rotation.x += speedX;
    cube.rotation.y += speedY;
    wireframe.rotation.x += speedX;
    wireframe.rotation.y += speedY;

    if (tunnelToggle.checked) {
        tunnel.update(delta);
    }

    renderer.render(scene, camera);
}

changeColorButton.addEventListener('click', () => {
    const randomIndex = Math.floor(Math.random() * predefinedColors.length); 
    const randomColor = predefinedColors[randomIndex]; 
    cube.material.color.set(randomColor); 
});


zoomInButton.addEventListener('click', () => {
    camera.position.z -= 0.5;
});

zoomOutButton.addEventListener('click', () => {
    camera.position.z += 0.5;
});

tunnelToggle.addEventListener('change', () => {
    tunnel.setVisible(tunnelToggle.checked);
    tunnelSuboptions.style.display = tunnelToggle.checked ? 'inline' : 'none';
});

tunnelInverse.addEventListener('change', () => {
    tunnel.direction = tunnelInverse.checked ? 'out' : 'in';
});

tunnelCurved.addEventListener('change', () => {
    tunnel.curved = tunnelCurved.checked ? 1 : 0;
});

window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

animate();
