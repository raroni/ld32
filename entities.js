(function() {
  var nextID = 0;
  var entities = [];
  var newton;

  function init(aNewton) {
    newton = aNewton;
  }

  function create() {
    var entity = {
      id: nextID++
    };
    return entity;
  }

  function createProjectile(position, force) {
    var entity = create();
    entity.mesh = Rendering.create('projectile', 'projectile');

    entity.body = newton.createBody(position);
    newton.createSphereCollider(entity.body, Config.projectileRadius);
    var body = newton.getBody(entity.body);
    body.position.set(position);
    body.force.set(force);

    entity.interpolation = Interpolation.create(entity.body);
    entity.renderFeed = RenderFeed.create(entity.interpolation, entity.mesh);
    entity.gravity = Gravity.create(entity.body);

    entity.projectile = Bullets.create();
  }

  window.Entities = {
    init: init,
    create: create,
    createProjectile: createProjectile
  };
})();
