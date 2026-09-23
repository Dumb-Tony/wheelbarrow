// Physics uses +X forward and +Z right. Positive roll lowers the right rim.
export function applyTrayPose(tray,pitch,roll){tray.rotation.order='XZY';tray.rotation.x=roll;tray.rotation.z=-pitch;}
