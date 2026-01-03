import {util} from "../backend";

/**
 * Singleton Manager for handling the plugin window.
 */
export class WindowManager {
    private static instance: WindowManager;

    private static DEFAULT_WIDTH = 400;
    private static DEFAULT_HEIGHT = 550;

    private static MIN_WIDTH = 300;
    private static MIN_HEIGHT = 300;

    private constructor() {
    }

    public static getInstance() {
        if (!WindowManager.instance) {
            WindowManager.instance = new WindowManager();
        }
        return WindowManager.instance;
    }

    public initialize() {
        figma.showUI(__html__, {themeColors: true, width: WindowManager.DEFAULT_WIDTH, height: WindowManager.DEFAULT_HEIGHT});

        //Restore previous size when reopen the plugin
        figma.clientStorage.getAsync('size').then(size => {
            if(size) {
                figma.ui.resize(size.w,size.h);
            }
        }).catch(err=>{});
    }

    public resize(width: number, height: number) {
        const realWidth = Math.max(width, WindowManager.MIN_WIDTH);
        const realHeight = Math.max(height, WindowManager.MIN_HEIGHT);

        figma.ui.resize(realWidth, realHeight);
        //Store size for next time
        figma.clientStorage.setAsync('size', {w: realWidth, h: realHeight}).catch(err => {
            util.logError("Error when saving size to client Storage: ", err);
        });
    }
}