define([
  "ojs/ojcore",
  "knockout",
  "jquery",

  "ojL10n!resources/nls/scan-qr",
  "./model"
], function(oj, ko, $, ResourceBundle) {
  "use strict";
  return function(Params) {
    var self = this;
    ko.utils.extend(self, Params.rootModel);
    self.resource = ResourceBundle;
    self.dataLoaded = ko.observable(false);
    self.scan = function() {
      $("#invalidQRPopUp").hide();
      if (Params.baseModel.cordovaDevice()) {
        window.cordova.plugins.barcodeScanner.scan(function(result) {
          if (result.cancelled) {
            Params.dashboard.loadComponent("payment-landing", {}, self);
          } else {
            try {
              var qrObject = JSON.parse(result.text);
              if (qrObject.beneName && qrObject.beneCode) {
                Params.baseModel.registerComponent("scan-to-pay", "payments");
                Params.dashboard.loadComponent("scan-to-pay", qrObject, self);
              } else {
                throw self.resource.invalidQRCode;
              }
            } catch (err) {
              $("#invalidQRPopUp").trigger("openModal");
            }
          }
        }, function() {
          $("#invalidQRPopUp").trigger("openModal");
        }, {
          preferFrontCamera: false,
          showFlipCameraButton: false,
          showTorchButton: true,
          torchOn: false,
          prompt: self.resource.scanQRCodeToPay,
          resultDisplayDuration: 500,
          formats: "QR_CODE,PDF_417",
          orientation: "portrait",
          disableAnimations: true,
          disableSuccessBeep: false
        });
      }
    };
    self.scan();
    self.cancelAndGoBack = function() {
      $("#invalidQRPopUp").hide();
      self.dataLoaded(false);
      if (Params.dashboard.application() === "scan-to-pay") {
        Params.dashboard.switchModule();
      } else {
        history.back();
      }
    };
  };
});
