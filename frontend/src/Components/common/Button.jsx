import React from "react";

const Button = ({
    children,
    onClick,
    type = "button",
    variant = "primary",
    isLoading = false,
    disabled = false,
    icon: Icon,
}) => {
    // Button style variations
    const baseStyles = "px-4 py-2 font-semibold rounded-lg transition-all duration-200";
    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700",
        secondary: "bg-gray-600 text-white hover:bg-gray-700",
        danger: "bg-red-600 text-white hover:bg-red-700",
    };

    return (
        <button
            type={type}
            onClick={onClick}
            className={`${baseStyles} ${variants[variant]} flex items-center justify-center gap-2 ${(isLoading || disabled) && "opacity-50 cursor-not-allowed"
                }`}
            disabled={isLoading || disabled}
            aria-disabled={isLoading || disabled}
        >
            {/* Show loading spinner if isLoading */}
            {isLoading ? (
                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
            ) : (
                Icon && <Icon className="w-5 h-5" />
            )}
            {children}
        </button>
    );
};

export default Button;
