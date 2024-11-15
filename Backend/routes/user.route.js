

import { Router } from 'express';
import {
    ActualizarInformacionUser,
    createUser,
    loginUser,
    ObtenerInformacionUserporId,
    obtenerSalonesDisponibles
} from '../controllers/user.controllers.js';


const router = Router();


// Rutas
router.post('/', createUser);
router.get('/', loginUser);

router.get('/infoUser/:id_usuario', ObtenerInformacionUserporId);
router.put('/updateUser/:id_usuario', ActualizarInformacionUser);


router.get('/salones', obtenerSalonesDisponibles);


export default router;