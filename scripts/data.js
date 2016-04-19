/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * @description A state and its related data
 * @param {String} name The state's name
 * @param {int} population The population of the state
 * @param {int} housingUnits The number of housing units in the state
 * @returns {State}
 * @constructor
 */
function State (name, population, housingUnits) {
    this.name = name;
    this.population = parseInt(population);
    this.housingUnits = parseInt(housingUnits);
};

/**
 * @description The state's name
 * @returns {String}
 */
State.prototype.getName = function () {
    return this.name;
};

/**
 * @description Returns the population
 * @returns {int}
 */
State.prototype.getPopulation = function () {
    return this.population;
};

/**
 * @description Returns the housing units
 * @returns {int}
 */
State.prototype.getHousingUnits = function () {
    return this.housingUnits;
};

/**
 * @description Class to store a list of states
 * @returns {StateData}
 * @constructor
 */ 
function StateData () {
    this.states = null;
    
    this.populationData = null;
    this.housingData = null;
    this.statesList = null;
};

/**
 * @description Gets the list of states
 * @returns {Array}
 */
StateData.prototype.getStates = function () {
    return this.states;
};

/**
 * @description Sets the lists of data
 * @param {Array} dataSet The list of data (either names or numbers)
 * @param {String} type The type of the data as a String
 * @returns {undefined}
 */
StateData.prototype.setDataSet = function (dataSet, type) {
    if (type === POPULATION_DATA_KEY) {
        this.populationData = dataSet;
    } else if (type === HOUSING_UNITS_DATA_KEY) {
        this.housingData = dataSet;
    } else if (type === STATES_LIST_DATA_KEY) {
        this.statesList = dataSet;
    }
};

/**
 * @description Returns the specified data set
 * @param {String} type The type of the data as a String
 * @returns {Array}
 */
StateData.prototype.getDataSet = function (type) {
     if (type === POPULATION_DATA_KEY) {
        return this.populationData;
    } else if (type === HOUSING_UNITS_DATA_KEY) {
        return this.housingData;
    } else if (type === STATES_LIST_DATA_KEY) {
        return this.statesList;
    }
};

/**
 * @description Checks whether the states have been loaded
 * @returns {Boolean}
 */
StateData.prototype.dataLoaded = function () {
    return this.states !== null;
};

/**
 * @description If all data has been set, generates the states
 * @returns {Boolean}
 */
StateData.prototype.tryGenerateStates = function () {
    
    if (this.validData()) {
        this.generateStates();
        this.onLoadStates();
        return true;
    } else {
        this.onLoadError();
        return false;
    }
};

/**
 * @description Checks whether there is valid data for all data sets
 * @returns {Boolean}
 */
StateData.prototype.validData = function () {
    
    return this.statesList !== null &&
           this.populationData !== null &&
            this.housingData !== null;
};

/**
 * @description Generates the state objects
 * @returns {undefined}
 */
StateData.prototype.generateStates = function () {
    this.states = [];
    for (var i = 0; i < this.statesList.length; i++) {
        this.states.push(new State (
                this.statesList[i],
                this.populationData[1] 
                    [this.locateStateDataIndex(this.statesList[i],
                        this.populationData)],
                this.housingData[1]
                    [this.locateStateDataIndex(this.statesList[i],
                        this.housingData)]));
    }   
};

/**
 * @description Locates the index of the associated data by state's name
 * @param {String} state Name of the state
 * @param {TwoDimensionalArray} data The supplied data for the state
 * @returns {int}
 */
StateData.prototype.locateStateDataIndex = function (state, data) {
    
    for (var i = 0; i < data[0].length; i++) {
        if (state === data[0][i]) {
            return i;
        }
    }
    console.log("Did not find " + state);
    return -1;
};

/**
 * @description Event to be overaloded: fires when the states are loaded
 * @returns {undefined}
 */
StateData.prototype.onLoadStates = function () {
    // To be overriden
    console.log("States have been loaded");
};

/**
 * @description Event to be overaloded: fires if the states fail to load
 * @returns {undefined}
 */
StateData.prototype.onLoadError = function () {
    // To be overriden
    console.log("Data was not loaded");
};

/**
 * @description A utility class to generate a TwoDimensionalArray from a CSV file
 * @param {String} filename File path of the csv file
 * @returns {CSVParser}
 * @constructor
 */
