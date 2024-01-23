const invitation = (id, grouName, admin) => {
    return `
    -----------------------------------------------------------------
    *Tournament Grup ${grouName}*
    -----------------------------------------------------------------
    
    🎮 room id: ${id}
    🥷 admin: ${admin}
    🃏 mode: standar
    🛠 skills: lives, skips, hammers
    🕗 waktu jawab: 30 detik

    ------------------------------------------------------------------
    /help@game: untuk instruksi seputar game
    ------------------------------------------------------------------
    
    `
}

const help = () => {
    let str=''
    str=str.concat('*Seputar Permainan Sambung Kata*\n\n')
    str=str.concat('Permainan ini adalah permainan sambung kata acak dimana tiap peserta akan diberi giliran untuk menyabung kata sebelumnya.\n*contoh* :\n')
    str=str.concat('di awal permainan, bot akan memilih kata pertama yang nanti wajib disambung oleh peserta pertama, misal dipilih kata "*MAKAN*"\n')
    str=str.concat('bot : MAK(AN)\n') 
    str=str.concat('bot memilih awalan "AN" untuk nantinya disambung oleh peserta pertama\n')
    str=str.concat('perserta 1 : meyambung dengan kata ANgka\n')
    str=str.concat('bot memilih awalan "KA" untuk nantinya disambung oleh peserta kedua\n')
    str=str.concat('peserta keduadi wajibkan menyambung kata dengan awalan yang akan ditentukan oleh bot.\n\n')
    str=str.concat('*Rules:*\n')
    str=str.concat('1. Peserta diberi giliran menjawab dengan kesempatan 3 kali menjawab salah dalam kurun waktu 30 detik.\n')
    str=str.concat('2. Lebih dari 30 detik peserta tidak menjawab maka akan dianggap gugur, giliran akan dilempar ke peserta berikutnya yang masih aktif.\n')
    str=str.concat('3. Peserta akan di Tag oleh bot jika tiba gilirannya\n')
    str=str.concat('4. Untuk menjawab silahkan reply pesan dari bot.\n\n')
    str=str.concat('*Perintah:*\n')
    str=str.concat('1. /players@game: informasi peserta\n')
    str=str.concat('2. /create@game: membuat room permainan\n')
    str=str.concat('3. /join@game: bergabung dalam permainan\n')
    str=str.concat('4. /start@game: memulai permainan\n')
    str=str.concat('5. /leave@game: meinggalkan permainan\n')
    return str;
}



const question = (id, target, previousAnswer, nextQuestion) => {
    return `
    🎮 room id: ${id}

    ----------------------------
    giliran: @${target}
    *reply* untuk jawab
    ----------------------------

    mulai: ${previousAnswer.toLocaleUpperCase()}
    ${nextQuestion.toLocaleUpperCase()}...`
}
const reviceQuestion = (id, target, nextQuestion, tempRemaining, message) => {
    return `
    🎮 room id: ${id}

    ${message.toLocaleUpperCase()} 
    ${nextQuestion.toLocaleUpperCase()}... 
    ----------------------------
    giliran: @${target}
    *reply* untuk jawab
    ----------------------------

    kamu punya *${tempRemaining}* kesempatan lagi.`
}



const timeRemaining = () => {
    return 'sisa waktu kurang dari 30 detik'
}


export { invitation, question, reviceQuestion, timeRemaining, help };
