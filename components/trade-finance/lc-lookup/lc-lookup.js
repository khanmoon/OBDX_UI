define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/view-letter-of-credit",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingcontrol",
    "ojs/ojpagingtabledatasource",
    "ojs/ojvalidationgroup"
], function (oj, ko, $, LcLookupModel, resourceBundle) {
    "use strict";
    return function (params) {
        var self = this, getNewKoModel = function () {
                var KoModel = ko.mapping.fromJS(LcLookupModel.getNewModel());
                return KoModel;
            };
        self.model = getNewKoModel().model;
        self.beneNameArray = ko.observableArray();
        self.lookupDataSourceCreated = ko.observable(false);
        self.listExportLC = ko.observableArray();
        self.lcLookUpValidGroup = ko.observable();
        self.lcLookUpTracker = ko.observable();
        self.dataSource = ko.observableArray();
        ko.utils.extend(self, params.rootModel);
        self.lookupResourceBundle = resourceBundle;
        self.drawingStatusArray = ko.observable([
            {
                label: self.lookupResourceBundle.drawingStatusArray.Partial,
                value: "PARTIAL"
            },
            {
                label: self.lookupResourceBundle.drawingStatusArray.Full,
                value: "FULL"
            },
            {
                label: self.lookupResourceBundle.drawingStatusArray.Undrawn,
                value: "UNDRAWN"
            }
        ]);
        self.reset = function () {
            for (var key in self.model) {
                if (self.model[key]) {
                    if (key !== "lcType" && key !== "lcStatus") {
                        self.model[key]("");
                    }
                    self.model.beneName([]);
                    self.model.status([]);
                }
            }
            self.lookupDataSourceCreated(false);
        };
        self.validationTracker = ko.observable();
        LcLookupModel.fetchPartyDetails().done(function (data) {
            self.beneNameArray.push({
                label: data.party.personalDetails.fullName,
                value: data.party.id.value
            });
            LcLookupModel.fetchPartyRelations().done(function (partyData) {
                for (var i = 0; i < partyData.partyToPartyRelationship.length; i++) {
                    self.beneNameArray.push({
                        label: partyData.partyToPartyRelationship[i].relatedPartyName,
                        value: partyData.partyToPartyRelationship[i].relatedParty.value
                    });
                }
            });
        });
        self.validateFromAmount = {
            "validate": function (value) {
                if (isNaN(value) || value.length > 15 || value < 0) {
                    throw new oj.ValidatorError("", oj.Translations.getTranslatedString(self.resourceBundle.tradeFinanceErrors.common.invalidAmount));
                }
                if (self.model.toAmount()) {
                    var from = oj.Components.getWidgetConstructor($("#toAmount"));
                    if (typeof from === "function") {
                        from("validate");
                    }
                }
            }
        };
        self.validateToAmount = {
            "validate": function (value) {
                if (isNaN(value) || value.length > 15 || value < 0) {
                    throw new oj.ValidatorError("", oj.Translations.getTranslatedString(self.resourceBundle.tradeFinanceErrors.common.invalidAmount));
                }
                if (self.model.fromAmount()) {
                    if (Number(value) < Number(self.model.fromAmount())) {
                        throw new oj.ValidatorError("", oj.Translations.getTranslatedString(self.resourceBundle.tradeFinanceErrors.common.fromToAmountMsg));
                    }
                }
            }
        };
        self.getExportLCs = function () {
            var tracker = document.getElementById("lcLookUpTracker");
            if (tracker.valid === "valid") {
              self.lookupDataSourceCreated(false);
              self.listExportLC.removeAll();
              for (var key in self.model) {
                  if (self.model[key]) {
                      if (self.model[key]() === null)
                          self.model[key]("");
                  }
              }
              var payload = ko.mapping.toJS(self.model);
              LcLookupModel.getExportLCs(payload).done(function (data) {
                  data.letterOfCreditDTOs = params.baseModel.sortLib(data.letterOfCreditDTOs, ["expiryDate"], ["desc"]);
                  for (var i = 0; i < data.letterOfCreditDTOs.length; i++) {
                      self.listExportLC.push({
                          applicant: data.letterOfCreditDTOs[i].counterPartyName,
                          created_on: params.baseModel.formatDate(data.letterOfCreditDTOs[i].applicationDate),
                          amount: params.baseModel.formatCurrency(data.letterOfCreditDTOs[i].amount.amount, data.letterOfCreditDTOs[i].amount.currency),
                          outstanding_amount: params.baseModel.formatCurrency(data.letterOfCreditDTOs[i].outstandingAmount.amount, data.letterOfCreditDTOs[i].outstandingAmount.currency),
                          expiry_date: params.baseModel.formatDate(data.letterOfCreditDTOs[i].expiryDate),
                          lc_number: data.letterOfCreditDTOs[i].id
                      });
                  }
                  self.dataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.listExportLC())));
                  self.lookupDataSourceCreated(true);
              });
            }else {
                tracker.showMessages();
                tracker.focusOn("@firstInvalidShown");
            }


        };
        self.onLCSelected = function (data) {
            LcLookupModel.getExportLC(data.lc_number).done(function (data) {
                self.lcDetails(data.letterOfCredit);
                $("#lcLookupDialog").hide();
                self.reset();
            });
        };
        self.getRowId = function (rowIndex) {
            return ++rowIndex;
        };
    };
});
