const invitation = (id, grouName, admin) => {
    return `
    --------------------------------------------------------------
    *Tournament Grup ${grouName}*
    --------------------------------------------------------------
    
    🎮 room id: ${id}
    🥷 admin: ${admin}
    🃏 mode: standar
    🛠 skills: lives, skips, hammers
    🕗 waktu jawab: 30 detik

    ---------------------------------------------------------------
    /help@game: untuk instruksi seputar game
    ---------------------------------------------------------------
    
    `
}

const help=()=>{
    return `
    *Seputar Permainan Sambung Kata*


    Permainan ini adalah permainan sambung kata acak dimana tiap peserta akan diberi giliran untuk menyabung kata sebelumnya.
    contoh :
    di awal permainan, bot akan memilih kata pertama yang nanti wajib disambung oleh peserta pertama, misal dipilih kata "MAKAN"
    
    bot : MAK(AN) 
    bot memilih awalan "AN" untuk nantinya disambung oleh peserta pertama
    
    perserta 1 : meyambung dengan kata ANgka
    bot memilih awalan "KA" untuk nantinya disambung oleh peserta kedua
    
    peserta keduadi wajibkan menyambung kata dengan awalan yang akan ditentukan oleh bot.
    
    *Rules:*
    1. Peserta diberi giliran menjawab dengan kesempatan 3 kali menjawab salah dalam kurun waktu 30 detik.
    2. Lebih dari 30 detik peserta tidak menjawab maka akan dianggap gugur, giliran akan dilempar ke peserta berikutnya yang masih aktif.
    3. Peserta akan di Tag oleh bot jika tiba gilirannya
    4. Untuk menjawab silahkan reply pesan dari bot.
    
    *Perintah:*
    
    1. /players@game: informasi peserta
    2. /create@game: membuat room permainan
    3. /join@game: bergabung dalam permainan
    4. /start@game: memulai permainan
    5. /leave@game: meinggalkan permainan
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
