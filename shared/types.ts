export enum BackendMessageType {
    NAVIGATE_TO_NODE = "navigate-to-node",
}

export type MessageToBackend = {
    type: BackendMessageType,
    payload: unknown,
}

export type MessageToUi = {
    type: "components",
    payload: unknown,
}

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