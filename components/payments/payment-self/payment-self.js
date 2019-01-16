define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "ojs/ojknockout"
], function (oj, ko) {
    "use strict";
    return function (Params) {
        var self = this;
        ko.utils.extend(self, Params.rootModel);
        Params.baseModel.registerComponent("review-payment-self", "payments");
        if (self.stageTwo()) {
            var transferData = {
                header: Params.dashboard.headerName(),
                reviewMode: true
            };
            if (self.transferOn() === "later")
                transferData.instructionId = self.paymentId();
            else if (self.transferOn() === "now")
                transferData.paymentId = self.paymentId();
            Params.dashboard.loadComponent("review-payment-self", {
                transferData: transferData,
                retainedData: self
            }, self);
        }
    };
});