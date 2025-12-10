import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function NotiBar({ message }: { message: string }) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (message) {
            setShow(true);

            const timer = setTimeout(() => setShow(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    if (!message) return null;

    return createPortal(
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-black px-4 py-2 rounded-md shadow-md z-[99999] !text-white">
            {message}
        </div>
        ,

        document.body
    );
}
