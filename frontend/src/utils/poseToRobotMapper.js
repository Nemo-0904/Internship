// src/utils/poseToRobotMapper.js

export function mapPoseToRobot(poseLandmarks, robotModel) {
    if (!poseLandmarks || !robotModel?.joints) return;

    const joints = robotModel.joints;

    const getAngle = (p1, p2) => {
        return (p1.y - p2.y) * 2; // vertical delta × scaling
    };

    const safeSet = (jointName, angle) => {
        const joint = joints[jointName];
        if (joint && typeof joint.setAngle === 'function') {
            joint.setAngle(angle);
        }
    };

    // Basic limb joint mapping
    safeSet('LARM_JOINT0', getAngle(poseLandmarks[11], poseLandmarks[13])); // Left Shoulder → Elbow
    safeSet('RARM_JOINT0', getAngle(poseLandmarks[12], poseLandmarks[14])); // Right Shoulder → Elbow
    safeSet('LLEG_JOINT0', getAngle(poseLandmarks[23], poseLandmarks[25])); // Left Hip → Knee
    safeSet('RLEG_JOINT0', getAngle(poseLandmarks[24], poseLandmarks[26])); // Right Hip → Knee
    safeSet('CHEST_JOINT0', (poseLandmarks[11].x - poseLandmarks[12].x) * 2); // Chest twist (shoulder delta X)
}
