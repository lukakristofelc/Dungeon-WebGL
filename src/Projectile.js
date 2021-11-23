import { vec3, mat4 } from '../../lib/gl-matrix-module.js';

import { Utils } from './Utils.js';
import { Node } from './Node.js';
import { Player } from './Player.js';

export class Projectile extends Node {

    constructor(mesh, image, options, direction) {
        super(options);
        Utils.init(this, this.constructor.defaults, options);
        this.mesh = mesh;
        this.image = image;
        this.directon = direction;
        this.enabled = true;
        this.destroyAfter(2000);
    }

    update(dt, scene) {
        const c = this;

        scene.enemies.forEach(enemy => {
            if(vec3.dist(this.translation, enemy.translation) < 1 && this.enabled)
            {
                enemy.lifePoints -= 50;
                // console.log(enemy.lifePoints);
                this.enabled = false;
                document.getElementById("fireballHit").play();
            }
        })

        scene.scene.nodes.forEach(node => {
            if(vec3.dist(this.translation, node.translation) < 1 && this.enabled &&
                !node instanceof Player)
            {
                this.enabled = false;
            }
        });

        // 1: add movement acceleration
        let acc = vec3.create();
        vec3.add(acc, acc, this.directon);
    
        // 2: update velocity
        vec3.scaleAndAdd(c.velocity, c.velocity, acc, dt * c.acceleration);

        const len = vec3.len(c.velocity);
        if (len > c.maxSpeed) 
        {
           vec3.scale(c.velocity, c.velocity, c.maxSpeed / len);
        }
    }

    async destroyAfter(seconds)
    {
        await this.sleep(seconds);
        this.enabled = false;
    }

    sleep(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }
}

Projectile.defaults = {
    aspect           : 1,
    fov              : 1.5,
    near             : 0.01,
    far              : 100,
    velocity         : [0, 0, 0],
    mouseSensitivity : 0.002,
    maxSpeed         : 10,
    friction         : 0.8,
    acceleration     : 20
};
