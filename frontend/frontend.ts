import {DocumentUpdatedMessage, MessageToUi, MessageToUiType, SettingsUpdatedMessage} from "../shared/types";
import {Util} from "../shared/util";
import {createApp} from 'vue';
import App from './src/App.vue';
import {FrontendStateService} from "./src/frontend-state-service";
import "./src/styles.scss";

export const util = new Util("CM-Frontend");

onmessage = (event) => {
    const messageToUi: MessageToUi = event.data.pluginMessage;
    util.log("Components-Manager: UI Received Message", messageToUi);
    if (messageToUi.type === MessageToUiType.DOCUMENT_UPDATE) {
        const typedMessage = messageToUi as DocumentUpdatedMessage;
        FrontendStateService.getInstance().handleDocumentUpdate(typedMessage.payload);
    } else if (messageToUi.type === MessageToUiType.SETTINGS_UPDATE) {
        const typedMessage = messageToUi as SettingsUpdatedMessage;
        FrontendStateService.getInstance().handleSettingsUpdate(typedMessage.payload);
    }
}

util.log("Components-Manager: Frontend Loaded");

// Mount vue once the DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    const app = createApp(App);
    app.mount('#app');
})