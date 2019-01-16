define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "ojL10n!resources/nls/wearable-instructions-next",
    "ojs/ojbutton"
], function (oj, ko, $, ResourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.resourceCommon = ResourceBundle;
        self.resource = ResourceBundle[rootParams.baseModel.cordovaDevice()];
        rootParams.dashboard.headerName(self.resourceCommon.header);
        /**
        *This this is the click handler for the proceed button.
        *@function goToWearableSetPinviaSecuritySettings
        *@param {Object} baseModel - is instance of baseModel
        *@param {Object} dashboard - is instance of dashboard
        *@return {void}
        */
        self.goToWearableSetPinviaSecuritySettings=function(baseModel,dashboard){
          window.Wearable.onConnect(function(){
            baseModel.registerComponent("security-landing", "security");
            dashboard.loadComponent("security-landing", {type:"wearableSetPin"}, self);
          },function(error){
            baseModel.showMessages(null, [self.resourceCommon.error[error]], "ERROR");
          });
        };
    };
});
