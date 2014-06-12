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
    //     propagationIsStopped:false, 
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
    },

    var trigger = function (eventName, params) {
        if (!events[eventName]) {
            return;
        }

        // Initialize to empty responses queue
        responses[eventName] = [];

        var triggeredEvent = events[eventName];
        var sortedListenerPriorities = triggeredEvent.listeners.sort();

        // Listeners can access event.params and event.target 
        triggeredEvent.name = eventName;
        triggeredEvent.params = params.params || {};
        triggeredEvent.target = params.target || (params.targetGenerator && params.targetGenerator()) || {};
        triggeredEvent.lastListenerReturn = null;
        triggeredEvent.propagationIsStopped = false;

        var listenerRetval;
        execute_listeners:
        for (i in sortedListenerPriorities) {
            for (j in sortedListenerPriorities[i]) {
                var listenerCallback = sortedListenerPriorities[i][j];
                responses[eventName].push(listenerCallback(triggeredEvent));
                if (triggeredEvent.propagationIsStopped) {
                    break execute_listeners;
                }
            }
        }
        var returnDefaultResponse = params.hasOwnProperty('defaultReponse') && responses[eventName].length() == 0;
        console.log('returnDefaultResponse');
        console.log(returnDefaultResponse);
        var ret = (returnDefaultResponse && [params.defaultResponse]) || responses[eventName];
        console.log('ret');
        console.log(ret);
    },

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
