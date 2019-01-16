/*global define, console*/
define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  /**
   * Main file for Primary Information Model. This file contains the model definition
   * for primary information section and exports the PrimaryInfoModel which can be injected
   * in any framework and developer will, by default get a self aware model for Primary Information Section.<br/><br/>
   * The injected Model Class will have below properties:
   * <ul>
   *      <li>Model for Income Section using [getNewModel()]{@link PrimaryInfoModel.getNewModel}</li>
   *      <li>Service abstractions to fetch all the necessary component level data, which includes:
   *          <ul>
   *              <li>[fetchSalutations()]{@link PrimaryInfoModel.fetchSalutations}</li>
   *              <li>[fetchMaritalStatus()]{@link PrimaryInfoModel.fetchMaritalStatus}</li>
   *              <li>[fetchGender()]{@link PrimaryInfoModel.fetchGender}</li>
   *              <li>[createApplicant()]{@link PrimaryInfoModel.createApplicant}</li>
   *              <li>[updateApplicant()]{@link PrimaryInfoModel.updateApplicant}</li>
   *              <li>[createApplicantContact()]{@link PrimaryInfoModel.createApplicantContact}</li>
   *              <li>[synchronizeRequests()]{@link PrimaryInfoModel.synchronizeRequests}</li>
   *          </ul>
   *      </li>
   * </ul>
   *
   * @namespace PrimaryInfo~PrimaryInfoModel
   * @class PrimaryInfoModel
   * @property {Object} primaryInfo - Object containing the personal Info of the user
   * @property {String} primaryInfo.salutation - User's salutation
   * @property {String} primaryInfo.firstName - User's first name
   * @property {String} primaryInfo.lastName - User's last name
   * @property {String} primaryInfo.birthDate - User's birthdate
   * @property {String} primaryInfo.gender - User's gender
   * @property {String} primaryInfo.maritalStatus - User's marital status
   * @property {Integer} primaryInfo.noOfDependants - Number of dependants for user
   * @property {Array} contacts - Array to store user's contact details
   * @property {Object} contacts[0] - Object containing the contact Info of the user
   * @property {String} contacts[0].contactType - User's contact type
   * @property {String} contacts[0].email - User's email
   */
  return function PrimaryInfoModel() {

    /**
     * In case more than one instance of model is required, eg for main and co-applicant
     * we are declaring model as a function, of which new instances can be created and
     * used when required.
     *
     * @class Model
     * @private
     * @memberOf PrimaryInfoModel
     */
    var Model = function(model) {
        this.primaryInfo = {
          salutation: (model && model.salutation) ? model.salutation : "",
          firstName: (model && model.firstName) ? model.firstName : "",
          middleName: (model && model.middleName) ? model.middleName : null,
          lastName: (model && model.lastName) ? model.lastName : "",
          suffix: (model && model.suffix) ? model.suffix : "",
          birthDate: (model && model.birthDate) ? model.birthDate : "",
          citizenship: (model && model.citizenship) ? model.citizenship : "",
          otherSalutation: (model && model.otherSalutation) ? model.otherSalutation : "",
          isPermanentResidence: true,
          email: (model && model.email) ? model.email : "",
          citizenshipStatus: (model && model.citizenshipStatus) ? model.citizenshipStatus : null
        };

        this.registrationInfo = {
          securityQuestion: null,
          securityAnswer: null
        };
        this.selectedValues = {
          citizenshipStatus: "",
          citizenship: ""
        };
        this.armedForcesMember = "OPTION_NO";
        this.isCompleting = true;
        this.adConsent = false;
        this.disableInputs = false;

      },

      modelInitialized = false,

      baseService = BaseService.getInstance(),

      submissionId,

      applicantId,

      fetchSalutationsDeferred,
      /**
       * Private method to fetch enumerations for listed salutations. This
       * method will resolve a passed deferred object, which can be returned from calling
       * function to the parent.
       *
       * @function fetchSalutations
       * @memberOf PrimaryInfoModel
       * @private
       */
      fetchSalutations = function(deferred) {
        var options = {
          url: "enumerations/salutation?for=primary",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      fetchcitizenshipStatusDeferred,
      fetchcitizenshipStatus = function(deferred) {
        var options = {
          url: "enumerations/citizenshipStatus",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },

      fetchOtherSalutationsDeferred,
      /**
       * Private method to fetch enumerations for listed marital statuses. This
       * method will resolve a passed deferred object, which can be returned from calling
       * function to the parent.
       *
       * @function fetchEmailContacts
       * @memberOf PrimaryInfoModel
       * @private
       */
      fetchOtherSalutations = function(deferred) {
        var options = {
          url: "enumerations/salutation?for=others",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },

      fetchCountriesDeferred,
      /**
       * Private method to fetch enumerations for COUNTRIES. This
       * method will resolve a passed deferred object, which can be returned from calling
       * function to the parent.
       *
       * @function fetchCountries
       * @memberOf PrimaryInfoModel
       * @private
       */
      fetchCountries = function(deferred) {
        var options = {
          url: "enumerations/country",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },

      fetchSuffixesDeferred,
      /**
       * Private method to fetch enumerations for Suffixes. This
       * method will resolve a passed deferred object, which can be returned from calling
       * function to the parent.
       *
       * @function fetchSuffixes
       * @memberOf PrimaryInfoModel
       * @private
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
      fetchApplicantDeferred, fetchpplicantList = function(submissionId, deferred) {
        var params = {
            submissionId: submissionId

          },
          options = {
            url: "submissions/{submissionId}/applicants",

            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };
        baseService.fetch(options, params);
      },

      fetchDocumentListDeferred,
      fetchDocumentList = function(submissionId, applicantId, deferred) {
        var params = {
            submissionId: submissionId,
            applicantId: applicantId
          },
          options = {
            url: "submissions/{submissionId}/applicants/{applicantId}/disclosures",
            selfLoader: true,
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };
        baseService.fetch(options, params);
      },

      saveApplicantDeferred,
      /**
       * Private method to create an applicant based on passed model. Based
       * on the availability or non-availability of liability id attribute
       * on existing model this function will add or update the passed model.
       * This method will resolve a passed deferred object, which can be returned
       * from calling function to the parent.
       *
       * @function createApplicant
       * @memberOf PrimaryInfoModel
       * @private
       */
      saveApplicant = function(model, deferred) {
        var params = {
            submissionId: submissionId

          },
          options = {
            url: "submissions/{submissionId}/applicants/personalInformation",
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
      updateApplicantDeferred, updateApplicant = function(model, deferred) {
        var params = {
            submissionId: submissionId,
            applicantId: applicantId
          },
          options = {
            url: "submissions/{submissionId}/applicants/{applicantId}/personalInformation",
            data: model,
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };
        baseService.update(options, params);
      },
      submitRequirementsDeferred,
      submitRequirements = function(url, submissionId, requirements, deferred) {
        var params = {
            "submissionId": submissionId
          },
          options = {
            url: url,
            data: requirements,
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };
        baseService.add(options, params);
      },


      getOtherDetailsDeferred,
      getOtherDetails = function(deferred) {
        var params = {
          submissionId: submissionId,
          applicantId: applicantId
        };
        var options = {
          url: "submissions/{submissionId}/applicants/{applicantId}/otherDetails",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options, params);
      },
      saveOtherDetailsDeferred,
      saveOtherDetails = function(model, update, deferred) {
        var params = {
            submissionId: submissionId,
            applicantId: applicantId
          },
          options = {
            url: "submissions/{submissionId}/applicants/{applicantId}/otherDetails",
            data: model,
            success: function(data) {
              deferred.resolve(data);
            }
          };

        if (update) {
          baseService.update(options, params);
        } else {
          baseService.add(options, params);
        }
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

      errors = {
        InitializationException: (function() {
          var message = "";
          message += "\nObject can't be initialized without a valid submission Id. ";
          message += "\nPlease make sure the submission id is present.";
          message += "\nProper initialization has to be:";
          message += "\n\n\tModelName.init(\"SubId\", \"ApplicantId\", \"ProfileId\");";
          return message;
        }()),
        InvalidApplicantId: (function() {
          var message = "";

          message += "\nNo applicant id found, please make sure applicant id is present while initializing the model. ";
          message += "\nProper initialization has to be: ";
          message += "\n\n\tModelName.init(\"SubId\", \"ApplicantId\", \"ProfileId\");";
          return message;
        }()),
        InvalidProfileId: (function() {
          var message = "";

          message += "\nNo profile id found, please make sure profile id is present while initializing the model. ";
          message += "\nProper initialization has to be: ";
          message += "\n\n\tModelName.init(\"SubId\", \"ApplicantId\", \"ProfileId\");";
          return message;
        }()),
        ObjectNotInitialized: (function() {
          var message = "";

          message += "\nModel has not been initialized. Please initialize the model before setting/calling properties. ";
          message += "\nProper initialization has to be: ";
          message += "\n\n\tModelName.init(\"SubId\", \"ApplicantId\", \"ProfileId\");";
          return message;
        }())
      },
      objectInitializedCheck = function() {
        if (!modelInitialized) {
          throw new Error(errors.ObjectNotInitialized);
        }
      };

    return {
      /**
       * Method to initialize the described model, this function can take two params
       * and will throw exception in case no submission id is passed.
       *
       * @param {String} subId - submission id for current application
       * @param {String} applId - applicant id for current user
       * @function init
       * @memberOf PrimaryInfoModel
       */
      init: function(subId, applId) {
        submissionId = subId || undefined;
        applicantId = applId || undefined;

        if (!submissionId) {
          throw new Error(errors.InitializationException);
        }

        modelInitialized = true;
        return modelInitialized;
      },
      /**
       * Method to get new instance of Primary Information model. This method is a static member
       * of PrimaryInfoModel class, and on calling it will instantiate the defined [Model]{@link
       * IncomeInfoModel.Model} (private to
       * this class) and return a new instance of same.
       *
       * @function getNewModel
       * @param {object} modelData - javascript object with predefined attributed present with which
       * the model will be initialized
       * @memberOf PrimaryInfoModel
       * @returns Model
       */
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      /**
       * Public method to fetch enumeration for salutations. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function getSalutations
       * @memberOf PrimaryInfoModel
       * @returns deferredObject
       * @example
       * PrimaryInfoModel.getSalutations().then(function (data) {
       *
       * });
       */
      getSalutations: function() {
        objectInitializedCheck();
        fetchSalutationsDeferred = $.Deferred();
        fetchSalutations(fetchSalutationsDeferred);
        return fetchSalutationsDeferred;
      },
      fetchcitizenshipStatus: function() {
        objectInitializedCheck();
        fetchcitizenshipStatusDeferred = $.Deferred();
        fetchcitizenshipStatus(fetchcitizenshipStatusDeferred);
        return fetchcitizenshipStatusDeferred;
      },
      getOtherDetails: function() {
        getOtherDetailsDeferred = $.Deferred();
        getOtherDetails(getOtherDetailsDeferred);
        return getOtherDetailsDeferred;
      },
      saveOtherDetails: function(model, update) {
        objectInitializedCheck();
        saveOtherDetailsDeferred = $.Deferred();
        saveOtherDetails(model, update, saveOtherDetailsDeferred);
        return saveOtherDetailsDeferred;
      },
      /**
       * Public method to fetch enumeration for salutations. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function getOtherSalutations
       * @memberOf PrimaryInfoModel
       * @returns deferredObject
       * @example
       * PrimaryInfoModel.getSalutations().then(function (data) {
       *
       * });
       */
      getOtherSalutations: function() {
        objectInitializedCheck();
        fetchOtherSalutationsDeferred = $.Deferred();
        fetchOtherSalutations(fetchOtherSalutationsDeferred);
        return fetchOtherSalutationsDeferred;
      },


      /**
       * Public method to save passed primary info model, and create record for an applicant
       * in our application. This method will instantiate a new deferred object and will
       * return the same to the callee function which will be resolved after call completion
       * with appropriate data and developer can use .then(handler) to handle the data.
       *
       * @function createApplicant
       * @memberOf PrimaryInfoModel
       * @returns deferredObject
       * @example
       * PrimaryInfoModel.createApplicant(applicantModel).then(function (data) {
       *
       * });
       */
      saveApplicant: function(model) {
        objectInitializedCheck();
        saveApplicantDeferred = $.Deferred();
        saveApplicant(model, saveApplicantDeferred);
        return saveApplicantDeferred;
      },
      updateApplicant: function(model) {
        objectInitializedCheck();
        updateApplicantDeferred = $.Deferred();
        updateApplicant(model, updateApplicantDeferred);
        return updateApplicantDeferred;
      },
      /**
       * Public method to save passed primary info model, and create record for an applicant
       * in our application. This method will instantiate a new deferred object and will
       * return the same to the callee function which will be resolved after call completion
       * with appropriate data and developer can use .then(handler) to handle the data.
       *
       * @function createApplicant
       * @memberOf PrimaryInfoModel
       * @returns deferredObject
       * @example
       * PrimaryInfoModel.createApplicant(applicantModel).then(function (data) {
       *
       * });
       */

      setApplicantId: function(applId) {
        applicantId = applId;
      },
      fireBatch: function(batchData) {
        objectInitializedCheck();
        fireBatchDeferred = $.Deferred();
        fireBatch(batchData, fireBatchDeferred);
        return fireBatchDeferred;
      },
      submitRequirements: function(url, submissionId, requirements) {
        submitRequirementsDeferred = $.Deferred();
        submitRequirements(url, submissionId, requirements, submitRequirementsDeferred);
        return submitRequirementsDeferred;
      },
      fetchpplicantList: function(submissionId) {
        objectInitializedCheck();
        fetchApplicantDeferred = $.Deferred();
        fetchpplicantList(submissionId, fetchApplicantDeferred);
        return fetchApplicantDeferred;
      },
      fetchDocumentList: function(submissionId, applicantId) {
        objectInitializedCheck();
        fetchDocumentListDeferred = $.Deferred();
        fetchDocumentList(submissionId, applicantId, fetchDocumentListDeferred);
        return fetchDocumentListDeferred;
      },
      fetchCountries: function() {
        objectInitializedCheck();
        fetchCountriesDeferred = $.Deferred();
        fetchCountries(fetchCountriesDeferred);
        return fetchCountriesDeferred;
      },
      fetchSuffixes: function() {
        fetchSuffixesDeferred = $.Deferred();
        fetchSuffixes(fetchSuffixesDeferred);
        return fetchSuffixesDeferred;
      }

    };
  };
});
