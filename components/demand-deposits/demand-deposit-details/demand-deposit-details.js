define([
    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/demand-deposit-details",
    "ojs/ojbutton"
], function (ko, $, ViewDetailsModel, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.resource = resourceBundle;
        rootParams.dashboard.headerName(self.resource.demandDepositDetails.header);
        self.detailViewResponse = ko.observable();
        self.detailDataFetched = ko.observable(false);
        self.isChequBookAllowed = ko.observable(false);
        self.isOverDraftAllowed = ko.observable(false);
        self.productName = ko.observable();
        self.holdingPattern = ko.observable();
        self.holdingPattern(self.params.holdingPattern);
        self.accountType = ko.observable();
        self.modeOfOperation = ko.observable(false);
        var partyname = "";
        self.partyName = ko.observable();
        var branchAddress = "";
        self.branchAddress = ko.observable();
        self.branchDetails = ko.observable();
        self.hasCheckBookFacility = ko.observable();
        self.hasATMFacility = ko.observable();
        self.hasSweepOutInstruction =ko.observable(self.resource.demandDepositDetails.sweepInFlags.inactive);
        rootParams.baseModel.registerComponent("cheque-book-request", "demand-deposits");
        rootParams.baseModel.registerComponent("account-nickname", "accounts");
        rootParams.baseModel.registerComponent("statement-request", "accounts");
        rootParams.baseModel.registerComponent("account-transactions", "accounts");
        rootParams.baseModel.registerComponent("cheque-status-inquiry", "demand-deposits");
        rootParams.baseModel.registerComponent("debit-card-apply", "demand-deposits");
        rootParams.baseModel.registerComponent("cheque-stop-unblock", "demand-deposits");
        rootParams.baseModel.registerComponent("cheque-details", "demand-deposits");
        rootParams.baseModel.registerComponent("debit-card-hotlisting", "demand-deposits");
        rootParams.baseModel.registerElement("address");
        rootParams.baseModel.registerComponent("debit-card-limits", "demand-deposits");
        rootParams.baseModel.registerComponent("debit-card-pin-request", "demand-deposits");
        rootParams.baseModel.registerComponent("debit-card-activation", "demand-deposits");
        rootParams.baseModel.registerComponent("debit-card-list", "demand-deposits");
        rootParams.baseModel.registerElement("page-section");
        rootParams.baseModel.registerElement("row");
        rootParams.baseModel.registerElement("floating-panel");
        rootParams.baseModel.registerElement("account-input");
        self.selectedAccount = ko.observable(self.params.id ? self.params.id.value : null);
        self.additionalDepositDetails = ko.observable();
        self.showFloatingPanel = function () {
            $("#panelDD").trigger("openFloatingPanel");
        };
        self.fetchDetails = function (accountNumber) {
            ViewDetailsModel.getSpecificAccountDetail(accountNumber).done(function (data) {
                self.detailViewResponse(data.demandDepositAccountDTO);
                if (self.detailViewResponse.isChequeBookAllowed === true) {
                    self.isChequBookAllowed(true);
                }
                if (self.detailViewResponse.isOverDraftAllowed === true) {
                    self.isOverDraftAllowed(true);
                }
                if (self.detailViewResponse().modeOfOperation) {
                    self.modeOfOperation(true);
                }
                if (self.detailViewResponse().parties) {
                    if (self.detailViewResponse().parties.length > 0) {
                        for (var i = 0; i < self.detailViewResponse().parties.length; i++) {
                            partyname += self.detailViewResponse().parties[i].partyName;
                            if (i !== self.detailViewResponse().parties.length - 1) {
                                partyname += ", ";
                            }
                        }
                        self.partyName(partyname);
                    }
                }
                self.branchDetails(self.detailViewResponse().branchAddressDTO);
                branchAddress += self.branchDetails().branchName + ", ";
                branchAddress += self.branchDetails().branchAddress.postalAddress.line1 + ", ";
                branchAddress += self.branchDetails().branchAddress.postalAddress.line2 + ", ";
                branchAddress += self.branchDetails().branchAddress.postalAddress.country;
                self.branchAddress(branchAddress);
                self.hasCheckBookFacility(self.detailViewResponse().productDTO.demandDepositProductFacilitiesDTO.hasChequeBookFacility);
                self.hasATMFacility(self.detailViewResponse().productDTO.demandDepositProductFacilitiesDTO.hasATMFacility);
                self.productName(self.detailViewResponse().productDTO.name);

                if(self.detailViewResponse && ko.isObservable(self.detailViewResponse) && self.detailViewResponse().accountFacilities && self.detailViewResponse().accountFacilities.hasSweepOutInstruction){
                    self.hasSweepOutInstruction(self.resource.demandDepositDetails.sweepInFlags.active);
                }
                self.detailDataFetched(true);
            });
        };
        if (self.selectedAccount()) {
            self.fetchDetails(self.selectedAccount());
        }
        self.selectedAccount.subscribe(function (newValue) {
            self.detailDataFetched(false);
            self.fetchDetails(newValue);
        });
    };
});
