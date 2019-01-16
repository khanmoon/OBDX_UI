define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "baseLogger",
  "ojL10n!resources/nls/service-requests-form-builder",
  "framework/js/constants/constants",
  "./model",
  "ojs/ojnavigationlist",
  "ojs/ojaccordion",
  "ojs/ojinputtext",
  "ojs/ojlistview",
  "ojs/ojarraydataprovider",
  "ojs/ojfilepicker"
], function (oj, ko, $, BaseLogger, ResourceBundle, Constants, ServiceRequestFormBuilder) {
  "use strict";
  return function (params) {
    var self = this;
    ko.utils.extend(self, params.rootModel);
    self.dataProvider = new oj.ArrayDataProvider(self.componentsArray);
    self.resource = ResourceBundle;
    self.menuItems = ko.observableArray();
    self.matchFound = ko.observable(false);
    self.formHeader = ko.observable();
    self.formSubHeader = ko.observable();
    self.infoHeader = ko.observable();
    self.textBox = ko.observable(false);
    self.panelData = ko.observable(false);
    self.infoText = ko.observable();
    self.uploadSuccessful = ko.observable(false);
    self.selectedComponent = ko.observable("text-box-control");
    self.nextComponent = ko.observable("sub-header-control");
    self.thirdComponent = ko.observable("section-header-control");
    self.radioComponent = ko.observable("radio-button-control");
    self.checkboxset = ko.observable("check-box-control");
    self.accountNumberComponent = ko.observable("account-number-control");
    self.dropListComponent = ko.observable("drop-list-control");
    self.salutation = ko.observable("salutation-control");
    self.multiSelectComponent = ko.observable("multi-select-control");
    self.toggle = ko.observable("toggle-button-control");
    self.gender = ko.observable("gender-control");
    self.country = ko.observable("country-states-control");
    self.datePicker = ko.observable("date-picker-control");
    self.uploadComponent = ko.observable("file-upload-control");
    self.accountNumberDebitCardComponent = ko.observable("account-number-debit-card-control");
    params.baseModel.registerComponent("file-upload-control", "service-requests");
    params.baseModel.registerComponent("country-states-control", "service-requests");
    params.baseModel.registerComponent("radio-button-control", "service-requests");
    params.baseModel.registerComponent("check-box-control", "service-requests");
    params.baseModel.registerComponent("account-number-control", "service-requests");
    params.baseModel.registerComponent("text-box-control", "service-requests");
    params.baseModel.registerComponent("sub-header-control", "service-requests");
    params.baseModel.registerComponent("section-header-control", "service-requests");
    params.baseModel.registerComponent("drop-list-control", "service-requests");
    params.baseModel.registerComponent("salutation-control", "service-requests");
    params.baseModel.registerComponent("gender-control", "service-requests");
    params.baseModel.registerComponent("toggle-button-control", "service-requests");
    params.baseModel.registerComponent("multi-select-control", "service-requests");
    params.baseModel.registerComponent("date-picker-control", "service-requests");
    params.baseModel.registerComponent("account-number-debit-card-control", "service-requests");
    params.dashboard.headerName(self.resource.serviceRequestCreateHeader);
    params.baseModel.registerElement("modal-window");
    var i, j;
    var sortedIDs;
    self.showSave = ko.observable(true);
    $(document).on("focusin", "#form-header", function () {
      if (!self.showSave()) {
        self.showSave(true);
      }
    });
    self.headerSave = function () {
      var track = document.getElementById("form-header");
      if (!params.baseModel.showComponentValidationErrors(track)) {
        return;
      }
      self.showSave(false);
    };
    var node = document.querySelector("#listview");
    var busyContext = oj.Context.getContext(node).getBusyContext();
    busyContext.whenReady().then(function () {
      if (self.componentsArray().length > 0) {
        $("oj-list-view>ul").sortable();
      }
    });
    $(document).on("sortstop", "oj-list-view>ul", function () {
      sortedIDs = $("oj-list-view>ul").sortable("toArray");
      var idNos = [];
      var newSortedArray = [];
      for (i = 0; i < sortedIDs.length; i++) {
        idNos.push(sortedIDs[i].split("_")[1]);
      }
      self.sequenceArray().splice(0, self.sequenceArray().length);
      for (i = 0; i < idNos.length; i++) {
        self.sequenceArray.push(parseInt(idNos[i]));
      }
      for (i = 0; i < self.sequenceArray().length; i++) {
        for (j = 0; j < self.sortableArray().length; j++) {
          if (self.sortableArray()[j].sequenceNumber === self.sequenceArray()[i]) {
            newSortedArray.push(self.sortableArray()[j]);
          }
        }
      }
      self.sortableArray().splice(0, self.sortableArray().length);
      for (j = 0; j < newSortedArray.length; j++) {
        self.sortableArray.push(newSortedArray[j]);
      }
    });
    self.addComponent = function (data) {
      if (self.componentsArray().length === 1) {
        $("oj-list-view>ul").sortable();
      }
      if (data.id === "cmsg") {
        self.confirmData(true);
      } else {
        self.componentsArray.push({
          data: data,
          id: data.id + "_" + (self.arrayCount() + 1),
          payload: null
        });
      }
      self.arrayCount(self.arrayCount() + 1);
      self.scrollMe();
    };
    self.scrollMe = function () {
      var objDiv = document.getElementById("end_elemental");
      objDiv.scrollIntoView();
    };
    self.copyComponent = function (data) {
      if (self.componentsArray().length === 1) {
        $("oj-list-view>ul").sortable();
      }
      if (data.formField) {
        var field = {
          id: data.formField().type,
          text: null
        };
        self.sequenceNumber = self.sequenceNumber + 1;
        self.storeData = JSON.parse(JSON.stringify(data.formField()));
        self.storeData.sequenceNumber = self.sequenceNumber;
        self.storeData.name = self.storeData.type + self.storeData.sequenceNumber;
        self.storeData.validation.isMandatory = ko.observable(data.formField().validation.isMandatory());
        self.sortableArray.push(self.storeData);
        self.componentsArray.push({
          data: field,
          id: field.id + "_" + (self.arrayCount() + 1),
          payload: self.storeData
        });
        self.arrayCount(self.arrayCount() + 1);
      }
      self.scrollMe();
    };
    ServiceRequestFormBuilder.fetchPanel().done(function (data) {
      self.menuItems(data.formBuilder);
      self.panelData(true);
    });
    self.storePayload = function (data) {
      var storeData;
      if (self.sortableArray().length > 0) {
        for (i = 0; i < self.sortableArray().length; i++) {
          if (self.sortableArray()[i].sequenceNumber === data.location) {
            self.matchFound(true);
            self.sortableArray()[i] = data.formField();
            self.componentsArray()[data.index].payload = data.formField();
            break;
          }
        }
        if (!self.matchFound()) {
          if (data.formField) {
            self.sequenceNumber = self.sequenceNumber + 1;
            data.formField().sequenceNumber = self.sequenceNumber;
            storeData = data.formField();
            storeData.name = storeData.type + self.sequenceNumber;
          }
          self.componentsArray()[data.index].payload = storeData;
          self.sortableArray.push(storeData);
        }
      } else {
        if (data.formField) {
          self.sequenceNumber = self.sequenceNumber + 1;
          data.formField().sequenceNumber = self.sequenceNumber;
          storeData = data.formField();
          storeData.name = storeData.type + self.sequenceNumber;
        }
        self.componentsArray()[data.index].payload = storeData;
        self.sortableArray.push(storeData);
      }
      self.matchFound(false);
    };
    self.deleteComponent = function (data) {
      for (i = 0; i < self.componentsArray().length; i++) {
        if (self.componentsArray()[i].id === data.id) {
          self.componentsArray.splice(i, 1);
          break;
        }
      }
      self.sortableArray.remove(function (index) {
        if (data.formField) {
          return data.formField().name === index.name;
        }
      });
    };
    self.loadPreviewScreen = function () {
      self.finalPayload();
      self.nextStep();
    };
    self.loadBasicDetails = function () {
      self.finalPayload();
      self.previousStep();
    };
    self.closePopUp = function () {
      $("#filter").hide();
    };
    self.fileSelectListener = function (event) {
      self.uploadSuccessful(false);
      var files = event.detail.files[0];
      var formData = new FormData();
      formData.append("file", files);
      formData.append("moduleIdentifier", "SERVICE_REQUEST_DEFINITION");
      ServiceRequestFormBuilder.uploadDocument(formData).done(function (data) {
        self.contentId(data.contentDTOList[0].contentId.value);
        $("#filter").trigger("openModal");
        self.uploadIcon(self.resource.fileUploadSuccessful);
        self.uploadFile(true);
      }).fail();
    };
  };
});