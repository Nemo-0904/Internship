// src/components/UrdfRobotModel.jsx
import React, { useRef, useEffect, useState, useCallback, forwardRef, useImperativeHandle } from 'react'; // Added forwardRef, useImperativeHandle
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader';
import '../styles/UrdfRobotModel.css';

// Helper function to convert Roll, Pitch, Yaw to Euler angles
const rpyToEuler = (r, p, y) => {
    return new THREE.Euler(r, p, y, 'XYZ'); // Roll (X), Pitch (Y), Yaw (Z)
};

// Helper function to parse XYZ string to THREE.Vector3
const parseXYZ = (xyzString) => {
    if (!xyzString) return new THREE.Vector3(0, 0, 0);
    const parts = xyzString.split(' ').map(parseFloat);
    // Ensure that if a part is NaN (e.g., empty string after split), it defaults to 0
    return new THREE.Vector3(parts[0] || 0, parts[1] || 0, parts[2] || 0);
};

// Helper function to parse RPY string to THREE.Euler
const parseRPY = (rpyString) => {
    if (!rpyString) return new THREE.Euler(0, 0, 0, 'XYZ');
    const parts = rpyString.split(' ').map(parseFloat);
    // Ensure that if a part is NaN, it defaults to 0
    return rpyToEuler(parts[0] || 0, parts[1] || 0, parts[2] || 0);
};

