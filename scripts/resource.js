// Code by Florian Block

function Resource(url) {
    this.url = url;
    this.method = "GET";
    this.isAsynchronous = true;
    this.isLoaded = false;
    this.objectToNotify = null;
    this.onLoadHandler = null;
    this.onErrorHandler = null;
    this.request = null;
    this.totalBytes = null;
    this.loadedBytes = null;
    this.loadedPercentage = 0;
}

//Resource.GlobalSettings = {
//    useWebAuthentification
//}

Resource.prototype.beginLoad = function(
        objectToNotify, 
        onLoadHandler,
        onErrorHandler) {
    if (typeof objectToNotify === 'undefined') {
        // no notification necessary
    } else if (typeof objectToNotify != null && 
            typeof onLoadHandler === 'function') {
        this.objectToNotify = objectToNotify;
        this.onLoadHandler = onLoadHandler;
        if (typeof onErrorHandler === 'function') {
            this.onErrorHandler = onErrorHandler;
        }
    }
    var _this = this;
    var request = new XMLHttpRequest()
    this.request = request;
    this.request.onreadystatechange = function() {
        if (request.readyState == 4) {
            if (request.status == 200) {
                _this.callLoadHandler();
            } else {
                _this.callErrorHandler();
            }
        }
    }
    this.request.onprogress = function (evt) {
        var total = evt.total;
        var loaded = evt.loaded;
        var percentage = Math.round(loaded / total * 100);
        _this.onProgress(total, loaded, percentage);
    }
    this.request.open(this.method, this.url, this.isAsynchronous);
    this.request.send();
}

Resource.prototype.onProgress = function(total, loaded, roundedPercentage) {
    this.totalBytes = total;
    this.loadedBytes = loaded;
    this.loadedPercentage = roundedPercentage;
}

Resource.prototype.getIsLoadingStatusAvailable = function() {
    return this.totalBytes != null && this.loadedBytes != null;
}

Resource.prototype.getLoadedPercentage = function() {
    return this.loadedPercentage;
}

Resource.prototype.callLoadHandler = function() {
    this.isLoaded = true;
    if (this.onLoadHandler != null) {
        this.callHandler(this.onLoadHandler);
    }
}

Resource.prototype.getIsLoaded = function() {
    return this.isLoaded;
}

Resource.prototype.getLoadedString = function() {
    return this.request.responseText;
}

Resource.prototype.callErrorHandler = function() {
    if (this.onErrorHandler != null) {
        this.callHandler(this.onErrorHandler);
    }
}

Resource.prototype.callHandler = function(handler) {
    if (this.objectToNotify != null) {
        handler.call(this.objectToNotify, this);
    } else {
        handler(this);
    }
}