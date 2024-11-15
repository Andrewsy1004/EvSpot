
import { Router } from 'express';
import { agregarComentario, eliminarComentario, ObtenerComentariosPorSalon } from '../controllers/Comentario.controllers.js';


const router = Router();


router.get('/:salonId', ObtenerComentariosPorSalon)
router.post('/', agregarComentario);
router.delete('/:comentarioId', eliminarComentario);




export default router;