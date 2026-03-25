import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { ThreeMFLoader } from 'three/examples/jsm/loaders/3MFLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const STLViewer = ({ stlFiles, rotation }) => {
  const mountRef = useRef();
  const groupRef = useRef(new THREE.Group()); 
  const sceneRef = useRef(new THREE.Scene());
  const rendererRef = useRef();
  const cameraRef = useRef();
  const controlsRef = useRef();

  // 🔹 1. Reactive Rotation (X, Y, Z sliders)
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.rotation.x = THREE.MathUtils.degToRad(rotation.x);
      groupRef.current.rotation.y = THREE.MathUtils.degToRad(rotation.y);
      groupRef.current.rotation.z = THREE.MathUtils.degToRad(rotation.z);
      
      // OPTIONAL: If rotation is reset to 0,0,0, reset the camera too
      if (rotation.x === 0 && rotation.y === 0 && rotation.z === 0 && controlsRef.current) {
          fitCamera();
      }
    }
  }, [rotation]);

  // Helper to center and fit camera (moved outside so it's accessible)
  const fitCamera = () => {
    if (!groupRef.current || !cameraRef.current || !controlsRef.current) return;
    
    const box = new THREE.Box3().setFromObject(groupRef.current);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    
    const fov = cameraRef.current.fov * (Math.PI / 180);
    let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
    cameraZ *= 2.3; // Padding for the object

    cameraRef.current.position.set(center.x, center.y, cameraZ);
    cameraRef.current.lookAt(center);
    controlsRef.current.target.copy(center);
    controlsRef.current.update();
  };

  // 🔹 2. Main Scene Setup
  useEffect(() => {
    if (!stlFiles.length) return;

    const mount = mountRef.current;
    const scene = sceneRef.current;
    scene.background = new THREE.Color(0x020617); // Dark background
    scene.add(groupRef.current);

    const camera = new THREE.PerspectiveCamera(
      40, 
      mount.clientWidth / mount.clientHeight,
      0.1,
      10000
    );
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controlsRef.current = controls;

    // 🔹 3. Lighting Setup
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.0);
    keyLight.position.set(5, 10, 7.5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.6);
    rimLight.position.set(0, -5, -10);
    scene.add(rimLight);

    // 🔹 4. WHITE MATERIAL (Modified from Blue)
    const material = new THREE.MeshStandardMaterial({
      color: 0xf5f5f5,      // Matte White
      metalness: 0.1,       // Keeps it looking like plastic/resin
      roughness: 0.5,       
    });

    const loaders = {
      stl: new STLLoader(),
      '3mf': new ThreeMFLoader(),
      obj: new OBJLoader()
    };

    stlFiles.forEach((file) => {
      const ext = file.url.split('.').pop().toLowerCase();
      const loader = loaders[ext];

      if (loader) {
        loader.load(file.url, (result) => {
          let mesh;
          if (ext === 'stl') {
            mesh = new THREE.Mesh(result, material);
          } else {
            mesh = result;
            mesh.traverse(child => { if(child.isMesh) child.material = material; });
          }
          
          if(mesh.geometry) mesh.geometry.center(); 
          groupRef.current.add(mesh);
          fitCamera();
        });
      }
    });

    const animate = () => {
      requestAnimationFrame(animate);
      if (controlsRef.current) controlsRef.current.update();
      if (rendererRef.current) rendererRef.current.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (rendererRef.current) rendererRef.current.dispose();
      while(groupRef.current.children.length > 0){ 
        groupRef.current.remove(groupRef.current.children[0]); 
      }
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [stlFiles]);

  return <div ref={mountRef} style={{ width: '100%', height: '100%', display: 'block' }} />;
};

export default React.memo(STLViewer);