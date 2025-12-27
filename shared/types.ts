/// Messages UI -> Backend

export enum BackendMessageType {
    NAVIGATE_TO_NODE = "navigate-to-node",
    RESIZE = "resize",
}

export interface MessageToBackend<T_Type = BackendMessageType, T_Payload = unknown> {
    type: T_Type,
    payload: T_Payload,
}

export interface ResizeMessage extends MessageToBackend<BackendMessageType.RESIZE, {width: number, height: number}> {}

/// Messages Backend -> UI
export enum MessageToUiType {
    FULL_COMPONENTS_REFRESH = "full-components-refresh",
    PARTIAL_COMPONENTS_REFRESH = "partial-components-refresh",
}

export interface MessageToUi<T_Type = MessageToUiType, T_Payload = unknown> {
    type: T_Type,
    payload: T_Payload,
}

export interface FullComponentsRefreshMessage extends MessageToUi<MessageToUiType.FULL_COMPONENTS_REFRESH, ScanResultDto> {}
export interface PartialComponentsRefreshMessage extends MessageToUi<MessageToUiType.PARTIAL_COMPONENTS_REFRESH, ScanResultDto> {}

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