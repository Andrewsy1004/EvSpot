

import { Router } from 'express';
import {
    actualizarSalonPorId,
    crearSalon,
    EliminarSalonPorId,
    getDetallesReservasPorSalon,
    getEstadisticasPorUsuario,
    ObtenerSalonPorId,
    obtenerTodosSalones
}
    from '../controllers/Salon.controllers.js';


const router = Router();

// Rutas

router.get('/:salonId', ObtenerSalonPorId)
router.get('/', obtenerTodosSalones)



router.delete('/marcarD/:salonId', EliminarSalonPorId);
router.put('/:salonId', actualizarSalonPorId)

router.post('/CSalon', crearSalon);

router.get('/estadisticas/:id_usuario', getEstadisticasPorUsuario);
router.get('/estadisticasSalon/:id_usuario', getDetallesReservasPorSalon);



export default router;