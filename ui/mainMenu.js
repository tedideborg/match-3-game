import html from 'solidjs-html';
import { events } from '../utils/events.js';
import button from './button.js';
import TestComp from './test.js';

export default function mainMenu() {
    const changeScene = () => {
        events.emit('changeScene', 'game');
        events.emit('changeUi', 'gameUi');
    };

    return html`
        <div id="mainMenu" class="center-container">
            <div class="game-title">
                <h1 class="title-first">Matchy</h1>
                <h1 class="title-second">Matchy</h1>
            </div>
            <${TestComp} margin=${20} center=${true}>
                <h2>hej</h2>
            <//>
            <div class="buttons-container">
                ${button('blue', '', 'New Game', changeScene)}
                ${button('', '', 'Settings', () =>
                    events.emit('changeUi', 'settings'),
                )}
            <//>
        </div>
    `;
}
