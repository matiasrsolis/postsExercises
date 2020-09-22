const bodyParser = require('body-parser');
const express = require('express');

let posts = [];

const STATUS_USER_ERROR = 422;
let nextId = 1;
const server = express();
server.use(bodyParser.json());

server.post('/posts', (req, res) => {
    const title = req.body.title;
    const contents = req.body.contents;
    if(!title){
        res.status(STATUS_USER_ERROR);
        res.json({error: 'Te falta poner un título'});
        return; //No se pueden establecer encabezados después de que se envían al cliente
    }
    if(!contents){
        res.status(STATUS_USER_ERROR);
        res.json({error: 'Te falta escirbir contenido'});
        return; //No se pueden establecer encabezados después de que se envían al cliente
    }

    // Crear nuevo post
    const nuevoPost = {id: nextId, title: title, contents: contents};
    posts.push(nuevoPost);
    nextId++;

    // Enviar el post al usuario
    res.json(nuevoPost);
})

server.get('/posts', (req, res) => {
    const term = req.query.term;

    if(!term) {
        res.json(posts);
    } else {
        const filtrados = posts.filter((publicacion) => {
            return (publicacion.title.indexOf(term) !== -1 || publicacion.contents.indexOf(term) !== -1); // devolver aquellos Posts que contengan el valor del parámetro term en su título o en su contenido (o en ambos).
        })
        res.json(filtrados);
    }
})

server.put('/posts', (req, res) => {
    const {id, title, contents} = req.body;

    if(!id || !title || !contents) {
        res.status(STATUS_USER_ERROR);
        res.json({error: "No se recibieron los parámetros necesarios para modificar el Post"});
        return;
    }

    // Validar que el ID sea el de un post exitente
    const foundPost = posts.find((elemento) => elemento.id === id);
    if(!foundPost){
        res.status(STATUS_USER_ERROR);
        res.json({error: "No se encontró un post con ese ID"});
        return;
    }

    // Modificar post
    foundPost.title = title;
    foundPost.contents = contents;
    res.json(foundPost);
})

server.delete('/posts', (req, res) => {
    const id = req.body.id;

    if(!id){
        res.status(STATUS_USER_ERROR);
        res.json({error: "No se encontró un post con ese ID"});
        return;
    }

    const post = posts.find((p) => p.id === id);
    if(!post){
        res.status(STATUS_USER_ERROR);
        res.json({error: "No existe un post con ese ID"});
        return;
    }

    posts = posts.filter(p => p.id !== id);
    res.json({ success: true });
})

module.exports = { posts, server };
