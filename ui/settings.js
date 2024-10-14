import html from 'solidjs-html';
import { events } from '../utils/events.js';
import button from './components/button.js';
import toggleButton from './components/toggleButton.js';

export default function settings() {
    return html`
        <div class="center-container flex-col">
            <h2 class="sub-heading">Settings</h2>
            <div class="buttons-container">
                ${toggleButton("Music", (e) => {
                    events.emit('toggleMusic')
                })}
                ${toggleButton("Sound Effects", (e) => {
                    events.emit('toggleSfx')
                })}
                ${button('', '', 'Back', () =>
                    events.emit('changeUi', 'mainMenu')
                )}
            </div>
        </div>
    `;
}