// Wrap the component with forwardRef
const UrdfRobotModel = forwardRef(({ urdfContent, loadedMeshFiles, shouldLoadModel, onModelLoadStatus, onRobotLoaded }, ref) => { // Added 'ref' prop
    const mountRef = useRef(null);
    const sceneRef = useRef(new THREE.Scene());
    const cameraRef = useRef(new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 100));
    const rendererRef = useRef(null);
    const controlsRef = useRef(null);
    const robotRef = useRef(null);

    // === NEW REF FOR CAPTURING CANVAS ===
    const canvasRef = useRef(null); // This will hold the reference to the actual Three.js canvas

    // Expose the canvas element via the ref passed from the parent
    useImperativeHandle(ref, () => ({
        getCanvas: () => canvasRef.current, // Parent can now call robotViewerRef.current.getCanvas()
    }));

    // Initial camera position (can be overwritten by model-specific adjustment)
    cameraRef.current.position.set(0, 1, 1.4);
    cameraRef.current.lookAt(4, 4, 4);

    // Three.js scene setup (runs once on mount)
    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        // Initialize renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(mount.clientWidth, mount.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setClearColor(0x1e1e1e); // Dark background (charcoal gray)
        renderer.shadowMap.enabled = true; // Enable shadows
        renderer.outputEncoding = THREE.sRGBEncoding; // For better color accuracy

        // Clear existing canvas elements to prevent duplicates on re-renders
        while (mount.firstChild) {
            mount.removeChild(mount.firstChild);
        }
        // === THIS IS WHERE WE ASSIGN THE CANVAS REF ===
        canvasRef.current = renderer.domElement; // Assign the canvas to our new ref
        mount.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        const camera = cameraRef.current;
        camera.aspect = mount.clientWidth / mount.clientHeight;
        camera.updateProjectionMatrix();

        // Initialize OrbitControls for camera manipulation
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true; // For smoother camera movement
        controls.dampingFactor = 0.05;
        controls.screenSpacePanning = false; // Prevents camera from panning in screen space
        controls.target.set(0, 0.5, 0); // Set initial orbit target
        controlsRef.current = controls;

        // Add lights to the scene
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); // Soft overall light
        sceneRef.current.add(ambientLight);

        const mainLight = new THREE.DirectionalLight(0xffffff, 1.5); // Main directional light
        mainLight.position.set(7, 10, 2);
        mainLight.castShadow = true;
        // Adjust shadow properties for better quality
        mainLight.shadow.mapSize.width = 1024;
        mainLight.shadow.mapSize.height = 1024;

        mainLight.shadow.camera.near = 0.5;
        mainLight.shadow.camera.far = 50;
        
        mainLight.shadow.camera.left = -10;
        mainLight.shadow.camera.right = 10;
        mainLight.shadow.camera.top = 10;
        mainLight.shadow.camera.bottom = -10;
        sceneRef.current.add(mainLight);

        const fillLight = new THREE.DirectionalLight(0xffffff, 0.4); // Fill light from another angle
        fillLight.position.set(-3, 5, -2);
        sceneRef.current.add(fillLight);

        // Add a ground plane
        const plane = new THREE.Mesh(
            new THREE.PlaneGeometry(50, 50),
            new THREE.MeshStandardMaterial({ color: 0xf5f5f5, side: THREE.DoubleSide })
        );
        plane.rotation.x = -Math.PI / 2; // Rotate to be horizontal
        plane.receiveShadow = true; // Plane can receive shadows
        sceneRef.current.add(plane);

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            controls.update(); // Required for damping to work
            renderer.render(sceneRef.current, camera);
        };
        animate();

        // Handle window resize
        const handleResize = () => {
            const width = mount.clientWidth;
            const height = mount.clientHeight;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        };
        window.addEventListener('resize', handleResize);

        // Cleanup function for initial Three.js setup
        return () => {
            console.log("UrdfRobotModel: Component UNMOUNTING/Cleanup core Three.js elements.");
            window.removeEventListener('resize', handleResize);
            if (mount && renderer.domElement) mount.removeChild(renderer.domElement);
            renderer.dispose();
            controls.dispose();
            ambientLight.dispose();
            mainLight.dispose();
            fillLight.dispose();
            plane.geometry.dispose();
            plane.material.dispose();
            sceneRef.current.remove(ambientLight);
            sceneRef.current.remove(mainLight);
            sceneRef.current.remove(fillLight);
            sceneRef.current.remove(plane);
        };
    }, []); // Empty dependency array ensures this runs only once on mount

    // Custom URDF parsing and model building (runs when shouldLoadModel is true or related props change)
    useEffect(() => {
        if (!shouldLoadModel || !urdfContent) {
            onModelLoadStatus("Waiting for URDF to be ready for parsing.");
            return;
        }

        onModelLoadStatus("Starting custom URDF parsing...");

        // Remove previous robot model if any exists from the scene before loading a new one
        if (robotRef.current) {
            console.log("Removing previous robot model from scene and disposing resources.");
            sceneRef.current.remove(robotRef.current);
            robotRef.current.traverse((object) => {
                if (object.isMesh) {
                    if (object.geometry) object.geometry.dispose();
                    if (object.material) {
                        // Dispose of materials
                        if (Array.isArray(object.material)) {
                            object.material.forEach(material => material.dispose());
                        } else {
                            object.material.dispose();
                        }
                    }
                }
            });
            // Clear out old robotRef content more thoroughly to prevent memory leaks
            robotRef.current = null;
        }

        const parseUrdf = async () => {
            try {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(urdfContent, "text/xml");

                const parseError = xmlDoc.getElementsByTagName("parsererror");
                if (parseError.length > 0) {
                    const errorMsg = parseError[0].textContent;
                    console.error("XML parsing error in URDF:", errorMsg);
                    onModelLoadStatus(`URDF XML Error: ${errorMsg}`);
                    onRobotLoaded(null);
                    return;
                }

                const robotElement = xmlDoc.querySelector('robot');
                if (!robotElement) {
                    console.error("Invalid URDF: 'robot' tag not found.");
                    onModelLoadStatus("Invalid URDF: 'robot' tag missing.");
                    onRobotLoaded(null);
                    return;
                }

                const robotName = robotElement.getAttribute('name') || 'unnamed_robot';
                onModelLoadStatus(`Parsing robot: ${robotName}`);
                console.log(`Parsing robot: ${robotName}`);

                const linksMap = new Map();
                const jointsDataMap = new Map();

                const robotRootGroup = new THREE.Group();
                robotRootGroup.name = robotName;

                // --- 1. Create all links (visuals) ---
                for (const linkElement of xmlDoc.querySelectorAll('link')) {
                    const linkName = linkElement.getAttribute('name');
                    if (!linkName) {
                        console.warn("Link found without 'name' attribute. Skipping.");
                        continue;
                    }

                    const linkGroup = new THREE.Group();
                    linkGroup.name = linkName;
                    linksMap.set(linkName, linkGroup);

                    for (const visualElement of linkElement.querySelectorAll('visual')) {
                        const geometryElement = visualElement.querySelector('geometry');
                        if (!geometryElement) {
                            console.warn(`Link '${linkName}' visual has no geometry. Skipping visual.`);
                            continue;
                        }

                        let visualMesh = null;
                        let geometry = null;
                        let material = new THREE.MeshStandardMaterial({ color: 0x888888, side: THREE.DoubleSide });

                        const materialElement = visualElement.querySelector('material');
                        if (materialElement) {
                            const rgba = materialElement.querySelector('color')?.getAttribute('rgba');
                            if (rgba) {
                                const [r, g, b, a] = rgba.split(' ').map(parseFloat);
                                // Three.js colors are 0-1, so no division needed for R,G,B if they are already 0-1
                                // URDF RGBA values are typically 0-1
                                material = new THREE.MeshStandardMaterial({ color: new THREE.Color(r, g, b), opacity: a, transparent: a < 1, side: THREE.DoubleSide });
                            }
                            // Handle texture if needed
                            // const textureElement = materialElement.querySelector('texture');
                            // if (textureElement) { ... load texture ... }
                        }

                        const meshElement = geometryElement.querySelector('mesh');
                        const boxElement = geometryElement.querySelector('box');
                        const cylinderElement = geometryElement.querySelector('cylinder');
                        const sphereElement = geometryElement.querySelector('sphere');

                        if (meshElement) {
                            const filename = meshElement.getAttribute('filename');
                            if (filename) {
                                // Extract just the filename, normalize case (URDF paths can be inconsistent)
                                const meshFileName = filename.split('/').pop().toLowerCase();
                                const meshData = loadedMeshFiles.get(meshFileName);

                                if (meshData) {
                                    const ext = meshFileName.split('.').pop();

                                    if (ext === 'stl') {
                                        try {
                                            geometry = new STLLoader().parse(meshData);
                                            console.log(`Custom parsed STL mesh: ${meshFileName}`);
                                        } catch (err) {
                                            console.error(`Error parsing STL mesh ${meshFileName}:`, err);
                                        }
                                    } else if (ext === 'dae') {
                                        // DAE mesh data is expected to be a string (XML content)
                                        console.log(`DAE meshData for ${meshFileName}: Type: ${typeof meshData}, Starts with: "${String(meshData).substring(0, 50)}"`);
                                        try {
                                            const colladaLoader = new ColladaLoader();
                                            const collada = colladaLoader.parse(meshData);
                                            visualMesh = collada.scene;
                                            visualMesh.traverse((node) => {
                                                if (node.isMesh) {
                                                    node.castShadow = true;
                                                    node.receiveShadow = true;
                                                    // Only apply default material if the DAE mesh doesn't have a suitable material already
                                                    // ColladaLoader might load MeshLambertMaterial or MeshPhongMaterial
                                                    if (!(node.material instanceof THREE.MeshStandardMaterial || node.material instanceof THREE.MeshPhongMaterial || node.material instanceof THREE.MeshLambertMaterial)) {
                                                        node.material = material; // Apply the URDF defined material or default grey
                                                    }
                                                }
                                            });
                                            console.log(`Custom parsed DAE mesh: ${meshFileName}`);
                                        } catch (err) {
                                            console.error(`Error parsing DAE mesh ${meshFileName}:`, err);
                                        }
                                    } else if (ext === 'obj') {
                                        console.warn(`OBJLoader not directly implemented yet for ${meshFileName}. Manual parsing or a dedicated loader needed.`);
                                        // If you have OBJLoader, it would look similar to STL:
                                        // geometry = new OBJLoader().parse(meshData); // OBJLoader doesn't return Geometry directly, but a Group/Mesh
                                    } else if (ext === 'gltf' || ext === 'glb') {
                                        console.warn(`GLTFLoader not directly implemented yet for ${meshFileName}. Manual parsing or a dedicated loader needed.`);
                                        // If you have GLTFLoader:
                                        // const gltfLoader = new GLTFLoader();
                                        // const gltf = await gltfLoader.parse(meshData); // parse is async
                                        // visualMesh = gltf.scene;
                                    } else {
                                        console.warn(`Custom parser: Unsupported mesh format for '${meshFileName}': ${ext}. Skipping.`);
                                    }
                                } else {
                                    console.warn(`Mesh data for '${meshFileName}' not found in loadedMeshFiles. Skipping.`);
                                }
                            }
                        } else if (boxElement) {
                            const size = boxElement.getAttribute('size').split(' ').map(parseFloat);
                            geometry = new THREE.BoxGeometry(size[0], size[1], size[2]);
                            console.log(`Custom parsed Box geometry: ${size}`);
                        } else if (cylinderElement) {
                            const radius = parseFloat(cylinderElement.getAttribute('radius'));
                            const length = parseFloat(cylinderElement.getAttribute('length'));
                            geometry = new THREE.CylinderGeometry(radius, radius, length, 32); // Increased segments for smoother appearance
                            console.log(`Custom parsed Cylinder geometry: R:${radius}, L:${length}`);
                        } else if (sphereElement) {
                            const radius = parseFloat(sphereElement.getAttribute('radius'));
                            geometry = new THREE.SphereGeometry(radius, 32, 32); // Increased segments for smoother appearance
                            console.log(`Custom parsed Sphere geometry: R:${radius}`);
                        }

                        if (geometry) {
                            visualMesh = new THREE.Mesh(geometry, material);
                            visualMesh.castShadow = true;
                            visualMesh.receiveShadow = true;
                        }

                        if (visualMesh) {
                            const visualOriginElement = visualElement.querySelector('origin');
                            if (visualOriginElement) {
                                const xyz = parseXYZ(visualOriginElement.getAttribute('xyz'));
                                const rpy = parseRPY(visualOriginElement.getAttribute('rpy'));
                                visualMesh.position.copy(xyz);
                                visualMesh.rotation.copy(rpy);
                            }
                            linkGroup.add(visualMesh);
                        }
                    }
                }

                // --- 2. Attach links via joints to build the robot hierarchy ---
                for (const jointElement of xmlDoc.querySelectorAll('joint')) {
                    const jointName = jointElement.getAttribute('name');
                    const jointType = jointElement.getAttribute('type');
                    const parentLinkName = jointElement.querySelector('parent')?.getAttribute('link');
                    const childLinkName = jointElement.querySelector('child')?.getAttribute('link');

                    const parentLink = linksMap.get(parentLinkName);
                    const childLink = linksMap.get(childLinkName);

                    if (parentLink && childLink) {
                        const jointOriginElement = jointElement.querySelector('origin');
                        const jointPosition = jointOriginElement ? parseXYZ(jointOriginElement.getAttribute('xyz')) : new THREE.Vector3(0, 0, 0);
                        const jointRotation = jointOriginElement ? parseRPY(jointOriginElement.getAttribute('rpy')) : new THREE.Euler(0, 0, 0, 'XYZ');

                        const jointObject = new THREE.Object3D();
                        jointObject.position.copy(jointPosition);
                        jointObject.rotation.copy(jointRotation); // Apply initial RPY rotation here
                        jointObject.name = jointName || 'unnamed_joint';

                        // Store initial quaternion and position for joints for proper manipulation later
                        const initialJointQuaternion = jointObject.quaternion.clone(); // Capture the quaternion after initial RPY rotation
                        const initialJointPosition = jointObject.position.clone(); // Capture the position after initial XYZ translation

                        jointObject.add(childLink);
                        parentLink.add(jointObject);
                        console.log(`Attached ${childLinkName} to ${parentLinkName} via ${jointObject.name}`);

                        if (jointType === 'revolute' || jointType === 'prismatic') {
                            const axisElement = jointElement.querySelector('axis');
                            const axis = axisElement ? parseXYZ(axisElement.getAttribute('xyz')) : new THREE.Vector3(1, 0, 0);
                            axis.normalize(); // Normalize the axis vector for consistent scaling/rotation

                            const limitElement = jointElement.querySelector('limit');
                            const lower = limitElement && !isNaN(parseFloat(limitElement.getAttribute('lower'))) ? parseFloat(limitElement.getAttribute('lower')) : -Infinity; // Default to -Infinity if no limit
                            const upper = limitElement && !isNaN(parseFloat(limitElement.getAttribute('upper'))) ? parseFloat(limitElement.getAttribute('upper')) : Infinity; // Default to Infinity if no limit

                            jointsDataMap.set(jointName, {
                                type: jointType,
                                axis: axis,
                                lower: lower,
                                upper: upper,
                                currentAngle: 0, // Or initial value from URDF if available
                                threeObject: jointObject,
                                initialPosition: initialJointPosition, // Stored initial position
                                initialQuaternion: initialJointQuaternion // Stored initial quaternion
                            });
                            console.log(`Registered movable joint: ${jointName} (Type: ${jointType}, Limits: [${lower.toFixed(2)}, ${upper.toFixed(2)}])`);
                        }
                    } else {
                        console.warn(`Skipping joint '${jointElement.getAttribute('name')}': Parent '${parentLinkName}' or child '${childLinkName}' link not found.`);
                    }
                }

                // --- 3. Identify and add the root link to the scene ---
                // Try to find a link that is not a child of any joint
                let rootLinkGroup = null;
                const allChildLinks = new Set();
                for (const jointElement of xmlDoc.querySelectorAll('joint')) {
                    const childLinkName = jointElement.querySelector('child')?.getAttribute('link');
                    if (childLinkName) {
                        allChildLinks.add(childLinkName);
                    }
                }

                for (const [linkName, linkGroup] of linksMap.entries()) {
                    if (!allChildLinks.has(linkName)) {
                        console.log(`Identified root link (no parent joint): ${linkName}`);
                        robotRootGroup.add(linkGroup);
                        rootLinkGroup = linkGroup;
                        break; // Found the root, no need to check further
                    }
                }

                if (!rootLinkGroup) {
                    console.warn("Could not determine a single root link of the robot. Attaching all top-level unattached links directly.");
                    // Fallback: add any link that hasn't found a parent in the hierarchy
                    for (const link of linksMap.values()) {
                        if (!link.parent) { // Check if link hasn't been added as a child of a joint yet
                            robotRootGroup.add(link);
                        }
                    }
                    if (robotRootGroup.children.length === 0) {
                        console.error("No links found in the URDF or unable to form a hierarchy.");
                        onModelLoadStatus("Error: No links found or invalid hierarchy.");
                        onRobotLoaded(null);
                        return;
                    }
                }


                // --- Implement setJointValue method on the robot object for external control ---
                robotRootGroup.setJointValue = (jointName, value) => {
                    const jointData = jointsDataMap.get(jointName);
                    if (!jointData) {
                        // console.warn(`Joint '${jointName}' not found or not a movable type.`); // Too noisy for every frame
                        return;
                    }

                    const clampedValue = Math.max(jointData.lower, Math.min(jointData.upper, value));

                    if (jointData.type === 'revolute') {
                        const rotationQuaternion = new THREE.Quaternion();
                        rotationQuaternion.setFromAxisAngle(jointData.axis, clampedValue); // Rotation around joint's local axis by clampedValue

                        // Apply this rotation relative to the joint's initial orientation
                        jointData.threeObject.quaternion.copy(jointData.initialQuaternion.clone().multiply(rotationQuaternion));

                    } else if (jointData.type === 'prismatic') {
                        // Apply translation for prismatic joints relative to their initial position
                        jointData.threeObject.position.copy(jointData.initialPosition.clone().add(jointData.axis.clone().multiplyScalar(clampedValue)));
                    }
                    jointData.currentAngle = clampedValue;
                };

                // Store simplified joint data on the robot object itself, accessible by name
                robotRootGroup.joints = {};
                jointsDataMap.forEach((data, name) => {
                    robotRootGroup.joints[name] = {
                        type: data.type,
                        lower: data.lower,
                        upper: data.upper,
                        axis: data.axis.clone(), // Clone to prevent accidental modification
                        currentAngle: data.currentAngle,
                        // Do NOT expose 'threeObject' directly here to external components.
                        // The `setJointValue` method handles direct manipulation.
                    };
                });
                console.log("Registered joints for control:", Object.keys(robotRootGroup.joints));

                // --- GLOBAL ROBOT TRANSFORMATION AND CENTERING ---
                // Apply common URDF (Z-up, X-forward) to Three.js (Y-up, Z-forward) global transformations
                robotRootGroup.rotation.x = -Math.PI / 2; // Rotate X to make URDF Z-axis map to Three.js Y-axis
                robotRootGroup.rotation.z = Math.PI+Math.PI; // FOR POPPY
                // robotRootGroup.rotation.z = -Math.PI/2; 


                const box = new THREE.Box3().setFromObject(robotRootGroup);
                const size = box.getSize(new THREE.Vector3());
                const center = box.getCenter(new THREE.Vector3());

                // Calculate the vertical offset to bring the lowest point of the bounding box to Y=0.01 (just above the plane)
                const lowestY = center.y - (size.y / 2);
                const offsetToGround = -lowestY + 0.01;

                // Apply centering and lifting offsets
                robotRootGroup.position.x = -center.x;
                robotRootGroup.position.y += offsetToGround;
                robotRootGroup.position.z = -center.z;

                // Add an AxesHelper to the root of the robot for visual debugging
                const axesHelper = new THREE.AxesHelper(Math.max(size.x, size.y, size.z) * 0.75); // Scale based on robot size
                robotRootGroup.add(axesHelper);

                sceneRef.current.add(robotRootGroup);
                robotRef.current = robotRootGroup;

                // Dynamically adjust camera after model load for optimal view
                const maxDimForCamera = Math.max(size.x, size.y, size.z);
                const cameraDistance = maxDimForCamera * 2; // Zoomed out more, adjust as needed

                const cameraTargetY = (center.y - lowestY) + offsetToGround; // Target the visual center of the robot vertically

                // Position camera along the positive Z-axis to view the robot from the front (after the global rotations)
                cameraRef.current.position.set(0, cameraTargetY, cameraDistance);
                cameraRef.current.lookAt(0, cameraTargetY, 0); // Look at the centered robot

                controlsRef.current.target.set(0, cameraTargetY, 0);
                controlsRef.current.update();

                console.log("Custom parsed robot bounding box size:", size);
                console.log("Robot positioned at:", robotRootGroup.position);
                console.log("Camera positioned at:", cameraRef.current.position);
                console.log("Camera looking at:", controlsRef.current.target);
                console.log("Robot added to scene, robotRef.current:", robotRef.current);

                onModelLoadStatus("Robot model loaded (custom parser).");
                onRobotLoaded(robotRootGroup);

            } catch (e) {
                console.error("Error during custom URDF parsing:", e);
                onModelLoadStatus(`Error during parsing: ${e.message || e}`);
                onRobotLoaded(null);
            }
        };

        parseUrdf();

    }, [shouldLoadModel, urdfContent, loadedMeshFiles, onModelLoadStatus, onRobotLoaded]);

    return (
        // Replaced inline style with custom CSS class
        <div ref={mountRef} className="urdf-robot-model-container" />
    );
});

export default UrdfRobotModel;