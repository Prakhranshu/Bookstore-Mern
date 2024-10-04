import express from 'express';
import {PORT, mongodbURL} from './config.js';
import mongoose from 'mongoose';
import { Book } from './Models/BookModel.js';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    console.log(req)
    return res.status(234).send("Welcome to MERN Stack!");
});

app.post('/newbook', async(req, res) => {
    try{
        if(
            !req.body.title ||
            !req.body.author ||
            !req.body.publishYear
        ){
            return res.status(400).send({
                message: 'Please send all the required fields: title, author, publishyear',
            });
        }

        const newBook={
            title: req.body.title,
            author: req.body.author,
            publishYear: req.body.publishYear
        }

        const book = await Book.create(newBook);

        return res.status(201).send(book);
    }
    catch(err){
        console.log(err.message);
        res.status(500).send({message: err.message});
    }
});

app.get('/allbooks', async(req, res) => {
    try {
        const books = await Book.find({});
        return res.status(200).send({
            count: books.length,
            data: books
    });
    }
    catch(err){
        console.log(err.message);
        res.status(500).send({message: err.message});
    }
});

app.get('/bookbyid/:id', async(req, res) => {
    try {
        const {id}= req.params;
        const book = await Book.findById(id);
        return res.status(200).send(book);
    }
    catch(err){
        console.log(err.message);
        res.status(500).send({message: err.message});
    }
});

mongoose
    .connect(mongodbURL)
    .then((connection) => {
        console.log('App is connected to mongodb database');
        app.listen(PORT, () => {
            console.log(`App is listening on port: ${PORT}`);
        });
    })
    .catch((error) => {
        console.error(error);
    });