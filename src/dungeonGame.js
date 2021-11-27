import { GUI } from '../../lib/dat.gui.module.js';

import { Application } from '../../common/engine/Application.js';

import { Renderer } from './Renderer.js';
import { Physics } from './Physics.js';
import { Camera } from './Camera.js';
import { Player } from './Player.js';
import { SceneLoader } from './SceneLoader.js';
import { SceneBuilder } from './SceneBuilder.js';
import { Enemy } from './Enemy.js';
import { Projectile } from './Projectile.js';
import { ExitGate } from './ExitGate.js';
import { Chest } from './Chest.js';
import { Light } from './Light.js';

class App extends Application { // glavna datoteka

    start() {
        const gl = this.gl;

        this.renderer = new Renderer(gl); // zgradimo nov Renderer
        this.time = Date.now();
        this.startTime = this.time;
        this.aspect = 1;
        this.enemies = [];
        this.light = new Light();
        this.pointerlockchangeHandler = this.pointerlockchangeHandler.bind(this);
        document.addEventListener('pointerlockchange', this.pointerlockchangeHandler);

        this.load('scene.json'); // naloadamo sceno

        document.getElementById("dungeonAmbience").play();
    }

    async load(uri) {
        this.sceneBlueprint = await new SceneLoader().loadScene(uri); // zazenemo scene loader
        this.builder = new SceneBuilder(this.sceneBlueprint); // zgradi se scena
        this.scene = this.builder.build();
        this.physics = new Physics(this.scene); // naredimo fiziko

        // Find first camera.
        this.camera = null;
        this.scene.traverse(node => { // poiscemo kamero
            if (node instanceof Camera) {
                this.camera = node;
            }
            else if (node instanceof Player) {
                this.player = node;
                this.player.enable();
            }
            else if(node instanceof Enemy) {
                this.enemies.push(node);
            }
            else if (node instanceof ExitGate) {
                this.exitGate = node;
            }
            else if (node instanceof Chest) {
                this.chest = node;
            }
            else if (node instanceof Projectile) {
                this.projectile = node;
            }
        });

        this.camera.aspect = this.aspect;
        this.camera.updateProjection();
        this.renderer.prepare(this.scene);
    }

    enableCamera() { // TODO delete this pa use te pointerLock... , GUI (ker ne rabis)
        this.canvas.requestPointerLock();
    }

    pointerlockchangeHandler() {
        if (!this.camera) {
            return;
        }

        if (document.pointerLockElement === this.canvas) {
            this.player.enable();
        } else {
            this.player.disable();
        }
    }

    update() {
        const t = this.time = Date.now();
        const dt = (this.time - this.startTime) * 0.001;
        this.startTime = this.time;

        if (this.camera) {
            this.camera.update(this.player.translation);
        }
        if (this.player) {
            if(this.player.lifePoints === 0)
            {
                this.gameOver();
            }
            else
            {
                this.player.update(dt, this);
            }
        }
        if (this.exitGate) {
            this.exitGate.update(this.player);
        }
        if (this.chest) {
            this.chest.update(this.player);
        }
        if (this.physics) {
            this.physics.update(dt);
        }

        if (this.enemies) {
            this.enemies.forEach(enemy => {
                if (enemy.lifePoints > 0)
                {
                    enemy.update(dt, this.player);
                }
                else
                {
                    this.enemies.splice(this.enemies.indexOf(enemy), 1);
                    this.scene.nodes.forEach(node => {
                        if (node instanceof Enemy &&
                            node.translation === enemy.translation)
                        {
                            this.scene.nodes.splice(this.scene.nodes.indexOf(node), 1);
                        }
                    });
                    document.getElementById("ceedayScream").play();
                }
            });
        }

        if (this.projectile)
        {
           this.projectile.update(dt, this);
        }
    }

    gameOver()
    {
        // TODO
        //alert("GAME OVER");
        document.getElementById("dungeonAmbience").pause();
        //document.getElementById("death").play();
        window.location.href = "deathScreen.html";

    }

    render() {
        if (this.scene) {
            this.renderer.render(this.scene, this.camera, this.light);
        }
    }

    resize() {
        const w = this.canvas.clientWidth;
        const h = this.canvas.clientHeight;
        this.aspect = w / h;
        if (this.camera) {
            this.camera.aspect = this.aspect;
            this.camera.updateProjection();
        }
    }

}

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.querySelector('canvas');
    const app = new App(canvas); // TODO pobrisi gui ker ga ne rabis
    const gui = new GUI();
    gui.addColor(app.light, 'ambientColor');
    gui.addColor(app.light, 'diffuseColor');
    gui.addColor(app.light, 'specularColor');
    gui.add(app.light, 'shininess', 0.0, 20.0);
    for (let i = 0; i < 3; i++) {
        gui.add(app.light.position, i, -10.0, 10.0).name('position.' + String.fromCharCode('x'.charCodeAt(0) + i));
    }
    for (let i = 0; i < 3; i++) {
        gui.add(app.light.attenuatuion, i, 0.0, 1.0).name('attenuation.' + String.fromCharCode('x'.charCodeAt(0) + i));
    }
    gui.add(app, 'enableCamera');
});
