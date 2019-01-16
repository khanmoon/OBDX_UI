define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var MessageDetailModel = function() {
    var baseService = BaseService.getInstance(),
      replyMailDeferred, replyMail = function(payload, linkedParentMessageId, deferred) {

        var params = {
            "payload": payload
          },
          options = {
            url: "mailbox/mails/" + linkedParentMessageId + "/replyMail",
            data: payload,
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };
        baseService.add(options, params);
      },
      fireBatchDeferred, fireBatch = function(deferred, batchRequest, type) {
        var options = {
          url: "batch",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.batch(options, {
          type: type
        }, batchRequest);
      },

      uploadDocumentDeferred, uploadDocument = function(form, deferred) {
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
      },
      downloadDocumentDeffered,
      downloadDocument = function(contentId, deferred) {
        var params = {
          contentId: contentId,
          media: "media"
        };
        var options = {
          url: "contents/{contentId}?alt={media}&transactionType=IM",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.downloadFile(options, params);
      };
    return {
      replyMail: function(payload, linkedParentMessageId) {
        replyMailDeferred = $.Deferred();
        replyMail(payload, linkedParentMessageId, replyMailDeferred);
        return replyMailDeferred;
      },
      uploadDocument: function(form) {
        uploadDocumentDeferred = $.Deferred();
        uploadDocument(form, uploadDocumentDeferred);
        return uploadDocumentDeferred;
      },
      deleteDocument: function(contentId) {
        deleteDocumentDeferred = $.Deferred();
        deleteDocument(contentId, deleteDocumentDeferred);
        return deleteDocumentDeferred;
      },
      downloadDocument: function(contentId) {
        downloadDocumentDeffered = $.Deferred();
        downloadDocument(contentId, downloadDocumentDeffered);
        return downloadDocumentDeffered;
      },
      fireBatch: function(batchRequest, type) {
        fireBatchDeferred = $.Deferred();
        fireBatch(fireBatchDeferred, batchRequest, type);
        return fireBatchDeferred;
      }
    };
  };
  return new MessageDetailModel();
});
