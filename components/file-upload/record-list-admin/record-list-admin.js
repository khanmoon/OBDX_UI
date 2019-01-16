define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/record-list-admin",
  "ojs/ojinputtext",
  "ojs/ojselectcombobox",
  "ojs/ojdatetimepicker",
  "ojs/ojlistview",
  "ojs/ojtable",
  "ojs/ojmodel",
  "ojs/ojarraytabledatasource",
  "ojs/ojpagingcontrol",
  "ojs/ojcollectiontabledatasource"
], function(oj, ko, $, recordListAdminModel, resourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    self.Nls = resourceBundle.recordListAdmin;
    rootParams.baseModel.registerComponent("record-view-admin", "file-upload");
    rootParams.baseModel.registerComponent("batch-record-delete", "file-upload");
    self.selectedCurrency = ko.observable();
    self.selectedPaymentType = ko.observable();
    self.selectedRStatus = ko.observable();
    self.selected = ko.observable(false);
    self.currencyListMap = {};
    self.currencyList = ko.observableArray();
    self.isCurrencyListLoaded = ko.observable(false);
    self.paymentTypeList = ko.observableArray();
    self.isPaymentTypeListLoaded = ko.observable(false);
    self.paymentTypeDisabled = ko.observable(false);
    self.transactionSuccess = ko.observable(false);
    self.rStatusListMap = {};
    self.rStatusList = ko.observableArray();
    self.isRStatusListLoaded = ko.observable(false);
    self.rStatus = ko.observable();
    self.toDate = ko.observable();
    self.pageNumber = ko.observable(1);
    self.totalCount = ko.observable();
    self.datasource = ko.observable();
    self.searchClicked = ko.observable(false);
    self.recordDetails = ko.observableArray();
    self.selectedRecord = ko.observable();
    self.recordDetailsMap = {};
    self.selectedFile = rootParams.data[0];
    self.searchData = {
      fromAmount: "",
      toAmount: "",
      beneName: "",
      debitAccno: "",
      creditAccno: "",
      currency: "",
      rStatus: "",
      valueDateTo: "",
      valueDateFrom: "",
      paymentType: ""
    };
    self.transactionTypesMap = {};
    self.isRecordsFetched = ko.observable(false);
    self.searchData = ko.mapping.fromJS(self.searchData);
    self.searchEnable = function() {
      $("#search").slideToggle();
    };
    self.closeSearch = function() {
      $("#search").slideToggle();
    };
    self.refreshSearch = function() {
      self.searchData.fromAmount("reset");
      self.searchData.toAmount("reset");
      self.searchData.fromAmount("");
      self.searchData.toAmount("");
      self.searchData.beneName("");
      self.searchData.debitAccno("");
      self.searchData.creditAccno("");
      self.searchData.currency([]);
      if (!self.paymentTypeDisabled())
        self.searchData.paymentType([]);
      self.searchData.beneName("");
      self.searchData.rStatus([]);
      self.searchData.valueDateFrom("");
      self.searchData.valueDateTo("");
    };
    self.currencyValueChangeHandler = function(event) {
      if (event.detail.value) {
        self.selectedCurrency(self.currencyListMap[self.searchData.currency()]);
        self.selected(true);
      }
    };
    self.paymentTypeValueChangeHandler = function(event) {
      self.selected(false);
      if (event.detail.value) {
        self.selectedPaymentType(self.searchData.paymentType());
        self.selected(true);
      }
    };
    self.rStatusValueChangeHandler = function(event) {
      self.selected(false);
      if (event.detail.value) {
        self.selectedRStatus(self.rStatusListMap[self.rStatus()]);
        self.selected(true);
      }
    };
    self.fromDateChanged = function(event) {
      if (event.detail.value) {
        var date = new Date(event.detail.value);
        date.setHours(0);
        date.setMinutes(0);
        $("#toDate").ojInputDate("option", "min", oj.IntlConverterUtils.dateToLocalIso(date));
        if (self.searchData.valueDateTo() !== "" && new Date(self.searchData.valueDateTo()) < new Date(self.searchData.valueDateFrom())) {
          self.searchData.valueDateTo("");
        }
      }
    };
    self.generateURL = function() {
      if (self.searchClicked()) {
        var params = (self.searchData.fromAmount() ? "&fromAmount=" + self.searchData.fromAmount() : "") + (self.searchData.toAmount() ? "&toAmount=" + self.searchData.toAmount() : "") + (self.searchData.beneName() ? "&beneName=" + encodeURIComponent(self.searchData.beneName()) : "") + (self.searchData.debitAccno() ? "&debitAccount=" + encodeURIComponent(self.searchData.debitAccno()) : "") + (self.searchData.creditAccno() ? "&creditAccount=" + encodeURIComponent(self.searchData.creditAccno()) : "") + (self.searchData.currency() ? "&currency=" + encodeURIComponent(self.searchData.currency()) : "") + (self.searchData.rStatus() ? "&recordStatus=" + self.searchData.rStatus() : "") + (self.searchData.valueDateTo() ? "&valueDateStart=" + self.searchData.valueDateFrom() : "") + (self.searchData.valueDateFrom() ? "&valueDateEnd=" + self.searchData.valueDateTo() : "") + (self.searchData.paymentType() ? "&transactionType=" + self.searchData.paymentType() : "&transactionType=" + self.selectedFile().transaction);
        self.searchParameters(params);
        return "fileUploads/files/" + self.selectedFile().fileId + "/records?pageSize=10&pageNumber=" + self.pageNumber() + params;
      }
      return "fileUploads/files/" + self.selectedFile().fileId + "/records?pageSize=10&pageNumber=" + self.pageNumber() + "&transactionType=" + self.selectedFile().transaction;

    };
    self.searchRecord = function() {
      self.searchData.currency(self.searchData.currency() + "");
      self.searchData.rStatus(self.searchData.rStatus() + "");
      self.searchData.paymentType(self.searchData.paymentType() + "");
      if (!self.searchData.fromAmount() && !self.searchData.toAmount() && !self.searchData.beneName()) {
        if (!self.searchData.debitAccno() && !self.searchData.creditAccno() && !self.searchData.currency()) {
          if (!self.searchData.rStatus() && !self.searchData.valueDateTo() && !self.searchData.valueDateFrom())
            if ((!self.paymentTypeDisabled() && !self.searchData.paymentType()) || self.paymentTypeDisabled()) {
              rootParams.baseModel.showMessages(null, [self.Nls.recordViewErrorMsg], "INFO");
              return;
            }
        }
      }
      if (self.searchData.toAmount() && !self.searchData.fromAmount()) {
        rootParams.baseModel.showMessages(null, [self.Nls.amountSelectErrorMsg], "INFO");
        return;
      }
      if (!self.searchData.toAmount() && self.searchData.fromAmount()) {
        rootParams.baseModel.showMessages(null, [self.Nls.amountSelectErrorMsg], "INFO");
        return;
      }
      if (self.searchData.toAmount() && !self.searchData.currency()) {
        rootParams.baseModel.showMessages(null, [self.Nls.currencyErrorMsg], "INFO");
        return;
      }
      if (self.searchData.valueDateFrom() && !self.searchData.valueDateTo()) {
        rootParams.baseModel.showMessages(null, [self.Nls.dateSelectErrorMsg], "INFO");
        return;
      }
      if (!self.searchData.valueDateFrom() && self.searchData.valueDateTo()) {
        rootParams.baseModel.showMessages(null, [self.Nls.dateSelectErrorMsg], "INFO");
        return;
      }
      self.searchClicked(true);
      self.pageNumber(1);
      self.screenType();
    };
    self.screenType = function() {
      if (rootParams.baseModel.large())
        self.recordDetailsCol().reset();
      else
        self.recordDetailsCol().refresh();
    };
    recordListAdminModel.getCurrencyTypes().done(function(data) {
      self.currencyList(data.currencyList);
      self.isCurrencyListLoaded(true);
    });
    recordListAdminModel.getPaymentTypes().done(function(data) {
      self.paymentTypeList(data.enumRepresentations[0].data);
      for (var i = 0; i < self.paymentTypeList().length; i++) {
        self.transactionTypesMap[self.paymentTypeList()[i].code] = self.paymentTypeList()[i].description;
      }
      self.isPaymentTypeListLoaded(true);
    });
    recordListAdminModel.getRecordStatus().done(function(data) {
      self.rStatusList(data.enumRepresentations[0].data);
      for (var i = 0; i < self.rStatusList().length; i++) {
        self.rStatusListMap[self.rStatusList()[i].code] = self.rStatusList()[i].description;
      }
      self.isRStatusListLoaded(true);
      self.createTableSource();
    });
    self.createTableSource = function() {
      self.recordDetailsCol = ko.observable();
      self.recordDetail = oj.Model.extend({
        idAttribute: "recRefId",
        sync: self.myFetch
      });
      self.myRecordDetail = new self.recordDetail();
      self.recordDetailsCollection = oj.Collection.extend({
        model: self.myRecordDetail,
        sync: self.myFetch,
        fetchSize: 10,
        hasMore: true
      });
      self.recordDetailsCol(new self.recordDetailsCollection());
      self.datasource(new oj.PagingTableDataSource(new oj.CollectionTableDataSource(self.recordDetailsCol(), {
        idAttribute: "recRefId"
      })));
      self.screenType();
    };
    self.myFetch = function(method, model, options) {
      if (method === "read" && model instanceof oj.Collection) {
        self.listRecords(options, model);
      }
    };
    self.listRecords = function(options, model) {
      self.pageNumber(Math.floor(options.startIndex / 10) + 1);
      self.isRecordsFetched(false);
      recordListAdminModel.listRecords(self.generateURL()).done(function(data) {
        self.recordDetails.removeAll();
        self.totalCount(data.totalCount);
        if (self.selectedFile().transaction !== "MIX") {
          self.paymentTypeDisabled(true);
          self.searchData.paymentType(self.selectedFile().transaction);
        }
        if (data.recordDetails) {
          for (var i = 0; i < data.recordDetails.length; i++) {
            var recordData = data.recordDetails[i];
            recordData.statusDesc = self.rStatusListMap[recordData.status];
            if (recordData.date) {
              recordData.date = rootParams.baseModel.formatDate(recordData.date);
            }
            self.recordDetailsMap[recordData.recRefId] = recordData;
            self.recordDetails.push(recordData);
          }
        }
        options.success(self.recordDetails());
        model.totalResults = self.totalCount();
        self.isRecordsFetched(true);
      });
    };

    self.onUserSelected = function(event) {
      if (event.detail.value) {
        if (event.detail.value.startKey.row) {
          self.selectedRecord(self.recordDetailsMap[event.detail.value.startKey.row]);
          rootParams.dashboard.loadComponent("record-view-admin", self.selectedRecord(), self);
        }
      }
    };
    self.onUserListSelected = function(data1) {
      self.selectedRecord(data1.row);
      rootParams.dashboard.loadComponent("record-view-admin", self.selectedRecord(), self);
    };
    self.downloadEReceipt = function(data) {
      if (data.status === "COMPLETED")
        recordListAdminModel.downloadEReceipt(self.selectedFile().fileId, data.recRefId);
    };
    self.renderCheckBox = function(context) {
      var checkBox = $(document.createElement("input"));
      var label = $(document.createElement("label"));
      checkBox.attr("type", "checkbox");
      checkBox.attr("value", context.row.recRefId);
      checkBox.attr("name", "selection");
      checkBox.attr("id", context.row.recRefId + "_labelID");
      if (context.row.status !== "PROCESSING_IN_PROGRESS") {
        checkBox.attr("disabled", true);
      } else
        $("#headerbox_labelID").attr("disabled", false);
      label.attr("class", "oj-checkbox-label hide-label");
      label.attr("for", context.row.recRefId + "_labelID");
      $(context.cellContext.parentElement).append(checkBox);
      $(context.cellContext.parentElement).append(label);
      label.text(self.Nls.childCheckBox);
    };
    self.renderHeaderCheckBox = function(context) {
      var headerCheckBox = $(document.createElement("input"));
      var label = $(document.createElement("label"));
      headerCheckBox.attr("type", "checkbox");
      headerCheckBox.attr("value", "selectAll");
      headerCheckBox.attr("name", "selectionParent");
      headerCheckBox.attr("id", "headerbox_labelID");
      headerCheckBox.attr("disabled", true);
      label.attr("class", "oj-checkbox-label hide-label");
      label.attr("for", "headerbox_labelID");
      $(context.headerContext.parentElement.firstElementChild.firstChild).append(headerCheckBox);
      $(context.headerContext.parentElement.firstElementChild.firstChild).append(label);
      label.text(self.Nls.headerCheckBox);
    };

    $(document).ready(function() {
      $(document).on("change", "input[name=selection]", function() {
        self.toShow(!!$("input[name=selection]:checked").length);
        self.successfulTransactions(0);
        self.pendingApprovalsTransaction(0);
        self.erroneousTransaction(0);
        $("input[name=selectionParent]").prop("checked", $("input[name=selection]:checked").length === $("input[name=selection]:enabled").length);
        self.transactionSuccess(false);
      });
      $(document).on("change", "input[name=selectionParent]", function() {
        $("input[name=selection]:enabled").prop("checked", $("input[name=selectionParent]").prop("checked"));
        self.successfulTransactions(0);
        self.pendingApprovalsTransaction(0);
        self.erroneousTransaction(0);
        self.toShow(!!$("input[name=selection]:enabled").length && !!$("input[name=selectionParent]").prop("checked"));
        self.transactionSuccess(false);
      });
      $(document).on("ojready", "table#table", function() {
        $("input[name^=\"selection\"]").prop("checked", false);
      });
    });
    self.close = function() {
      self.toShow(false);
      self.transactionSuccess(false);
    };
  };
});
