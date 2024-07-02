export type Environment = {
    loggerPrefix: string;
}

export type MessageToBackend = {
    type: "navigate-to-node",
    payload: unknown,
}

export type MessageToUi = {
    type: "components",
    payload: unknown,
}

export type ScanResultDto = {
    components: ComponentDto[];
}

export type ComponentDto = {
    nodeId: string;
    nodeName: string;
    type: ComponentType;
    variants: VariantDto[],
    instanceNodeIds: string[];
}

export type VariantDto = {
    nodeId: string;
    displayName: string;
    instanceNodeIds: string[];
}

export enum ComponentType {
    COMPONENT = "COMPONENT",
    COMPONENT_SET = "COMPONENT_SET"
}