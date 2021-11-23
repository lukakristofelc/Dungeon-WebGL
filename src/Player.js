import { vec3, mat4 } from '../../lib/gl-matrix-module.js';

import { Utils } from './Utils.js';
import { Node } from './Node.js';
import { Mesh } from './Mesh.js';
import { Projectile } from './Projectile.js';

export class Player extends Node {

    constructor(mesh, image, options) {
        super(options);
        Utils.init(this, this.constructor.defaults, options);
        this.mesh = mesh;
        this.image = image;
        this.lifePoints = 100;

        this.previousProjectileTime = Date.now();

        this.keydownHandler = this.keydownHandler.bind(this);
        this.keyupHandler = this.keyupHandler.bind(this);
        this.keyPressHandler = this.keyPressHandler.bind(this);
        this.keys = {};
        this.projectile = 
        {
            "type": "projectile",
            "mesh": 4,
            "texture": 5,
            "aabb": {
              "min": [-2, -2, -2],
              "max": [-2, -2, -2]
            },
            "translation": [0, 0, 0],
            "scale": [1, 1, 1]
        };
    }

    update(dt, scene) {
        const c = this;

        // health hud
        let hpHUD = document.getElementById("hpHUD");
        hpHUD.innerText = "HP: " + c.lifePoints;
        // health hud end

        // mana hud
        let manaHUD = document.getElementById("manaHUD");
        let manaFullness = (Date.now() - c.previousProjectileTime) * 0.1;
        if (manaFullness > 100) {
            manaFullness = 100;
        }
        manaHUD.innerText = "MP: " + Math.round(manaFullness);
        // mana hud end

        this.scene = scene;
        this.forward = vec3.set(vec3.create(), -Math.sin(c.rotation[1]), 0, -Math.cos(c.rotation[1]));

        // 1: add movement acceleration
        let acc = vec3.create();
        if (this.keys['KeyW']) {
            vec3.add(acc, acc, this.forward);
        }
        if (this.keys['KeyS']) {
            vec3.add(acc, acc, this.forward);
        }
        if (this.keys['KeyD']) {
            vec3.add(acc, acc, this.forward);
        }
        if (this.keys['KeyA']) {
            vec3.add(acc, acc, this.forward);
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
        document.addEventListener('keypress', this.keyPressHandler);
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

    keyPressHandler(e)
    {
        if (e.code === 'Space')
        {
            const curTime = Date.now();
            if (curTime - this.previousProjectileTime >= 1000) { // Dodan cooldown 1 sekunda
                // console.log(curTime - this.previousProjectileTime);
                this.previousProjectileTime = curTime;
                this.shootProjectile();
            }
        }
    }

    shootProjectile()
    {
        let movementVector = vec3.create();
        vec3.copy(movementVector, this.forward);
        const mesh = new Mesh(this.mesh);
        const texture = this.image;

        let projectileTranslation = vec3.create();
        vec3.copy(projectileTranslation, this.translation);

        movementVector[0] *= 1.5;
        movementVector[1] *= 1.5;
        movementVector[2] *= 1.5;

        vec3.add(projectileTranslation, projectileTranslation, movementVector);
        this.projectile["translation"] = projectileTranslation;

        let projectile = this.scene.builder.createProjectile(this.projectile, movementVector);//new Projectile(mesh, texture, this.projectile, movementVector);
        this.scene.projectiles.push(projectile);
        this.scene.scene.addNode(projectile);
        this.scene.renderer.prepare(this.scene.scene);
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
