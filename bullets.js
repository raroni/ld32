(function() {
  var components = new ComponentList();
  var cache = {};
  var newton;
  var hiders = [];

  function init(newNewton) {
    newton = newNewton;
  }

  function create(entityHandle, bodyHandle) {
    if(typeof(cache[bodyHandle]) != "undefined") {
      throw new Error("bodyHandle taken" + bodyHandle);
    }
    check();
    cache[bodyHandle] = components.add({
      entityHandle: entityHandle,
      bodyHandle: bodyHandle
    });
    check();
    return cache[bodyHandle];
  }

  function remove(handle) {
    for(var i=0; i<hiders.length; ++i) {
      if(hiders[i].handle === handle) {
        hiders.splice(i, 1);
        break;
      }
    }

    check();
    //components.dump();
    components.remove(handle);
    check();
  }

  function check() {
    for(var key in cache) {
      if(key != components.get(cache[key]).bodyHandle) {
        //components.dump();
        throw new Error("CORRUPTION!");
      }
    }
  }

  function tick(events) {
    var handled = {};
    events.forEach(function(event) {
      var handle = cache[event[0]];
      if(typeof(handle) != "undefined" && !handled[handle]) {
        handled[handle] = true;
        var component = components.get(handle);

        if(event[0] != component.bodyHandle) {
          throw new Error('cache key ' + event[0] + ' was '  + component.bodyHandle + '/' + handle);
        }

        var body = newton.getBody(component.bodyHandle);
        body.velocity.reset();
        Entities.removeGravity(component.entityHandle);
        Entities.removeSphereCollider(component.entityHandle);
        Entities.createExplosion(body.position);
        hiders.push({
          progress: 0,
          handle: handle
        });
      }
    });
  }

  function update(timeDelta) {
    var removes = [];
    var hider, component, entity, mesh, scale;
    for(var i=0; i<hiders.length; ++i) {
      hider = hiders[i];
      hider.progress += timeDelta*0.01;
      hider.progress = Math.min(1, hider.progress);
      component = components.get(hider.handle);
      entity = Entities.get(component.entityHandle);
      Rendering.updateScale(entity.mesh, 1-hider.progress);
      if(hider.progress == 1) {
        removes.push(component.entityHandle);
        hiders.splice(i, 1);
        i--;
      }
    }


    removes.forEach(function(b) {
      entity = Entities.get(b);
      if(typeof(cache[entity.body]) == "undefined") {
        throw new Error("zoomg" + entity.body);
      }
      delete cache[entity.body];
      Entities.removeBullet(b);
      Entities.remove(b);
    });
  }

  window.Bullets = {
    init: init,
    update: update,
    create: create,
    tick: tick,
    remove: remove
  }
})();
