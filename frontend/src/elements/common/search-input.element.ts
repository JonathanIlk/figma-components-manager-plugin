import "./search-input.element.scss";

export class SearchInputElement extends HTMLElement {

    static register() {
        window.customElements.define('app-search-input', SearchInputElement);
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('placeholder', 'Search');
        input.addEventListener('input', this.onInput.bind(this));
        this.appendChild(input);
    }

    onInput(event: Event) {
        const input = event.target as HTMLInputElement;
        const searchEvent = new CustomEvent('search', {
            detail: input.value
        });
        this.dispatchEvent(searchEvent);
    }

    getSearchText() {
        return (this.querySelector('input') as HTMLInputElement).value;
    }
}