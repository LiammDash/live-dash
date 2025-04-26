'use client'

import React from 'react'
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import "@melloware/coloris/dist/coloris.css";
import * as Coloris from "@melloware/coloris";
import styles from './style.module.css';


import GroupToggle from '@/app/groupToggle/groupToggle';

const home = () => {
  // Create a scene
  React.useEffect(() => {
    //Generate Generic 3Js Vars
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    const renderer = new THREE.WebGLRenderer();

    //Vars
    const pickPosition = {x: 0, y: 0};
    var toggleGroups = true;

    //Pick Helpers
    class PickHelper {
      raycaster: THREE.Raycaster;
      pickedObject: THREE.Object3D | null;
      outlineMesh: THREE.Mesh | null;

      constructor() {
          this.raycaster = new THREE.Raycaster();
          this.pickedObject = null;
          this.outlineMesh = null;
      }

      pick(
          normalizedPosition: { x: number; y: number; }, scene: THREE.Scene, camera: THREE.Camera, time: number      ) {
          // Remove previous outline
          if (this.outlineMesh) {
              scene.remove(this.outlineMesh);
              this.outlineMesh.geometry.dispose();
              this.outlineMesh.material.dispose();
              this.outlineMesh = null;
          }
          this.pickedObject = null;

          // Raycast
          this.raycaster.setFromCamera(normalizedPosition, camera);
          const intersectedObjects = this.raycaster.intersectObjects(scene.children, true);
          if (intersectedObjects.length) {
              this.pickedObject = intersectedObjects[0].object;

              /* Create outline mesh
              if (this.pickedObject.geometry) {
                  const outlineMaterial = new THREE.MeshBasicMaterial({
                      color: 0xFFFFFF,
                      side: THREE.BackSide,
                      transparent: true,
                      opacity: 1
                  });
                  this.outlineMesh = new THREE.Mesh(this.pickedObject.geometry.clone(), outlineMaterial);
                  this.outlineMesh.position.copy(this.pickedObject.getWorldPosition(new THREE.Vector3()));
                  this.outlineMesh.quaternion.copy(this.pickedObject.getWorldQuaternion(new THREE.Quaternion()));
                  // Reduce the scale multiplier for a thinner outline
                  this.outlineMesh.scale.copy(this.pickedObject.getWorldScale(new THREE.Vector3())).multiplyScalar(1.02);
                  scene.add(this.outlineMesh);
              }*/
          }
      }


      getCanvasRelativePosition(event: MouseEvent | Touch) {
        const canvas = renderer.domElement as HTMLCanvasElement;
        const rect = canvas.getBoundingClientRect();
        return {
            x: ('clientX' in event ? event.clientX : 0) - rect.left * canvas.width  / rect.width,
            y: ('clientY' in event ? event.clientY : 0) - rect.top  * canvas.height / rect.height,
        };
      }
    
      setPickPosition(event: MouseEvent | Touch) {
          const canvas = renderer.domElement as HTMLCanvasElement;
          const pos = pickHelper.getCanvasRelativePosition(event);
          pickPosition.x = (pos.x / canvas.width ) *  2 - 1;
          pickPosition.y = (pos.y / canvas.height) * -2 + 1;  // note we flip Y
      }
      
      
      clearPickPosition() {
          pickPosition.x = -100000;
          pickPosition.y = -100000;
      }
    }

    const pickHelper = new PickHelper();

    //Event Listeners

      //Mouse Event Listeners
      window.addEventListener('mousemove', pickHelper.setPickPosition);
      window.addEventListener('mouseout', pickHelper.clearPickPosition);
      window.addEventListener('mouseleave', pickHelper.clearPickPosition);

      //Touch Event Listeners
      window.addEventListener('touchstart', (event) => {
          // prevent the window from scrolling
          event.preventDefault();
          if (event.touches.length > 0) {
              pickHelper.setPickPosition(event.touches[0]);
          }
      }, {passive: false});
      window.addEventListener('touchmove', (event) => {
          if (event.touches.length > 0) {
              pickHelper.setPickPosition(event.touches[0]);
          }
      });
      window.addEventListener('touchend', pickHelper.clearPickPosition);



    //Set Up Renderer
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );



    //Load Skybox
    const skyLoader = new THREE.TextureLoader();
    const texture = skyLoader.load(
    '/skybox.png',
    () => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      texture.colorSpace = THREE.SRGBColorSpace;
      scene.background = texture;
    });



    //Load GLTF Model
    const GLTFloader = new GLTFLoader();
    let houseModel: {
      position: any; rotation: { y: number; }; 
};
    GLTFloader.load('/JaydenHouse.glb', function (gltf: { scene: any; }) {
        houseModel = gltf.scene; // Assign the loaded scene to the variable
        scene.add(houseModel);
    }, undefined, function (error: any) {
        console.error(error);
    });




    //Set Cam Pos
    camera.position.z = 90;
    camera.position.y = 43;
    camera.rotation.x = -0.4;

    //Create a Box
    function createBox(x: number, y: number, z: number) {
      const geometry = new THREE.BoxGeometry( 1, 1, 1 );
      const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
      const cube = new THREE.Mesh( geometry, material );
      cube.position.set(x, y, z);
      scene.add( cube );
    }


    //Create Lights
    class Light {
      light: THREE.PointLight;
      sphere: THREE.Mesh;
      color: number;
      intensity: number;
      active: boolean;
      HAid: string;
      isHovered: boolean = false;
      groupId: string;

      constructor(x: number, y: number, z: number, color: number = 0xFFEEEE, intensity: number = 800.5, physical: boolean = false, active: boolean = true, HAid: string = "", groupId: string = "") {
      this.groupId = groupId;
      this.HAid = HAid;
      this.active = active;
      this.color = color;
      this.intensity = intensity;
      this.light = new THREE.PointLight(color, intensity);
      if (physical) {
        const geometry = new THREE.SphereGeometry(2, 2, 2);
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        this.sphere = new THREE.Mesh(geometry, material);
        this.sphere.position.set(x, y, z);
        scene.add(this.sphere);

        // Add event listener for clicks
        renderer.domElement.addEventListener('click', (event: MouseEvent | Touch) => {
          pickHelper.setPickPosition(event);
          pickHelper.pick(pickPosition, scene, camera, performance.now());
          if (pickHelper.pickedObject === this.sphere) {
            const idToToggle = toggleGroups && this.groupId ? this.groupId : this.HAid;
            fetch(`/api/toggleLight/${idToToggle}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ active: this.active }),
            })
            .then((response: { ok: any; }) => {
            if (response.ok) {
              this.pollLightState();
            } else {
            console.error('Error toggling light');
            }
          })
          }
        });

        // Add hover effect
        renderer.domElement.addEventListener('mousemove', (event: MouseEvent | Touch) => {
          pickHelper.setPickPosition(event);
          pickHelper.pick(pickPosition, scene, camera, performance.now());
          if (pickHelper.pickedObject === this.sphere) {
          if (!this.isHovered) {
            this.isHovered = true;
            (this.sphere.material as THREE.MeshBasicMaterial).color.set(0xBBFFBB); // highlight color
            renderer.domElement.style.cursor = 'pointer';
          }
          } else {
          if (this.isHovered) {
            this.isHovered = false;
            renderer.domElement.style.cursor = 'default';
          }
          }
        });
      }
      
      this.light.position.set(x, y, z);
      this.light.castShadow = true;
      scene.add(this.light);




      this.pollLightState(); // Initial call
      

      this.light.visible = !!this.active;
      }
      pollLightState() {
        fetch(`/api/lightState/${this.HAid}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        })
        .then((response) => response.json())
        .then((data) => {
        if (data.state === 'on') {
          this.light.color.setHex(parseInt(data.color, 16));
          this.light.intensity = data.brightness;
          this.setActive(true);
        } else {
          this.setActive(false);
        }
        })
        .catch((error) => {
        console.error('Error fetching light state:', error);
        });
      };
      setActive(active: boolean) {
      this.active = active;
      this.light.visible = active;
        if (this.sphere && !this.isHovered) {
            (this.sphere.material as THREE.MeshBasicMaterial).color.set(active ? 0xffffff : 0x555555);
        }
      }
    }

    let kitchenLight1 = new Light(58, 35, -8, 0x03c2fc, 800.5, true, false, "light.hue_color_downlight_4", "light.kitchen");
    let kitchenLight2 = new Light(58, 38, 8, 0x03c2fc, 800.5, true, false, "light.hue_color_downlight_2_2", "light.kitchen");

    let livingRoom1 = new Light(28, 35, -8, 0x03c2fc, 800.5, true, false, "light.hue_color_downlight_1_2", "light.lounge");
    let livingRoom2 = new Light(28, 38, 8, 0x03c2fc, 800.5, true, false, "light.hue_color_downlight_3", "light.lounge");

    let bedroom1 = new Light(-25, 35, -8, 0x03c2fc, 800.5, true, false, "light.hue_color_downlight_1", "light.bedroom_main_main");
    let bedroom2 = new Light(-25, 38, 8, 0x03c2fc, 800.5, true, false, "light.hue_color_downlight_2", "light.bedroom_main_main");

    let bathroom1 = new Light(-55, 35, -8, 0x03c2fc, 800.5, true, false, "light.hue_color_downlight_1_3", "light.bathroom_2");
    let bathroom2 = new Light(-55, 38, 8, 0x03c2fc, 800.5, true, false, "light.hue_color_downlight_1_4", "light.bathroom_2");

    let bedroomLamp1 = new Light(-40, 10, -20, 0x03c2fc, 800.5, true, false, "light.bedroom_l", "");
    let bedroomLamp2 = new Light(-15, 10, -20, 0x03c2fc, 800.5, true, false, "light.bedroom_r", "");

    let kitchenLamp1 = new Light(58, 12, -14, 0x03c2fc, 800.5, true, false, "light.wooden_light", "light.kitchen");

    let serverLED = new Light(30, 9, -6, 0x03c2fc, 800.5, true, false, "light.rack_light_1", "");

    let lights = [
      kitchenLight1,
      kitchenLight2,
      livingRoom1,
      livingRoom2,
      bedroom1,
      bedroom2,
      bathroom1,
      bathroom2,
      bedroomLamp1,
      bedroomLamp2,
      kitchenLamp1,
      serverLED
    ]

    setInterval(() => {
      lights.forEach(light => {
        light.pollLightState();
      });
    }, 500);

    

    // Add OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 10;
    controls.maxDistance = 200;
    controls.maxPolarAngle = Math.PI / 2;


    window.addEventListener('groupToggleClicked', () => {
      // Example: reset camera position on group toggle
      toggleGroups = !toggleGroups;
    });





    function animate(time: number) {
      time *= 0.001;
      pickHelper.pick(pickPosition, scene, camera, time);

      renderer.render( scene, camera );
    }
  renderer.setAnimationLoop( animate );


  if (typeof window !== 'undefined') {
    Coloris.init();
    Coloris.coloris({el: "#coloris"});
    Coloris.close();
  }

  }, []);
  return (
    <>
      <input type="text" id={styles.colorpick} data-coloris></input>
      <GroupToggle />
    </>
  )
}

export default home