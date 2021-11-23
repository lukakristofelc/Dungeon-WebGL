import { vec3, mat4 } from '../../lib/gl-matrix-module.js';

import { Utils } from './Utils.js';
import { Node } from './Node.js';

export class Light extends Node {

    constructor() {
        super();

        Object.assign(this, {
            position         : [0, 1, 0],
            ambient          : 0.2,
            diffuse          : 0.8,
            specular         : 1,
            shininess        : 10,
            color            : [255, 255, 255],
            attenuatuion     : [1.0, 0, 0.02]
        });

        this.basePosition = [...this.position];
    }

    update(playerTrans) {
        vec3.add(this.position, this.basePosition, playerTrans);
    }

}