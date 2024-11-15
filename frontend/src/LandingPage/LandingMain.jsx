
import { Caracteristicas, Footer, Navbar, SectionContacto, SobreNosotros } from './components'


export const LandingMain = () => {
  return (
    <div className={`font-sans bg-gray-100 text-gray-900 dark:text-gray-100 min-h-screen`}>
      <Navbar />

      <SobreNosotros />

      <div className="bg-gradient-to-r from-blue-50 to-blue-100 py-7">
        <Caracteristicas />
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-blue-100 ">
        <SectionContacto />
      </div> 

      <Footer />

    </div>
  )
}
