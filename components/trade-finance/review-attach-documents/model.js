define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var baseService = BaseService.getInstance();
  var ReviewAttachDocModel = function() {
    var getDocumentDeffered, fetchDocumentsByteArray = function(documentUrl, deferred) {
      var params = {
        documentUrl: documentUrl,
        mediaType: "media",
        transactionType: "LC"
      };
      var options = {
        url: "contents/{documentUrl}?transactionType={transactionType}&alt={mediaType}",
        success: function(data) {
          deferred.resolve(data);
        }
      };
      baseService.downloadFile(options, params);
    };
    return {
      fetchDocumentsByteArray: function(documentUrl) {
        getDocumentDeffered = $.Deferred();
        fetchDocumentsByteArray(documentUrl, getDocumentDeffered);
        return getDocumentDeffered;
      }
    };
  };
  return new ReviewAttachDocModel();
});