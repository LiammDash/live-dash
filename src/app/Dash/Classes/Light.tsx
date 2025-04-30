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
    material: any;


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
      this.material;
      if(this.modelName == "") {
        this.light = new THREE.PointLight(this.color, this.intensity);
        const geometry = new THREE.SphereGeometry(2, 2, 2);
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        this.sphere = new THREE.Mesh(geometry, material);
        this.sphere.position.set(x, y, z);
        helpers.scene.add(this.sphere);
      }else {
        //Gotta wait for this to load in, probably add some sort of event listener here
        setTimeout(() => {
            const jaydenHouse = this.helpers.scene.children.find((child: any) => child.name === "JaydenHouse");
            const mesh = jaydenHouse.children.find((child: any) => child.name === modelName);
            this.model = mesh

            // Add event listener for clicks
            helpers.renderer.domElement.addEventListener('click', (event: MouseEvent | Touch) => {
              helpers.pickHelper.setPickPosition(event, helpers.getCanvasRelativePosition(event));
              helpers.pickHelper.pick(helpers.scene, helpers.camera, performance.now());
              if (helpers.pickHelper.pickedObject === this.model) {
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
              });
              }
            });

            // Add hover effect for the model
            helpers.renderer.domElement.addEventListener('mousemove', (event: MouseEvent | Touch) => {
              helpers.pickHelper.setPickPosition(event, helpers.getCanvasRelativePosition(event));
              helpers.pickHelper.pick(helpers.scene, helpers.camera, performance.now());
              if (helpers.pickHelper.pickedObject === this.model) {
              if (!this.isHovered) {
                this.isHovered = true;
                if (this.model.material && this.model.material.color) {
                this.model.material.color.set(0xBBFFBB); // highlight color
                }
                helpers.renderer.domElement.style.cursor = 'pointer';
              }
              } else {
              if (this.isHovered) {
                this.isHovered = false;
                helpers.renderer.domElement.style.cursor = 'default';
              }
              }
            });
            
            if (this.model) {

              let emissiveMaterial = new THREE.MeshStandardMaterial({
                color: "#ff5500",
                emissive: "#ff5500",
                emissiveIntensity: this.intensity,
              });
              this.material = emissiveMaterial;
            }

        }, 500);
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
        helpers.scene.add(this.light);
        this.light.castShadow = true;
        // Configure shadow properties for better results
        this.light.shadow.bias = -0.005;
        this.light.shadow.mapSize.width = 1024;
        this.light.shadow.mapSize.height = 1024;
        // Ensure renderer has shadowMap enabled
        if (this.helpers.renderer) {
          this.helpers.renderer.shadowMap.enabled = true;
          this.helpers.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        }
      } 



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

          } else {
            this.material.color.setHex(parseInt(data.color, 16))
            this.material.emissive.setHex(parseInt(data.color, 16))
            this.material.intensity = data.brightness*100000;
            this.model.material = this.material;
          }
          this.setActive(true);
        } else {
          this.setActive(false);
          if(this.material) {
            this.material.color.setHex(parseInt("222222", 16))
            this.material.emissive.setHex(parseInt("222222", 16))
            this.material.intensity = data.brightness*1;
            this.model.material = this.material;
          }          
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