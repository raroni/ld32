(function() {
  var components = new ComponentList();

  function create(entityHandle) {
    return components.add({
      entityHandle: entityHandle,
      progress: 0
    });
  }

  function remove(handle) {
    components.remove(handle);
  }

  function update(timeDelta) {
    var removes = [];
    components.forEach(function(component) {
      var entity = Entities.get(component.entityHandle);
      component.progress += timeDelta*0.002;
      component.progress = Math.min(1, component.progress);
      var scale = 0.25 + component.progress*0.75;
      Rendering.updateScale(entity.mesh, scale);
      var materialName = "explosion" + Math.floor(component.progress*10);
      Rendering.updateMaterial(entity.mesh, materialName);
      if(component.progress == 1) {
        removes.push(component.entityHandle);
      }
    });
    removes.forEach(Entities.remove);
  }

  window.Explosions = {
    create: create,
    update: update,
    remove: remove
  };
})();
