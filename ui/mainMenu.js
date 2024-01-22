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
            <h1>Game logo</h1>
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
