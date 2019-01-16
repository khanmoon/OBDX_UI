define(["ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/fatca-compliance-declaration-status-report",
  "ojs/ojinputtext",
  "ojs/ojradioset",
  "ojs/ojlabel",
  "ojs/ojselectcombobox"
], function(oj, ko, $, fatcaComplianceDeclerationStatusModel, resourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    self.resource = resourceBundle;
    self.currentSelection = ko.observable();
    self.showPartyDetails = ko.observable();
    self.showStatusDetails = ko.observable();
    self.selectedPartyId = ko.observable();
    self.statusTypes = ko.observableArray([]);
    self.fromDate = ko.observable();
    self.loadStatus = ko.observable(false);
    fatcaComplianceDeclerationStatusModel.fetchEnumeration().done(function(data) {
      if (data && data.enumRepresentations[0].data.length > 0) {
        for (var i = 0; i < data.enumRepresentations[0].data.length; i++) {
          self.statusTypes.push({
            value: data.enumRepresentations[0].data[i].code,
            label: data.enumRepresentations[0].data[i].description
          });
        }
        self.loadStatus(true);
      }
    });
    self.generateByValueChanged = function(event) {
      if (event.detail.value === "partyIdSelected") {
        self.showPartyDetails(true);
        self.showStatusDetails(false);
      } else {
        self.showStatusDetails(true);
        self.showPartyDetails(false);
      }
    };
  };
});