var CSVParser = function (filename) {
    this.fileLoader = new Resource(filename);
    this.fileLoader.beginLoad(this,
        function () {
            this.onLoad();
            if (this.onCSVParsed !== null) {
                this.onCSVParsed();
            }
        }
    );
     
    this.data = null;
    this.onCSVParsed = null;
    

};

/**
 * @description Event to be called when the CSV file is laoded
 * @returns {undefined}
 */
CSVParser.prototype.onLoad = function () {
    this.data = this.parseCSVAsString(
            this.fileLoader.getLoadedString());
};

/**
 * @description Generates the CSV data from a string
 * @param {String} string The CSV file as a single string
 * @returns {TwoDimensionalArray}
 */
CSVParser.prototype.parseCSVAsString = function (string) {
    if (this.data !== null) {
        return this.data;
    }
    var height;
    var width = 0;
    var csvByLine = string.split(/\r\n|\r|\n/g);
    height = csvByLine.length;
    var csvByCell = [];
    
    for (var i = 0; i < height; i++) {
        csvByCell.push(csvByLine[i].split(','));
        width = Math.max(
                csvByCell[csvByCell.length - 1].length,
                width);
    }

    var table = new TwoDimensionalArray(width, height);
    for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {
            
            if (typeof csvByCell[y] === 'undefined' || typeof csvByCell[y][x] === 'undefined') {
            }
            table.set(x, y, csvByCell[y][x]);
        }
    }
    
    this.data = table;
    return table;
};

/**
 * @description Utility class to generate an array from a .txt file
 * @param {String} filename The filepath of the .txt file
 * @returns {ListParser}
 * @constructor
 */
function ListParser (filename) {
    this.fileLoader = new Resource(filename);
    this.fileLoader.beginLoad(this,
        function () {
            this.onLoad();
            if (this.onListParsed !== null) {
                this.onListParsed();
            }
        }
    );
     
    this.data = null;
    this.onListParsed = null;
    

};

/**
 * @description Event called when the CSV file is loaded
 * @returns {undefined}
 */
ListParser.prototype.onLoad = function () {
    this.data = this.parseListAsString(
            this.fileLoader.getLoadedString());
};

/**
 * @description Generates an array from a string
 * @param {String} string The .txt file as a single string
 * @returns {Array}
 */
ListParser.prototype.parseListAsString = function (string) {
    if (this.data !== null) {
        return this.data;
    }
    var list = string.split(/\r\n|\r|\n/g);
    this.data = list;
    return list;
};

/**
 * @description A mapping of RGB hex values to state names as strings
 * @type Dictionary
 */
var MAPPING = {
	"0d0e45" : "Washington",
	"c0c0c0" : "Oregon",
	"e6e651" : "California",
	"5f5555" : "Arizona",
	"92922a" : "Nevada",
	"837d7d" : "Utah",
	"a6a4a4" : "Idaho",
	"c8c842" : "Montana",
	"d55c49" : "Wyoming",
	"a7a735" : "Colorado",
	"ace651" : "New Mexico",
	"49b16a" : "North Dakota",
	"3c9859" : "South Dakota",
	"32834c" : "Nebraska",
	"2a7240" : "Kansas",
	"7d37ba" : "Oklahoma",
	"9b50dd" : "Texas",
	"1d5b30" : "Minnesota",
	"134d25" : "Iowa",
	"c25544" : "Missouri",
	"0c431d" : "Arkansas",
	"e654e6" : "Louisiana",
	"662920" : "Michigan",
	"8f4033" : "Wisconsin",
	"b14f40" : "Illinois",
	"da8b34" : "Tennessee",
	"46160f" : "Mississippi",
	"135352" : "Indiana",
	"e6a551" : "Kentucky",
	"63219d" : "Alabama",
	"f1a551" : "Ohio",
	"44cece" : "Georgia",
	"757413" : "Florida",
	"5154e6" : "New York",
	"0b4544" : "Pennsylvania",
	"1a1c6c" : "West Virginia",
	"2d7b7a" : "Virginia",
	"45c6c6" : "North Carolina",
	"51e6e6" : "South Carolina",
	"3a3232" : "Maine",
	"4346c2" : "New Hampshire",
	"ec54e6" : "Vermont",
	"3c1009" : "Massachusetts",
	"350b05" : "Connecticut",
	"b6c5c5" : "Rhode Island",
	"2c2e92" : "New Jersey",
	"231c6c" : "Maryland",
	"af54e6" : "Delaware",
        "4c1081" : "Alaska",
        "009386" : "Hawaii"
};