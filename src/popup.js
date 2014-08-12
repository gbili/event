gbili = gbili || {};
gbili.popup = function() {
    var containerCssSelector,
        container,
        buttonHidePopup,
        buttonShowPopup;

    //gbili.upm.popup.show
    var show = function() {
         if (getContainer().hasClass('hidden')) {
             getContainer().removeClass('hidden');
         }
    };

    //gbiliUploaderHideUploadPopup
    var hide = function() {
        if (!getContainer().hasClass('hidden')) {
            getContainer().attr('class', getContainer().attr('class') + ' hidden'); 
        }
    };

    //gbiliUploaderHideAndResetPopup
    var reset = function() {
        hide();
        //remove alerts
        $(containerCssSelector + ' .alert').remove();
        // TODO depends on progressBar
        gbili.upm.progressBar.reset();
    };

    var initButtonHide = function() {
        getButtonHide().on('click', reset); 
    }; 
    var initButtonShow = function() {
        getButtonShow().on('click', show); 
    }; 

    var getContainer = function(refresh) {
        container = (!refresh && container) || $(getContainerCssSelector());
        return container;
    };

    var setContainerCssSelector = function(selector) {
        containerCssSelector = selector;
    };
    var getContainerCssSelector = function() {
        if (!containerCssSelector) alert('containerCssSelector popup not set'); 
        return containerCssSelector;
    };

    var setButtonHideCssSelector = function(selector) {
        buttonHidePopup = $(selector);
    };
    var getButtonHide = function() {
        if (!buttonHidePopup) alert('Button Hide popup not set'); 
        return buttonHidePopup;
    };

    var setButtonShowCssSelector = function(selector) {
        buttonShowPopup = $(selector);
    };
    var getButtonShow = function() {
        if (!buttonShowPopup) alert('Button Show popup not set'); 
        return buttonShowPopup;
    };
    return {
        hide: hide,
        show: show,
        reset: reset,

        initButtonHide : initButtonHide,

        setContainerCssSelector : setContainerCssSelector,
        getContainerCssSelector : getContainerCssSelector,

        setButtonHideCssSelector : setButtonHideCssSelector,
        getButtonHide : getButtonHide,
        setButtonShowCssSelector : setButtonShowCssSelector,
        getButtonShow : getButtonShow,

        init: function(config) {
            if (!config.hasOwnProperty('containerCssSelector')) alert('Need to pass containerCssSelector');
            setContainerCssSelector(config.containerCssSelector);

            if (config.hasOwnProperty('buttonHideCssSelector')) setButtonHideCssSelector(config.buttonHideCssSelector);
            if (config.hasOwnProperty('buttonShowCssSelector')) setButtonShowCssSelector(config.buttonShowCssSelector);
            
            initButtonShow();
            initButtonHide();
        },
    };
}();
