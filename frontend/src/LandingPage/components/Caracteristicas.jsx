
import { FaHandsHelping, FaBuilding, FaStar, FaCheckCircle, FaChartLine, FaGlobe } from 'react-icons/fa';

export const Caracteristicas = () => {
    const featuresList = [
        { text: "Facilita la organización de eventos en Barranquilla.", icon: <FaHandsHelping className="text-blue-500 mr-4 text-2xl" /> },
        { text: "Permite a empresas y particulares mostrar y reservar espacios.", icon: <FaBuilding className="text-green-500 mr-4 text-2xl" /> },
        { text: "Promueve la transparencia a través de calificaciones y reseñas.", icon: <FaStar className="text-yellow-500 mr-4 text-2xl" /> },
        { text: "Ofrece una solución confiable y fácil de usar.", icon: <FaCheckCircle className="text-purple-500 mr-4 text-2xl" /> },
        { text: "Contribuye al crecimiento de la industria de eventos local.", icon: <FaChartLine className="text-pink-500 mr-4 text-2xl" /> },
        { text: "Fomenta la conexión entre la comunidad y empresas locales.", icon: <FaGlobe className="text-red-500 mr-4 text-2xl" /> }
    ];

    return (
        <section id ="atributos" className="bg-gradient-to-r from-blue-50 to-blue-100 py-16">
            <div className="container mx-auto px-6">
                <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Características</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featuresList.map((feature, index) => (
                        <li
                            key={index}
                            className="flex items-center p-6 bg-white rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl"
                        >
                            {feature.icon}
                            <span className="text-lg text-gray-700">{feature.text}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
};
