import { useState, useEffect } from "react";
import { Login } from "../components/Login";
import { Register } from "../components/Register";

export const AuthUser = () => {
    const [isLoginView, setIsLoginView] = useState(true);

    const toggleView = () => setIsLoginView(!isLoginView);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="relative min-h-screen overflow-hidden pt-16 md:pt-0">
            {isLoginView ? (
                <Login onToggleView={toggleView} />
            ) : (
                <Register onToggleView={toggleView} />
            )}
        </div>
    );
};
