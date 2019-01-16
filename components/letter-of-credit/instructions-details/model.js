define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var InstructionsDetailsModel = function() {
    var baseService = BaseService.getInstance();
    var getBankDetailsBICDeferred, getBankDetailsBIC = function(code, deferred) {
      var options = {
          url: "financialInstitution/bicCodeDetails/{BICCode}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          "BICCode": code
        };
      baseService.fetch(options, params);
    };
    return {
      getBankDetailsBIC: function(code) {
        getBankDetailsBICDeferred = $.Deferred();
        getBankDetailsBIC(code, getBankDetailsBICDeferred);
        return getBankDetailsBICDeferred;
      }
    };
  };
  return new InstructionsDetailsModel();
});