// src/hooks/useRobotModelLoader.js
import { useState, useCallback, useRef } from 'react';

const useRobotModelLoader = () => {
    // State variables related to URDF and mesh file loading
    const [urdfFile, setUrdfFile] = useState(null);
    const [urdfContent, setUrdfContent] = useState('');
    const [meshFiles, setMeshFiles] = useState(new Map());
    const [meshFileNamesList, setMeshFileNamesList] = useState([]);
    const [shouldLoadModel, setShouldLoadModel] = useState(false);
    const [modelLoadStatus, setModelLoadStatus] = useState('Waiting for URDF to be ready for parsing.');
    const [robotModel, setRobotModel] = useState(null);
    const robotModelRef = useRef(null); // Ref to hold the actual Three.js robot model instance

    // Callback for when a URDF file is loaded by URDFUploader
    const handleUrdfFileLoaded = useCallback((file, content) => {
        setUrdfFile(file);
        setUrdfContent(content);
        setShouldLoadModel(false); // Reset load trigger
        setRobotModel(null); // Clear previous robot model
        robotModelRef.current = null;
        setModelLoadStatus(`URDF file selected: ${file.name}. Upload mesh files and click 'Load Model'.`);
    }, []);

    // Callback for when mesh files are loaded by URDFUploader
    const handleMeshFilesLoaded = useCallback((fileMap, namesList) => {
        setMeshFiles(fileMap);
        setMeshFileNamesList(namesList);
        setShouldLoadModel(false); // Reset load trigger
        setRobotModel(null); // Clear previous robot model
        robotModelRef.current = null;
        setModelLoadStatus(`Selected ${namesList.length} mesh files. Click 'Load Model' to continue.`);
    }, []);

    // Callback to trigger the actual loading of the model in UrdfRobotModel
    const handleLoadModel = useCallback(() => {
        if (urdfFile && urdfContent && meshFiles.size > 0) {
            setModelLoadStatus('Uploader Status: Loading model...');
            setShouldLoadModel(true); // Trigger UrdfRobotModel to start loading
        } else {
            setModelLoadStatus('Please upload both URDF and mesh files first.');
            setShouldLoadModel(false);
        }
    }, [urdfFile, urdfContent, meshFiles]);

    // Callback to clear all loaded files and reset state
    const handleClearAll = useCallback(() => {
        setUrdfFile(null);
        setUrdfContent('');
        setMeshFiles(new Map());
        setMeshFileNamesList([]);
        setShouldLoadModel(false);
        setModelLoadStatus('All files cleared. Upload new URDF and mesh files.');
        setRobotModel(null); // Clear the robot model
        robotModelRef.current = null;
    }, []);

    // Callback for when UrdfRobotModel successfully loads the robot instance
    const handleRobotLoaded = useCallback((robotInstance) => {
        setRobotModel(robotInstance); // Set the robot instance to state
        robotModelRef.current = robotInstance; // Also update the ref for direct access
        if (robotInstance) {
            console.log("Available URDF Joints →", Object.keys(robotInstance.joints));
            setModelLoadStatus('Robot model loaded and visible.');
        } else {
            setModelLoadStatus('Failed to load robot model. Check console for errors.');
        }
        setShouldLoadModel(false); // Reset load trigger after loading attempt
    }, []);

    // Return all state and functions needed by components that interact with robot model loading
    return {
        urdfFile,
        urdfContent,
        meshFiles,
        meshFileNamesList,
        shouldLoadModel,
        modelLoadStatus,
        robotModel,
        robotModelRef, // Expose the ref for direct manipulation (e.g., setting joint values)
        handleUrdfFileLoaded,
        handleMeshFilesLoaded,
        handleLoadModel,
        handleClearAll,
        handleRobotLoaded,
        setModelLoadStatus // Expose setter for external status updates (e.g., from VideoRecorder)
    };
};

export default useRobotModelLoader;