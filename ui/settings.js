import html from 'solidjs-html';
import { events } from '../utils/events.js';
import button from './button.js';
import toggleButton from './toggleButton.js';

export default function settings() {
    return html`
        <div class="center-container flex-col">
            <h1>Settings</h1>
            <div class="buttons-container">
                ${toggleButton((e) => {
                    events.emit('toggleMusic')
                })}
                ${button('', '', 'Back', () =>
                    events.emit('changeUi', 'mainMenu')
                )}
            </div>
        </div>
    `;
}
