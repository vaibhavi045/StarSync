import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useLanguage } from "../../context/LanguageContext";
import DoctorModel from "../../assets/avatars/DoctorModel";
import FemaleDoctorModel from "../../assets/avatars/FemaleDoctorModel";
import StaticDoctorImage from "../../assets/images/doctor-placeholder.png";

const AvatarDisplay = () => {
    const { currentLanguage } = useLanguage();

    // Define avatar models per language
    const avatars = {
        en: DoctorModel, // English -> Male doctor in white coat
        hi: FemaleDoctorModel, // Hindi -> Female doctor in traditional dress
        mr: DoctorModel, // Marathi -> Male doctor in white coat
    };

    const SelectedAvatar = avatars[currentLanguage] || DoctorModel;

    return (
        <div className="flex justify-center items-center w-full h-64 bg-gray-200 rounded-lg shadow-md">
            {/* Fallback Static Image for Performance */}
            <div className="hidden sm:block w-full h-full">
                <Canvas>
                    <Suspense fallback={<img src={StaticDoctorImage} alt="Doctor Avatar" className="w-full h-full" />}>
                        <ambientLight intensity={0.5} />
                        <directionalLight position={[5, 5, 5]} />
                        <SelectedAvatar scale={1.5} position={[0, -1.5, 0]} />
                        <OrbitControls enableZoom={false} />
                    </Suspense>
                </Canvas>
            </div>
        </div>
    );
};

export default AvatarDisplay;
