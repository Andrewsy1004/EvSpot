
import { useState, useEffect } from 'react';

import useAuthStore from '../../Store/authStore';
import { obtenerSalonesDisponibles } from '../helper';
import { Loader } from '../../Admin';
import { SalonCard } from '../Components/SalonCard';

export const Salones = () => {
    const [salones, setSalones] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const Id_Usuario = useAuthStore((state) => state.UserId);

    const fetchSalones = async () => {
        try {
            setIsLoading(true);
            const data = await obtenerSalonesDisponibles();
            setSalones(data.salones);
        } catch (error) {
            console.error('Error al cargar los salones:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (Id_Usuario) {
            fetchSalones();
        }
    }, [Id_Usuario]);

    return (
        <div className="flex flex-wrap justify-center p-5 gap-6">
            {isLoading ? (
                <Loader />
            ) : salones.length > 0 ? (
                salones.map((salon) => (
                    <SalonCard key={salon.salon_id} salon={salon} />
                ))
            ) : (
                <p className="text-center text-gray-600">No se encontraron salones disponibles.</p>
            )}
        </div>
    );
};
