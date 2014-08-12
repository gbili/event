var gbili = gbili || {};

gbili.toType = function(obj) {
    return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
};

//
// gbili.event enables events, you can addListeners, trigger events and
// access the events list
//
gbili.event = function() { 
    // every event has
    // {
    //     isPropagationStopped:false, 
    //     name:?, 
    //     params:{}, 
    //     target:{}
    // }
    var events = {};

    // Responses are sorted by event name as key
    // {
    //     'my.event.name' : [
    //         <listener1_return>, 
    //         <listener2_return>,
    //         ...
    //     ]
    //     'my.event.name' : [
    //         <listener1_return>, 
    //         <listener2_return>,
    //         ...
    //     ]
    // }
    var responses = {};

    var addListener = function (eventName, callback, priority) {
        if (!events.hasOwnProperty(eventName)) {
            events[eventName] = {
                listeners : [] 
            };
        }
        // Initialize the array with priority
        if (!(priority in events[eventName].listeners)) {
            events[eventName].listeners[priority] = [];
        }
        // Add the callback to the priority array
        events[eventName].listeners[priority].push(callback);
    };

    var executeEventListeners = function(triggeredEvent){
        var i, j, 
            listenerCallback, 
            response,
            eventName = triggeredEvent.name,
            sortedListenerPriorities = triggeredEvent.listeners.sort();

        for (i in sortedListenerPriorities) {
            for (j in sortedListenerPriorities[i]) {
                listenerCallback = sortedListenerPriorities[i][j];
                response = listenerCallback(triggeredEvent);
                if (typeof response !== 'undefined') responses[eventName].push(response);
                if (triggeredEvent.isPropagationStopped) {
                    return false;
                }
            }
        }
        return true;
    };

    var trigger = function (eventName, params) {
        // Initialize to empty responses queue
        responses[eventName] = [];

        if (!events[eventName]) {
            // If no listeners still retrun default response if available
            return (params.hasOwnProperty('defaultResponse') && [params.defaultResponse]) || responses[eventName];
        }

        var triggeredEvent = events[eventName];

        // Listeners can access event.params and event.target 
        triggeredEvent.name = eventName;
        triggeredEvent.params = params.params || {};
        triggeredEvent.target = params.target || (params.targetGenerator && params.targetGenerator()) || {};
        triggeredEvent.lastListenerReturn = null;
        triggeredEvent.isPropagationStopped = false;

        executeEventListeners(triggeredEvent);

        // If listeners did not return anything, retrun default response if available, else return responses
        var returnDefaultResponse = params.hasOwnProperty('defaultResponse') && (responses[eventName].length == 0);
        return (returnDefaultResponse && [params.defaultResponse]) || responses[eventName];
    };

    return {
        getEvents : function() {
            return events;
        },
        getResponses : function() {
            return responses;
        },
        addListener: addListener,
        trigger: trigger,
    };
}();
