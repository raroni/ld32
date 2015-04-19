(function() {
  var tickDuration = 0.03;

  function Body(handle, position) {
    this.handle = handle;
    this.position = position
    this.force = new Vector3(0, 0, 0);
    this.velocity = new Vector3(0, 0, 0);
  }

  function Newton() {
    this.bodies = [];
    this.sphereColliders = [];
    this.boxColliders = [];
    this.count = 0;
    this.freelists = {
      body: [],
      sphereCollider: []
    };
  }

  Newton.prototype = {
    createBody: function(position) {
      var handle = this.freelists.body.pop() || this.bodies.length;
      this.bodies.push(new Body(handle, position));
      return handle;
    },
    createSphereCollider: function(body, radius) {
      var handle = this.freelists.sphereCollider.pop() || this.sphereColliders.length;
      this.sphereColliders.push({
        handle: handle,
        bodyHandle: body,
        radius: radius
      });
      return handle;
    },
    createBoxCollider: function(body, dimensions) {
      this.boxColliders.push({
        bodyHandle: body,
        dimensions: dimensions
      });
    },
    removeBody: function(handle) {
      for(var i=0; i<bodies.length; ++i) {
        if(bodies[i].handle == handle) {
          bodies.splice(i, 1);
          freelists.body.push(handle);
          return;
        }
      }
      throw new Error("Could not remove body.");
    },
    removeSphereCollider: function(handle) {
      for(var i=0; i<this.sphereColliders.length; ++i) {
        if(this.sphereColliders[i].handle == handle) {
          this.sphereColliders.splice(i, 1);
          this.freelists.sphereCollider.push(handle);
          return;
        }
      }
      throw new Error("Could not remove sphere colliders.");
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
    findCollisions: function(events) {
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
            events.push([sphereColliderA.bodyHandle, sphereColliderB.bodyHandle]);
            events.push([sphereColliderB.bodyHandle, sphereColliderA.bodyHandle]);
          }
        }
      }

      var boxCollider, boxBody, sphereBody, sphereCollider, relativeSphereColliderPosition, distance, halfDimensions, squaredDistance;
      var separationDifference, separation, overlap;
      var temp, smallestAxis, axisValue;
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
            if(squaredDistance == 0) {
              axisValue = halfDimensions.x-Math.abs(closestPoint.x);
              smallestAxis = 'x';
              temp = halfDimensions.y-Math.abs(closestPoint.y);
              if(temp < axisValue) {
                smallestAxis = 'y';
                axisValue = temp;
              }
              temp = halfDimensions.z-Math.abs(closestPoint.z);
              if(temp < axisValue) {
                smallestAxis = 'z';
                axisValue = temp;
              }
              closestPoint[smallestAxis] = halfDimensions[smallestAxis] * (Math.abs(closestPoint[smallestAxis])/closestPoint[smallestAxis]);

              separationDifference = Vector3.subtract(closestPoint, relativeSphereColliderPosition);
              separation = Vector3.normalize(separationDifference);
              separation.multiply(separationDifference.calcLength()+sphereCollider.radius);
            } else {
              distance = Math.sqrt(squaredDistance);
              separation = Vector3.divide(separationDifference, distance);
              overlap = sphereCollider.radius-distance;
              separation.multiply(overlap);
            }

            set.staticDynamicCollisions.push({
              staticBody: boxBody,
              dynamicBody: sphereBody,
              separation: separation
            });
            events.push([boxCollider.bodyHandle, boxCollider.bodyHandle]);
            events.push([sphereCollider.bodyHandle, boxCollider.bodyHandle]);
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
    tick: function(events) {
      this.integrate();
      var collisionSet = this.findCollisions(events);
      this.resolveCollisions(collisionSet);
    }
  };

  Newton.tickDuration = tickDuration;

  window.Newton = Newton;
})();
