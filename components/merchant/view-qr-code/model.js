define(["baseService", "jquery"], function(BaseService, $) {
  "use strict";
  var qrCodeModel = function() {
    var baseService = BaseService.getInstance();
    var downloadMerchantQRCodeDeferred, downloadMerchantQRCode = function(deferred, merchantCode) {
      var options = {
        url: "payments/transfers/qrCode/merchants/{merchantCode}?download=true",

        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };
      baseService.downloadFile(options, {
        merchantCode: merchantCode
      });
    };
    return {
      getMerchantQRCode: function(merchantCode) {
        var options = {
          url: "payments/transfers/qrCode/merchants/{merchantCode}?download=false",
          dataType: "text"
        };
        return baseService.fetch(options, {
          merchantCode: merchantCode
        });
      },
      downloadMerchantQRCode: function(merchantCode) {
        downloadMerchantQRCodeDeferred = $.Deferred();
        downloadMerchantQRCode(downloadMerchantQRCodeDeferred, merchantCode);
        return downloadMerchantQRCodeDeferred;
      }
    };
  };
  return new qrCodeModel();
});