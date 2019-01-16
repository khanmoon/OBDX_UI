define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "./model",
    "ojs/ojtable",
    "ojs/ojselectcombobox",
    "ojs/ojarraytabledatasource",
    "ojs/ojinputtext",
    "ojs/ojradioset",
    "ojs/ojknockout-validation",
    "ojs/ojdatetimepicker",
    "ojs/ojcheckboxset"
], function (oj, ko, $, LCDetailsModel) {
    "use strict";
    var self, vm = function (params) {
        var i, j;
        self = this;
        ko.utils.extend(self, params.rootModel);
        self.stageIndex = params.index;
        var draftRowId = 1;
        self.validationTracker = ko.observable();
        self.countryDatasource = ko.observable();
        self.dataSourceCreated = ko.observable(false);
        self.autoReinstatement = ko.observableArray();
        self.disbaledCreditAvailableBy = ko.observable(true);
        self.disbaledTenor = ko.observable(false);
        self.transferableTypeValue = ko.observable("");
        self.branchId = ko.observable("");
        self.tolerance = ko.observable("");
        self.benecountry = ko.observable("");
        self.chargesAccountValue = ko.observable("");
        self.currency = ko.observable(null);
        self.frequencyUnit = ko.observable([""]);
        self.exposureCurrency = ko.observable([""]);

        self.revolvingFlag = ko.observable(false);
        self.productId = ko.observable("");
        self.partyId = ko.observable("");
        if (!self.existingBene) {
            if (self.mode() === "EDIT" && self.letterOfCreditDetails.beneId() === null) {
                self.existingBene = ko.observable("false");
            } else {
                self.existingBene = ko.observable("true");
            }
        }
        function setClauseArray(docId, documentClauses, selectedClauses) {
            var clause = [];
            for (var k = 0; k < documentClauses.length; k++) {
                var clauseSelected = "false";
                var clauseDesc = documentClauses[k].description;
                if (selectedClauses) {
                    for (var l = 0; l < selectedClauses.length; l++) {
                        if (selectedClauses[l].id() === documentClauses[k].id) {
                            clauseSelected = "true";
                            clauseDesc = selectedClauses[l].description();
                            break;
                        }
                    }
                }
                clause.push({
                    selected: ko.observable([clauseSelected]),
                    rowId: docId + "_" + documentClauses[k].id,
                    id: documentClauses[k].id,
                    description: ko.observable(clauseDesc),
                    name: documentClauses[k].name
                });
            }
            return clause;
        }
        function setDocumentArray(selectedProductDocument) {
            var clause = [];
            for (i = 0; i < selectedProductDocument.length; i++) {
                var docSelected = "false";
                var originals = "0";
                var originalsOutOff = "0";
                var copies = 0;
                var clauseSelectedFlag = false;
                clause = [];
                for (j = 0; j < self.letterOfCreditDetails.document().length; j++) {
                    if (self.letterOfCreditDetails.document()[j].id() === selectedProductDocument[i].id) {
                        docSelected = "true";
                        originals = self.letterOfCreditDetails.document()[j].originals();
                        if (originals.indexOf("/") !== -1) {
                            originalsOutOff = originals.split("/")[1];
                            originals = originals.split("/")[0];
                        }
                        copies = self.letterOfCreditDetails.document()[j].copies();
                        if (self.letterOfCreditDetails.document()[j].clause && self.letterOfCreditDetails.document()[j].clause().length > 0) {
                            clauseSelectedFlag = true;
                            clause = setClauseArray(selectedProductDocument[i].id, selectedProductDocument[i].clause, self.letterOfCreditDetails.document()[j].clause());
                        }
                    }
                }
                if (!clauseSelectedFlag) {
                    clause = setClauseArray(selectedProductDocument[i].id, selectedProductDocument[i].clause, []);
                }
                self.docArray.push({
                    docSelected: ko.observable([docSelected]),
                    id: selectedProductDocument[i].id,
                    clause: clause,
                    copies: ko.observable(copies),
                    name: selectedProductDocument[i].name,
                    originals: ko.observable(originals),
                    originalsOutOff: ko.observable(originalsOutOff),
                    docType: selectedProductDocument[i].docType
                });
                if (clauseSelectedFlag && clause.length > 0) {
                    self.clauseTableArray.push({
                        allClauseSelected: ko.observable(["false"]),
                        docId: selectedProductDocument[i].id,
                        docName: selectedProductDocument[i].name + " Clauses",
                        datasourceForClause: new oj.PagingTableDataSource(new oj.ArrayTableDataSource(clause, { idAttribute: "rowId" }))
                    });
                }
            }
            self.showDocuments(true);
        }
        function fetchProductDetails(productId, state) {
            LCDetailsModel.fetchProductDetails(productId).done(function (productData) {
                var productDetails = productData.letterOfCreditProductDTO;
                if (productDetails) {
                    if (productDetails.periodIndicator === "USANCE") {
                        self.transferableTypeValue("ACCEPTANCE");
                        self.disbaledCreditAvailableBy(true);
                    } else if (productDetails.periodIndicator === "SIGHT" || productDetails.periodIndicator === "BUYER_USANCE") {
                        self.transferableTypeValue("NEGOTIATION");
                        self.disbaledCreditAvailableBy(true);
                    } else {
                        self.disbaledCreditAvailableBy(false);
                    }
                    if (productDetails.periodIndicator === "SIGHT") {
                        self.disbaledTenor(true);
                        for (i = 0; i < self.draftArray().length; i++) {
                            self.draftArray()[i].tenor("0");
                        }
                    } else {
                        self.disbaledTenor(false);
                    }
                    if (productDetails.revolving === true) {
                        self.letterOfCreditDetails.revolving("true");
                        self.revolvingFlag(true);
                    } else {
                        self.letterOfCreditDetails.revolving("false");
                        self.revolvingFlag(true);
                    }
                    var currency = [];
                    self.currencyListOptions.removeAll();
                    if(productDetails.currencies){
                     currency = productDetails.currencies.map(function (currencyData) {
                         return {
                             value: currencyData.code,
                             label: currencyData.code
                         };
                     });
                    }
                    ko.utils.arrayPushAll(self.currencyListOptions, currency);
                    self.letterOfCreditDetails.toleranceUnder(productDetails.negativeTolerance);
                    self.letterOfCreditDetails.toleranceAbove(productDetails.positiveTolerance);
                    self.letterOfCreditDetails.paymentType(productDetails.periodIndicator);
                    self.showDocuments(false);
                    self.docArray.removeAll();
                    self.clauseTableArray.removeAll();
                    if (state === "onProductChange") {
                        for (i = 0; i < productDetails.documents.length; i++) {
                            var clause = [];
                            for (j = 0; j < productDetails.documents[i].clause.length; j++) {
                                clause.push({
                                    selected: ko.observable([false]),
                                    rowId: productDetails.documents[i].id + "_" + productDetails.documents[i].clause[j].id,
                                    id: productDetails.documents[i].clause[j].id,
                                    description: ko.observable(productDetails.documents[i].clause[j].description),
                                    name: productDetails.documents[i].clause[j].name
                                });
                            }
                            self.docArray.push({
                                docSelected: ko.observable(["false"]),
                                id: productDetails.documents[i].id,
                                clause: clause,
                                copies: ko.observable(0),
                                name: productDetails.documents[i].name,
                                originals: ko.observable(0),
                                originalsOutOff: ko.observable(0),
                                docType: productDetails.documents[i].docType
                            });
                        }
                        self.showDocuments(true);
                    } else {
                        setDocumentArray(productDetails.documents);
                    }
                }
            });
            var label = self.productTypeOptions().filter(function (data) {
                return data.value === productId;
            });
            if (label && label.length > 0) {
                self.dropdownLabels.product(label[0].label);
            }
        }
        self.datasourceForDraft = new oj.ArrayTableDataSource(self.draftArray, { idAttribute: "id" });
        params.baseModel.registerElement("amount-input");
        self.transferableTypevalueOptions = ko.observableArray([
            {
                value: "ACCEPTANCE",
                label: self.resourceBundle.lcDetails.transferableType.ACCEPTANCE
            },
            {
                value: "DEFFEREDPAYMENT",
                label: self.resourceBundle.lcDetails.transferableType.DEFFEREDPAYMENT
            },
            {
                value: "MIXEDPAYMENT",
                label: self.resourceBundle.lcDetails.transferableType.MIXEDPAYMENT
            },
            {
                value: "NEGOTIATION",
                label: self.resourceBundle.lcDetails.transferableType.NEGOTIATION
            },
            {
                value: "PAYMENT",
                label: self.resourceBundle.lcDetails.transferableType.PAYMENT
            }
        ]);
        self.repeatFrequencyType = [
            {
                value: "DAYS",
                label: self.resourceBundle.lcDetails.labels.DAYS
            },
            {
                value: "MONTHS",
                label: self.resourceBundle.lcDetails.labels.MONTHS
            }
        ];
        self.draftSubscribe = self.letterOfCreditDetails.draftsRequired.subscribe(function () {
            self.draftArray.removeAll();
            self.draftArray.push({
                id: 1,
                draftAmount: ko.observable(""),
                draftName: ko.observable(""),
                draweeBank: ko.observable(""),
                specifyOthers: ko.observable(""),
                tenor: ko.observable("0")
            });
        });
        self.repeatFrequencyTypeHandler = function (event) {
            if (event.detail.value) {
                self.letterOfCreditDetails.revolvingDetails.frequencyUnit(event.detail.value);
            }
        };
        self.productChangeHandler = function (event) {
            var productLabel;
            if (event.detail.value) {
                var product = event.detail.value;
                productLabel = self.productTypeOptions().filter(function (data) {
                    return data.value === product;
                });
                if (productLabel && productLabel.length > 0) {
                    self.dropdownLabels.product(productLabel[0].label);
                }
                fetchProductDetails(product, "onProductChange");
            }
        };
        function fetchAdditionalDetails() {
            if (self.letterOfCreditDetails.availableWith() !== null && self.letterOfCreditDetails.availableWith() !== "") {
                LCDetailsModel.getBankDetailsBIC(self.letterOfCreditDetails.availableWith()).done(function (data) {
                    self.availableWithDetails(data);
                    self.letterOfCreditDetails.availableWith(self.availableWithDetails().code);
                    if (self.letterOfCreditDetails.swiftId() !== null && self.letterOfCreditDetails.swiftId() !== "" && self.additionalBankDetails() === null) {
                        LCDetailsModel.getBankDetailsBIC(self.letterOfCreditDetails.swiftId()).done(function (data) {
                            self.additionalBankDetails(data);
                            self.letterOfCreditDetails.swiftId(self.additionalBankDetails().code);
                        }).fail(function () {
                            self.letterOfCreditDetails.swiftId(null);
                        });
                    }
                }).fail(function () {
                    self.letterOfCreditDetails.availableWith(null);
                });
            } else if (self.letterOfCreditDetails.swiftId() !== null && self.letterOfCreditDetails.swiftId() !== "") {
                LCDetailsModel.getBankDetailsBIC(self.letterOfCreditDetails.swiftId()).done(function (data) {
                    self.additionalBankDetails(data);
                    self.letterOfCreditDetails.swiftId(self.additionalBankDetails().code);
                }).fail(function () {
                    self.letterOfCreditDetails.swiftId(null);
                });
            }
        }
        function fetchBeneUserDetails(beneficiaryId) {
            LCDetailsModel.fetchBeneficiaryDetails(beneficiaryId).done(function (data) {
                self.letterOfCreditDetails.counterPartyName(data.beneficiaryDetails.name);
                self.letterOfCreditDetails.counterPartyAddress.line1(data.beneficiaryDetails.address.line1);
                self.letterOfCreditDetails.counterPartyAddress.line2(data.beneficiaryDetails.address.line2);
                self.letterOfCreditDetails.counterPartyAddress.line3(data.beneficiaryDetails.address.line3);
                self.letterOfCreditDetails.counterPartyAddress.country(data.beneficiaryDetails.address.country);
                self.benecountry(data.beneficiaryDetails.address.country);
                var countryLabel = self.beneCountryoptions().filter(function (data) {
                    return data.value === self.benecountry();
                });
                self.beneVisibility(data.beneficiaryDetails.visibility);
                if (countryLabel && countryLabel.length > 0) {
                    self.dropdownLabels.country(countryLabel[0].label);
                }
                if (data.beneficiaryDetails.swiftId) {
                    self.letterOfCreditDetails.swiftId(data.beneficiaryDetails.swiftId);
                    fetchAdditionalDetails();
                } else {
                    self.letterOfCreditDetails.swiftId(null);
                    fetchAdditionalDetails(null);
                }
            });
        }
        self.beneSubscribe = self.letterOfCreditDetails.beneId.subscribe(function (newValue) {
            if (newValue !== null) {
                fetchBeneUserDetails(newValue);
            }
        });
        function fetchBranchDate(branchCode) {
            LCDetailsModel.fetchBranchDate(branchCode).done(function (res) {
                if (res.branchDate) {
                    var date = new Date(res.branchDate);
                    self.letterOfCreditDetails.applicationDate(res.branchDate);
                    date.setDate(date.getDate() + 1);
                    self.minEffectiveDate(oj.IntlConverterUtils.dateToLocalIso(new Date(date.setHours(0, 0, 0, 0))));
                }
            });
        }
        self.branchChangeHandler = function (event) {
            var branchLabel;
            if (event.detail.value) {
                var branchId = event.detail.value;
                self.letterOfCreditDetails.branchId(branchId);
                branchLabel = self.branchIDoptions().filter(function (data) {
                    return data.value === branchId;
                });
                if (branchLabel && branchLabel.length > 0) {
                    self.dropdownLabels.branch(branchLabel[0].label);
                }
                fetchBranchDate(branchId);
            }
        };
        self.countryChangeHandler = function (event) {
            var countryLabel;
            if (event.detail.value) {
                var country = event.detail.value;
                self.letterOfCreditDetails.counterPartyAddress.country(event.detail.value);
                countryLabel = self.beneCountryoptions().filter(function (data) {
                    return data.value === country;
                });
                if (countryLabel && countryLabel.length > 0) {
                    self.dropdownLabels.country(countryLabel[0].label);
                }
            }
        };
        function fetchApplicantDetails(partyId) {
            LCDetailsModel.fetchPartyDetails(partyId).done(function (data) {
                self.applicantName(data.party.personalDetails.fullName);
                for (i = 0; i < data.party.addresses.length; i++) {
                    if (data.party.addresses[i].type === "PST") {
                        self.applicantAddress.line1(data.party.addresses[i].postalAddress.line1);
                        self.applicantAddress.line2(data.party.addresses[i].postalAddress.line2);
                        self.applicantAddress.line3(data.party.addresses[i].postalAddress.line3);
                        self.applicantAddress.country(data.party.addresses[i].postalAddress.country);
                    }
                }
            });
        }
        self.onPartyIdSelected = function (event) {
            if (event.detail.value) {
                var partyId = event.detail.value;
                var party = self.partyIDoptions().filter(function (data) {
                    return data.value === partyId;
                });
                if (party && party.length > 0) {
                    self.letterOfCreditDetails.partyId.displayValue(party[0].label);
                }
                if (event.detail.value !== self.letterOfCreditDetails.partyId.value()) {
                    fetchApplicantDetails(event.detail.value);
                    self.letterOfCreditDetails.partyId.value(partyId);
                }
            }
        };
        self.addDraft = function () {
            self.draftArray.push({
                id: ++draftRowId,
                draftName: ko.observable(""),
                tenor: ko.observable("0"),
                draftAmount: ko.observable(""),
                draweeBank: ko.observable(""),
                specifyOthers: ko.observable("")
            });
        };
        self.continueFunc = function () {
          var tracker = document.getElementById("lcTracker");
          if (tracker.valid === "valid") {
            self.stages[self.stageIndex()].expanded(false);
            self.stages[self.stageIndex()].validated(true);
            self.stages[self.stageIndex() + 1].expanded(true);
          }else {
              self.stages[self.stageIndex()].validated(false);
              tracker.showMessages();
              tracker.focusOn("@firstInvalidShown");
          }
        };
        self.remove = function (data) {
                self.draftArray.splice(data, 1);
                --draftRowId;
        };
        self.validateAmount = {
            validate: function (value) {
                if (value) {
                    var numberfractional = value.toString().split(".");
                    if (numberfractional[0] && (numberfractional[0].length > 2 || numberfractional[1]) && numberfractional[1].length > 2) {
                        throw new oj.ValidatorError("", self.resourceBundle.tradeFinanceErrors.lcDetails.toleranceError);
                    }
                }
                return true;
            }
        };
        self.validateLCAmount = {
            validate: function (value) {
                if (value) {
                    if (value <= 0) {
                        throw new oj.ValidatorError("", self.resourceBundle.tradeFinanceErrors.lcDetails.invalidAmountErrorMessage);
                    }
                    var numberfractional1 = value.toString().split(".");
                    if (numberfractional1[0] && (numberfractional1[0].length > 13 || !/^[0-9]+$/.test(numberfractional1[0]))) {
                        throw new oj.ValidatorError("", self.resourceBundle.tradeFinanceErrors.lcDetails.lcAmountError);
                    }
                    if (numberfractional1[1]) {
                        if (numberfractional1[1].length > 2 || !/^[0-9]+$/.test(numberfractional1[1])) {
                            throw new oj.ValidatorError("", self.resourceBundle.tradeFinanceErrors.lcDetails.lcAmountError);
                        }
                    }
                }
                return true;
            }
        };
        self.verifyAvailableCode = function () {
            var trackerSwift;
            trackerSwift = document.getElementById("creditAvailableWith");
            if(trackerSwift.valid === "valid"){
              if (!self.bicCodeError()) {
                  LCDetailsModel.getBankDetailsBIC(self.letterOfCreditDetails.availableWith()).done(function (data) {
                      self.availableWithDetails(data);
                  }).fail(function () {
                      self.letterOfCreditDetails.availableWith("");
                  });
              }
            }else {
                trackerSwift.showMessages();
                trackerSwift.focusOn("@firstInvalidShown");
            }
        };
        self.resetAvailableWith = function () {
            self.availableWithDetails(null);
            self.letterOfCreditDetails.availableWith("");
        };
        self.existingBeneSubscribe = self.existingBene.subscribe(function () {
            self.letterOfCreditDetails.beneId(null);
            self.letterOfCreditDetails.counterPartyName(null);
            self.letterOfCreditDetails.counterPartyAddress.line1(null);
            self.letterOfCreditDetails.counterPartyAddress.line2(null);
            self.letterOfCreditDetails.counterPartyAddress.line3(null);
            self.letterOfCreditDetails.swiftId(null);
            self.additionalBankDetails(null);
            self.benecountry([]);
        });
        if (self.partyIDoptions().length === 1) {
            self.partyId([self.partyIDoptions()[0].value]);
            self.letterOfCreditDetails.partyId.value(self.partyIDoptions()[0].value);
            self.letterOfCreditDetails.partyId.displayValue(self.partyIDoptions()[0].label);
            fetchApplicantDetails(self.partyIDoptions()[0].value);
        }
        if (self.mode() === "EDIT") {
            self.productId(self.letterOfCreditDetails.productId());
            if (self.productId() !== null) {
                fetchProductDetails(self.productId());
            }
            if(self.letterOfCreditDetails.availableWith() === null){
              self.letterOfCreditDetails.availableWith(self.params.letterOfCreditDetails.availableWith);
            }
            if(self.letterOfCreditDetails.swiftId() === null){
              self.letterOfCreditDetails.swiftId(self.params.letterOfCreditDetails.swiftId);
            }
            self.partyId(self.letterOfCreditDetails.partyId.value());
            fetchApplicantDetails(self.partyId());
            fetchAdditionalDetails(self.letterOfCreditDetails.availableWith);
            if (self.letterOfCreditDetails.availableWith) {
                self.availableWithDetails();
            }
            if (self.beneVisibility() === undefined && self.letterOfCreditDetails.beneId() !== null) {
                fetchBeneUserDetails(self.letterOfCreditDetails.beneId());
            }
            self.transferableTypeValue(self.letterOfCreditDetails.transferableType());
            self.branchId(self.letterOfCreditDetails.branchId());
            if (self.letterOfCreditDetails.branchId() !== null) {
                fetchBranchDate(self.letterOfCreditDetails.branchId());
                var labelBranch = self.branchIDoptions().filter(function (data) {
                    return data.value === self.letterOfCreditDetails.branchId();
                });
                if (labelBranch && labelBranch.length > 0) {
                    self.dropdownLabels.branch(labelBranch[0].label);
                }
            }
            self.dropdownLabels.country(self.letterOfCreditDetails.counterPartyAddress.country());
            self.benecountry(self.letterOfCreditDetails.counterPartyAddress.country());
            self.currency(self.letterOfCreditDetails.amount.currency());
            self.exposureCurrency(self.letterOfCreditDetails.amount.currency());
            self.frequencyUnit(self.letterOfCreditDetails.revolvingDetails.frequencyUnit());
            if (self.letterOfCreditDetails.billingDrafts !== null && self.letterOfCreditDetails.billingDrafts().length > 0) {
                self.draftArray.removeAll();
                for (i = 0; i < self.letterOfCreditDetails.billingDrafts().length; i++) {
                    self.draftArray.push({
                        id: i + 1,
                        draftAmount: ko.observable(self.letterOfCreditDetails.billingDrafts()[i].amount.amount()),
                        draweeBank: ko.observable(self.letterOfCreditDetails.billingDrafts()[i].draweeBankId()),
                        specifyOthers: ko.observable(self.letterOfCreditDetails.billingDrafts()[i].otherInformation()),
                        tenor: ko.observable(self.letterOfCreditDetails.billingDrafts()[i].tenor())
                    });
                }
            }
        }
        self.letterOfCreditDetails.productId = ko.computed(function () {
            return self.productId();
        });
        self.letterOfCreditDetails.amount.currency = ko.computed(function () {
            return self.currency();
        });
        self.letterOfCreditDetails.exposure.currency = ko.computed(function () {
            return self.currency();
        });
        self.letterOfCreditDetails.exposure.amount = ko.computed(function () {
            if (self.letterOfCreditDetails.amount.amount() === null) {
                return 0;
            }
            return (parseFloat(self.letterOfCreditDetails.amount.amount() * 0.01 * self.letterOfCreditDetails.toleranceAbove()) + parseFloat(self.letterOfCreditDetails.amount.amount())).toFixed(2);
        });
        self.letterOfCreditDetails.transferableType = ko.computed(function () {
            return self.transferableTypeValue();
        });
    };
    vm.prototype.dispose = function () {
        this.existingBeneSubscribe.dispose();
        this.draftSubscribe.dispose();
        this.beneSubscribe.dispose();
        self.letterOfCreditDetails.productId.dispose();
        self.letterOfCreditDetails.amount.currency.dispose();
        self.letterOfCreditDetails.exposure.currency.dispose();
        self.letterOfCreditDetails.exposure.amount.dispose();
        self.letterOfCreditDetails.transferableType.dispose();
    };
    return vm;
});
