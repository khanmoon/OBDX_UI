define(
  ["jquery",
    "baseService"
  ],
  function($, BaseService) {
    "use strict";
    return function CardPreferenceModel() {
      var Model = function() {
          this.cardHolderPreferences = {};
        },
        baseService = BaseService.getInstance(),
        fetchBgContentIdsDeferred,
        fetchBgContentIds = function(submissionId, payload, deferred) {
          var options = {
            url: "submissions/" + submissionId + "/creditCardApplications/backGroundContent",
            data: JSON.stringify(payload),
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };
          baseService.add(options);
        },
        fetchSalutationsDeferred,
        fetchSalutations = function(deferred) {
          var options = {
            url: "enumerations/salutation?for=primary",
            success: function(data) {
              deferred.resolve(data);
            }
          };
          baseService.fetch(options);
        },
        fetchCardHolderPreferencesDeferred,
        fetchCardHolderPreferences = function(submissionId, applicationId, deferred) {
          var options = {
            url: "submissions/" + submissionId + "/applications/" + applicationId + "/cardHolderPreferences",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };
          baseService.fetch(options);
        },
        updateCardHolderPreferencesDeferred,
        updateCardHolderPreferences = function(submissionId, applicationId, payload, deferred) {
          var params = {
              submissionId: submissionId,
              applicationId: applicationId
            },
            options = {
              url: "submissions/" + submissionId + "/applications/" + applicationId + "/cardHolderPreferences",
              data: payload,
              success: function(data) {
                deferred.resolve(data);
              },
              error: function(data) {
                deferred.reject(data);
              }
            };
          baseService.update(options, params);
        },
        getDocumentDeffered,
        fetchDocumentsByteArray = function(documentUrl, ownerId, deferred) {
          var params = {
            documentUrl: documentUrl,
            mediaType: "media",
            ownerId: ownerId
          };
          var options = {
            url: "contents/{documentUrl}?alt={mediaType}&ownerId={ownerId}&transactionType=OR",
            success: function(data) {
              deferred.resolve(data);
            }
          };
          baseService.downloadFile(options, params);
        },
        getDocumentInfoDeffered,
        getDocumentInfo = function(documentId, ownerId, deferred) {
          var params = {
            documentId: documentId,
            ownerId: ownerId
          };
          var options = {
            url: "contents/{documentId}?ownerId={ownerId}&transactionType=OR",
            success: function(data) {
              deferred.resolve(data);
            }
          };
          baseService.fetch(options, params);
        },
        uploadDocumentDeferred,
        uploadDocument = function(form, deferred) {
          var options = {
            url: "contents",
            formData: form,
            success: function(data) {
              deferred.resolve(data);
            }
          };
          baseService.uploadFile(options);
        };
      return {
        getNewModel: function(modelData) {
          return new Model(modelData);
        },
        uploadDocument: function(form) {
          uploadDocumentDeferred = $.Deferred();
          uploadDocument(form, uploadDocumentDeferred);
          return uploadDocumentDeferred;
        },
        fetchBgContentIds: function(submissionId, payLoad) {
          fetchBgContentIdsDeferred = $.Deferred();
          fetchBgContentIds(submissionId, payLoad, fetchBgContentIdsDeferred);
          return fetchBgContentIdsDeferred;
        },
        updateCardHolderPreferences: function(submissionId, applicationId, payload) {
          updateCardHolderPreferencesDeferred = $.Deferred();
          updateCardHolderPreferences(submissionId, applicationId, payload, updateCardHolderPreferencesDeferred);
          return updateCardHolderPreferencesDeferred;
        },
        getSalutations: function() {
          fetchSalutationsDeferred = $.Deferred();
          fetchSalutations(fetchSalutationsDeferred);
          return fetchSalutationsDeferred;
        },
        fetchDocumentsByteArray: function(documentUrl, ownerId) {
          getDocumentDeffered = $.Deferred();
          fetchDocumentsByteArray(documentUrl, ownerId, getDocumentDeffered);
          return getDocumentDeffered;
        },
        getDocumentInfo: function(documentId, ownerId) {
          getDocumentInfoDeffered = $.Deferred();
          getDocumentInfo(documentId, ownerId, getDocumentInfoDeffered);
          return getDocumentInfoDeffered;
        },
        fetchCardHolderPreferences: function(submissionId, applicationId) {
          fetchCardHolderPreferencesDeferred = $.Deferred();
          fetchCardHolderPreferences(submissionId, applicationId, fetchCardHolderPreferencesDeferred);
          return fetchCardHolderPreferencesDeferred;
        }
      };
    };
  });