import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { Heart, User, Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"
import { toast } from 'react-hot-toast';
import { useForm, required, emailValidator, minLength } from "../../../shared/hooks/useForm"
import { register as authServiceRegister, type RegisterResponse } from "../services/auth.service";

interface BackendError {
    response?: {
        data?: {
            message?: string;
        };
    };
}

interface RegisterProps {
    onToggleView: () => void;
}

export const Register: React.FC<RegisterProps> = ({ onToggleView }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { getFieldProps, validateForm } = useForm({
        fullName: { value: '', validators: [required] },
        email: { value: '', validators: [required, emailValidator] },
        password: { value: '', validators: [required, minLength(8)] },
        confirmPassword: {
            value: '',
            validators: [
                required,
                (value, allFields) => {
                    const trimmedConfirmPassword = value.trim();
                    const trimmedPassword = allFields.password.value.trim();
                    if (trimmedConfirmPassword !== trimmedPassword) {
                        console.log("Confirm Password Char Codes:", Array.from(trimmedConfirmPassword).map(char => char.charCodeAt(0)));
                        console.log("Original Password Char Codes:", Array.from(trimmedPassword).map(char => char.charCodeAt(0)));
                        return `Las contraseñas no coinciden. Confirmada: '${trimmedConfirmPassword}', Original: '${trimmedPassword}'`;
                    }
                    return null;
                }
            ]
        },
    });

    const fullNameProps = getFieldProps("fullName");
    const emailProps = getFieldProps("email");
    const passwordProps = getFieldProps("password");
    const confirmPasswordProps = getFieldProps("confirmPassword");

    const registerMutation = useMutation<RegisterResponse, BackendError, Parameters<typeof authServiceRegister>[0]>({
        mutationFn: authServiceRegister,
        onSuccess: () => {
            toast.success("Registro exitoso. Por favor, inicia sesión.");
            onToggleView(); // Redirect to login
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Error al registrar usuario.");
        },
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            registerMutation.mutate({
                nombre: fullNameProps.value,
                correo: emailProps.value,
                password: passwordProps.value,
                rol: "USER" // Assuming a default role for registration
            });
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "-100%" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center px-4 py-12"
        >
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                     <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1, rotate: 360 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
                        className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-2xl mb-4"
                    >
                        <Heart className="w-8 h-8 text-white fill-white" />
                    </motion.div>
                    <h1 className="text-2xl font-bold text-blue-800 mb-2">Comienza tu camino</h1>
                    <p className="text-gray-600">Únete a nuestra comunidad de apoyo</p>
                </div>

                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="bg-white rounded-2xl shadow-xl p-8"
                >
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {registerMutation.isError && (
                            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg flex items-center">
                                <AlertCircle className="w-5 h-5 mr-3" />
                                <span>{registerMutation.error.response?.data?.message || "Error al registrar usuario."}</span>
                            </div>
                        )}
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">Nombre Completo</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    id="fullName"
                                    placeholder="Tu nombre"
                                    {...fullNameProps}
                                    className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 transition-all ${fullNameProps.error ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'}`}
                                />
                            </div>
                            {fullNameProps.error && <p className="text-red-500 text-xs mt-1">{fullNameProps.error}</p>}
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Correo Electrónico</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="tu@email.com"
                                    {...emailProps}
                                    className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 transition-all ${emailProps.error ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'}`}
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
                                    className={`w-full pl-10 pr-12 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 transition-all ${passwordProps.error ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'}`}
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {passwordProps.error && <p className="text-red-500 text-xs mt-1">{passwordProps.error}</p>}
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">Confirmar Contraseña</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    placeholder="••••••••"
                                    {...confirmPasswordProps}
                                    className={`w-full pl-10 pr-12 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 transition-all ${confirmPasswordProps.error ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'}`}
                                />
                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {confirmPasswordProps.error && <p className="text-red-500 text-xs mt-1">{confirmPasswordProps.error}</p>}
                        </div>

                        <button type="submit" disabled={registerMutation.isPending} className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-wait">
                            {registerMutation.isPending ? 'Registrando...' : 'Crear Cuenta'}
                        </button>

                        <p className="text-center text-sm text-gray-600 mt-6">
                            ¿Ya tienes una cuenta?{" "}
                            <button type="button" onClick={onToggleView} className="text-blue-600 hover:text-blue-700 font-semibold bg-transparent border-none">
                                Inicia sesión
                            </button>
                        </p>
                    </form>
                </motion.div>
            </div>
        </motion.div>
    );
};