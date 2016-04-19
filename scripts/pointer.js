/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
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