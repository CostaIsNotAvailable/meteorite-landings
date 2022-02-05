import { Component, Input, OnInit } from '@angular/core';
import ThreeGlobe from 'three-globe';
import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
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
  styleUrls: ['./globe.component.scss'],
})
export class GlobeComponent implements OnInit {
  @Input()
  set displayData(displayData: MeteoriteLanding[]) {
    this._displayData = displayData;
    this.setMeteoritesOnGlobe();
  }

  get dataExist(): MeteoriteLanding[] {
    return this._displayData;
  }

  @Input()
  set isCanceled(isCanceled: boolean) {
    this._isCanceled = isCanceled;
  }

  get isCanceled(): boolean {
    return this._isCanceled;
  }

  private _displayData!: MeteoriteLanding[];
  private _isCanceled!: boolean;
  Globe = new ThreeGlobe();

  async setMeteoritesOnGlobe(): Promise<void> {
    let labelsData: LabelData[] = [];
    let labelsDataWhenCancel: LabelData[] = [];

    let i = 1;
    const delay = 1000;
    const maxPropagation = 3;
    for (const item of this._displayData) {
      i++;
      const randomizerOVER9000 = Math.random() * 5;
      labelsDataWhenCancel.push({
        lat: item.recLat,
        lng: item.recLong,
        labelColor: 'white',
        size: 0.15,
        text: item.name + ' - ' + item.year.substring(0, 4),
      });
      if (!this._isCanceled) {
        await setTimeout(() => {
          labelsData.push({
            lat: item.recLat,
            lng: item.recLong,
            labelColor: 'white',
            size: 0.15,
            text: item.name + ' - ' + item.year.substring(0, 4),
          });
          if (!this._isCanceled) {
            const maxR = Math.min(Math.random() * item.mass, maxPropagation);
            const ringData = [
              {
                lat: item.recLat,
                lng: item.recLong,
                maxR: maxR,
                propagationSpeed: maxR / (maxPropagation / 2),
                repeatPeriod: 2500,
              },
            ];
            const arcsData = [
              {
                startLat: item.recLat + randomizerOVER9000,
                startLng: item.recLong + randomizerOVER9000 * 2,
                endLat: item.recLat,
                endLng: item.recLong,
                altitude: 1,
                color: 'yellow',
              },
            ];
            this.Globe.arcsData(arcsData)
              .arcColor('color')
              .arcDashLength(0.4)
              .arcDashGap(randomizerOVER9000)
              .arcDashInitialGap(randomizerOVER9000 * 0.16)
              .arcDashAnimateTime(delay)
              .ringsData(ringData)
              .ringColor(() => '#F82306')
              .ringMaxRadius('maxR')
              .ringPropagationSpeed('propagationSpeed')
              .ringRepeatPeriod('repeatPeriod');
            this.Globe.labelsData(labelsData)
              .labelText('text')
              .labelSize('size')
              .labelDotRadius(0.5 / 5)
              .labelColor('labelColor');
          } else {
            this.Globe.arcsData([]);
            this.Globe.ringsData([]);
            this.Globe.labelsData([]);
            this.Globe.labelsData(labelsDataWhenCancel.slice(800))
              .labelText('text')
              .labelSize('size')
              .labelDotRadius(0.5 / 5)
              .labelColor('labelColor');
          }
        }, i * delay);
      }
    }
  }

  ngOnInit(): void {
    this.Globe = new ThreeGlobe()
      .globeImageUrl(
        '//unpkg.com/three-globe/example/img/earth-blue-marble.jpg'
      )
      .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png');

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(1, 1, 1); // change light position to see the specularMap's effect

    // Render
    const render = new THREE.WebGLRenderer();
    render.setSize(window.innerWidth / 1.201, window.innerHeight);
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
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    camera.position.z = 280; // Zoom camera

    // Camera controls
    const tbControls = new TrackballControls(camera, render.domElement);
    tbControls.minDistance = 101;
    tbControls.rotateSpeed = 5;
    tbControls.zoomSpeed = 0.8;

    (function animate() {
      tbControls.update();
      render.render(scene, camera);
      requestAnimationFrame(animate);
    })();
  }
}
