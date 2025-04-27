import * as THREE from 'three';

//Pick Helpers
export class PickHelper {
    raycaster: THREE.Raycaster;
    pickedObject: THREE.Object3D | null;
    outlineMesh: THREE.Mesh | null;
    renderer: THREE.WebGLRenderer;
    pickPosition: { x: number; y: number; };
    canvas: HTMLCanvasElement;

    constructor(renderer: THREE.WebGLRenderer) {
        this.pickPosition = { x: 0, y: 0};
        this.renderer = renderer;
        this.raycaster = new THREE.Raycaster();
        this.pickedObject = null;
        this.outlineMesh = null;
        this.canvas = this.renderer.domElement;
    }

    pick(
         scene: THREE.Scene, camera: THREE.Camera, time: number      ) {
        // Remove previous outline

        this.pickedObject = null;

        // Raycast
        this.raycaster.setFromCamera(new THREE.Vector2(this.pickPosition.x, this.pickPosition.y), camera);
        const intersectedObjects = this.raycaster.intersectObjects(scene.children, true);
        if (intersectedObjects.length) {
            this.pickedObject = intersectedObjects[0].object;
        }
    }

    setPickPosition(event: MouseEvent | Touch, pos: { x: number; y: number; } | undefined) {       
        if (pos) {
            this.pickPosition.x = (pos.x / this.canvas.width ) *  2 - 1;
            this.pickPosition.y = (pos.y / this.canvas.height) * -2 + 1;  // note we flip Y
        }
    }
    
    
    clearPickPosition() {
        this.pickPosition = {x: -1000000, y: -1000000}
    }
}