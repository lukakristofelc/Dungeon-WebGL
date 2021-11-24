import { Mesh } from './Mesh.js';

import { Node } from './Node.js';
import { Model } from './Model.js';
import { Camera } from './Camera.js';
import { Player } from './Player.js';

import { Scene } from './Scene.js';
import { Enemy } from './Enemy.js';
import { Projectile } from './Projectile.js';
import { ExitGate } from './ExitGate.js';

export class SceneBuilder { // iz podatkov iz SceneLoader-ja dejansko zgradi

    constructor(spec) {
        this.spec = spec;
    }

    createNode(spec) {
        switch (spec.type) {
            case 'camera': return new Camera(spec);
            case 'floor':
            case 'model': {
                const mesh = new Mesh(this.spec.meshes[spec.mesh]);
                const texture = this.spec.textures[spec.texture];
                return new Model(mesh, texture, spec);
            }
            case 'player': {
                //console.log("lale");
                const mesh = new Mesh(this.spec.meshes[spec.mesh]);
                const texture = this.spec.textures[spec.texture];
                return new Player(mesh, texture, spec);
            }
            case 'enemy': {
                const mesh = new Mesh(this.spec.meshes[spec.mesh]);
                const texture = this.spec.textures[spec.texture];

                return new Enemy(mesh, texture, spec);
            }
            case 'exitGate': {
                const mesh = new Mesh(this.spec.meshes[spec.mesh]);
                const texture = this.spec.textures[spec.texture];

                return new ExitGate(mesh, texture, spec);
            }
            default: return new Node(spec);
        }
    }
    
    createProjectile(spec, movementVector)
    {
        const mesh = new Mesh(this.spec.meshes[spec.mesh]);
        const texture = this.spec.textures[spec.texture];
        return new Projectile(mesh, texture, spec, movementVector);
    }
    

    build() {
        let scene = new Scene();
        this.spec.nodes.forEach(spec => scene.addNode(this.createNode(spec)));
        return scene;
    }

}
