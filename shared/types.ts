/// Messages UI -> Backend

export enum BackendMessageType {
    NAVIGATE_TO_NODE = "navigate-to-node",
    RESIZE = "resize",
    SET_AUTO_REFRESH = "set-auto-refresh",
    MANUAL_REFRESH = "manual-refresh",
}

export interface MessageToBackend<T_Type = BackendMessageType, T_Payload = unknown> {
    type: T_Type,
    payload: T_Payload,
}

export interface ResizeMessage extends MessageToBackend<BackendMessageType.RESIZE, {width: number, height: number}> {}

export interface SetAutoRefreshMessage extends MessageToBackend<BackendMessageType.SET_AUTO_REFRESH, {autoRefresh: boolean}> {}

/// Messages Backend -> UI
export enum MessageToUiType {
    DOCUMENT_UPDATE = "document-update",
    SETTINGS_UPDATE = "settings-update",
}

export interface MessageToUi<T_Type = MessageToUiType, T_Payload = unknown> {
    type: T_Type,
    payload: T_Payload,
}

export interface DocumentUpdatedMessage extends MessageToUi<MessageToUiType.DOCUMENT_UPDATE, DocumentUpdatePayload> {}

export interface SettingsUpdatedMessage extends MessageToUi<MessageToUiType.SETTINGS_UPDATE, SettingsUpdatePayload> {}

export type DocumentUpdatePayload = {
    scanResult: ScanResultDto;
    removedNodeIds: string[];
}

export type SettingsUpdatePayload = {
    autoRefresh: boolean;
}

/**
 * Used to transfer the scan result of components and their instances from the backend to the frontend.
 */
export type ScanResultDto = {
    components: ComponentDto[];
    variants: VariantDto[];
    instances: InstanceDto[];
}

export type ComponentDto = {
    nodeId: string;
    nodeName: string;
    type: ComponentType;
    variantIds: string[],
    instanceIds: string[];
}

export type VariantDto = {
    nodeId: string;
    displayName: string;
    instanceIds: string[];
}

export type InstanceDto = {
    nodeId: string;
    nodeName: string;
}

export enum ComponentType {
    COMPONENT = "COMPONENT",
    COMPONENT_SET = "COMPONENT_SET"
}