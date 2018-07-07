export declare class Nucleus {
    config: {};
    parent: any;
    nuclei: any;
    options: {};
    policies: any;
    sanitizers: any;
    validators: any;
    setters: never[];
    getters: never[];
    constructor({ type, machine, label, parent, nuclei, getters, setters, policies, sanitizers, validators, ...options }: {
        [x: string]: any;
        type: any;
        machine: any;
        label: any;
        parent: any;
        nuclei: any;
        getters: any;
        setters: any;
        policies: any;
        sanitizers: any;
        validators: any;
    });
    readonly machine: any;
    readonly type: any;
    readonly label: any;
    addNuclei: ({ nuclei }: {
        nuclei: any;
    }) => void;
    grant: ({ isotope, scope, roles, ...options }: {
        [x: string]: any;
        isotope: any;
        scope: any;
        roles: any;
    }) => Promise<any>;
    validate: ({ value, isotope, ...options }: {
        [x: string]: any;
        value: any;
        isotope: any;
    }) => Promise<any>;
    sanitize: ({ isotope, ...options }: {
        [x: string]: any;
        isotope: any;
    }) => Promise<any>;
    getter: ({ value, isotope, ...options }?: {
        value: any;
        isotope: any;
    }) => Promise<any>;
    setter: ({ value, isotope, ...options }: {
        [x: string]: any;
        value: any;
        isotope: any;
    }) => Promise<any>;
}
declare const _default: (args: any) => Nucleus;
export default _default;
