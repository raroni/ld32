function Vector3(x, y, z) {
  this.x = x || 0;
  this.y = y || 0;
  this.z = z || 0;
}

Vector3.prototype = {
  clone: function() {
    return new Vector3(this.x, this.y, this.z);
  },
  add: function(v) {
    this.set(Vector3.add(this, v));
  },
  subtract: function(v) {
    this.set(Vector3.subtract(this, v));
  },
  multiply: function(n) {
    this.set(Vector3.multiply(this, n));
  },
  divide: function(n) {
    this.set(Vector3.divide(this, n));
  },
  set: function(v) {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
  },
  reset: function() {
    this.x = 0;
    this.y = 0;
    this.z = 0;
  },
  normalize: function() {
    this.divide(this.calcLength());
  },
  calcLength: function() {
    return Math.sqrt(this.calcSquaredLength());
  },
  calcSquaredLength: function() {
    return Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2);
  }
};

Vector3.add = function(a, b) {
  var r = new Vector3(
    a.x+b.x,
    a.y+b.y,
    a.z+b.z
  );
  return r;
};

Vector3.subtract = function(a, b) {
  var r = new Vector3(
    a.x-b.x,
    a.y-b.y,
    a.z-b.z
  );
  return r;
};

Vector3.multiply = function(v, n) {
  var r = v.clone();
  r.x *= n;
  r.y *= n;
  r.z *= n;
  return r;
};

Vector3.divide = function(v, n) {
  var r = v.clone();
  r.x /= n;
  r.y /= n;
  r.z /= n;
  return r;
};

Vector3.cross = function(a, b) {
  return new Vector3(
    a.y*b.z - a.z*b.y,
    a.z*b.x - a.x*b.z,
    a.x*b.y - a.y*b.x
  );
}
