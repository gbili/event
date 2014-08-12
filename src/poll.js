var gbili = gbili || {};

gbili.poll = function() {
    //Upload Status Messages
    var m = {
        starting : 'Upload starting...',
        inProgress : 'Upload in progress...',
        complete : 'Upload complete!',
    };

    var progressTimeInMs = 900,
        progressInterval = null,
        progressBar,
        url,
        baseUrl = '/upload_progress.php?id=';
        // Used to get the current progress

    var getMessage = function(value) {
        return (value === 0 && m.starting) || (value === 100 && m.complete) || m.inProgress;
    };

    var getValue = function(data) {
        return (data.done && 100) || Math.floor((data.current / data.total) * 100);
    };

    var stop = function() {
        if (progressInterval !== null) {
            clearInterval(progressInterval);
            progressInterval = null;
        }
    };

    var manualComplete = function() {
        updateProgressView({done:true});
    };

    var updateProgressView = function (data) {
        var progressValue = getValue(data);
        progressBar.show(progressValue, getMessage(progressValue));
        if (data.done) {
            stop();
        }
    };

    var getUrl = function() {
        return baseUrl + progressBar.getUploadId();
    };

    var updateProgressFromServer = function() {
        $.getJSON(getUrl(), updateProgressView);
    };

    return {
        setBaseUrl : function(bUrl) {
            baseUrl = bUrl;
        },
        getUrl : getUrl,
        setProgressBar : function(pBar) {
            progressBar = pBar;
        },
        setMessages : function(messages) {
            var pm = messages;
            m.starting = pm.hasOwnProperty('starting') && pm.staring || m.starting;
            m.inProgress = pm.hasOwnProperty('inProgress') && pm.inProgress || m.inProgress;
            m.complete = pm.hasOwnProperty('complete') && pm.complete || m.complete;
        },
        manualComplete : manualComplete,
        config : function(params) {
            stop();
            params = params || {};
            if (!params.hasOwnProperty('baseUrl')) alert('Need to pass baseUrl');
            if (!params.hasOwnProperty('progressBar')) alert('Need to pass progressBar');
            this.setBaseUrl(params.baseUrl);
            this.setProgressBar(params.progressBar);
            if (params.hasOwnProperty('messages')) {
                this.setMessages(params.messages);
            }
            if (params.hasOwnProperty('ms')) {
                progressTimeInMs = params.ms;
            }
        },
        start : function () {
            if (progressInterval === null) {
                // Show the starting message
                updateProgressView({status:{done:false, current:0, total:100}});
                // Register the poll interval
                progressInterval = setInterval(updateProgressFromServer, progressTimeInMs);
            }
        },
    };
}();
