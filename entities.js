(function() {
  var entities = [];
  var newton;

  function init(aNewton) {
    newton = aNewton;
  }

  function create() {
    var entity = {
      handle: entities.length
    };
    entities.push(entity);
    return entity;
  }

  function get(handle) {
    return entities[handle];
  }

  function createProjectile(position, force) {
    var entity = create();
    entity.mesh = Rendering.create('bullet', 'bullet', { castShadow: true });

    entity.body = newton.createBody(position);
    entity.sphereCollider = newton.createSphereCollider(entity.body, Config.bulletRadius);
    var body = newton.getBody(entity.body);
    body.position.set(position);
    body.force.set(force);

    entity.interpolation = Interpolation.create(entity.body);
    entity.renderFeed = RenderFeed.create(entity.interpolation, entity.mesh);
    entity.gravity = Gravity.create(entity.body);

    entity.bullet = Bullets.create(entity.handle, entity.body);
  }

  function createExplosion(position) {
    var explosion = create();

    explosion.mesh = Rendering.create('explosion', 'explosion0');
    var mesh = Rendering.get(explosion.mesh).mesh;
    mesh.position.set(
      position.x,
      position.y,
      position.z
    );

    explosion.explosion = Explosions.create(explosion.handle);

    return explosion.handle;
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

  function removeBullet(entityHandle) {
    var entity = get(entityHandle);
    Bullets.remove(entity.bullet);
    delete entity.bullet;
  }

  function remove(handle) {
    var entity = get(handle);
    var value;
    for(var key in entity) {
      value = entity[key];
      if(key === "handle") continue;
      switch(key) {
        case "handle":
          break;
        case "mesh":
          Rendering.remove(value);
          break;
        case "body":
          newton.removeBody(value);
          break;
        case "interpolation":
          Interpolation.remove(value);
          break;
        case "renderFeed":
          RenderFeed.remove(value);
          break;
        case "bullet":
          Bullets.remove(value);
          break;
        case "explosion":
          Explosions.remove(value);
          break;
        default:
          throw new Error("Could not clean up for '" + key + "' component.");
          break;
      }
    }
  }

  function removeBody(entityHandle) {
    var entity = get(entityHandle);
    newton.removeBody(entity.body);
    delete entity.body;
  }

  window.Entities = {
    init: init,
    remove: remove,
    create: create,
    createProjectile: createProjectile,
    createExplosion: createExplosion,
    get: get,
    removeGravity: removeGravity,
    removeSphereCollider: removeSphereCollider,
    removeBody: removeBody,
    removeBullet: removeBullet
  };
})();
