import {ComponentDto, ComponentType, InstanceDto, VariantDto} from "../../shared/types";
import {FrontendStateService} from "./frontend-state-service";

export interface BaseScannedNode {
    nodeId: string;
    displayName: string;
}

/**
 * Frontend Representation of a figma document Component retrieved from the Backend.
 * Constructed when receiving scan results from the Backend.
 */
export class ScannedComponent implements BaseScannedNode {
    public isPlaceholder: boolean = false;

    private constructor(public nodeId: string, public displayName: string, public type: ComponentType, public variantIds: string[], public variantProperties: string[]) {
    }

    public static fromDto(dto: ComponentDto): ScannedComponent {
        return new ScannedComponent(dto.nodeId, dto.nodeName, dto.type, dto.variantIds, dto.variantProperties);
    }

    public static placeHolder(nodeId: string): ScannedComponent {
        const placeholder = new ScannedComponent(nodeId, "Placeholder", ComponentType.COMPONENT, [], []);
        placeholder.isPlaceholder = true;
        return placeholder;
    }

    get variants(): ScannedVariant[] {
        const variants: ScannedVariant[] = [];
        for (const variantId of this.variantIds) {
            const variant = FrontendStateService.getInstance().getVariantById(variantId);
            if (variant) {
                variants.push(variant);
            }
        }
        return variants;
    }

    // Get all instances of this component including instances of its variants
    get allDescendantInstances(): ScannedInstance[] {
        let instances: ScannedInstance[] = [];
        // Add direct instances
        instances = instances.concat(this.directInstances);
        // Add instances of variants
        for (const variant of this.variants) {
            instances = instances.concat(variant.instances);
        }
        return instances;
    }

    // Get the direct instances of this component (not including instances of variants)
    get directInstances(): ScannedInstance[] {
        return FrontendStateService.getInstance().getInstancesForComponentId(this.nodeId);
    }

    get searchTerm(): string {
        return `${this.displayName} ${this.variantProperties.join(' ')} ${this.variants.map(v => v.searchTerm).join(' ')}`;
    }
}

/**
 * Frontend Representation of a figma document Variant retrieved from the Backend.
 */
export class ScannedVariant implements BaseScannedNode {
    public isPlaceholder: boolean = false;

    private constructor(public nodeId: string,  public displayName: string, public propertyValues: string[]) {
    }

    public static fromDto(dto: VariantDto): ScannedVariant {
        return new ScannedVariant(dto.nodeId, dto.displayName, dto.propertyValues);
    }

    public static placeHolder(nodeId: string): ScannedVariant {
        const placeholder = new ScannedVariant(nodeId, "Placeholder", []);
        placeholder.isPlaceholder = true;
        return placeholder;
    }

    get instances(): ScannedInstance[] {
        return FrontendStateService.getInstance().getInstancesForComponentId(this.nodeId);
    }

    get searchTerm(): string {
        return `${this.propertyValues.join(' ')}`;
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