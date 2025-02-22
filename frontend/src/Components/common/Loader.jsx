import React from "react";

const Loader = ({ size = "6", color = "border-blue-500" }) => {
    return (
        <div className="flex items-center justify-center">
            <div
                className={`animate-spin rounded-full border-4 ${color} border-t-transparent h-${size} w-${size}`}
            ></div>
        </div>
    );
};

export default Loader;
