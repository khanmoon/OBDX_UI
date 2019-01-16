define([
    "knockout",
    "jquery",
    "ojs/ojcore",
    "baseModel",
    "./model",
    "ojL10n!resources/nls/create-goal",
    "framework/js/constants/constants",
    "ojs/ojbutton",
    "ojs/ojdatetimepicker",
    "ojs/ojinputtext",
    "ojs/ojvalidationgroup",
    "ojs/ojselectcombobox",
    "ojs/ojknockout-validation",
    "ojs/ojcheckboxset"
], function(ko, $, oj, BaseModel, goalAccountViewModel, ResourceBundle, Constants) {
    "use strict";

    return function(rootParams) {
        var self = this,

            getNewKoModel = function() {
                var KoModel = ko.mapping.fromJS(goalAccountViewModel.getNewModel());
                return KoModel;
            };

        ko.utils.extend(self, rootParams.rootModel);

        Constants.module = "GOAL";
        rootParams.dashboard.backAllowed(true);
        self.validationTracker = ko.observable();
        self.caption = ko.observable();
        self.goal = ResourceBundle.goal;
        rootParams.dashboard.headerName(self.goal.account.header);

        self.isCalculated = ko.observable(true);
        self.currentTask = ko.observable("GL_N_CGLA");
        self.initialAmount = (self.initialAmount) || (self.params && self.params.transferDTO && self.params.transferDTO.initialAmount) || ko.observable();
        self.targetAmount = (self.goalAmount) || (self.params && self.params.transferDTO && self.params.transferDTO.goalAmount) || ko.observable();
        self.remainingAmount = ko.observable(self.targetAmount() - self.initialAmount());
        self.contributionAmount = ko.observable();
        self.contributionAccount = ko.observable();
        self.calculationData = ko.observable();
        self.categoryData = ko.observable();
        self.subCategoryData = ko.observable();
        self.productDetails = ko.observable();
        self.yearValue = self.yearValue || ko.observable(0);
        self.monthValue = self.monthValue || ko.observable(0);
        self.productYears = ko.observableArray();
        self.productMonths = ko.observableArray();
        self.frequencyLabel = ko.observable(self.goal.account.monthlyInvestment);
        self.frequency = ko.observable();
        self.additionalDetailsInitial = ko.observable();
        self.additionalDetailsContribution = ko.observable();
        self.additionalBankDetails = ko.observable(null);
        self.goalName = ko.observable();
        self.siAccount = ko.observable();
        self.startDate = ko.observable();
        self.endDate = ko.observable();
        self.maturityType = ko.observable();
        self.selfAccount = ko.observable();
        self.branch = ko.observable();
        self.branches = ko.observableArray();
        self.branchesLoaded = ko.observable(false);
        self.internalAccount = ko.observable();
        self.domesticAccount = ko.observable();
        self.network = ko.observable();
        self.networkTypes = ko.observableArray();
        self.isNetworkTypesLoaded = ko.observable(false);
        self.beneficiaryName = ko.observable();
        self.bankCode = ko.observable();
        self.codeRefreshed = ko.observable(true);
        self.detailsFetched = ko.observable(false);
        self.isLoaded = ko.observable(false);
        self.stageOne = ko.observable(true);
        self.stageTwo = ko.observable(false);
        self.baseCurrency = ko.observable("GBP");
        self.isTenureDisabled = ko.observable(false);
        self.goalAccount = ko.observable();
        self.maturityFlag = ko.observable([""]);
        self.SIFlag = ko.observable([""]);
        self.file = ko.observable();
        self.isActive = ko.observable(true);
        self.maxFileSize = ko.observable(self.goal.account.maxSize / 1000);
        self.SIChecked = ko.observable();


        self.content = ko.observable(rootParams.rootModel.params.transferDTO.content());
        self.userContent = ko.observable();

        self.goalAccountPayload = getNewKoModel().goalAccountCreateModel;
        self.calculatePayload = getNewKoModel().goalCalculatorModel;
        self.SIPayload = getNewKoModel().goalAccountSIModel;

        rootParams.baseModel.registerComponent("list-goal", "goals");
        rootParams.baseModel.registerComponent("maturity-details", "goals");
        rootParams.baseModel.registerElement(["confirm-screen", "account-input", "amount-input", "bank-look-up"]);

        self.maturityDetails = ko.observable({
            selfAccountObject: {
                value: ""
            },
            accountNumber: "",
            accountType: "",
            networkType: "",
            name: "",
            bankCode: "",
            bankDetails: "",
            branch: ""
        });

        self.maturityDetails(ko.mapping.fromJS(self.maturityDetails()));

        goalAccountViewModel.fetchBankConfiguration().done(function(data) {
            self.baseCurrency(data.bankConfigurationDTO.localCurrency);
        });

        self.openLookup = function() {
            $("#menuButtonDialog").trigger("openModal");
        };

        self.tenureYearHandler = function(event) {
            if (event.detail.value) {
                self.calculatePayload.tenure.year(event.detail.value);
            }
        };

        self.tenureMonthHandler = function(event) {
            if (event.detail.value) {
                self.calculatePayload.tenure.month(event.detail.value);
            }
        };

        function readURL() {
            if (self.file()) {
                var reader = new FileReader();
                reader.onload = function(e) {
                    $("#imagepreview").attr("src", e.target.result);
                };
                reader.readAsDataURL(self.file());
            }
        }

        self.minDate = ko.observable();
        self.currentDate = ko.observable();
        var d = rootParams.baseModel.getDate();
        goalAccountViewModel.getHostDate().done(function(data) {

            /*
             * Fetches Current date of the system to calculate min SI startdate and max SI enddate.
             */
            self.currentDate(new Date(data.currentDate.valueDate));
            //get nextdate
            self.currentDate().setDate(self.currentDate().getDate() + 1);
            self.minDate(oj.IntlConverterUtils.dateToLocalIso(new Date(self.currentDate().setHours(0, 0, 0, 0))));

            self.minDateTomorrow = ko.computed(function() {
                if (self.startDate()) {
                    var startDate = new Date(self.startDate());
                    //get nextdate
                    startDate.setDate(startDate.getDate() + 1);
                    return ko.observable(oj.IntlConverterUtils.dateToLocalIso(new Date(startDate.setHours(0, 0, 0, 0))));
                }
                return ko.observable(oj.IntlConverterUtils.dateToLocalIso(new Date(self.currentDate().setHours(0, 0, 0, 0))));
            });

            self.expectedMaturityDate = ko.computed(function() {
                d = new Date(data.currentDate.valueDate);
                d.setMonth(d.getMonth() + parseInt(self.monthValue()));
                d.setFullYear(parseInt(d.getFullYear()) + parseInt(self.yearValue()));
                return ko.observable(oj.IntlConverterUtils.dateToLocalIso(new Date(d.setHours(0, 0, 0, 0))));
            });

        });

        var fileTypeArray = ko.observableArray();
        fileTypeArray.push("image/jpeg");
        fileTypeArray.push("image/png");

        var imageFunction = function() {
            self.file(document.getElementById("createinputimage").files[0]);
            if (self.file()) {
                if (!(fileTypeArray().indexOf(self.file().type) > -1)) {
                    rootParams.baseModel.showMessages(null, [self.goal.account.fileTypeError], "ERROR");
                    self.file("");
                    document.getElementById("createinputimage").value = "";
                    return;
                }
                if (self.file().size <= 0) {
                    rootParams.baseModel.showMessages(null, [self.goal.account.emptyFileErrorMsg], "ERROR");
                    self.file("");
                    document.getElementById("createinputimage").value = "";
                    return;
                } else if (self.file().size > self.maxFileSize() * 1000) {
                    rootParams.baseModel.showMessages(null, [rootParams.baseModel.format(self.goal.account.fileSizeErrorMsg, {
                        fileSize: self.maxFileSize()
                    })], "ERROR");
                    self.file("");
                    document.getElementById("createinputimage").value = "";
                    return;
                }
            }

            readURL(this);
        };

        self.afterRender = function() {
            $("#createinputimage").change(imageFunction);
        };

        self.chooseFile = function() {
            $("#createinputimage").trigger("click");
        };

        self.loadGoalList = function() {
            rootParams.dashboard.loadComponent("list-goal", self.isActive(), self);
        };

        self.fetchCalculation = function() {
            self.calculationData(JSON.parse(rootParams.rootModel.params.transferDTO));
            if (self.calculationData() && self.calculationData().dataCalculated) {
                self.initialAmount(self.calculationData().initialDepositAmount.amount);
                self.targetAmount(self.calculationData().targetAmount.amount);
                self.yearValue(self.calculationData().tenure.year.toString());
                self.monthValue(self.calculationData().tenure.month.toString());
                self.isTenureDisabled(true);

                d.setMonth(d.getMonth() + parseInt(self.monthValue()));
                d.setFullYear(parseInt(d.getFullYear()) + parseInt(self.yearValue()));
                self.expectedMaturityDate = ko.observable(oj.IntlConverterUtils.dateToLocalIso(new Date(d.setHours(0, 0, 0, 0))));
                self.frequency(self.calculationData().frequency);
                self.contributionAmount(Math.round(self.calculationData().contributionAmount.amount));
                if (self.frequency() === "Monthly") {
                    self.frequencyLabel(self.goal.account.monthlyInvestment);
                } else if (self.frequency() === "Weekly") {
                    self.frequencyLabel(self.goal.account.weeklyInvestment);
                } else if (self.frequency() === "Quarterly") {
                    self.frequencyLabel(self.goal.account.quarterlyInvestment);
                }
            } else {
                self.initialAmount(self.calculationData().initialAmount);
                self.targetAmount(self.calculationData().goalAmount);
            }
            goalAccountViewModel.readCategory(self.calculationData().categoryId).done(function(data) {
                self.categoryData(data.goalCategoryDetails);
                self.caption({
                    categoryName: data.goalCategoryDetails.categoryName.toLowerCase(),
                    subCategoryName: ""
                });
                self.getProduct();
            });
        };

        self.validateCodeTrancker = ko.observable();

        if (rootParams.rootModel.params.transferDTO.dataCalculated) {
            self.fetchCalculation();
        } else {
            self.calculationData(rootParams.rootModel.params.transferDTO);
            self.targetAmount(rootParams.rootModel.params.transferDTO.goalAmount());
            self.initialAmount(rootParams.rootModel.params.transferDTO.initialAmount());
            goalAccountViewModel.readCategory(self.calculationData().categoryId()).done(function(data) {
                self.categoryData(data.goalCategoryDetails);
                self.caption({
                    categoryName: data.goalCategoryDetails.categoryName.toLowerCase(),
                    subCategoryName: ""
                });
                self.getProduct();
            });
        }


        self.verifyCode = function() {
            if (rootParams.baseModel.showComponentValidationErrors(document.getElementById("bankCodeTracker")))
                return;
            goalAccountViewModel.getBankDetailsDCC(self.bankCode()).done(function(data) {
                self.additionalBankDetails(data);
            });

        };
        self.resetCode = function() {
            self.bankCode(null);
            self.additionalBankDetails(null);
        };
        self.scheduleTypes = [{
            id: "Quarterly",
            label: self.goal.account.quarterly,
            isDisabled: false
        }, {
            id: "Monthly",
            label: self.goal.account.monthly,
            isDisabled: false
        }, {
            id: "Weekly",
            label: self.goal.account.weekly,
            isDisabled: false
        }];
        if (!self.frequency()) {
            self.frequency(self.scheduleTypes[1].id);
        }

        if (self.calculationData() && self.calculationData() !== null && self.calculationData().tenure) {
            if (self.calculationData().tenure.year === "0" && self.calculationData().tenure.month < "3") {
                self.scheduleTypes[0].isDisabled = true;
            }
        }

        var initialAmount = self.initialAmount.subscribe(function() {
            self.remainingAmount(self.targetAmount() - self.initialAmount());
            if (self.frequency() && self.targetAmount() && (self.yearValue() !== "0" || self.yearValue() !== "0")) {
                self.calculate();
            }
        });

        var targetAmount = self.targetAmount.subscribe(function() {
            self.remainingAmount(self.targetAmount() - self.initialAmount());
            if (self.frequency() && self.initialAmount() && (self.yearValue() !== "0" || self.monthValue() !== "0")) {
                self.calculate();
            }
        });

        var frequency = self.frequency.subscribe(function() {
            if (self.targetAmount() && self.initialAmount()) {
                self.calculate();
            }
        });

        self.yearValueChanged = function(event) {
            if (event.detail.value && event.detail.trigger === "option_selected") {
                if (self.initialAmount() && self.paymentSchedule() && (self.yearValue() !== "0" || self.monthValue() !== "0")) {
                    self.calculate();
                }
            }
        };
        self.monthValueChanged = function() {
            if (event.detail.value && event.detail.trigger === "option_selected") {
                if (self.initialAmount() && self.paymentSchedule() && (self.yearValue() !== "0" || self.monthValue() !== "0")) {
                    self.calculate();
                }
            }
        };

        self.calculate = function() {

            if (self.isLoaded()) {

                self.isCalculated(false);
                ko.tasks.runEarly();

                self.calculatePayload.categoryId(self.categoryData().categoryId);
                self.calculatePayload.targetAmount.currency(self.baseCurrency());
                self.calculatePayload.targetAmount.amount(self.targetAmount());
                self.calculatePayload.initialDepositAmount.currency(self.baseCurrency());
                self.calculatePayload.initialDepositAmount.amount(self.initialAmount());
                self.calculatePayload.tenure.year(Number(self.yearValue()));
                self.calculatePayload.tenure.month(Number(self.monthValue()));
                self.calculatePayload.subCategoryId(self.subCategoryData.categoryId);
                self.calculatePayload.frequency(self.frequency());

                var payload = ko.toJSON(self.calculatePayload);

                goalAccountViewModel.calculate(payload).done(function(data) {

                    self.calculationData(data.goalCalculatorDetails);
                    self.contributionAmount(Math.round(data.goalCalculatorDetails.contributionAmount.amount));
                    if (self.frequency() === "Monthly") {
                        self.frequencyLabel(self.goal.account.monthlyInvestment);
                    } else if (self.frequency() === "Weekly") {
                        self.frequencyLabel(self.goal.account.weeklyInvestment);
                    } else if (self.frequency() === "Quarterly") {
                        self.frequencyLabel(self.goal.account.quarterlyInvestment);
                    }

                    self.isCalculated(true);

                });
            }

        };

        goalAccountViewModel.getNetworkTypes("INDIA").done(function(data) {
            for (var i = 0; i < data.enumRepresentations[0].data.length; i++) {
                self.networkTypes.push({
                    text: data.enumRepresentations[0].data[i].description,
                    value: data.enumRepresentations[0].data[i].code
                });

            }
            self.network(data.enumRepresentations[0].data[0].code);
            self.isNetworkTypesLoaded(true);
        });

        self.maturityList = [{
            value: "Self",
            text: self.goal.account.self
        }, {
            value: "Domestic",
            text: self.goal.account.domestic
        }, {
            value: "Internal",
            text: self.goal.account.internal
        }];

        self.maturityType([self.maturityList[0].value]);

        var error;
        self.validateCode = {
            "validate": function(value) {
                if (value.length < 1) {
                    error = true;
                } else if (value.length > 11 || !(/^[a-zA-Z0-9]+$/.test(value))) {
                    error = true;
                    throw new oj.ValidatorError("", oj.Translations.getTranslatedString(self.poal.account.invalidError));
                }
            }
        };

        self.bankSubmit = function() {
            if (self.bankCode() !== null) {
                var code;
                code = oj.Components.getWidgetConstructor($("#bankCode"));
                code("validate");
                if (!error) {
                    goalAccountViewModel.getBankDetailsDCC(self.bankCode(), "INDIA").done(function(data) {
                        self.additionalBankDetails(data);
                        self.detailsFetched(true);
                    });
                }
            }
        };

        self.networkTypeChanged = function(event) {
            if (event.detail.value) {
                self.codeRefreshed(false);
                self.bankCode(null);
                self.detailsFetched(false);
                self.codeRefreshed(true);
            }
        };

        self.getProduct = function() {
            goalAccountViewModel.getProduct(self.categoryData().productId).done(function(data) {
                self.productDetails = data.goalProductDTO;
                for (var k = 0; k <= data.goalProductDTO.goalTenureParameter.maxTenure.years; k++) {
                    self.productYears.push({
                        "year": k.toString(),
                        "value": k.toString()
                    });
                }
                for (var l = 0; l <= 11; l++) {
                    self.productMonths.push({
                        "month": l.toString(),
                        "value": l.toString()
                    });
                }
                self.isLoaded(true);
            });
        };

        self.validationTrackerSI = ko.observable();

        self.uploadImage = function() {
            if (self.siAccount() || self.startDate() || self.endDate()) {
                if (!rootParams.baseModel.showComponentValidationErrors(self.validationTrackerSI())) {
                    return;
                }
            }
            if (self.additionalBankDetails()) {
                self.goalAccountPayload.payoutDetails.bankCode = self.additionalBankDetails().code;
            }
            if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("createGoalTracker")))
                return;

            if (document.getElementById("createinputimage").files[0] && document.getElementById("createinputimage").files[0].size > 0) {
                var form = new FormData();
                form.append("file", document.getElementById("createinputimage").files[0]);
                goalAccountViewModel.uploadImage(form).done(function(data) {
                    if (data && data.contentDTOList[0] && data.contentDTOList[0].contentId) {
                        self.goalAccountPayload.contentId.value(data.contentDTOList[0].contentId.value);
                        self.createGoal();
                    }
                });
            } else {
                self.createGoal();
            }

        };

        self.createGoal = function() {

            if (self.yearValue() === "0" && self.monthValue() === "0") {
                rootParams.baseModel.showMessages(null, [self.goal.account.goalTenureError], "ERROR");
                return;
            }
            var payload;
            self.expectedMaturityDateObject = new Date(self.expectedMaturityDate());

            var date = self.currentDate();
            date.setDate(date.getDate());
            var startDate = ko.observable(oj.IntlConverterUtils.dateToLocalIso(new Date(date.setHours(0, 0, 0, 0))));

            self.goalAccountPayload.categoryId = self.categoryData().categoryId;
            if (self.calculationData().subCategoryId && self.calculationData().subCategoryId()) {
                self.goalAccountPayload.subCategoryId = self.subCategoryData().categoryId;
            }
            delete self.maturityDetails()._ko__mapping;
            if (self.maturityFlag()[0] !== "maturityManuallySelected") {
                self.maturityDetails = ko.observable({
                    selfAccountObject: {
                        value: self.contributionAccount()
                    },
                    accountNumber: "",
                    accountType: "Self",
                    networkType: "",
                    name: "",
                    bankCode: "",
                    bankDetails: "",
                    branch: ""
                });
            }
            self.payoutDetails = ko.toJS(self.maturityDetails());
            self.goalAccountPayload.productId = self.categoryData().productId;
            self.goalAccountPayload.startDate = startDate();
            self.goalAccountPayload.name = self.goalName();
            self.goalAccountPayload.targetAmount.amount = self.targetAmount();
            self.goalAccountPayload.targetAmount.currency = self.baseCurrency();
            self.goalAccountPayload.initialDepositAmount.amount = self.initialAmount();
            self.goalAccountPayload.initialDepositAmount.currency = self.baseCurrency();
            self.goalAccountPayload.initialDepositAccount.value = self.contributionAccount();
            self.goalAccountPayload.tenure.year = Number(self.yearValue());
            self.goalAccountPayload.tenure.month = Number(self.monthValue());
            self.goalAccountPayload.tenure.day = 0;
            self.goalAccountPayload.payinDetails = null;
            self.goalAccountPayload.payoutDetails.mode = self.payoutDetails.accountType;

            if (self.payoutDetails.accountType === "Self") {

                self.goalAccountPayload.payoutDetails.selfAccountId = {
                    value: self.payoutDetails.selfAccountObject.value
                };
                delete self.goalAccountPayload.payoutDetails.accountName;
                delete self.goalAccountPayload.payoutDetails.networkType;
                delete self.goalAccountPayload.payoutDetails.bankCode;
                delete self.goalAccountPayload.payoutDetails.branch;
                delete self.goalAccountPayload.payoutDetails.accountId;
            } else if (self.payoutDetails.accountType === "Domestic") {

                self.goalAccountPayload.payoutDetails.accountId = self.payoutDetails.accountNumber;
                self.goalAccountPayload.payoutDetails.accountName = self.payoutDetails.name;
                self.goalAccountPayload.payoutDetails.networkType = self.payoutDetails.networkType;
                self.goalAccountPayload.payoutDetails.bankCode = self.payoutDetails.bankCode;
                delete self.goalAccountPayload.payoutDetails.branch;
                delete self.goalAccountPayload.payoutDetails.selfAccountId;
            } else if (self.payoutDetails.accountType === "Internal") {

                self.goalAccountPayload.payoutDetails.accountId = self.payoutDetails.accountNumber;
                self.goalAccountPayload.payoutDetails.branch = self.payoutDetails.branch;
                delete self.goalAccountPayload.payoutDetails.accountName;
                delete self.goalAccountPayload.payoutDetails.networkType;
                delete self.goalAccountPayload.payoutDetails.bankCode;
                delete self.goalAccountPayload.payoutDetails.selfAccountId;
            }

            if (self.maturityDetails() && typeof self.maturityDetails().bankDetails === "function" && self.maturityDetails().bankDetails()) {
                self.goalAccountPayload.payoutDetails.bankCode = self.maturityDetails().bankDetails().code;
            }

            self.setConfirmScreen = function() {
                if (document.getElementById("createinputimage").files[0] && document.getElementById("createinputimage").files[0].size > 0) {
                    var reader = new FileReader();
                    reader.onload = function(e) {
                        $("#confirmimagepreview").attr("src", e.target.result);
                    };
                    reader.readAsDataURL(document.getElementById("createinputimage").files[0]);
                } else {
                    self.userContent = self.content;
                }
            };
            payload = ko.toJSON(self.goalAccountPayload);
            goalAccountViewModel.createGoal(payload).done(function(data, status, jqXHR) {
                if (self.siAccount() && self.startDate() && self.endDate() && self.contributionAmount() && self.baseCurrency() && (self.SIFlag()[0] === "SISelected")) {
                    self.SIPayload.payinDetails.contributionAmount.amount(self.contributionAmount());
                    self.SIPayload.payinDetails.contributionAmount.currency(self.baseCurrency());
                    self.SIPayload.payinDetails.frequency(self.frequency());
                    self.SIPayload.payinDetails.debitAccount.value(self.siAccount());
                    self.SIPayload.payinDetails.startDate(self.startDate());
                    self.SIPayload.payinDetails.endDate(self.endDate());
                    payload = ko.toJSON(self.SIPayload);
                    goalAccountViewModel.startStandingInstruction(data.goalDTO.id, payload).done(function() {
                        self.setConfirmScreen();
                        self.stageOne(false);
                        rootParams.dashboard.loadComponent("confirm-screen", {
                            jqXHR: jqXHR,
                            transactionName: self.goal.account.titleGoalCreation,
                            confirmScreenExtensions: {
                                isSet: true,
                                taskCode: "GL_N_CGLA",
                                template: "confirm-screen/pfm-template"
                            },
                            additionalDetails: {
                                items: [{
                                    label: self.goal.account.goalNamelabel,
                                    value: self.goalName()
                                }, {
                                    label: self.goal.account.amountlabel,
                                    value: rootParams.baseModel.formatCurrency(self.targetAmount(), self.baseCurrency())
                                }, {
                                    label: self.goal.account.maturitylabel,
                                    value: rootParams.baseModel.formatDate(self.expectedMaturityDate())
                                }, {
                                    label: rootParams.baseModel.format(self.goal.account.goalfrequencysuccesslabel, {
                                        frequency: self.frequency()
                                    }),
                                    value: rootParams.baseModel.formatCurrency(self.contributionAmount(), self.baseCurrency())
                                }]
                            }
                        }, self);

                    }).fail(function() {
                        self.setConfirmScreen();
                        self.siAccount(false);
                        self.stageOne(false);
                        rootParams.dashboard.loadComponent("confirm-screen", {
                            jqXHR: jqXHR,
                            transactionName: self.goal.account.titleGoalCreation,
                            confirmScreenExtensions: {
                                isSet: true,
                                taskCode: "GL_N_CGLA",
                                template: "confirm-screen/pfm-template"
                            },
                            additionalDetails: {
                                items: [{
                                    label: self.goal.account.goalNamelabel,
                                    value: self.goalName()
                                }, {
                                    label: self.goal.account.amountlabel,
                                    value: rootParams.baseModel.formatCurrency(self.targetAmount(), self.baseCurrency())
                                }, {
                                    label: self.goal.account.maturitylabel,
                                    value: rootParams.baseModel.formatDate(self.expectedMaturityDate())
                                }]
                            }
                        }, self);
                    });
                } else {
                    self.setConfirmScreen();
                    self.stageOne(false);
                    rootParams.dashboard.loadComponent("confirm-screen", {
                        jqXHR: jqXHR,
                        transactionName: self.goal.account.titleGoalCreation,
                        confirmScreenExtensions: {
                            isSet: true,
                            taskCode: "GL_N_CGLA",
                            template: "confirm-screen/pfm-template"
                        },
                        additionalDetails: {
                            items: [{
                                label: self.goal.account.goalNamelabel,
                                value: self.goalName()
                            }, {
                                label: self.goal.account.amountlabel,
                                value: rootParams.baseModel.formatCurrency(self.targetAmount(), self.baseCurrency())
                            }, {
                                label: self.goal.account.maturitylabel,
                                value: rootParams.baseModel.formatDate(self.expectedMaturityDate())
                            }]
                        }
                    }, self);
                }

            }).fail(function() {
                if (self.goalAccountPayload.contentId.value()) {
                    goalAccountViewModel.deleteImage(self.goalAccountPayload.contentId.value());
                    self.goalAccountPayload.contentId.value("");
                }
            });
        };

        self.back = function() {
            history.back(-1);
        };

        self.cancel = function() {
            window.location.assign("index.html");
        };
        self.dispose = function() {
            initialAmount.dispose();
            frequency.dispose();
            targetAmount.dispose();
            self.minDateTomorrow.dispose();
            self.expectedMaturityDate.dispose();
        };
    };
});