define([
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/record-listing",
  "ojs/ojmenu",
  "ojs/ojoption"
], function(ko, $, recordListingModel, resourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    rootParams.baseModel.registerElement("action-header");
    self.Nls = resourceBundle.recordListing;
    self.loadComponentName = ko.observable();
    self.isComponentFetched = ko.observable(false);
    self.allowAccess = ko.observable(true);
    self.showBackButton = ko.observable(true);
    if (rootParams.rootModel.params.mode)
      self.showBackButton(false);
    if (self.showBackButton()) {
      rootParams.dashboard.headerName(self.Nls.uploadedFiles);
      self.selectedFile = ko.observable(ko.utils.unwrapObservable(rootParams.rootModel.params)[0]);
      self.fileStatuses = ko.observable(ko.utils.unwrapObservable(rootParams.rootModel.params)[1]);
      self.sensitiveCheckMap = rootParams.rootModel.params[2];
      if (self.sensitiveCheckMap[self.selectedFile().fileIdentifier])
        self.allowAccess(false);
    } else {
      self.selectedFile = ko.observable(rootParams.data()[0]);
      self.fileStatuses = ko.observable(rootParams.data()[1]);
    }
    recordListingModel.getJSONData().done(function(data) {
      var transactionType = data[self.selectedFile().transaction];
      if (transactionType) {
        rootParams.baseModel.registerComponent(transactionType[0].initComponentName, transactionType[0].module);
        self.loadComponentName(transactionType[0].initComponentName);
        self.isComponentFetched(true);
      }
    });
    self.menuItems = ko.observableArray([{
        text: self.Nls.csv,
        value: "CSV"
      },
      {
        text: self.Nls.pdf,
        value: "PDF"
      }
    ]);
    self.searchParameters = ko.observable("");
    self.downloadDetails = function(event) {
      recordListingModel.downloadFileDetails(self.selectedFile().fileId, self.selectedFile().transaction, self.searchParameters(), event.target.value);
    };
    self.showModalWindow = function() {
      $("#confirm-dialog").trigger("openModal", "textarea");
    };
    self.back = function() {
      rootParams.dashboard.hideDetails();
    };
  };
});
