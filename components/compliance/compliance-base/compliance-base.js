define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "baseLogger",
  "ojL10n!resources/nls/compliance",
  "ojs/ojinputnumber",
  "ojs/ojinputtext",
  "ojs/ojselectcombobox"
], function(oj, ko, $, BaseLogger, ResourceBundle) {
  "use strict";
  return function(Params) {
    var self = this;
    ko.utils.extend(self, Params.rootModel);
    self.resource = ResourceBundle;
    self.dataLoaded = ko.observable();
    self.complianceComponentName = ko.observable();
    if (self.params.personalDetails.partyType === "IND" || self.params.personalDetails.partyType === "INDIVIDUAL") {
      self.formType = "INDIVIDUAL";
      Params.baseModel.registerComponent("fatca-compliance", "compliance");
      self.complianceComponentName("fatca-compliance");
    } else {
      self.formType = "ENTITY";
      Params.baseModel.registerComponent("entity-fatca-compliance", "compliance");
      self.complianceComponentName("entity-fatca-compliance");
    }
    self.dataLoaded(true);

    self.infoPopUp = function(id, open) {
      var popup = document.querySelector("#" + id);
      if (open) {
        var listener = popup.open("exchange-rate-disclaimer");
        popup.addEventListener("ojOpen", listener);
        $("#" + id).css("width", "15rem");
      } else {
        popup.close();
      }
    };
  };
});
