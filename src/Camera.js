import { vec3, mat4 } from '../../lib/gl-matrix-module.js';

import { Utils } from './Utils.js';
import { Node } from './Node.js';

export class Camera extends Node {

    constructor(options) {
        super(options);
        Utils.init(this, this.constructor.defaults, options);

        this.projection = mat4.create();
        this.updateProjection();
        this.baseCameraTranslation = [...this.translation];
    }

    updateProjection() {
        mat4.perspective(this.projection, this.fov, this.aspect, this.near, this.far);
    }

    update(playerTrans) {
        const c = this;
        c.translation[0] = playerTrans[0] + this.baseCameraTranslation[0];
        c.translation[1] = playerTrans[1] + this.baseCameraTranslation[1];
        c.translation[2] = playerTrans[2] + this.baseCameraTranslation[2];
    }
}

Camera.defaults = {
    aspect           : 1,
    fov              : 1.5,
    near             : 0.01,
    far              : 100,
    velocity         : [0, 0, 0],
    mouseSensitivity : 0.002,
    maxSpeed         : 3,
    friction         : 0.2,
    acceleration     : 20
};
