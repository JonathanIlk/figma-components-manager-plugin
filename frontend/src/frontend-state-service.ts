import {DocumentUpdatePayload, ScanResultDto, SettingsUpdatePayload} from "../../shared/types";
import {ScannedComponent, ScannedInstance, ScannedVariant} from "./scanned-nodes";
import {util} from "../frontend";
import {reactive} from "vue";

export interface StoredScanResults {
    components: { [nodeId: string]: ScannedComponent };
    variants: { [nodeId: string]: ScannedVariant };
    instances: { [nodeId: string]: ScannedInstance };
}

export interface AppState {
    scanResults: StoredScanResults;
    settings: {
        autoRefresh: boolean;
    };
}

/**
 * Receives scan results from the Backend (Full/Partial) and updates its own state and the UI accordingly.
 */
export class FrontendStateService {

    private static instance: FrontendStateService;

    public static getInstance(): FrontendStateService {
        if (!FrontendStateService.instance) {
            FrontendStateService.instance = new FrontendStateService();
        }
        return FrontendStateService.instance;
    }

    public state: AppState = reactive({
        scanResults: {
            components: {},
            variants: {},
            instances: {}
        },
        settings: {
            autoRefresh: false
        }
    });

    private constructor() {}

    public handleDocumentUpdate(updatePayload: DocumentUpdatePayload) {
        util.log("ScanResultsManager: Handling Document Update", updatePayload);

        for (const componentDto of updatePayload.scanResult.components) {
            const component = ScannedComponent.fromDto(componentDto);
            this.state.scanResults.components[component.nodeId] = component;
        }

        for (const variantDto of updatePayload.scanResult.variants) {
            const variant = ScannedVariant.fromDto(variantDto);
            this.state.scanResults.variants[variant.nodeId] = variant;
        }

        for (const instanceDto of updatePayload.scanResult.instances) {
            const instance = ScannedInstance.fromDto(instanceDto);
            this.state.scanResults.instances[instance.nodeId] = instance;
        }

        for (const removedNodeId of updatePayload.removedNodeIds) {
            delete this.state.scanResults.components[removedNodeId];
            delete this.state.scanResults.variants[removedNodeId];
            delete this.state.scanResults.instances[removedNodeId];
        }
    }

    public handleSettingsUpdate(payload: SettingsUpdatePayload) {
        this.state.settings.autoRefresh = payload.autoRefresh;
    }

    public getComponentById(nodeId: string): ScannedComponent | undefined {
        return this.state.scanResults.components[nodeId];
    }

    public getVariantById(nodeId: string): ScannedVariant | undefined {
        return this.state.scanResults.variants[nodeId];
    }

    public getInstanceById(nodeId: string): ScannedInstance | undefined {
        return this.state.scanResults.instances[nodeId];
    }
}