import {ScanResultDto} from "../../shared/types";
import {ComponentsListHeaderElement} from "./elements/components-tab/components-list-header.element";
import {InstancesListElement} from "./elements/instances-tab/instances-list.element";
import {ComponentInfoElement} from "./elements/components-tab/component-info.element";
import {ScannedComponent, ScannedInstance, ScannedVariant} from "./scanned-nodes";

export interface StoredScanResults {
    components: { [nodeId: string]: ScannedComponent };
    variants: { [nodeId: string]: ScannedVariant };
    instances: { [nodeId: string]: ScannedInstance };
}

/**
 * Receives scan results from the Backend (Full/Partial) and updates its own state and the UI accordingly.
 */
export class ScanResultsManager {

    private static instance: ScanResultsManager;

    public static getInstance(): ScanResultsManager {
        if (!ScanResultsManager.instance) {
            ScanResultsManager.instance = new ScanResultsManager();
        }
        return ScanResultsManager.instance;
    }

    private cachedScanResults: StoredScanResults = {
        components: {},
        variants: {},
        instances: {}
    };

    private constructor() {}

    public fullScanRefresh(scanResult: ScanResultDto) {
        const newResults: StoredScanResults = {
            components: {},
            variants: {},
            instances: {}
        };

        for (const componentDto of scanResult.components) {
            const component = ScannedComponent.fromDto(componentDto);
            newResults.components[component.nodeId] = component;
        }

        for (const variantDto of scanResult.variants) {
            const variant = ScannedVariant.fromDto(variantDto);
            newResults.variants[variant.nodeId] = variant;
        }

        for (const instanceDto of scanResult.instances) {
            const instance = ScannedInstance.fromDto(instanceDto);
            newResults.instances[instance.nodeId] = instance;
        }

        this.cachedScanResults = newResults;

        this.refreshUi();
    }

    private refreshUi() {
        const container = document.getElementById('components-list') as HTMLElement;
        container.innerHTML = "";

        for (const component of Object.values(this.cachedScanResults.components)) {
            const componentInfo = this.createComponentInfoElement(component);
            container.appendChild(componentInfo);
        }

        const header: ComponentsListHeaderElement = document.getElementById('components-list-header') as ComponentsListHeaderElement;
        header.updateForScanResult(this.cachedScanResults);

        const instancesList: InstancesListElement = document.getElementsByTagName('app-instances-list')[0] as InstancesListElement;
        instancesList.updateForScanResult(this.cachedScanResults);
    }

    private createComponentInfoElement(scannedComponent: ScannedComponent) {
        const componentInfo: ComponentInfoElement = document.createElement('app-component-info') as ComponentInfoElement;
        componentInfo.initForComponent(scannedComponent);
        return componentInfo;
    }


    public getComponentById(nodeId: string): ScannedComponent | undefined {
        return this.cachedScanResults.components[nodeId];
    }

    public getVariantById(nodeId: string): ScannedVariant | undefined {
        return this.cachedScanResults.variants[nodeId];
    }

    public getInstanceById(nodeId: string): ScannedInstance | undefined {
        return this.cachedScanResults.instances[nodeId];
    }
}