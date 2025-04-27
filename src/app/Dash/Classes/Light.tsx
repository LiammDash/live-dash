import * as THREE from 'three';

export class Light {
    light: THREE.PointLight;
    sphere!: THREE.Mesh;
    color: number;
    intensity: number;
    active: boolean;
    HAid: string;
    isHovered: boolean = false;
    groupId: string;
    helpers: any;
    modelName: string;
    model: any;


    constructor(helpers: any, x: number, y: number, z: number, HAid: string = "", groupId: string = "", modelName: string = "") {
      //Init Vars
      this.modelName = modelName;
      this.helpers = helpers;
      this.groupId = groupId;
      this.HAid = HAid;
      this.active = false;
      this.color = 0xffffff
      this.intensity = 1;
      this.model;
      if(this.modelName == "") {
        this.light = new THREE.PointLight(this.color, this.intensity);
        const geometry = new THREE.SphereGeometry(2, 2, 2);
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        this.sphere = new THREE.Mesh(geometry, material);
        this.sphere.position.set(x, y, z);
        helpers.scene.add(this.sphere);
      }else {
        console.log(helpers.scene.children)
        helpers.scene.children.forEach((child: any) => {
          // You can add your logic here for each child
          console.log(child)
        });
      }
      


      // Add event listener for clicks
      helpers.renderer.domElement.addEventListener('click', (event: MouseEvent | Touch) => {
        helpers.pickHelper.setPickPosition(event, helpers.getCanvasRelativePosition(event));
        helpers.pickHelper.pick(helpers.scene, helpers.camera, performance.now());
        if (helpers.pickHelper.pickedObject === this.sphere) {
          const idToToggle = helpers.toggleGroups && this.groupId ? this.groupId : this.HAid;
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
      helpers.renderer.domElement.addEventListener('mousemove', (event: MouseEvent | Touch) => {
        helpers.pickHelper.setPickPosition(event, helpers.getCanvasRelativePosition(event));
        helpers.pickHelper.pick(helpers.scene, helpers.camera, performance.now());
        if (helpers.pickHelper.pickedObject === this.sphere) {
        if (!this.isHovered) {
          this.isHovered = true;
          (this.sphere.material as THREE.MeshBasicMaterial).color.set(0xBBFFBB); // highlight color
          helpers.renderer.domElement.style.cursor = 'pointer';
        }
        } else {
        if (this.isHovered) {
          this.isHovered = false;
          helpers.renderer.domElement.style.cursor = 'default';
        }
        }
      });
      
      //Initiate default values for three light
      if(this.modelName == "") {
        this.light.position.set(x, y, z);
        this.light.castShadow = true;
        helpers.scene.add(this.light);
      }


      this.pollLightState(); // Initial call

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
          if(this.modelName == "") {
            this.light.color.setHex(parseInt(data.color, 16));
            this.light.intensity = data.brightness;
            
          }
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
        if(this.modelName == "") {
          this.light.visible = active;
          if (this.sphere && !this.isHovered) {
              (this.sphere.material as THREE.MeshBasicMaterial).color.set(active ? 0xffffff : 0x555555);
          }
        }

      }

      
      


  }