/*
 * Author: Florian Block, Smith College, 2015
 * Description: Runs update loop and core logic for app
 */

// <editor-fold desc="Point">
function Point(x, y)
{
    this.setX(x);
    this.setY(y);
}

Point.prototype.getX = function() {
    return this.x;
}

Point.prototype.getY = function() {
    return this.y;
}

Point.prototype.setX = function(x) {
    this.x = x;
}

Point.prototype.setY = function(y) {
    this.y = y;
}

Point.prototype.clone = function() {
    return new Point(this.x, this.y);
}

Point.prototype.subtract = function(p) {
    return new Point(this.x - p.x, this.y - p.y);
}

Point.prototype.add = function(p) {
    return new Point(this.x + p.x, this.y + p.y);
}


Point.prototype.toString = function() {
    return "(" + (Math.round(this.getX() * 1000) / 1000) + ", " +
            (Math.round(this.getY() * 1000) / 1000) + ")";
}

Point.prototype.getLength = function() {
    return Math.sqrt(Math.pow(this.getX(), 2) + Math.pow(this.getY(), 2));
}

Point.prototype.normalize = function() {
    var length = this.getLength();
    this.divideBy(length);
}

Point.prototype.divideBy = function(s) {
    this.x /= s;
    this.y /= s;
}

Point.prototype.dotProduct = function(p) {
    return this.getX() * p.getX() + this.getY() * p.getY();
}
// </editor-fold>

function GameLoop() {
}

GameLoop.Settings = {
    Input : {
        MOUSE_ID : "MOUSE"
    }
}

GameLoop.prototype.initializeGraphics = function() {
    this.g = this.canvas.getContext("2d");
    this.canvas.width = 600;
    this.canvas.height = 400;
}

GameLoop.prototype.initializeInput = function() {
    this.canvas.associatedGameLoop = this;
    this.canvas.onmouseenter = function(e) {
        e.preventDefault();
        var localCoordinate =
                this.associatedGameLoop.getLocalCanvasCoordinates(e);
        this.associatedGameLoop.onMouseEnter(localCoordinate);
    }
    this.canvas.onmousemove = function(e) {
        e.preventDefault();
        var localCoordinate =
                this.associatedGameLoop.getLocalCanvasCoordinates(e);
        this.associatedGameLoop.onMouseMove(localCoordinate);
    }
    this.canvas.onmousedown = function(e) {
        e.preventDefault();
        var localCoordinate =
                this.associatedGameLoop.getLocalCanvasCoordinates(e);
        this.associatedGameLoop.onMouseDown(localCoordinate);
    }
    this.canvas.onmouseup = function(e) {
        e.preventDefault();
        var localCoordinate =
                this.associatedGameLoop.getLocalCanvasCoordinates(e);
        this.associatedGameLoop.onMouseUp(localCoordinate);
    }
    this.canvas.onmouseleave = function(e) {
        e.preventDefault();
        var localCoordinate =
                this.associatedGameLoop.getLocalCanvasCoordinates(e);
        this.associatedGameLoop.onMouseLeave(localCoordinate);
    }
    this.canvas.ontouchstart = function(e) {
        e.preventDefault();
        for (var i = 0; i < e.changedTouches.length; i++)
        {
           var t = e.changedTouches[i];
           var localCoordinate =
                   this.associatedGameLoop
                   .getLocalCanvasCoordinates(t.clientX, t.clientY);
           this.associatedGameLoop.onTouchStart(t.identifier, localCoordinate);
        }
    }
    this.canvas.ontouchmove = function(e) {
        e.preventDefault();
        for (var i = 0; i < e.changedTouches.length; i++)
        {
           var t = e.changedTouches[i];
           var localCoordinate =
                   this.associatedGameLoop
                   .getLocalCanvasCoordinates(t.clientX, t.clientY);
           this.associatedGameLoop.onTouchMove(t.identifier, localCoordinate);
        }
    }
    this.canvas.ontouchend = function(e) {
        e.preventDefault();
        for (var i = 0; i < e.changedTouches.length; i++)
        {
           var t = e.changedTouches[i];
           var localCoordinate =
                   this.associatedGameLoop
                   .getLocalCanvasCoordinates(t.clientX, t.clientY);
           this.associatedGameLoop.onTouchEnd(t.identifier, localCoordinate);
        }
    }
    this.canvas.ontouchcancel = function(e) {
        e.preventDefault();
        for (var i = 0; i < e.changedTouches.length; i++)
        {
           var t = e.changedTouches[i];
           var localCoordinate =
                   this.associatedGameLoop
                   .getLocalCanvasCoordinates(t.clientX, t.clientY);
           this.associatedGameLoop.onTouchEnd(t.identifier, localCoordinate);
        }
    }
}

