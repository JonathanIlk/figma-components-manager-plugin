import {util} from "../backend";

/**
 * Singleton Manager for handling the plugin window.
 */
export class WindowManager {
    private static instance: WindowManager;

    private static DEFAULT_WIDTH = 400;
    private static DEFAULT_HEIGHT = 500;

    private constructor() {
    }

    public static getInstance() {
        if (!WindowManager.instance) {
            WindowManager.instance = new WindowManager();
        }
        return WindowManager.instance;
    }

    public initialize() {
        figma.showUI(__html__, {themeColors: true, width: 400, height: 500});

        //Restore previous size when reopen the plugin
        figma.clientStorage.getAsync('size').then(size => {
            if(size) {
                figma.ui.resize(size.w,size.h);
            }
        }).catch(err=>{});
    }

    public resize(width: number, height: number) {
        figma.ui.resize(width, height);
        //Store size for next time
        figma.clientStorage.setAsync('size', {w: width, h: height}).catch(err => {
            util.logError("Error when saving size to client Storage: ", err);
        });
    }
}