import { createSignal } from 'solidjs';
import html from 'solidjs-html';
import { events } from '../utils/events.js';
import button from './button.js';

export default function gameUi() {
    const [score, setScore] = createSignal(0);

    events.on('addScore', (value) => {
        setScore(score() + value);
    });

    return html`
        <div id="gameUi">
            <h1>Score: ${() => score()}</h1>
        </div>
    `;
}
