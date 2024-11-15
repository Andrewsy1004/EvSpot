

import { useState } from 'react';
import { toast } from "react-hot-toast";
import { Typewriter } from 'react-simple-typewriter';
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

export const SectionContacto = () => {
    const [correo, setCorreo] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!correo) {
            toast.error('El correo es requerido');
            return;
        }

        if (!correo.includes('@')) {
            toast.error('El correo no es válido');
            return;
        }

        toast.success('Nos contactaremos contigo pronto!!');
        setCorreo('');
    }

    return (
        <section id="contact" className="py-20 md:py-32">
            <div className="container mx-auto px-4 md:px-6">
                <h2 className="text-3xl md:text-4xl font-bold mb-8 text-black">
                    Contáctanos de manera:
                    <span className='text-indigo-500'>
                        <Typewriter
                            words={[' fácil', ' sencilla', ' rápida', ' amigable']}
                            loop={true}
                            cursor
                            cursorStyle="_"
                            typeSpeed={70}
                            deleteSpeed={50}
                            delaySpeed={1000}
                        />
                    </span>
                </h2>

                <div className="grid md:grid-cols-2 gap-8">
                    <div>
                        <p className="text-gray-600 mb-4">
                            Si tienes alguna pregunta o deseas agendar una cita, no dudes en comunicarte con nosotros.
                        </p>
                        <ul className="space-y-4">
                            <li className="flex items-center space-x-2 text-black">
                                <FaPhone className="text-primary h-6 w-6 text-indigo-500" />
                                <span>+57 (300) 305-5555</span>
                            </li>
                            <li className="flex items-center space-x-2 text-black">
                                <FaEnvelope className="text-primary h-6 w-6 text-indigo-500" />
                                <span>info@dentalclinic.com</span>
                            </li>
                            <li className="flex items-center space-x-2 text-black">
                                <FaMapMarkerAlt className="text-primary h-6 w-6 text-indigo-500" />
                                <span>123 BQ, Villa Campestre, Barranquilla </span>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <div className="bg-white rounded-lg shadow-2xl p-5">
                            <div className="mb-4">
                                <h3 className="text-xl font-bold text-black">¿Deseas agendar una cita, contáctanos?</h3>
                            </div>
                            <form>
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="email" className="block text-black">Correo: </label>
                                        <input
                                            id="email"
                                            type="email"
                                            placeholder="example@email.com"
                                            value={correo}
                                            onChange={(e) => setCorreo(e.target.value)}
                                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm 
                                                focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-black"
                                        />
                                    </div>

                                    <div>
                                        <button
                                            type="submit"
                                            onClick={handleSubmit}
                                            className="w-full px-4 py-2 bg-indigo-700 text-white rounded-md hover:bg-indigo-800 transition-colors"
                                        >
                                            Enviar
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
