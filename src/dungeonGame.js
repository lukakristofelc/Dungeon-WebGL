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

class App extends Application { // glavna datoteka

    start() {
        const gl = this.gl;

        this.renderer = new Renderer(gl); // zgradimo nov Renderer
        this.time = Date.now();
        this.startTime = this.time;
        this.aspect = 1;
        this.enemies = [];
        this.projectiles = [];
        this.pointerlockchangeHandler = this.pointerlockchangeHandler.bind(this);
        document.addEventListener('pointerlockchange', this.pointerlockchangeHandler);

        this.load('scene.json'); // naloadamo sceno
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
                }
            });
        }

        if (this.projectiles)
        {
            this.projectiles.forEach(projectile => {
                if (!projectile.enabled)
                {
                    this.projectiles.splice(this.projectiles.indexOf(projectile), 1)
                    this.scene.nodes.forEach(node => {
                        if (node instanceof Projectile &&
                            node.translation === projectile.translation)
                        {
                            this.scene.nodes.splice(this.scene.nodes.indexOf(node), 1);
                        }
                    });
                }
                projectile.update(dt, this);
            });
        }
    }

    gameOver()
    {
        // TODO
        alert("GAME OVER");
    }

    render() {
        if (this.scene) {
            this.renderer.render(this.scene, this.camera);
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
    gui.add(app, 'enableCamera');
});
