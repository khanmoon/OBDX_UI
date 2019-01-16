define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  /**
   * Main file for Expense Information Model. This file contains the model definition
   * for expense information section and exports the ExpenseInfoModel which can be injected
   * in any framework and developer will, by default get a self aware model for Expense
   * Information Section.<br/><br/>
   * The injected Model Class will have below properties:
   * <ul>
   *      <li>Model for Expense Section using [getNewModel()]{@link ExpenseInfoModel.getNewModel}</li>
   *      <li>Service abstractions to fetch all the necessary component level data, which includes:
   *          <ul>
   *              <li>[init()]{@link ExpenseInfoModel.init}</li>
   *              <li>[getNewModel()]{@link ExpenseInfoModel.getNewModel}</li>
   *              <li>[getExpenseTypeList()]{@link ExpenseInfoModel.getExpenseTypeList}</li>
   *              <li>[getFrequencyList()]{@link ExpenseInfoModel.getFrequencyList}</li>
   *              <li>[getExistingExpenses()]{@link ExpenseInfoModel.getExistingExpenses}</li>
   *              <li>[saveModel()]{@link ExpenseInfoModel.saveModel}</li>
   *              <li>[deleteModel()]{@link ExpenseInfoModel.deleteModel}</li>
   *          </ul>
   *      </li>
   * </ul>
   *
   * @namespace ExpenseInfo~ExpenseInfoModel
   * @class ExpenseInfoModel
   * @property {String} type - type of expense selected
   * @property {Object} amount - Object containing details of the expense amount entered by the user
   * @property {Float} amount.amount - Decimal value indicating the expense amount entered by the user
   * @property {String} amount.currency - Strin indicating the expense currency code
   * @property {String} frequency - Frequency of the users expense
   * @property {Integer} applicantPercentage - Value indicating the ownership percentage of the user for the expense
   */
  return function ExpenseInfoModel() {
    /**
     * In case more than one instance of model is required, eg for main and co-applicant
     * we are declaring model as a function, of which new instances can be created and
     * used when required.
     *
     * @function
     * @private
     * @returns {void}
     * @memberOf ExpenseInfoModel
     */
    var Model = function() {
        this.type = "";
        this.amount = {
          amount: 0,
          currency: ""
        };
        this.frequency = "MONTHLY";
        this.applicantPercentage = 100;
        this.temp_isActive = true;
        this.temp_selectedValues = {
          type: "",
          frequency: ""
        };
      },
      modelInitialized = false,
      baseService = BaseService.getInstance(),
      /* variable to make sure that in case there is no change
       * in model no additional fetch requests are fired.*/
      modelStateChanged = true,
      submissionId, applicantId, profileId, getExpenseTypeListDeferred,
      /**
       * Private method to fetch list of Expense Types. This
       * method will resolve a passed deferred object, which can be returned
       * from calling function to the parent.
       *
       * @function getExpenseTypeList
       * @memberOf ExpenseInfoModel
       * @param {Object} deferred - An object type Deferred
       * @returns {void}
       * @private
       */
      getExpenseTypeList = function(deferred) {
        var options = {
          url: "financialTemplate?partyType=Individual&parameterType=Expense",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function() {
            deferred.reject();
          }
        };
        baseService.fetch(options);
      },
      getFrequencyListDeferred,
      /**
       * Private method to fetch list of frequency options. This
       * method will resolve a passed deferred object, which can be returned
       * from calling function to the parent.
       *
       * @function getFrequencyList
       * @memberOf ExpenseInfoModel
       * @param {Object} deferred - An object type Deferred
       * @returns {void}
       * @private
       */
      getFrequencyList = function(deferred) {
        var options = {
          url: "enumerations/frequency?for={type}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function() {
            deferred.reject();
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
       * @param {Object} deferred - An object type Deferred
       * @returns {void}
       * @private
       */
      getExistingExpenses = function(deferred) {
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
      saveModelDeferred,
      /**
       * Private method to save/update the expense data of the user. This
       * method will resolve a passed deferred object, which can be returned
       * from calling function to the parent.
       *
       * @function saveModel
       * @memberOf ExpenseInfoModel
       * @param {Object} model - model
       * @param {Object} deferred - An object type Deferred
       * @returns {void}
       * @private
       */
      saveModel = function(model, deferred) {
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
          },
          modelData = JSON.parse(model);
        if (modelData.expense.id) {
          options.url += "/" + modelData.expense.id;
          baseService.update(options, params);
        } else {
          baseService.add(options, params);
        }
      },
      deleteModelDeferred,
      /**
       * Private method to delete the expense data of the user. This
       * method will resolve a passed deferred object, which can be returned
       * from calling function to the parent.
       *
       * @function deleteModel
       * @memberOf ExpenseInfoModel
       * @param {Object} expenseId - expense Id
       * @param {Object} deferred - An object type Deferred
       * @private
       * @returns {void}
       */
      deleteModel = function(expenseId, deferred) {
        modelStateChanged = true;
        var options = {
            url: "submissions/{submissionId}/applicants/{applicantId}/financialProfile/expenses/{expenseId}?profileId={profileId}",
            data: "",
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
            profileId: profileId,
            expenseId: expenseId
          };
        baseService.remove(options, params);
      },
      errors = {
        InitializationException: function() {
          var message = "";
          message += "\nObject can't be initialized without a valid submission Id. ";
          message += "\nPlease make sure the submission id is present.";
          message += "\nProper initialization has to be:";
          message += "\n\n\tModelName.init(\"SubId\"[, \"ApplicantId\"]);";
          return message;
        }(),
        InvalidApplicantId: function() {
          var message = "";
          message += "\nNo applicant id found, please make sure applicant id is present while initializing the model. ";
          message += "\nProper initialization has to be: ";
          message += "\n\n\tModelName.init(\"SubId\"[, \"ApplicantId\"]);";
          return message;
        }(),
        InvalidProfileId: function() {
          var message = "";
          message += "\nNo profile id found, please make sure profile id is present while initializing the model. ";
          message += "\nProper initialization has to be: ";
          message += "\n\n\tModelName.init(\"SubId\", \"ApplicantId\", \"ProfileId\");";
          return message;
        }(),
        ObjectNotInitialized: function() {
          var message = "";
          message += "\nModel has not been initialized. Please initialize the model before setting properties. ";
          message += "\nProper initialization has to be: ";
          message += "\n\n\tModelName.init(\"SubId\"[, \"ApplicantId\"]);";
          return message;
        }()
      },

      /**
       * objectInitializedCheck - method to check whether variables are initialized or not
       *
       * @return {object}  void
       */
      objectInitializedCheck = function() {
        if (!modelInitialized) {
          throw new Error(errors.ObjectNotInitialized);
        }
      };
    return {
      /**
       * Method to initialize the described model, this function will take three params
       * and will throw appropriate exception in case no submission / applicantId / profileId are not present.
       *
       * @param {String} subId - submission id for current application
       * @param {String} applId - applicant id for current user
       * @param {String} profId - profile id for current user
       * @function init
       * @memberOf ExpenseInfoModel
       * @returns {void}
       */
      init: function(subId, applId, profId) {
        submissionId = subId || undefined;
        applicantId = applId || undefined;
        profileId = profId || undefined;
        if (!submissionId) {
          throw new Error(errors.InitializationException);
        }
        if (!applicantId) {
          throw new Error(errors.InvalidApplicantId);
        }
        if (!profileId) {
          throw new Error(errors.InvalidProfileId);
        }
        modelInitialized = true;
        this.getExistingExpenses();
        return modelInitialized;
      },
      /**
       * Method to get new instance of Expense Information model. This method is a static member
       * of ExpenseInfoModel class, and on calling it will instantiate the defined [Model]{@link
       * ExpenseInfoModel.Model} (private to this class) and return a new instance of same.
       *
       * @function getNewModel
       * @param {object} modelData - javascript object with predefined attributed present with which
       * the model will be initialized
       * @memberOf ExpenseInfoModel
       * @returns {object} Model
       */
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      /**
       * Public method to fetch list of Expense types. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function getExpenseTypeList
       * @memberOf ExpenseInfoModel
       * @returns {object} deferredObject
       * @example
       *      ExpenseInfoModel.getExpenseTypeList().then(function (data) {
       *
       *      });
       */
      getExpenseTypeList: function() {
        objectInitializedCheck();
        getExpenseTypeListDeferred = $.Deferred();
        getExpenseTypeList(getExpenseTypeListDeferred);
        return getExpenseTypeListDeferred;
      },
      /**
       * Public method to fetch list of Frequency options. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function getFrequencyList
       * @memberOf ExpenseInfoModel
       * @returns {object} deferredObject
       * @example
       *      ExpenseInfoModel.getFrequencyList().then(function (data) {
       *
       *      });
       */
      getFrequencyList: function() {
        objectInitializedCheck();
        getFrequencyListDeferred = $.Deferred();
        getFrequencyList(getFrequencyListDeferred);
        return getFrequencyListDeferred;
      },
      /**
       * Public method to fetch list of existing expenses of the user. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function getExistingExpenses
       * @memberOf ExpenseInfoModel
       * @returns {object} deferredObject
       * @example
       *      ExpenseInfoModel.getExistingExpenses().then(function (data) {
       *
       *      });
       */
      getExistingExpenses: function() {
        objectInitializedCheck();
        if (modelStateChanged) {
          getExistingExpensesDeferred = $.Deferred();
          $.when(getExpenseTypeList, getFrequencyList).done(function() {
            getExistingExpenses(getExistingExpensesDeferred);
          });
        }
        return getExistingExpensesDeferred;
      },
      /**
       * Public method to save passed in Expense information model. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function saveModel
       * @memberOf ExpenseInfoModel
       * @param {Object} model - An object type data
       * @returns {object} deferredObject
       * @example
       * ExpenseInfoModel.saveModel().then(function (data) {
       *
       * });
       */
      saveModel: function(model) {
        objectInitializedCheck();
        saveModelDeferred = $.Deferred();
        saveModel(model, saveModelDeferred);
        return saveModelDeferred;
      },
      /**
       * Public method to delete the Expense information model. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function deleteModel
       * @memberOf ExpenseInfoModel
       * @returns {void} deferredObject
       * @param {Object} expenseId - An object type data
       * @example
       * ExpenseInfoModel.deleteModel().then(function (data) {
       *
       * });
       */
      deleteModel: function(expenseId) {
        objectInitializedCheck();
        deleteModelDeferred = $.Deferred();
        deleteModel(expenseId, deleteModelDeferred);
        return deleteModelDeferred;
      }
    };
  };
});