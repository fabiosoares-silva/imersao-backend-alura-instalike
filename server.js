import express from 'express'; // Importa o framework Express para criar o servidor web
import routes from './src/routes/postsRoutes.js';

const app = express();

app.use(express.static('uploads'));

routes(app);

// Inicia o servidor na porta 3000
app.listen(3000, () => {
    console.log('Servidor escutando na porta 3000...');
});
