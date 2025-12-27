import {DocumentUpdatedMessage, MessageToUi, MessageToUiType, SettingsUpdatedMessage} from "../shared/types";
import {ComponentInfoElement} from "./src/elements/components-tab/component-info.element";
import {Util} from "../shared/util";
import {ComponentsListHeaderElement} from "./src/elements/components-tab/components-list-header.element";
import "./src/styles.scss";
import {TabviewElement} from "./src/elements/common/tabview.element";
import {InstancesListElement} from "./src/elements/instances-tab/instances-list.element";
import {InstanceInfoElement} from "./src/elements/instances-tab/instance-info.element";
import {SearchInputElement} from "./src/elements/common/search-input.element";
import {InstancesGroupElement} from "./src/elements/instances-tab/instances-group.element";
import {ResizeCornerElement} from "./src/elements/common/resize-corner.element";
import {ScanResultsManager} from "./src/scan-results-manager";
import {SettingsBarElement} from "./src/elements/common/settings-bar.element";

ComponentInfoElement.register();
ComponentsListHeaderElement.register();
TabviewElement.register();
InstancesListElement.register();
InstanceInfoElement.register();
SearchInputElement.register();
InstancesGroupElement.register();
ResizeCornerElement.register();
SettingsBarElement.register();

export const util = new Util("CM-Frontend");

onmessage = (event) => {
    const messageToUi: MessageToUi = event.data.pluginMessage;
    util.log("Components-Manager: UI Received Message", messageToUi);
    if (messageToUi.type === MessageToUiType.DOCUMENT_UPDATE) {
        const typedMessage = messageToUi as DocumentUpdatedMessage;
        ScanResultsManager.getInstance().handleDocumentUpdate(typedMessage.payload);
    } else if (messageToUi.type === MessageToUiType.SETTINGS_UPDATE) {
        const typedMessage = messageToUi as SettingsUpdatedMessage;
        const settingsBar = document.querySelector('app-settings-bar') as SettingsBarElement;
        if (settingsBar) {
            settingsBar.setAutoRefreshState(typedMessage.payload.autoRefresh);
        }
    }
}

util.log("Components-Manager: Frontend Loaded");