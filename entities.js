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
    entities.push(entity);
    return entity;
  }

  function get(id) {
    return entities[id];
  }

  function createProjectile(position, force) {
    var entity = create();
    entity.mesh = Rendering.create('projectile', 'projectile');

    entity.body = newton.createBody(position);
    entity.sphereCollider = newton.createSphereCollider(entity.body, Config.projectileRadius);
    var body = newton.getBody(entity.body);
    body.position.set(position);
    body.force.set(force);

    entity.interpolation = Interpolation.create(entity.body);
    entity.renderFeed = RenderFeed.create(entity.interpolation, entity.mesh);
    entity.gravity = Gravity.create(entity.body);

    entity.projectile = Bullets.create(entity.id, entity.body);
  }

  function removeGravity(entityHandle) {
    var entity = get(entityHandle);
    Gravity.remove(entity.gravity);
    delete entity.gravity;
  }

  function removeSphereCollider(entityHandle) {
    var entity = get(entityHandle);
    newton.removeSphereCollider(entity.sphereCollider);
    delete entity.sphereCollider;
  }

  function removeBody(entityHandle) {
    var entity = get(entityHandle);
    newton.removeBody(entity.body);
    delete entity.body;
  }

  window.Entities = {
    init: init,
    create: create,
    createProjectile: createProjectile,
    get: get,
    removeGravity: removeGravity,
    removeSphereCollider: removeSphereCollider,
    removeBody: removeBody
  };
})();
