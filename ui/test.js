import { css, styled } from 'solid-styled-components';
import { children } from 'solidjs';
import html from 'solidjs-html';

/**
 *
 * @param {*} props
 * @returns
 */
export default function Container(props) {
    const { margin, center } = props;
    const c = children(() => props.children);

    const containerClass = styled('');

    // const containerClass = css`
    //     color: purple;
    // `;

    return html` <div>${c()}</div> `;
}
