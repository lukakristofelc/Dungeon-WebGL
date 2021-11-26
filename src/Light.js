import { Node } from './Node.js';

export class Light extends Node {

    constructor() {
        super();

        Object.assign(this, {
            position         : [0, 6, 0],
            ambientColor     : [95, 92, 84],
            diffuseColor     : [163,159,152],
            specularColor    : [122, 122, 122],
            shininess        : 10,
            attenuatuion     : [1.0, 0, 0.02]
        });
    }

}