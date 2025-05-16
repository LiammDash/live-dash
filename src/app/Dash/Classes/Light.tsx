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
  hoverColor: any;
  activeColor: any;
  inactiveColor: any;


  constructor(helpers: any, x: number, y: number, z: number, HAid: string = "", groupId: string = "") {
    //Init Vars
    this.helpers = helpers;
    this.groupId = groupId;
    this.HAid = HAid;
    this.active = false;
    this.color = this.activeColor
    this.intensity = 0;
    this.hoverColor = 0xBBFFBB;
    this.activeColor = 0xffffff;
    this.inactiveColor = 0x555555;

    this.light = new THREE.PointLight(this.color, this.intensity);
    const geometry = new THREE.SphereGeometry(2, 2, 2);
    const material = new THREE.MeshBasicMaterial({ color: this.inactiveColor });
    this.sphere = new THREE.Mesh(geometry, material);
    this.sphere.position.set(x, y, z);
    helpers.scene.add(this.sphere);

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
          (this.sphere.material as THREE.MeshBasicMaterial).color.set(this.hoverColor); // highlight color
          helpers.renderer.domElement.style.cursor = 'pointer';
        }
      } else {
        if (this.isHovered) {
          this.isHovered = false;
          helpers.renderer.domElement.style.cursor = 'default';
          (this.sphere.material as THREE.MeshBasicMaterial).color.set(this.active ? this.activeColor : this.inactiveColor);
        }
      }
    });

    //Initiate default values for three light
    this.light.position.set(x, y, z);
    helpers.scene.add(this.light);
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
        (this.sphere.material as THREE.MeshBasicMaterial).color.set(active ? this.activeColor : this.inactiveColor);
    }
  }

}