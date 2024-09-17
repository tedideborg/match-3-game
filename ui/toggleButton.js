import html from 'solidjs-html';

export default function toggleButton(text, callback) {
    return html`
        <fieldset>
            <input
              class="checkbox"
              type="checkbox"
              id="checkbox"
              checked
              onchange=${(e) => callback(e)}
            />
            <label for="checkbox" class="checkbox-label">${text}</label>
        </fieldset>
    `;
}
