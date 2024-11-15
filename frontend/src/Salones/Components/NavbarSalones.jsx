import { Link, NavLink, useNavigate } from 'react-router-dom';
import useAuthStore from "../../Store/authStore";
import { FaCalendarAlt, FaSignOutAlt, FaUser, FaBars, FaTimes } from 'react-icons/fa';
import { useState } from 'react';

export const NavbarSalones = () => {
    const nombre = useAuthStore((state) => state.Nombre);
    const icono = useAuthStore((state) => state.Icono);
    const logout = useAuthStore.getState().logout;
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const HandleLogout = () => {
        logout();
        navigate('/');
    };

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="bg-gray-800 p-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <Link className="text-white text-lg font-bold flex items-center" to="/">
                    <FaCalendarAlt className="h-6 w-6 mr-2 text-yellow-500" />
                    Salones de Eventos
                </Link>

                {/* Botón Hamburguesa */}
                <button
                    onClick={toggleMenu}
                    className="text-white md:hidden focus:outline-none"
                >
                    {isOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
                </button>

                {/* Navegación para Desktop */}
                <div className="hidden md:flex space-x-4">
                    <NavLink
                        className={({ isActive }) =>
                            `flex items-center text-white hover:text-yellow-500 ${
                                isActive ? 'text-yellow-500' : 'text-white'
                            }`
                        }
                        to="/Reserva"
                    >
                        <FaCalendarAlt className="h-5 w-5 mr-1" />
                        Hacer Reserva
                    </NavLink>

                    <NavLink
                        className={({ isActive }) =>
                            `flex items-center text-white hover:text-yellow-500 ${
                                isActive ? 'text-yellow-500' : 'text-white'
                            }`
                        }
                        to="/misReservas"
                    >
                        <FaCalendarAlt className="h-5 w-5 mr-1" />
                        Mis Reservas
                    </NavLink>
                </div>

                {/* Perfil y Logout para Desktop */}
                <div className="hidden md:flex items-center space-x-4">
                    <NavLink
                        className={({ isActive }) =>
                            `flex items-center hover:text-yellow-500 ${
                                isActive ? 'text-yellow-500' : 'text-white'
                            }`
                        }
                        to="/perfil"
                    >
                        {icono ? (
                            <img
                                src={icono}
                                alt="Perfil"
                                className="h-8 w-8 rounded-full border-2 border-yellow-500 object-cover mr-2"
                            />
                        ) : (
                            <FaUser className="h-6 w-6 mr-1" />
                        )}
                        {nombre}
                    </NavLink>

                    <button
                        className="flex items-center text-white hover:text-red-500"
                        onClick={HandleLogout}
                    >
                        <FaSignOutAlt className="h-5 w-5 mr-1" />
                        Logout
                    </button>
                </div>
            </div>

            {/* Menú Desplegable para Mobile */}
            <div
                className={`md:hidden bg-gray-800 text-white absolute top-16 left-0 w-full transition-all duration-300 z-50 ${
                    isOpen ? 'block' : 'hidden'
                }`}
            >
                <NavLink
                    className={({ isActive }) =>
                        `block px-4 py-2 hover:bg-gray-700 ${
                            isActive ? 'bg-gray-700 text-yellow-500' : 'text-white'
                        }`
                    }
                    to="/Reserva"
                    onClick={() => setIsOpen(false)}
                >
                    Hacer Reserva
                </NavLink>
                <NavLink
                    className={({ isActive }) =>
                        `block px-4 py-2 hover:bg-gray-700 ${
                            isActive ? 'bg-gray-700 text-yellow-500' : 'text-white'
                        }`
                    }
                    to="/misReservas"
                    onClick={() => setIsOpen(false)}
                >
                    Mis Reservas
                </NavLink>
                <NavLink
                    className={({ isActive }) =>
                        `block px-4 py-2 hover:bg-gray-700 ${
                            isActive ? 'bg-gray-700 text-yellow-500' : 'text-white'
                        }`
                    }
                    to="/perfil"
                    onClick={() => setIsOpen(false)}
                >
                    {icono ? (
                        <img
                            src={icono}
                            alt="Perfil"
                            className="h-8 w-8 rounded-full border-2 border-yellow-500 object-cover inline-block mr-2"
                        />
                    ) : (
                        <FaUser className="h-6 w-6 mr-1" />
                    )}
                    {nombre}
                </NavLink>
                <button
                    className="block w-full px-4 py-2 text-left hover:bg-red-700 hover:text-white"
                    onClick={() => {
                        HandleLogout();
                        setIsOpen(false);
                    }}
                >
                    Logout
                </button>
            </div>
        </nav>
    );
};
