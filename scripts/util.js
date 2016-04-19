/**
 * @description Two dimensional array object
 * @param {int} width The width of the array
 * @param {int} height The height of the array
 * @param {TwoDimensionalArray} data The data of an array: used to create a deep copy of an existing array
 * @constructor
 * @return {TwoDimensionalArray}
 */
function TwoDimensionalArray (width, height, data) {
    
    this.width = width;
    this.height = height;
    this.dimensions = new Dimensions(width, height);
    this.numberFormatter = new NumberFormatter();

    if (typeof data === 'undefined') {
        this.data = new Array(width);
        for (var i = 0; i < this.data.length; i++) {
            this.data[i] = new Array (height);
        }
    } else {
        this.data = data;
    }
    
    this.setIndexFunctions();
};

/**
 * @description Creates functions to access individual the members of the array using array notation
 * @returns {undefined}
 */
TwoDimensionalArray.prototype.setIndexFunctions = function () {
    for (var i = 0; i < this.data.length; i++) {
        this[i] = function () {
            return data[i];
        };
    }
};

/**
 * @description Sets a value at the designated index
 * @param {int} x X index of the array
 * @param {int} y Y index of the array
 * @param {Object} value The value this element in the array is being set to
 * @returns {undefined}
 */
TwoDimensionalArray.prototype.set = function (x, y, value) {
    this.data[x][y] = value;
};

/**
 * Returns a specific element in the array
 * @param {int} x X index of the array
 * @param {int} y Y index of the array
 * @returns {Object}
 */
TwoDimensionalArray.prototype.get = function (x, y) {
    return this.data[x][y];
};

/**
 * @description Returns the entire array
 * @returns {TwoDimensionalArray}
 */
TwoDimensionalArray.prototype.getData = function () {
    return this.data;
};

/**
 * @description Returns specific columns in the array
 * @param {Array|int} columns The columns to return
 * @returns {TwoDimensionalArray}
 */
TwoDimensionalArray.prototype.getColumns = function (columns) {
    if (Array.isArray(columns)) {
        columns.sort(compareNumbers);
        var columnList = [];
        for (var i = 0; i < columns.length; i++) {
            columnList.push(this.data[columns[i]]);
            
        }
              
        return new TwoDimensionalArray(
                columns.length,
                this.height,
                columnList);
                
    } else if (Number.isInteger(columns)) {
        return this.data[columns];
    } else {
        console.log("Invalid column input");
        return null;
    }
};

/**
 * @description The width of the array
 * @returns {int}
 */
TwoDimensionalArray.prototype.getWidth = function () {
    return this.width;
};

/**
 * @description The height of the array
 * @returns {int}
 */
TwoDimensionalArray.prototype.getHeight = function () {
    return this.height;
};

/**
 * @description Returns the dimensions of the array
 * @returns {Dimensions}
 */
TwoDimensionalArray.prototype.getDimensions = function () {
    return this.dimensions;
};

/**
 * @description Used to specify dimensions in 2D space
 * @param {int} width
 * @param {int} height
 * @returns {Dimensions}
 * @constructor
 */
function Dimensions (width, height) {
    this.width = width;
    this.height = height;
};

/**
 * @description Used to debug dimensions
 * @returns {String}
 */
Dimensions.prototype.toString = function () {
    return this.width + "x" + this.height;
};

// Code from 
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
// Used for the sort function
/**
 * @description Function to find the difference between two numbers
 * @param {int} a
 * @param {int} b
 * @returns {int}
 */
function compareNumbers (a, b) {
    return a - b;
}

http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
/**
 * @description A utility class to convert from RGB values to Hex
 * @param {int} r The red channel
 * @param {int} g The green channel
 * @param {int} b The blue channel
 * @returns {RGBToHex}
 * @constructor
 */
function RGBToHex (r, g, b) {
  this.r = r;
  this.g = g;
  this.b = b;
  this.hexValue = null;
};

/**
 * @description Converts a base 10 value to a hexadecimal value
 * @param {int} c The value to convert
 * @returns {String}
 */
RGBToHex.prototype.componentToHex = function (c) {
    var hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
};

/**
 * @description Converts the stored RGB value to hex
 * @returns {RGBColor}
 */
RGBToHex.prototype.getHexValue = function () {
    if (this.hexValue === null) {
        this.hexValue = this.componentToHex(this.r) +
                        this.componentToHex(this.g) + 
                        this.componentToHex(this.b);
    }
    
    return this.hexValue;
};

/**
 * @description Holds an RGB Color Value
 * @constructor
 * @param {int} r
 * @param {int} g
 * @param {int} b
 * @returns {RGBColor}
 */
function RGBColor (r, g, b) {
    this.red = r;
    this.green = g;
    this.blue = b;
}

/**
 * @description Used to format numbers into specific strings
 * @returns {NumberFormatter}
 * @constructor
 */
function NumberFormatter () {}

