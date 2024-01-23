import fs from 'fs'
import path from 'path';
const { writeFile, readFile } = fs.promises
const folderPath = 'game_databases';
import { help, invitation, question, reviceQuestion } from './src/sentences.mjs';
import { room, queue, timer, deleteTImer, evaluate } from '../app.mjs';
import { generateRandomClue, getClue, isCorrectAnswer } from './get_started.mjs';


const createFiles = async (idGroup, admin, grouName) => {
    console.log('file akan dibuat');
    room.id = idGroup,
        room.admin = admin,
        room.grouName = grouName,
        room.matchOver = false,
        room.isStarted = false,
        room.participants = [{ id: admin, score: 0 }],
        room.turnToPlay = { current: 0, previous: 0 },
        room.activePlayers = [],
        room.questions = [],
        room.answers = []


    try {
        await writeFile(path.join(folderPath, idGroup, 'participants.json'), JSON.stringify(room.participants), { encoding: 'utf8' })
    } catch (error) {
        console.log(error);
    }
}


export const readingFile = async (filePath) => {
    let response = null;
    try {
        const res = await readFile(filePath, 'utf8')
        response = { status: true, data: JSON.parse(res), message: 'succes getting the data' };
    } catch (error) {
        response = { status: false, data: null, message: error };
    }
    return response;
}

export const savingJson = async (filePath, content) => {
    let response = null;
    try {
        await writeFile(filePath, JSON.stringify(content), { encoding: 'utf8' })
        response = { status: true, message: 'berhasil bergabung dalam permainan' };
    } catch (error) {
        response = { status: false, message: 'gagal bergabung dalam permainan' };
    }
    return response;
}
const checkingExistingFolder = (dir) => {
    try {
        if (fs.existsSync(dir)) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        return false;
    }
}

const creatingDirectory = (dir) => {
    fs.mkdirSync(dir);
}


