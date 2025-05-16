import * as THREE from 'three';

export class LED {
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
    init: boolean;
    hoverColor: any;
    activeColor: any;
    inactiveColor: any;
    x: any;
    y: any;
    z: any;
    light: any;


    constructor(helpers: any, HAid: string = "", groupId: string = "", modelName: string = "", x, y, z) {
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
        this.init = false;
        this.hoverColor = 0xBBFFBB;
        this.activeColor = 0xffffff;
        this.inactiveColor = 0x555555;
        this.x = x;
        this.y = y;
        this.z = z;
        this.light = THREE.PointLight;

    }

    initiateLed() {
        const jaydenHouse = this.helpers.scene.children.find((child: any) => child.name === "JaydenHouse");
        const mesh = jaydenHouse.children.find((child: any) => child.name === this.modelName);
        this.model = mesh

        // Add event listener for clicks
        this.helpers.renderer.domElement.addEventListener('click', (event: MouseEvent | Touch) => {
            this.helpers.pickHelper.setPickPosition(event, this.helpers.getCanvasRelativePosition(event));
            this.helpers.pickHelper.pick(this.helpers.scene, this.helpers.camera, performance.now());
            if (this.helpers.pickHelper.pickedObject === this.model) {
                const idToToggle = this.helpers.toggleGroups && this.groupId ? this.groupId : this.HAid;
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
        this.helpers.renderer.domElement.addEventListener('mousemove', (event: MouseEvent | Touch) => {
            this.helpers.pickHelper.setPickPosition(event, this.helpers.getCanvasRelativePosition(event));
            this.helpers.pickHelper.pick(this.helpers.scene, this.helpers.camera, performance.now());
            if (this.helpers.pickHelper.pickedObject === this.model) {
                this.isHovered = true;
                this.material.color.set(this.hoverColor); // highlight color
                this.material.emissive.set(this.hoverColor);
                this.helpers.renderer.domElement.style.cursor = 'pointer';
            } else {
                if(this.isHovered) {
                    this.isHovered = false;
                    this.pollLightState();
                    this.helpers.renderer.domElement.style.cursor = 'default';
                }
            }
        });

        //Initiate Material
        let emissiveMaterial = new THREE.MeshStandardMaterial({
            color: "#ff5500",
            emissive: "#ff5500",
            emissiveIntensity: this.intensity,
        });
        this.material = emissiveMaterial;

        //Initiate Point Light
        this.light = new THREE.PointLight(this.color, this.intensity*6, 50, 1);
        this.light.position.set(this.x, this.y, this.z);
        this.helpers.scene.add(this.light);

        this.pollLightState();

        this.init = true;
    };

    pollLightState() {
        fetch(`/api/lightState/${this.HAid}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.state === 'on' && !this.isHovered) {
                this.setActive(true)
                this.material.color.setHex(parseInt(data.color, 16))
                this.light.visible = true;
                this.light.color.setHex(parseInt(data.color, 16))
                this.material.emissive.setHex(parseInt(data.color, 16))
                this.material.intensity = data.brightness*100000;
                this.model.material = this.material;
            } else if (data.state != 'on' && !this.isHovered) {
                this.setActive(false)
                this.material.color.set(this.inactiveColor)
                this.light.visible = false;
                this.light.color.set(this.inactiveColor)
                this.material.emissive.set(this.inactiveColor)
                this.material.intensity = data.brightness*1;
                this.model.material = this.material;
            }
        })
        .catch((error) => {
            console.error('Error fetching light state:', error);
        });
      };

    setActive(active: boolean) {
        this.active = active;
        if (this.model && !this.isHovered) {
            this.material.color.set(active ? this.activeColor : this.inactiveColor);
            this.light.color.set(active ? this.activeColor : this.inactiveColor);
        }
    }
}