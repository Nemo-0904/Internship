// // src/hooks/useVideoRecording.js
// import { useState, useCallback, useRef, useEffect } from 'react';

// /**
//  * Custom hook for managing video recording and playback logic.
//  * It interacts with the VideoRecorder component via its imperative handle.
//  *
//  * @param {React.RefObject} videoRecorderInstanceRef - Ref to the VideoRecorder component instance.
//  * @param {React.RefObject} recordedVideoPlayerRef - Ref to the <video> element used for recorded video playback.
//  */
// const useVideoRecording = (videoRecorderInstanceRef, recordedVideoPlayerRef) => {
//     const [isRecordingStatus, setIsRecordingStatus] = useState(false);
//     const [isPlayingRecordedVideo, setIsPlayingRecordedVideo] = useState(false);
//     const recordedJointDataRef = useRef([]); // Internal ref to store joint data

//     // Callback when VideoRecorder has a video Blob ready (after recording stops)
//     const handleVideoAvailable = useCallback((blob) => {
//         if (recordedVideoPlayerRef.current) {
//             const videoURL = URL.createObjectURL(blob);
//             recordedVideoPlayerRef.current.src = videoURL;
//             console.log("Recorded video blob received and set for playback.");
//         }
//     }, [recordedVideoPlayerRef]);

//     // Function to start recording via VideoRecorder
//     const startRecording = useCallback(() => {
//         if (videoRecorderInstanceRef.current?.startRecording) {
//             recordedJointDataRef.current = []; // Clear joint data on new recording
//             videoRecorderInstanceRef.current.startRecording();
//             setIsRecordingStatus(true);
//             // The VideoRecorder will call onRecordingStatusChange with "Recording..."
//         }
//     }, [videoRecorderInstanceRef]);

//     // Function to stop recording via VideoRecorder
//     const stopRecording = useCallback(() => {
//         if (videoRecorderInstanceRef.current?.stopRecording) {
//             videoRecorderInstanceRef.current.stopRecording();
//             setIsRecordingStatus(false);
//             // The VideoRecorder will call onRecordingStatusChange with "Ready to save or play."
//         }
//     }, [videoRecorderInstanceRef]);

//     // Function to save recording via VideoRecorder
//     const saveRecording = useCallback(() => {
//         if (videoRecorderInstanceRef.current?.saveRecording) {
//             videoRecorderInstanceRef.current.saveRecording();
//             // VideoRecorder handles the actual download
//         }
//     }, [videoRecorderInstanceRef]);

//     // Function to initiate playback of recorded video via VideoRecorder
//     // The actual robot motion playback is handled externally (in RobotLabPage)
//     const playRecordedVideo = useCallback(() => {
//         if (videoRecorderInstanceRef.current?.playRecordedData) {
//             videoRecorderInstanceRef.current.playRecordedData();
//             setIsPlayingRecordedVideo(true);
//         }
//     }, [videoRecorderInstanceRef]);

//     // This function is called by RobotLabPage from its handlePoseData
//     // and then passed to VideoRecorder's imperative handle.
//     const captureJointFrame = useCallback((jointData) => {
//         // Only push data if recording is active. VideoRecorder's handle will also check this.
//         if (isRecordingStatus) {
//             recordedJointDataRef.current.push({ ...jointData, timestamp: performance.now() });
//         }
//     }, [isRecordingStatus]);

//     // Listen for the recorded video player to end, to reset playback state
//     useEffect(() => {
//         const player = recordedVideoPlayerRef.current;
//         const handleEnded = () => {
//             setIsPlayingRecordedVideo(false);
//         };

//         if (player) {
//             player.addEventListener('ended', handleEnded);
//         }

//         return () => {
//             if (player) {
//                 player.removeEventListener('ended', handleEnded);
//             }
//         };
//     }, [recordedVideoPlayerRef]);

//     return {
//         isRecordingStatus,
//         isPlayingRecordedVideo,
//         setIsPlayingRecordedVideo, // Expose setter for external control (e.g., from VideoRecorder's onstop)
//         startRecording,
//         stopRecording,
//         saveRecording,
//         playRecordedVideo, // Use this for video playback
//         captureJointFrame, // Expose for MediaPipeController's data to be captured
//         getRecordedJointData: () => [...recordedJointDataRef.current], // Expose for robot motion playback
//         handleVideoAvailable, // Expose for VideoRecorder's onVideoAvailable prop
//     };
// };

