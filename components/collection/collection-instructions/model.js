define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var baseService = BaseService.getInstance();
  var InstructionsDetailsModel = function() {
    var getBillInstructionsDefered, getBillInstructions = function(deferred) {
      var options = {
        url: "bills/instructions",
        success: function(data) {
          deferred.resolve(data);
        }
      };
      baseService.fetch(options);
    };
    return {
      getBillInstructions: function() {
        getBillInstructionsDefered = $.Deferred();
        getBillInstructions(getBillInstructionsDefered);
        return getBillInstructionsDefered;
      }
    };
  };
  return new InstructionsDetailsModel();
});