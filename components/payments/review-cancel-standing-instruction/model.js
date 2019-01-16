define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var cancelInstructionModel = function() {
    var baseService = BaseService.getInstance(),
      readInstructionDetailsDeferred, readInstructionDetails = function(extRefId, deferred) {
        var options = {
            url: "payments/instructions?status=ACTIVE&externalReferenceId=" + extRefId,
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            externalReferenceId: extRefId
          };
        baseService.fetch(options, params);
      };
    return {
      readInstructionDetails: function(extRefId) {
        readInstructionDetailsDeferred = $.Deferred();
        readInstructionDetails(extRefId, readInstructionDetailsDeferred);
        return readInstructionDetailsDeferred;
      }
    };
  };
  return new cancelInstructionModel();
});