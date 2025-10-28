import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cvRoutes from './routes/cv.js';

dotenv.config();
const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

const MONGO = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/curriculo_solidario';
mongoose.connect(MONGO).then(()=> console.log('✅ MongoDB conectado')).catch(e=> console.error('❌ MongoDB', e));

app.use('/api/cv', cvRoutes);
app.get('/health', (req,res)=> res.json({ok:true}));

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log('🚀 Servidor na porta', PORT));
