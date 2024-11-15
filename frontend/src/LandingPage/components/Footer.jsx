

import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

export const Footer = () => {
    return (
        <footer className="bg-black text-white py-2 text-center mt-0">
            <div className="container mx-auto px-2">
                <p className="text-lg mb-4">&copy; 2024 - Plataforma de Organización y Reserva de Eventos</p>
                
                <div className="flex justify-center space-x-4 mb-4">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                        <FaFacebook className="text-white hover:text-blue-600 text-2xl" />
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                        <FaTwitter className="text-white hover:text-blue-400 text-2xl" />
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                        <FaInstagram className="text-white hover:text-pink-500 text-2xl" />
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                        <FaLinkedin className="text-white hover:text-blue-700 text-2xl" />
                    </a>
                </div>
                
            </div>
        </footer>
    )
}
