import React, { useEffect } from "react";

const Avatar = () => {
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://cdn.readyplayer.me/avatar.js";
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
            window.RPMAvatar?.createFrame({
                containerId: "avatar-container",
                frameUrl: "https://readyplayer.me/avatar",
                width: 300,
                height: 400,
            });
        };
    }, []);

    return <div id="avatar-container"></div>;
};

export default Avatar;