export const processingMessage = async (text, message, client) => {
    const chat = await message.getChat();
    const idGroup = chat.groupMetadata.id.user;
    const groupName = chat.groupMetadata.subject
    const userContact = await message.getContact()
    const idSender = userContact.id.user;
    const senderName = userContact.pushname
    if (text === '/create@game') {

        if (Object.keys(room).length === 0) {
            if (!checkingExistingFolder(path.join(folderPath, idGroup))) {
                creatingDirectory(path.join(folderPath, idGroup))
            }
            await createFiles(idGroup, idSender, groupName)
            chat.sendMessage(invitation(idGroup, groupName, senderName))
        } else {
            if (room.id === idGroup) {
                if (idSender == room.admin) {
                    chat.sendMessage(`Hey ${senderName}, room sudah anda buat ya🫵👊`)
                } else {
                    const adminContact = await client.getContactById(`${room.admin}@c.us`)
                    await chat.sendMessage(`Heyy Game sudah dibuat oleh @${room.admin}, join gih`, {
                        mentions: [adminContact]
                    });
                }
            } else {
                const filter = queue.filter(e => {
                    return e.id === idGroup
                })
                if (filter.length === 0) {
                    queue.push({ id: idGroup, admin: idSender })
                    chat.sendMessage('Berhasil membuat room, tunggu grup sebelah selese ya')
                } else {
                    chat.sendMessage('Sabar ya grup sebelah masih maen, nanti dikabarin lagi kok')
                }
            }
        }

    } else if (text === '/leave@game') {
        if (Object.keys(room).length != 0) {
            if (idSender === room.admin) {
                deleteRoom()
                chat.sendMessage(`${senderName} kabur, permainan dibatalkan.`)
            } else {
                if (!room.isStarted) {
                    const newParticipants = room.participants.filter(e => {
                        return idSender != e.id;
                    })
                    room.participants = newParticipants;
                    chat.sendMessage(`${senderName} keluar dari permainan.`)
                }
            }
        }


    } else if (text === '/join@game') {

        if (idGroup === room.id) {
            if (room.isStarted) {
                const check = room.participants.filter(e => {
                    return e.id === idSender
                })
                if (check.length === 0) {
                    chat.sendMessage(`Hey ${senderName}, anda telat join 👎🏻👎🏻`)
                }
            } else {
                const filter = room.participants.filter(e => {
                    return e.id === idSender
                })
                if (filter.length != 0) {
                    chat.sendMessage(`Hey ${senderName} anda sudah di dalam permainan🫵👊`)
                } else {
                    room.participants.push({ id: idSender, score: 0 })
                    chat.sendMessage(`${senderName} berhasil bergabung dalam permainan`)
                }
            }
        } else {
            const filter = queue.filter(e => {
                return e.id === idGroup;
            })
            if (filter.length != 0) {
                chat.sendMessage(`Sabar hee grup sebelah masih maen, nanti aja join lagi`)
            } else {
                chat.sendMessage(`Heyy bro buat room dulu`)
            }
        }


    } else if (text === '/start@game') {
        if (idGroup === room.id) {
            if (idSender == room.admin) {
                if (!room.isStarted) {
                    if (room.participants.length != 1) {
                        chat.sendMessage(`Game segera dimulai, bersiaplah!`)
                        room.participants.map((e) => {
                            room.activePlayers.push({ id: e.id, chanceRemaining: 3, hasAnswered: false })
                        })
                        const contact = await client.getContactById(`${room.activePlayers[room.turnToPlay.current].id}@c.us`)
                        setTimeout(async () => {
                            const [word, initial] = generateRandomClue()
                            room.questions.push(initial);
                            chat.sendMessage(question(idGroup, room.activePlayers[room.turnToPlay.current].id, word, initial), {
                                mentions: [contact]
                            })
                            room.isStarted = true;
                        }, 3000)

                        deleteTImer()
                        evaluate.userIdx = room.turnToPlay.current;
                        await new Promise((res, rej) => {
                            timer(res)
                        })

                        if (!room.activePlayers[evaluate.userIdx].hasAnswered) {
                            const ctx = await client.getContactById(`${room.activePlayers[evaluate.userIdx].id}@c.us`)
                            chat.sendMessage(`Hadehh telat mikir,@${ctx.id.user} dikick dari permainan`, {
                                mentions: [ctx]
                            })
                            dropActivePlayer(evaluate.userIdx)
                            await decideGame(chat, client, idGroup)
                        }
                        deleteTImer()

                    } else {
                        chat.sendMessage(`Jumlah pemain tidak cukup bro !`)
                    }
                } else {
                    chat.sendMessage(`Heii ${senderName}, game sudah anda mulai🫵👊`)
                }
            } else {
                chat.sendMessage(`Heii ${senderName} anda bukan admin 🫵👊!!`)
            }

        } else {
            const filter = queue.filter(e => {
                return idGroup === e.id;
            })
            if (filter.length != 0) {
                chat.sendMessage(`Antri bro, uda di list kok`)
            } else {
                chat.sendMessage(`Silahkan booking room dulu`)
            }
        }

    } else if (text == '/help@game') {
        chat.sendMessage(help())
    } else if (text == '/queue@game') {
        let str = ''
        queue.map(async (e, i) => {
            let contactUser = await client.getContactById(`${e.admin}@c.us`)
            str += `${i} ${contactUser.pushname} (${e.id})\n`
        })
        chat.sendMessage(str)
    } else {
        if (message.hasQuotedMsg && message._data.quotedParticipant === client.info.me._serialized) {
            console.log('ngreply saya');
            if (idGroup === room.id && room.isStarted) {
                if (idSender === room.activePlayers[room.turnToPlay.current].id) {
                    const check = room.activePlayers.filter(e => {
                        return e.id === idSender
                    })
                    if (check.length != 0) {
                        if (room.isStarted) {
                            console.log('parti:', room.activePlayers);
                            console.log('turn:', room.turnToPlay.current);
                            if (idSender === room.activePlayers[room.turnToPlay.current].id && room.isStarted) {
                                const response = isCorrectAnswer(text)
                                console.log(room.questions);

                                if (response.status) {
                                    console.log('jawaban benar');
                                    room.activePlayers[room.turnToPlay.current].hasAnswered = true;
                                    room.activePlayers[room.turnToPlay.current].chanceRemaining = 3;
                                    room.answers.push(text)
                                    room.participants.map((e, i) => {
                                        if (e.id == room.activePlayers[room.turnToPlay.current].id) {
                                            room.participants[i].score += 10
                                        }
                                    })
                                    room.turnToPlay.previous = room.turnToPlay.current;
                                    setTurnToPlay();
                                    const nextCLue = getClue(text)
                                    room.questions.push(nextCLue);
                                    const contact = await client.getContactById(`${room.activePlayers[room.turnToPlay.current].id}@c.us`)
                                    chat.sendMessage(question(idGroup, room.activePlayers[room.turnToPlay.current].id, text, nextCLue), {
                                        mentions: [contact]
                                    })
                                    console.log('jawaban benar dan sudah kirim resppon');
                                    deleteTImer()
                                    evaluate.userIdx = room.turnToPlay.current;
                                    await new Promise((res, rej) => {
                                        timer(res)
                                    })

                                    if (!room.activePlayers[evaluate.userIdx].hasAnswered) {
                                        const ctx = await client.getContactById(`${room.activePlayers[evaluate.userIdx].id}@c.us`)
                                        chat.sendMessage(`Hadehh telat mikir,@${ctx.id.user} dikick dari permainan`, {
                                            mentions: [ctx]
                                        })
                                        dropActivePlayer(evaluate.userIdx)
                                        await decideGame(chat, client, idGroup)
                                    }
                                    deleteTImer()

                                } else {
                                    console.log('jawaban salahh');
                                    if (room.activePlayers[room.turnToPlay.current].chanceRemaining > 1) {
                                        room.activePlayers[room.turnToPlay.current].chanceRemaining--;
                                        room.participants.map((e, i) => {
                                            if (e.id == room.activePlayers[room.turnToPlay.current].id) {
                                                room.participants[i].score -= 3
                                            } else if (e.id == room.activePlayers[room.turnToPlay.previous].id) {
                                                if (room.turnToPlay.previous != room.turnToPlay.current) {
                                                    room.participants[i].score += 3
                                                }
                                            }
                                        })

                                        const contact = await client.getContactById(`${room.activePlayers[room.turnToPlay.current].id}@c.us`)
                                        console.log('pertanyaan sebelumnya ', room.questions[room.questions.length - 1]);
                                        chat.sendMessage(reviceQuestion(idGroup, room.activePlayers[room.turnToPlay.current].id, room.questions[room.questions.length - 1], room.activePlayers[room.turnToPlay.current].chanceRemaining, response.message), {
                                            mentions: [contact]
                                        })
                                        console.log('sudah kirim respon');
                                    } else {
                                        dropActivePlayer(room.turnToPlay.current);
                                        await decideGame(chat, client, idGroup);
                                    }

                                }
                            }
                        }
                    }
                }
            }
        } else if (message.body.toLowerCase() == '/sticker') {
            const quotedMsg = await message.getQuotedMessage();
            if (message.hasMedia) {
                client.sendMessage(message.from, "iya bentar bro");
                try {
                    const media = await message.downloadMedia();
                    client.sendMessage(message.from, media, {
                        sendMediaAsSticker: true,
                        stickerName: 'sticker',
                        stickerAuthor: 'credit ig: _use.errr' 
                    })
                } catch {
                    client.sendMessage(message.from, "Gagal memproses..");
                }
            } 
        }
    }
}

