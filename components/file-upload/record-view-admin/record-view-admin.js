define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/record-view-admin",
  "ojs/ojinputtext",
  "ojs/ojselectcombobox",
  "ojs/ojdatetimepicker",
  "ojs/ojlistview",
  "ojs/ojtable",
  "ojs/ojarraytabledatasource"
], function(oj, ko, $, recordViewAdminModel, resourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this;
    var getNewKoModel = function() {
      var KoModel = ko.mapping.fromJS(recordViewAdminModel.getNewModel());
      return KoModel;
    };
    ko.utils.extend(self, rootParams.rootModel);
    self.showBackButton = ko.observable(true);
    self.Nls = resourceBundle.recordView;
    self.rStatusList = ko.observableArray();
    self.recList = ko.observableArray();
    self.loadPartialComponentName = ko.observable();
    self.billerLabel = ko.observable();
    self.billerType = ko.observable();
    self.fileRefId = ko.observable();
    self.pageNumber = ko.observable(1);
    self.recordsList = ko.observableArray();
    rootParams.baseModel.registerElement("action-header");
    self.datasource = null;
    self.rStatusListMap = {};
    if (rootParams.rootModel.selectedFile) {
      rootParams.dashboard.headerName(self.Nls.uploadedFiles);
      self.selectedRecord = ko.observable(ko.utils.unwrapObservable(rootParams.rootModel.params));
    } else {
      self.selectedRecord = ko.observable(rootParams.data);
      self.showBackButton(false);
    }
    self.recordDetails = ko.observable();
    self.recordDetailsLoaded = ko.observable(false);
    self.recordType = ko.observable();
    self.transactionType = ko.observableArray();
    self.fileRefId = self.selectedRecord().fileRefId;
    self.generateURL = function() {
      return "fileUploads/files/" + self.fileRefId + "/records?pageSize=10&pageNumber=" + self.pageNumber() + "&transactionType=AB";
    };
    recordViewAdminModel.getJSONData().done(function(data) {
      self.transactionType = data;
    });
    recordViewAdminModel.getRecordStatus().done(function(data) {
      self.rStatusList(data.enumRepresentations[0].data);
      for (var i = 0; i < self.rStatusList().length; i++)
        self.rStatusListMap[self.rStatusList()[i].code] = self.rStatusList()[i].description;
      self.readRecord();
    });

    self.readRecord = function() {
      recordViewAdminModel.listRecords(self.generateURL()).done(function(data) {
        ko.utils.arrayForEach(data.recordDetails, function(detailsDTO) {
          self.recordsList().push(detailsDTO);
        });
        for (var m = 0; m < self.recordsList().length; m++) {
          if (self.recordsList()[m].recRefId === self.selectedRecord().recRefId) {
            self.billerType(self.recordsList()[m].billerType);
          }
        }
      });
      recordViewAdminModel.readRecord(self.selectedRecord().fileRefId, self.selectedRecord().recRefId).done(function(data) {
        if (data.recordDetails) {
          var obj = data.recordDetails;
          if (obj.valueDate) {
            obj.date = rootParams.baseModel.formatDate(obj.valueDate);
          }
          self.recordDetails(obj);
          self.recordDetails.recRefId = self.selectedRecord().recRefId;
          self.recordDetails.recStatus = self.selectedRecord().status;
          self.recordDetails.billerType = self.billerType();
          self.recordType(data.transactionType);
          var transactionType = self.transactionType[data.transactionType];
          if (transactionType) {
            self.loadPartialComponentName(transactionType[0].partialComponentName);
          }
        }
        for (var i = 1; i < 11; i++) {
          var billerLabel = "billerLabel" + i;
          var required = "required" + i;
          var dataType = "dataType" + i;
          var records = getNewKoModel().payload;
          if (self.recordDetails()[billerLabel]) {
            records.label = billerLabel;
            records.values = self.recordDetails()[billerLabel];
            records.dataType = self.recordDetails()[dataType];
            if (self.recordDetails()[required] === "Y") {
              records.mandatory = self.Nls.mandatory;
            } else {
              records.mandatory = self.Nls.optional;
            }
            self.recList.push(records);
          }

        }
        self.datasource = new oj.ArrayTableDataSource(self.recList, {});
        if (data.errorDetails)
          if (data.errorDetails.length !== 0)
            self.recordDetails().errorMessage = data.errorDetails[0].errorMessage;
        self.recordDetailsLoaded(true);
      });
    };
    self.back = function() {
      history.go(-1);
    };
  };
});
