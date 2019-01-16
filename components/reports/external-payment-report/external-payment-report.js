define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/external-payment-report",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox"
], function (oj, ko, $, externalPaymentReportModel, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.validationTracker = rootParams.validationTracker;
        self.Nls = resourceBundle.externalPaymentReport;
        self.suggestions = function (context) {
            return new Promise(function (fulfill) {
                var options = [];
                if (context.term === "") {
                    fulfill(options);
                    return;
                }
                if (context.term) {
                    var code = encodeURIComponent(context.term);
                    externalPaymentReportModel.listMerchant(code).done(function (data) {
                        if (data.response.length === 0) {
                            options.push({
                                value: self.Nls.notFound,
                                label: self.Nls.notFound
                            });
                        } else {
                            for (var i = 0; i < data.response.length; i++) {
                                options.push({
                                    value: data.response[i].code,
                                    label: data.response[i].code
                                });
                            }
                        }
                        fulfill(options);
                    });
                }
            });
        };
         self.merchantCodeSelected = function(event) {
      if (event.detail.value) {
        $("#merchantCode").val(event.detail.value);
      }
    };
    };
});