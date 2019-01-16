define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "ojL10n!resources/nls/confirm-pin",
    "ojs/ojbutton"
], function (oj, ko, $, ResourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.resource = ResourceBundle;
        rootParams.dashboard.headerName(self.resource.confirmPin);
        $("#confirmPin").ready(function () {
            $("#confirmPin").attr("type", "tel");
        });

        self.confirmPinProceed = function (event) {
            if (event.detail.value.length === self.params.maxlength()) {
                if (self.params.setPin() === event.detail.value) {
                    self.registerDevice().then(function () {
                        self.enrollUser(self.params.JWTToken);
                    });
                } else {
                  rootParams.baseModel.showMessages(null, [self.resource.pinDidntMatch], "ERROR");
                  $(".set-pin-input").find("input").val("");
                }
            }
        };

    };
});
