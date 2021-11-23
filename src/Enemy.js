import { vec3, mat4 } from '../../lib/gl-matrix-module.js';

import { Utils } from './Utils.js';
import { Node } from './Node.js';

export class Enemy extends Node {

    constructor(mesh, image, options) {
        super(options);
        Utils.init(this, this.constructor.defaults, options);
        this.mesh = mesh;
        this.image = image;
        this.forwardReference = vec3.set(vec3.create(), -Math.sin(this.rotation[1]), 0, -Math.cos(this.rotation[1]));
        this.lifePoints = 100;
    }


    update(dt, player) {

        let movementVector = vec3.create();
        movementVector[0] = -this.translation[0] + player.translation[0];
        movementVector[1] = -this.translation[1] + player.translation[1];
        movementVector[2] = -this.translation[2] + player.translation[2];
        
        if (vec3.distance(this.translation, player.translation) < 2.5)
        {
            this.attackPlayer(player, movementVector, dt);
        }
        else
        {
            if (vec3.distance(this.translation, player.translation) < 10)
            {
                const c = this;

                // 1: add movement acceleration
                let acc = vec3.create();
                vec3.add(acc, acc, movementVector);
                
                // 2: update velocity
                vec3.scaleAndAdd(c.velocity, c.velocity, acc, dt * c.acceleration);

                const len = vec3.len(c.velocity);
                if (len > c.maxSpeed) {
                    vec3.scale(c.velocity, c.velocity, c.maxSpeed / len);
                }
                
                // 3: rotation
                if (movementVector[0] < 0)
                {
                    c.rotation[1] = vec3.angle(this.forwardReference, movementVector);
                }
                else
                {
                    c.rotation[1] = -vec3.angle(this.forwardReference, movementVector);
                } 
            }
                           
        }
    }

    attackPlayer(player, movementVector, dt)
    {
        movementVector[0] = movementVector[0] * -1;
        movementVector[2] = movementVector[2] * -1;

        let acc = vec3.create();

        vec3.add(acc, acc, movementVector);
        vec3.scaleAndAdd(this.velocity, this.velocity, acc, dt * 5);

        movementVector[0] = movementVector[0] * -1;
        movementVector[2] = movementVector[2] * -1;

        vec3.add(acc, acc, movementVector);
        vec3.scaleAndAdd(this.velocity, this.velocity, acc, dt * 5);

        if (player.lifePoints > 0)
        {
            player.lifePoints -= 0.5;
            document.getElementById("punch").play();
        }
    }
}

Enemy.defaults = {
    aspect           : 1,
    fov              : 1.5,
    near             : 0.01,
    far              : 100,
    velocity         : [0, 0, 0],
    mouseSensitivity : 0.002,
    maxSpeed         : 2,
    friction         : 0.8,
    acceleration     : 20
};
