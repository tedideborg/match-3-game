import { Switch, createSignal, Match } from 'solidjs';
import html from 'solidjs-html';
import { render } from 'solidjs-web';

import { events } from '../utils/events.js';
import mainMenu from './mainMenu.js';
import gameUi from './gameUi.js';
import settings from './settings.js';

function App() {
    const [ui, setUi] = createSignal('mainMenu');

    events.on('changeUi', (event) => {
        setUi(event);
    });

    return html` <${Switch}>
        <${Match} when=${() => ui() === 'mainMenu'}> ${mainMenu} <//>
        <${Match} when=${() => ui() === 'gameUi'}> ${gameUi} <//>
        <${Match} when=${() => ui() === 'settings'}> ${settings} <//>
    <//>`;
}

export default function startUi() {
    // TODO: Implement a loading bar or something here while it loads
    events.on("sceneCreated", () => {
        render(App, document.getElementById('ui'));
    })
}
