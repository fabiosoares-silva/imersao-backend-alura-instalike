import {getTodosPosts, criarPost, atualizarPost} from '../models/postsModel.js';
import fs from 'fs';
import gerarDescricaoComGemini from '../services/gemini-service.js';

export async function listarPosts(req, res) {
    // O resultado é armazenado na constante posts.
    const posts = await getTodosPosts();

    // Envia uma resposta HTTP com status 200 (sucesso) e os posts no formato JSON.
    res.status(200).json(posts);
}

export async function postarNovoPost(req, res) {
    // Extrai os dados do novo post do corpo da requisição.
    const novoPost = req.body;
    try {
        // Chama a função criarPost() para inserir o novo post no banco de dados.
        const postCriado = await criarPost(novoPost);
        res.status(200).json(postCriado);
    } catch (erro) {
        console.error(erro.message);
        res.status(500).json({'Algo deu errado..Tente mais tarde ou entre em contato com a equipe técnica ☹': 'Erro'});
    }
}

export async function uploadImagem(req, res) {
    // Cria um objeto com as informações básicas do novo post, incluindo a URL da imagem.
    const novoPost = {
        descricao: '',
        imgUrl: req.file.originalname,
        alt: ''
    };

    // Tenta criar o novo post e salvar a imagem.
    try {
        // Chama a função criarPost() para inserir o novo post no banco de dados.
        const postCriado = await criarPost(novoPost);
        // Gera um novo nome para a imagem, utilizando o ID do post criado.
        const imagemAtualizada = `uploads/${postCriado.insertedId}.png`;
        // Renomeia o arquivo da imagem para o novo nome e move-o para a pasta uploads.
        fs.renameSync(req.file.path, imagemAtualizada);
        res.status(200).json(postCriado);
    } catch (erro) {
        console.error(erro.message);
        res.status(500).json({'Algo deu errado...Tente mais tarde ou entre em contato com a equipe técnica ☹': 'Erro'});
    }
}

export async function atualizarNovoPost(req, res) {
    // Extrai os dados do novo post do corpo da requisição.
    const id = req.params.id;
    const urlImagem = `http://localhost:3000/${id}.png`;

    try {
        const imgBuffer = fs.readFileSync(`./uploads/${id}.png`);
        const descricao = await gerarDescricaoComGemini(imgBuffer);
        const post = {
            imgUrl: urlImagem,
            descricao: descricao,
            alt: req.body.alt
        };

        const postCriado = await atualizarPost(id, post);
        res.status(200).json(postCriado);
    } catch (erro) {
        console.error(erro.message);
        res.status(500).json({'Algo deu errado...Tente mais tarde ou entre em contato com a equipe técnica ☹': 'Erro'});
    }
}
