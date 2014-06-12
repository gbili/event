var gbili = gbili || {};

gbili.poll = function() {
    //Upload Status Messages
    var m = {
        starting : 'Upload starting...',
        inProgress : 'Upload in progress...',
        complete : 'Upload complete!',
    };

    var progressTimeInMs = 900,
        progressInterval,
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

    var updateProgress = function (data) {
        var progressValue = getValue(data);
        progressBar.show(progressValue, getMessage(progressValue));
        if (data.status.done) {
            clearInterval(progressInterval);
            progressInterval = null;
            progressBar.reset();
        }
    };

    var getUrl = function() {
        // querying html, but there is no need, simply using a 
        // local variable to store progress would also work
        return baseUrl + progressBar.getValue();
    };

    var updateProgressFromServer = function() {
        $.getJSON(getUrl(), updateProgress);
    };

    return {
        setBaseUrl : function(bUrl) {
            baseUrl = bUrl;
        },
        setProgressBar : function(pBar) {
            progressBar = pBar;
        },
        start : function(params) {
            params = params || {};
            if (params.hasOwnProperty('baseUrl')) this.setBaseUrl(params.baseUrl);
            if (params.hasOwnProperty('progressBar')) this.setProgressBar(params.progressBar);

            if (null === progressInterval) {
                // Show the starting message
                updateProgress({status:{done:false, current:0, total:100}});
                // Register the poll interval
                progressInterval = setInterval(updateProgressFromServer, progressTimeInMs);
            }
        }
    };
}();
