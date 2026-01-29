import {
    ComponentDto,
    DocumentUpdatePayload, DocumentUpdateSeriesInformation, InstanceDto,
    ScanResultDto,
    SettingsUpdatePayload,
    VariantDto
} from "../../shared/types";
import {ScannedComponent, ScannedInstance, ScannedVariant} from "./scanned-nodes";
import {util} from "../frontend";
import {reactive} from "vue";

export interface StoredScanResults {
    components: { [nodeId: string]: ScannedComponent };
    variants: { [nodeId: string]: ScannedVariant };
    instancesMap: { [mainComponentNodeId: string]: ScannedInstance[] };
}

export interface AppState {
    scanResults: StoredScanResults;
    other: {
        lastDocumentUpdateSeriesInfo?: DocumentUpdateSeriesInformation;
    }
    settings: {
        autoRefresh: boolean;
        includeInvisible: boolean;
        fontSize: number;
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
            instancesMap: {},
        },
        other: {
            lastDocumentUpdateSeriesInfo: undefined,
        },
        settings: {
            autoRefresh: false,
            includeInvisible: false,
            fontSize: 16
        }
    });

    private constructor() {}

    public handleDocumentUpdate(updatePayload: DocumentUpdatePayload) {
        util.log("ScanResultsManager: Handling Document Update", updatePayload);

        if (updatePayload.updateSeriesInformation?.updateType === "series-start") {
            // For a full refresh, we clear all existing scan results first.
            this.state.scanResults = {
                components: {},
                variants: {},
                instancesMap: {},
            };
        }
        this.state.other.lastDocumentUpdateSeriesInfo = updatePayload.updateSeriesInformation;


        for (const componentDto of updatePayload.scanResult.components) {
            const component = ScannedComponent.fromDto(componentDto);
            this.state.scanResults.components[component.nodeId] = component;
        }

        for (const variantDto of updatePayload.scanResult.variants) {
            const variant = ScannedVariant.fromDto(variantDto);
            this.state.scanResults.variants[variant.nodeId] = variant;
        }

        for (const instanceDto of updatePayload.scanResult.instances) {
            // Add entry to instancesMap under its main component
            if(!instanceDto.mainComponentNodeId) {
                continue;
            }
            if (!this.state.scanResults.instancesMap[instanceDto.mainComponentNodeId]) {
                this.state.scanResults.instancesMap[instanceDto.mainComponentNodeId] = [];
            }
            if(this.state.scanResults.instancesMap[instanceDto.mainComponentNodeId].some(instance => instance.nodeId === instanceDto.nodeId)) {
                // Already exists, skip
                continue;
            }
            this.state.scanResults.instancesMap[instanceDto.mainComponentNodeId].push(ScannedInstance.fromDto(instanceDto, this.state.other.lastDocumentUpdateSeriesInfo?.scannedFromPageName));
        }

        for (const removedNodeId of updatePayload.removedNodeIds) {
            delete this.state.scanResults.components[removedNodeId];
            delete this.state.scanResults.variants[removedNodeId];

            // find in instancesMap and remove (Probably pretty expensive at some point to do it like this)
            for (const mainComponentId in this.state.scanResults.instancesMap) {
                this.state.scanResults.instancesMap[mainComponentId] = this.state.scanResults.instancesMap[mainComponentId].filter(instance => instance.nodeId !== removedNodeId);
            }
        }
    }

    public handleSettingsUpdate(payload: SettingsUpdatePayload) {
        this.state.settings.autoRefresh = payload.autoRefresh;
        this.state.settings.includeInvisible = payload.includeInvisible;
        this.state.settings.fontSize = payload.fontSize;
        document.documentElement.style.fontSize = `${payload.fontSize}px`;
    }

    public getComponentById(nodeId: string): ScannedComponent | undefined {
        return this.state.scanResults.components[nodeId];
    }

    public getVariantById(nodeId: string): ScannedVariant | undefined {
        return this.state.scanResults.variants[nodeId];
    }

    public getInstancesForComponentId(nodeId: string): ScannedInstance[] {
        const foundInstances = this.state.scanResults.instancesMap[nodeId];
        return foundInstances ? foundInstances : [];
    }
}