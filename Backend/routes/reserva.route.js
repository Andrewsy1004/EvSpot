

import { Router } from 'express';
import { actualizarReservaPorId, crearReserva, EliminarReserva, ObtenerReservasPorUsuario } from '../controllers/Reserva.controllers.js';



const router = Router();


// Routes 

router.get('/:id_usuario', ObtenerReservasPorUsuario);
router.delete('/:id_reserva', EliminarReserva);
router.put('/:id_reserva', actualizarReservaPorId);
router.post('/crearReserva', crearReserva);



export default router   