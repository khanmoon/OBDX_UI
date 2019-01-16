define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "./model",
    "ojL10n!resources/nls/feedback-preference",
    "ojs/ojswitch"
], function (oj, ko, $, Model, ResourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.resource = ResourceBundle;
        rootParams.dashboard.headerName(self.resource.settings);
        self.dataLoaded = ko.observable(false);
        Model.getPreference().then(function (data) {
            self.payload = ko.mapping.fromJS(data);
            self.feedBackEnabledSubscription = self.payload.feedbackEnabled.subscribe(function () {
              delete self.payload.status;
              Model.updatePreference(ko.mapping.toJSON(self.payload));
            });
            self.dataLoaded(true);
        });

        /**
         * self.dispose - is called when the element is out of the DOM
         *
         * @return {void}  returns nothing
         */
        self.dispose = function(){
          if(self.feedBackEnabledSubscription){
            self.feedBackEnabledSubscription.dispose();
          }
        };
    };
});
