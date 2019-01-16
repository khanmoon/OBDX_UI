define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/payee-list",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource",
    "ojs/ojtabs",
    "ojs/ojselectcombobox",
    "ojs/ojnavigationlist",
    "ojs/ojpagingcontrol"
], function(oj, ko, $, BeneficiaryDetailsModel, resourceBundle) {
    "use strict";

    return function(rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.payments = resourceBundle;
        self.beneficiaryName = ko.observable();
        self.accType = ko.observable();
        self.accDetails = ko.observable();
        self.createdBy = ko.observable();
        self.availableFor = ko.observable();
        self.payeeList = ko.observableArray();
        self.ddList = ko.observableArray();
        self.subPayees = ko.observableArray();
        self.isSubPayeeLoaded = ko.observable(false);
        self.payeeGroupImage = ko.observable();
        self.countries = ko.observableArray();
        self.payeeName = ko.observableArray();
        self.type = ko.observable();
        rootParams.dashboard.headerName(self.payments.beneficiaryDetails.labels.title);
        self.accountListDetailsDataSource = ko.observable();
        rootParams.baseModel.registerElement(["action-header", "search-box", "nav-bar", "modal-window"]);
        self.dataSourceCreated = ko.observable(false);
        self.menuLoaded = ko.observable(false);
        self.highlightedTab = ko.observable("accounts");
        self.accountsTable = ko.observable(true);
        self.demandDraftTable = ko.observable(false);
        self.choiseBoxOpened = ko.observable(false);
        var categories = [
            "accounts",
            "dd"
        ];
        self.type(categories[0]);
        self.menuSelection = ko.observable("accounts");

        self.menuCountOptions = ko.observableArray();
        for (var j = 0; j < categories.length; j++) {
            self.menuCountOptions.push({
                id: categories[j],
                label: self.payments.payee[categories[j]]
            });
        }

        self.radioPayeeHandler = function(event, ui) {
            if (ui.option === "value" && ui.value !== ui.previousValue) {
                self.menuSelection(self.type());
            }
        };

        self.menuLoaded(true);
        self.uiOptions = {
            "menuFloat": "left",
            "fullWidth": false,
            "defaultOption": self.menuSelection
        };
        self.showModule = function(module) {
            self.menuSelection(module.value);
        };

        self.fetchPayees = function() {
            self.dataSourceCreated(false);
            self.subPayees().length = 0;

            BeneficiaryDetailsModel.getCountries().done(function(data) {
                self.countries.removeAll();
                for (var i = 0; i < data.enumRepresentations[0].data.length; i++) {
                    self.countries.push({
                        text: data.enumRepresentations[0].data[i].description,
                        value: data.enumRepresentations[0].data[i].code
                    });
                }
            });

            BeneficiaryDetailsModel.fetchAccountDetails(self.type()).done(function(data) {
                if (data.payeeGroups) {
                    for (var i = 0; i < data.payeeGroups.length; i++) {
                        var payee = data.payeeGroups[i].listPayees[0],
                            bankName = "",
                            demandDraftPayeeType = null,
                            payAtCountry = null,
                            deliveryMode = null,
                            addressType = null,
                            branchCode = null,
                            payeeDetails = payee.domesticPayeeType ? payee[{
                                INDIA: "indiaDomesticPayee",
                                UK: "ukDomesticPayee",
                                SEPA: "sepaDomesticPayee"
                            }[payee.domesticPayeeType]] : payee;

                        if (payee.payeeType === "INTERNAL") {
                            bankName = self.payments.payee.internalaccount;
                        } else {
                            branchCode = payeeDetails.bankDetails ? payeeDetails.bankDetails.code : null;
                            bankName = payeeDetails.bankDetails ? payeeDetails.bankDetails.name : null;
                        }

                        if (payeeDetails.demandDraftPayeeType) {
                            demandDraftPayeeType = payeeDetails.demandDraftPayeeType;
                            if (payeeDetails.payAtCountry) {
                                for (var k = 0; k < self.countries().length; k++) {
                                    if (self.countries()[k].value === payeeDetails.payAtCountry) {
                                        payAtCountry = self.countries()[k].text;
                                        break;
                                    }
                                }
                            }
                            deliveryMode = payeeDetails.demandDraftDeliveryDTO.deliveryMode;
                            addressType = payeeDetails.demandDraftDeliveryDTO.addressType;
                            branchCode = payeeDetails.demandDraftDeliveryDTO.branch;
                        }

                        var image = demandDraftPayeeType !== null ? "payments/recipients-demand-drafts.svg" : (payeeDetails.transferMode || payeeDetails.transferValue) !== null ? "payments/recipients-mobile-email.svg" : "payments/recipients-accounts.svg";
                        self.subPayees.push({
                            name: data.payeeGroups[i].name,
                            nickName: payee.nickName,
                            accountNumber: payeeDetails.accountNumber,
                            bankName: bankName,
                            payeeAccessType: (self.payments.payee[payeeDetails.payeeAccessType]).toUpperCase(),
                            address: payeeDetails.bankDetails ? payeeDetails.bankDetails.address : null,
                            bankCity: payeeDetails.bankDetails ? payeeDetails.bankDetails.city ? payeeDetails.bankDetails.city : null : null,
                            bankCountry: payeeDetails.bankDetails ? payeeDetails.bankDetails.country ? payeeDetails.bankDetails.country : null : null,
                            network: payeeDetails.network ? payeeDetails.network : null,
                            payeeType: payee.payeeType,
                            type: payee.payeeType === "DEMANDDRAFT" ? self.payments.payee[payee.payeeType + payee.demandDraftPayeeType] : self.payments.payee[payee.payeeType],
                            accountName: payeeDetails.accountName,
                            demandDraftPayeeType: payeeDetails.demandDraftPayeeType,
                            id: payee.id,
                            groupId: data.payeeGroups[i].groupId,
                            transferMode: payeeDetails.transferMode,
                            transferTo: payeeDetails.transferValue,
                            image: image,
                            payAtCity: payeeDetails.payAtCity,
                            payAtCountry: payAtCountry,
                            deliveryMode: deliveryMode,
                            addressType: addressType,
                            branchCode: branchCode,
                            branch: payeeDetails.bankDetails ? payeeDetails.bankDetails.branch : null,
                            totalPayeeCount: "1",
                            createdBy: payeeDetails.userDetails ? rootParams.baseModel.format(self.payments.payee.creatorName, {
                                firstName: payeeDetails.userDetails.firstName,
                                lastName: payeeDetails.userDetails.lastName
                            }) : "",
                            username: payee.createdBy
                        });
                    }
                }
                self.accountListDetailsDataSource = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.subPayees(), {
                    idAttribute: ["name"]
                }));

                self.dataSourceCreated(true);
            });
        };
        self.menuSelection.subscribe(function(newValue) {
            if (newValue === "accounts") {
                self.accountsTable(true);
                self.demandDraftTable(false);
            } else {
                self.accountsTable(false);
                self.demandDraftTable(true);
            }
            self.type(newValue);
            self.fetchPayees();
        });
        self.fetchPayees();
        rootParams.baseModel.registerComponent("payee-details", "payee");
        rootParams.baseModel.registerComponent("account-type-dialog", "payee");

        self.openChoiseBox = function() {
            $("#choiseDialog").trigger("openModal");
            self.choiseBoxOpened(true);
        };

        self.accountTypeModalCloseHandler = function() {
            self.choiseBoxOpened(false);
        };

        self.closeModal = function() {
            if (self.choiseBoxOpened()) {
                self.choiseBoxOpened(false);
                $("#choiseDialog").trigger("closeModal");
            }
        };

    };
});
