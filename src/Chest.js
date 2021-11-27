import { vec3, mat4 } from '../../lib/gl-matrix-module.js';

import { Utils } from './Utils.js';
import { Node } from './Node.js';

export class Chest extends Node {

    constructor(mesh, image, options) {
        super(options);
        Utils.init(this, this.constructor.defaults, options);
        this.mesh = mesh;
        this.image = image;
        this.htmlNapis = document.getElementById("openChest");
        document.getElementById("openChest").display = "none";
    }


    update(player) {

        if (vec3.distance(this.translation, player.translation) < 2.5) {
            // show press E to win
            this.htmlNapis.style.display = "inline";
            //player.winGame();
            console.log("Chest open");
            player.openChest(this);
        } else {
            // hide press E to win
            this.htmlNapis.style.display = "none";
        }
    }
}

Chest.defaults = {
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
