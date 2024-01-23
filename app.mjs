import qrcode from 'qrcode'
import whtsp from 'whatsapp-web.js';
const { Client, MessageMedia, LocalAuth, Message, ClientInfo, Buttons } = whtsp;
import { EditPhotoHandler } from './feature/edit_foto.mjs';
import { ChatAIHandler } from './feature/chat_ai.mjs'
import fs from 'fs';
import mime from 'mime-types';
import { kataBersambung, readingFile } from './feature/sambung_kata.mjs';

import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const port = process.env.PORT || 3000;

import express, { json } from 'express';
const app = express();
import http from 'http';
const server = http.createServer(app);
import { Server } from "socket.io";
const io = new Server(server);

//databases
export let room = {
}
export let queue = [];

const resp = await readingFile('feature/src/kamus_bahasa.json')
export const dictionaryBank = resp.data

let time = null;
export let timer = (resolve) => {
    time = setTimeout(() => {
        resolve()
    }, 30000);
}
export const deleteTImer = () => {
    clearTimeout(time)
}

export let evaluate = { userIdx: 0 }

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.get('/', (req, res) => {
    res.sendFile('index.html', {
        root: __dirname
    });
});


const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox']
    }
});


io.on('connection', function (socket) {
    console.log('socket connected');
    socket.emit('message', 'Connecting...');
    client.on('qr', qr => {
        qrcode.toDataURL(qr, (err, url) => {
            socket.emit('qr', url);
            socket.emit('message', 'QR Code received, scan please!');
        });
    });

    client.on('ready', () => {
        socket.emit('ready', 'Whatsapp is ready!');
        socket.emit('message', 'Whatsapp is ready!');
    });

    client.on('authenticated', () => {
        socket.emit('authenticated', 'Whatsapp is authenticated!');
        socket.emit('message', 'Whatsapp is authenticated!');
    });

    client.on('auth_failure', function (session) {
        socket.emit('message', 'Auth failure, restarting...');
    });

    client.on('disconnected', (reason) => {
        socket.emit('message', 'Whatsapp is disconnected!');
        client.destroy();
        client.initialize();
    });
});


client.on('message', async message => {
    const { body } = message;
    const chat = await message.getChat()
    if (chat.isGroup) {
        console.log('pesan masuk');
        // (await message.getChat()).sendMessage(JSON.stringify({sender,idGroup,groupName,user}))
        kataBersambung(body.toLowerCase(), message, client)




    }

});

client.initialize();


server.listen(port, function () {
    console.log('App running on *: ' + port);
});