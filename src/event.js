var gbili = gbili || {};

gbili.toType = function(obj) {
    return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
};

//
// gbili.event enables events, you can addListeners, trigger events and
// access the events list
//
gbili.event = {
    // every event has
    // {
    //     propagationIsStopped:false, 
    //     name:?, 
    //     params:{}, 
    //     target:{}
    // }
    events: {},

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
    responses: {},

    addListener: function (eventName, callback, priority) {
        if (!this.events.hasOwnProperty(eventName)) {
            this.events[eventName] = {
                listeners : [] 
            };
        }
        // Initialize the array with priority
        if (!(priority in this.events[eventName].listeners)) {
            this.events[eventName].listeners[priority] = [];
        }
        // Add the callback to the priority array
        this.events[eventName].listeners[priority].push(callback);
    },

    trigger: function (eventName, params) {
        if (!this.events[eventName]) {
            return;
        }

        // Initialize to empty responses queue
        this.responses[eventName] = [];

        var triggeredEvent = this.events[eventName];
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
                this.responses[eventName].push(listenerCallback(triggeredEvent));
                if (triggeredEvent.propagationIsStopped) {
                    break execute_listeners;
                }
            }
        }
        var returnDefaultResponse = params.hasOwnProperty('defaultReponse') && this.responses[eventName].length() == 0;
        console.log('returnDefaultResponse');
        console.log(returnDefaultResponse);
        var ret = (returnDefaultResponse && [params.defaultResponse]) || this.responses[eventName];
        console.log('ret');
        console.log(ret);
    },
};
