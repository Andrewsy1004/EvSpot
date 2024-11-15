import Icono from "../../../src/assets/Icono.png";

export const SobreNosotros = () => {
    return (
        <section id="introducion" className="bg-gradient-to-r from-blue-50 to-blue-100 py-16">
            <div className="container mx-auto px-6">
                <h1 className="text-4xl font-extrabold text-center mb-8 text-gray-800 tracking-wide">
                    Acerca de Nosotros
                </h1>
                <div className="flex flex-col md:flex-row items-center gap-10">
                    <div className="md:w-1/3 flex justify-center">
                        <div className="border-4 border-blue-200 rounded-lg p-2 shadow-xl">
                            <img
                                src={Icono}
                                alt="Salud Mental"
                                className="rounded-lg shadow-lg w-full md:w-auto"
                            />
                        </div>
                    </div>
                    <div className="md:w-2/3 text-gray-700 text-lg leading-relaxed">
                        <p className="mb-3">
                            Somos un grupo de estudiantes innovadores de la <span className="font-semibold text-blue-600">Universidad Libre Seccional Barranquilla</span>,
                            dedicados a facilitar la organización y planificación de eventos en nuestra comunidad.
                        </p>
                        <p className="mb-3">
                            Identificamos una necesidad en <span className="font-semibold text-blue-600">Barranquilla</span> para mejorar la
                            accesibilidad y la eficiencia en la reserva de salones de eventos. Con esto en mente,
                            desarrollamos una plataforma que permite a empresas y particulares mostrar y reservar
                            espacios de manera fácil y confiable.
                        </p>
                        <p className="mb-3">
                            Nuestra plataforma no solo sirve como un puente entre dueños de salones y clientes,
                            sino que también promueve la transparencia y el apoyo mutuo a través de <span className="italic text-blue-600">calificaciones y reseñas</span>,
                            ayudando así a mantener un alto estándar de calidad y satisfacción para todos los usuarios.
                        </p>
                        <p className="mb-3">
                            Con esta iniciativa, buscamos no solo ofrecer una solución tecnológica, sino también contribuir
                            al crecimiento y desarrollo de nuestro entorno, proporcionando herramientas que empoderan
                            a los usuarios y fomentan la colaboración en la industria de eventos.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};
