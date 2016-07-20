/*
 * Author: Florian Block, Smith College, 2015
 * Description: Represents a single touch or click
 */


function Pointer (id, initialPosition) {
    this.id = id;
    this.position = initialPosition.clone();
    this.isActive = false;
};

Pointer.prototype.move = function(position) {
    this.position.setX(position.getX());
    this.position.setY(position.getY());
};

Pointer.prototype.getPosition = function() {
    return this.position.clone();
};

Pointer.prototype.getIsActive = function() {
    return this.isActive;
};

Pointer.prototype.activate = function() {
    this.isActive = true;
};

Pointer.prototype.deactivate = function() {
    this.isActive = false;
};