const setTurnToPlay = () => {
    if (room.turnToPlay.current < room.activePlayers.length - 1) {
        room.turnToPlay.current++;
    } else {
        room.turnToPlay.current = 0;
    }
    room.activePlayers[room.turnToPlay.current].hasAnswered = false;
    console.log('turn to play previous: ', room.turnToPlay.previous);
    console.log('turn to play : ', room.turnToPlay.current);
}

const dropActivePlayer = (idx) => {
    const newActivePlayers = room.activePlayers.filter(e => {
        return e.id != room.activePlayers[idx].id
    })
    room.activePlayers = newActivePlayers;
    console.log('sisan pemarin :', newActivePlayers);
    room.turnToPlay.current = room.turnToPlay.previous;
}


const quickSort = (participants) => {
    if (participants.length <= 1) {
        return participants;
    }

    let pivot = participants[0];
    let leftArr = [];
    let rightArr = [];

    for (let i = 1; i < participants.length; i++) {
        if (participants[i].score > pivot.score) {
            leftArr.push(participants[i]);
        } else {
            rightArr.push(participants[i]);
        }
    }

    return [...quickSort(leftArr), pivot, ...quickSort(rightArr)];
};

const deleteRoom = () => {
    delete room.id
    delete room.admin
    delete room.grouName
    delete room.matchOver
    delete room.isStarted
    delete room.participants
    delete room.turnToPlay
    delete room.questions
    delete room.activePlayers
    delete room.answers
}
const decideGame = async (chat, client, idGroup) => {
    if (room.activePlayers.length === 1) {
        room.participants.map((e, i) => {
            if (e.id === room.activePlayers[0].id) {
                room.participants[i].score += 20
            }
        })
        const winner = await client.getContactById(`${room.activePlayers[0].id}@c.us`)
        const gold = '🥇'
        const silver = '🥈'
        let str = '🏆 game over 🏆\n\nselamat buat'
        str = str.concat(winner.pushname, ', kamu dapat tambahan 20 poin\n\n----------------------------\nklasemen:\n')
        room.participants = quickSort(room.participants);
        console.log('HABIS SHORTING');
        console.log(room.participants);

        await new Promise(async (resolve, reject) => {
            for (let i = 0; i < room.participants.length; i++) {
                const contact = await client.getContactById(`${room.participants[i].id}@c.us`)
                if (i == 0) {
                    str = str.concat(i + 1, '. ', contact.pushname, '(', room.participants[i].score, ')', ' ', gold, '\n')
                } else if (i == 1) {
                    str = str.concat(i + 1, '. ', contact.pushname, '(', room.participants[i].score, ')', ' ', silver, '\n')
                } else {
                    str = str.concat(i + 1, '. ', contact.pushname, '(', room.participants[i].score, ')\n')
                }

            }
            console.log(str);
            resolve()
        })

        str = str.concat('\n----------------------------\n\nmulai room baru:\n/create@KataBersambungBot\n----------------------------\n\n-----------\nCredit\nGame by Erick Delenia\n-----------')
        chat.sendMessage(str)
        console.log(str);
        deleteRoom()

    } else {
        setTurnToPlay()
        room.turnToPlay.previous = room.turnToPlay.current;
        const contact = await client.getContactById(`${room.activePlayers[room.turnToPlay.current].id}@c.us`)
        const [word, initial] = generateRandomClue()
        room.questions.push(initial);
        chat.sendMessage(question(idGroup, room.activePlayers[room.turnToPlay.current].id, word, initial), {
            mentions: [contact]
        })
    }
}