/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * @description A subclassed version of the GameLoop class to run the population map
 * @returns {CustomGameLoop}
 * @constructor
 */
function CustomGameLoop () {
};

CustomGameLoop.prototype = new GameLoop();


/**
 * @description Initailizes the main loop and sets its references
 * @param {Canvas} canvas The canvas to draw to
 * @returns {undefined}
 */
CustomGameLoop.prototype.initialize = function (canvas) {
    GameLoop.prototype.initialize.call(this, canvas);

    this.visualMap = null;
    this.stateData = new StateData();
    this.statePanel = null;
    this.debugger = new Debugger();
    this.pointerManager = new PointerManager();
    var _this = this;
    this.stateData.onLoadStates = function () {
        _this.visualMap = new VisualMap(
                this.getStates(),
                _this.canvas,
                "assets/state_hittest_map.png");  
        _this.statePanel = _this.visualMap.getStatePanel();
    };
   
};

/**
 * @description Draws the elements to the canvas
 * @param {GraphicsContext2D} g graphics object to draw to
 * @returns {undefined}
 */
CustomGameLoop.prototype.draw = function(g) {
    
    if (this.visualMap !== null) {       
        if (this.statePanel.stateGraphActive()) {
            this.statePanel.drawStateGraph(g);
        } else {
            g.fillStyle = "black";
            this.visualMap.draw(g,
                this.pointerManager.getTransformationMatrix());
        }
    }
};

/**
 * @description Returns the state data associated with this script
 * @returns {StateData}
 */
CustomGameLoop.prototype.getStateData = function () {
    return this.stateData;
};

/**
 * @description Attempts to load generate the states from the data
 * @param {Array} stateList The list of states
 * @param {TwpDimensionalArray} populationData A table of population by state
 * @param {TwpDimensionalArray} housingUnitData A table of housing units by state
 * @returns {undefined}
 */
CustomGameLoop.prototype.tryToLoadStates = function (stateList, populationData, housingUnitData) {
    this.stateData.tryGenerateStates(
        stateList,
        populationData,
        housingUnitData);
};

/**
 * @description Sets the dimensions of the canvas
 * @param {int} width
 * @param {int} height
 * @returns {undefined}
 */
CustomGameLoop.prototype.setCanvasSize = function (width, height) {
    this.canvas.height = height;
    this.canvas.width = width;
};

/**
 * @description Event to handle the pointer entering the canvas
 * @param {String} id The pointer's unique ID
 * @param {Point} position The current position of the pointer
 * @returns {undefined}
 */
CustomGameLoop.prototype.onPointerEnter = function(id, position) {
    this.pointerManager.onPointerEnter(id, position);
};

/**
 * @description Event to handle the pointer moving on the canvas
 * @param {String} id The pointer's unique ID
 * @param {Point} position The current position of the pointer
 * @returns {undefined}
 */
CustomGameLoop.prototype.onPointerMove = function(id, position) {
    var x = position.getX();
    var y = position.getY();
    
    this.pointerManager.onPointerMove(id, position);
    if (this.visualMap !== null) {
        this.statePanel.hitTest(x, y);
        this.visualMap.hitTest(
                x,
                y,
                this.pointerManager.getTransformationMatrix());
    }
};

/**
 * @description Event to handle the pointer activating on the canvas
 * @param {String} id The pointer's unique ID
 * @param {Point} position The current position of the pointer
 * @returns {undefined}
 */
CustomGameLoop.prototype.onPointerActivate = function(id, position) {
    var x = position.getX();
    var y = position.getY();
    this.pointerManager.onPointerActivate(id, position);
    
    if (this.statePanel.hitTest(x, y)) {
        this.statePanel.processClick(x, y);
        // Exits the function here to avoid unselecting
        // and selecting a state with the same click
        return;
    }
    
    if (this.visualMap.hitTest(
            x,
            y,
            this.pointerManager.getTransformationMatrix())) {
    
                this.visualMap.addActiveStateToPanel();
            
    }
    
    
};

/**
 * @description Event to handle the pointer deactivating on the canvas
 * @param {String} id The pointer's unique ID
 * @param {Point} position The current position of the pointer
 * @returns {undefined}
 */
CustomGameLoop.prototype.onPointerDeactivate = function(id, position) {
    this.pointerManager.onPointerDeactivate(id, position);
};

/**
 * @description Event to handle the pointer exiting the canvas
 * @param {String} id The pointer's unique ID
 * @param {Point} position The current position of the pointer
 * @returns {undefined}
 */
CustomGameLoop.prototype.onPointerLeave = function(id, position) {
    this.pointerManager.onPointerLeave(id, position);
};

//Code from: http://stackoverflow.com/questions/11060308/best-practice-for-creating-a-canvas-element
/**
 * @description Adds another canvas to the game
 * @param {int} width
 * @param {int} height
 * @param {String} canvasID ID assigned to the canvas for CSS styling
 * @returns {Canvas}
 */
CustomGameLoop.prototype.addCanvas = function (width, height, canvasID) {
    var canvas = document.createElement('canvas');
    
    if (typeof(canvasID) !== "undefined") {
        canvas.id = canvasID;
    }
    
    document.body.appendChild(canvas);
    
    canvas.height = width;
    canvas.width = height;
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    return canvas;
};