/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * @description Initializes the program
 * @returns {undefined}
 */
function initialize () {
    var controller = new CustomGameLoop();
    controller.initialize(document.getElementById(CANVAS_ID));
    controller.setCanvasSize(Scaler.screenWidth, Scaler.screenHeight);
    
    var populationCSVParser = new CSVParser("data/NST_EST2014_ALLDATA.csv");
    
    populationCSVParser.onCSVParsed = function () {
        var populationData = 
                populationCSVParser.parseCSVAsString().getColumns(
                POPULATION_DATA_COLUMNS).getData();
        
        controller.getStateData().setDataSet(
                populationData, 
                POPULATION_DATA_KEY);
                
        controller.tryToLoadStates();
    };
    
    var housingUnitCSVParser = new CSVParser("data/PEP_2014_PEPANNHU.csv");
    
    housingUnitCSVParser.onCSVParsed = function () {
        var housingUnitData = 
                housingUnitCSVParser.parseCSVAsString().getColumns(
                    HOUSING_UNIT_DATA_COLUMNS).getData();
        
        controller.getStateData().setDataSet(
                housingUnitData, 
                HOUSING_UNITS_DATA_KEY);
                
        controller.tryToLoadStates();
    };
    
    var listParser = new ListParser("data/states.txt");
    
    listParser.onListParsed = function () {
        var statesList = listParser.parseListAsString();
        
        controller.getStateData().setDataSet(
                statesList, 
                STATES_LIST_DATA_KEY);
                
        controller.tryToLoadStates();
    };
}

window.onload = initialize;