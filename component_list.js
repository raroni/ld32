(function() {
  function ComponentList() {
    this.values = [];
    this.handleFreeList = [];
    this.handles = []; // indices to handles
    this.indices = []; // handles to indices
  }

  ComponentList.prototype = {
    add: function(value) {
      var handle = this.handleFreeList.length != 0 ? this.handleFreeList.pop() : this.values.length;
      this.indices[handle] = this.values.length;
      this.handles[this.values.length] = handle;
      this.values.push(value);
      return handle;
    },
    get: function(handle) {
      var index = this.indices[handle];
      return this.values[index];
    },
    forEach: function(callback) {
      this.values.forEach(callback);
    },
    remove: function(handle) {
      if(this.values.length === 0) {
        throw new Error("Cannot remove from empty.");
      }

      var index = this.indices[handle];
      var lastValueIndex = this.values.length-1;
      var lastValueHandle = this.handles[lastValueIndex];

      this.values[index] = this.values[lastValueIndex];
      this.indices[lastValueHandle] = index
      this.handles[index] = lastValueHandle;
      this.handleFreeList.push(handle);
      this.values.pop();
    }
  };

  window.ComponentList = ComponentList;
})();
