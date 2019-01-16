/*global define, console*/

define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  /**
   * Main file for Identity Information Model. This file contains the model definition
   * for identity information section and exports the IdentityInfoModel which can be injected
   * in any framework and developer will, by default get a self aware model for Identity
   * Information Section.<br/><br/>
   * The injected Model Class will have below properties:
   * <ul>
   *      <li>Model for Income Section using [getNewModel()]{@link IdentityInfoModel.getNewModel}</li>
   *      <li>Service abstractions to fetch all the necessary component level data, which includes:
   *          <ul>
   *              <li>[init()]{@link IdentityInfoModel.init}</li>
   *              <li>[getNewModel()]{@link IdentityInfoModel.getNewModel}</li>
   *              <li>[getExistingIdentity()]{@link IdentityInfoModel.getExistingIdentity}</li>
   *              <li>[getIdentificationTypeList()]{@link IdentityInfoModel.getIdentificationTypeList}</li>
   *              <li>[saveModel()]{@link IdentityInfoModel.saveModel}</li>
   *          </ul>
   *      </li>
   * </ul>
   *
   * @namespace IdentityInfo~IdentityInfoModel
   * @class IdentityInfoModel
   * @property {String} type - type of document selected
   * @property {String} id - id number for document selected
   * @property {String} identificationId - record id for current record
   * @property {Object} issueDate - object to store issue date for document selected
   * @property {String} issuingAuthority - name of issuing authority for document selected
   * @property {String} countryOfIssue - country of issue for document selected
   * @property {String} placeOfIssue - place of issue for document selected
   * @property {Integer} status - number of dependants for user
   * @property {Boolean} permanentResident - user is a permanent resident of selected country
   * @property {Boolean} citizenship - citizenship of user
   * @property {Boolean} selectedValues - co-applicant is self filling the form
   * @property {Object} dictionaryArray - additional data for services
   */
  return function IdentityInfoModel() {
    /**
     * In case more than one instance of model is required, eg for main and co-applicant
     * we are declaring model as a function, of which new instances can be created and
     * used when required.
     *
     * @class Model
     * @memberOf IdentityInfoModel
     * @private
     */
    var Model = function(modelData) {
        this.identificationDTOs = [{
          type: modelData ? modelData.type : "",
          id: modelData ? modelData.id : "",
          identificationId: "",
          issuingAuthority: "",
          placeOfIssue: modelData ? modelData.placeOfIssue : "",
          status: "",
          permanentResident: false,
          citizenship: "",
          expiryDate: modelData ? modelData.expiryDate : "",
          issueDate: modelData ? modelData.expiryDate : null

        }];
        this.selectedValues = {
          type: "",
          maskedssn: "",
          maskedId: "",
          placeOfIssue: "",
          countryOfIssue: ""
        };
        this.disableInputs = false;
      },

      modelInitialized = false,

      baseService = BaseService.getInstance(),
      /* variable to make sure that in case there is no change
       * in model no additional fetch requests are fired.*/
      modelStateChanged = true,

      submissionId,

      applicantId,

      fetchIdentityDeferred,

      /**
       * Private method to fetch existing identity for the user, this method will
       * only be called if applicant id is present, and will resolve a passed
       * deferred object, which can be returned from calling function to the
       * parent.
       *
       * @function fetchIdentity
       * @memberOf IdentityInfoModel
       * @private
       */
      fetchIdentity = function(deferred) {
        modelStateChanged = false;
        var params = {
            submissionId: submissionId,
            applicantId: applicantId
          },
          options = {
            url: "submissions/{submissionId}/applicants/{applicantId}/identifications",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function() {
              deferred.reject();
            }
          };
        baseService.fetch(options, params);
      },

      fetchIdentificationListDeferred,
      /**
       * Private method to fetch supported doc list for identifications. This
       * method will resolve a passed deferred object, which can be returned
       * from calling function to the parent.
       *
       * @function fetchIdentificationList
       * @memberOf IdentityInfoModel
       * @private
       */
      fetchIdentificationList = function(deferred) {
        var options = {
          url: "enumerations/identificationType?productSubClass=DEFAULT",
          success: function(data) {

            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },

      getStatesDeferred,

      fetchStates = function(country, deferred) {
        var params = {
            "country": country
          },
          options = {
            url: "enumerations/country/{country}/state",
            success: function(data) {

              deferred.resolve(data);
            }
          };
        baseService.fetch(options, params);
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

      saveModelDeferred,
      /**
       * Private method to save passed identification information model. Based
       * on the availability or non-availability of identificationId attribute
       * on existing model this function will add or update the passed model.
       * This method will resolve a passed deferred object, which can be returned
       * from calling function to the parent.
       *
       * @function saveModel
       * @memberOf IdentityInfoModel
       * @private
       */
      saveModel = function(model, deferred) {
        modelStateChanged = true;
        var params = {
            submissionId: submissionId,
            applicantId: applicantId
          },
          options = {
            url: "submissions/{submissionId}/applicants/{applicantId}/identifications",
            data: model,
            success: function(data) {
              deferred.resolve(data);
            }
          };
        baseService.add(options, params);
      },
      deleteModelDeferred,
      deleteModel = function(identificationId, deferred) {
        var params = {
            submissionId: submissionId,
            applicantId: applicantId,
            identificationId: identificationId
          },
          options = {
            url: "submissions/{submissionId}/applicants/{applicantId}/identifications/{identificationId}",
            success: function(data) {
              deferred.resolve(data);
            }
          };
        baseService.remove(options, params);
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
      /**
       * Method to initialize the described model, this function can take two params
       * and will throw exception in case no submission id is passed.
       *
       * @param {String} subId - submission id for current application
       * @param {String} applId - applicant id for current user
       * @function init
       * @memberOf IdentityInfoModel
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
       * Method to get new instance of Identity Information model. This method is a static member
       * of IdentityInfoModel class, and on calling it will instantiate the defined [Model]{@link
       * IdentityInfoModel.Model} (private to this class) and return a new instance of same.
       *
       * @function getNewModel
       * @param {object} modelData - javascript object with predefined attributed present with which
       * the model will be initialized
       * @memberOf IdentityInfoModel
       * @returns Model
       */
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      /**
       * Public method to fetch existing identity for the user.This method will
       * only be called if applicant id is present, in case no applicant id is defined
       * an exception will be thrown notifying the developer of same. On calling the
       * method will instantiate a new deferred object and will return the same to the
       * callee function which will be resolved after call completion with appropriate
       * data and developer can use .then(handler) to handle the data.
       *
       * @function getExistingIdentity
       * @memberOf IdentityInfoModel
       * @returns deferredObject
       * @example
       *      IdentityInfoModel.getExistingIdentity().then(function (data) {
       *
       *      });
       */
      getExistingIdentity: function() {
        objectInitializedCheck();
        if (!applicantId) {
          throw new Error(errors.InvalidApplicantId);
        }
        if (modelStateChanged) {
          fetchIdentityDeferred = $.Deferred();
          fetchIdentity(fetchIdentityDeferred);
        }
        return fetchIdentityDeferred;
      },


      getStates: function(country) {
        objectInitializedCheck();
        getStatesDeferred = $.Deferred();
        fetchStates(country, getStatesDeferred);
        return getStatesDeferred;
      },

      fetchCountries: function() {
        objectInitializedCheck();
        fetchCountriesDeferred = $.Deferred();
        fetchCountries(fetchCountriesDeferred);
        return fetchCountriesDeferred;
      },
      /**
       * Public method to fetch supported docs list for identifications. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function getIdentificationTypeList
       * @memberOf IdentityInfoModel
       * @returns deferredObject
       * @example
       *      IdentityInfoModel.getIdentificationTypeList().then(function (data) {
       *
       *      });
       */
      getIdentificationTypeList: function() {
        objectInitializedCheck();
        fetchIdentificationListDeferred = $.Deferred();
        fetchIdentificationList(fetchIdentificationListDeferred);
        return fetchIdentificationListDeferred;
      },
      /**
       * Public method to save passed in identification information model. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function saveModel
       * @memberOf IdentityInfoModel
       * @returns deferredObject
       * @example
       * IdentityInfoModel.saveModel().then(function (data) {
       *
       * });
       */
      saveModel: function(model) {
        objectInitializedCheck();
        saveModelDeferred = $.Deferred();
        saveModel(model, saveModelDeferred);
        return saveModelDeferred;
      },
      deleteModel: function(identificationId) {
        objectInitializedCheck();
        deleteModelDeferred = $.Deferred();
        deleteModel(identificationId, deleteModelDeferred);
        return deleteModelDeferred;
      },
      /**
       * Public method to set Applicant Id after object has been initialized.
       *
       * @function setApplicantId
       * @memberOf IdentityInfoModel
       * @returns deferredObject
       * @example
       * IdentityInfoModel.saveModel().then(function (data) {
       *
       * });
       */
      setApplicantId: function(applId) {
        objectInitializedCheck();
        applicantId = applId;
        return applicantId;
      }
    };
  };
});
