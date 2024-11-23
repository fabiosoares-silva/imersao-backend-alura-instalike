import 'dotenv/config';
import {ObjectId} from 'mongodb';
import conectarAoBanco from '../config/dbConfig.js';

// Conecta ao banco de dados usando a string de conexão fornecida pela variável de ambiente
const conexao = await conectarAoBanco(process.env.STRING_CONEXAO);

// Função assíncrona para obter todos os posts do banco de dados
export async function getTodosPosts() {
    // Conecta ao banco de dados e à coleção 'posts'
    const db = conexao.db('imersao-backend-instalike');
    const colecao = db.collection('posts');
    // Executa uma consulta para encontrar todos os posts
    return colecao.find().toArray();
}

export async function criarPost(novoPost) {
    // Conecta ao banco de dados e à coleção 'posts'
    const db = conexao.db('imersao-backend-instalike');
    const colecao = db.collection('posts');

    return colecao.insertOne(novoPost);
}

export async function atualizarPost(id, novoPost) {
    // Conecta ao banco de dados e à coleção 'posts'
    const db = conexao.db('imersao-backend-instalike');
    const colecao = db.collection('posts');
    const objID = ObjectId.createFromHexString(id);

    return colecao.updateOne({_id: new ObjectId(objID)}, {$set: novoPost});
}
