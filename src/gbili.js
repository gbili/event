var gbili = gbili || {
    toType: function(obj) {
        return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
    },
    event: {
        events: {},

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
            var triggeredEvent = this.events[eventName];
            var sortedListenerPriorities = triggeredEvent.listeners.sort();

            // Listeners can access event.params and event.target 
            triggeredEvent.params = params.params || {};
            triggeredEvent.target = params.target || (params.targetGenerator && params.targetGenerator()) || {};

            for (i in sortedListenerPriorities) {
                for (j in sortedListenerPriorities[i]) {
                    var listenerCallback = sortedListenerPriorities[i][j];
                    listenerCallback(triggeredEvent);
                }
            }
        },
    },
};
