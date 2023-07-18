import { events } from './events.js';

const button = document.getElementById('startGame');
button.addEventListener('click', () => {
    events.emit('startGame', 'hejsan');
});
