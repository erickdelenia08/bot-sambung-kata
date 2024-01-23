import { dictionaryBank, room } from '../app.mjs';

export const setTimer = () => {
    setTimeout(() => {

    }, 10000);
}


export const generateRandomClue = () => {
    const previousAnswer = room.answers
    let nextWord = ''
    while (true) {

        console.log('running ...');
        nextWord = takeRandomChoice(dictionaryBank);
        if (!haveAnswered(nextWord, previousAnswer)) {
            break
        }
    }
    const clue = getClue(nextWord)
    return [nextWord, clue]
}

const haveAnswered = (currentAnswer, previousAnswer) => {
    const filter = previousAnswer.filter(val => {
        return val === currentAnswer;
    })
    console.log(filter);
    if (filter.length > 0) {
        return true;
    }
    return false;
}


export const getClue = (word) => {
    let arr = word.charAt(word.length - 1);
    let i = word.length - 2;
    do {
        if (!isAllConsonant(arr)) {
            console.log('breakk');
            break;
        }
        arr = word[i].concat(arr);
        i--;
    } while (i > 2);
    return arr;
}

const isAllConsonant = (word) => {
    for (let i = 0; i < word.length; i++) {
        if (isVowel(word)) {
            console.log('ada vokal');
            return false;
        }
    }
    return true;
}

function isVowel(word) {
    var vowel = "aeoui";
    for (let i = word.length; i > 0; i--) {
        for (let j = 0; j < vowel.length; j++) {
            if (word[i] === vowel[j]) {
                return true;
            }
        }
    }
}

export const isCorrectAnswer = (word) => {
    if (word.startsWith(room.questions[room.questions.length - 1])) {
        const check = dictionaryBank.filter(e => {
            return word === e
        })
        if (check.length != 0) {
            const answered = haveAnswered(word, room.answers)
            if (answered) {
                return { status: false, message: 'Cari jawaban lain' }
            } else {
                return { status: true, message: 'Jawaban benar' }
            }
        } else {
            return { status: false, message: 'Jawaban Salah' }
        }

    } else {
        return { status: false, message: 'Jawaban Salah' };
    }
}

const takeRandomChoice = (bank) => {
    return bank[Math.floor(Math.random() * (bank.length + 1))];
}

