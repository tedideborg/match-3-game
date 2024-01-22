import html from 'solidjs-html';

export default function button(color, size, text, callback) {
    return html`
        <button class="button ${color} ${size}" onclick=${callback}>
            ${text}
        </button>
    `;
}
