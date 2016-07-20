/*
 * Author: Florian Block, Smith College, 2015
 * Description: Controls input: supports touch and mouse
 */

function PointerManager () {

    this.pointers = {};
    this.pointerCount = 0;
    this.activePointerCount = 0;
    this.pivot = new Point(0, 0);
    this.previousPivot = new Point(0, 0);
    this.pivotRadius = 0;
    this.previousPivotRadius = 0;
    this.transformationMatrix = Matrix.getTranslate(0, 0);
};

PointerManager.prototype.getTransformationMatrix = function () {
    return this.transformationMatrix;
};

PointerManager.prototype.onPointerEnter = function(id, position) {
    this.addPointer(id, position);
};

PointerManager.prototype.onPointerMove = function(id, position) {
    this.movePointer(id, position);
};

PointerManager.prototype.onPointerActivate = function(id, position) {
    this.pointers[id].activate();
    this.activePointerCount++;
};

PointerManager.prototype.onPointerDeactivate = function(id,
                                                        position,
                                                        ignoreUpdateCount) {
    this.pointers[id].deactivate();

    if (!ignoreUpdateCount) {
        this.activePointerCount--;
    }
};

PointerManager.prototype.onPointerLeave = function(id, position) {
    this.removePointer(id, position);
};

PointerManager.prototype.hasPointer = function(id) {
    return typeof this.pointers[id] !== 'undefined';
};

PointerManager.prototype.addPointer = function(id, initialPosition) {
    this.pointers[id] = new Pointer(id, initialPosition);
    this.pointerCount++;
    this.updatePivot();
};

PointerManager.prototype.movePointer = function(id, position) {
    this.pointers[id].move(position);
    this.updatePivot();

    if (this.activePointerCount > 0) {
        this.onManipulation(this.pointers[id]);
    }
};

PointerManager.prototype.removePointer = function(id, position) {
    delete this.pointers[id];
    this.pointerCount--;
    this.updatePivot();
};

PointerManager.prototype.updatePivot = function() {
    this.previousPivot = this.pivot.clone();
    this.previousPivotRadius = this.pivotRadius;
    if (this.pointerCount > 0) {
        var xAverage = 0;
        var yAverage = 0;
        for (var id in this.pointers) {
            xAverage += this.pointers[id].getPosition().getX();
            yAverage += this.pointers[id].getPosition().getY();
        }
        xAverage /= this.pointerCount;
        yAverage /= this.pointerCount;
        this.pivot = new Point(xAverage, yAverage);
        var distanceAverage = 0;
        for (var id in this.pointers) {
            distanceAverage += this.pointers[id].getPosition().
                    subtract(this.pivot).getLength();
        }
        distanceAverage /= this.pointerCount;
        this.pivotRadius = distanceAverage;
    } else {
        this.pivot = new Point(0, 0);
    }
}

PointerManager.prototype.onManipulation = function(movedPointer) {
    // translation
    var xTranslation = this.pivot.getX() - this.previousPivot.getX();
    var yTranslation = this.pivot.getY() - this.previousPivot.getY();
    this.transformationMatrix =
            Matrix.getTranslate(xTranslation, yTranslation)
                .multiply(this.transformationMatrix);
    if (this.previousPivotRadius > 0) {
        // scale
        var scale = this.pivotRadius / this.previousPivotRadius;
        this.transformationMatrix =
                Matrix.getScaleAt(scale, scale, this.pivot.getX(),
                    this.pivot.getY()).multiply(this.transformationMatrix);
//                Matrix.getScale(scale, scale).multiply(this.transformationMatrix);
        // rotate
        var previousDirection =
                movedPointer.getPreviousPosition().subtract(this.pivot);
        var currentDirection =
                movedPointer.getPosition().subtract(this.pivot);
//
        var angle =
                (Math.atan2(previousDirection.getX(),
                    previousDirection.getY()) -
                Math.atan2(currentDirection.getX(), currentDirection.getY())) /
                this.pointerCount;
        this.transformationMatrix =
                Matrix.getRotationAt(angle,
                    this.pivot.getX(), this.pivot.getY()).multiply(
                            this.transformationMatrix);
//        var test = true;
    }
};
