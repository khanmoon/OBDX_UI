define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/initiate-guarantee",
    "ojs/ojaccordion",
    "ojs/ojcollapsible",
    "ojs/ojvalidation",
    "ojs/ojinputtext",
    "ojs/ojradioset",
    "ojs/ojknockout-validation",
    "ojs/ojvalidationgroup",
    "ojs/ojdatetimepicker",
    "ojs/ojcheckboxset",
    "ojs/ojselectcombobox",
    "ojs/ojmenu",
    "ojs/ojbutton"
], function (oj, ko, $, GuaranteeModel, locale) {
    "use strict";
    var vm = function (params) {
        var self = this;
        self.mode = ko.observable("CREATE");
        ko.utils.extend(self, params.rootModel);
        self.chargesAccountType = ko.observableArray();
        self.confirmScreenDetails = ko.observable();
        self.chargesAccountList = [];
        self.beneCountryoptions = ko.observable();
        self.partyIDoptions = ko.observable();
        self.branchIDoptions = ko.observable();
        self.productTypeOptions = ko.observable();
        self.beneNameOptions = ko.observable();
        self.resourceBundle = locale;
        params.dashboard.headerName(self.resourceBundle.heading.initiateGuarantee);
        self.advisingBankDetails = ko.observable(null);
        self.additionalBankDetails = ko.observable(null);
        self.bicCodeError = ko.observable(false);
        self.clearingCodeType = ko.observable("SWI").extend({ notify: "always" });
        self.networkCode = ko.observable();
        self.currencyListOptions = ko.observableArray();
        self.contractsList = ko.observableArray();
        self.contractsDataLoaded = ko.observable(false);
        self.datasourceForContracts = ko.observable();
        self.saveAsModalHeader = ko.observable("");
        self.modalHeader = ko.observable("");
        self.modalMessage = ko.observable("");
        self.draftName = ko.observable("");
        self.templateName = ko.observable("");
        self.tncValue = ko.observable([]);
        self.contractsValidationTracker = ko.observable();
        self.instructionsValidationTracker = ko.observable();
        self.partiesValidationTracker = ko.observable();
        self.commitmentValidationTracker = ko.observable();
        self.tncValidationTracker = ko.observable();
        self.minEffectiveDate = ko.observable();
        self.minExpiryDate = ko.observable();
        self.applicantName = ko.observable();
        self.deleteModalHeader = ko.observable("");
        self.deleteModalMessage = ko.observable();
        self.templateNameValidationTracker = ko.observable();
        self.attachedDocuments = ko.observableArray();
        self.deletedDocuments = ko.observableArray();
        self.oldTemplateName = ko.observable();
        self.oldDraftName = ko.observable();
        self.beneVisibility = ko.observable();
        self.bgGroupValid = ko.observable();
        self.bgTracker = ko.observable();
        self.commitmentGroupValid = ko.observable();
        self.commitmentTracker = ko.observable();
        self.instructionsGroupValid = ko.observable();
        self.instructionsTracker = ko.observable();
        self.contractsGroupValid = ko.observable();
        self.contractsTracker = ko.observable();
        self.tncTracker = ko.observable();
        self.tncGroupValid = ko.observable();
        self.attachmentsGroupValid = ko.observable();
        self.attachmentsTracker = ko.observable();
        self.applicantAddress = {
            line1: ko.observable(),
            line2: ko.observable(),
            line3: ko.observable(),
            country: ko.observable()
        };
        self.claimDays = ko.observable();
        self.stages = [
            {
                stageName: self.resourceBundle.heading.guaranteeDetails,
                expanded: ko.observable(true),
                editable: ko.observable(true),
                validated: ko.observable(),
                moduleName: "bank-guarantee-parties",
                disabled: ko.observable(false)
            },
            {
                stageName: self.resourceBundle.heading.commitmentDetails,
                expanded: ko.observable(false),
                editable: ko.observable(true),
                validated: ko.observable(),
                moduleName: "bank-guarantee-commitment",
                disabled: ko.observable(false)
            },
            {
                stageName: self.resourceBundle.heading.bankInstructions,
                expanded: ko.observable(false),
                editable: ko.observable(true),
                validated: ko.observable(),
                moduleName: "bank-guarantee-instructions",
                disabled: ko.observable(false)
            },
            {
                stageName: self.resourceBundle.heading.guarantee,
                expanded: ko.observable(false),
                editable: ko.observable(true),
                validated: ko.observable(),
                moduleName: "bank-guarantee-contracts",
                disabled: ko.observable(false)
            },
            {
                stageName: self.resourceBundle.heading.attachments,
                expanded: ko.observable(false),
                editable: ko.observable(true),
                validated: ko.observable(),
                moduleName: "attach-documents",
                disabled: ko.observable(false)
            }
        ];
        self.menuItems = [{
            id: "draftSave",
            label: self.resourceBundle.common.labels.draftSave}, {
            id: "templateSave",
            label: self.resourceBundle.common.labels.templateSave
        }];
        self.guaranteeTypeOptions = ko.observable();
        self.dropdownLabels = {
            branch: ko.observable(),
            country: ko.observable(),
            incoterm: ko.observable(),
            product: ko.observable(),
            guaranteeType: ko.observable(),
            beneName: ko.observable()
        };
        self.dropdownListLoaded = {
            branches: ko.observable(false),
            chargingAccounts: ko.observable(false),
            countries: ko.observable(false),
            parties: ko.observable(false),
            products: ko.observable(false),
            beneficiary: ko.observable(false)
        };
        if (self.params && self.params.mode) {
            self.mode(self.params.mode);
            if (self.params.guaranteeDetails.state === "TEMPLATE") {
                self.oldTemplateName(self.params.guaranteeDetails.name);
            } else if (self.params.guaranteeDetails.state === "DRAFT") {
                self.oldDraftName(self.params.guaranteeDetails.name);
            }
        }
        var getNewKoModel = function () {
            var KoModel = GuaranteeModel.getNewModel();
            return ko.mapping.fromJS(KoModel);
        };

        self.rootModelInstance = ko.observable(getNewKoModel());
        self.guaranteeDetails = self.rootModelInstance().TradeFinanceDetails;
        params.baseModel.registerElement("bank-look-up");
        params.baseModel.registerElement("confirm-screen");
        params.baseModel.registerComponent("bank-guarantee-parties", "guarantee");
        params.baseModel.registerComponent("bank-guarantee-commitment", "guarantee");
        params.baseModel.registerComponent("bank-guarantee-instructions", "guarantee");
        params.baseModel.registerComponent("bank-guarantee-contracts", "guarantee");
        params.baseModel.registerComponent("review-guarantee", "guarantee");
        params.baseModel.registerComponent("bank-guarantee-attachments", "guarantee");
        params.baseModel.registerComponent("guarantee-list", "guarantee");
        params.baseModel.registerComponent("attach-documents", "trade-finance");
        params.baseModel.registerElement("floating-panel");
        self.dataLoaded = ko.computed(function () {
            return self.dropdownListLoaded.branches() && self.dropdownListLoaded.chargingAccounts() && self.dropdownListLoaded.beneficiary() && self.dropdownListLoaded.parties();
        });
        self.createNewTemplate = function () {
            $("#updateTemplate").hide();
            self.templateName("");
            $("#saveAsDialog").trigger("openModal");
        };
        /* handle desktop more menu */
        self.menuItemSelect = function (data, event) {
            data = event.target.value;
            var menuId = data.id;
            if(menuId === "draftSave"){
              self.saveAsDraft();
            }else if(menuId === "templateSave"){
              self.saveAsTemplate();
            }
        };
        function validate() {
            var validationFlag = true,contractSelected = 0;
            var bgTracker = document.getElementById("bgTracker");
            if (bgTracker.valid === "valid") {
              self.stages[0].validated(true);
            }else {
                self.stages[0].validated(false);
                validationFlag = false;
                bgTracker.showMessages();
                bgTracker.focusOn("@firstInvalidShown");
            }
            var commitmentTracker = document.getElementById("commitmentTracker");
            if (commitmentTracker.valid === "valid") {
              self.stages[1].validated(true);
            }else {
                self.stages[1].validated(false);
                validationFlag = false;
                commitmentTracker.showMessages();
                commitmentTracker.focusOn("@firstInvalidShown");
            }
            var instructionsTracker = document.getElementById("instructionsTracker");
            if (instructionsTracker.valid === "valid") {
              self.stages[2].validated(true);
            }else {
                self.stages[2].validated(false);
                validationFlag = false;
                instructionsTracker.showMessages();
                instructionsTracker.focusOn("@firstInvalidShown");
            }
            var contractsTracker = document.getElementById("contractsTracker");
            if (contractsTracker.valid === "valid") {
              self.stages[3].validated(true);
            }else {
                self.stages[3].validated(false);
                validationFlag = false;
                contractsTracker.showMessages();
                contractsTracker.focusOn("@firstInvalidShown");
            }
            for (var i = 0; i < self.contractsList().length; i++) {
                if(self.contractsList()[i].contractSelected()[0] === "true"){
                  contractSelected++;
                }
            }
            if(contractSelected === 0){
              self.stages[3].validated(false);
              validationFlag = false;
              params.baseModel.showMessages(null, [self.resourceBundle.contractsDetails.errors.selectAdvicesError], "ERROR");
              return;
            }
            self.stages[4].validated(true);
            return validationFlag;
        }
        function triggerAction(actionType, modalName) {
            if (actionType === "DRAFT" && self.updateDraft && self.updateDraft()) {
                self.update();
            } else if (actionType === "TEMPLATE" || actionType === "DRAFT") {
                $(modalName).trigger("openModal");
            } else {
                var parameters = {
                    mode: "REVIEW",
                    guaranteeDetails: ko.mapping.toJS(self.guaranteeDetails)
                };
                params.dashboard.loadComponent("review-guarantee", parameters, self);
            }
        }
        function validateBICCodes(actionType, modalName) {
            if (self.guaranteeDetails.advisingBankCode() !== null && self.guaranteeDetails.advisingBankCode() !== "" && self.additionalBankDetails() === null) {
                GuaranteeModel.getBankDetailsBIC(self.guaranteeDetails.advisingBankCode()).done(function (data) {
                    self.additionalBankDetails(data);
                    self.guaranteeDetails.advisingBankCode(self.additionalBankDetails().code);
                    triggerAction(actionType, modalName);
                }).fail(function () {
                    self.guaranteeDetails.advisingBankCode(null);
                });
            } else {
                triggerAction(actionType, modalName);
            }
        }
        self.saveAsTemplate = function () {
            $("#panelDD").trigger("closeFloatingPanel");
            if (validate()) {
                self.createModelFromArray();
                self.saveAsModalHeader(self.resourceBundle.common.labels.saveTemplate);
                self.guaranteeDetails.state("TEMPLATE");
                self.guaranteeDetails.visibility("PRIVATE");
                var modalName = "#saveAsDialog";
                if (self.updateTemplate && self.updateTemplate()) {
                    modalName = "#updateTemplate";
                    self.templateName(self.guaranteeDetails.name());
                } else {
                    self.templateName("");
                }
                validateBICCodes("TEMPLATE", modalName);
            }
        };
        self.saveAsDraft = function () {
            $("#panelDD").trigger("closeFloatingPanel");
            self.createModelFromArray();
            self.saveAsModalHeader(self.resourceBundle.common.labels.saveDraft);
            self.guaranteeDetails.state("DRAFT");
            if (!(self.updateDraft && self.updateDraft())) {
                self.draftName("");
            }
            var modalName = "#saveAsDialog";
            validateBICCodes("DRAFT", modalName);
        };
        self.confirmDelete = function () {
            $("#panelDD").trigger("closeFloatingPanel");
            if (self.guaranteeDetails.state() === "TEMPLATE") {
                self.deleteModalHeader(self.resourceBundle.common.labels.deleteTemplateHeader);
                self.deleteModalMessage(self.resourceBundle.common.labels.deleteTemplateMessage);
            } else if (self.guaranteeDetails.state() === "DRAFT") {
                self.deleteModalHeader(self.resourceBundle.common.labels.deleteDraftMessage);
                self.deleteModalMessage(self.resourceBundle.common.labels.deleteDraftMessage);
            } else if (self.guaranteeDetails.state() === "INITIATED" && self.componentId() === "TEMPLATES") {
                self.deleteModalHeader(self.resourceBundle.common.labels.deleteTemplateHeader);
                self.deleteModalMessage(self.resourceBundle.common.labels.deleteTemplateMessage);
            } else if (self.guaranteeDetails.state() === "INITIATED" && self.componentId() !== "TEMPLATES") {
                self.deleteModalHeader(self.resourceBundle.common.labels.deleteDraftMessage);
                self.deleteModalMessage(self.resourceBundle.common.labels.deleteDraftMessage);
            }
            $("#deleteTemplate").trigger("openModal");
        };
        self.delete = function () {
            $("#deleteTemplate").hide();
            GuaranteeModel.deleteGuarantee(self.params.guaranteeDetails.bgId).done(function (data) {
                if (data.status.result === "SUCCESSFUL") {
                    var message;
                    if (self.guaranteeDetails.state() === "TEMPLATE") {
                        message = params.baseModel.format(self.resourceBundle.common.labels.templateDeleteMsg, { tempName: self.oldTemplateName() });
                    } else if (self.guaranteeDetails.state() === "DRAFT") {
                        message = params.baseModel.format(self.resourceBundle.common.labels.draftDeleteMsg, { draftName: self.oldDraftName() });
                    }
                    params.baseModel.showMessages(null, [message], "SUCCESS", self.goBack);
                }
            });
        };
        self.goBack = function () {
            delete self.guaranteeDetails;
            params.dashboard.loadComponent("guarantee-list", {}, self);
        };
        self.hideInitiateBG = function(){
            $("#initiateBG").hide();
        };
        self.hideDeleteTemplate =function(){
            $("#deleteTemplate").hide();
        };
        self.createModelFromArray = function () {
            self.guaranteeDetails.attachedDocuments(self.attachedDocuments());
            if (self.deletedDocuments().length > 0) {
                for (var j = 0; j < self.deletedDocuments().length; j++) {
                    GuaranteeModel.deleteDocument(self.deletedDocuments()[j].contentId.value);
                }
            }
            if (self.guaranteeDetails.closureDate() !== null) {
                var date1 = new Date(self.guaranteeDetails.closureDate());
                self.guaranteeDetails.closureDate(oj.IntlConverterUtils.dateToLocalIso(new Date(date1.setHours(0, 0, 0, 0))));
            }
            if (self.guaranteeDetails.expiryDate() !== null) {
                var date2 = new Date(self.guaranteeDetails.expiryDate());
                self.guaranteeDetails.expiryDate(oj.IntlConverterUtils.dateToLocalIso(new Date(date2.setHours(0, 0, 0, 0))));
            }
            self.guaranteeDetails.bankGuaranteeContract.removeAll();
            for (var i = 0; i < self.contractsList().length; i++) {
                if (self.contractsList()[i].contractSelected()[0] === "true") {
                    self.guaranteeDetails.bankGuaranteeContract.push({
                        "contractId": self.contractsList()[i].condition,
                        "description": self.contractsList()[i].description
                    });
                }
            }
        };
        self.initiateBG = function () {
            self.createModelFromArray();
            self.guaranteeDetails.state("INITIATED");
            self.guaranteeDetails.visibility("PRIVATE");
            if (validate()) {
                var tncTracker = document.getElementById("tncTracker");
                if (tncTracker.valid === "valid") {
                  validateBICCodes(self.resourceBundle.labels.initiateBG);
                }else {
                    tncTracker.showMessages();
                    tncTracker.focusOn("@firstInvalidShown");
                }
            }
        };
        self.save = function () {
            $("#panelDD").trigger("closeFloatingPanel");
            if (params.baseModel.showComponentValidationErrors(self.templateNameValidationTracker())) {
                $("#saveAsDialog").hide();
                if (self.guaranteeDetails.state() === "TEMPLATE") {
                    self.oldTemplateName = ko.observable(self.guaranteeDetails.name());
                    self.guaranteeDetails.name(self.templateName());
                } else {
                    self.oldDraftName(self.guaranteeDetails.name());
                    self.guaranteeDetails.name(self.draftName());
                }
                if (self.guaranteeDetails.bgId)
                    delete self.guaranteeDetails.bgId();
                GuaranteeModel.initiateGuarantee(ko.mapping.toJSON(self.guaranteeDetails)).done(function () {
                    if (self.guaranteeDetails.state() === "TEMPLATE") {
                        self.modalHeader(self.resourceBundle.common.labels.templateSaveHeader);
                        self.modalMessage(params.baseModel.format(self.resourceBundle.common.labels.templateSaveMsg, { tempName: self.guaranteeDetails.name() }));
                        $("#initiateBG").trigger("openModal");
                    } else {
                        self.modalHeader(self.resourceBundle.common.labels.draftSaveHeader);
                        self.modalMessage(params.baseModel.format(self.resourceBundle.common.labels.draftSaveMsg, { draftName: self.guaranteeDetails.name() }));
                        $("#initiateBG").trigger("openModal");
                    }
                });
            }
        };
        self.update = function () {
            $("#updateTemplate").hide();
            GuaranteeModel.updateTemplate(self.guaranteeDetails.bgId(), ko.mapping.toJSON(self.guaranteeDetails)).done(function () {
                if (self.guaranteeDetails.state() === "TEMPLATE") {
                    self.modalHeader(self.resourceBundle.common.labels.templateUpdateHeader);
                    self.modalMessage(params.baseModel.format(self.resourceBundle.common.labels.templateUpdateMsg, { tempName: self.guaranteeDetails.name() }));
                    $("#initiateBG").trigger("openModal");
                } else {
                    self.modalHeader(self.resourceBundle.common.labels.draftUpdateHeader);
                    self.modalMessage(params.baseModel.format(self.resourceBundle.common.labels.draftUpdateMsg, { draftName: self.guaranteeDetails.name() }));
                    $("#initiateBG").trigger("openModal");
                }
            });
        };
        self.confirm = function () {
          var hostReferenceNumber = null;
          GuaranteeModel.initiateGuarantee(ko.mapping.toJSON(self.guaranteeDetails)).done(function (data, status, jqXhr) {
              if(data.bankGuarantee)
                  hostReferenceNumber = data.bankGuarantee.bgId;
                params.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXhr,
                    hostReferenceNumber: hostReferenceNumber,
                    transactionName:self.resourceBundle.heading.initiateGuarantee,
                    confirmScreenExtensions: {
                      isSet: true,
                      taskCode: "TF_N_CBG",
                      confirmScreenDetails: self.confirmScreenDetails(),
                      template: "confirm-screen/trade-finance"
                  }
                }, self);
            });
        };
        self.cancel = function () {
            $("#saveAsDialog").hide();
        };
        self.validateInterCode = {
            "validate": function (value) {
                if (value.length < 1) {
                    self.bicCodeError(true);
                } else if (value.length > 20 || !/^[a-zA-Z0-9]+$/.test(value)) {
                    self.bicCodeError(true);
                    throw new oj.ValidatorError("", oj.Translations.getTranslatedString(self.resourceBundle.tradeFinanceErrors.instructionDetails.invalidSwiftId));
                } else {
                    self.bicCodeError(false);
                }
            }
        };
        self.fetchLists = function () {
            GuaranteeModel.fetchProduct().done(function (productData) {
              // This is added to load differnt guaranteeTypes on basis of entities
                if(productData.bgProductDTOList[0].guaranteeTypeConfig){
                  if(productData.bgProductDTOList[0].guaranteeTypeConfig === "Y"){
                    GuaranteeModel.fetchGuranteeType().done(function (typeData) {
                      var guaranteeTypes = typeData.bankGuaranteeTypeDTO.map(function (data) {
                            return {
                                value: data.code,
                                label: data.description
                            };
                        });
                      self.guaranteeTypeOptions(guaranteeTypes);
                    });
                  }else{
                    self.guaranteeTypeOptions = [{
                             label: self.resourceBundle.guaranteeDetails.labels.FINANCIAL,
                             value: "FINANCIAL"
                         },{
                             label: self.resourceBundle.guaranteeDetails.labels.PERFORMANCE,
                             value: "PERFORMANCE"
                         }];
                  }
                }
                var products = productData.bgProductDTOList.map(function (data) {
                    return {
                        value: data.id,
                        label: data.name
                    };
                });
                self.productTypeOptions(products);
                self.dropdownListLoaded.products(true);
            });
            GuaranteeModel.getAccountDetail().done(function (accountData) {
                self.chargesAccountType.removeAll();
                if (accountData.accounts) {
                    accountData.accounts = params.baseModel.sortLib(accountData.accounts, "accountNickname");
                    accountData.accounts.map(function (item) {
                        item.label = self.getDisplayText(item.id.displayValue, item.accountNickname);
                        item.value = item.id.value;
                        return item;
                    });
                    self.chargesAccountList = accountData.accounts;
                    var result = params.baseModel.groupBy(accountData.accounts, [
                        "partyId.value",
                        "module"
                    ], function (item) {
                        return [
                            item.partyName,
                            self.resourceBundle.labels[item.module]
                        ];
                    });
                    if (result.length === 1 && result[0].children.length === 1) {
                        result = [result[0].children[0]];
                    }
                    ko.utils.arrayPushAll(self.chargesAccountType, result);
                }
                self.dropdownListLoaded.chargingAccounts(true);
            });
            GuaranteeModel.fetchBeniCountry().done(function (taskData) {
                var countries = taskData.enumRepresentations[0].data.map(function (data) {
                    return {
                        value: data.code,
                        label: data.description
                    };
                }).filter(function (data) {
                    return data.label && data.value;
                });
                self.beneCountryoptions(countries);
                self.dropdownListLoaded.countries(true);
            });
            GuaranteeModel.fetchBranch().done(function (branchData) {
                var branches = branchData.branchAddressDTO.map(function (data) {
                    return {
                        value: data.id,
                        label: data.branchName
                    };
                });
                self.branchIDoptions(branches);
                self.dropdownListLoaded.branches(true);
            });
            GuaranteeModel.fetchBeneName().done(function (beneData) {
                var beneficiary = beneData.beneficiaryDTOs.map(function (data) {
                    return {
                        value: data.id,
                        label: data.name
                    };
                });
                self.beneNameOptions(beneficiary);
                self.dropdownListLoaded.beneficiary(true);
            });
            GuaranteeModel.fetchParty().done(function (data) {
                GuaranteeModel.fetchPartyRelations().done(function (partyData) {
                    var parties = [];
                    parties.push({
                        label: data.party.id.displayValue,
                        value: data.party.id.value
                    });
                    var mappedParties = partyData.partyToPartyRelationship;
                    for (var i = 0; i < mappedParties.length; i++) {
                        parties.push({
                            value: mappedParties[i].relatedParty.value,
                            label: mappedParties[i].relatedParty.displayValue
                        });
                    }
                    self.partyIDoptions(parties);
                    self.dropdownListLoaded.parties(true);
                });
            });
        };
        self.fetchLists();
        self.getDisplayText = function (accountNumber, nickName) {
            if (nickName) {
                return params.baseModel.format(self.resourceBundle.labels.accountsDropdown, {
                    displayValue: accountNumber,
                    nickname: nickName
                });
            }
                return accountNumber;

        };
        self.termsAndConditions = function () {
            $("#tncDialog").trigger("openModal");
        };
        self.close = function () {
            $("#tncDialog").hide();
        };
        function loadDataIntoModel(obj1, obj2) {
            for (var element in obj2) {
                if (obj2[element] !== null && obj2[element]) {
                    if (obj2[element].constructor === Object) {
                        obj1[element] = loadDataIntoModel(obj1[element], obj2[element]);
                    } else {
                        obj1[element] = obj2[element];
                    }
                }
            }
            return obj1;
        }
        if (self.mode() === "EDIT") {
            for (var i = 0; i < self.stages.length; i++) {
                self.stages[i].editable(true);
                self.stages[i].expanded(true);
                self.stages[i].disabled(true);
            }
            self.deletedDocuments.removeAll();
            self.guaranteeDetails = ko.mapping.fromJS(loadDataIntoModel(ko.toJS(self.guaranteeDetails), ko.toJS(self.params.guaranteeDetails)));
            if (self.guaranteeDetails.attachedDocuments() && self.guaranteeDetails.attachedDocuments().length > 0 && self.guaranteeDetails.attachedDocuments()[0].documentName) {
                self.attachedDocuments(ko.mapping.toJS(self.guaranteeDetails.attachedDocuments()));
            }
        }
        self.showFloatingPanel = function () {
            $("#panelDD").trigger("openFloatingPanel");
        };
        self.openLookup = function () {
            self.clearingCodeType("SWI");
            $("#menuButtonDialog").trigger("openModal");
        };
        self.menuClose = function () {
            $("#mediaFormatLauncher").removeClass("bold");
        };
    };
    vm.prototype.dispose = function () {
        this.dataLoaded.dispose();
    };
    return vm;
});
