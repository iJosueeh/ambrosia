import React, { useState } from 'react';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube, Send } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { sendContactMessage } from '../services/contact.service';
import type { ContactoDTO } from '../types/contact.types';

export default function ContactPage() {
    const [formData, setFormData] = useState<ContactoDTO>({
        fullName: '',
        email: '',
        subject: '',
        message: ''
    });

    const mutation = useMutation({
        mutationFn: sendContactMessage,
        onSuccess: () => {
            toast.success('Mensaje enviado con éxito!');
            setFormData({
                fullName: '',
                email: '',
                subject: '',
                message: ''
            });
        },
        onError: () => {
            toast.error('Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo.');
        }
    });

    const handleChange = (field: keyof ContactoDTO, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate(formData);
    };

    const contactMethods = [
        {
            icon: Mail,
            title: 'Correo Electrónico',
            value: 'soporte@ambrosia.com',
            link: 'mailto:soporte@ambrosia.com'
        },
        {
            icon: Phone,
            title: 'Teléfono',
            value: '+34 800 123 4567',
            link: 'tel:+34800123456'
        },
        {
            icon: MapPin,
            title: 'Ubicación',
            value: 'Madrid, España',
            link: '#'
        }
    ];

    const subjects = [
        'Selecciona un asunto',
        'Consulta general',
        'Solicitar información',
        'Apoyo y recursos',
        'Reportar un problema',
        'Sugerencias',
        'Otro'
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="grid lg:grid-cols-5 gap-8">
                    {/* Left Side - Info */}
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                                Estamos Aquí para Escucharte
                            </h1>
                            <p className="text-gray-600 leading-relaxed">
                                Si tienes una pregunta o necesitas hablar, estamos aquí para ayudarte.
                                Rellena el formulario y nuestro equipo te responderá lo antes posible.
                            </p>
                        </div>

                        {/* Contact Methods */}
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 mb-4">
                                Otras Formas de Contacto
                            </h2>
                            <p className="text-sm text-gray-600 mb-6">
                                Para consultas directas o para seguir nuestro camino.
                            </p>

                            <div className="space-y-4">
                                {contactMethods.map((method, index) => {
                                    const Icon = method.icon;
                                    return (
                                        <a
                                            key={index}
                                            href={method.link}
                                            className="flex items-center gap-4 p-4 bg-white rounded-xl hover:bg-emerald-50 transition-colors border border-gray-100 group"
                                        >
                                            <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                                                <Icon className="w-6 h-6 text-emerald-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600 mb-0.5">{method.title}</p>
                                                <p className="font-semibold text-gray-900">{method.value}</p>
                                            </div>
                                        </a>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Social Media */}
                        <div>
                            <div className="flex gap-3">
                                <a
                                    href="#"
                                    className="w-12 h-12 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-all"
                                    aria-label="Facebook"
                                >
                                    <Facebook className="w-5 h-5" />
                                </a>
                                <a
                                    href="#"
                                    className="w-12 h-12 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-all"
                                    aria-label="Instagram"
                                >
                                    <Instagram className="w-5 h-5" />
                                </a>
                                <a
                                    href="#"
                                    className="w-12 h-12 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-all"
                                    aria-label="Twitter"
                                >
                                    <Twitter className="w-5 h-5" />
                                </a>
                                <a
                                    href="#"
                                    className="w-12 h-12 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-all"
                                    aria-label="YouTube"
                                >
                                    <Youtube className="w-5 h-5" />
                                </a>
                            </div>
                        </div>

                        {/* Privacy Note */}
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                            <p className="text-sm text-gray-700">
                                Nuestro objetivo es responder en 24 horas. Tu privacidad es nuestra prioridad.
                            </p>
                        </div>
                    </div>

                    {/* Right Side - Form */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
                            <div className="space-y-6">
                                {/* Full Name */}
                                <div>
                                    <label htmlFor="fullName" className="block text-sm font-semibold text-gray-800 mb-2">
                                        Nombre Completo
                                    </label>
                                    <input
                                        type="text"
                                        id="fullName"
                                        value={formData.fullName}
                                        onChange={(e) => handleChange('fullName', e.target.value)}
                                        placeholder="Escribe tu nombre completo"
                                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-2">
                                        Correo Electrónico
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={formData.email}
                                        onChange={(e) => handleChange('email', e.target.value)}
                                        placeholder="Escribe tu correo electrónico"
                                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                    />
                                </div>

                                {/* Subject */}
                                <div>
                                    <label htmlFor="subject" className="block text-sm font-semibold text-gray-800 mb-2">
                                        Asunto
                                    </label>
                                    <select
                                        id="subject"
                                        value={formData.subject}
                                        onChange={(e) => handleChange('subject', e.target.value)}
                                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                                        style={{
                                            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                                            backgroundPosition: 'right 0.5rem center',
                                            backgroundRepeat: 'no-repeat',
                                            backgroundSize: '1.5em 1.5em',
                                            paddingRight: '2.5rem'
                                        }}
                                    >
                                        {subjects.map((subject, index) => (
                                            <option key={index} value={subject} disabled={index === 0}>
                                                {subject}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Message */}
                                <div>
                                    <label htmlFor="message" className="block text-sm font-semibold text-gray-800 mb-2">
                                        Tu Mensaje
                                    </label>
                                    <textarea
                                        id="message"
                                        rows={6}
                                        value={formData.message}
                                        onChange={(e) => handleChange('message', e.target.value)}
                                        placeholder="Por favor, describe tu situación o pregunta..."
                                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
                                    ></textarea>
                                </div>

                                {/* Submit Button */}
                                <button
                                    onClick={handleSubmit}
                                    className="w-full bg-emerald-500 text-white py-4 rounded-xl font-semibold hover:bg-emerald-600 transition-colors duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
                                >
                                    <span>Enviar Mensaje</span>
                                    <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>

                                {/* Privacy Policy */}
                                <p className="text-xs text-center text-gray-600">
                                    Al enviar este mensaje, aceptas nuestra{' '}
                                    <a href="#" className="text-emerald-600 hover:text-emerald-700 font-medium underline">
                                        Política de Privacidad
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Emergency Banner */}
                <div className="mt-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl shadow-xl p-8 text-center text-white">
                    <h2 className="text-2xl md:text-3xl font-bold mb-3">
                        ¿Estás en Crisis?
                    </h2>
                    <p className="text-red-50 mb-6 max-w-2xl mx-auto">
                        Si estás experimentando una emergencia, no uses este formulario.
                        Por favor contacta los servicios de emergencia o nuestra línea de crisis inmediatamente.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="tel:024"
                            className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-red-50 transition-colors inline-flex items-center justify-center gap-2"
                        >
                            <Phone className="w-5 h-5" />
                            <span>Llamar Línea de Crisis: 024</span>
                        </a>
                        <a
                            href="tel:112"
                            className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:bg-opacity-10 transition-colors inline-flex items-center justify-center gap-2"
                        >
                            <Phone className="w-5 h-5" />
                            <span>Emergencias: 112</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}