define(["ojs/ojcore", "knockout", "jquery", "./model", "ojL10n!resources/nls/entity-certification", "ojs/ojradioset", "ojs/ojinputtext", "ojs/ojselectcombobox"], function(oj, ko, $, Model, resourceBundle) {
  "use strict";
  return function(Params) {
    var self = this;
    ko.utils.extend(self, Params.rootModel);
    self.nls = resourceBundle;
    self.index = Params.index;
    self.institutionType = ko.observable();
    self.financialInstitutionType = ko.observable();
    self.nonFinancialInstitutionType = ko.observable();
    self.activeNFEType = ko.observable();
    self.gIINAvailable = ko.observable("yes");
    var getNewKoModel = function() {
      var KoModel = Model.getNewModel();
      return ko.mapping.fromJS(KoModel);
    };
    self.modelInstance = ko.observable(getNewKoModel());

    self.nonFinancialChangeHandler = function(event) {
      if (event.detail && event.detail.value === "false") {
        $("#entityNote").trigger("openModal");
      }
    };

    self.activeNFEChangeHandler = function (event) {
      if (event.detail && event.detail.value) {
        self.fatcaComplianceData.entityCertification.nonFinancialInstitutionDetails.stockTradedCorporation("");
        self.fatcaComplianceData.entityCertification.nonFinancialInstitutionDetails.nameOfEstablishedSecuritiesMarket("");
        self.fatcaComplianceData.entityCertification.nonFinancialInstitutionDetails.subCategoryOfActiveNFE("");
      }
    };

    self.investmentEntityChangeHandler = function(event) {
      if (event.detail && event.detail.value === "true") {
        $("#entityNote").trigger("openModal");
      }
    };

    self.continueEntityCertification = function() {
      var entityCertificationTracker = document.getElementById("entityCertificationTracker");
      if (entityCertificationTracker && entityCertificationTracker.valid !== "valid") {
        entityCertificationTracker.showMessages();
        entityCertificationTracker.focusOn("@firstInvalidShown");
        return false;
      }
      self.stages()[self.index].expanded(false);
      self.stages()[self.index + 1].expanded(true);
    };

    self.submit = function() {
      Model.mepartyFATCApost(ko.mapping.toJSON(self.modelInstance));
    };
  };
});
