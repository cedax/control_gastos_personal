import express from 'express';
import financeRoutes from './routes/financeRoutes';
import { connectDB } from './database/database';

const cors = require('cors');
const app = express();

app.use(cors({
    origin: ['http://localhost:3001', 'https://tdcq590c-3001.usw3.devtunnels.ms'], // URL front-end
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Metodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Headers permitidos
    credentials: true // Permite el envio de cookies y credenciales
}));

app.use(express.json());
app.use('/api/finances', financeRoutes);

const startServer = async () => {
    try {
        await connectDB();

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();