import html from 'solidjs-html';

export default function toggleButton(callback) {
    return html`
        <fieldset>
            <input
              type="checkbox"
              id="coding"
              checked
              onchange=${(e) => callback(e)}
            />
            <label for="coding">Music</label>
        </fieldset>
    `;
}