// export default useVideoRecording;

// src/hooks/useVideoRecording.js
import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Custom hook for managing video recording and playback logic.
 * It interacts with the VideoRecorder component via its imperative handle.
 *
 * @param {React.RefObject} videoRecorderInstanceRef - Ref to the VideoRecorder component instance.
 * @param {React.RefObject} recordedVideoPlayerRef - Ref to the <video> element used for recorded video playback.
 */
const useVideoRecording = (videoRecorderInstanceRef, recordedVideoPlayerRef) => {
    const [isRecordingStatus, setIsRecordingStatus] = useState(false);
    const [isPlayingRecordedVideo, setIsPlayingRecordedVideo] = useState(false);
    const recordedJointDataRef = useRef([]); // Internal ref to store joint data

    // **NEW FUNCTION FOR STATUS UPDATE**
    // This function will be passed to VideoRecorder as onRecordingStatusChange
    const handleRecordingStatusUpdate = useCallback((status) => {
        // This logic handles the conversion from string status to boolean
        setIsRecordingStatus(status === "recording");
    }, []);

    // Callback when VideoRecorder has a video Blob ready (after recording stops)
    const handleVideoAvailable = useCallback((blob) => {
        if (recordedVideoPlayerRef.current) {
            const videoURL = URL.createObjectURL(blob);
            recordedVideoPlayerRef.current.src = videoURL;
            console.log("Recorded video blob received and set for playback.");
        }
    }, [recordedVideoPlayerRef]);

    // Function to start recording via VideoRecorder
    const startRecording = useCallback(() => {
        if (videoRecorderInstanceRef.current?.startRecording) {
            recordedJointDataRef.current = []; // Clear joint data on new recording
            videoRecorderInstanceRef.current.startRecording();
            // IMPORTANT: Do NOT call setIsRecordingStatus(true) here anymore.
            // Let the onRecordingStatusChange callback (VideoRecorder's prop) handle it.
        }
    }, [videoRecorderInstanceRef]);

    // Function to stop recording via VideoRecorder
    const stopRecording = useCallback(() => {
        if (videoRecorderInstanceRef.current?.stopRecording) {
            videoRecorderInstanceRef.current.stopRecording();
            // IMPORTANT: Do NOT call setIsRecordingStatus(false) here anymore.
            // Let the onRecordingStatusChange callback (VideoRecorder's prop) handle it.
        }
    }, [videoRecorderInstanceRef]);

    // Function to save recording via VideoRecorder
    const saveRecording = useCallback(() => {
        if (videoRecorderInstanceRef.current?.saveRecording) {
            videoRecorderInstanceRef.current.saveRecording();
        }
    }, [videoRecorderInstanceRef]);

    // Function to initiate playback of recorded video via VideoRecorder
    const playRecordedVideo = useCallback(() => {
        if (videoRecorderInstanceRef.current?.playRecordedData) {
            videoRecorderInstanceRef.current.playRecordedData();
            setIsPlayingRecordedVideo(true);
        }
    }, [videoRecorderInstanceRef]);

    // This function is called by RobotLabPage from its handlePoseData
    const captureJointFrame = useCallback((jointData) => {
        if (isRecordingStatus) { // Only push data if recording is active.
            recordedJointDataRef.current.push({ ...jointData, timestamp: performance.now() });
        }
    }, [isRecordingStatus]);

    // Listen for the recorded video player to end, to reset playback state
    useEffect(() => {
        const player = recordedVideoPlayerRef.current;
        const handleEnded = () => {
            setIsPlayingRecordedVideo(false);
        };

        if (player) {
            player.addEventListener('ended', handleEnded);
        }

        return () => {
            if (player) {
                player.removeEventListener('ended', handleEnded);
            }
        };
    }, [recordedVideoPlayerRef]);

    return {
        isRecordingStatus,
        isPlayingRecordedVideo,
        setIsPlayingRecordedVideo,
        startRecording,
        stopRecording,
        saveRecording,
        playRecordedVideo,
        captureJointFrame,
        getRecordedJointData: () => [...recordedJointDataRef.current],
        handleVideoAvailable,
        // Expose the specific handler for VideoRecorder
        onRecordingStatusChange: handleRecordingStatusUpdate, // <--- EXPOSE THE NEW FUNCTION
    };
};

export default useVideoRecording;