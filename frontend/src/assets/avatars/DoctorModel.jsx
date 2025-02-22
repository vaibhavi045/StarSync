import React from "react";
import { useGLTF } from "@react-three/drei";

const DoctorModel = (props) => {
    const { scene } = useGLTF("/avatars/male-doctor.glb"); // Load from public folder
    return <primitive object={scene} {...props} />;
};

export default DoctorModel;
