import html from 'solidjs-html';
import button from "./button.js"
import {events} from "../utils/events.js"

export default function popup(show) {
    return html`
        <div class="popup ${show === true ? 'show' : ''}">
            <h2>Paused</h2>
            <div class="buttons-container">
				${button('blue', 'small', 'Main Menu', () => events.emit("changeUi", "mainMenu"))}
				${button('blue', 'small', 'Mute Audio'), () => events.emit("muteAudio")}
				${button('blue', 'small', 'Quit'), () => events.emit("quitGame")}
            </div>
        </div>
    `;
}
