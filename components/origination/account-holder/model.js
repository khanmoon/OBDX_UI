define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  return function AccountHolderModel() {

    var Model = function() {

        this.isCompleting = true;
        this.disableInputs = false;
        this.savingsHolderConfiguration = {
          partyId: {
            value: ""
          },
          submissionId: "",
          offerId: "",
          offerCurrency: "",
          accountHolderPreferenceDTO: [{
            debitCardRequired: false,
            embossName: "",
            cardType: "",
            chequeBookRequired: false,
            chequeBookLeaves: "",
            statementRequired: false,
            statementFrequency: ""
          }]

        };
        this.selectedValues = {
          chequeBookLeaves: "",
          statementFrequency: "",
          cardType: ""
        };
      },

      modelInitialized = false,

      baseService = BaseService.getInstance(),
      /* variable to make sure that in case there is no change
       * in model no additional fetch requests are fired.*/
      submissionId,
      applicantId,
      fetchCardTypeListDeferred,
      fetchCardTypeList = function(submissionId, applicantId, deferred) {
        var params = {
            submissionId: submissionId,
            applicantId: applicantId
          },
          options = {
            url: "submissions/{submissionId}/applicants/{applicantId}/accountConfiguration/debitCard",
            success: function(data) {
              deferred.resolve(data);
            }
          };
        baseService.fetch(options, params);
      },
      getCardDesignListDeferred,
      getCardDesignList = function(deferred) {
        var options = {
          url: "enumerations/cardProducts?cardType=D",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      getStatementFrequencyTypeDeferred,
      getStatementFrequencyType = function(deferred) {
        var options = {
          url: "enumerations/frequency?for=statementFrequency",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      getNumberOfLeavesListDeferred,
      getNumberOfLeavesList = function(deferred) {
        var options = {
          url: "enumerations/originationChequeBookLeaves",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      saveAccountConfigurationDeferred,
      saveAccountConfiguration = function(submissionId, applicantId, model, deferred) {
        var params = {
            submissionId: submissionId,
            applicantId: applicantId
          },
          options = {
            url: "submissions/{submissionId}/applicants/{applicantId}/accountConfiguration/holderPreference",
            data: model,
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };
        baseService.add(options, params);
      },
      getExistingAccountConfigDeferred,
      getExistingAccountConfig = function(submissionId, applicantId, deferred) {
        var params = {
            submissionId: submissionId,
            applicantId: applicantId
          },
          options = {
            url: "submissions/{submissionId}/applicants/{applicantId}/accountConfiguration",
            success: function(data) {
              deferred.resolve(data);
            }
          };
        baseService.fetch(options, params);
      },
      getDocumentDeffered,
      fetchDocumentsByteArray = function(documentUrl, ownerId, deferred) {
        var params = {
          documentUrl: documentUrl,
          mediaType: "media",
          ownerId: ownerId
        };
        var options = {
          url: "contents/{documentUrl}?alt={mediaType}&ownerId={ownerId}",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.downloadFile(options, params);
      },
      getDocumentInfoDeffered,
      getDocumentInfo = function(documentId, index, ownerId, deferred) {
        var params = {
          documentId: documentId,
          ownerId: ownerId
        };
        var options = {
          url: "contents/{documentId}?alt={mediaType}&ownerId={ownerId}",
          success: function(data) {
            deferred.resolve(data, index);
          }
        };
        baseService.fetch(options, params);
      },

      fireBatchDeferred,
      fireBatch = function(batchData, deferred) {
        var options = {
          headers: {
            "BATCH_ID": ((Math.random() * 1000000000000) + 1).toString()
          },
          url: "batch/",

          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

        baseService.batch(options, {}, batchData);
      },
      uploadImage = function(form, index, ownerId, successHandler, errorHandler) {
        var options = {
          url: "contents",
          formData: form,
          success: function(data) {
            successHandler(data, index, ownerId);
          },
          error: function(data) {
            errorHandler(data);
          }
        };
        baseService.uploadFile(options);
      },

      errors = {
        InitializationException: (function() {
          var message = "";

          message += "\nObject can't be initialized without a valid submission Id. ";
          message += "\nPlease make sure the submission id is present.";
          message += "\nProper initialization has to be:";
          message += "\n\n\tModelName.init(\"SubId\"[, \"ApplicantId\"]);";
          return message;
        }()),
        InvalidApplicantId: (function() {
          var message = "";

          message += "\nNo applicant id found, please make sure applicant id is present while initializing the model. ";
          message += "\nProper initialization has to be: ";
          message += "\n\n\tModelName.init(\"SubId\"[, \"ApplicantId\"]);";
          return message;
        }()),
        ObjectNotInitialized: (function() {
          var message = "";

          message += "\nModel has not been initialized. Please initialize the model before setting properties. ";
          message += "\nProper initialization has to be: ";
          message += "\n\n\tModelName.init(\"SubId\"[, \"ApplicantId\"]);";
          return message;
        }())
      },
      objectInitializedCheck = function() {
        if (!modelInitialized) {
          throw new Error(errors.ObjectNotInitialized);
        }
      };

    return {
      init: function(subId, applId) {
        submissionId = subId || undefined;
        applicantId = applId || undefined;

        if (!submissionId) {
          throw new Error(errors.InitializationException);
        }

        if (!applicantId) {
          throw new Error(errors.InvalidApplicantId);
        }

        modelInitialized = true;
        return modelInitialized;
      },
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      getCardTypeList: function(submissionId, applicantId) {
        objectInitializedCheck();
        fetchCardTypeListDeferred = $.Deferred();
        fetchCardTypeList(submissionId, applicantId, fetchCardTypeListDeferred);
        return fetchCardTypeListDeferred;
      },
      getNumberOfLeavesList: function() {
        objectInitializedCheck();
        getNumberOfLeavesListDeferred = $.Deferred();
        getNumberOfLeavesList(getNumberOfLeavesListDeferred);
        return getNumberOfLeavesListDeferred;
      },
      getExistingAccountConfig: function(submissionId, applicantId) {
        objectInitializedCheck();
        getExistingAccountConfigDeferred = $.Deferred();
        getExistingAccountConfig(submissionId, applicantId, getExistingAccountConfigDeferred);
        return getExistingAccountConfigDeferred;
      },
      uploadDocument: function(uploadedInputStream, documenttypeId, documentNature, ownerId, index, successHandler, errorHandler) {
        var formData = new FormData();
        formData.append("file", uploadedInputStream);
        formData.append("documentTypeId", documenttypeId);
        formData.append("documentNatureType", documentNature);
        formData.append("ownerId", ownerId);
        uploadImage(formData, index, ownerId, successHandler, errorHandler);

      },
      fetchDocumentsByteArray: function(documentUrl, ownerId) {
        objectInitializedCheck();
        getDocumentDeffered = $.Deferred();
        fetchDocumentsByteArray(documentUrl, ownerId, getDocumentDeffered);
        return getDocumentDeffered;
      },
      getDocumentInfo: function(documentId, index, ownerId) {
        objectInitializedCheck();
        getDocumentInfoDeffered = $.Deferred();
        getDocumentInfo(documentId, index, ownerId, getDocumentInfoDeffered);
        return getDocumentInfoDeffered;
      },
      getCardDesignList: function() {
        objectInitializedCheck();
        getCardDesignListDeferred = $.Deferred();
        getCardDesignList(getCardDesignListDeferred);
        return getCardDesignListDeferred;
      },
      getStatementFrequencyType: function() {
        objectInitializedCheck();
        getStatementFrequencyTypeDeferred = $.Deferred();
        getStatementFrequencyType(getStatementFrequencyTypeDeferred);
        return getStatementFrequencyTypeDeferred;
      },
      saveAccountConfiguration: function(submissionId, applicantId, model) {
        objectInitializedCheck();
        saveAccountConfigurationDeferred = $.Deferred();
        saveAccountConfiguration(submissionId, applicantId, model, saveAccountConfigurationDeferred);
        return saveAccountConfigurationDeferred;
      },
      fireBatch: function(batchData) {
        objectInitializedCheck();
        fireBatchDeferred = $.Deferred();
        fireBatch(batchData, fireBatchDeferred);
        return fireBatchDeferred;
      }

    };
  };

});