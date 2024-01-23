const invitation = (id, grouName, admin) => {
    return `
    Tournament Grup ${grouName}
    
    🎮 room id: ${id}
    🥷 admin: ${admin}
    🃏 mode: standar
    🛠 skills: lives, skips, hammers
    🕗 waktu jawab: 30 detik

    instruksi:
    /help@game terkait perintah-perintah dalam permainan ini.
    `
}

const help=()=>{
    return `
    Berikut perintah yang dapat digunakan:

    /create@game: membuat room permainan
    /join@game: bergabung dalam permainan yang sedang berlangsung
    /start@gmae: memulai permainan (pastikan peserta tidak kurang dari 2)
    /leave@game: keluar dari permainan
    `
}



const question = (id, target, previousAnswer, nextQuestion) => {
    return `
    🎮 room id: ${id}

    ----------------------------
    giliran: @${target}
    reply untuk jawab
    ----------------------------

    mulai: ${previousAnswer.toLocaleUpperCase()}
    ${nextQuestion.toLocaleUpperCase()}...`
}
const reviceQuestion = (id, target, nextQuestion, tempRemaining,message) => {
    return `
    🎮 room id: ${id}

    ${message} 
    ${nextQuestion}... 
    ----------------------------
    giliran: @${target}
    reply untuk jawab
    ----------------------------

    kamu punya ${tempRemaining} kesempatan lagi.`
}



const timeRemaining = () => {
    return 'sisa waktu kurang dari 30 detik'
}


export { invitation, question, reviceQuestion, timeRemaining ,help};
