import React from "react";
import { useGLTF } from "@react-three/drei";

const FemaleDoctorModel = (props) => {
    const { scene } = useGLTF("/avatars/female-avatar1.glb"); // Load from public folder
    return <primitive object={scene} {...props} />;
};

export default FemaleDoctorModel;
