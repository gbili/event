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
        return (data.status.done && 100) || Math.floor((data.status.current / data.status.total) * 100);
    };

    var stop = function() {
        if (typeof progressInterval !== null) {
            clearInterval(progressInterval);
            progressInterval = null;
        }
    };

    var updateProgressView = function (data) {
        var progressValue = getValue(data);
        progressBar.show(progressValue, getMessage(progressValue));
        if (data.status.done) {
            stop();
            progressBar.reset();
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
        setProgressBar : function(pBar) {
            progressBar = pBar;
        },
        stop : stop,
        start : function(params) {
            params = params || {};
            if (params.hasOwnProperty('baseUrl')) this.setBaseUrl(params.baseUrl);
            if (params.hasOwnProperty('progressBar')) this.setProgressBar(params.progressBar);

            if (typeof progressInterval === null) {
                // Show the starting message
                updateProgressView({status:{done:false, current:0, total:100}});
                // Register the poll interval
                progressInterval = setInterval(updateProgressFromServer, progressTimeInMs);
            }
        }
    };
}();
