export enum BackendMessageType {
    NAVIGATE_TO_NODE = "navigate-to-node",
    RESIZE = "resize",
}

export interface MessageToBackend<T_Type = BackendMessageType, T_Payload = unknown> {
    type: T_Type,
    payload: T_Payload,
}

export interface ResizeMessage extends MessageToBackend<BackendMessageType.RESIZE, {width: number, height: number}> {}

export type MessageToUi = {
    type: "components",
    payload: unknown,
}

/**
 * Used to transfer the scan result of components and their instances from the backend to the frontend.
 */
export type ScanResultDto = {
    allInstances: InstanceDto[];
    components: ComponentDto[];
}

export type ComponentDto = {
    nodeId: string;
    nodeName: string;
    type: ComponentType;
    variants: VariantDto[],
    instances: InstanceDto[];
}

export type VariantDto = {
    nodeId: string;
    displayName: string;
    instances: InstanceDto[];
}

export type InstanceDto = {
    nodeId: string;
    nodeName: string;
}

export enum ComponentType {
    COMPONENT = "COMPONENT",
    COMPONENT_SET = "COMPONENT_SET"
}