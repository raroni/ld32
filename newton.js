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
    createBoxCollider: function(body, dimensions) {
      this.boxColliders.push({
        bodyHandle: body,
        dimensions: dimensions
      });
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
      var set = {};
      set.staticDynamicCollisions = [];
      var sphereColliderA, sphereColliderB, difference, bodyA, bodyB, radiiSum;

      for(var i=0; i<this.sphereColliders.length; ++i) {
        sphereColliderA = this.sphereColliders[i];
        bodyA = this.bodies[sphereColliderA.bodyHandle];
        for(var n=i+1; n<this.sphereColliders.length; ++n) {
          sphereColliderB = this.sphereColliders[n];
          bodyB = this.bodies[sphereColliderB.bodyHandle];
          difference = Vector3.subtract(bodyA.position, bodyB.position);
          radiiSum = sphereColliderA.radius + sphereColliderB.radius;
          if(difference.calcSquaredLength() < Math.pow(radiiSum, 2)) {
            console.log('collision!');
          }
        }
      }

      var boxCollider, boxBody, sphereBody, sphereCollider, relativeSphereColliderPosition, distance, halfDimensions, squaredDistance;
      var separationDifference, separation, overlap;
      var closestPoint = new Vector3(0, 0, 0);
      for(var i=0; i<this.boxColliders.length; ++i) {
        boxCollider = this.boxColliders[i];
        boxBody = this.bodies[boxCollider.bodyHandle];
        for(var n=0; n<this.sphereColliders.length; ++n) {
          sphereCollider = this.sphereColliders[n];
          sphereBody = this.bodies[sphereCollider.bodyHandle];
          relativeSphereColliderPosition = Vector3.subtract(sphereBody.position, boxBody.position);
          closestPoint.reset();
          halfDimensions = Vector3.multiply(boxCollider.dimensions, 0.5);

          distance = relativeSphereColliderPosition.x;
          if(distance > halfDimensions.x) distance = halfDimensions.x;
          if(distance < -halfDimensions.x) distance = -halfDimensions.x;
          closestPoint.x = distance;

          distance = relativeSphereColliderPosition.y;
          if(distance > halfDimensions.y) distance = halfDimensions.y;
          if(distance < -halfDimensions.y) distance = -halfDimensions.y;
          closestPoint.y = distance;

          distance = relativeSphereColliderPosition.z;
          if(distance > halfDimensions.z) distance = halfDimensions.z;
          if(distance < -halfDimensions.z) distance = -halfDimensions.z;
          closestPoint.z = distance;

          separationDifference = Vector3.subtract(relativeSphereColliderPosition, closestPoint);
          squaredDistance = separationDifference.calcSquaredLength();
          if(squaredDistance < Math.pow(sphereCollider.radius, 2)) {
            distance = Math.sqrt(squaredDistance);
            separation = Vector3.divide(separationDifference, distance);
            overlap = sphereCollider.radius-distance;
            separation.multiply(overlap);
            set.staticDynamicCollisions.push({
              staticBody: boxBody,
              dynamicBody: sphereBody,
              separation: separation
            });
          }
        }
      }

      return set;
    },
    resolveCollisions: function(set) {
      var collision;
      for(var i=0; i<set.staticDynamicCollisions.length; ++i) {
        collision = set.staticDynamicCollisions[i];
        collision.dynamicBody.position.add(collision.separation);
      }
    },
    tick: function() {
      this.integrate();
      var collisionSet = this.findCollisions();
      this.resolveCollisions(collisionSet);
    }
  };

  Newton.tickDuration = tickDuration;

  window.Newton = Newton;
})();
