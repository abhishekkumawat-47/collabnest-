import express from 'express';
import userRoutes from './routes/userRoutes';

const app = express();

app.use(express.json());
app.use('/api/users', userRoutes); // base path

app.listen(3001, () => console.log('Server running on port 3001'));
