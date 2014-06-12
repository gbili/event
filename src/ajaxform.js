var gbili = gbili || {};

// Enable ajax on the jQuery object
// Usage: 
//    var myAjaxForm = gbili.getAjaxForm('#my-form');
gbili.ajaxForm = function (){
    var form,
        formCssSelector,
        fileInput;

    return {
        getForm : function() {
            return form;
        },
        getFormCssSelector : function() {
            return formCssSelector;
        },
        getFileInput : function() {
            return fileInput;
        },
        // Make a normal form an ajax form
        create : function(params) {
            if (params.hasOwnProperty('form'))  params.form = $(params.formCssSelector);
            if (params.hasOwnProperty('fileInput')) params.form = $(params.fileInputCssSelector);

            form = params.form;
            formCssSelector = params.formCssSelector;
            fileInput = params.fileInput;

            // Register a 'submit' event listener on the form to perform the AJAX POST
            form.on('submit', function(e) {
                e.preventDefault();

                if (fileInput.var() == '' && gbili.event.trigger(formCssSelector + '.no_file_selected_abort?', {
                        target: fileInput, 
                        params: {form: form,},
                        defaultResponse: true,
                    }).pop()) {
                    return;
                }

                if (false === gbili.event.trigger(formCssSelector + '.submit?', {target: form,}).pop()) {
                    return;
                }

                // Perform the submit
                //$.fn.ajaxSubmit.debug = true;
                $(this).ajaxSubmit({
                    beforeSubmit: function(arr, $form, options) {
                        arr.unshift({name:'isAjax', value: '1'})
                        gbili.event.trigger(formCssSelector + '.submit.before', {
                            target: form, 
                            params: {arr: arr, $form: $form, options: options}
                        });
                    },
                    success: function (response, statusText, xhr, $form) {
                        // Reset file input to avoid sending same file
                        fileInput.replaceWith(fileInput.val('').clone( true ));

                        gbili.event.trigger(formCssSelector + '.submit.success', {
                            target: form, 
                            params: {
                                response: response,
                            },
                        });
                        gbili.event.trigger(formCssSelector + '.submit.success.after', {target: form,});
                    },
                    error: function(a, b, c) {
                        // NOTE: This callback is *not* called when the form is invalid.
                        // It is called when the browser is unable to initiate or complete the ajax submit.
                        // You will need to handle validation errors in the 'success' callback.
                        gbili.event.trigger(formCssSelector + '.submit.fail', {target: form,});
                    }
                    gbili.event.trigger(formCssSelector + '.submit.start', {target: form,}).pop();
                });
            });
            return form;
        },
        // Listen to submit.success and trigger reponse specific events
        register012ResponseStatusEvents : function(priority) {
            if (typeof priority === 'undefined') priority=10;
            gbili.event.addListener(formCssSelector + 'submit.success', function(event) {
                var eventName;
                var status = event.params.response.status;
                var statusToName = [];
                statusToName[0] = '.response.valid.fail';
                statusToName[1] = '.response.valid.success';
                statusToName[2] = '.response.valid.partial';

                eventName = event.name + (((status in statusToName) && statusToName[status]) || '.response.notValid');
                gbili.event.trigger(eventName, event);
            }, priority);
        },
    };
}();
