define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource",
    "ojs/ojselectcombobox",
    "ojs/ojpagingtabledatasource",
    "ojs/ojvalidationgroup",
    "ojs/ojinputtext"
], function (oj, ko, $, GuaranteeDetailsModel) {
    "use strict";
    var vm = function (params) {
        var self = this;
        var productLabel,branchLabel;
        ko.utils.extend(self, params.rootModel);
        self.branchId = ko.observable();
        self.partyId = ko.observable();
        self.productId = ko.observable();
        self.transferableTypeValue = ko.observable();
        self.disbaledCreditAvailableBy = ko.observable(true);
        self.guaranteeType = ko.observable();
        self.benecountry = ko.observable();
        self.currency = ko.observable(null);
        self.stageIndex = params.index;
        if (!self.existingBene) {
            if (self.mode() === "EDIT" && self.guaranteeDetails.beneId() === null) {
                self.existingBene = ko.observable("false");
            } else {
                self.existingBene = ko.observable("true");
            }
        }
        self.guaranteeTypeSubscribe = self.guaranteeType.subscribe(function (newValue) {
            if (self.guaranteeTypeOptions()) {
                if (newValue.length > 0 && newValue) {
                    var type = newValue;
                    self.guaranteeDetails.guaranteetype(type);
                    var guaranteeLabel = self.guaranteeTypeOptions().filter(function (data) {
                        return data.value === type;
                    });
                    if (guaranteeLabel && guaranteeLabel.length > 0) {
                        self.dropdownLabels.guaranteeType(guaranteeLabel[0].label);
                    }
                }
            }
        });
        function fetchAdditionalDetails() {
            if (self.guaranteeDetails.advisingBankCode() && self.guaranteeDetails.advisingBankCode() !== "") {
                GuaranteeDetailsModel.getBankDetailsBIC(self.guaranteeDetails.advisingBankCode()).done(function (data) {
                    self.additionalBankDetails(data);
                    self.guaranteeDetails.advisingBankCode(data.code);
                }).fail(function () {
                    self.guaranteeDetails.advisingBankCode(null);
                });
            }
        }
        function fetchBeneUserDetails(guaranteeBeneId) {
            GuaranteeDetailsModel.fetchBeneficiaryDetails(guaranteeBeneId).done(function (data) {
                self.guaranteeDetails.beneName(data.beneficiaryDetails.name);
                self.guaranteeDetails.beneAddress.line1(data.beneficiaryDetails.address.line1);
                self.guaranteeDetails.beneAddress.line2(data.beneficiaryDetails.address.line2);
                self.guaranteeDetails.beneAddress.line3(data.beneficiaryDetails.address.line3);
                self.benecountry(data.beneficiaryDetails.address.country);
                self.beneVisibility(data.beneficiaryDetails.visibility);
                if (data.beneficiaryDetails.swiftId) {
                    self.guaranteeDetails.advisingBankCode(data.beneficiaryDetails.swiftId);
                    fetchAdditionalDetails();
                } else {
                    self.guaranteeDetails.advisingBankCode(null);
                    fetchAdditionalDetails(null);
                }
            });
        }
        function fetchApplicantDetails(partyId) {
            GuaranteeDetailsModel.fetchPartyDetails(partyId).done(function (data) {
                self.applicantName(data.party.personalDetails.fullName);
                for (var i = 0; i < data.party.addresses.length; i++) {
                    if (data.party.addresses[i].type === "PST") {
                        self.applicantAddress.line1(data.party.addresses[i].postalAddress.line1);
                        self.applicantAddress.line2(data.party.addresses[i].postalAddress.line2);
                        self.applicantAddress.line3(data.party.addresses[i].postalAddress.line3);
                        self.applicantAddress.country(data.party.addresses[i].postalAddress.country);
                    }
                }
            });
        }
        if (self.partyIDoptions().length === 1) {
            self.partyId(self.partyIDoptions()[0].value);
            self.guaranteeDetails.partyId.value(self.partyIDoptions()[0].value);
            self.guaranteeDetails.partyId.displayValue(self.partyIDoptions()[0].label);
            fetchApplicantDetails(self.partyIDoptions()[0].value);
        }
        self.continueFunc = function () {
            var bgTracker = document.getElementById("bgTracker");
            if (bgTracker.valid === "valid") {
              self.stages[self.stageIndex()].expanded(false);
              self.stages[self.stageIndex()].validated(true);
              self.stages[self.stageIndex() + 1].expanded(true);
            }else {
                self.stages[self.stageIndex()].validated(false);
                bgTracker.showMessages();
                bgTracker.focusOn("@firstInvalidShown");
            }
        };
        self.beneIdSubscribe = self.guaranteeDetails.beneId.subscribe(function (newValue) {
            if (newValue !== null) {
                fetchBeneUserDetails(newValue);
            }
        });
        self.beneCountrySubscribe = self.benecountry.subscribe(function (newValue) {
            if (self.beneCountryoptions()) {
                if (newValue) {
                    var country = newValue;
                    self.guaranteeDetails.beneAddress.country(country);
                    var countryLabel = self.beneCountryoptions().filter(function (data) {
                        return data.value === country;
                    });
                    if (countryLabel && countryLabel.length > 0) {
                        self.dropdownLabels.country(countryLabel[0].label);
                    }
                }
            }
        });
        self.partyIdSubscribe = self.partyId.subscribe(function (newValue) {
            if (self.partyIDoptions()) {
                var partyId = newValue;
                var partyLabel = self.partyIDoptions().filter(function (data) {
                    return data.value === partyId;
                });
                if (partyLabel && partyLabel.length > 0) {
                    self.guaranteeDetails.partyId.displayValue(partyLabel[0].label);
                }
                if (partyId !== self.guaranteeDetails.partyId.value()) {
                    self.guaranteeDetails.partyId.value(partyId);
                    fetchApplicantDetails(partyId);
                }
            }
        });
        self.verifyCode = function () {
            var trackerSwift;
            trackerSwift = document.getElementById("advisingBankCode");
            if(trackerSwift.valid === "valid"){
              if (!self.bicCodeError()) {
                  GuaranteeDetailsModel.getBankDetailsBIC(self.guaranteeDetails.advisingBankCode()).done(function (data) {
                      self.additionalBankDetails(data);
                  }).fail(function () {
                      self.guaranteeDetails.advisingBankCode("");
                  });
              }
            }else {
                trackerSwift.showMessages();
                trackerSwift.focusOn("@firstInvalidShown");
            }
        };
        self.resetCode = function () {
            self.additionalBankDetails(null);
            self.guaranteeDetails.advisingBankCode("");
        };
        function setContractArray(selectedProductContract) {
            for (var i = 0; i < selectedProductContract.length; i++) {
                var contractSelected = "false";
                var description = selectedProductContract[i].description;
                for (var j = 0; j < self.guaranteeDetails.bankGuaranteeContract().length; j++) {
                    if (self.guaranteeDetails.bankGuaranteeContract()[j].contractId() === selectedProductContract[i].contractId) {
                        contractSelected = "true";
                        if (self.guaranteeDetails.bankGuaranteeContract()[j].description)
                            description = self.guaranteeDetails.bankGuaranteeContract()[j].description();
                        break;
                    }
                }
                self.contractsList.push({
                    contractSelected: ko.observable([contractSelected]),
                    condition: selectedProductContract[i].contractId,
                    description: ko.observable(description)
                });
            }
            self.contractsDataLoaded(true);
        }
        function fetchProductDetails(productId, state) {
            GuaranteeDetailsModel.fetchProductDetails(productId).done(function (productData) {
                self.claimDays(productData.bankGuaranteeProductDTO.claimDays);
                var productDetails = productData.bankGuaranteeProductDTO;
                if (productDetails) {
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
                    self.contractsDataLoaded(false);
                    self.contractsList.removeAll();
                    if (state === "onProductChange") {
                        for (var i = 0; i < productDetails.guaranteeContract.length; i++) {
                            self.contractsList.push({
                                contractSelected:ko.observable(["false"]),
                                condition: productDetails.guaranteeContract[i].contractId,
                                description: productDetails.guaranteeContract[i].description
                            });
                        }
                        self.contractsDataLoaded(true);
                    } else {
                        setContractArray(productDetails.guaranteeContract);
                    }
                }
            });
        }
        self.productChangeHandler = function (event) {
            if (event.detail.value) {
                var product = event.detail.value;
                self.guaranteeDetails.productId(product);
                productLabel = self.productTypeOptions().filter(function (data) {
                    return data.value === product;
                });
                if (productLabel && productLabel.length > 0) {
                    self.dropdownLabels.product(productLabel[0].label);
                }
                fetchProductDetails(product, "onProductChange");
            }
        };
        function fetchBranchDate(branchCode) {
            GuaranteeDetailsModel.fetchBranchDate(branchCode).done(function (res) {
                if (res.branchDate) {
                    self.guaranteeDetails.issueDate(res.branchDate);
                    var date = new Date(res.branchDate);
                    self.minEffectiveDate(oj.IntlConverterUtils.dateToLocalIso(new Date(date.setHours(0, 0, 0, 0))));
                    date.setDate(date.getDate() + 1);
                    self.minExpiryDate(oj.IntlConverterUtils.dateToLocalIso(new Date(date.setHours(0, 0, 0, 0))));
                }
            });
        }
        self.branchChangeHandler = function (event) {
            if (event.detail.value) {
                var branchId = event.detail.value;
                self.guaranteeDetails.branchId(branchId);
                branchLabel = self.branchIDoptions().filter(function (data) {
                    return data.value === branchId;
                });
                if (branchLabel && branchLabel.length > 0) {
                    self.dropdownLabels.branch(branchLabel[0].label);
                }
                fetchBranchDate(branchId);
            }
        };
        self.existingBeneSubscribe = self.existingBene.subscribe(function () {
            self.guaranteeDetails.beneId(null);
            self.guaranteeDetails.beneName(null);
            self.guaranteeDetails.beneAddress.line1(null);
            self.guaranteeDetails.beneAddress.line2(null);
            self.guaranteeDetails.beneAddress.line3(null);
            self.benecountry([]);
            self.guaranteeDetails.advisingBankCode(null);
            self.additionalBankDetails(null);
        });
        if (self.mode() === "EDIT") {
            fetchAdditionalDetails();
            self.productId(self.guaranteeDetails.productId());
            if (self.productId() !== null) {
                fetchProductDetails(self.productId());
                productLabel = self.productTypeOptions().filter(function (data) {
                    return data.value === self.productId();
                });
                if (productLabel && productLabel.length > 0) {
                    self.dropdownLabels.product(productLabel[0].label);
                }
            }
            if (self.guaranteeDetails.partyId.value() !== null) {
                self.partyId(self.guaranteeDetails.partyId.value());
                fetchApplicantDetails(self.partyId());
            }
            if (self.beneVisibility() === undefined && self.guaranteeDetails.beneId() !== null) {
                fetchBeneUserDetails(self.guaranteeDetails.beneId());
            }
            self.branchId(self.guaranteeDetails.branchId());
            if (self.guaranteeDetails.branchId() !== null) {
                fetchBranchDate(self.guaranteeDetails.branchId());
                branchLabel = self.branchIDoptions().filter(function (data) {
                    return data.value === self.guaranteeDetails.branchId();
                });
                if (branchLabel && branchLabel.length > 0) {
                    self.dropdownLabels.branch(branchLabel[0].label);
                }
            }
            self.guaranteeDetails.advisingBankCode(self.params.guaranteeDetails.advisingBankCode);
            if(self.guaranteeDetails.advisingBankCode()){
              fetchAdditionalDetails();
            }
            self.guaranteeType(self.guaranteeDetails.guaranteetype());
            self.benecountry(self.guaranteeDetails.beneAddress.country());
            self.currency(self.guaranteeDetails.contractAmount.currency());
        }
    };
    vm.prototype.dispose = function () {
        this.guaranteeTypeSubscribe.dispose();
        this.beneIdSubscribe.dispose();
        this.beneCountrySubscribe.dispose();
        this.partyIdSubscribe.dispose();
        this.existingBeneSubscribe.dispose();
    };
    return vm;
});
