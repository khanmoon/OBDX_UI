define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "ojL10n!resources/nls/set-wearable-pin",
    "ojs/ojbutton",
    "ojs/ojvalidation",
    "ojs/ojinputtext"
], function (oj, ko, $, ResourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.resource = ResourceBundle[rootParams.data.type];
        self.commonResource = ResourceBundle.common;
        rootParams.dashboard.headerName(self.resource.header);
        self.maxlength = self.maxlength || ko.observable(4);
        self.setPin = ko.observable();
        rootParams.baseModel.registerElement("modal-window");
        rootParams.baseModel.registerElement("confirm-screen");

        $("#setPin").ready(function () {
            $("#setPin").find("input").attr("type", "tel");
        });
        /**
        *This this is the click handler for the proceed button.
        *@function goToWearableSetPinviaSecuritySettings
        *@param {Object} event - is the event
        *@return {void}
        */
        self.setPinProceed = function (event) {
            if (event.detail.value.length === self.maxlength()) {
              var re = new RegExp("^([0-9]{4})$");
              if(re.test(event.detail.value)){
                  self.setPin(event.detail.value);
                  rootParams.baseModel.registerComponent("confirm-wearable-pin", "security");
                  rootParams.dashboard.loadComponent("confirm-wearable-pin", {
                      maxlength: self.maxlength,
                      setPin: self.setPin,
                      JWTToken : rootParams.data.JWTToken
                  }, self);
              }else{
                rootParams.baseModel.showMessages(null, [self.commonResource.pinShouldhaveOnlyNumber], "ERROR");
                $(".set-pin").find("input").val("");
              }
            }
        };
        /**
        *This this is the click handler show Warning
        *@function showWarning
        *@return {void}
        */
        self.showWarning = function () {
            $("#backWarning").trigger("openModal");
        };
        /**
        *This this is the click handler hide Warning
        *@function hideWarning
        *@return {void}
        */
        self.hideWarning = function () {
            $("#backWarning").hide();
        };
        /**
        *This this is the click handler for the back button on confirm pin.
        *@function back
        *@return {void}
        */
        self.back = function () {
            rootParams.dashboard.hideDetails();
        };

    };
});
