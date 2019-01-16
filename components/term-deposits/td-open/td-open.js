define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/td-open",
    "framework/js/constants/constants",
    "ojs/ojinputtext",
    "ojs/ojradioset",
    "ojs/ojdatetimepicker",
    "ojs/ojknockout-validation",
    "ojs/ojdialog",
    "ojs/ojlistview",
    "ojs/ojselectcombobox",
    "ojs/ojcheckboxset",
    "ojs/ojvalidationgroup",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource"
], function(oj, ko, $, OpenTdModel, locale, Constants) {
    "use strict";
    return function(rootParams) {
        var self = this;
        self.constants = Constants;
        self.maturityDate = ko.observable();
        self.minTenure = ko.observable();
        self.maxTenure = ko.observable();
        self.validationTracker = ko.observable();
        self.depositTenureCheck = ko.observable();
        self.maturityDetails = ko.observable();
        self.maturityDetailsLoaded = ko.observable(false);
        self.depositTypeList = ko.observableArray([]);
        self.depositTypeLoaded = ko.observable();
        self.openTDReview = ko.observable(false);
        self.maturityInstructionList = ko.observableArray();
        self.maturityInstructionLoaded = ko.observable(false);
        self.openTDSuccessful = ko.observable(false);
        self.additionalDetails = ko.observable();
        self.groupValid = ko.observable();
        self.currentTask = ko.observable("TD_F_OTD");
        self.createTDDetails = ko.observable();
        self.productCcyDetails = [];
        self.referenceNumber = ko.observable();
        self.showSweepinIcon = ko.observable(true);
        self.jointParties = ko.observableArray([
            "",
            ""
        ]);
        self.parties = ko.observableArray([
            "",
            ""
        ]);
        self.minAmount = ko.observable();
        self.maxAmount = ko.observable();
        self.jointAccount = ko.observable(true);
        self.depositMessage = ko.observable();
        self.httpStatus = ko.observable();
        self.partyEnums = ko.observableArray();
        self.loadedFromReview = ko.observable(false);
        self.partyDetailsLoaded = ko.observable(false);
        self.selectedParty = ko.observable();
        self.transactionStatus = ko.observable();
        self.depositAmountCheck = ko.observable(false);
        self.transactionId = ko.observable();
        self.rawPayoutInstructions = null;
        self.isNomineeRequired = ko.observable(false);
        self.manageNominee = ko.observable();
        self.component = ko.observable();
        self.accountModule = ko.observable();
        self.holdingPattern = ko.observableArray();
        ko.utils.extend(self, rootParams.rootModel);
        self.isMinor = self.previousState ? self.previousState.minor : ko.observable(false);
        self.productId = self.productId || ko.observableArray();
        self.locale = locale;
        self.isProductSelected = ko.observable(false);
        self.interestSlabsLoaded = ko.observable(false);
        self.minDate = ko.observable();
        self.maxDate = ko.observable();
        self.amount = ko.observable();
        rootParams.dashboard.headerName(self.locale.openTermDeposit.newDeposit);
        rootParams.baseModel.registerComponent("view-interest-rate", "term-deposits");
        rootParams.baseModel.registerComponent("td-payout", "term-deposits");
        rootParams.baseModel.registerElement("amount-input");
        rootParams.baseModel.registerElement("page-section");
        rootParams.baseModel.registerElement("row");
        rootParams.baseModel.registerElement("confirm-screen");
        rootParams.baseModel.registerElement("account-input");
        rootParams.baseModel.registerElement("modal-window");
        rootParams.baseModel.registerComponent("review-td-open", "term-deposits");
        var maturityListData, caseModify, islamicMaturityInstructions = [{
                    code: "A",
                    description: self.locale.openTermDeposit.islamicMaturityInstructions.a
                },
                {
                    code: "I",
                    description: self.locale.openTermDeposit.islamicMaturityInstructions.i
                },
                {
                    code: "P",
                    description: self.locale.openTermDeposit.islamicMaturityInstructions.p
                },
                {
                    code: "S",
                    description: self.locale.openTermDeposit.islamicMaturityInstructions.s
                }
            ],
            getNewKoModel = function() {
                var KoModel = OpenTdModel.getNewModel(self.transactionId(), self.versionId);
                return ko.mapping.fromJS(KoModel);
            };
        /**
         * This function is triggered when user checks or uncheck the checkbox.
         *
         * @memberOf td-open
         * @function holdingPatternChangeHandler
         * @returns {void}
         */
        self.holdingPatternChangeHandler = function() {
            self.rootModelInstance.createTDData.holdingPattern(self.holdingPattern()[0] || "JOINT");
            if (self.rootModelInstance.createTDData.holdingPattern() !== "JOINT") {
                self.jointParties = ko.observableArray([
                    "",
                    ""
                ]);
            } else {
                self.jointParties = self.parties;
            }
        };


        function calculateTenure(date) {
            var startDate = new Date(date);
            var diffDate = new Date(startDate - rootParams.baseModel.getDate());
            self.rootModelInstance.createTDData.tenure.years(diffDate.toISOString().slice(0, 4) - 1970);
            self.rootModelInstance.createTDData.tenure.months(diffDate.getMonth());
            self.rootModelInstance.createTDData.tenure.days(diffDate.getDate() - 1);
        }
        self.rootModelInstance = self.rootModelInstance || getNewKoModel();
        self.addNomineeModel = self.rootModelInstance.addNomineeModel || getNewKoModel().addNomineeModel;
        if (self.transactionId()) {
            caseModify = "INIT";
            var test = {};
            test.createTDData = ko.mapping.toJS(self);
            ko.utils.extend(self.rootModelInstance.createTDData, ko.mapping.fromJS(test.createTDData));
            if (!self.rootModelInstance.createTDData.payoutInstructions()[0]) {
                self.rootModelInstance.createTDData.payoutInstructions = getNewKoModel().createTDData.payoutInstructions;
            }
            self.depositAmountCheck(true);
            if (self.rootModelInstance.createTDData.tenure) {
                self.depositTenureCheck("TENURE");
            }
            if (self.rootModelInstance.createTDData.date) {
                self.depositTenureCheck("DATE");
            }
        } else if (!self.depositTenureCheck() && self.rootModelInstance.createTDData.maturityDate && self.rootModelInstance.createTDData.maturityDate() && !(self.rootModelInstance.createTDData.tenure.days() || self.rootModelInstance.createTDData.tenure.months() || self.rootModelInstance.createTDData.tenure.years())) {
            self.depositTenureCheck("DATE");
        } else if (!self.depositTenureCheck()) {
            self.depositTenureCheck("TENURE");
        }
        OpenTdModel.fetchPartyDetails().done(function(data) {
            self.partyDetail = {
                "partyId": "",
                "partyName": ""
            };
            self.partyDetail.partyId = "not found";
            self.partyDetail.partyName = data.party.personalDetails.fullName;
            self.partyEnums().push(self.partyDetail);
            OpenTdModel.fetchLinkedPartyDetails().done(function(result) {
                var partyList = result.partyToPartyRelationship;
                ko.utils.arrayForEach(partyList, function(item) {
                    self.relatedPartyDetail = {
                        "partyId": "",
                        "partyName": ""
                    };
                    self.relatedPartyDetail.partyId = item.relatedParty.value;
                    self.relatedPartyDetail.partyName = item.relatedPartyName;
                    self.partyEnums().push(self.relatedPartyDetail);
                });
                self.partyDetailsLoaded(true);
            });
        });
        OpenTdModel.fetchMaturityInstruction().done(function(data) {
            maturityListData = data.enumRepresentations[0].data;
            OpenTdModel.getDepositType().done(function(data) {
                self.depositTypeList(data.tdProductDTOList);
                self.depositTypeLoaded(true);
                if (data.tdProductDTOList.length > 0) {
                    self.rootModelInstance.createTDData.module(data.tdProductDTOList[0].module);
                    if (self.transactionId) {
                        for (var i = 0; i < self.depositTypeList().length; i++) {
                            if (self.depositTypeList()[i].productId === self.rootModelInstance.createTDData.productDTO.productId()) {
                                self.rootModelInstance.createTDData.productDTO.name(self.depositTypeList()[i].name);
                                self.minTenure(self.depositTypeList()[i].tenureParameter.minTenure);
                                self.maxTenure(self.depositTypeList()[i].tenureParameter.maxTenure);
                                self.rootModelInstance.createTDData.module(data.tdProductDTOList[i].module);
                                var minYear = rootParams.baseModel.getDate().getFullYear() + self.minTenure().years;
                                var minMonth = rootParams.baseModel.getDate().getMonth() + self.minTenure().months;
                                var minDate = rootParams.baseModel.getDate().getDate() + self.minTenure().days;
                                self.minDate(oj.IntlConverterUtils.dateToLocalIso(new Date(minYear, minMonth, minDate)));
                                var maxYear = rootParams.baseModel.getDate().getFullYear() + self.maxTenure().years;
                                var maxMonth = rootParams.baseModel.getDate().getMonth() + self.maxTenure().months;
                                var maxDate = rootParams.baseModel.getDate().getDate() + self.maxTenure().days;
                                self.maxDate(oj.IntlConverterUtils.dateToLocalIso(new Date(maxYear, maxMonth, maxDate)));
                            }
                            self.maturityInstructionList.removeAll();
                            ko.utils.arrayPushAll(self.maturityInstructionList, self.rootModelInstance.createTDData.module() === "ISL" ? islamicMaturityInstructions : maturityListData);
                            self.maturityInstructionLoaded(true);
                        }
                    }
                }
            });
        });

        /**
         * This function will be triggered when account for PayIn is selected by user.
         *
         * @memberOf td-open
         * @function subscriptionAdditionalDetailsAccount
         * param1 {object} additionalDetailsTransfer An object containing the details of current account
         * @returns {void}
         */
        var subscriptionAdditionalDetailsAccount = self.additionalDetails.subscribe(function() {
          if(!self.loadedFromReview()){
            self.rootModelInstance.createTDData.holdingPattern(self.additionalDetails().account.holdingPattern);
            if(self.rootModelInstance.createTDData.holdingPattern()==="SINGLE")
              self.holdingPattern.removeAll();
          }
          else{
            self.loadedFromReview(false);
          }
            self.accountModule(self.additionalDetails().account.module);
            self.jointAccount(self.additionalDetails().account.holdingPattern === "JOINT");
        });

        self.productChangeHandler = function() {
            self.depositAmountCheck(true);
            if (self.rootModelInstance.createTDData.productDTO.productId) {
                self.depositAmountCheck(false);
                self.maturityDetailsLoaded(false);
                self.depositTenureCheck("TENURE");
                self.rootModelInstance.createTDData.maturityDate(null);
                self.rootModelInstance.createTDData.tenure.days("0");
                self.rootModelInstance.createTDData.tenure.months("0");
                self.rootModelInstance.createTDData.tenure.years("0");
                for (var i = 0; i < self.depositTypeList().length; i++) {
                    if (self.depositTypeList()[i].productId === self.rootModelInstance.createTDData.productDTO.productId()) {
                        self.rootModelInstance.createTDData.productDTO.name(self.depositTypeList()[i].name);
                        self.rootModelInstance.createTDData.module(self.depositTypeList()[i].module);
                        self.minTenure(self.depositTypeList()[i].tenureParameter.minTenure);
                        self.maxTenure(self.depositTypeList()[i].tenureParameter.maxTenure);
                        self.rootModelInstance.createTDData.tenure.days(self.depositTypeList()[i].tenureParameter.minTenure.days);
                        self.rootModelInstance.createTDData.tenure.months(self.depositTypeList()[i].tenureParameter.minTenure.months);
                        self.rootModelInstance.createTDData.tenure.years(self.depositTypeList()[i].tenureParameter.minTenure.years);
                        var minYear = rootParams.baseModel.getDate().getFullYear() + self.minTenure().years;
                        var minMonth = rootParams.baseModel.getDate().getMonth() + self.minTenure().months;
                        var minDate = rootParams.baseModel.getDate().getDate() + self.minTenure().days;
                        self.minDate(oj.IntlConverterUtils.dateToLocalIso(new Date(minYear, minMonth, minDate)));
                        var maxYear = rootParams.baseModel.getDate().getFullYear() + self.maxTenure().years;
                        var maxMonth = rootParams.baseModel.getDate().getMonth() + self.maxTenure().months;
                        var maxDate = rootParams.baseModel.getDate().getDate() + self.maxTenure().days;
                        self.maxDate(oj.IntlConverterUtils.dateToLocalIso(new Date(maxYear, maxMonth, maxDate)));
                        self.minAmount(rootParams.baseModel.formatCurrency(self.depositTypeList()[i].amountParameters[0].minAmount.amount, self.depositTypeList()[i].amountParameters[0].minAmount.currency));
                        self.maxAmount(rootParams.baseModel.formatCurrency(self.depositTypeList()[i].amountParameters[0].maxAmount.amount, self.depositTypeList()[i].amountParameters[0].maxAmount.currency));
                        self.depositMessage(rootParams.baseModel.format(self.locale.openTermDeposit.depositDetails.productAmountMessage, {
                            minAmount: self.minAmount(),
                            maxAmount: self.maxAmount()
                        }));
                    }
                }
                self.rootModelInstance.createTDData.principalAmount.amount("");
            }
            self.depositAmountCheck(true);
            self.isProductSelected(true);
        };

        self.viewDepositRates = function() {
            $("#depositRates").trigger("openModal");
        };
        self.tenureChangeHandler = function(event) {
            if (caseModify !== "INIT" && event.detail.value && event.detail.previousValue) {
                if (self.depositTenureCheck() === "TENURE") {
                    self.rootModelInstance.createTDData.maturityDate(null);
                    self.rootModelInstance.createTDData.tenure.days(self.minTenure() ? self.minTenure().days : "0");
                    self.rootModelInstance.createTDData.tenure.months(self.minTenure() ? self.minTenure().months : "0");
                    self.rootModelInstance.createTDData.tenure.years(self.minTenure() ? self.minTenure().years : "0");
                } else {
                    self.rootModelInstance.createTDData.tenure.days(null);
                    self.rootModelInstance.createTDData.tenure.months(null);
                    self.rootModelInstance.createTDData.tenure.years(null);
                }
            }
        };
        self.cancelDetails = function() {
            self.rootModelInstance.createTDData.payoutInstructions = self.rawPayoutInstructions;
            caseModify = "INIT";
            rootParams.dashboard.hideDetails();
        };
        self.calculateMaturityAmount = function(isReview) {
            if (!self.validateAmount()) {
                return;
            }
            OpenTdModel.calculateMaturityAmount(ko.mapping.toJSON(self.rootModelInstance.createTDData, {
                "ignore": ["payoutInstructions"]
            })).done(function(data) {
                self.maturityDetails(data);
                $(".se-pre-con").fadeOut("slow");
                self.maturityDetailsLoaded(true);
                if (isReview === true) {
                    rootParams.dashboard.loadComponent("review-td-open", {
                        mode: "review",
                        data: self.rootModelInstance.createTDData
                    }, self);
                }
                self.rootModelInstance.createTDData.interestRate(self.maturityDetails().termDepositDetails.interestRate);
                self.rootModelInstance.createTDData.maturityAmount.amount(self.maturityDetails().termDepositDetails.maturityAmount.amount);
                self.rootModelInstance.createTDData.maturityAmount.currency(self.maturityDetails().termDepositDetails.maturityAmount.currency);
            });
        };
        self.validateAmount = function() {
            var error = true;
            if (!self.rootModelInstance.createTDData.principalAmount.amount()) {
                rootParams.baseModel.showMessages(null, [locale.openTermDeposit.validate.emptyAmount], "ERROR");
                error = false;
                return error;
            }
            if (self.depositTenureCheck() === "TENURE" && !(self.rootModelInstance.createTDData.tenure.years() || self.rootModelInstance.createTDData.tenure.months() || self.rootModelInstance.createTDData.tenure.days())) {
                rootParams.baseModel.showMessages(null, [locale.openTermDeposit.validate.emptyTenure], "ERROR");
                error = false;
            } else if (self.depositTenureCheck() === "DATE" && !self.rootModelInstance.createTDData.maturityDate()) {
                rootParams.baseModel.showMessages(null, [locale.openTermDeposit.validate.emptyDate], "ERROR");
                error = false;
            }
            return error;
        };
        self.reset = function() {
            self.rootModelInstance.createTDData.principalAmount.amount("");
            if (self.depositTenureCheck() === "TENURE") {
                self.rootModelInstance.createTDData.tenure.days("");
                self.rootModelInstance.createTDData.tenure.months("");
                self.rootModelInstance.createTDData.tenure.years("");
            } else {
                self.rootModelInstance.createTDData.maturityDate(null);
            }
            self.maturityDetailsLoaded(false);
        };

        /** This function will empty all the fields of addNomineeModel.
         *
         * @memberOf td-open
         * @function resetNomineeModel
         *  @returns {void}
         */
        function resetNomineeModel() {
            self.addNomineeModel.dateOfBirth(null);
            self.addNomineeModel.relation("");
            self.addNomineeModel.minor(false);
            self.isMinor(false);
            self.addNomineeModel.name(null);
            self.addNomineeModel.address.country("");
            self.addNomineeModel.address.state(null);
            self.addNomineeModel.address.city(null);
            self.addNomineeModel.address.zipCode(null);
            self.addNomineeModel.address.line1(null);
            self.addNomineeModel.address.line2(null);
            self.addNomineeModel.guardian = null;
        }

        self.createTDConfirm = function(simulation) {
            var rdValidationFailed = !rootParams.baseModel.showComponentValidationErrors(document.getElementById("tdTracker")),
                nomineeValidationFailed = self.isNomineeRequired();
            if (self.isNomineeRequired())
                nomineeValidationFailed = !rootParams.baseModel.showComponentValidationErrors(document.getElementById("nomineeTracker"));

            if (rdValidationFailed || nomineeValidationFailed)
                return;
            var isSimulated = simulation;
            if (isSimulated) {
                self.rootModelInstance.createTDData.payInInstruction()[0].accountId.displayValue(self.additionalDetails().account.id.displayValue);
                self.rootModelInstance.createTDData.parties = [];
                for (var i = 0; i < self.jointParties().length && self.jointParties()[i] !== ""; i++) {
                    if (self.additionalDetails().account.holdingPattern === "JOINT")
                        self.rootModelInstance.createTDData.parties.push({
                            "partyId": self.jointParties()[i].partyId.value,
                            "partyName": self.jointParties()[i].partyName,
                            "relationship": self.jointParties()[i].relationship
                        });
                }
            }
            self.rawPayoutInstructions = self.rootModelInstance.createTDData.payoutInstructions;
            var ignoreProp = [];
            switch (self.rootModelInstance.createTDData.rollOverType()) {
                case "A":
                    self.rootModelInstance.createTDData.payoutInstructions()[0].payoutComponentType("P");
                    break;
                case "P":
                    self.rootModelInstance.createTDData.payoutInstructions()[0].payoutComponentType("I");
                    break;
                case "S":
                    self.rootModelInstance.createTDData.payoutInstructions()[0].payoutComponentType("P");
                    self.rootModelInstance.createTDData.rollOverAmount.currency(ko.utils.unwrapObservable(self.rootModelInstance.createTDData.principalAmount.currency()));
                    break;
                case "I":
                    ignoreProp.push("payoutInstructions");
                    break;
                default:
                    break;
            }
            if(self.rootModelInstance.createTDData.holdingPattern() !== "JOINT"){
            if (!self.selectedParty()) {
                self.rootModelInstance.createTDData.partyId = null;
                ko.utils.arrayForEach(self.partyEnums(), function(item) {
                    if (item.partyId === "not found") {
                        self.rootModelInstance.createTDData.partyName = item.partyName;
                    }
                });
            } else if (self.selectedParty() === "not found") {
                self.rootModelInstance.createTDData.partyId = null;
                ko.utils.arrayForEach(self.partyEnums(), function(item) {
                    if (item.partyId === "not found") {
                        self.rootModelInstance.createTDData.partyName = item.partyName;
                    }
                });
            } else {
                self.rootModelInstance.createTDData.partyId = self.selectedParty();
                ko.utils.arrayForEach(self.partyEnums(), function(item) {
                    if (item.partyId === self.selectedParty()) {
                        self.rootModelInstance.createTDData.partyName = item.partyName;
                    }
                });
            }
            }
            if (self.rootModelInstance.createTDData.holdingPattern() === "JOINT") {
                resetNomineeModel();
                self.rootModelInstance.createTDData.nomineeDTO(null);
                self.isNomineeRequired(false);
            }
            self.rootModelInstance.createTDData.parties=[];
            OpenTdModel.openTd(ko.mapping.toJSON(self.rootModelInstance.createTDData, {
                "ignore": ignoreProp
            }), isSimulated).done(function(data, status, jqXhr) {
                if (isSimulated) {
                    if (self.rootModelInstance.createTDData.maturityDate()) {
                        calculateTenure(self.rootModelInstance.createTDData.maturityDate());
                    }
                    self.rootModelInstance.createTDData.interestRate(data.termDepositDetails.interestRate);
                    if (self.rootModelInstance.createTDData.module() !== "ISL") {
                        if (!self.rootModelInstance.createTDData.tenure) {
                            self.rootModelInstance.createTDData.maturityDate(data.termDepositDetails.maturityDate);
                        }
                        self.maturityDate(data.termDepositDetails.maturityDate);
                        self.rootModelInstance.createTDData.maturityAmount.amount(data.termDepositDetails.maturityAmount.amount);
                        self.rootModelInstance.createTDData.maturityAmount.currency(data.termDepositDetails.maturityAmount.currency);
                    }
                    self.parties([]);
                    if (self.rootModelInstance.createTDData.holdingPattern() === "JOINT" && data.termDepositDetails.parties) {
                        var jointParties = data.termDepositDetails.parties;
                        for (var i = 0; i < jointParties.length; i++) {
                            if (i===0){
                              self.rootModelInstance.createTDData.partyName=jointParties[i].partyName;
                            }
                            else{
                              self.parties.push({
                                  "partyName": jointParties[i].partyName,
                                  "partyId": jointParties[i].partyId,
                                  "relationship": jointParties[i].relationship
                              });
                            }
                        }
                    }
                    self.loadedFromReview(true);
                    rootParams.dashboard.loadComponent("review-td-open", {
                        mode: "review",
                        data: self.rootModelInstance.createTDData,
                        addNomineeModel: self.addNomineeModel,
                        minor: self.isMinor,
                        manageNominee: self.manageNominee,
                        holdingPattern: self.holdingPattern,
                        loadedFromReview :self.loadedFromReview,
                        parties: self.parties,
                        isNomineeRequired: self.isNomineeRequired,
                        accountModule: self.accountModule
                    }, self);
                } else {
                    self.rootModelInstance.createTDData.maturityDate(self.maturityDate());
                    self.httpStatus = jqXhr.status;
                    var createSuccessMessage;
                    if (self.httpStatus && self.httpStatus === 200 && self.isNomineeRequired()) {
                        createSuccessMessage = self.locale.openTermDeposit.nomineeSuccessMessage;
                    } else if (self.httpStatus && self.httpStatus === 200 && !self.isNomineeRequired()) {
                        createSuccessMessage = self.locale.openTermDeposit.nomineeFailureMessage;
                    }
                    for (var j = 0; j < self.maturityInstructionList().length; j++) {
                        if (self.maturityInstructionList()[j].code === self.rootModelInstance.createTDData.rollOverType())
                            var maturityInstruction = self.maturityInstructionList()[j].description;
                    }
                    if (self.rootModelInstance.addNomineeModel.guardian) {
                        var guardianName = self.rootModelInstance.addNomineeModel.guardian.name();
                    }
                    if(data.termDepositDetails.id){
                      var depositNumber = data.termDepositDetails.id.displayValue;
                    }
                    if(self.rootModelInstance.createTDData.rollOverType() !== "I"){
                    var transferTo = [self.rootModelInstance.createTDData.payoutInstructions()[0].accountId.displayValue, self.rootModelInstance.createTDData.payoutInstructions()[0].account(), self.rootModelInstance.createTDData.payoutInstructions()[0].beneficiaryName, self.rootModelInstance.createTDData.payoutInstructions()[0].bankName, self.rootModelInstance.createTDData.payoutInstructions()[0].address.line1, self.rootModelInstance.createTDData.payoutInstructions()[0].address.line2, self.rootModelInstance.createTDData.payoutInstructions()[0].address.city, self.rootModelInstance.createTDData.payoutInstructions()[0].address.country];
                    }
                    var confirmScreenDetailsArray = [
                        [{
                                label: self.locale.openTermDeposit.depositDetails.depositNumber,
                                value: depositNumber
                            },
                            {
                                label: self.locale.openTermDeposit.depositDetails.depositTenure,
                                value: self.formatDepositTenure(self.rootModelInstance.createTDData.tenure)
                            },
                            {
                                label: self.locale.openTermDeposit.depositDetails.depositAmount,
                                value: rootParams.baseModel.formatCurrency(self.rootModelInstance.createTDData.principalAmount.amount(), self.rootModelInstance.createTDData.principalAmount.currency())
                            },
                            {
                                label: self.locale.openTermDeposit.depositDetails.maturityDate,
                                value: rootParams.baseModel.formatDate(self.rootModelInstance.createTDData.maturityDate)
                            },
                            {
                                label: self.locale.openTermDeposit.holdingPattern.holdingPattern,
                                value: self.locale.openTermDeposit.holdingPatternType[self.rootModelInstance.createTDData.holdingPattern()]
                            }
                        ],
                        [{
                                label: self.locale.openTermDeposit.nominationDetails.nomineeName,
                                value: self.rootModelInstance.addNomineeModel.name
                            },
                            {
                                label: self.locale.openTermDeposit.nominationDetails.guardianName,
                                value: guardianName
                            },
                            {
                                label: self.locale.openTermDeposit.payoutInstructions.maturityInstruction,
                                value: maturityInstruction
                            },
                            {
                                label: self.locale.openTermDeposit.depositDetails.maturityAmount,
                                value: rootParams.baseModel.formatCurrency(self.rootModelInstance.createTDData.maturityAmount.amount(), self.rootModelInstance.createTDData.maturityAmount.currency())
                            },
                            {
                                label: self.locale.openTermDeposit.payoutInstructions.payTo,
                                value: self.locale.openTermDeposit.payoutInstructions.payoutTypes[self.rootModelInstance.createTDData.payoutInstructions()[0].type()]
                            },
                            {
                                label: self.locale.openTermDeposit.payoutInstructions.transferTo,
                                value: transferTo
                            }
                        ]
                    ];
                    rootParams.dashboard.loadComponent("confirm-screen", {
                        jqXHR: jqXhr,
                        transactionName: self.locale.openTermDeposit.newDeposit,
                        //hostReferenceNumber: data.termDepositDetails.id ? data.termDepositDetails.id.displayValue : null,
                        confirmScreenExtensions: {
                            successMessage: createSuccessMessage,
                            isSet: true,
                            taskCode: self.currentTask(),
                            template: "confirm-screen/td-template",
                            confirmScreenDetails: confirmScreenDetailsArray
                        }
                    }, self);

                }
            });
        };
        self.displayMaturityPeriod = function(tenureParameter) {
            var maturityPeriod = self.formatTenure(tenureParameter.minTenure) + "-" + self.formatTenure(tenureParameter.maxTenure);
            return maturityPeriod;
        };
        self.formatTenure = function(tenure) {
            var formattedTenure = null;
            if (tenure && tenure.years && tenure.years !== 0) {
                formattedTenure = rootParams.baseModel.format(tenure.years > 1 ? self.locale.openTermDeposit.tenure.Years : self.locale.openTermDeposit.tenure.year, {
                    year: tenure.years
                });
            }
            if (tenure && tenure.months && tenure.months !== 0) {
                formattedTenure = (formattedTenure ? formattedTenure + "," : "") + rootParams.baseModel.format(tenure.months > 1 ? self.locale.openTermDeposit.tenure.Months : self.locale.openTermDeposit.tenure.month, {
                    month: tenure.months
                });
            }
            if (tenure && tenure.days && tenure.days !== 0) {
                formattedTenure = (formattedTenure ? formattedTenure + "," : "") + rootParams.baseModel.format(tenure.days > 1 ? self.locale.openTermDeposit.tenure.Days : self.locale.openTermDeposit.tenure.day, {
                    day: tenure.days
                });
            }
            if (tenure && tenure.days && tenure.days === 0 && !formattedTenure) {
                formattedTenure = rootParams.baseModel.format(self.locale.openTermDeposit.tenure.day, {
                    day: tenure.days
                });
            }
            return formattedTenure;
        };
        self.formatDepositTenure = function(tenure) {
            var formattedTenure = null;
            if (tenure && tenure.years && tenure.years !== 0) {
                formattedTenure = rootParams.baseModel.format(tenure.years() > 1 ? self.locale.openTermDeposit.tenure.Years : self.locale.openTermDeposit.tenure.year, {
                    year: tenure.years()
                });
            }
            if (tenure && tenure.months && tenure.months !== 0) {
                formattedTenure = formattedTenure + rootParams.baseModel.format(tenure.months() > 1 ? self.locale.openTermDeposit.tenure.Months : self.locale.openTermDeposit.tenure.month, {
                    month: tenure.months()
                });
            }
            if (tenure && tenure.days && tenure.days !== 0) {
                formattedTenure = formattedTenure + rootParams.baseModel.format(tenure.days() > 1 ? self.locale.openTermDeposit.tenure.Days : self.locale.openTermDeposit.tenure.day, {
                    day: tenure.days()
                });
            }
            return formattedTenure;
        };
        self.currencyParser = function(data) {
            self.productCcyDetails = [];
            var output = {};
            output.currencies = [];
            if (self.rootModelInstance.createTDData.productDTO.productId()) {
                if (data.tdProductDTOList.length > 0) {
                    if (data.tdProductDTOList[0].amountParameters) {
                        for (var i = 0; i < data.tdProductDTOList[0].amountParameters.length; i++) {
                            output.currencies.push({
                                code: data.tdProductDTOList[0].amountParameters[i].currency,
                                description: data.tdProductDTOList[0].amountParameters[i].currency
                            });
                            self.productCcyDetails.push({
                                ccy: data.tdProductDTOList[0].amountParameters[i].currency,
                                minAmount: data.tdProductDTOList[0].amountParameters[i].minAmount.amount,
                                maxAmount: data.tdProductDTOList[0].amountParameters[i].maxAmount.amount
                            });
                        }
                    }
                }
            }
            return output;
        };
        var subscription = self.rootModelInstance.createTDData.principalAmount.currency.subscribe(function(newValue) {
            for (var i = 0; i < self.productCcyDetails.length; i++) {
                if (self.productCcyDetails[i].ccy === newValue) {
                    self.minAmount(rootParams.baseModel.formatCurrency(self.productCcyDetails[i].minAmount, newValue));
                    self.maxAmount(rootParams.baseModel.formatCurrency(self.productCcyDetails[i].maxAmount, newValue));
                    self.depositMessage(rootParams.baseModel.format(self.locale.openTermDeposit.depositDetails.productAmountMessage, {
                        minAmount: self.minAmount(),
                        maxAmount: self.maxAmount()
                    }));
                    self.amount(rootParams.baseModel.format(self.locale.openTermDeposit.interestslab.amount, {
                        currency: newValue
                    }));
                    break;
                }
            }
        });
        self.dispose = function() {
            subscription.dispose();
            subscriptionAdditionalDetailsAccount.dispose();
        };

        rootParams.baseModel.registerComponent("add-edit-nominee", "nominee");
        self.nomineeDetails = [{
            id: "no",
            label: self.locale.generic.common.no
        }, {
            id: "yes",
            label: self.locale.generic.common.yes
        }];
        self.manageNominee(self.manageNominee() ? self.manageNominee() : self.nomineeDetails[0].id);
        if (self.manageNominee() === self.nomineeDetails[1].id) {
            self.component("add-edit-nominee");
            self.isNomineeRequired(true);
        }
        self.nomineeDetailsChanged = function(event) {
            if (event.detail.value === self.manageNominee() && event.detail.value !== event.detail.previousValue) {
                if (self.manageNominee() === self.nomineeDetails[1].id) {
                    self.component("add-edit-nominee");
                    self.isNomineeRequired(true);
                    self.rootModelInstance.createTDData.nomineeDTO(self.addNomineeModel);
                    resetNomineeModel();
                } else if (self.manageNominee() === self.nomineeDetails[0].id) {
                    self.isNomineeRequired(false);
                    self.rootModelInstance.createTDData.nomineeDTO(null);
                }
            }
        };
    };
});
