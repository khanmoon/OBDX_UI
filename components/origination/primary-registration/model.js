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

    /**
     * var Model - description
     *
     * @param  {type} model description
     * @return {type}       description
     */
    var Model = function(model) {
        this.primaryInfo = {
          salutation: model && model.salutation ? model.salutation : "",
          firstName: model && model.firstName ? model.firstName : "",
          middleName: (model && model.middleName) ? model.middleName : "",
          lastName: model && model.lastName ? model.lastName : "",
          suffix: (model && model.suffix) ? model.suffix : "",
          birthDate: model && model.birthDate ? model.birthDate : "",
          gender: model && model.gender ? model.gender : "",
          maritalStatus: model && model.maritalStatus ? model.maritalStatus : "",
          noOfDependants: model && model.noOfDependants ? model.noOfDependants : "",
          citizenship: model && model.citizenship ? model.citizenship : "",
          otherSalutation: model && model.otherSalutation ? model.otherSalutation : "",
          isPermanentResidence: model && model.isPermanentResidence ? model.isPermanentResidence : null,
          email: (model && model.email) ? model.email : ""
        };
        this.registrationInfo = {
          securityQuestion: "",
          securityAnswer: ""
        };
        this.isCompleting = true;
        this.adConsent = false;
        this.selectedValues = {
          salutation: "",
          gender: "",
          maritalStatus: "",
          citizenship: ""
        };
        this.disableInputs = false;
      },
      modelInitialized = false,
      baseService = BaseService.getInstance(),
      /* variable to make sure that in case there is no change
       * in model no additional fetch requests are fired.*/
      submissionId, applicantId, fetchSalutationsDeferred,
      /**
       * Private method to fetch enumerations for listed salutations. This
       * method will resolve a passed deferred object, which can be returned from calling
       * function to the parent.
       *
       * @function fetchSalutations
       * @memberOf PrimaryInfoModel
       * @private
       */

      /**
       * fetchSalutations - description
       *
       * @param  {type} deferred description
       * @return {type}          description
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
      fetchMaritalStatusDeferred,
      /**
       * Private method to fetch enumerations for listed marital statuses. This
       * method will resolve a passed deferred object, which can be returned from calling
       * function to the parent.
       *
       * @function fetchSalutations
       * @memberOf PrimaryInfoModel
       * @private
       */

      /**
       * fetchMaritalStatus - description
       *
       * @param  {type} deferred description
       * @return {type}          description
       */
      fetchMaritalStatus = function(deferred) {
        var options = {
          url: "enumerations/maritalStatus",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      fetchGenderOptionsDeferred,
      /**
       * Private method to fetch enumerations for listed marital statuses. This
       * method will resolve a passed deferred object, which can be returned from calling
       * function to the parent.
       *
       * @function fetchSalutations
       * @memberOf PrimaryInfoModel
       * @private
       */

      /**
       * fetchGenderOptions - description
       *
       * @param  {type} deferred description
       * @return {type}          description
       */
      fetchGenderOptions = function(deferred) {
        var options = {
          url: "enumerations/gender",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      fetchSecurityQuestionsDeferred,
      /**
       * Private method to fetch enumerations for listed marital statuses. This
       * method will resolve a passed deferred object, which can be returned from calling
       * function to the parent.
       *
       * @function fetchEmailContacts
       * @memberOf PrimaryInfoModel
       * @private
       */

      /**
       * fetchSecurityQuestions - description
       *
       * @param  {type} deferred description
       * @return {type}          description
       */
      fetchSecurityQuestions = function(deferred) {
        var options = {
          url: "enumerations/securityQuestion",
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
       * @function fetchEmailContacts
       * @memberOf PrimaryInfoModel
       * @private
       */

      /**
       * fetchOtherSalutations - description
       *
       * @param  {type} deferred description
       * @return {type}          description
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

      /**
       * fetchCountries - description
       *
       * @param  {type} deferred description
       * @return {type}          description
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
      fetchApplicantDeferred,

      /**
       * fetchpplicantList - description
       *
       * @param  {type} submissionId description
       * @param  {type} applicantId  description
       * @param  {type} deferred     description
       * @return {type}              description
       */
      fetchpplicantList = function(submissionId, applicantId, deferred) {
        var params = {
            submissionId: submissionId,
            applicantId: applicantId
          },
          options = {
            url: "submissions/{submissionId}/applicants/{applicantId}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };
        baseService.fetch(options, params);
      },
      submitRequirementsDeferred,

      /**
       * submitRequirements - description
       *
       * @param  {type} url          description
       * @param  {type} submissionId description
       * @param  {type} requirements description
       * @param  {type} deferred     description
       * @return {type}              description
       */
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
      fetchPasswordPolicyDeferred,

      /**
       * fetchPasswordPolicy - description
       *
       * @param  {type} deferred description
       * @return {type}          description
       */
      fetchPasswordPolicy = function(deferred) {
        var options = {
          url: "passwordPolicy",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
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

      /**
       * saveApplicant - description
       *
       * @param  {type} model    description
       * @param  {type} deferred description
       * @return {type}          description
       */
      saveApplicant = function(model, deferred) {
        var params = {
            submissionId: submissionId,
            applicantId: applicantId
          },
          options = {
            url: "submissions/{submissionId}/applicants/personalInformation",
            data: model,
            success: function(data) {
              deferred.resolve(data);
            }
          },
          modelData = JSON.parse(model);
        if (modelData && modelData.applicantId && modelData.applicantId.length > 0) {
          options.url = "submissions/{submissionId}/applicants/{applicantId}/personalInformation";
          baseService.update(options, params);
        } else {
          baseService.add(options, params);
        }
      },
      updateApplicantDeferred,

      /**
       * updateApplicant - description
       *
       * @param  {type} model    description
       * @param  {type} deferred description
       * @return {type}          description
       */
      updateApplicant = function(model, deferred) {
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
      submitSecurityQuestionDeferred,
      /**
       * Private method to save passed contact details for applicant. Based
       * on the availability or non-availability of liability id attribute
       * on existing model this function will add or update the passed model.
       * This method will resolve a passed deferred object, which can be returned
       * from calling function to the parent.
       *
       * @function submitSecurityQuestion
       * @memberOf PrimaryInfoModel
       * @private
       */

      /**
       * submitSecurityQuestion - description
       *
       * @param  {type} model    description
       * @param  {type} deferred description
       * @return {type}          description
       */
      submitSecurityQuestion = function(model, deferred) {
        var params = {
            submissionId: submissionId,
            applicantId: applicantId
          },
          options = {
            url: "submissions/{submissionId}/applicants/{applicantId}/securityQuestion",
            data: model,
            success: function(data) {
              deferred.resolve(data);
            }
          };
        baseService.add(options, params);
      },
      submitMarketingConsentDeferred,
      /**
       * Private method to save passed contact details for applicant. Based
       * on the availability or non-availability of liability id attribute
       * on existing model this function will add or update the passed model.
       * This method will resolve a passed deferred object, which can be returned
       * from calling function to the parent.
       *
       * @function submitMarketingConsent
       * @memberOf PrimaryInfoModel
       * @private
       */

      /**
       * submitMarketingConsent - description
       *
       * @param  {type} model    description
       * @param  {type} deferred description
       * @return {type}          description
       */
      submitMarketingConsent = function(model, deferred) {
        var params = {
            submissionId: submissionId,
            applicantId: applicantId
          },
          options = {
            url: "submissions/{submissionId}/applicants/{applicantId}/consent",
            data: model,
            success: function(data) {
              deferred.resolve(data);
            }
          };
        baseService.add(options, params);
      },
      fetchExistingMarketingConsentDeferred,

      /**
       * fetchExistingMarketingConsent - description
       *
       * @param  {type} submissionId description
       * @param  {type} applicantId  description
       * @param  {type} deferred     description
       * @return {type}              description
       */
      fetchExistingMarketingConsent = function(submissionId, applicantId, deferred) {
        var params = {
            submissionId: submissionId,
            applicantId: applicantId
          },
          options = {
            url: "submissions/{submissionId}/applicants/{applicantId}/consent",
            success: function(data) {
              deferred.resolve(data);
            }
          };
        baseService.fetch(options, params);
      },
      verifyEmailDeferred,

      /**
       * verifyEmail - description
       *
       * @param  {type} payload  description
       * @param  {type} deferred description
       * @return {type}          description
       */
      verifyEmail = function(payload, deferred) {
        var options = {
          url: "me/emailVerification/otp",
          data: payload,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.add(options);
      },
      errors = {

        /**
         * InitializationException - description
         *
         * @return {type}  description
         */
        InitializationException: function() {
          var message = "";
          message += "\nObject can't be initialized without a valid submission Id. ";
          message += "\nPlease make sure the submission id is present.";
          message += "\nProper initialization has to be:";
          message += "\n\n\tModelName.init(\"SubId\", \"ApplicantId\", \"ProfileId\");";
          return message;
        }(),

        /**
         * InvalidApplicantId - description
         *
         * @return {type}  description
         */
        InvalidApplicantId: function() {
          var message = "";
          message += "\nNo applicant id found, please make sure applicant id is present while initializing the model. ";
          message += "\nProper initialization has to be: ";
          message += "\n\n\tModelName.init(\"SubId\", \"ApplicantId\", \"ProfileId\");";
          return message;
        }(),

        /**
         * InvalidProfileId - description
         *
         * @return {type}  description
         */
        InvalidProfileId: function() {
          var message = "";
          message += "\nNo profile id found, please make sure profile id is present while initializing the model. ";
          message += "\nProper initialization has to be: ";
          message += "\n\n\tModelName.init(\"SubId\", \"ApplicantId\", \"ProfileId\");";
          return message;
        }(),

        /**
         * ObjectNotInitialized - description
         *
         * @return {type}  description
         */
        ObjectNotInitialized: function() {
          var message = "";
          message += "\nModel has not been initialized. Please initialize the model before setting/calling properties. ";
          message += "\nProper initialization has to be: ";
          message += "\n\n\tModelName.init(\"SubId\", \"ApplicantId\", \"ProfileId\");";
          return message;
        }()
      },

      /**
       * objectInitializedCheck - description
       *
       * @return {type}  description
       */
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

      /**
       * init - description
       *
       * @param  {type} subId  description
       * @param  {type} applId description
       * @return {type}        description
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

      /**
       * getNewModel - description
       *
       * @param  {type} modelData description
       * @return {type}           description
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

      /**
       * getSalutations - description
       *
       * @return {type}  description
       */
      getSalutations: function() {
        objectInitializedCheck();
        fetchSalutationsDeferred = $.Deferred();
        fetchSalutations(fetchSalutationsDeferred);
        return fetchSalutationsDeferred;
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

      /**
       * getOtherSalutations - description
       *
       * @return {type}  description
       */
      getOtherSalutations: function() {
        objectInitializedCheck();
        fetchOtherSalutations(fetchSalutationsDeferred);
        return fetchSalutationsDeferred;
      },
      /**
       * Public method to fetch enumeration for marital statuses. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function getSalutations
       * @memberOf PrimaryInfoModel
       * @returns deferredObject
       * @example
       * PrimaryInfoModel.getMaritalStatus().then(function (data) {
       *
       * });
       */

      /**
       * getMaritalStatus - description
       *
       * @return {type}  description
       */
      getMaritalStatus: function() {
        objectInitializedCheck();
        fetchMaritalStatusDeferred = $.Deferred();
        fetchMaritalStatus(fetchMaritalStatusDeferred);
        return fetchMaritalStatusDeferred;
      },
      /**
       * Public method to fetch enumeration for gender options. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function getSalutations
       * @memberOf PrimaryInfoModel
       * @returns deferredObject
       * @example
       * PrimaryInfoModel.getGenderEnum().then(function (data) {
       *
       * });
       */

      /**
       * getGenderEnum - description
       *
       * @return {type}  description
       */
      getGenderEnum: function() {
        objectInitializedCheck();
        fetchGenderOptionsDeferred = $.Deferred();
        fetchGenderOptions(fetchGenderOptionsDeferred);
        return fetchGenderOptionsDeferred;
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

      /**
       * saveApplicant - description
       *
       * @param  {type} model description
       * @return {type}       description
       */
      saveApplicant: function(model) {
        objectInitializedCheck();
        saveApplicantDeferred = $.Deferred();
        saveApplicant(model, saveApplicantDeferred);
        return saveApplicantDeferred;
      },

      /**
       * updateApplicant - description
       *
       * @param  {type} model description
       * @return {type}       description
       */
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

      /**
       * getSecurityQuestions - description
       *
       * @return {type}  description
       */
      getSecurityQuestions: function() {
        objectInitializedCheck();
        fetchSecurityQuestionsDeferred = $.Deferred();
        fetchSecurityQuestions(fetchSecurityQuestionsDeferred);
        return fetchSecurityQuestionsDeferred;
      },

      /**
       * submitSecurityQuestion - description
       *
       * @param  {type} data description
       * @return {type}      description
       */
      submitSecurityQuestion: function(data) {
        objectInitializedCheck();
        submitSecurityQuestionDeferred = $.Deferred();
        submitSecurityQuestion(data, submitSecurityQuestionDeferred);
        return submitSecurityQuestionDeferred;
      },

      /**
       * submitMarketingConsent - description
       *
       * @param  {type} data description
       * @return {type}      description
       */
      submitMarketingConsent: function(data) {
        objectInitializedCheck();
        submitMarketingConsentDeferred = $.Deferred();
        $.when(this.createContact).done(function() {
          submitMarketingConsent(data, submitMarketingConsentDeferred);
        });
        return submitMarketingConsentDeferred;
      },

      /**
       * fetchExistingMarketingConsent - description
       *
       * @param  {type} submissionId description
       * @param  {type} applicantId  description
       * @return {type}              description
       */
      fetchExistingMarketingConsent: function(submissionId, applicantId) {
        objectInitializedCheck();
        fetchExistingMarketingConsentDeferred = $.Deferred();
        $.when(this.createContact).done(function() {
          fetchExistingMarketingConsent(submissionId, applicantId, fetchExistingMarketingConsentDeferred);
        });
        return fetchExistingMarketingConsentDeferred;
      },

      /**
       * fetchPasswordPolicy - description
       *
       * @return {type}  description
       */
      fetchPasswordPolicy: function() {
        fetchPasswordPolicyDeferred = $.Deferred();
        fetchPasswordPolicy(fetchPasswordPolicyDeferred);
        return fetchPasswordPolicyDeferred;
      },

      /**
       * setApplicantId - description
       *
       * @param  {type} applId description
       * @return {type}        description
       */
      setApplicantId: function(applId) {
        applicantId = applId;
      },

      /**
       * fetchpplicantList - description
       *
       * @param  {type} submissionId description
       * @param  {type} applicantId  description
       * @return {type}              description
       */
      fetchpplicantList: function(submissionId, applicantId) {
        objectInitializedCheck();
        fetchApplicantDeferred = $.Deferred();
        fetchpplicantList(submissionId, applicantId, fetchApplicantDeferred);
        return fetchApplicantDeferred;
      },

      /**
       * submitRequirements - description
       *
       * @param  {type} url          description
       * @param  {type} submissionId description
       * @param  {type} requirements description
       * @return {type}              description
       */
      submitRequirements: function(url, submissionId, requirements) {
        submitRequirementsDeferred = $.Deferred();
        submitRequirements(url, submissionId, requirements, submitRequirementsDeferred);
        return submitRequirementsDeferred;
      },

      /**
       * verifyEmail - description
       *
       * @param  {type} payload description
       * @return {type}         description
       */
      verifyEmail: function(payload) {
        verifyEmailDeferred = $.Deferred();
        verifyEmail(payload, verifyEmailDeferred);
        return verifyEmailDeferred;
      },

      /**
       * fetchCountries - description
       *
       * @return {type}  description
       */
      fetchCountries: function() {
        objectInitializedCheck();
        fetchCountriesDeferred = $.Deferred();
        fetchCountries(fetchCountriesDeferred);
        return fetchCountriesDeferred;
      }
    };
  };
});