GameLoop.prototype.getLocalCanvasCoordinates = function(arg1, arg2) {
    var clientX = 0;
    var clientY = 0;
    if (typeof arg2 == 'undefined') {
        var e = arg1;
        clientX = e.clientX;
        clientY = e.clientY;
    } else {
        clientX = arg1;
        clientY = arg2;
    }
    var offset = this.canvas.getBoundingClientRect();
    var positionOnCanvas = {
        x : clientX - offset.left,
        y : clientY - offset.top
    }
    return positionOnCanvas;
}

GameLoop.prototype.onMouseEnter = function(position) {
    // override
    this.onPointerEnter(
            GameLoop.Settings.Input.MOUSE_ID,
            new Point(position.x, position.y));
}

GameLoop.prototype.onMouseDown = function(position) {
    // override
    this.onPointerActivate(
            GameLoop.Settings.Input.MOUSE_ID,
            new Point(position.x, position.y));
}

GameLoop.prototype.onMouseUp = function(position) {
    // override
    this.onPointerDeactivate(
            GameLoop.Settings.Input.MOUSE_ID,
            new Point(position.x, position.y));
}

GameLoop.prototype.onMouseMove = function(position) {
    // override
    this.onPointerMove(
            GameLoop.Settings.Input.MOUSE_ID,
            new Point(position.x, position.y));
}

GameLoop.prototype.onMouseLeave = function(position) {
    // override
    this.onPointerLeave(
            GameLoop.Settings.Input.MOUSE_ID,
            new Point(position.x, position.y))
}

GameLoop.prototype.onTouchStart = function(id, position) {
    var point = new Point(position.x, position.y);
    this.onPointerEnter(id, point);
    this.onPointerActivate(id, point);
}

GameLoop.prototype.onTouchMove = function(id, position) {
    this.onPointerMove(id, new Point(position.x, position.y));
}

GameLoop.prototype.onTouchEnd = function(id, position) {
    this.onPointerDeactivate(id, position);
    this.onPointerLeave(id, new Point(position.x, position.y));
}

GameLoop.prototype.onTouchCancelled = function(id, position) {
    this.onPointerLeave(id, new Point(position.x, position.y));
}

GameLoop.prototype.onPointerEnter = function(id, position) {

}

GameLoop.prototype.onPointerMove = function(id, position) {

}

GameLoop.prototype.onPointerActivate = function(id, position) {

}

GameLoop.prototype.onPointerDeactivate = function(id, position) {

}

GameLoop.prototype.onPointerLeave = function(id, position) {

}

GameLoop.prototype.initializeTimer = function() {
    var engine = this;
    setInterval(function() {
        engine.onTimerTick();
    }, 10);
}

GameLoop.prototype.onTimerTick = function() {

    this.update(10);
    this.clear(this.g);
    this.draw(this.g);
}

GameLoop.prototype.clear = function(g) {
    g.fillStyle = "white";
    g.fillRect(0, 0, this.canvas.width, this.canvas.height);
}

GameLoop.prototype.update = function(elapsedMilliseconds) {
    // override
}

GameLoop.prototype.draw = function(g) {
    // override
}

GameLoop.prototype.initialize = function(canvas) {
    this.canvas = canvas;
    this.isInputDebugModeEnabled = false;
    this.initializeGraphics();
    this.initializeInput();
    this.initializeTimer();
}
