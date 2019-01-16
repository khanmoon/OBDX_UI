define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "ojL10n!resources/nls/set-sms-banking-pin",
    "./model",
    "ojs/ojbutton",
    "ojs/ojvalidation",
    "ojs/ojinputtext"
], function (oj, ko, $, ResourceBundle,Model) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.resource = ResourceBundle;
        self.commonResource = ResourceBundle;
        rootParams.dashboard.headerName(self.resource.header);
        self.maxlength = self.maxlength || ko.observable(4);
        self.setPin = ko.observable();
        self.confirmPin = ko.observable();
        self.invalidTracker = ko.observable();
        rootParams.baseModel.registerElement("modal-window");
        rootParams.baseModel.registerElement("confirm-screen");

        $("#setPin").ready(function () {
            $("#setPin").find(".input").attr("type","tel");
        });
        /**
        *This is the click handler to call success popup
        *@function showSucccess
        *@return {void}
        */
        self.showSucccess = function () {
            $("#successPinSetup").trigger("openModal");
        };
        /**
        *This is the click handler for the ok button of the succes popup
        *@function hideWarning
        *@return {void}
        */
        self.hideWarning = function () {
            $("#successPinSetup").hide();
            rootParams.dashboard.openDashBoard();
        };
        /**
        *This is a click handler for confirm button
        *@function setPinProceed
        *@return {void}
        */
        self.setPinProceed = function () {
          if (!rootParams.baseModel.showComponentValidationErrors(self.invalidTracker())) {
            return;
          }
            if (self.setPin()===self.confirmPin()) {
              var payload = {"pin":self.setPin()};
              payload = ko.mapping.toJSON(payload);
              Model.smsbankingpinRegistration(payload).then(function(){
                self.showSucccess();
              });
            }else{
              rootParams.baseModel.showMessages(null, [self.resource.pinDidntMatch], "ERROR");
            }
        };
        /**
        *This function navigates backs
        *@function back
        *@return {void}
        */
        self.back = function () {
            rootParams.dashboard.hideDetails();
        };
    };
});
