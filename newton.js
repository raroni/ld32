(function() {
  var tickDuration = 0.03;

  function Body(position) {
    this.position = position
    this.force = new Vector3(0, 0, 0);
    this.velocity = new Vector3(0, 0, 0);
  }

  function Newton() {
    this.bodies = [];
    this.sphereColliders = [];
    this.boxColliders = [];
    this.count = 0;
  }

  Newton.prototype = {
    createBody: function(position) {
      this.bodies.push(new Body(position));
      return this.bodies.length-1;
    },
    createSphereCollider: function(body, radius) {
      this.sphereColliders.push({
        bodyHandle: body,
        radius: radius
      })
    },
    integrate: function() {
      var halfDuration = tickDuration/2;
      var halfVelocityChange, entity;
      for(var i=0; i<this.bodies.length; ++i) {
        entity = this.bodies[i];
        halfVelocityChange = Vector3.multiply(entity.force, halfDuration);
        entity.velocity.add(halfVelocityChange);
        entity.position.add(entity.velocity);
        entity.velocity.add(halfVelocityChange);
        entity.force.reset();
      }
    },
    getBody: function(id) {
      return this.bodies[id];
    },
    findCollisions: function() {
      var sphereColliderA, sphereColliderB, difference, bodyA, bodyB, radiiSum;

      for(var i=0; i<this.sphereColliders.length; ++i) {
        sphereColliderA = this.sphereColliders[i];
        bodyA = this.bodies[sphereColliderA.bodyHandle];
        for(var n=i+1; n<this.bodies.length; ++n) {
          sphereColliderB = this.sphereColliders[n];
          bodyB = this.bodies[sphereColliderB.bodyHandle];
          difference = Vector3.subtract(bodyA.position, bodyB.position);
          radiiSum = sphereColliderA.radius + sphereColliderB.radius;
          if(difference.calcSquaredLength() < Math.pow(radiiSum, 2)) {
            console.log('collision!');
          }
        }
      }
    },
    tick: function() {
      this.integrate();
      this.findCollisions();
    }
  };

  Newton.tickDuration = tickDuration;

  window.Newton = Newton;
})();
