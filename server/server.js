import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import attendanceRouter from './routes/attendance.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', attendanceRouter);

app.get('/', (req, res) => {
  res.sendFile(path.join(ROOT_DIR, 'attendance.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(ROOT_DIR, 'dashboard.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on http://127.0.0.1:${PORT}`);
  console.log(`Dashboard: http://127.0.0.1:${PORT}/dashboard`);
  console.log(`Attendance: http://127.0.0.1:${PORT}/`);
});
