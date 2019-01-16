define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "baseLogger",
  "ojL10n!resources/nls/debit-card-details",
  "ojs/ojknockout",
  "ojs/ojinputnumber",
  "ojs/ojtable",
  "ojs/ojdatacollection-utils",
  "ojs/ojarraytabledatasource",
  "ojs/ojinputtext",
  "ojs/ojbutton",
  "ojs/ojknockout-validation",
  "ojs/ojvalidation"
], function(oj, ko, $, ManageCardLimitModel, BaseLogger, locale) {
  "use strict";
  return function(Params) {
    var self = this;
    ko.utils.extend(self, Params.rootModel);
    self.locale = locale;
    Params.dashboard.headerName(self.locale.header.debitCardDetails);
    self.mobileView = ko.observable(false);
    self.mobileViewIntl = ko.observable(false);
    self.fetchlimitdata = ko.observableArray();
    self.isDataLoaded = ko.observable(false);
    self.limitTypeLocal = ko.observable();
    self.mode = ko.observable("VIEW");
    self.internationalMode = ko.observable("InternationalVIEW");
    self.isInternationalTxn = ko.observable(true);
    if (self.params.isInternationalTxn) {
      self.isInternationalTxn(self.params.isInternationalTxn === "true");
    }
    self.datasource = ko.observableArray();
    self.internationLimitDataSource = ko.observableArray();
    self.dataLoaded = ko.observable(false);
    self.mode = ko.observable();
    self.editFlag = ko.observable("none");
    self.rowTemplateValue = ko.observable("rowTemplate");
    self.internationalLimitTemplateValue = ko.observable("internationalLimitRowTemplate");
    self.validationTracker = ko.observable();
    self.payload = ManageCardLimitModel.getNewDebitCardDetailsModel();
    Params.baseModel.registerElement("confirm-screen");
    Params.baseModel.registerElement("amount-input");
    self.srNo = ko.observable();
    self.columns = [{
      headerText: self.locale.debitCards.limits.facility,
      sortable: "disabled"
    }, {
      headerText: self.locale.debitCards.limits.NoOfTran,
      sortable: "disabled"
    }, {
      headerText: self.locale.debitCards.limits.Amount,
      sortable: "disabled"
    }];

    self.reviewTransactionName = {
      header: self.locale.debitCards.reviewHead1,
      reviewHeader: self.locale.debitCards.reviewHead
    };

    if (self.params.mode) {
      self.mode(self.params.mode);
      self.rowTemplateValue(self.params.rowTemplateValue);
      if (self.internationalTransactionsValue()) {
        if (self.params.internationalMode) {
          self.internationalMode(self.params.internationalMode);
          self.internationalLimitTemplateValue(self.params.internationalLimitTemplateValue);
        }
        self.internationLimitDataSource = new oj.ArrayTableDataSource(self.params.intlData, {
          idAttribute: "limitType"
        });
      }
      self.datasource = new oj.ArrayTableDataSource(self.params.data, {
        idAttribute: "limitType"
      });
      self.isDataLoaded(true);
    } else {
      self.mode("VIEW");
    }
    self.back = function() {
      history.back();
    };
    self.openModal = function(id) {
      $("#" + id).trigger("openModal");
    };
    self.cancel = function (id) {
        $("#" + id).trigger("closeModal");
    };
    self.editLimit = function() {
      self.editFlag("rowEdit");
      if (Params.baseModel.small()) {
        self.mobileView(true);
      } else {
        self.rowTemplateValue("editRowTemplate");
      }
      self.mode("EDIT");
    };
    self.editIntnlLimit = function() {
      self.internationalLimitTemplateValue("editInternationalLimit");
      if (Params.baseModel.small()) {
        self.mobileViewIntl(true);
      } else {
        self.internationalMode("InternationalEDIT");
      }
    };
    self.editLimitConfirm = function() {
      self.payload.accountId = self.accountId;
      var debitCardLimitArray = [];
      for (var i = 0; i < self.datasource.data.length; i++) {
        var debitCardLimit = ManageCardLimitModel.getNewDebitCardLimitsModel();
        if (self.datasource.data[i].unit)
          debitCardLimit.unit = self.datasource.data[i].unit;
        debitCardLimit.amount = ko.mapping.toJS(self.datasource.data[i].amountType);
        debitCardLimit.count = self.datasource.data[i].count();
        debitCardLimit.limitType = self.datasource.data[i].limitType;
        debitCardLimitArray[i] = debitCardLimit;
      }
      if (self.isInternationalTxn) {
        self.payload.debitCardInternationalLimit = debitCardLimitArray;
        delete self.payload.debitCardLimit;
      } else {
        self.payload.debitCardLimit = debitCardLimitArray;
        delete self.payload.debitCardInternationalLimit;
      }
      ManageCardLimitModel.updateLimits(self.accountId, self.cardNo, ko.toJSON(self.payload)).done(function(data, status, jqXhr) {
        self.srNo(data.serviceId);
        Params.dashboard.loadComponent("confirm-screen", {
          jqXHR: jqXhr,
          sr: data.serviceId,
          transactionName: self.locale.debitCards.limits.transactionName,
          template: "confirm-screen/casa-template",
          flagLimits: true,
          columns: self.columns,
          datasource: self.datasource,
          srNo: self.srNo(),
          resourceBundle: self.locale,
          confirmScreenExtensions: {
            taskCode: "CH_N_RDCLC"
          }
        }, self);
      });
    };
    self.reviewLimit = function() {
      var context = {};
      context.mode = "REVIEW";
      context.internationalMode = "InternationalREVIEW";
      context.isInternationalTxn = "false";
      context.rowTemplateValue = "rowTemplate";
      context.internationalLimitTemplateValue = "internationalLimitRowTemplate";
      context.data = self.datasource.data;
      if (self.internationLimitDataSource && self.internationLimitDataSource.data) {
        context.intlData = self.internationLimitDataSource.data;
      }
      Params.dashboard.loadComponent("debit-card-limits", context, self);
    };

    self.reviewInternationalLimit = function() {
      var context = {};
      context.mode = "REVIEW";
      context.internationalMode = "InternationalREVIEW";
      context.isInternationalTxn = "true";
      context.rowTemplateValue = "rowTemplate";
      context.internationalLimitTemplateValue = "internationalLimitRowTemplate";
      context.data = self.datasource.data;
      context.intlData = self.internationLimitDataSource.data;
      Params.dashboard.loadComponent("debit-card-limits", context, self);
    };
    self.ok = function() {
      history.go(-2);
    };
    Params.baseModel.registerComponent("debit-card-pin-request", "demand-deposits");
    Params.baseModel.registerComponent("debit-card-hotlisting", "demand-deposits");
    if (self.mode() !== "REVIEW") {
      ManageCardLimitModel.fetchLimits(self.accountId, self.cardNo).done(function(data) {
        self.isDataLoaded(true);
        var limitsData = $.map(data.debitCardDetails[0].debitCardLimit, function(limitsDataLocal) {
          if (limitsDataLocal.limitType) {
            if (limitsDataLocal.limitType === "A") {
              self.limitTypeLocal(self.locale.debitCards.limits.ownAtmLimits);
            } else if (limitsDataLocal.limitType === "R") {
              self.limitTypeLocal(self.locale.debitCards.limits.remoteAtmLimits);
            } else if (limitsDataLocal.limitType === "P") {
              self.limitTypeLocal(self.locale.debitCards.limits.ownPointSaleLimits);
            } else if (limitsDataLocal.limitType === "RP") {
              self.limitTypeLocal(self.locale.debitCards.limits.RemotePointSaleLimits);
            } else if (limitsDataLocal.limitType === "EC") {
              self.limitTypeLocal(self.locale.debitCards.limits.eCommerce);
            }
            limitsDataLocal.limitTypeLocal = self.limitTypeLocal();
            limitsDataLocal.count = ko.observable(ko.utils.unwrapObservable(limitsDataLocal.count));
            if (limitsDataLocal.amountType) {
              limitsDataLocal.amountType = ko.mapping.fromJS({
                amount: limitsDataLocal.amountType.amount,
                currency: limitsDataLocal.amountType.currency
              });
              if (self.previousState && self.previousState.isInternationalTxn === "true") {
                self.editIntnlLimit();
              } else if (self.previousState && self.previousState.isInternationalTxn === "false") {
                self.editLimit();
              }
            } else {
              limitsDataLocal.amountType = ko.mapping.fromJS({
                amount: limitsDataLocal.amount.amount,
                currency: limitsDataLocal.amount.currency
              });
            }
            return limitsDataLocal;
          }
        });

        var internationalLimitsData = $.map(data.debitCardDetails[0].debitCardInternationalLimit, function(limitsDataLocal) {
          if (limitsDataLocal.limitType) {
            if (limitsDataLocal.limitType === "A") {
              self.limitTypeLocal(self.locale.debitCards.limits.ownAtmLimits);
            } else if (limitsDataLocal.limitType === "R") {
              self.limitTypeLocal(self.locale.debitCards.limits.remoteAtmLimits);
            } else if (limitsDataLocal.limitType === "P") {
              self.limitTypeLocal(self.locale.debitCards.limits.ownPointSaleLimits);
            } else if (limitsDataLocal.limitType === "RP") {
              self.limitTypeLocal(self.locale.debitCards.limits.RemotePointSaleLimits);
            } else if (limitsDataLocal.limitType === "EC") {
              self.limitTypeLocal(self.locale.debitCards.limits.eCommerce);
            }
            limitsDataLocal.limitTypeLocal = self.limitTypeLocal();
            limitsDataLocal.count = ko.observable(ko.utils.unwrapObservable(limitsDataLocal.count));
            if (limitsDataLocal.amountType) {
              limitsDataLocal.amountType = ko.mapping.fromJS({
                amount: limitsDataLocal.amountType.amount,
                currency: limitsDataLocal.amountType.currency
              });
            } else {
              limitsDataLocal.amountType = ko.mapping.fromJS({
                amount: limitsDataLocal.amount.amount,
                currency: limitsDataLocal.amount.currency
              });
            }
            return limitsDataLocal;
          }
        });
        var i;
        var j;
        self.sortedIternationalData = [];
        var sortedCount = 0;
        for (i = 0; i < limitsData.length; i++) {
          for (j = 0; j < internationalLimitsData.length; j++) {
            if (limitsData[i].limitType === internationalLimitsData[j].limitType) {
              self.sortedIternationalData[sortedCount++] = internationalLimitsData[j];
              break;
            }
          }
        }

        if (limitsData.length > 0) {
          self.datasource = new oj.ArrayTableDataSource(limitsData, {
            idAttribute: "limitType"
          });
          self.dataLoaded(true);
        }
        if (internationalLimitsData.length > 0) {
          self.internationLimitDataSource = new oj.ArrayTableDataSource(self.sortedIternationalData, {
            idAttribute: "limitType"
          });
        }
      });
    }
    self.cancelIntlEdit = function() {
      if (Params.baseModel.small()) {
        self.mobileViewIntl(false);
      } else {
        self.internationalMode("InternationalVIEW");
        self.internationalLimitTemplateValue("internationalLimitRowTemplate");
      }
    };

    self.cancelEdit = function() {
      if (Params.baseModel.small()) {
        self.mobileView(false);
      } else {
        self.mode("VIEW");
        self.rowTemplateValue("rowTemplate");
      }
    };
  };
});
