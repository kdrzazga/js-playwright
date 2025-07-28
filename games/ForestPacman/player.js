class Player {

    static SIZE = 32;

    constructor(scene) {
        this.id = 0;
        this.geometry = new THREE.SphereGeometry(0.3, Player.SIZE, Player.SIZE);
        this.material = new THREE.MeshBasicMaterial({ color: 0xbbbb00 });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        scene.add(this.mesh);
    }

    update() {
        this.mesh.position.y = Math.sin(Date.now() * 0.002) * 0.4 + 0.68;
    }
}
