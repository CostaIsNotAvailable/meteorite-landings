import { Component, OnInit } from '@angular/core';
import ThreeGlobe from 'three-globe';
import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
import { Material } from 'three';

interface ExtendedGlobeMaterial {
  bumpScale: number;
  specularMap: THREE.Texture;
  specular: THREE.Color;
  shininess: number;
}

@Component({
  selector: 'app-globe',
  templateUrl: './globe.component.html',
  styleUrls: ['./globe.component.scss']
})
export class GlobeComponent implements OnInit {

  ngOnInit(): void {
    const Globe = new ThreeGlobe()
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
      .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png');

    // Global Material
    const globeMaterial = (Globe.globeMaterial() as Material & ExtendedGlobeMaterial);
    globeMaterial.bumpScale = 10;
    new THREE.TextureLoader().load('//unpkg.com/three-globe/example/img/earth-water.png', texture => {
      globeMaterial.specularMap = texture;
      globeMaterial.specular = new THREE.Color('grey');
      globeMaterial.shininess = 15;
    });

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
    scene.add(Globe);
    scene.add(new THREE.AmbientLight(0xbbbbbb));
    scene.add(directionalLight);

    // Camera
    const camera = new THREE.PerspectiveCamera();
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    camera.position.z = 350;

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
