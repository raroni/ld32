(function() {
  var tickDuration = 0.03;

  function Body(position) {
    this.position = position
    this.force = new Vector3(0, 0, 0);
    this.velocity = new Vector3(0, 0, 0);
  }

  function Newton() {
    this.bodies = new ComponentList();
    this.sphereColliders = new ComponentList();
    this.boxColliders = [];
    this.count = 0;
    this.freelists = {
      body: [],
      sphereCollider: []
    };
  }

  Newton.prototype = {
    createBody: function(position) {
      return this.bodies.add(new Body(position));
    },
    createSphereCollider: function(body, radius) {
      return this.sphereColliders.add({
        bodyHandle: body,
        radius: radius
      });
    },
    createBoxCollider: function(body, dimensions) {
      this.boxColliders.push({
        bodyHandle: body,
        dimensions: dimensions
      });
    },
    removeBody: function(handle) {
      this.bodies.remove(handle);
    },
    removeSphereCollider: function(handle) {
      this.sphereColliders.remove(handle);
    },
    integrate: function() {
      var halfDuration = tickDuration/2;
      var halfVelocityChange, entity;
      this.bodies.forEach(function(body) {
        halfVelocityChange = Vector3.multiply(body.force, halfDuration);
        body.velocity.add(halfVelocityChange);
        body.position.add(body.velocity);
        body.velocity.add(halfVelocityChange);
        body.force.reset();
      });
    },
    getBody: function(handle) {
      return this.bodies.get(handle);
    },
    findCollisions: function(events) {
      var set = {};
      set.staticDynamicCollisions = [];
      var sphereColliderA, sphereColliderB, difference, bodyA, bodyB, radiiSum;

      var sphereColliders = this.sphereColliders.values;

      for(var i=0; i<sphereColliders.length; ++i) {
        sphereColliderA = sphereColliders[i];
        bodyA = this.bodies.get(sphereColliderA.bodyHandle);
        for(var n=i+1; n<sphereColliders.length; ++n) {
          sphereColliderB = sphereColliders[n];
          bodyB = this.bodies.get(sphereColliderB.bodyHandle);
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
        boxBody = this.bodies.get(boxCollider.bodyHandle);
        this.sphereColliders.forEach(function(sphereCollider) {
          sphereBody = this.bodies.get(sphereCollider.bodyHandle);
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
            events.push([boxCollider.bodyHandle, sphereCollider.bodyHandle]);
            events.push([sphereCollider.bodyHandle, boxCollider.bodyHandle]);
          }
        }.bind(this));
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
