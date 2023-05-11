const TelegramApi = require('node-telegram-bot-api');
const token = '6137770998:AAG_VGg8MrV76VwUq8PNBEK5OGp4EaqWpdU';
const bot = new TelegramApi(token, {polling: true});
const chats = {}; // местная бд
const {gameOptions, againOptions} = require('./options');

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Сейчас я загадаю цифру от 0 до 9, и ты должен угадать!`);
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай!', gameOptions);
}
 
// вывод инфы в консоль //
// bot.on('message', msg => {
//     console.log(msg)
// });


const start = () => {

    //команды бота которые мы можем указать //
    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветсвие'},
        {command: '/info', description: 'Информация пользователя'},
        {command: '/game', description: 'Отгадай загаданное число'},
    ]);

    // бот овечает нам сообщением //
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/4dd/300/4dd300fd-0a89-3f3d-ac53-8ec93976495e/192/86.webp');
            return bot.sendMessage(chatId, `Добро пожаловать лапочка)`);
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name}`);
        }
        if (text === '/game') {
            return startGame(chatId);
        }
        return bot.sendMessage(chatId, 'Я тебя не понимаю, пиши внятнее!!!');
    });

    bot.on('callback_query', msg => {  //прослушивание кнопок
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again') {
            return startGame(chatId);
        }
        if (data == chats[chatId]) {
            return bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}`, againOptions);
        } else {
            return bot.sendMessage(chatId, `Плохо, ты не отгадал цифру ${chats[chatId]}`, againOptions);
        }
    }) 
}
start();
