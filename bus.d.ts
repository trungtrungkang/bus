export default class EventService {
    private events;
    private cats;
    constructor();
    cat(name: string): EventService;
    raise(name: string, args: Array<any>, ctx?: any): any;
    emit(name: string, ...params: any[]): any;
    once(names: string, fn: Function): this;
    on(names: string, fn: Function, once?: boolean): this;
    off(names: string, fn?: Function): this;
    private static _instance;
    static singleton(): EventService;
}

declare module 'bus'{
    export {EventService};
}
