import { vec3, mat4 } from '../../lib/gl-matrix-module.js';

import { Utils } from './Utils.js';
import { Node } from './Node.js';

export class Player extends Node {

    constructor(mesh, image, options) {
        super(options);
        Utils.init(this, this.constructor.defaults, options);
        this.mesh = mesh;
        this.image = image;

        this.keydownHandler = this.keydownHandler.bind(this);
        this.keyupHandler = this.keyupHandler.bind(this);
        this.keys = {};
    }

    update(dt) {
        const c = this;

        const forward = vec3.set(vec3.create(),
            -Math.sin(c.rotation[1]), 0, -Math.cos(c.rotation[1]));
        const right = vec3.set(vec3.create(),
            Math.cos(c.rotation[1]), 0, -Math.sin(c.rotation[1]));

        // 1: add movement acceleration
        let acc = vec3.create();
        if (this.keys['KeyW']) {
            vec3.add(acc, acc, forward);
        }
        if (this.keys['KeyS']) {
            vec3.add(acc, acc, forward);
        }
        if (this.keys['KeyD']) {
            vec3.add(acc, acc, forward);
        }
        if (this.keys['KeyA']) {
            vec3.add(acc, acc, forward);
        }

        // 2: update velocity
        vec3.scaleAndAdd(c.velocity, c.velocity, acc, dt * c.acceleration);

        // 3: if no movement, apply friction
        if (!this.keys['KeyW'] &&
            !this.keys['KeyS'] &&
            !this.keys['KeyD'] &&
            !this.keys['KeyA'])
        {
            vec3.scale(c.velocity, c.velocity, 1 - c.friction);
        }

        // 4: limit speed
        const len = vec3.len(c.velocity);
        if (len > c.maxSpeed) {
            vec3.scale(c.velocity, c.velocity, c.maxSpeed / len);
        }

        // 5: rotation
        let angle360 = 2*Math.PI;
        if (this.keys['KeyW'] && this.keys['KeyA']) {
            c.rotation[1] = angle360 / 8;
        }
        else if (this.keys['KeyW'] && this.keys['KeyD']) {
            c.rotation[1] = -angle360 / 8;
        }
        else if (this.keys['KeyS'] && this.keys['KeyA']) {
            c.rotation[1] = angle360 / 4 + angle360 / 8;
        }
        else if (this.keys['KeyS'] && this.keys['KeyD']) {
            c.rotation[1] = -angle360 / 4 - angle360 / 8;
        }
        else if (this.keys['KeyW']) {
            c.rotation[1] = angle360;
        }
        else if (this.keys['KeyA']) {
            c.rotation[1] = angle360 / 4;
        }
        else if (this.keys['KeyS']) {
            c.rotation[1] = angle360 / 2;
        }
        else if (this.keys['KeyD']) {
            c.rotation[1] = -angle360 / 4;
        }
    }

    enable() {
        document.addEventListener('keydown', this.keydownHandler);
        document.addEventListener('keyup', this.keyupHandler);
    }

    disable() {
        document.removeEventListener('keydown', this.keydownHandler);
        document.removeEventListener('keyup', this.keyupHandler);

        for (let key in this.keys) {
            this.keys[key] = false;
        }
    }

    keydownHandler(e) {
        this.keys[e.code] = true;
    }

    keyupHandler(e) {
        this.keys[e.code] = false;
    }

}

Player.defaults = {
    aspect           : 1,
    fov              : 1.5,
    near             : 0.01,
    far              : 100,
    velocity         : [0, 0, 0],
    mouseSensitivity : 0.002,
    maxSpeed         : 3,
    friction         : 0.8,
    acceleration     : 20
};
