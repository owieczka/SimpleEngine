
import { VerletObject } from './VerletObject.js';
import { glMatrix, vec2 } from '../lib/glmatrix/dist/esm/index.js';

class Sim {

  gravity = vec2.fromValues(0,0.001);
  position = vec2.fromValues(200.0,200.0);
  radius = 150.0;
  subSteps = 8;
  stepLength = 4.0;
  eps = 0.000001;

  constructor() {
    this.objects = [];
  }

  update(dt) {
    if(dt<this.eps) return;
    this.subSteps = Math.ceil(dt / this.stepLength);
    console.log(`Steps ${this.subSteps}`);
    //*
    const subdt = dt / this.subSteps;
    for(let i=this.subSteps;i>0;i--) {
      this.applyGravity();
      this.applyConstraint();
      this.checkCollision();
      this.updatePosition(subdt);
    }//*/
  }

  updatePosition(dt) {
    for(const obj of this.objects) {
      obj.updatePosition(dt);
    }
  }

  applyGravity() {
    for(const obj of this.objects) {
      obj.accelerate(this.gravity);
    }
  }

  applyConstraint() {
    for(const obj of this.objects) {
      let toObj = vec2.create();
      vec2.subtract(toObj,obj.positionCurrent,this.position);
      const dist = vec2.length(toObj);
      //const dist2 = vec2.squaredLength(toObj);
      const minDist = this.radius - obj.radius
      if( dist > minDist) {
        //vec2.scale(toObj,toObj,1.0/dist);
        //vec2.scaleAndAdd(obj.positionCurrent,this.position,toObj,minDist);
        //const dist = Math.sqrt(dist2);
        vec2.scaleAndAdd(obj.positionCurrent,this.position,toObj,minDist/dist);
      }
    }
  }

  checkCollision() {
    const objectCount =  this.objects.length;
    let collisionAxis = vec2.create();
    for(let i1=0;i1<objectCount;i1++) {
      const obj1 = this.objects[i1];
      for(let i2=i1+1;i2<objectCount;i2++) {
        const obj2 = this.objects[i2];

        vec2.subtract(collisionAxis,obj1.positionCurrent, obj2.positionCurrent);
        const dist2 = vec2.squaredLength(collisionAxis);
        const minDist = obj1.radius + obj2.radius;
        if(dist2 < minDist * minDist) {
          const dist = Math.sqrt(dist2);
          //vec2.scale(collisionAxis,collisionAxis,1.0/dist);
          //let delta = 0.5*(minDist - dist);
          let delta = 0.5*(minDist - dist)/dist;
          //vec2.scaleAndAdd(obj1.positionCurrent,obj1.positionCurrent,collisionAxis,+delta);
          //vec2.scaleAndAdd(obj2.positionCurrent,obj2.positionCurrent,collisionAxis,-delta);

          const massRatio1 = obj1.radius / (obj1.radius + obj2.radius);
          const massRatio2 = obj2.radius / (obj1.radius + obj2.radius);

          vec2.scaleAndAdd(obj1.positionCurrent,obj1.positionCurrent,collisionAxis,+massRatio2*delta);
          vec2.scaleAndAdd(obj2.positionCurrent,obj2.positionCurrent,collisionAxis,-massRatio1*delta);
        }
      }
    }
  }
}

export {Sim};