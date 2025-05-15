'use client'


//Note Taking
/*
Notification bell up in the task bar, this will slide out notifications on the right
*/


// Imports
import React from 'react'
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import styles from './style.module.css';

import { PickHelper } from './Classes/PickHelper';
import { Light } from './Classes/Light'
import { LED } from './Classes/LED'
import Dock from '@/app/Dash/Dock/dock'
import ToolBar from '@/app/Dash/ToolBar/toolbar'

const Dash = () => {
  //Vars
  var toggleGroups = true;

    // Wait For DOM to load
  React.useEffect(() => {
    //Generate Generic 3Js Vars
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    const renderer = new THREE.WebGLRenderer();

    //Set Up Renderer
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );


    //Load GLTF Model
    const GLTFloader = new GLTFLoader();

    GLTFloader.load('/JaydenHouse.glb', function (gltf: { scene: THREE.Object3D }) {
      houseModel = gltf.scene; // Assign the loaded scene to the variable

      // Set a name for the group so it can be identified in the scene
      houseModel.name = "JaydenHouse";

      // Enable shadow receiving for all meshes in the model
      houseModel.traverse((child: any) => {
      if (child.isMesh) {
        //child.castShadow = true;
        //child.receiveShadow = true;
      }
      });

      scene.add(houseModel);

      leds.forEach(led => {
        led.initiateLed();
      });

      // Console log all models (children) in the loaded scene
      /*houseModel.traverse((child) => {
      console.log('Model:', child);
      });*/
    }, undefined, function (error: any) {
      console.error(error);
    });

    // Enable shadows in the renderer
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    //Helper for PickHelper...
    function getCanvasRelativePosition(event: MouseEvent | Touch) {
          const rect = renderer.domElement.getBoundingClientRect();
          return {
              x: ('clientX' in event ? event.clientX : 0) - rect.left * renderer.domElement.width  / rect.width,
              y: ('clientY' in event ? event.clientY : 0) - rect.top  * renderer.domElement.height / rect.height,
          };
    }

    //Create PickHelper
    const pickHelper = new PickHelper(renderer);

    let houseModel;

    const helpers = {
      scene: scene,
      renderer: renderer,
      pickHelper: pickHelper,
      camera: camera,
      toggleGroups: toggleGroups,
      getCanvasRelativePosition: getCanvasRelativePosition,
      houseModel: houseModel,
    }

    //Event Listeners
      //Mouse Event Listeners
      window.addEventListener('mousemove', (event) => {
        pickHelper.setPickPosition(event, getCanvasRelativePosition(event));
      });
      window.addEventListener('mouseout', pickHelper.clearPickPosition);
      window.addEventListener('mouseleave', pickHelper.clearPickPosition);

      //Touch Event Listeners
      window.addEventListener('touchstart', (event) => {
          // prevent the window from scrolling
          event.preventDefault();
          if (event.touches.length > 0) {
              pickHelper.setPickPosition(event.touches[0], getCanvasRelativePosition(event.touches[0]));
          }
      }, {passive: false});
      window.addEventListener('touchmove', (event) => {
          if (event.touches.length > 0) {
              pickHelper.setPickPosition(event.touches[0], getCanvasRelativePosition(event.touches[0]));
          }
      });
      window.addEventListener('touchend', pickHelper.clearPickPosition);

      //Custom Events
      window.addEventListener('groupToggleClicked', () => {
        helpers.toggleGroups = !toggleGroups;
      });

    //Load Skybox
    const skyLoader = new THREE.TextureLoader();
    const texture = skyLoader.load(
    '/skybox.png',
    () => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      texture.colorSpace = THREE.SRGBColorSpace;
      scene.background = texture;
    });



    //Set Initial Cam Pos
    camera.position.set(0, 43, 90); camera.rotation.x = -0.4;

    //Create Lights
    let lights = [];

    let kitchenLight1 = new Light(helpers, 58, 35, -8, "light.hue_color_downlight_4", "light.kitchen");
    let kitchenLight2 = new Light(helpers, 58, 38, 8, "light.hue_color_downlight_2_2", "light.kitchen");
    lights.push(kitchenLight1, kitchenLight2)

    let livingRoom1 = new Light(helpers, 28, 35, -8, "light.hue_color_downlight_1_2", "light.lounge");
    let livingRoom2 = new Light(helpers, 28, 38, 8, "light.hue_color_downlight_3", "light.lounge");
    lights.push(livingRoom1, livingRoom2)

    let bedroom1 = new Light(helpers, -25, 35, -8, "light.hue_color_downlight_1", "light.bedroom_main_main");
    let bedroom2 = new Light(helpers, -25, 38, 8, "light.hue_color_downlight_2", "light.bedroom_main_main");
    lights.push(bedroom1, bedroom2)

    let bathroom1 = new Light(helpers, -55, 35, -8, "light.hue_color_downlight_1_3", "light.bathroom_2");
    let bathroom2 = new Light(helpers, -55, 38, 8, "light.hue_color_downlight_1_4", "light.bathroom_2");
    lights.push(bathroom1, bathroom2)

    let bedroomLamp1 = new Light(helpers, -40, 10, -20, "light.bedroom_l", "");
    let bedroomLamp2 = new Light(helpers, -15, 10, -20, "light.bedroom_r", "");
    lights.push(bedroomLamp1, bedroomLamp2)

    let kitchenLamp1 = new Light(helpers, 58, 12, -14, "light.wooden_light", "light.lounge");
    lights.push(kitchenLamp1)


    //Create LED Strips
    let leds: LED[] = [];

    let serverLED = new LED(helpers, "light.rack_light_1", "", "Server_LED_Strip");
    leds.push(serverLED)

    //Set Light Polling
    setInterval(() => {
      lights.forEach(light => {
        light.pollLightState();
      });
    }, 1000000);

    //Set Light Polling
    setInterval(() => {
      leds.forEach(led => {
        led.pollLightState();
      });
    }, 1000000);

    // Add OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.screenSpacePanning = false;
    controls.minDistance = 10;
    controls.maxDistance = 200;
    controls.maxPolarAngle = Math.PI / 2;

    //Animation Loop
    function animate(time: number) {
      time *= 0.001;
      pickHelper.pick(scene, camera, time);
      renderer.render( scene, camera );
    }
  renderer.setAnimationLoop( animate );

  }, []);
  return (
    <>
      <ToolBar />
      <Dock />
    </>
  )
}

export default Dash