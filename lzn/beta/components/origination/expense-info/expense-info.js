define([
  "ojs/ojcore",
  "knockout",
  "jquery",

  "./model",
  "baseLogger",
  "ojL10n!lzn/beta/resources/nls/expense-info",
  "ojs/ojswitch",
    "ojs/ojvalidationgroup"
], function(oj, ko, $, ExpenseInfoModelObject, BaseLogger, resourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this,
      ExpenseInfoModel = new ExpenseInfoModelObject(),
      i = 0,
      getNewKoModel = function() {
        var KoModel = ExpenseInfoModel.getNewModel();
        KoModel.type = ko.observable(KoModel.type);
        KoModel.frequency = ko.observable(KoModel.frequency);
        KoModel.amount.amount = ko.observable(KoModel.amount.amount);
        KoModel.amount.currency = self.productDetails().currency;
        KoModel.temp_isActive = ko.observable(KoModel.temp_isActive);
        KoModel.temp_selectedValues = ko.observable(KoModel.temp_selectedValues);
        return KoModel;
      },
      deferredTracker1, transformFetchedData = function(data) {
        var tempExpensesList;
        tempExpensesList = ko.utils.arrayFilter(data.expenses, function(expense) {
          if (rootParams.baseModel.getDescriptionFromCode(self.expenditureOptions(), expense.type) !== "") {
            return expense;
          }
        });
        for (i = 0; i < tempExpensesList.length; i++) {
          tempExpensesList[i].type = ko.observable(tempExpensesList[i].type);
          tempExpensesList[i].frequency = ko.observable(tempExpensesList[i].frequency);
          tempExpensesList[i].amount.amount = ko.observable(tempExpensesList[i].amount.amount);
          tempExpensesList[i].temp_isActive = ko.observable(false);
          tempExpensesList[i].temp_selectedValues = ko.observable({
            type: rootParams.baseModel.getDescriptionFromCode(self.expenditureOptions(), tempExpensesList[i].type()),
            frequency: rootParams.baseModel.getDescriptionFromCode(self.frequencyOptions(), tempExpensesList[i].frequency())
          });
        }
        return tempExpensesList;
      };
    ko.utils.extend(self, rootParams.rootModel);
    self.resource = resourceBundle;
    if (self.applicantType === "PRIMARY") {
      self.applicantObject = ko.observable(rootParams.applicantObject);
    } else if (self.applicantType === "JOINT") {
      self.applicantObject = rootParams.applicantObject()[self.coAppCurrentIndex - 1];
      self.employmentProfileId(rootParams.empProfileIds()[0]);
    }
    self.expenditureOptionsLoaded = ko.observable(false);
    self.expenditureOptions = ko.observableArray([]);
    self.expenditureOptions(self.finExpenditureOptions());
    self.frequencyOptionsLoaded = ko.observable(false);
    self.frequencyOptions = ko.observableArray([]);
    self.validationTracker = ko.observable();
    self.existingExpensesLoaded = ko.observable(false);
    if (!self.applicantObject().financialProfile[self.profileIdIndex].expenseInfo) {
      self.applicantObject().financialProfile[self.profileIdIndex].expenseInfo = {
        isCompleting: ko.observable(true),
        expenseList: ko.observableArray([])
      };
    } else {
      self.applicantObject().financialProfile[self.profileIdIndex].expenseInfo.expenseList([]);
    }
    self.initializeModel = function() {
      ExpenseInfoModel.init(self.productDetails().submissionId.value, self.applicantObject().applicantId().value, self.employmentProfileId);
      if (self.expenditureOptions().length !== 0)
        self.expenditureOptionsLoaded(true);
      deferredTracker1 = ExpenseInfoModel.getFrequencyList().done(function(data) {
        for (var i = 0; i < data.enumRepresentations[0].data.length; i++) {
          if (self.resource.skipFrequency.toUpperCase() === data.enumRepresentations[0].data[i].code) {
            data.enumRepresentations[0].data.splice(i, 1);
            break;
          }
        }
        self.frequencyOptions(data.enumRepresentations[0].data);
        self.frequencyOptionsLoaded(true);
      });
      $.when(deferredTracker1).done(function() {
        ExpenseInfoModel.getExistingExpenses().done(function(data) {
          self.existingExpensesLoaded(false);
          self.applicantObject().financialProfile[self.profileIdIndex].expenseInfo.expenseList(transformFetchedData(data));
          self.existingExpensesLoaded(true);
        });
      });
    };
    self.initializeModel();
    self.addExpense = function(index, data) {
      data.expenseList.push(getNewKoModel());
    };
    self.deleteExpense = function(index, data, current) {
      if (current.id) {
        ExpenseInfoModel.deleteModel(current.id);
      }
      data.expenseList.splice(index, 1);
      data.expenseList(data.expenseList());
    };
    self.editExpenseInfo = function(data, currentExpense) {
      for (i = 0; i < data.expenseList().length; i++) {
        if (data.expenseList()[i].temp_isActive()) {
          return;
        }
      }
      currentExpense.temp_isActive(true);
    };
    self.displayAddExpenseButton = function(data) {
      for (i = 0; i < data.expenseList().length; i++) {
        if (data.expenseList()[i].temp_isActive()) {
          return false;
        }
      }
      return true;
    };
    self.displayFinalSubmit = ko.computed(function() {
      for (i = 0; i < self.applicantObject().financialProfile[self.profileIdIndex].expenseInfo.expenseList().length; i++) {
        if (self.applicantObject().financialProfile[self.profileIdIndex].expenseInfo.expenseList()[i].temp_isActive()) {
          return false;
        }
      }
      return true;
    });
    self.completeExpenseSection = function() {
      self.completeApplicationStageSection(rootParams.applicantStages, rootParams.applicantAccordion, rootParams.index + 1);
    };
    self.submitExpenseInfo = function(event, data) {

      var expenseInfoTracker = document.getElementById("expenseInfoTracker");
      if (expenseInfoTracker.valid === "valid") {
        if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
          return;
        }
        data.type = ko.utils.unwrapObservable(data.type);
        data.frequency = ko.utils.unwrapObservable(data.frequency);
        data.finacialParameterDescription = rootParams.baseModel.getDescriptionFromCode(self.expenditureOptions(), ko.utils.unwrapObservable(data.type));
        ExpenseInfoModel.saveModel(rootParams.baseModel.removeTempAttributes({
          profileId: self.employmentProfileId,
          expense: data
        })).done(function(data) {
          var i = 0;
          for (i = 0; i < self.applicantObject().financialProfile[self.profileIdIndex].expenseInfo.expenseList().length; i++) {
            if (self.applicantObject().financialProfile[self.profileIdIndex].expenseInfo.expenseList()[i].temp_isActive()) {
              if (data.expense) {
                self.applicantObject().financialProfile[self.profileIdIndex].expenseInfo.expenseList()[i].id = data.expense.id;
              }
              self.applicantObject().financialProfile[self.profileIdIndex].expenseInfo.expenseList()[i].temp_selectedValues().type = rootParams.baseModel.getDescriptionFromCode(self.expenditureOptions(), self.applicantObject().financialProfile[self.profileIdIndex].expenseInfo.expenseList()[i].type);
              self.applicantObject().financialProfile[self.profileIdIndex].expenseInfo.expenseList()[i].temp_selectedValues().frequency = rootParams.baseModel.getDescriptionFromCode(self.frequencyOptions(), self.applicantObject().financialProfile[self.profileIdIndex].expenseInfo.expenseList()[i].frequency);
              self.applicantObject().financialProfile[self.profileIdIndex].expenseInfo.expenseList()[i].temp_isActive(false);
            }
          }
        });
      } else {
        expenseInfoTracker.showMessages();
        expenseInfoTracker.focusOn("@firstInvalidShown");
      }
    };
    self.dispose = function() {
      self.displayFinalSubmit.dispose();
    };
  };
});
