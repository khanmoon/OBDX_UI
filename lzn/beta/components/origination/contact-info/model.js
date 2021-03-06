define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  /**
   * Main file for Contact Information Model. This file contains the model definition
   * for contact information section and exports the ContactInfoModel which can be injected
   * in any framework and developer will, by default get a self aware model for Identity
   * Information Section.<br/><br/>
   * The injected Model Class will have below properties:
   * <ul>
   *      <li>Model for Income Section using [getNewModel()]{@link ContactInfoModel.getNewModel}</li>
   *      <li>Service abstractions to fetch all the necessary component level data, which includes:
   *          <ul>
   *              <li>[fetchCountryList()]{@link ContactInfoModel.fetchCountryList}</li>
   *              <li>[fetchAccomodationTypeList()]{@link ContactInfoModel.fetchAccomodationTypeList}</li>
   *              <li>[createAddresses()]{@link ContactInfoModel.createAddresses}</li>
   *              <li>[createContact()]{@link ContactInfoModel.createContact}</li>
   *              <li>[updateAddresses()]{@link ContactInfoModel.updateAddresses}</li>
   *              <li>[updateContact()]{@link ContactInfoModel.updateContact}</li>
   *              <li>[synchronizeRequests()]{@link ContactInfoModel.synchronizeRequests}</li>
   *          </ul>
   *      </li>
   * </ul>
   *
   * @namespace ContactInfo~ContactInfoModel
   * @class ContactInfoModel
   * @property {Object}  contact - an object containing user's contact details
   * @property {String}  contact.contactType - type of contact
   * @property {Object}  contact.phone - Object containing phone details of user
   * @property {String}  contact.phone.type - phone type
   * @property {String}  contact.phone.areaCode - phone's area code
   * @property {String}  contact.phone.number - phone number
   * @property {String}  contact.phone.mobile - mobile number
   * @property {Object}  address - an object containing user's address details
   * @property {String}  address.type - type of address
   * @property {String}  address.accomodationType - type of accommodation
   * @property {Date}    address.stayingSince - beginning year for stay in current address
   * @property {Object}  address.postalAddress - postalAddress object
   * @property {String}  address.postalAddress.country - country of residence
   * @property {String}  address.postalAddress.state - state of residence
   * @property {String}  address.postalAddress.city - city of residence
   * @property {String}  address.postalAddress.postalCode - zipcode
   * @property {String}  address.postalAddress.line1 - postalAddress line 1
   * @property {String}  address.postalAddress.line2 - postalAddress line 2
   * @property {Boolean} isCompleting - co-applicant is self filling the form
   * @property {Object}  dictionaryArray - additional data for services
   */
  return function ContactInfoModel() {

    /**
     * In case more than one instance of model is required, eg for main and co-applicant
     * we are declaring model as a function, of which new instances can be created and
     * used when required.
     *
     * @class Model
     * @private
     * @memberOf ContactInfoModel
     */
    var Model = function() {

        this.contactInfo = {
          contacts: [{
              contactType: "",
              phone: {
                areaCode: "1",
                number: ""
              }
            },
            {
              contactType: "",
              phone: {
                areaCode: "1",
                number: ""
              }
            }
          ],
          address: {
            type: "",
            accomodationType: "",
            stayingSince: "",
            postalAddress: {
              country: "US",
              state: "",
              city: "",
              postalCode: "",
              line1: "",
              line2: ""

            }

          }

        };


        this.isCompleting = true;
        this.selectedValues = {
          accomodationType: "",
          state: "",
          contactType1: "",
          contactType2: ""
        };

        this.disableInputs = false;
        this.email = "";
      },

      modelInitialized = false,

      baseService = BaseService.getInstance(),
      /* variable to make sure that in case there is no change
       * in model no additional fetch requests are fired.*/
      modelStateChanged = true,

      submissionId,

      applicantId,
      getAccomodationTypeListDeferred,
      /**
      * @param {Object} deferred - An object type deferred
      * @returns {void}
      */
      getAccomodationTypeList = function(deferred) {
        var options = {
          url: "enumerations/accomodationType",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      getPhoneTypeListDeferred,
      /**
      * @param {Object} deferred - An object type deferred
      * @returns {void}
      */
      getPhoneTypeList = function(deferred) {
        var options = {
          url: "origination/phoneTypeList",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetchJSON(options);
      },
      getExistingContactsDeferred,
      /**
      * @param {Object} deferred - An object type deferred
      * @returns {void}
      */
      getExistingContacts = function(deferred) {
        var params = {
            submissionId: submissionId,
            applicantId: applicantId
          },
          options = {
            url: "submissions/{submissionId}/applicants/{applicantId}/contactPoints",
            success: function(data) {
              deferred.resolve(data);
            }
          };
        baseService.fetch(options, params);
      },
      getExistingAddressesDeferred,
      /**
      * @param {Object} deferred - An object type deferred
      * @returns {void}
      */
      getExistingAddresses = function(deferred) {
        var params = {
            submissionId: submissionId,
            applicantId: applicantId
          },
          options = {
            url: "submissions/{submissionId}/applicants/{applicantId}/addresses",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };
        baseService.fetch(options, params);
      },
      saveContactModelDeferred,
      /**
      * @param {Object} contactModel - An object type contactModel
      * @param {Object} deferred - An object type deferred
      * @returns {void}
      */
      saveContactModel = function(contactModel, deferred) {
        modelStateChanged = true;
        var params = {
            submissionId: submissionId,
            applicantId: applicantId
          },
          options = {
            url: "submissions/{submissionId}/applicants/{applicantId}/contactPoints",
            data: contactModel,
            success: function(data) {
              deferred.resolve(data);
            },
            error: function() {
              deferred.reject();
            }
          };


        baseService.add(options, params);


      },
      otherDetailsDeferred,
      /**
      * @param {Object} payLoad - An object type payLoad
      * @param {Object} deferred - An object type deferred
      * @returns {void}
      */
      otherDetails = function(payLoad, deferred) {
        var params = {
            submissionId: submissionId,
            applicantId: applicantId
          },
          options = {
            url: "submissions/{submissionId}/applicants/{applicantId}/otherDetails",
            data: payLoad,
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };
        baseService.add(options, params);
      },
      saveAddressModelDeferred,
      /**
      * @param {Object} addressModel - An object type addressModel
      * @param {Object} addOrUpdate - An object type addOrUpdate
      * @param {Object} addId - add Id for Application
      * @param {Object} deferred - An object type deferred
      * @returns {void}
      */
      saveAddressModel = function(addressModel, addOrUpdate, addId, deferred) {
        modelStateChanged = true;
        var params = {
            submissionId: submissionId,
            applicantId: applicantId
          },
          options = {
            url: "submissions/{submissionId}/applicants/{applicantId}/addresses",
            data: addressModel,
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };
        if (addOrUpdate > 0) {
          options.url = "submissions/{submissionId}/applicants/{applicantId}/addresses";
          options.url = options.url + "/" + addId;
          baseService.update(options, params);
        } else {
          baseService.add(options, params);
        }
      },

      fetchStatesDeferred,
      /**
      * @param {Object} country - country for Application
      * @param {Object} deferred - An object type deferred
      * @returns {void}
      */
      fetchStates = function(country, deferred) {
        modelStateChanged = true;
        var params = {
          "country": country
        };
        var options = {
          url: "enumerations/country/{country}/state",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options, params);
      },
      fireBatchDeferred,
      /**
      * @param {Object} batchData - batch Data for Application
      * @param {Object} deferred - An object type deferred
      * @returns {void}
      */
      fireBatch = function(batchData, deferred) {
        var options = {
          headers: {
            "BATCH_ID": "2655"
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


      checkStayingSinceDateDeferred,
      /**
      * @param {Object} dateData - date Data for Application
      * @param {Object} deferred - An object type deferred
      * @returns {void}
      */
      checkStayingSinceDate = function(dateData, deferred) {
        modelStateChanged = true;
        var params = {
            submissionId: submissionId,
            applicantId: applicantId,
            date: dateData
          },
          options = {
            url: "submissions/{submissionId}/applicants/{applicantId}/validateAddressDate/{date}",
            showMessage: false,
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };

        baseService.fetch(options, params);

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
       * @memberOf LiabilitiesInfoModel
        * @returns {Object} modelInitialized ~ modelInitialized object
       */
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
        this.getExistingContacts();
        this.getExistingAddresses();
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
       * @memberOf LiabilitiesInfoModel
       * @returns {Object} Model
       */
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      getAccomodationTypeList: function() {
        objectInitializedCheck();
        getAccomodationTypeListDeferred = $.Deferred();
        getAccomodationTypeList(getAccomodationTypeListDeferred);
        return getAccomodationTypeListDeferred;
      },
      getPhoneTypeList: function() {
        objectInitializedCheck();
        getPhoneTypeListDeferred = $.Deferred();
        getPhoneTypeList(getPhoneTypeListDeferred);
        return getPhoneTypeListDeferred;
      },
      getExistingContacts: function() {
        objectInitializedCheck();
        if (!applicantId) {
          throw new Error(errors.InvalidApplicantId);
        }
        if (modelStateChanged) {
          getExistingContactsDeferred = $.Deferred();
          $.when(getAccomodationTypeListDeferred).done(function() {
            getExistingContacts(getExistingContactsDeferred);
          });
        }
        return getExistingContactsDeferred;
      },
      getExistingAddresses: function() {
        objectInitializedCheck();
        if (!applicantId) {
          throw new Error(errors.InvalidApplicantId);
        }
        if (modelStateChanged) {
          getExistingAddressesDeferred = $.Deferred();
          $.when(getAccomodationTypeListDeferred).done(function() {
            getExistingAddresses(getExistingAddressesDeferred);
          });
        }
        return getExistingAddressesDeferred;
      },
      saveContactModel: function(contactModel) {
        objectInitializedCheck();
        saveContactModelDeferred = $.Deferred();
        saveContactModel(contactModel, saveContactModelDeferred);
        return saveContactModelDeferred;
      },
      otherDetails: function(payLoad) {
        objectInitializedCheck();
        otherDetailsDeferred = $.Deferred();
        otherDetails(payLoad, otherDetailsDeferred);
        return otherDetailsDeferred;
      },
      saveAddressModel: function(addressModel, addOrUpdate, addId) {
        objectInitializedCheck();
        saveAddressModelDeferred = $.Deferred();
        saveAddressModel(addressModel, addOrUpdate, addId, saveAddressModelDeferred);
        return saveAddressModelDeferred;
      },
      fireBatch: function(batchData) {
        objectInitializedCheck();
        fireBatchDeferred = $.Deferred();
        fireBatch(batchData, fireBatchDeferred);
        return fireBatchDeferred;
      },

      fetchStates: function(country) {
        objectInitializedCheck();
        fetchStatesDeferred = $.Deferred();
        fetchStates(country, fetchStatesDeferred);
        return fetchStatesDeferred;
      },
      checkStayingSinceDate: function(dateData) {
        objectInitializedCheck();
        checkStayingSinceDateDeferred = $.Deferred();
        checkStayingSinceDate(dateData, checkStayingSinceDateDeferred);
        return checkStayingSinceDateDeferred;
      }
    };
  };

});
