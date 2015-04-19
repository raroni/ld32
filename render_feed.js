(function() {
  var components = new ComponentList();

  function create(interpolationHandle, meshHandle) {
    return components.add({
      interpolationHandle: interpolationHandle,
      meshHandle: meshHandle
    })
  }

  function update() {
    components.forEach(function(component) {
      mesh = Rendering.get(component.meshHandle).mesh;
      interpolation = Interpolation.get(component.interpolationHandle);
      mesh.position.x = interpolation.currentPosition.x;
      mesh.position.y = interpolation.currentPosition.y;
      mesh.position.z = interpolation.currentPosition.z;
    });
  }

  function remove(handle) {
    components.remove(handle);
  }

  window.RenderFeed = {
    create: create,
    update: update,
    remove: remove
  };
})();
