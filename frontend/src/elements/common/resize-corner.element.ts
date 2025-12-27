import {BackendMessageType} from "../../../../shared/types";

/**
 * Provides a resize handle at the bottom-right corner of the plugin UI to allow users to resize the plugin window.
 */
export class ResizeCornerElement extends HTMLElement {
    private corner: SVGElement | null = null;

    static register() {
        window.customElements.define('app-resize-corner', ResizeCornerElement);
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.style.position = 'fixed';
        this.style.bottom = '0';
        this.style.right = '0';
        this.style.zIndex = '1000';
        this.style.cursor = 'nwse-resize';

        this.innerHTML = `
        <svg
            id="corner"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style="display: block;"
        >
            <path d="M16 0V16H0L16 0Z" fill="white" />
            <path d="M6.22577 16H3L16 3V6.22576L6.22577 16Z" fill="#8C8C8C" />
            <path d="M11.8602 16H8.63441L16 8.63441V11.8602L11.8602 16Z" fill="#8C8C8C" />
        </svg>
        `;

        this.corner = this.querySelector('svg');
        if (this.corner) {
            this.corner.addEventListener('pointerdown', this.handlePointerDown);
            this.corner.addEventListener('pointerup', this.handlePointerUp);
        }
    }

    private requestResize = (e: PointerEvent) => {
        const width = Math.max(50, Math.floor(e.clientX + 5));
        const height = Math.max(50, Math.floor(e.clientY + 5));

        parent.postMessage({
            pluginMessage: {
                type: BackendMessageType.RESIZE,
                payload: {
                    width: width,
                    height: height
                }
            }
        }, '*');
    };

    private handlePointerDown = (e: PointerEvent) => {
        const corner = this.corner;
        if (!corner) return;

        corner.setPointerCapture(e.pointerId);
        corner.addEventListener('pointermove', this.requestResize);
    };

    private handlePointerUp = (e: PointerEvent) => {
        const corner = this.corner;
        if (!corner) return;

        corner.releasePointerCapture(e.pointerId);
        corner.removeEventListener('pointermove', this.requestResize);
    };
}