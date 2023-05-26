import React, { Component } from "react";
import ReactDOM from "react-dom";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

class App extends Component {
  
  componentDidMount() {
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    this.mount.appendChild(renderer.domElement);

    //nice to be able to look around, adding camera control
    const controls = new OrbitControls( camera, renderer.domElement );

    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial({ color: 0x88ddff });
    var cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    
    //making it easier to look at by adding edge outline
    let geo = new THREE.EdgesGeometry(cube.geometry);
    let mat = new THREE.LineBasicMaterial({ color: "black", linewidth: 10 });
    let wireframe = new THREE.LineSegments(geo, mat);
    wireframe.renderOrder = 1; // make sure wireframes are rendered 2nd
    cube.add(wireframe);

    camera.position.z = 5;

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update()

      //cube.rotation.x += 0.01;
      //cube.rotation.y += 0.01;

      renderer.render(scene, camera);

    };



    const conf = {color: '#88ddff', radians: true, x: 0, y: 0, z: 0};
    //adding object controls
    const gui = new GUI();
    const cubeFolder = gui.addFolder('Cube');
    const rotations = cubeFolder.addFolder('Rotation');
    const positions = cubeFolder.addFolder('Position');
    //gui.add(conf, 'radians')

    //failed attempt :(, not necessary so not trying more rn
    if (conf.radians){
      rotations.add(cube.rotation, 'x', 0, Math.PI*2).listen();
      rotations.add(cube.rotation, 'y', 0, Math.PI*2).listen();
      rotations.add(cube.rotation, 'z', 0, Math.PI*2).listen();
    }else{
      rotations.add(conf, 'x', 0, 360).onChange(function(value) {
        cube.rotation.x = value*Math.PI/180;
      });
      rotations.add(conf, 'y', 0, 360).onChange(function(value) {
        cube.rotation.y = value*Math.PI/180;
      });
      rotations.add(conf, 'z', 0, 360).onChange(function(value) {
        cube.rotation.z = value*Math.PI/180;
      });
    }
    positions.add(cube.position, 'x', -5, 5).listen();
    positions.add(cube.position, 'y', -5, 5).listen();
    positions.add(cube.position, 'z', -5, 5).listen();
    cubeFolder.addColor(conf, 'color').onChange(function(value) {
      value = value.replace('#','0x');
      cube.material.color.setHex(value);
    });
    cubeFolder.open();

    animate();
  }
  render() {
    return <div ref={ref => (this.mount = ref)} />;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
