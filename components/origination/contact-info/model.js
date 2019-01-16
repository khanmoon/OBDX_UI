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

    /**
     * var Model - description
     *
     * @return {type}  description
     */
    var Model = function() {
        this.contactInfo = {
          contacts: [{
              contactType: "",
              phone: {
                areaCode: "",
                number: ""
              }
            },
            {
              contactType: "",
              phone: {
                areaCode: "",
                number: ""
              }
            }
          ],
          address: {
            type: "",
            accomodationType: "",
            stayingSince: "",
            sameAsCurrent: true,
            postalAddress: {
              country: "",
              city: "",
              postalCode: "",
              line1: "",
              line2: ""
            },
            landlordAddress: {
              country: "",
              city: "",
              postalCode: "",
              line1: "",
              line2: ""
            },
            landlordName: "",
            landlordPhoneNumber: {
              number: ""
            }
          },
          mailingAddress: {
            type: "",
            accomodationType: "",
            stayingSince: "",
            sameAsCurrent: true,
            status: "CURRENT",
            postalAddress: {
              country: "",
              city: "",
              postalCode: "",
              line1: "",
              line2: ""
            }
          }
        };
        this.monthlyMortgage = {
          currency: "",
          amount: null
        };

        this.monthlyRent = {
          currency: "",
          amount: ""
        };

        this.isCompleting = true;
        this.selectedValues = {
          accomodationType: "",
          contactType1: "",
          contactType2: "",
          country: "",
          countryMailing: ""
        };

        this.disableInputs = false;
        this.email = "";
      },
      modelInitialized = false,
      baseService = BaseService.getInstance(),
      /* variable to make sure that in case there is no change
       * in model no additional fetch requests are fired.*/
      modelStateChanged = true,
      submissionId, applicantId, getAccomodationTypeListDeferred,

      /**
       * getAccomodationTypeList - description
       *
       * @param  {type} deferred description
       * @return {type}          description
       */
      getAccomodationTypeList = function(deferred) {
        var options = {
          url: "accommodationTypes",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      fetchCountryListDeferred,

      /**
       * fetchCountryList - description
       *
       * @param  {type} deferred description
       * @return {type}          description
       */
      fetchCountryList = function(deferred) {
        var options = {
          url: "enumerations/country",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      getExistingExpensesDeferred,
      /**
       * Private method to fetch list of existing expenses of the user. This
       * method will resolve a passed deferred object, which can be returned
       * from calling function to the parent.
       *
       * @function getExistingExpenses
       * @memberOf ExpenseInfoModel
       * @private
       */

      /**
       * getExistingExpenses - description
       *
       * @param  {type} profileId description
       * @param  {type} deferred  description
       * @return {type}           description
       */
      getExistingExpenses = function(profileId, deferred) {
        modelStateChanged = false;
        var options = {
            url: "submissions/{submissionId}/applicants/{applicantId}/financialProfile/expenses?profileId={profileId}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function() {
              deferred.reject();
            }
          },
          params = {
            submissionId: submissionId,
            applicantId: applicantId,
            profileId: profileId
          };
        baseService.fetch(options, params);
      },
      getPhoneTypeListDeferred,

      /**
       * getPhoneTypeList - description
       *
       * @param  {type} deferred description
       * @return {type}          description
       */
      getPhoneTypeList = function(deferred) {
        var options = {
          url: "enumerations/phonetype",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      getISDCodeListDeferred,

      /**
       * getISDCodeList - description
       *
       * @param  {type} deferred description
       * @return {type}          description
       */
      getISDCodeList = function(deferred) {
        var options = {
          url: "enumerations/ISDCode",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      getExistingContactsDeferred,

      /**
       * getExistingContacts - description
       *
       * @param  {type} deferred description
       * @return {type}          description
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
       * getExistingAddresses - description
       *
       * @param  {type} deferred description
       * @return {type}          description
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
       * saveContactModel - description
       *
       * @param  {type} contactModel description
       * @param  {type} deferred     description
       * @return {type}              description
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
      fetchExistingLiabilitiesDeferred,
      /**
       * Private method to fetch existing liabilities for the user, this method will
       * only be called if applicant and profile ids are present, and will resolve a
       * passeddeferred object, which can be returned from calling function to the
       * parent.
       *
       * @function fetchExistingLiabilities
       * @memberOf LiabilitiesInfoModel
       * @private
       */

      /**
       * fetchExistingLiabilities - description
       *
       * @param  {type} profileId description
       * @param  {type} deferred  description
       * @return {type}           description
       */
      fetchExistingLiabilities = function(profileId, deferred) {
        modelStateChanged = false;
        var options = {
            url: "submissions/{submissionId}/applicants/{applicantId}/financialProfile/liabilities?profileId={profileId}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function() {
              deferred.reject();
            }
          },
          params = {
            submissionId: submissionId,
            applicantId: applicantId,
            profileId: profileId
          };
        baseService.fetch(options, params);
      },
      saveAddressModelDeferred,

      /**
       * saveAddressModel - description
       *
       * @param  {type} addressModel description
       * @param  {type} addOrUpdate  description
       * @param  {type} addId        description
       * @param  {type} deferred     description
       * @return {type}              description
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
      saveModelDeferred,
      /**
       * Private method to save passed occupation information model. Based
       * on the availability or non-availability of liability id attribute
       * on existing model this function will add or update the passed model.
       * This method will resolve a passed deferred object, which can be returned
       * from calling function to the parent.
       *
       * @function saveModel
       * @memberOf OccupationInfoModel
       * @private
       */

      /**
       * saveModel - description
       *
       * @param  {type} model    description
       * @param  {type} deferred description
       * @return {type}          description
       */
      saveModel = function(model, deferred) {
        modelStateChanged = true;
        var params = {
            submissionId: submissionId,
            applicantId: applicantId
          },
          options = {
            url: "submissions/{submissionId}/applicants/{applicantId}/employments/profiles",
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
      saveModelExpenseDeferred,
      /**
       * Private method to save/update the expense data of the user. This
       * method will resolve a passed deferred object, which can be returned
       * from calling function to the parent.
       *
       * @function saveModelExpense
       * @memberOf ExpenseInfoModel
       * @private
       */

      /**
       * saveModelExpense - description
       *
       * @param  {type} model     description
       * @param  {type} profileId description
       * @param  {type} update    description
       * @param  {type} expenseId description
       * @param  {type} deferred  description
       * @return {type}           description
       */
      saveModelExpense = function(model, profileId, update, expenseId, deferred) {
        modelStateChanged = true;
        var params = {
            submissionId: submissionId,
            applicantId: applicantId,
            profileId: profileId
          },
          options = {
            url: "submissions/{submissionId}/applicants/{applicantId}/financialProfile/expenses",
            data: model,
            success: function(data) {
              deferred.resolve(data);
            },
            error: function() {
              deferred.reject();
            }
          };
        if (update) {
          options.url += "/" + expenseId;
          baseService.update(options, params);
        } else {
          baseService.add(options, params);
        }
      },
      saveModelLiabilitiesDeferred,
      /**
       * Private method to save passed liabilities information model. Based
       * on the availability or non-availability of liability id attribute
       * on existing model this function will add or update the passed model.
       * This method will resolve a passed deferred object, which can be returned
       * from calling function to the parent.
       *
       * @function saveModelLiabilities
       * @memberOf LiabilitiesInfoModel
       * @private
       */

      /**
       * saveModelLiabilities - description
       *
       * @param  {type} model         description
       * @param  {type} update        description
       * @param  {type} liabilitiesId description
       * @param  {type} deferred      description
       * @return {type}               description
       */
      saveModelLiabilities = function(model, update, liabilitiesId, deferred) {
        modelStateChanged = true;
        var params = {
            submissionId: submissionId,
            applicantId: applicantId
          },
          options = {
            url: "submissions/{submissionId}/applicants/{applicantId}/financialProfile/liabilities",
            data: model,
            success: function(data) {
              deferred.resolve(data);
            }
          };

        if (update) {
          options.url = "submissions/{submissionId}/applicants/{applicantId}/financialProfile/liabilities/" + liabilitiesId;
          baseService.update(options, params);
        } else {
          baseService.add(options, params);
        }

      },
      fetchEmploymentsDeferred,

      /**
       * fetchEmployments - description
       *
       * @param  {type} deferred description
       * @return {type}          description
       */
      fetchEmployments = function(deferred) {
        var params = {
          submissionId: submissionId,
          applicantId: applicantId
        };
        var options = {
          url: "submissions/{submissionId}/applicants/{applicantId}/employments",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options, params);
      },
      fireBatchDeferred,

      /**
       * fireBatch - description
       *
       * @param  {type} batchData description
       * @param  {type} deferred  description
       * @return {type}           description
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
       * checkStayingSinceDate - description
       *
       * @param  {type} dateData description
       * @param  {type} deferred description
       * @return {type}          description
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
          message += "\n\n\tModelName.init(\"SubId\"[, \"ApplicantId\"]);";
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
          message += "\n\n\tModelName.init(\"SubId\"[, \"ApplicantId\"]);";
          return message;
        }(),

        /**
         * ObjectNotInitialized - description
         *
         * @return {type}  description
         */
        ObjectNotInitialized: function() {
          var message = "";
          message += "\nModel has not been initialized. Please initialize the model before setting properties. ";
          message += "\nProper initialization has to be: ";
          message += "\n\n\tModelName.init(\"SubId\"[, \"ApplicantId\"]);";
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
       * @memberOf LiabilitiesInfoModel
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
       * getAccomodationTypeList - description
       *
       * @return {type}  description
       */
      getAccomodationTypeList: function() {
        objectInitializedCheck();
        getAccomodationTypeListDeferred = $.Deferred();
        getAccomodationTypeList(getAccomodationTypeListDeferred);
        return getAccomodationTypeListDeferred;
      },

      /**
       * getPhoneTypeList - description
       *
       * @return {type}  description
       */
      getPhoneTypeList: function() {
        objectInitializedCheck();
        getPhoneTypeListDeferred = $.Deferred();
        getPhoneTypeList(getPhoneTypeListDeferred);
        return getPhoneTypeListDeferred;
      },

      /**
       * getISDCodeList - description
       *
       * @return {type}  description
       */
      getISDCodeList: function() {
        objectInitializedCheck();
        getISDCodeListDeferred = $.Deferred();
        getISDCodeList(getISDCodeListDeferred);
        return getISDCodeListDeferred;
      },

      /**
       * getExistingContacts - description
       *
       * @return {type}  description
       */
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

      /**
       * getExistingAddresses - description
       *
       * @return {type}  description
       */
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

      /**
       * saveContactModel - description
       *
       * @param  {type} contactModel description
       * @return {type}              description
       */
      saveContactModel: function(contactModel) {
        objectInitializedCheck();
        saveContactModelDeferred = $.Deferred();
        saveContactModel(contactModel, saveContactModelDeferred);
        return saveContactModelDeferred;
      },

      /**
       * saveAddressModel - description
       *
       * @param  {type} addressModel description
       * @param  {type} addOrUpdate  description
       * @param  {type} addId        description
       * @return {type}              description
       */
      saveAddressModel: function(addressModel, addOrUpdate, addId) {
        objectInitializedCheck();
        saveAddressModelDeferred = $.Deferred();
        saveAddressModel(addressModel, addOrUpdate, addId, saveAddressModelDeferred);
        return saveAddressModelDeferred;
      },

      /**
       * saveModel - description
       *
       * @param  {type} model description
       * @return {type}       description
       */
      saveModel: function(model) {
        objectInitializedCheck();
        saveModelDeferred = $.Deferred();
        saveModel(model, saveModelDeferred);
        return saveModelDeferred;
      },

      /**
       * fireBatch - description
       *
       * @param  {type} batchData description
       * @return {type}           description
       */
      fireBatch: function(batchData) {
        objectInitializedCheck();
        fireBatchDeferred = $.Deferred();
        fireBatch(batchData, fireBatchDeferred);
        return fireBatchDeferred;
      },

      /**
       * fetchEmployments - description
       *
       * @return {type}  description
       */
      fetchEmployments: function() {
        fetchEmploymentsDeferred = $.Deferred();
        fetchEmployments(fetchEmploymentsDeferred);
        return fetchEmploymentsDeferred;
      },

      /**
       * fetchExistingLiabilities - description
       *
       * @param  {type} profileId description
       * @return {type}           description
       */
      fetchExistingLiabilities: function(profileId) {
        objectInitializedCheck();
        fetchExistingLiabilitiesDeferred = $.Deferred();
        fetchExistingLiabilities(profileId, fetchExistingLiabilitiesDeferred);
        return fetchExistingLiabilitiesDeferred;
      },

      /**
       * fetchCountryList - description
       *
       * @return {type}  description
       */
      fetchCountryList: function() {
        fetchCountryListDeferred = $.Deferred();
        fetchCountryList(fetchCountryListDeferred);
        return fetchCountryListDeferred;
      },

      /**
       * saveModelLiabilities - description
       *
       * @param  {type} model         description
       * @param  {type} update        description
       * @param  {type} liabilitiesId description
       * @return {type}               description
       */
      saveModelLiabilities: function(model, update, liabilitiesId) {
        objectInitializedCheck();
        saveModelLiabilitiesDeferred = $.Deferred();
        saveModelLiabilities(model, update, liabilitiesId, saveModelLiabilitiesDeferred);
        return saveModelLiabilitiesDeferred;
      },

      /**
       * saveModelExpense - description
       *
       * @param  {type} model     description
       * @param  {type} profileId description
       * @param  {type} update    description
       * @param  {type} expenseId description
       * @return {type}           description
       */
      saveModelExpense: function(model, profileId, update, expenseId) {
        objectInitializedCheck();
        saveModelExpenseDeferred = $.Deferred();
        saveModelExpense(model, profileId, update, expenseId, saveModelExpenseDeferred);
        return saveModelExpenseDeferred;
      },

      /**
       * getExistingExpenses - description
       *
       * @param  {type} profileId description
       * @return {type}           description
       */
      getExistingExpenses: function(profileId) {
        objectInitializedCheck();
        getExistingExpensesDeferred = $.Deferred();
        getExistingExpenses(profileId, getExistingExpensesDeferred);
        return getExistingExpensesDeferred;
      },

      /**
       * checkStayingSinceDate - description
       *
       * @param  {type} dateData description
       * @return {type}          description
       */
      checkStayingSinceDate: function(dateData) {
        objectInitializedCheck();
        checkStayingSinceDateDeferred = $.Deferred();
        checkStayingSinceDate(dateData, checkStayingSinceDateDeferred);
        return checkStayingSinceDateDeferred;
      }
    };
  };
});
