import { createSignal } from 'solidjs';
import html from 'solidjs-html';
import button from "./button.js"
import {events} from "../../utils/events.js"

export default function popup(show, setShowPopup) {
    // Add a settings button here to mute music and audio
    return html`
        <dialog open=${show} class="popup">
            <h2>Paused</h2>
            <div class="buttons-container">
                ${button('blue', 'small', 'Main Menu', () => events.emit("changeUi", "mainMenu"))}
                ${button('blue', 'small', 'Back', () => setShowPopup(false))}
            </div>
        </dialog>
    `;
}
