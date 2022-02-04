import { Component, Input, OnInit } from '@angular/core';
import ThreeGlobe from 'three-globe';
import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
import { Material } from 'three';
import { MeteoriteLanding } from 'src/app/model/data.model';

interface ExtendedGlobeMaterial {
  bumpScale: number;
  specularMap: THREE.Texture;
  specular: THREE.Color;
  shininess: number;
}

interface LabelData {
  lat: number;
  lng: number;
  labelColor: string;
  size: number;
  text: string;
}
@Component({
  selector: 'app-globe',
  templateUrl: './globe.component.html',
  styleUrls: ['./globe.component.scss']
})
export class GlobeComponent implements OnInit {

  @Input()
  set displayData(displayData: MeteoriteLanding[]){
    this._displayData = displayData;
    this.setMeteoritesOnGlobe();
  }

  get dataExist(): MeteoriteLanding[] {
    return this._displayData;
  }

  private _displayData!: MeteoriteLanding[];
  Globe = new ThreeGlobe();

  async setMeteoritesOnGlobe(): Promise<void>{
    // Gen random data
    let labelsData: LabelData[] = [];

    let i = 1;
    const delay = 1000;
    const maxPropagation = 3;
    for (const item of this._displayData) {

      i++;
      const randomizerOVER9000 = Math.random()*5;
      await setTimeout(() => {
        labelsData.push(
          {
            lat: item.recLat,
            lng: item.recLong,
            labelColor: 'white',
            size: 0.1,
            text: item.name // TODO => onHover labelDot => See the name
          }
        );
        const maxR = Math.min(Math.random()*item.mass,maxPropagation);
        const ringData = [{
            lat: item.recLat,
            lng: item.recLong,
            maxR: maxR,
            propagationSpeed: maxR/(maxPropagation/2),
            repeatPeriod: 2500
        }]
        const arcsData = [{
          startLat: item.recLat + randomizerOVER9000,
          startLng: item.recLong + randomizerOVER9000*2,
          endLat: item.recLat,
          endLng: item.recLong,
          altitude: 1,
          color: 'yellow'
        }];
  
        this.Globe.arcsData(arcsData)
        .arcColor('color')
        .arcDashLength(0.4)
        .arcDashGap(randomizerOVER9000)
        .arcDashInitialGap(randomizerOVER9000*0.16)
        .arcDashAnimateTime(delay)
        .ringsData(ringData)
        .ringColor(() => '#F82306')
        .ringMaxRadius('maxR')
        .ringPropagationSpeed('propagationSpeed')
        .ringRepeatPeriod('repeatPeriod');
        this.Globe.labelsData(labelsData)
          .labelText('text')
          .labelSize('size')
          .labelDotRadius(0.5/5)
          .labelColor('labelColor')
      }
      ,i * delay);
    };
  }

  ngOnInit(): void {
    this.Globe = new ThreeGlobe()
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
      .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png');

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(1, 1, 1); // change light position to see the specularMap's effect

    // Render
    const render = new THREE.WebGLRenderer();
    render.setSize(window.innerWidth/1.101, window.innerHeight);
    const globeViz = document.getElementById('globeViz');
    if (globeViz) {
      globeViz.appendChild(render.domElement);
    }

    // Scene
    const scene = new THREE.Scene();
    scene.add(this.Globe);
    scene.add(new THREE.AmbientLight(0xbbbbbb));
    scene.add(directionalLight);

    // Camera
    const camera = new THREE.PerspectiveCamera();
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    camera.position.z = 280; // Zoom camera

    // Camera controls
    const tbControls = new TrackballControls(camera, render.domElement);
    tbControls.minDistance = 101;
    tbControls.rotateSpeed = 10;
    tbControls.zoomSpeed = 1;

    (function animate() {
      tbControls.update();
      render.render(scene, camera);
      requestAnimationFrame(animate);
    })();
  }

}
