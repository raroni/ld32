(function() {
  var components = [];
  var interval = 100;

  function update(timeDelta) {
    var component;
    for(var i=0; i<components.length; ++i) {
      component = components[i];
      if(component.cooldown <= 0) {
        if(components[i].active) {
          shoot(component.entity);
          component.cooldown += interval-timeDelta;
        }
      } else {
        component.cooldown -= timeDelta;
      }
    }
  }

  function shoot(entity) {
    var rotation = entity.rotation;
    var direction = new Vector3(
      Math.sin(rotation.y)*Math.cos(rotation.x)*-1,
      Math.sin(rotation.x),
      Math.cos(rotation.y)*Math.cos(rotation.x)*-1
    );

    var position = Vector3.add(entity.getPosition(), direction);
    position.y -= 2;
    var force = Vector3.multiply(direction, 30);

    Entities.createProjectile(position, force);
  }

  function create(entity) {
    components.push({
      active: false,
      cooldown: 0,
      entity: entity
    });
    return components.length-1;
  }

  function activate(id) {
    components[id].active = true;
  }

  function deactivate(id) {
    components[id].active = false;
  }

  window.Shooting = {
    update: update,
    activate: activate,
    create: create,
    deactivate: deactivate
  };
})();
