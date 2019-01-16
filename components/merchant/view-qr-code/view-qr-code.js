define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "./model",
    "ojL10n!resources/nls/view-qr-code"
], function (oj, ko, $, Model, ResourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.resource = ResourceBundle;
        self.merchantCode = rootParams.id;
        self.download = function () {
            Model.downloadMerchantQRCode(self.merchantCode).fail(function () {
                self.showMessage(null, [self.resource.coudntdownloadImage], "ERROR");
            });
        };
        Model.getMerchantQRCode(self.merchantCode).then(function (data) {
            $("#qrCodeImage").html("<img alt=\"" + self.resource.qrCodeImageOfMerchant + "\" title=\"" + self.resource.qrCodeImage + "\" src=\"data:image/png;base64," + data + "\" />");
        }).catch(function () {
            rootParams.baseModel.showMessages(null, [self.resource.coudntloadImage], "ERROR");
        });
    };
});