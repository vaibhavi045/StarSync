import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useContext } from "react";
import { LanguageContext } from "../../context/LanguageContext";
import DoctorModel from "../../assets/avatars/DoctorModel";
import FemaleDoctorModel from "../../assets/avatars/FemaleDoctorModel";

const AvatarDisplay = () => {
    const { language } = useContext(LanguageContext);

    // Define avatar models per language
    const avatars = {
        en: DoctorModel, // English -> Male doctor
        hi: FemaleDoctorModel, // Hindi -> Female doctor
        mr: DoctorModel, // Marathi -> Male doctor
    };

    const SelectedAvatar = avatars[language] || DoctorModel;

    return (
        <div className="flex justify-center items-center w-full h-64 bg-gray-200 rounded-lg shadow-md">
            <Canvas>
                <Suspense fallback={<p>Loading Avatar...</p>}>
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[5, 5, 5]} />
                    <SelectedAvatar scale={1.5} position={[0, -1.5, 0]} />
                    <OrbitControls enableZoom={false} />
                </Suspense>
            </Canvas>
        </div>
    );
};

export default AvatarDisplay;
