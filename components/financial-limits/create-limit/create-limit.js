define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",

  "ojL10n!resources/nls/create-limit",
  "ojs/ojknockout-validation",
  "ojs/ojvalidationgroup",
  "ojs/ojinputtext",
  "ojs/ojbutton",
  "ojs/ojtable",
  "ojs/ojarraytabledatasource",
  "ojs/ojgauge",
  "ojs/ojchart",
  "ojs/ojlistview",
  "ojs/ojdatetimepicker",
  "ojs/ojinputnumber",
  "ojs/ojselectcombobox"
], function(oj, ko, $, CreateLimitModel, resourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this;
    self.flag = ko.observable(false);
    self.checkedOption = self.checkedOption ? self.checkedOption : ko.observable();
    ko.utils.extend(self, rootParams.rootModel);
    self.nls = resourceBundle;
    self.resource=resourceBundle;
    rootParams.dashboard.headerName(self.nls.common.limitheader);
    self.chekValidation = ko.observable(false);
    self.groupValid = ko.observable();
    self.templateValid = ko.observable();
    self.addTimeButton = ko.observable(false);
    self.validationTracker = ko.observable();
    self.currency = ko.observable();
    self.currencyLoaded = ko.observable(false);
    self.currencyList = ko.observableArray([]);
    self.showTransactionAmount = ko.observable(self.showTransactionAmount || false);
    self.showCummulativeAmount = ko.observable(self.showCummulativeAmount || false);
    self.showCoolingAmount = ko.observable(self.showCoolingAmount || false);
    rootParams.baseModel.registerComponent("review-create-limit", "financial-limits");
    rootParams.baseModel.registerElement("modal-window");
    rootParams.baseModel.registerElement("amount-input");
    self.frequency = ko.observable("DAILY");
    self.lastCoolingTransaction = ko.observable("");
    self.coolingDatasource = ko.observable();
    self.coolingDataArray = ko.observableArray();
    if (self.params.data && self.params.data.periodicity) {
      self.frequency(self.params.data.periodicity());
    }
    if (self.params.data) {
      self.currency(self.params.data.currency());
    }
    var getNewKoModel = function() {
      var KoModel = CreateLimitModel.getNewModel();
      return ko.mapping.fromJS(KoModel);
    };
    self.initializeTime = function() {
      for (var i = 0; i < 100; i++) {
        if (i < 24) {
          self.hoursList().push(i);
        }
        if (i < 60) {
          self.minutesList().push(i);
        }
        self.daysList().push(i);
      }
    };
    self.initialize = function() {
      self.transactionLimitModelInstance(getNewKoModel().TransactionalLimitModel);
      self.transactionLimitSection(true);
      self.payLoadFlag("TXN");
    };
    if (self.params.mode !== "edit") {
      self.transactionLimitSection = ko.observable(false);
      self.cummulativeLimitSection = ko.observable(false);
      self.coolingPeriodLimitSection = ko.observable(false);
      self.addTimeButton = ko.observable(true);
      self.transactionLimitModelInstance = ko.observable();
      self.cummulativeLimitModelInstance = ko.observable();
      self.coolingPeriodLimitModelInstance = ko.observable();
      self.payLoadFlag = ko.observable();
      self.payloadObj = {};
      self.checkedOption(self.nls.limitType.transaction);
      self.validationTracker = ko.observable();
      self.daysList = ko.observableArray([]);
      self.hoursList = ko.observableArray([]);
      self.minutesList = ko.observableArray([]);
      self.coolingDataLoaded = ko.observable(false);
      self.initializeTime();
      self.initialize();
    }
    self.handleCreateLimit = function(event) {
      if (event.type === "valueChanged") {
        if ((event.detail.value).toUpperCase() === "TRANSACTION") {
          self.transactionLimitModelInstance(getNewKoModel().TransactionalLimitModel);
          self.showCummulativeAmount(false);
          self.showCoolingAmount(false);
          self.transactionLimitSection(true);
          self.cummulativeLimitSection(false);
          self.coolingPeriodLimitSection(false);
          self.frequency("DAILY");
          self.payLoadFlag("TXN");
        } else if ((event.detail.value).toUpperCase() === "CUMULATIVE") {
          self.cummulativeLimitModelInstance(getNewKoModel().PeriodicLimitModel);
          self.showTransactionAmount(false);
          self.showCoolingAmount(false);
          self.transactionLimitSection(false);
          self.cummulativeLimitSection(true);
          self.coolingPeriodLimitSection(false);
          self.payLoadFlag("PER");
        } else if ((event.detail.value).toUpperCase() === "DURATIONAL") {
          self.coolingPeriodLimitModelInstance(getNewKoModel().DurationLimitModel);
          self.showTransactionAmount(false);
          self.showCummulativeAmount(false);
          self.transactionLimitSection(false);
          self.cummulativeLimitSection(false);
          self.coolingPeriodLimitSection(true);
          self.frequency("DAILY");
          self.payLoadFlag("DUR");
        }
      }
    };
    self.save = function() {

      if (!(rootParams.baseModel.showComponentValidationErrors(document.getElementById("tracker")) && rootParams.baseModel.showComponentValidationErrors(document.getElementById("templateTracker"))))
      return;

      if (self.payLoadFlag() === "TXN") {
        self.transactionLimitModelInstance().currency(self.currency());
        self.transactionLimitModelInstance().amountRange.minTransaction.currency(self.currency());
        self.transactionLimitModelInstance().amountRange.maxTransaction.currency(self.currency());
        if (self.transactionLimitModelInstance().amountRange.minTransaction.amount() > self.transactionLimitModelInstance().amountRange.maxTransaction.amount()) {
          rootParams.baseModel.showMessages(null, [self.nls.common.invalidAmountMsg], "ERROR");
          return;
        }
        self.payloadObj = self.transactionLimitModelInstance();
      } else if (self.payLoadFlag() === "PER") {
        self.cummulativeLimitModelInstance().currency(self.currency());
        self.cummulativeLimitModelInstance().maxAmount.currency(self.currency());
        self.cummulativeLimitModelInstance().periodicity(self.frequency());
        self.payloadObj = self.cummulativeLimitModelInstance();
      } else if (self.payLoadFlag() === "DUR") {
        self.coolingPeriodLimitModelInstance().currency(self.currency());
        self.payloadObj = self.coolingPeriodLimitModelInstance();
        var i;
        for (i = 0; i < self.payloadObj.durationLimitSlots().length; i++) {
          self.verifyTimestamp(i);
        }
        if (self.chekValidation() || self.addTimeButton() === true) {
          rootParams.baseModel.showMessages(null, [self.nls.common.invalidEntryMsg], "ERROR");
          return;
        }
        for (i = 0; i < self.payloadObj.durationLimitSlots().length; i++) {
          self.payloadObj.durationLimitSlots()[i].amount.currency(self.currency());
          if (self.payloadObj.durationLimitSlots()[i].endDuration.days() instanceof Array) {
            self.payloadObj.durationLimitSlots()[i].endDuration.days(self.payloadObj.durationLimitSlots()[i].endDuration.days());
          }
          if (self.payloadObj.durationLimitSlots()[i].endDuration.hours() instanceof Array) {
            self.payloadObj.durationLimitSlots()[i].endDuration.hours(self.payloadObj.durationLimitSlots()[i].endDuration.hours());
          }
          if (self.payloadObj.durationLimitSlots()[i].endDuration.minutes() instanceof Array) {
            self.payloadObj.durationLimitSlots()[i].endDuration.minutes(self.payloadObj.durationLimitSlots()[i].endDuration.minutes());
          }
          if (self.payloadObj.durationLimitSlots()[i].startDuration.days() instanceof Array) {
            self.payloadObj.durationLimitSlots()[i].startDuration.days(self.payloadObj.durationLimitSlots()[i].startDuration.days());
          }
          if (self.payloadObj.durationLimitSlots()[i].startDuration.hours() instanceof Array) {
            self.payloadObj.durationLimitSlots()[i].startDuration.hours(self.payloadObj.durationLimitSlots()[i].startDuration.hours());
          }
          if (self.payloadObj.durationLimitSlots()[i].startDuration.minutes() instanceof Array) {
            self.payloadObj.durationLimitSlots()[i].startDuration.minutes(self.payloadObj.durationLimitSlots()[i].startDuration.minutes());
          }
        }
      }
      rootParams.dashboard.loadComponent("review-create-limit", {
        data: self.payloadObj
      }, self);
    };
    self.cancel = function() {
      rootParams.dashboard.openDashBoard(self.nls.common.confirmationMessage);
    };
    self.closeDialogBox = function() {
      $("#invalidTimeDialog").hide();
      $("#cancelDialog").hide();
      $("#invalidAmountDialog").hide();
    };
    self.back = function() {
      self.showTransactionAmount(false);
      self.showCummulativeAmount(false);
      self.showCoolingAmount(false);
      rootParams.dashboard.loadComponent("limit-base", {}, self);
    };
    self.removePeriod = function(index, data) {
      if (index && index < self.coolingDataArray().length - 1) {
        self.coolingDataArray()[index + 1].startDuration.days(self.coolingDataArray()[index - 1].endDuration.days());
        self.coolingDataArray()[index + 1].startDuration.hours(self.coolingDataArray()[index - 1].endDuration.hours());
        self.coolingDataArray()[index + 1].startDuration.minutes(self.coolingDataArray()[index - 1].endDuration.minutes());
      }
      self.coolingPeriodLimitModelInstance().durationLimitSlots.remove(function(data1) {
        return data1.startDuration === data.startDuration && data1.amount.amount === data.amount.amount;
      });
      self.coolingDataArray.remove(function(data2) {
        return data2.id === data.id && data2.amount.amount === data.amount.amount;
      });
      self.coolingDatasource(new oj.ArrayTableDataSource(self.coolingDataArray, {
        idAttribute: "id"
      }));
      self.coolingPeriodLimitSection(true);
      self.addTimeButton(false);
      self.chekValidation(false);
      self.showCoolingAmount(false);
      self.showCoolingAmount(true);
    };
    self.addTimePeriod = function() {
      if (self.chekValidation() || self.addTimeButton()) {
        rootParams.baseModel.showMessages(null, [self.nls.common.invalidEntryMsg], "ERROR");
        return;
      }
      var obj1 = getNewKoModel().DurationLimitModel.durationLimitSlots()[0];
      obj1.startDuration.days(self.coolingPeriodLimitModelInstance().durationLimitSlots()[self.coolingPeriodLimitModelInstance().durationLimitSlots().length - 1].endDuration.days());
      obj1.startDuration.hours(self.coolingPeriodLimitModelInstance().durationLimitSlots()[self.coolingPeriodLimitModelInstance().durationLimitSlots().length - 1].endDuration.hours());
      obj1.startDuration.minutes(self.coolingPeriodLimitModelInstance().durationLimitSlots()[self.coolingPeriodLimitModelInstance().durationLimitSlots().length - 1].endDuration.minutes());
      self.coolingPeriodLimitModelInstance().durationLimitSlots.push(obj1);
      var coolingPeriodData = $.map(self.coolingPeriodLimitModelInstance().durationLimitSlots(), function(coolingDataLocal) {
        coolingDataLocal.id = coolingDataLocal.startDuration.days() + coolingDataLocal.startDuration.hours() + coolingDataLocal.startDuration.minutes();
        return coolingDataLocal;
      });
      self.coolingDataArray(coolingPeriodData);
      self.coolingDatasource(new oj.ArrayTableDataSource(self.coolingDataArray, {
        idAttribute: "id"
      }));
      self.showCoolingAmount(false);
      self.showCoolingAmount(true);
      self.addTimeButton(true);
    };
    self.verifyStartTime = function(index, data) {

      self.verifyTimestamp(index, data);
      if (self.coolingDataArray().length - 1 > index) {
        self.coolingDataArray()[index + 1].startDuration.days(self.coolingDataArray()[index].endDuration.days());
        self.coolingDataArray()[index + 1].startDuration.hours(self.coolingDataArray()[index].endDuration.hours());
        self.coolingDataArray()[index + 1].startDuration.minutes(self.coolingDataArray()[index].endDuration.minutes());
      }
      self.showCoolingAmount(false);
      self.showCoolingAmount(true);

    };
    self.verifyTimestamp = function(index) {
      self.chekValidation(false);
      var sday = parseInt(self.coolingPeriodLimitModelInstance().durationLimitSlots()[index].startDuration.days());
      var eday = parseInt(self.coolingPeriodLimitModelInstance().durationLimitSlots()[index].endDuration.days());
      var shour = parseInt(self.coolingPeriodLimitModelInstance().durationLimitSlots()[index].startDuration.hours());
      var ehour = parseInt(self.coolingPeriodLimitModelInstance().durationLimitSlots()[index].endDuration.hours());
      var smin = parseInt(self.coolingPeriodLimitModelInstance().durationLimitSlots()[index].startDuration.minutes());
      var emin = parseInt(self.coolingPeriodLimitModelInstance().durationLimitSlots()[index].endDuration.minutes());
      if (!(eday && ehour && emin) && (eday || ehour || emin)) {
        if (eday && !ehour && !emin) {
          self.coolingPeriodLimitModelInstance().durationLimitSlots()[index].endDuration.hours("0");
          self.coolingPeriodLimitModelInstance().durationLimitSlots()[index].endDuration.minutes("0");
          ehour = 0;
          emin = 0;
        }
        if (ehour && !eday && !emin) {
          self.coolingPeriodLimitModelInstance().durationLimitSlots()[index].endDuration.minutes("0");
          self.coolingPeriodLimitModelInstance().durationLimitSlots()[index].endDuration.days("0");
          eday = 0;
          emin = 0;
        }
        if (emin && !eday && !ehour) {
          self.coolingPeriodLimitModelInstance().durationLimitSlots()[index].endDuration.days("0");
          self.coolingPeriodLimitModelInstance().durationLimitSlots()[index].endDuration.hours("0");
          eday = 0;
          ehour = 0;
        }
      }
      if (eday !== null && eday !== "") {
        if (sday === eday) {
          if (shour === ehour) {
            if (smin === emin) {
              rootParams.baseModel.showMessages(null, [self.nls.common.invalidEntryMsg], "ERROR");
              self.chekValidation(true);
            } else if (smin > emin) {
              rootParams.baseModel.showMessages(null, [self.nls.common.invalidTimeMsg], "ERROR");
              self.chekValidation(true);
            }
          } else if (shour > ehour) {
            rootParams.baseModel.showMessages(null, [self.nls.common.invalidTimeMsg], "ERROR");
            self.chekValidation(true);
          }
        } else if (sday > eday) {
          self.chekValidation(true);
          rootParams.baseModel.showMessages(null, [self.nls.common.invalidTimeMsg], "ERROR");
        }
      }
      if (!isNaN(eday) && !isNaN(ehour) && !isNaN(emin)) {
        self.addTimeButton(false);
      } else {
        self.addTimeButton(true);
      }
    };
    self.noDecimalInput = function(data, event) {
      return event.charCode >= 48 && event.charCode <= 57;
    };
    CreateLimitModel.fetchCurrencies().done(function(data) {
      for (var i = 0; i < data.currencyList.length; i++) {
        self.currencyList().push({
          code: data.currencyList[i].code,
          description: data.currencyList[i].description
        });
      }
      self.currencyLoaded(true);
      if (self.params.data && self.params.data.limitType() === "DUR") {
        self.coolingDataArray(self.params.data.durationLimitSlots());
        self.coolingDatasource(new oj.ArrayTableDataSource(self.coolingDataArray, {
          idAttribute: "id"
        }));
        self.showCoolingAmount(false);
        self.showCoolingAmount(true);
        self.coolingDataLoaded(true);
      }
    });
    self.currencyOptionChangeHandler = function(event) {
      self.currency(event.detail.value.toString());
      if (self.transactionLimitSection())
        self.showTransactionAmount(true);
      if (self.cummulativeLimitSection())
        self.showCummulativeAmount(true);
      if (self.coolingPeriodLimitSection()) {
        var coolingPeriodData = $.map(self.coolingPeriodLimitModelInstance().durationLimitSlots(), function(coolingDataLocal) {
          coolingDataLocal.id = coolingDataLocal.startDuration.days() + coolingDataLocal.startDuration.hours() + coolingDataLocal.startDuration.minutes();
          return coolingDataLocal;
        });
        self.coolingDataArray(coolingPeriodData);
        self.coolingDatasource(new oj.ArrayTableDataSource(self.coolingDataArray, {
          idAttribute: "id"
        }));
        self.showCoolingAmount(false);
        self.showCoolingAmount(true);
        self.coolingDataLoaded(true);
      }
    };
  };
});
