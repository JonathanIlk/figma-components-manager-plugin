import "../components-tab/components-list-header.element.scss";
import "./tabview.element.scss";

/**
 * Provide the content of the tabview as innerhtml, the tabs are then generated automatically.
 *
 * Usage:
 * <app-tabview>
 *   <div tab-name="Tab 1" class="tab-content">
 *       bla bla bla
 *   </div>
 *   <div tab-name="Tab 2" class="tab-content">
 *       bla bla bla
 *   </div>
 * </app-tabview>
 */
export class TabviewElement extends HTMLElement {
    protected tabContents: HTMLElement[] = [];
    protected tabButtons: HTMLElement[] = [];

    static register() {
        window.customElements.define('app-tabview', TabviewElement);
    }

    static get observedAttributes() {
        return [];
    }

    protected attributeChangedCallback(name: string, oldValue: string, newValue: string) {

    }

    connectedCallback() {
        setTimeout(() => { // SetTimeout because the innerHTML is not available immediately (https://stackoverflow.com/a/70952159/1123709)
            this.setupTabContents();
            const tabButtonsHtml = this.generateTabButtonsHtml();
            this.insertAdjacentHTML("afterbegin", tabButtonsHtml);
            this.tabButtons = Array.from(this.querySelectorAll(".tab-button"));
            this.setupTabButtonsListeners();
            this.showTab(0);
        }, 1);
    }


    private setupTabContents() {
        this.tabContents = Array.from(this.querySelectorAll(".tab-content"));
        this.tabContents.forEach((tab, index) => {
            tab.setAttribute("data-tab-index", index.toString());
        });
    }

    private generateTabButtonsHtml(): string {
        return `
            <div class="tab-buttons-container">
                ${this.tabContents.map((tab, index) => {
                    const name = tab.getAttribute("tab-name") || `Tab ${index + 1}`;
                    return `<button class="tab-button" data-tab-index="${index}">${name}</button>`;
                }).join('')}
            </div>
        `;
    }

    public showTab(index: number) {
        this.tabContents.forEach((tab) => {
            const tabIndex = parseInt(tab.getAttribute("data-tab-index") || "-1");
            if (tabIndex === index) {
                tab.classList.add("active");
            } else {
                tab.classList.remove("active");
            }
        });

        this.tabButtons.forEach((button) => {
            const tabIndex = parseInt(button.getAttribute("data-tab-index") || "-1");
            if (tabIndex === index) {
                button.classList.add("active");
            } else {
                button.classList.remove("active");
            }
        });
    }

    private setupTabButtonsListeners() {
        this.tabButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const index = parseInt(button.getAttribute("data-tab-index") || "-1");
                this.showTab(index);
            });
        });
    }
}