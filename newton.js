(function() {
  var tickDuration = 0.03;

  function Body(position, radius) {
    this.position = position
    this.radius = radius;
    this.force = new Vector3(0, 0, 0);
    this.velocity = new Vector3(0, 0, 0);
  }

  function Newton() {
    this.bodies = [];
    this.count = 0;
  }

  Newton.prototype = {
    create: function(position, radius) {
      this.bodies.push(new Body(position, radius));
      return this.bodies.length-1;
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
      var entityA, entityB, difference;

      for(var i=0; i<this.bodies.length; ++i) {
        entityA = this.bodies[i];
        for(var n=i+1; n<this.bodies.length; ++n) {
          entityB = this.bodies[n];
          difference = Vector3.subtract(entityA.position, entityB.position);
          if(difference.calcSquaredLength() < entityA.radius + entityB.radius) {
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
