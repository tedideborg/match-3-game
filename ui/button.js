import html from 'solidjs-html';

export default function button(color, text, callback) {
    return html`
        <button class="button ${color}" onclick=${callback}>${text}</button>
    `;
}
