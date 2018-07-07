export declare class Atom {
    config: any;
    nuclei: any;
    roles: any;
    scope: any;
    options: any;
    constructor({ machine, roles, scope, label, nuclei, ...options }: {
        [x: string]: any;
        machine: any;
        roles: any;
        scope: any;
        label: any;
        nuclei: any;
    });
}
declare const _default: (args: any) => Atom;
export default _default;
