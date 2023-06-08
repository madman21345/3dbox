import React, { Component } from "react";
import ReactDOM from "react-dom";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

class App extends Component {
  
  componentDidMount() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      300
    );

    const camera2 = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      100
    );
    camera.position.set(0,10,20);
    camera2.position.set(0,0,5);

    const cameraHelper = new THREE.CameraHelper(camera2);
    scene.add(cameraHelper);


    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    this.mount.appendChild(renderer.domElement);

    //nice to be able to look around, adding camera control
    const controls = new OrbitControls( camera, renderer.domElement );
    controls.update();

    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial({ color: 0x88ddff });
    var cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    cube.position.set(1.5,0.5,1.5);

    
    //making it easier to look at by adding edge outline
    let geo = new THREE.EdgesGeometry(cube.geometry);
    let mat = new THREE.LineBasicMaterial({ color: "black", linewidth: 10 });
    let wireframe = new THREE.LineSegments(geo, mat);
    wireframe.renderOrder = 1; // make sure wireframes are rendered 2nd
    cube.add(wireframe);

    //axes
    const axesHelper = new THREE.AxesHelper(2)
    scene.add(axesHelper)

    
    const conf = {color: '#88ddff', radians: true, x: 0, y: 0, z: 0, altcam: false};
    //adding object controls
    const gui = new GUI();
    const cubeFolder = gui.addFolder('Cube');
    const rotations = cubeFolder.addFolder('Rotation');
    const positions = cubeFolder.addFolder('Position');

    const altcamera = gui.addFolder('Camera Controls');
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

    //idk doesnt work
    altcamera.add(camera2, 'fov', 30, 145);
    altcamera.add(conf, 'altcam');

    const cPos = altcamera.addFolder('Position');
    cPos.add(camera2.position, 'x', -5, 5);
    cPos.add(camera2.position, 'y', -5, 5);
    cPos.add(camera2.position, 'z', -5, 5);


    
    const animate = () => {
      
      camera.lookAt(0,2,0);
      camera2.lookAt(cube.position);

      //cube.rotation.x += 0.01;
      //cube.rotation.y += 0.01;
      if(conf.altcam) {
      
        cameraHelper.update();
        cameraHelper.visible = false;
        camera2.updateProjectionMatrix();
        //scene.background.set(0x000000);
        renderer.render(scene, camera2);
      } else{
      
        cameraHelper.update();
        cameraHelper.visible = true;
        //scene.background.set(0x000040);
        renderer.render(scene, camera);
      }

      requestAnimationFrame(animate);

    };



    requestAnimationFrame(animate);
  }
  render() {
    return <div ref={ref => (this.mount = ref)} />;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
