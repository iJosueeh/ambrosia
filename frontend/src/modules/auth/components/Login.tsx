import React, { useState } from "react";
import { Heart, Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../../shared/hooks/useAuth";
import { useForm, required, emailValidator } from "../../../shared/hooks/useForm";

interface LoginProps {
    onToggleView: () => void;
}

export const Login: React.FC<LoginProps> = ({ onToggleView }) => {
    const [showPassword, setShowPassword] = useState(false);
    const { login, loading, error } = useAuth();

    const { getFieldProps, validateForm } = useForm({
        email: { value: '', validators: [required, emailValidator] },
        password: { value: '', validators: [required] },
    });

    const emailProps = getFieldProps("email");
    const passwordProps = getFieldProps("password");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            await login(emailProps.value, passwordProps.value);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: "-100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4 py-12"
        >
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1, rotate: 360 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
                        className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500 rounded-2xl mb-4"
                    >
                        <Heart className="w-8 h-8 text-white fill-white" />
                    </motion.div>
                    <h1 className="text-2xl font-bold text-teal-800 mb-2">Bienvenido de vuelta</h1>
                    <p className="text-gray-600">Inicia sesión para continuar tu progreso</p>
                </div>

                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="bg-white rounded-2xl shadow-xl p-8"
                >
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg flex items-center">
                                <AlertCircle className="w-5 h-5 mr-3" />
                                <span>{error}</span>
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Correo Electrónico</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="tu@email.com"
                                    {...emailProps}
                                    className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 transition-all ${emailProps.error ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-emerald-500'}`}
                                />
                            </div>
                            {emailProps.error && <p className="text-red-500 text-xs mt-1">{emailProps.error}</p>}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    placeholder="••••••••"
                                    {...passwordProps}
                                    className={`w-full pl-10 pr-12 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 transition-all ${passwordProps.error ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-emerald-500'}`}
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {passwordProps.error && <p className="text-red-500 text-xs mt-1">{passwordProps.error}</p>}
                        </div>

                        <div className="flex items-center justify-between">
                            <a href="#" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">¿Olvidaste tu contraseña?</a>
                        </div>

                        <button type="submit" disabled={loading} className="w-full bg-emerald-500 text-white py-3 rounded-lg font-semibold hover:bg-emerald-600 transition-colors duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-wait">
                            {loading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
                        </button>

                        <p className="text-center text-sm text-gray-600 mt-6">
                            ¿No tienes una cuenta?{" "}
                            <button type="button" onClick={onToggleView} className="text-emerald-600 hover:text-emerald-700 font-semibold bg-transparent border-none">
                                Regístrate aquí
                            </button>
                        </p>
                    </form>
                </motion.div>
            </div>
        </motion.div>
    );
};
