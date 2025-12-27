export class Util {

    constructor(protected loggerPrefix: string) {
    }


    log(...message: (unknown)[]) {
        console.log(this.loggerPrefix, ...message);
    }

    logWarn(...message: (unknown)[]) {
        console.warn(this.loggerPrefix, ...message);
    }

    logError(...message: (unknown)[]) {
        console.error(this.loggerPrefix, ...message);
    }
}