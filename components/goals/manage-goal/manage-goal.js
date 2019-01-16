define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/manage-goal",
    "ojL10n!resources/nls/create-goal",
    "promise",
    "ojs/ojknockout-validation",
    "ojs/ojtable",
    "ojs/ojpagingcontrol",
    "ojs/ojpagingtabledatasource",
    "ojs/ojarraytabledatasource",
    "ojs/ojselectcombobox",
    "ojs/ojinputtext",
    "ojs/ojdatetimepicker",
    "ojs/ojbutton",
    "ojs/ojconveyorbelt",
    "ojs/ojvalidationgroup",
    "ojs/ojradioset"
], function(oj, ko, $, ManageGoalModel, ResourceBundle, ResourceBundle1) {
    "use strict";
    return function(Params) {
        var self = this,
            baseModel = Params.baseModel,
            getNewKoModel = function() {
                var KoModel = ko.mapping.fromJS(ManageGoalModel.getNewModel());
                return KoModel;
            };
        ko.utils.extend(self, Params.rootModel);
        self.resource = ResourceBundle;
        self.menuCountOptions = ko.observableArray();
        self.selectedTab = ko.observable("viewedit");
        self.validationTracker = ko.observable();
        self.validationTrackerSI = ko.observable();
        self.goalAmount = ko.observable();
        self.goalPercentage = ko.observable();
        self.confirmMessage = ko.observable();
        self.goalAccountUpdatePayload = getNewKoModel().goalAccountUpdateModel;
        self.goalAccountSIModel = getNewKoModel().goalAccountSIModel;
        self.goalCalculatorModel = getNewKoModel().goalCalculatorModel;
        self.goalAccountTopupModel = getNewKoModel().goalAccountTopupModel;
        baseModel.registerElement([
            "amount-input",
            "account-input",
            "nav-bar",
            "modal-window",
            "bank-look-up",
            "date-box"
        ]);
        baseModel.registerComponent("goal-transaction-card", "goals");
        baseModel.registerComponent("percentage-graph", "personal-finance-management");
        $("#viewTopUpMessage").hide();
        self.detailsFetched = ko.observable(false);
        self.branchesLoaded = ko.observable(false);
        self.disableWithdraw = ko.observable(false);
        self.refreshAccountDropDown = ko.observable(true);
        self.fileUpload = ko.observable(false);
        self.file = ko.observable();
        self.content = self.params.content;
        self.isDataLoaded = ko.observable(false);
        self.maxFileSize = ko.observable(self.resource.manageGoal.maxSize / 1000);
        self.isActive = ko.observable(self.params.isActive);
        self.baseCurrency = ko.observable();
        self.goalData = ko.mapping.fromJS(Params.rootModel.params.data);
        self.goalAmount(self.goalData.avaliableBalance.amount());
        self.goalPercentage(self.goalData.percentAchieved());
        if (self.goalData && self.goalPercentage() > 100) {
            self.goalPercentage(100);
        }
        self.goalData.categoryName(self.goalData.categoryName().toLowerCase());
        Params.dashboard.headerName(self.goalData.name());
        self.goalAccountUpdatePayload.name(self.goalData.name());
        self.thresholdValues = [{
                max: Math.round(self.goalData.targetAmount.amount() / 2),
                color: "#D54215"
            },
            { color: "#2E7D32" }
        ];
        self.goalAccountUpdatePayload.targetAmount.amount(self.goalData.targetAmount.amount());
        if (self.goalData.payoutDetails.mode() === "Domestic") {
            self.goalAccountUpdatePayload.payoutDetails.accountName = self.goalData.payoutDetails.accountName();
        }

        function readURL() {
            if (self.file()) {
                var reader = new FileReader();
                reader.onload = function(e) {
                    $("#editimagepreview").attr("src", e.target.result);
                };
                reader.readAsDataURL(self.file());
            }
        }
        var fileTypeArray = ko.observableArray();
        fileTypeArray.push("image/jpeg");
        fileTypeArray.push("image/png");
        var imageFunction = function() {
            self.file(document.getElementById("editinputimage").files[0]);
            if (self.file()) {
                if (fileTypeArray().indexOf(self.file().type) === -1) {
                    baseModel.showMessages(null, [self.goal.account.fileTypeError], "ERROR");
                    self.file("");
                    document.getElementById("editinputimage").value = "";
                    return;
                }
                if (self.file().size <= 0) {
                    baseModel.showMessages(null, [self.goal.account.emptyFileErrorMsg], "ERROR");
                    self.file("");
                    document.getElementById("editinputimage").value = "";
                    return;
                } else if (self.file().size > self.maxFileSize() * 1000) {
                    baseModel.showMessages(null, [baseModel.format(self.goal.account.fileSizeErrorMsg, { fileSize: self.maxFileSize() })], "ERROR");
                    self.file("");
                    document.getElementById("editinputimage").value = "";
                    return;
                }
            }
            readURL(this);
        };
        self.afterRender = function() {
            $("#editinputimage").change(imageFunction);
        };
        self.chooseFile = function() {
            $("#editinputimage").trigger("click");
        };
        self.minDate = ko.observable();
        self.currentDate = ko.observable();
        ManageGoalModel.getHostDate().done(function(data) {
            self.currentDate(new Date(data.currentDate.valueDate));
            self.currentDate().setDate(self.currentDate().getDate() + 1);
            self.minDate = ko.observable(oj.IntlConverterUtils.dateToLocalIso(new Date(self.currentDate().setHours(0, 0, 0, 0))));
            self.currentDate().setDate(self.currentDate().getDate() + 1);
            self.minDateTomorrow = ko.observable(oj.IntlConverterUtils.dateToLocalIso(new Date(self.currentDate().setHours(0, 0, 0, 0))));
        });
        self.validateStartDate = {
            "validate": function(value) {
                if (value && self.goalAccountSIModel.payinDetails.endDate()) {
                    if (value.valueOf() > self.goalAccountSIModel.payinDetails.endDate().valueOf()) {
                        throw new oj.ValidatorError("", oj.Translations.getTranslatedString(self.resource.manageGoal.invalidStartDate));
                    } else if (value.valueOf() === self.goalAccountSIModel.payinDetails.endDate().valueOf()) {
                        throw new oj.ValidatorError("", oj.Translations.getTranslatedString(self.resource.manageGoal.samedates));
                    }
                }
            }
        };
        self.validateEndDate = {
            "validate": function(value) {
                if (value && self.goalAccountSIModel.payinDetails.startDate()) {
                    if (self.goalAccountSIModel.payinDetails.startDate().valueOf() >= value.valueOf()) {
                        throw new oj.ValidatorError("", oj.Translations.getTranslatedString(self.resource.manageGoal.invalidEndDate));
                    } else if (value.valueOf() === self.goalAccountSIModel.payinDetails.startDate().valueOf()) {
                        throw new oj.ValidatorError("", oj.Translations.getTranslatedString(self.resource.manageGoal.samedates));
                    }
                }
            }
        };
        ManageGoalModel.init(self.goalData.id());
        self.runTask = ko.observable(true);
        ManageGoalModel.fetchBankConfig().done(function(bankConfig) {
            self.baseCurrency(bankConfig.bankConfigurationDTO.localCurrency);
            ManageGoalModel.readCategory(self.goalData.categoryId()).done(function(data) {
                if (data && data !== null && data.goalCategoryDetails && data.goalCategoryDetails !== null && data.goalCategoryDetails.productId && data.goalCategoryDetails.productId !== null) {
                    ManageGoalModel.readProduct(data.goalCategoryDetails.productId).done(function(productData) {
                        for (var i = 0; i < productData.goalProductDTO.goalAmountParameters.length; i++) {
                            if (productData.goalProductDTO.goalAmountParameters[i].currency === self.baseCurrency()) {
                                self.goalData.productMax = ko.observable(productData.goalProductDTO.goalAmountParameters[0].maxAmount.amount);
                                self.goalData.productMin = ko.observable(productData.goalProductDTO.goalAmountParameters[0].minAmount.amount);
                                self.goalData.incrementStep = productData.goalProductDTO.goalAmountParameters[0].incrementStep;
                                self.maxWithdrawAmount = productData.goalProductDTO.goalAmountParameters[0].maxAmount.amount;
                                self.minWithdrawAmount = productData.goalProductDTO.goalAmountParameters[0].minAmount.amount;
                                break;
                            }
                        }
                        self.isDataLoaded(true);
                    });
                }
            });
        });
        self.isNetworkTypesLoaded = ko.observable(false);
        self.isRead = ko.observable(true);
        self.updateSuccess = ko.observable(false);
        self.topupSuccess = ko.observable(false);
        self.frequency = ko.observable("Monthly");
        self.startDate = ko.observable();
        self.enddate = ko.observable();
        self.isview = ko.observable(true);
        self.navigatorObject = ko.observable({
            view: true,
            contribute: false,
            withdraw: false,
            viewTransaction: false
        });
        self.navigatorObject = ko.mapping.fromJS(self.navigatorObject());
        self.isStandingInstructionSet = ko.observable(false);
        self.contribution = ko.observable();
        self.maturityInternalAccount = ko.observable();
        self.maturityDomesticAccount = ko.observable();
        self.beneficiaryName = ko.observable();
        self.currentTask = ko.observable("GL_N_CGLA");
        self.branches = ko.observableArray();
        self.network = ko.observable(self.goalData.payoutDetails.networkType ? self.goalData.payoutDetails.networkType() : undefined);
        self.networkTypes = ko.observableArray();
        self.branch = ko.observable();
        self.maturityAccount = ko.observable();
        self.goalBalance = self.goalData.availableBalance.amount;
        self.topupAmount = ko.observable();
        self.additionalBankDetails = ko.observable(null);
        if (self.goalData.payoutDetails && self.goalData.payoutDetails.mode() !== null) {
            self.selectedAccountTransferOption = self.goalData.payoutDetails.mode;
        } else {
            self.selectedAccountTransferOption = ko.observable("Self");
        }
        if (self.goalData.payoutDetails && self.goalData.payoutDetails.mode() === "Self") {
            self.maturityAccount(self.goalData.payoutDetails ? self.goalData.payoutDetails.selfAccountId.value() : undefined);
        } else if (self.goalData.payoutDetails && self.goalData.payoutDetails.mode() === "Internal") {
            self.maturityInternalAccount(self.goalData.payoutDetails.accountId());
            self.branch(self.goalData.payoutDetails.branch());
        } else if (self.goalData.payoutDetails && self.goalData.payoutDetails.mode() === "Domestic") {
            self.branch(null);
            self.maturityDomesticAccount(self.goalData.payoutDetails.accountId());
            self.beneficiaryName(self.goalData.payoutDetails.accountName());
            self.goalAccountUpdatePayload.payoutDetails.bankCode = self.goalData.payoutDetails.bankCode();
        }
        if (self.goalData.payinDetails && self.goalData.payinDetails.debitAccount.value() !== null) {
            self.goalAccountSIModel.payinDetails.debitAccount = self.goalData.payinDetails.debitAccount;
            self.goalAccountSIModel.payinDetails.startDate(self.goalData.payinDetails.startDate());
            self.goalAccountSIModel.payinDetails.endDate(self.goalData.payinDetails.endDate());
            self.frequency(self.goalData.payinDetails.frequency ? self.goalData.payinDetails.frequency() : "Monthly");
            self.contribution(self.goalData.payinDetails.contributionAmount.amount());
            self.isStandingInstructionSet(true);
        }
        self.maturityList = [{
                value: "Self",
                text: self.resource.labels.self
            },
            {
                value: "Domestic",
                text: self.resource.labels.domestic
            },
            {
                value: "Internal",
                text: self.resource.labels.internal
            }
        ];
        self.frequencies = [{
                id: "Weekly",
                label: self.resource.manageGoal.weekly
            },
            {
                id: "Monthly",
                label: self.resource.manageGoal.monthly
            },
            {
                id: "Quarterly",
                label: self.resource.manageGoal.quarterly
            }
        ];
        self.validateCodeTrancker = ko.observable();
        self.refreshBankCode = ko.observable(true);
        self.verifyCode = function() {
            if (!Params.baseModel.showComponentValidationErrors(document.getElementById("codeTracker"))) {
                return;
            }
            ManageGoalModel.getBankDetailsDCC(self.goalAccountUpdatePayload.payoutDetails.bankCode, self.network()).done(function(data) {
                var codeMatched = false;
                for (var i = 0; i < data.listFinancialInstitution.length; i++) {
                    if (data.listFinancialInstitution[i].code.toLowerCase() === self.goalAccountUpdatePayload.payoutDetails.bankCode.toLowerCase()) {
                        self.additionalBankDetails(data.listFinancialInstitution[i]);
                        codeMatched = true;
                        break;
                    }
                }
                if (!codeMatched) {
                    self.refreshBankCode(false);
                    self.goalAccountUpdatePayload.payoutDetails.bankCode = "";
                    ko.tasks.runEarly();
                    self.refreshBankCode(true);
                    baseModel.showMessages(null, [self.resource.manageGoal.invalidCode], "ERROR");

                }
            }).fail(function() {
                self.refreshBankCode(false);
                self.goalAccountUpdatePayload.payoutDetails.bankCode = "";
                ko.tasks.runEarly();
                self.refreshBankCode(true);
            });
        };
        self.resetCode = function() {
            self.goalAccountUpdatePayload.payoutDetails.bankCode = null;
            self.additionalBankDetails(null);
        };
        self.openLookup = function() {
            $("#menuButtonDialog").trigger("openModal");
        };
        self.switchEditMode = function() {
            self.isRead(!self.isRead());
            self.updateSuccess(false);
        };
        self.frequencyChanged = function(event) {
            if (event.detail.value) {
                self.frequency(event.detail.value);
            }
        };
        self.updatedBalance = ko.observable(0);
        self.contributeGoal = function() {
            if (!Params.baseModel.showComponentValidationErrors(document.getElementById("contributeGoalTracker"))) {
                return;
            }
            self.updatedBalance(self.goalAmount() + self.goalAccountTopupModel.payinDetails.contributionAmount.amount());
            self.topupAmount(self.goalAccountTopupModel.payinDetails.contributionAmount.amount());
            $("#viewTopUpMessage").trigger("openModal");
        };
        self.hidePopup = function() {
            $("#viewTopUpMessage").hide();
        };
        self.confirmContribute = function() {
            if (!Params.baseModel.showComponentValidationErrors(document.getElementById("contributeGoalTracker"))) {
                return;
            }
            self.goalAccountTopupModel.payinDetails.contributionAmount.currency(self.baseCurrency());
            var payload = ko.toJSON(self.goalAccountTopupModel);
            ManageGoalModel.topUpGoal(payload).done(function() {
                $("#viewTopUpMessage").hide();
                self.goalAmount(self.goalAmount() + self.goalAccountTopupModel.payinDetails.contributionAmount.amount());
                self.goalBalance(self.goalAmount() + self.goalAccountTopupModel.payinDetails.contributionAmount.amount());
                if (self.goalData.targetAmount.amount !== 0) {
                    var percentAchieved = (Math.round(self.goalAmount() / self.goalData.targetAmount.amount() * 100 * 100) / 100).toFixed(2);
                    if (percentAchieved < 100) {
                        self.goalPercentage(percentAchieved);
                    } else {
                        self.goalPercentage(100);
                    }
                } else {
                    self.goalPercentage(0);
                }
                self.goalAccountTopupModel.payinDetails.contributionAmount.amount("");
                self.refreshAccountDropDown(false);
                ko.tasks.runEarly();
                self.goalAccountTopupModel.payinDetails.debitAccount.value("");
                self.refreshAccountDropDown(true);
                self.topupSuccess(true);
            }).fail(function() {
                self.topupSuccess(false);
                $("#viewTopUpMessage").hide();
            });
        };
        self.stopStandingInstruction = function() {
            if (!Params.baseModel.showComponentValidationErrors(document.getElementById("siTracker")))
                return;
            ManageGoalModel.stopStandingInstruction().done(function() {
                self.isStandingInstructionSet(false);
                self.goalAccountSIModel.payinDetails.debitAccount.value("");
                self.goalAccountSIModel.payinDetails.startDate("");
                self.goalAccountSIModel.payinDetails.endDate("");
                if (self.goalData.payinDetails) {
                    self.frequency(self.goalData.payinDetails.frequency ? self.goalData.payinDetails.frequency() : "Monthly");
                }
                if (!self.isActive()) {
                    self.isRead(true);
                }
                self.contribution("");
                self.runTask(false);
                ko.tasks.runEarly();
                self.runTask(true);
                self.updateSuccess(true);
                self.confirmMessage(self.resource.manageGoal.SIConfirmation);
            });
        };
        self.startStandingInstruction = function() {
            if (!Params.baseModel.showComponentValidationErrors(document.getElementById("siTracker")))
                return;
            self.goalAccountSIModel.payinDetails.frequency(self.frequency());
            self.goalAccountSIModel.payinDetails.contributionAmount.amount(self.contribution());
            self.goalAccountSIModel.payinDetails.contributionAmount.currency(self.baseCurrency());
            var payload = ko.toJSON(self.goalAccountSIModel);
            ManageGoalModel.startStandingInstruction(payload).done(function() {
                self.isStandingInstructionSet(true);
                self.updateSuccess(true);
                self.confirmMessage(self.resource.manageGoal.SIConfirmation);
            });
        };
        self.accountTransferTypeChanged = function(data, event) {
            if (event.option === "value") {
                self.selectedAccountTransferOption(event.value[0]);
                self.goalAccountUpdatePayload.payoutDetails.accountName = "";
                self.goalAccountUpdatePayload.payoutDetails.bankCode = "";
                if (self.selectedAccountTransferOption() === "Self") {
                    self.maturityDomesticAccount("");
                    self.maturityInternalAccount("");
                    self.network("");
                    self.branch("");
                    self.refreshAccountDropDown(false);
                    ko.tasks.runEarly();
                    self.refreshAccountDropDown(true);
                } else if (self.selectedAccountTransferOption() === "Domestic") {
                    self.maturityInternalAccount("");
                    self.maturityAccount("");
                    self.branch("");
                    self.refreshAccountDropDown(false);
                    ko.tasks.runEarly();
                    self.refreshAccountDropDown(true);
                } else {
                    self.maturityDomesticAccount("");
                    self.maturityAccount("");
                    self.branch("");
                    self.network("");
                    self.refreshAccountDropDown(false);
                    ko.tasks.runEarly();
                    self.refreshAccountDropDown(true);
                }
            }
        };
        self.networkTypeChanged = function(data, event) {
            if (event.option === "value") {
                self.network(event.value[0]);
            }
        };
        ManageGoalModel.getNetworkTypes("INDIA").done(function(data) {
            for (var i = 0; i < data.enumRepresentations[0].data.length; i++) {
                self.networkTypes.push({
                    text: data.enumRepresentations[0].data[i].description,
                    value: data.enumRepresentations[0].data[i].code
                });
            }
            if ((typeof self.network === "function" && !self.network()) || self.network() === null) {
                self.network(data.enumRepresentations[0].data[0].code);
            }
            self.isNetworkTypesLoaded(true);
        });
        self.showeditWarningForSI = function() {
            if (!Params.baseModel.showComponentValidationErrors(document.getElementById("manageGoalsTracker")))
                return;
            $("#editWarningForSI").trigger("openModal");
        };
        self.hideeditWarningForSI = function() {
            $("#editWarningForSI").hide();
        };
        self.standingInstructionCheck = function() {
            if (self.isStandingInstructionSet()) {
                self.uploadUserImageandUpdate();
            } else {
                self.showeditWarningForSI();
            }
        };
        self.uploadUserImageandUpdate = function() {
            if (document.getElementById("editinputimage").files[0] && document.getElementById("editinputimage").files[0].size > 0) {
                var form = new FormData();
                form.append("file", document.getElementById("editinputimage").files[0]);
                ManageGoalModel.uploadImage(form).done(function(data) {
                    if (data && data.contentDTOList[0] && data.contentDTOList[0].contentId) {
                        self.goalAccountUpdatePayload.contentId.value(data.contentDTOList[0].contentId.value);
                        self.updateGoal();
                    }
                });
            } else {
                self.updateGoal();
            }
        };
        self.updateGoal = function() {
            if (!Params.baseModel.showComponentValidationErrors(document.getElementById("manageGoalsTracker")))
                return;
            self.goalAccountUpdatePayload.targetAmount.currency(self.baseCurrency());
            self.goalAccountUpdatePayload.payoutDetails.mode(self.goalData.payoutDetails ? self.goalData.payoutDetails.mode() : "Self");
            if (self.additionalBankDetails()) {
                self.goalAccountUpdatePayload.payoutDetails.bankCode = self.additionalBankDetails().code;
            }
            if (self.selectedAccountTransferOption() === "Self") {
                self.goalAccountUpdatePayload.payoutDetails.mode("Self");
                self.goalAccountUpdatePayload.payoutDetails.selfAccountId = { value: self.maturityAccount() };
                delete self.goalAccountUpdatePayload.payoutDetails.accountName;
                delete self.goalAccountUpdatePayload.payoutDetails.networkType;
                delete self.goalAccountUpdatePayload.payoutDetails.bankCode;
                delete self.goalAccountUpdatePayload.payoutDetails.branch;
                delete self.goalAccountUpdatePayload.payoutDetails.accountId;
            } else if (self.selectedAccountTransferOption() === "Domestic") {
                self.goalAccountUpdatePayload.payoutDetails.mode("Domestic");
                self.goalAccountUpdatePayload.payoutDetails.networkType = self.network();
                self.goalAccountUpdatePayload.payoutDetails.accountId = self.maturityDomesticAccount();
                delete self.goalAccountUpdatePayload.payoutDetails.branch;
                delete self.goalAccountUpdatePayload.payoutDetails.selfAccountId;
            } else if (self.selectedAccountTransferOption() === "Internal") {
                self.goalAccountUpdatePayload.payoutDetails.accountId = self.maturityInternalAccount();
                self.goalAccountUpdatePayload.payoutDetails.branch = self.branch();
                self.goalAccountUpdatePayload.payoutDetails.mode("Internal");
                delete self.goalAccountUpdatePayload.payoutDetails.accountName;
                delete self.goalAccountUpdatePayload.payoutDetails.networkType;
                delete self.goalAccountUpdatePayload.payoutDetails.bankCode;
                delete self.goalAccountUpdatePayload.payoutDetails.selfAccountId;
            }
            var payload = ko.toJSON(self.goalAccountUpdatePayload);
            ManageGoalModel.updateGoal(payload).done(function() {
                self.isRead(true);
                self.confirmMessage(self.resource.manageGoal.updateConfirmation);
                self.goalData = JSON.parse(ko.toJSON(self.goalData));
                self.goalData.payoutDetails = JSON.parse(payload).payoutDetails;
                self.goalData = ko.mapping.fromJS(self.goalData);
                Params.dashboard.headerName(self.goalAccountUpdatePayload.name());
                self.additionalBankDetails(null);
                if (self.selectedAccountTransferOption() === "Self") {
                    self.tempAccountId(self.additionalDetails().account.id.displayValue);
                } else if (self.selectedAccountTransferOption() === "Domestic") {
                    self.tempAccountId(self.goalAccountUpdatePayload.payoutDetails.accountId);
                } else {
                    self.tempAccountId(self.goalAccountUpdatePayload.payoutDetails.accountId);
                }
                self.hideeditWarningForSI();
                self.updateSuccess(true);
            }).fail(function() {
                if (self.goalAccountUpdatePayload.contentId.value()) {
                    ManageGoalModel.deleteImage(self.goalAccountUpdatePayload.contentId.value());
                    self.goalAccountUpdatePayload.contentId.value("");
                }
            });
        };
        self.uiOptions = {
            "menuFloat": "left",
            "fullWidth": false,
            "iconAvailable": true,
            "defaultOption": self.selectedTab
        };
        var tabs = [{
                name: "viewedit",
                icon: "nav-bar-item-link__icon icons icon-view-edit"
            },
            {
                name: "contribute",
                icon: "nav-bar-item-link__icon icons icon-payments"
            },
            {
                name: "withdraw",
                icon: "nav-bar-item-link__icon icons icon-repay"
            },
            {
                name: "viewtransaction",
                icon: "nav-bar-item-link__icon icons icon-view-statement"
            }
        ];
        for (var j = 0; j < tabs.length; j++) {
            self.menuCountOptions.push({
                label: self.resource.labels[tabs[j].name],
                icon: tabs[j].icon,
                id: tabs[j].name
            });
        }
        self.cancel = function() {
            history.back();
        };
        self.withdrawalType = ko.observable("PARTIAL");
        self.withdrawalamount = ko.observable();
        self.minWithdrawAmount = ko.observable();
        self.maxWithdrawAmount = ko.observable();
        self.goal = ResourceBundle1.goal;
        self.maturityType = ko.observable();
        self.maturityList = ko.observableArray();
        self.additionalDetails = ko.observable();
        self.validationTrackerForWithdrawal = ko.observable();
        self.validateCodeTranckerForWithdrawal = ko.observable();
        self.withdrawAmountPayload = getNewKoModel().withdrawAmountPayloadModel;
        self.redeemComplete = ko.observable(false);
        self.tempwithdrawalamount = ko.observable();
        self.tempAccountId = ko.observable();
        self.displayValueforModalwindow = ko.observable();
        self.updatePayoutDetails = function() {
            if (self.goalData.payoutDetails && self.goalData.payoutDetails.mode() === "Self") {
                self.maturityAccount(self.goalData.payoutDetails ? self.goalData.payoutDetails.selfAccountId.value() : undefined);
                self.tempAccountId(self.goalData.payoutDetails.selfAccountId.displayValue());
            } else if (self.goalData.payoutDetails && self.goalData.payoutDetails.mode() === "Internal") {
                self.branch(self.goalData.payoutDetails.branch());
                self.tempAccountId(self.goalData.payoutDetails.accountId());
            } else if (self.goalData.payoutDetails && self.goalData.payoutDetails.mode() === "Domestic") {
                self.branch(null);
                self.maturityDomesticAccount(self.goalData.payoutDetails.accountId());
                self.beneficiaryName(self.goalData.payoutDetails.accountName());
                self.tempAccountId(self.goalData.payoutDetails.accountId());
            }
        };
        self.updatePayoutDetails();
        self.verifyCodeForWithdrawal = function() {
            if (!baseModel.showComponentValidationErrors(self.validateCodeTranckerForWithdrawal())) {
                return;
            }
            ManageGoalModel.getBankDetailsDCC(self.goalAccountUpdatePayload.payoutDetails.bankCode).done(function(data) {
                self.additionalBankDetails(data);
                self.detailsFetched(true);
            });
        };
        self.maturityList = [{
                value: "Self",
                text: self.goal.account.self
            },
            {
                value: "Domestic",
                text: self.goal.account.domestic
            },
            {
                value: "Internal",
                text: self.goal.account.internal
            }
        ];
        if (self.selectedAccountTransferOption()) {
            self.maturityType([self.selectedAccountTransferOption()]);
        } else {
            self.maturityType([self.maturityList[0].value]);
        }
        self.valueChangeHandler = function(context, valueParam) {
            if (valueParam.option === "value") {
                if (self.withdrawalType() === "FULL") {
                    self.withdrawalamount("");
                }
            }
        };
        self.showWithdrawWarning = function() {
            if (!Params.baseModel.showComponentValidationErrors(document.getElementById("withdrawGoalTracker")))
                return;
            self.redeemComplete(false);
            if (self.withdrawalType() !== "FULL" && (self.withdrawalamount() < self.goalData.productMin || self.withdrawalamount() > self.goalData.productMax)) {
                baseModel.showMessages(null, [baseModel.format(self.resource.withdrawGoal.minMaxAmount, {
                    min: baseModel.formatCurrency(self.goalData.productMin(), self.baseCurrency()),
                    max: baseModel.formatCurrency(self.goalData.productMax(), self.baseCurrency())
                })], "ERROR");
                return;
            }
            if (self.withdrawalType() === "PARTIAL" && self.withdrawalamount() >= self.goalAmount()) {
                baseModel.showMessages(null, [self.resource.withdrawGoal.largeAmount], "ERROR");
                return;
            }
            if (self.withdrawalType() === "FULL") {
                self.withdrawalamount(self.goalAmount());
            }
            if (!baseModel.showComponentValidationErrors(self.validationTrackerForWithdrawal())) {
                return;
            }
            $("#withdrawWarning").trigger("openModal");
        };
        self.hideWithdrawWarning = function() {
            $("#withdrawWarning").hide();
        };
        self.withdraw = function() {
            if (!Params.baseModel.showComponentValidationErrors(document.getElementById("withdrawGoalTracker")))
                return;
            if (!baseModel.showComponentValidationErrors(self.validationTrackerForWithdrawal())) {
                return;
            }
            self.hideWithdrawWarning();
            self.withdrawAmountPayload.payoutDetails.typeRedemption = self.withdrawalType() === "PARTIAL" ? "P" : "F";
            self.withdrawAmountPayload.payoutDetails.mode = self.goalData.payoutDetails.mode();
            self.withdrawAmountPayload.payoutDetails.amount.amount = self.withdrawalType() === "PARTIAL" ? self.withdrawalamount() : self.goalAmount;
            self.withdrawAmountPayload.payoutDetails.amount.currency = self.baseCurrency;
            var payload = ko.toJSON(self.withdrawAmountPayload);
            ManageGoalModel.reedemGoal(payload).done(function() {
                self.redeemComplete(true);
                if (self.withdrawalType() === "FULL") {
                    self.disableWithdraw(true);
                }
                self.tempwithdrawalamount(self.withdrawalamount());
                self.withdrawalamount("");
                self.hideWithdrawWarning();
                ManageGoalModel.readGoalAccountDetails().done(function(data) {
                    self.goalAmount(data.goalDTO.avaliableBalance.amount);
                    if (data.goalDTO.status !== "CLOSED") {
                        var percentAchieved = (Math.round(self.goalAmount() / self.goalData.targetAmount.amount() * 100 * 100) / 100).toFixed(2);
                        if (percentAchieved < 100) {
                            self.goalPercentage(percentAchieved);
                        } else {
                            self.goalPercentage(100);
                        }
                    } else {
                        self.goalPercentage(0);
                        if (data.goalDTO.payinDetails && data.goalDTO.payinDetails.endDate) {
                            self.stopStandingInstruction();
                        }
                    }
                });
            });
        };
        self.transactionList = ko.observableArray();
        self.isTransactionListLoaded = ko.observable();
        self.dataSource = ko.observable();
        self.getTransactions = function() {
            ManageGoalModel.getTransactionList(self.goalData.id()).done(function(data) {
                if (data.items) {
                    self.transactionList(data.items);
                    var array = [];
                    array = $.map(self.transactionList(), function(u) {
                        var date = new Date(u.date);
                        var obj = {
                            "amount": u.amount.amount ? u.amount.amount : "-",
                            "transactionDate": date ? date : "-",
                            "description": u.description ? u.description : "-",
                            "transactionType": self.resource.manageGoal.transactionType[u.transactionType] || "-",
                            "externalReferenceNumber": u.key.transactionReferenceNumber ? u.key.transactionReferenceNumber : "-"
                        };
                        return obj;
                    });
                    self.dataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(array), { idAttribute: "externalReferenceNumber" }));
                    self.isTransactionListLoaded(true);
                }
            });
        };
        self.selectedTab.subscribe(function(newValue) {
            self.redeemComplete(false);
            self.updateSuccess(false);
            self.withdrawalamount("");
            if (newValue === "viewedit") {
                self.navigatorObject.view(true).contribute(false).withdraw(false).viewTransaction(false);
            } else if (newValue === "contribute") {
                self.navigatorObject.view(false).contribute(true).withdraw(false).viewTransaction(false);
            } else if (newValue === "withdraw") {
                self.navigatorObject.view(false).contribute(false).withdraw(true).viewTransaction(false);
            } else if (newValue === "viewtransaction") {
                self.isTransactionListLoaded(false);
                self.getTransactions();
                self.navigatorObject.view(false).contribute(false).withdraw(false).viewTransaction(true);
            }
        });
        self.conveyorBeltViewTransaction = function() {
            self.isTransactionListLoaded(false);
            self.getTransactions();
            self.navigatorObject.view(false).contribute(false).withdraw(false).viewTransaction(true);
        };
    };
});