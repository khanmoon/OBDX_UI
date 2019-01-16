define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var ComposeMailModel = function() {
    var baseService = BaseService.getInstance();
    var uploadDocumentDeferred,
      uploadDocument = function(form, deferred) {
        var options = {
          url: "contents?transactionType=IM",
          selfLoader: true,
          formData: form,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function() {
            deferred.reject();
          }
        };
        baseService.uploadFile(options);
      },
      deleteDocumentDeferred,
      deleteDocument = function(contentId, deferred) {
        var params = {
            contentId: contentId
          },
          options = {
            url: "contents/{contentId}?transactionType=IM",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function() {
              deferred.reject();
            }
          };
        baseService.remove(options, params);
      };
    return {
      fetchCategoryOptions: function() {
        var options = {
          url: "mailCategories"
        };
        return baseService.fetch(options);
      },
      uploadDocument: function(form) {
        uploadDocumentDeferred = $.Deferred();
        uploadDocument(form, uploadDocumentDeferred);
        return uploadDocumentDeferred;
      },
      fetchPartyOptions1: function() {
        var options = {
          url: "me/party"
        };
        return baseService.fetch(options);
      },
      fetchPartyOptions2: function() {
        var options = {
          url: "me/party/relations"
        };
        return baseService.fetch(options);
      },
      sendMail: function(payload) {
        var params = {
            "payload": payload
          },
          options = {
            url: "mailbox/mails",
            data: payload
          };
        return baseService.add(options, params);
      },
      deleteDocument: function(contentId) {
        deleteDocumentDeferred = $.Deferred();
        deleteDocument(contentId, deleteDocumentDeferred);
        return deleteDocumentDeferred;
      }
    };
  };
  return new ComposeMailModel();
});
