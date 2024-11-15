

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { getSalonesByUsuario } from '../helpers/Eventos';
import useAuthStore from '../../Store/authStore';

import { Button, Loader } from '../Components';


export const SalonesAdmin = () => {
    const [salones, setSalones] = useState([]);
    const [hovered, setHovered] = useState({});
    const [isLoading, setIsLoading] = useState(true); // Estado para el loader
    const Id_Usuario = useAuthStore((state) => state.UserId);

    const fetchSalones = async () => {
        try {
            setIsLoading(true); // Inicia el loader antes de la carga
            const data = await getSalonesByUsuario(Id_Usuario);
            setSalones(data.salones);
        } catch (error) {
            console.error('Error al cargar los salones:', error);
        } finally {
            setIsLoading(false); // Detiene el loader al final
        }
    };

    useEffect(() => {
        if (Id_Usuario) {
            fetchSalones();
        }
    }, [Id_Usuario]);

    const handleMouseEnter = (id) => setHovered((prev) => ({ ...prev, [id]: true }));
    const handleMouseLeave = (id) => setHovered((prev) => ({ ...prev, [id]: false }));

    const truncateText = (text, maxLength) =>
        text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;

    const SalonDescription = ({ descripcion }) => (
        <p className="text-sm text-gray-600">{truncateText(descripcion, 100)}</p>
    );
    

    return (
        <div className="flex flex-wrap justify-center p-5 gap-6">
            {isLoading ? ( // Condicional para mostrar el loader o los datos
                <Loader />
            ) : salones.length > 0 ? (
                salones.map((salon) => (
                    <div
                        key={salon.id}
                        onMouseEnter={() => handleMouseEnter(salon.id)}
                        onMouseLeave={() => handleMouseLeave(salon.id)}
                        className={`bg-white rounded-lg overflow-hidden shadow-md transition-transform transform duration-300 border border-gray-200
                                   ${hovered[salon.id] ? 'scale-105 shadow-xl' : 'scale-100 shadow-md'}`}
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
                            <SalonDescription descripcion={salon.descripcion} />
                            <Link to={`/${salon.id}`} className="inline-block mt-3">
                                <Button>Ver más</Button>
                            </Link>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-center text-gray-600">No se encontraron salones disponibles.</p>
            )}
        </div>
    );
};
