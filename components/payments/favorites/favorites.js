define([
    "knockout",
    "jquery",
    "ojs/ojcore",
    "./model",
    "ojL10n!resources/nls/favorites",
    "framework/js/constants/constants",
    "ojs/ojradioset",
    "ojs/ojtable",
    "ojs/ojselectcombobox",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingcontrol",
    "ojs/ojlistview",
    "ojs/ojmenu",
    "ojs/ojoption",
    "ojs/ojknockout-validation"
], function(ko, $, oj, FavoritesModel, resourceBundle, Constants) {
    "use strict";

    return function(rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.currentNavArrowPlacement = ko.observable("adjacent");
        self.currentNavArrowVisibility = ko.observable("auto");
        self.dataFetched = ko.observable(false);
        self.nls = resourceBundle;
        rootParams.dashboard.headerName(self.nls.payments.favoritesDetails.labels.title);
        self.response = ko.observableArray([]);
        self.responseDraft = ko.observableArray([]);
        self.responseBill = ko.observableArray([]);
        self.responseAccount = ko.observableArray([]);
        rootParams.baseModel.registerElement(["modal-window","nav-bar","search-box","card"]);
        rootParams.baseModel.registerComponent("bill-payments", "payments");
        rootParams.baseModel.registerComponent("payments-money-transfer", "payments");
        rootParams.baseModel.registerComponent("issue-demand-draft", "payments");

        self.menuSelection = ko.observable("accounts");
        self.menuLoaded = ko.observable(false);

        self.isBillPayment = ko.observable(false);
        self.isDraft = ko.observable(false);

        self.favoritesAccountsDataSource = ko.observable(new oj.PagingTableDataSource(new oj.ArrayTableDataSource([])));
        self.favoritesDraftDataSource = ko.observable(new oj.PagingTableDataSource(new oj.ArrayTableDataSource([])));
        self.favoritesBillPaymentDataSource = ko.observable(new oj.PagingTableDataSource(new oj.ArrayTableDataSource([])));
        self.favoritesDataSource = ko.observable();

        self.type = ko.observable();

        /* Newly added variables */
        self.paymentTypeArray = ko.observableArray();
        self.showActivitySuccessMsg = ko.observable(false);
        self.extendedObjectDraft =ko.observableArray([]);
        self.extendedObjectAccount =ko.observableArray([]);
        self.extendedObjectBill =ko.observableArray([]);
        self.enhanceresponse =ko.observableArray([]);
        self.enhanceresponseDraft =ko.observableArray([]);
        self.enhanceresponseBill =ko.observableArray([]);
        self.enhanceresponseAccount =ko.observableArray([]);

        FavoritesModel.init();

        self.getItemInitialDisplay = function(index) {
            return index < 3 ? "" : "none";
        };

        var categories;

        if (Constants.userSegment === "CORP") {
            categories = [
                "accounts",
                "dd",
                "bill"
            ];
        } else if (Constants.userSegment === "RETAIL") {
            categories = [
                "accounts",
                "bill"
            ];
        }

        self.type(categories[0]);

        for (var j = 0; j < categories.length; j++) {
            self.paymentTypeArray.push({
                label: self.nls.payments.favoritesDetails.labels[categories[j]],
                id: categories[j]
            });
        }

        self.menuLoaded(true);
        self.uiOptions = {
            "menuFloat": "left",
            "fullWidth": false,
            "defaultOption": self.menuSelection
        };
        self.showModule = function(module) {
            self.menuSelection(module.value);
        };

        /**
         * This function loads favorites for different payee types such as payee and biller
         * @param  {String} newValue   The string containing type of favorite
         * @return {void}
         */
        function loadFavorites(newValue) {

            self.dataFetched(false);
            if (newValue === "accounts") {
                self.isBillPayment(false);
                self.isDraft(false);
                self.favoritesDataSource(self.favoritesAccountsDataSource());

            } else if (newValue === "bill") {
                self.isBillPayment(true);
                self.isDraft(false);
                self.favoritesDataSource(self.favoritesBillPaymentDataSource());

            } else {
                self.isBillPayment(false);
                self.isDraft(true);
                self.favoritesDataSource(self.favoritesDraftDataSource());

            }
            ko.tasks.runEarly();
            self.dataFetched(true);

        }

        self.paymentTypeChanged = function(event) {
                loadFavorites(event.target.value);
        };

        self.menuSelection.subscribe(loadFavorites);
        self.accFavoriteDetails = function(data) {
            if ((data.accountName && Constants.userSegment === "CORP") || (rootParams.baseModel.small())) {
                if (data.transactionType === "BILLPAYMENT") {
                    rootParams.dashboard.loadComponent("bill-payments", data,self);
                } else if (data.transactionType.indexOf("DRAFT") > -1) {
                    rootParams.dashboard.loadComponent("issue-demand-draft", data,self);
                } else {
                    rootParams.dashboard.loadComponent("payments-money-transfer", {
                        transferObject: ko.observable(data)
                    },self);
                }
            } else if (data.accountName && Constants.userSegment !== "CORP") {
                data.autopopulate = true;
                if (data.transactionType === "BILLPAYMENT") {
                    rootParams.changeView("bill-payments", data);
                } else if (data.transactionType.indexOf("DRAFT") > -1) {
                    rootParams.changeView("issue-demand-draft", data);
                } else {
                    rootParams.changeView("payments-money-transfer", {
                        transferObject: ko.observable(data)
                    });
                }
            }
        };

        self.retailClickHandler = function(data) {
            if (data.payeeType === "bill") {
                rootParams.dashboard.loadComponent("bill-payments", data, self);
            } else {
                delete self.transferObject;
                rootParams.dashboard.loadComponent("payments-money-transfer", {
                    transferObject: ko.observable(data)
                }, self);
            }
        };

        self.getFavoritesDetails = function() {
            FavoritesModel.getFavoritesDetails().done(function(data) {
                self.dataFetched(false);
                self.response.removeAll();
                self.responseDraft.removeAll();
                self.responseBill.removeAll();
                self.responseAccount.removeAll();
                self.extendedObjectDraft.removeAll();
                self.extendedObjectAccount.removeAll();
                self.extendedObjectBill.removeAll();
                self.enhanceresponseDraft.removeAll();
                self.enhanceresponseBill.removeAll();
                self.enhanceresponseAccount.removeAll();
                if (data.favorites && data.favorites.length > 0) {
                    var paymentType, payeeType, favoriteDetails, draft = false,
                        billpayment = false;
                    for (var i = 0; i < data.favorites.length; i++) {
                        payeeType = "";
                        paymentType = "";
                        favoriteDetails = data.favorites[i];
                        switch (favoriteDetails.transctionType) {
                            case "INTERNALFT":
                                paymentType = self.nls.payments.msgtype.INTERNALFT;
                                payeeType = "internal";
                                break;
                            case "INTERNATIONALFT":
                                paymentType = self.nls.payments.msgtype.INTERNATIONALFT;
                                payeeType = "international";
                                break;
                            case "INTERNALFT_PAYLATER":
                                paymentType = self.nls.payments.msgtype.INTERNALFT_PAYLATER;
                                payeeType = "internal";
                                break;
                            case "SELFFT":
                                paymentType = self.nls.payments.msgtype.SELFFT;
                                break;
                            case "SELFFT_PAYLATER":
                                paymentType = self.nls.payments.msgtype.SELFFT_PAYLATER;
                                break;
                            case "SEPADIRECTDEBIT_PAYLATER":
                                paymentType = self.nls.payments.msgtype.SEPADIRECTDEBIT_PAYLATER;
                                break;
                            case "BILLPAYMENT":
                                paymentType = self.nls.payments.msgtype.BILLPAYMENT;
                                billpayment = true;
                                payeeType = "bill";
                                break;
                            case "DOMESTICFT":
                                paymentType = self.nls.payments.msgtype.DOMESTICFT;
                                payeeType = "domestic";
                                break;
                            case "DOMESTICDRAFT":
                                paymentType = self.nls.payments.msgtype.DOMESTICDRAFT;
                                payeeType = "domesticDraft";
                                draft = true;
                                break;
                            case "INTERNATIONALDRAFT":
                                paymentType = self.nls.payments.msgtype.INTERNATIONALDRAFT;
                                payeeType = "internationalDraft";
                                draft = true;
                                break;
                            case "DOMESTICDRAFT_PAYLATER":
                                paymentType = self.nls.payments.msgtype.DOMESTICDRAFT_PAYLATER;
                                payeeType = "domesticDraft";
                                draft = true;
                                break;
                            case "INTERNATIONALDRAFT_PAYLATER":
                                paymentType = self.nls.payments.msgtype.INTERNATIONALDRAFT_PAYLATER;
                                payeeType = "internationalDraft";
                                draft = true;
                                break;
                            case "INTERNATIONALFT_PAYLATER":
                                paymentType = self.nls.payments.msgtype.INTERNATIONALFT_PAYLATER;
                                payeeType = "international";
                                break;
                            case "DOMESTICFT_PAYLATER":
                                paymentType = self.nls.payments.msgtype.DOMESTICFT_PAYLATER;
                                payeeType = "domestic";
                                break;
                            default:
                                paymentType = "";
                                payeeType = "";
                                break;

                        }
                        self.response.push({
                            relationshipNumber: favoriteDetails.relationshipNumber,
                            amount: favoriteDetails.amount.amount,
                            currency: favoriteDetails.amount.currency,
                            payeeId: favoriteDetails.payeeId,
                            debitAccountId: favoriteDetails.debitAccountId.value,
                            displayValue: favoriteDetails.debitAccountId.displayValue,
                            creditAccountId: favoriteDetails.creditAccountId ? (favoriteDetails.creditAccountId.value || null) : null,
                            creditAccountDisplayValue : favoriteDetails.creditAccountId ? (favoriteDetails.creditAccountId.displayValue || null) : null,
                            paymentId: favoriteDetails.id,
                            transactionType: favoriteDetails.transctionType,
                            paymentType: paymentType,
                            purpose: favoriteDetails.purpose,
                            charges: favoriteDetails.charges,
                            otherPurposeText: favoriteDetails.otherPurposeText,
                            payeeType: payeeType,
                            remarks: favoriteDetails.remarks,
                            formattedAmount: rootParams.baseModel.formatCurrency(favoriteDetails.amount.amount, favoriteDetails.amount.currency),
                            paymentDetails: favoriteDetails.internationalPaymentDetails,
                            isFavoriteTransaction: true,
                            groupId: favoriteDetails.payeeGroupId,
                            valueDate: favoriteDetails.valueDate
                        });

                        if (draft) {
                            self.enhanceresponseDraft.push({
                                nickName: favoriteDetails.payeeNickName,
                                accountName: favoriteDetails.payeeAccountName
                            });
                             self.responseDraft.push(self.response()[i]);
                            $.extend(true, self.extendedObjectDraft(), self.responseDraft(), self.enhanceresponseDraft());
                            draft = false;


                        } else if (billpayment) {
                            self.enhanceresponseBill.push({
                                nickName: favoriteDetails.relationshipNumber,
                                accountName: favoriteDetails.payeeAccountName,
                                category: favoriteDetails.billerCategory
                            });
                            self.responseBill.push(self.response()[i]);
                             $.extend(true, self.extendedObjectBill(), self.responseBill(), self.enhanceresponseBill());
                             billpayment = false;

                        } else {
                            self.enhanceresponseAccount.push({
                                nickName: favoriteDetails.payeeNickName || favoriteDetails.payeeAccountName || self.nls.payments.favoritesDetails.labels.self,
                                accountName: favoriteDetails.payeeAccountName || self.nls.payments.favoritesDetails.labels.self
                            });
                            self.responseAccount.push(self.response()[i]);
                             $.extend(true, self.extendedObjectAccount(), self.responseAccount(), self.enhanceresponseAccount());
                        }
                    }

                    self.favoritesAccountsDataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.extendedObjectAccount(), {
                        idAttribute: ["paymentId", (Constants.userSegment === "CORP" ? "accountName" : "nickName")]
                    })));
                    self.favoritesBillPaymentDataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.extendedObjectBill(), {
                        idAttribute: ["paymentId", "accountName"]
                    })));
                    self.favoritesDraftDataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.extendedObjectDraft(), {
                        idAttribute: ["paymentId", "accountName"]
                    })));

                    if (self.isDraft())
                        self.favoritesDataSource(self.favoritesDraftDataSource());
                    else if (self.isBillPayment())
                        self.favoritesDataSource(self.favoritesBillPaymentDataSource());
                    else
                        self.favoritesDataSource(self.favoritesAccountsDataSource());

                    self.dataFetched(true);

                } else {
                    self.dataFetched(true);
                    self.favoritesDataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource([])));
                }
            });

        };

        self.getFavoritesDetails();

        self.confirmDeleteFavorite = function() {
            FavoritesModel.deleteFavourite(self.favoriteData().paymentId, self.favoriteData().transactionType).done(function() {
                self.closeModal();
                self.showActivitySuccessMsg(true);
                setTimeout(function() {
                    self.showActivitySuccessMsg(false);
                }, 4000);
                self.getFavoritesDetails();
            });
        };

        self.menuItems = [{
            id: "paynow",
            label: self.nls.payments.favoritesDetails.labels.paynow
        }, {
            id: "remove",
            label: self.nls.payments.favoritesDetails.labels.remove
        }];

        self.openMenu = function(data,event) {
            document.getElementById("menuLauncher-favorites-contents-" + data.paymentId).open(event);
        };

        self.closeModal = function() {
            $("#delete-favorite").trigger("closeModal");
        };

        self.favoriteData = ko.observable();
        self.menuItemSelect = function(data, event) {
            self.favoriteData(data);
            if (event.target.value === "paynow") {
                self.accFavoriteDetails(data);
            } else if (event.target.value === "remove") {
                $("#delete-favorite").trigger("openModal");
            }
        };
    };
});
