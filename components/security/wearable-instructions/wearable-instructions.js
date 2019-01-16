define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "ojL10n!resources/nls/wearable-instructions",
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
        *@function goTonextInstruction
        *@param {Object} baseModel - is instance of baseModel
        *@param {Object} dashboard - is instance of dashboard
        *@return {void}
        */
        self.goTonextInstruction=function(baseModel,dashboard){
          baseModel.registerComponent("wearable-instructions-next", "security");
          dashboard.loadComponent("wearable-instructions-next", {type:"wearableSetPin"}, self);
        };
    };
});
