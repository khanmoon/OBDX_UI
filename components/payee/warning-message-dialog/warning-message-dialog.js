define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "ojL10n!resources/nls/warning-message-dialog",
    "framework/js/constants/constants",
    "ojs/ojbutton"
], function(oj, ko, $, ResourceBundle, Constants) {
    "use strict";
    return function(Params) {
        var self = this;
        ko.utils.extend(self, Params.rootModel);
        self.userSegment = Constants.userSegment;
        self.payments = ResourceBundle.payments;
        Params.baseModel.registerElement("modal-window");
        self.yes = function() {
            $("#warningDialog").hide();
            history.back();
        };
        self.no = function() {
            $("#warningDialog").hide();
        };
        // eslint-disable-next-line no-empty-function
        self.dispose = function(){};
    };
});