define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  return function BasicPrimaryInfoModel() {

    var Model = function(model) {
        this.primaryInfo = {
          salutation: model && model.salutation ? model.salutation : "",
          firstName: model && model.firstName ? model.firstName : "",
          middleName: (model && model.middleName) ? model.middleName : null,
          lastName: model && model.lastName ? model.lastName : "",
          otherSalutation: model && model.otherSalutation ? model.otherSalutation : "",
          suffix: (model && model.suffix) ? model.suffix : "",
          birthDate: model && model.birthDate ? model.birthDate : "",
          noOfDependants: model && model.noOfDependants ? model.noOfDependants : "",
          citizenship: model && model.citizenship ? model.citizenship : "",
          isPermanentResidence: model && model.isPermanentResidence ? model.isPermanentResidence : true,
          residentCountry: model && model.residentCountry ? model.residentCountry : "",
          email: (model && model.email) ? model.email : ""
        };
        this.registrationInfo = {
          securityQuestion: "",
          securityAnswer: ""
        };
        this.isCompleting = true;
        this.adConsent = false;
        this.disableInputs = false;
        this.selectedValues = {
          salutation: "",
          otherSalutation: "",
          suffix: ""
        };
      },
      modelInitialized = false,
      baseService = BaseService.getInstance(),
      /* variable to make sure that in case there is no change
       * in model no additional fetch requests are fired.*/
      submissionId,
      fetchSuffixesDeferred,
      /**
       * Private method to fetch enumerations for Suffixes. This
       * method will resolve a passed deferred object, which can be returned from calling
       * function to the parent.
       *
       * @function fetchSuffixes
       * @memberOf PrimaryInfoModel
       * @private
       * @param {object} deferred description
       * @return {void}          description
       */
      fetchSuffixes = function(deferred) {
        var options = {
          url: "enumerations/suffix",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },

      /**
       * Private method to fetch enumerations for listed marital statuses. This
       * method will resolve a passed deferred object, which can be returned from calling
       * function to the parent.
       *
       * @function fetchOtherSalutations
       * @memberOf BasicPrimaryInfoModel
       * @private
       */
      fetchSalutationsDeferred, fetchSalutations = function(deferred) {
        var options = {
          url: "enumerations/salutation?for=primary",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      fetchOtherSalutationsDeferred,
      fetchOtherSalutations = function(deferred) {
        var options = {
          url: "enumerations/salutation?for=others",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      readApplicantDeferred, readApplicant = function(deferred) {
        var params = {
            submissionId: submissionId
          },
          options = {
            url: "submissions/{submissionId}/applicants",
            success: function(data) {
              deferred.resolve(data);
            }
          };
        baseService.fetch(options, params);
      },
      updateApplicantDeferred, updateApplicant = function(model, deferred) {
        var params = {
            submissionId: submissionId
          },
          options = {
            url: "submissions/{submissionId}/applicants",
            data: model,
            success: function(data) {
              deferred.resolve(data);
            }
          },
          modelData = JSON.parse(model);
        if (modelData && modelData.applicantId && modelData.applicantId.length > 0) {
          options.url = "submissions/{submissionId}/applicants/{applicantId}";
          params.applicantId = modelData.applicantId;
          baseService.update(options, params);
        } else {
          baseService.add(options, params);
        }
      };
    return {
      init: function(subId) {
        submissionId = subId || undefined;
        modelInitialized = true;
        return modelInitialized;
      },
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      /**
       * Public method to save passed primary info model, and create record for an applicant
       * in our application. This method will instantiate a new deferred object and will
       * return the same to the callee function which will be resolved after call completion
       * with appropriate data and developer can use .then(handler) to handle the data.
       *
       * @function readApplicant
       * @memberOf PrimaryInfoModel
       * @returns {object} deferredObject
       * @example
       * PrimaryInfoModel.createApplicant(applicantModel).then(function (data) {
       *
       * });
       */
      readApplicant: function() {
        readApplicantDeferred = $.Deferred();
        readApplicant(readApplicantDeferred);
        return readApplicantDeferred;
      },
      updateApplicant: function(model) {
        updateApplicantDeferred = $.Deferred();
        updateApplicant(model, updateApplicantDeferred);
        return updateApplicantDeferred;
      },


      /**
       * Public method to fetch enumeration for salutations. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function getSalutations
       * @memberOf PrimaryInfoModel
       * @returns {object} deferredObject
       * @example
       * PrimaryInfoModel.getSalutations().then(function (data) {
       *
       * });
       */
      fetchSuffixes: function() {
        fetchSuffixesDeferred = $.Deferred();
        fetchSuffixes(fetchSuffixesDeferred);
        return fetchSuffixesDeferred;
      },
      /**
       * Public method to fetch enumeration for salutations. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function getOtherSalutations
       * @memberOf PrimaryInfoModel
       * @returns {object} deferredObject
       * @example
       * PrimaryInfoModel.getSalutations().then(function (data) {
       *
       * });
       */

      getSalutations: function() {
        fetchSalutationsDeferred = $.Deferred();
        fetchSalutations(fetchSalutationsDeferred);
        return fetchSalutationsDeferred;
      },
      getOtherSalutations: function() {
        fetchOtherSalutationsDeferred = $.Deferred();
        fetchOtherSalutations(fetchOtherSalutationsDeferred);
        return fetchOtherSalutationsDeferred;
      }
    };
  };
});
