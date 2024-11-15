

import { useState } from 'react';
import { Link } from 'react-router-dom';

import { Button } from '../../Admin';

export const SalonCard = ({ salon }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    const truncateText = (text, maxLength) => text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`bg-white rounded-lg overflow-hidden shadow-md transition-transform transform duration-300 border border-gray-200 
                        ${isHovered ? 'scale-105 shadow-xl' : 'scale-100 shadow-md'}`}
            style={{ width: '300px' }}
        >
            <img
                src={salon.url_imagen}
                alt={salon.nombre_salon}
                className="w-full h-48 object-cover"
            />
            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">{salon.nombre_salon}</h3>
                <h5 className="text-sm text-gray-500 mb-2">Propietario: {salon.nombre_usuario || 'Usuario'}</h5>
                <p className="text-sm text-gray-600">
                    {truncateText(salon.descripcion, 100)}
                </p>
                <Link to={`/${salon.salon_id}`} className="inline-block mt-3">
                    <Button>Ver más</Button>
                </Link>
            </div>
        </div>
    );
};