/**
 * @description Adds commas to a number
 * @param {Real} number
 * @returns {String}
 */
NumberFormatter.prototype.addCommas = function (number) {
    var numberAsString = number.toString();
    var wholeNumber = numberAsString.split(".")[0];
    var decimal = numberAsString.split(".")[1];
    if (typeof decimal === 'undefined') {
        decimal = "";
    } else {
        decimal = "." + decimal;
    }
    var formatter = new StringFormatter();
    wholeNumber = formatter.reverse(wholeNumber);
    wholeNumber = wholeNumber.replace(/(\S{3})/g,"$1,");
    wholeNumber = formatter.reverse(wholeNumber);
    if (wholeNumber[0] === ",") {
        wholeNumber = wholeNumber.substr(1, wholeNumber.length -1);
    }
    return wholeNumber + decimal;
    
};

/**
 * @description Used to format Strings
 * @constructor
 */
function StringFormatter () {}

/**
 * @description Reverses a string
 * @param {String} string String to reverse
 * @returns {String}
 */
StringFormatter.prototype.reverse = function (string) {
    var stringToReturn = "";
    for (var i = string.length-1; i >= 0; i--) {
        stringToReturn += string[i];
    }
    return stringToReturn;
};

/**
 * @description Holds the image data of a canvas as a 2D array of RGB values
 * @constructor
 * @param {Image} img The image to sample
 * @param {GraphicsContext2D} g The canvas graphics object to sample
 * @returns {RGBImageData}
 */
function RGBImageData (img, g) {
    this.img = img;
    this.pixelData = g.getImageData(0,0, img.width, img.height).data;
    this.redData = this.parseChannelData(this.pixelData,
                                            "red");
    this.greenData = this.parseChannelData(this.pixelData,
                                            "green");
    this.blueData = this.parseChannelData(this.pixelData,
                                            "blue");
};

/**
 * @description Samples a specific channel of color
 * @param {Uint8ClampedArray} pixelData The pixel data as a one dimensional array
 * @param {String} channel The pixel channel name to sample
 * @returns {TwoDimensionalArray}
 */
RGBImageData.prototype.parseChannelData = function (pixelData, channel) {
    var pixelIndex = 0;
    var width = this.img.width;
    var height = this.img.height;
    var channelOffset;
    var channelValues = new TwoDimensionalArray(width, height);
    
    switch (channel) {
        case "red":
            channelOffset = 0;
            break;
        case "green":
            channelOffset = 1;
            break;
        case "blue":
            channelOffset = 2;
            break;
        case "alpha":
            channelOffset = 3;
            break;
        default:
            channelOffset = 0;
            console.log("invalid channel input: " + channel);
    }
    
    for (var i = 0; i < pixelData.length; i+=4) {
        var arrayPosition = this.getPositionFromPixelIndex(
                                pixelIndex, 
                                width);
        channelValues.set(
            arrayPosition.getX(),
            arrayPosition.getY(), 
            pixelData[i + channelOffset]);
        
        pixelIndex++;
    }
    
    return channelValues;
};

/**
 * @description Returns the color of the pixel in the image as an RGB value
 * @param {int} x x coordinat of the pixel
 * @param {int} y y coordinat of the pixel
 * @returns {RGBColor}
 */
RGBImageData.prototype.getPixelData = function (x, y){
    return new RGBColor(
        this.redData.get(x, y),
        this.greenData.get(x, y),
        this.blueData.get(x, y));
};

/**
 * @description Finds pixel's position in 2d array
 * @param {int} pixelIndex The index of the pixel in the 1d array
 * @param {int} width The width of the image
 * @returns {Point}
 */
RGBImageData.prototype.getPositionFromPixelIndex = function (pixelIndex, width) {
    return new Point(pixelIndex%width, 
                    parseInt(pixelIndex/width));
};

/**
 * @description A visual debugger tool
 * @constructor
 * @returns {Debugger}
 */


/**
 * @description Dimensions used to scale UI elements to the screen
 */
var Scaler = {
    get pixelRatio () {
        return window.devicePixelRatio;
    },
    get screenWidth () {

        if (Math.abs(window.orientation) === 90) {
            return screen.height * this.pixelRatio;
        } else {
            return screen.width * this.pixelRatio;
        }
    },
    get screenHeight () {
        if (Math.abs(window.orientation) === 90) {
            return screen.width * this.pixelRatio;
        } else {
            return screen.height * this.pixelRatio;
        }
    }
};

/**
 * @enum
 * @description Used to position elmeents onscreen
 */
var ORIENTATION = {
    TOP : {x: Scaler.screenWidth/2, y: 0},
    LEFT : {x: 0, y: Scaler.screenHeight/2},
    RIGHT : {x: Scaler.screenWidth, y: Scaler.screenHeight/2},
    CENTER : {x: Scaler.screenWidth/2, y: Scaler.screenWidth/2},
    BOTTOM : {x: Scaler.screenWidth/2, y: Scaler.screenHeight}
};