import { createSignal } from 'solidjs';
import html from 'solidjs-html';
import { events } from '../utils/events.js';
import button from './button.js';
import popup from "./popup.js";

export default function gameUi() {
    const [score, setScore] = createSignal(0);
    const [showPopup, setShowPopup] = createSignal(false)

    events.on('addScore', (value) => {
        setScore(score() + value);
    });

    const togglePopup = () => {
        setShowPopup(!showPopup())
    }

    return html`
        <div id="gameUi">
            <div class="top-bar">
				<h1>Score: ${() => score()}</h1>
			</div>
            <div class="middle center-container">
                ${() => popup(showPopup())}
            </div>
            <div class="bottom-bar">
				${button('blue', 'small', 'Pause', togglePopup)}
			</div>
		</div>
        </div>
    `;
}
