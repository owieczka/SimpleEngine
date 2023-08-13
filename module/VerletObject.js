import { glMatrix, vec2 } from '../lib/glmatrix/dist/esm/index.js';

class VerletObject {
  constructor(pos,r) {
    if(pos == undefined) {
      pos = vec2.fromValues(0.0,0.0);
    }
    if(r == undefined) {
      r = 10.0;
    }
    this.positionCurrent = vec2.clone(pos);
    this.positionOld = vec2.clone(pos);
    this.velocity = vec2.fromValues(0.0,0.0);
    this.acceleration = vec2.fromValues(0.0,0.0);
    this.radius = r;
  }

  updatePosition(dt) {
    vec2.subtract(this.velocity,this.positionCurrent,this.positionOld);
    // Save current position
    vec2.copy(this.positionOld,this.positionCurrent);
    // Perform Verlet integration
    //positionCurrent + velocity + this.acceleration * dt * dt;
    vec2.add(this.positionCurrent,this.positionCurrent,this.velocity);
    vec2.scaleAndAdd(this.positionCurrent,this.positionCurrent,this.acceleration,dt*dt);
    //Reset acceleration
    vec2.zero(this.acceleration);
  }

  accelerate(acc) {
    vec2.add(this.acceleration,this.acceleration,acc);
  }
}

export {VerletObject};