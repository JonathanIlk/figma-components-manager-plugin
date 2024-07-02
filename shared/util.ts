export class Util {

    constructor(protected loggerPrefix: string) {
    }


    log(...message: (unknown)[]) {
        console.log(this.loggerPrefix, ...message);
    }
}