var Deduper = function(maxSize) {
  this.ids = [];
  this.maxSize = maxSize || 200;
};

Deduper.prototype.isNew = function(id) {
  if (this.find(id)) {
    return false;
  }

  this.ids.unshift(id);
  while (this.ids.length > this.maxSize) {
    this.ids.pop();
  }
  return true;
};

Deduper.prototype.find = function(id) {
  for (var i=0; i < this.ids.length; i++) {
    if (this.ids[i] === id) {
      return true;
    }
  }
  return false;
}

exports.Deduper = Deduper;
