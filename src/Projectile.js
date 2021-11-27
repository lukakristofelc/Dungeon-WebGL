import { vec3, mat4 } from '../../lib/gl-matrix-module.js';

import { Utils } from './Utils.js';
import { Node } from './Node.js';
import { Player } from './Player.js';

export class Projectile extends Node {

    constructor(mesh, image, options) {
        super(options);
        Utils.init(this, this.constructor.defaults, options);
        this.mesh = mesh;
        this.image = image;
        this.direction = vec3.create();
        this.enabled = false;
        this.movingBack = false;
    }

    update(dt, scene) {
        
        if (this.enabled)
        {
            if (!this.movingBack)
            {
                this.moveBackAfter(1000);
                this.movingBack = true;
            }
            const c = this;

            scene.enemies.forEach(enemy => {
                if(vec3.dist(this.translation, enemy.translation) < 2.5)
                {
                    enemy.lifePoints -= 50;
                    this.translation = [0,0,-100]
                    this.velocity = [0,0,0];
                    this.enabled = false;
                    document.getElementById("fireballHit").play();
                }
            })

            // 1: add movement acceleration
            let acc = vec3.create();
            let dir = vec3.copy(vec3.create(), this.direction)
            vec3.add(acc, acc, dir);
        
            // 2: update velocity
            vec3.scaleAndAdd(c.velocity, c.velocity, acc, dt * c.acceleration);

            const len = vec3.len(c.velocity);
            if (len > c.maxSpeed) 
            {
                vec3.scale(c.velocity, c.velocity, c.maxSpeed / len);
            }
        }
    }

    async moveBackAfter(seconds)
    {
        await this.sleep(seconds);

        if (this.enabled)
        {
            this.enabled = false;
            this.translation = [0,0,-100]
            this.velocity = [0,0,0];
        }
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
    maxSpeed         : 30,
    friction         : 0.8,
    acceleration     : 20
};
