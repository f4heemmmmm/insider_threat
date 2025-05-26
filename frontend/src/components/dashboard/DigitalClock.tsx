// frontend/src/components/dashboard/DigitalClock.tsx

import React, { useState, useEffect } from "react";

export function DigitalClock() {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timerID = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => {
            clearInterval(timerID);
        };
    }, []);

    const formattedTime = time.toLocaleTimeString();
    
    return (
        <span className = "font-mono text-blue-600"> {formattedTime} </span>
    );
};