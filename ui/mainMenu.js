import html from 'solidjs-html';
import { events } from '../utils/events.js';
import button from './components/button.js';

export default function mainMenu() {
    const changeScene = () => {
        events.emit('changeScene', 'game');
        events.emit('changeUi', 'gameUi');
    };

    return html`
        <div id="mainMenu" class="center-container">
            <div class="title">
                <h1 class="game-title second">Matchy</h1>
                <div class="title-line"></div>
                <h1 class="game-title">Matchy</h1>
            </div>
            <div class="buttons-container">
                ${button('blue', '', 'New Game', changeScene)}
                ${button('', '', 'Settings', () =>
                    events.emit('changeUi', 'settings'),
                )}
            <//>
        </div>
    `;
}
