
import Express from 'express';
import cors from 'cors';

// Routes
import userRoutes from './routes/user.route.js';
import salonRoutes from './routes/salon.route.js';
import reservas from './routes/reserva.route.js';
import comentarios from './routes/Comentario.route.js';

import 'dotenv/config';


const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
};

// Server
const app = Express();
const PORT = process.env.PORT || 3010;


// Middlewares
app.use(Express.json());
app.use(Express.urlencoded({ extended: false }));
app.use(cors(corsOptions));

// Routes
app.use('/user', userRoutes);
app.use('/salon', salonRoutes);
app.use('/reserva', reservas);
app.use('/comentario', comentarios);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})