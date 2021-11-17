import { Node } from './Node.js';

export class Model extends Node { // TODO Model je dejansko Node

    constructor(mesh, image, options) { // TODO ima svoj mash in tudi teksturo
        super(options);
        this.mesh = mesh;
        this.image = image;
    }

}
