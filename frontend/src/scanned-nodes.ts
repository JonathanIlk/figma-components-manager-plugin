import {ComponentDto, ComponentType, InstanceDto, VariantDto} from "../../shared/types";
import {ScanResultsManager} from "./scan-results-manager";

export interface BaseScannedNode {
    nodeId: string;
    displayName: string;
}

/**
 * Frontend Representation of a figma document Component retrieved from the Backend.
 * Constructed when receiving scan results from the Backend.
 */
export class ScannedComponent implements BaseScannedNode {
    private constructor(public nodeId: string, public displayName: string, public type: ComponentType, public variantIds: string[], public instanceIds: string[], public variantProperties: string[]) {
    }

    public static fromDto(dto: ComponentDto): ScannedComponent {
        return new ScannedComponent(dto.nodeId, dto.nodeName, dto.type, dto.variantIds, dto.instanceIds, dto.variantProperties);
    }

    get variants(): ScannedVariant[] {
        const variants: ScannedVariant[] = [];
        for (const variantId of this.variantIds) {
            const variant = ScanResultsManager.getInstance().getVariantById(variantId);
            if (variant) {
                variants.push(variant);
            }
        }
        return variants;
    }

    get instances(): ScannedInstance[] {
        const instances: ScannedInstance[] = [];
        for (const instanceId of this.instanceIds) {
            const instance = ScanResultsManager.getInstance().getInstanceById(instanceId);
            if (instance) {
                instances.push(instance);
            }
        }
        return instances;
    }
}

/**
 * Frontend Representation of a figma document Variant retrieved from the Backend.
 */
export class ScannedVariant implements BaseScannedNode {
    private constructor(public nodeId: string,  public displayName: string, public propertyValues: string[], public instanceIds: string[]) {
    }

    public static fromDto(dto: VariantDto): ScannedVariant {
        return new ScannedVariant(dto.nodeId, dto.displayName, dto.propertyValues, dto.instanceIds);
    }

    get instances(): ScannedInstance[] {
        const instances: ScannedInstance[] = [];
        for (const instanceId of this.instanceIds) {
            const instance = ScanResultsManager.getInstance().getInstanceById(instanceId);
            if (instance) {
                instances.push(instance);
            }
        }
        return instances;
    }
}

/**
 * Frontend Representation of a figma document Instance retrieved from the Backend.
 */
export class ScannedInstance implements BaseScannedNode {
    private constructor(public nodeId: string, public displayName: string) {
    }

    public static fromDto(dto: InstanceDto): ScannedInstance {
        return new ScannedInstance(dto.nodeId, dto.nodeName);
    }
}