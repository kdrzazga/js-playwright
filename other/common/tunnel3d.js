class Tunnel3D {

    constructor(scene, options = {}) {
        this.scene = scene;

        this.speed = options.speed ?? 30;
        this.direction = options.direction ?? 'in';
        this.curved = options.curved ?? 0;

        this.starCount = options.starCount ?? 1000;
        this.tunnelDepth = options.tunnelDepth ?? 120;
        this.spreadRadius = options.spreadRadius ?? 7;
        this.nearZ = options.nearZ ?? -1.5;
        this.starSize = options.starSize ?? 0.4;
        this.color = options.color ?? 0xffffff;

        this.baseAngles = null;
        this.baseRadii = null;
        this.positions = null;
        this.geometry = null;
        this.points = null;
    }

    get farZ() {
        return this.nearZ - this.tunnelDepth;
    }

    draw() {
        if (this.points) return;

        this.positions = new Float32Array(this.starCount * 3);
        this.baseAngles = new Float32Array(this.starCount);
        this.baseRadii = new Float32Array(this.starCount);

        for (let i = 0; i < this.starCount; i++) {
            const depthAcross = this.nearZ - this.farZ;
            const startZ = this.farZ + Math.random() * depthAcross;
            this._placeStar(i, startZ);
        }

        this.geometry = new THREE.BufferGeometry();
        this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));

        const material = new THREE.PointsMaterial({
            color: this.color,
            size: this.starSize,
            map: this._createDotTexture(),
            sizeAttenuation: true,
            transparent: true,
            opacity: 0.9,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });

        this.points = new THREE.Points(this.geometry, material);
        this.points.frustumCulled = false;
        this.scene.add(this.points);
    }

    update(delta) {
        if (!this.points) return;

        const step = this.speed * delta;

        for (let i = 0; i < this.starCount; i++) {
            let z = this.positions[i * 3 + 2];

            if (this.direction === 'in') {
                z -= step;
                if (z < this.farZ) {
                    this._placeStar(i, this.nearZ);
                    continue;
                }
            } else {
                z += step;
                if (z > this.nearZ) {
                    this._placeStar(i, this.farZ);
                    continue;
                }
            }

            this._renderStar(i, z);
        }

        this.geometry.attributes.position.needsUpdate = true;
    }

    setVisible(visible) {
        if (this.points) this.points.visible = visible;
    }

    _createDotTexture() {
        const size = 32;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;

        const ctx = canvas.getContext('2d');
        const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
        gradient.addColorStop(0.0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.5, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(1.0, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, size, size);

        return new THREE.CanvasTexture(canvas);
    }

    _placeStar(index, z) {
        this.baseAngles[index] = Math.random() * Math.PI * 2;
        this.baseRadii[index] = Math.sqrt(Math.random()) * this.spreadRadius;
        this._renderStar(index, z);
    }

    _renderStar(index, z) {
        const depthProgress = (this.nearZ - z) / this.tunnelDepth;
        const twist = this.curved * depthProgress * Math.PI * 2;
        const angle = this.baseAngles[index] + twist;
        const radius = this.baseRadii[index];

        this.positions[index * 3] = Math.cos(angle) * radius;
        this.positions[index * 3 + 1] = Math.sin(angle) * radius;
        this.positions[index * 3 + 2] = z;
    }
}
