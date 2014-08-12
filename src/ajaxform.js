var gbili = gbili || {};

// Enable ajax on the jQuery object
// Usage: 
//    var myAjaxForm = gbili.getAjaxForm('#my-form');
gbili.ajaxForm = function (){
    var form,
        formCssSelector;

    var getForm = function() {
        form = form || $(formCssSelector);
        return form;
    };
    return {
        getForm : getForm,
        getFormCssSelector : function() {
            return formCssSelector;
        },
        // Make a normal form an ajax form
        create : function(params) {
            if (!params.hasOwnProperty('formCssSelector')) alert('Need a param named formCssSelector');
            formCssSelector = params.formCssSelector;
            
            // Register a 'submit' event listener on the form to perform the AJAX POST
            getForm().on('submit', function(e) {
                e.preventDefault();

                var response = gbili.event.trigger(formCssSelector + '.submit?', {target: this,});
                if (false === response.pop()) {
                    return;
                }

                // Perform the submit
                //$.fn.ajaxSubmit.debug = true;
                $(this).ajaxSubmit({
                    beforeSubmit: function(arr, $form, options) {
                        arr.unshift({name:'isAjax', value: '1'})
                        gbili.event.trigger(formCssSelector + '.submit.before', {
                            target: this, 
                            params: {arr: arr, $form: $form, options: options}
                        });
                    },
                    success: function (response, statusText, xhr, $form) {
                        // Reset file input to avoid sending same file

                        gbili.event.trigger(formCssSelector + '.submit.success', {
                            target: this, 
                            params: {
                                response: response,
                            },
                        });
                        gbili.event.trigger(formCssSelector + '.submit.success.after', {target: this,});
                        gbili.event.trigger(formCssSelector + '.submit.after', {target: this,});
                    },
                    error: function(a, b, c) {
                        // NOTE: This callback is *not* called when the form is invalid.
                        // It is called when the browser is unable to initiate or complete the ajax submit.
                        // You will need to handle validation errors in the 'success' callback.
                        gbili.event.trigger(formCssSelector + '.submit.fail', {target: this,});
                        gbili.event.trigger(formCssSelector + '.submit.after', {target: this,});
                    }
                });

                gbili.event.trigger(formCssSelector + '.submit.start', {target: this,}).pop();
            });

            if (params.hasOwnProperty('register012ResponseStatus')) {
                params.register012ResponseStatus && this.register012ResponseStatusEvents(1);
            } else {
                this.register012ResponseStatusEvents(1);
            }
        },
        // Listen to submit.success and trigger reponse specific events
        register012ResponseStatusEvents : function(priority) {
            if (typeof priority === 'undefined') priority=10;
            gbili.event.addListener(formCssSelector + '.submit.success', function(event) {
                var eventName;
                var status = event.params.response.status;
                var statusToName = [];
                statusToName[0] = '.response.valid.fail';
                statusToName[1] = '.response.valid.success';
                statusToName[2] = '.response.valid.partial';

                eventName = event.name + (((status in statusToName) && statusToName[status]) || '.response.notValid');

                gbili.event.trigger(eventName, {target: event.target, params: event.params});
            }, priority);
        },
    };
}();
