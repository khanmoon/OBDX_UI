define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "./model",
    "ojL10n!resources/nls/initiate-lc",
    "ojs/ojaccordion",
    "ojs/ojcollapsible",
    "ojs/ojvalidation",
    "ojs/ojinputtext",
    "ojs/ojradioset",
    "ojs/ojknockout-validation",
    "ojs/ojdatetimepicker",
    "ojs/ojcheckboxset",
    "ojs/ojselectcombobox",
    "ojs/ojvalidationgroup",
    "ojs/ojmenu",
    "ojs/ojoption",
    "ojs/ojbutton"
], function (oj, ko, $, LetterOfCreditModel, locale) {
    "use strict";
    var self, vm = function (params) {
        var i, j, totalGoodsAmount = 0;
        self = this;
        self.mode = ko.observable("CREATE");
        self.confirmScreenDetails = ko.observable();
        self.additionalBankDetails = ko.observable(null);
        self.availableWithDetails = ko.observable(null);
        ko.utils.extend(self, params.rootModel);
        self.resourceBundle = locale;
        self.saveAsModalHeader = ko.observable("");
        self.modalHeader = ko.observable("");
        self.modalMessage = ko.observable("");
        self.deleteModalHeader = ko.observable("");
        self.deleteModalMessage = ko.observable("");
        self.beneIdOptions = ko.observable();
        self.templateName = ko.observable("");
        self.draftName = ko.observable("");
        self.tncValue = ko.observable([]);
        self.bicCodeError = ko.observable(false);
        params.dashboard.headerName(self.resourceBundle.heading.initiateLC);
        params.baseModel.registerElement("bank-look-up");
        params.baseModel.registerElement("confirm-screen");
        params.baseModel.registerComponent("attach-documents", "trade-finance");
        params.baseModel.registerComponent("document-details", "letter-of-credit");
        params.baseModel.registerComponent("instructions-details", "letter-of-credit");
        params.baseModel.registerComponent("lc-details", "letter-of-credit");
        params.baseModel.registerComponent("shipment-details", "letter-of-credit");
        params.baseModel.registerComponent("review-lc", "letter-of-credit");
        params.baseModel.registerElement("floating-panel");
        self.multiGoodsSupported = ko.observable(false);
        /* for validation tracker*/
        self.lcGroupValid = ko.observable();
        self.lcTracker = ko.observable();
        self.shipmentGroupValid = ko.observable();
        self.shipmentTracker = ko.observable();
        self.documentGroupValid = ko.observable();
        self.documentTracker = ko.observable();
        self.insturctionsValidationTracker = ko.observable();
        self.instructionsGroupValid = ko.observable();
        self.tncTracker = ko.observable();
        self.tncGroupValid = ko.observable();
        /**/
        self.datasourceForGoods = ko.observableArray();
        self.goodsArray = ko.observableArray([{
                id: ko.observable(1),
                code: ko.observable(""),
                description: ko.observable(""),
                units: ko.observable(""),
                pricePerUnit: ko.observable("")
        }]);
        self.datasourceForGoods = new oj.ArrayTableDataSource(self.goodsArray, { idAttribute: "id" });
        self.menuItems = [{
                id: "draftSave",
                label: self.resourceBundle.common.labels.draftSave},{
                id: "templateSave",
                label: self.resourceBundle.common.labels.templateSave
            }];
        self.launch = function (model, event) {
            $("#mediaFormatMenu").ojMenu("open", event);
        };
        self.menuClose = function () {
            $("#mediaFormatLauncher").removeClass("bold");
        };
        self.stages = [
            {
                stageName: self.resourceBundle.heading.lcDetails,
                expanded: ko.observable(true),
                editable: ko.observable(true),
                validated: ko.observable(),
                moduleName: "lc-details",
                disabled: ko.observable(false)
            },
            {
                stageName: self.resourceBundle.heading.shipmentDetails,
                expanded: ko.observable(false),
                editable: ko.observable(true),
                validated: ko.observable(),
                moduleName: "shipment-details",
                disabled: ko.observable(false)
            },
            {
                stageName: self.resourceBundle.heading.documents,
                expanded: ko.observable(false),
                editable: ko.observable(true),
                validated: ko.observable(),
                moduleName: "document-details",
                disabled: ko.observable(false)
            },
            {
                stageName: self.resourceBundle.heading.instructions,
                expanded: ko.observable(false),
                editable: ko.observable(true),
                validated: ko.observable(),
                moduleName: "instructions-details",
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
        self.applicantName = ko.observable();
        self.applicantAddress = {
            line1: ko.observable(),
            line2: ko.observable(),
            line3: ko.observable(),
            country: ko.observable()
        };
        self.lookup = ko.observable(false);
        self.clearingCodeType = ko.observable("SWI").extend({ notify: "always" });
        self.networkCode = ko.observable();
        self.docArray = ko.observableArray([]);
        self.attachedDocuments = ko.observableArray();
        self.deletedDocuments = ko.observableArray();
        self.showDocuments = ko.observable(false);
        self.shipmentDatePeriodRadioSetValue = ko.observable("latestdateofShipment");
        if (self.params && self.params.mode) {
            self.mode(self.params.mode);
        }
        self.beneVisibility = ko.observable();
        var getNewKoModel = function () {
            var KoModel = LetterOfCreditModel.getNewModel();
            return ko.mapping.fromJS(KoModel);
        };
        self.rootModelInstance = ko.observable(getNewKoModel());
        self.letterOfCreditDetails = self.rootModelInstance().TradeFinanceDetails;
        function mergeObject(obj1, obj2) {
            for (var element in obj2) {
                if (obj2[element] !== null && obj2[element]) {
                    if (obj2[element].constructor === Object) {
                        obj1[element] = mergeObject(obj1[element], obj2[element]);
                    } else if (element === "draftsRequired" || element === "transferable" || element === "partial" || element === "transShipment" || element === "revolving" || element === "cumulativeFrequency" || element === "autoReinstatement") {
                            obj1[element] = obj2[element].toString();
                        } else {
                            obj1[element] = obj2[element];
                        }
                }
            }
            return obj1;
        }

        self.draftArray = ko.observableArray([{
                id: 1,
                draftAmount: ko.observable(""),
                draftName: ko.observable(""),
                draweeBank: ko.observable(""),
                specifyOthers: ko.observable(""),
                tenor: ko.observable("0")
            }]);
        self.dropdownLabels = {
            branch: ko.observable(),
            country: ko.observable(),
            incoterm: ko.observable(),
            product: ko.observable(),
            counterPartyName: ko.observable()
        };
        self.dropdownListLoaded = {
            branches: ko.observable(false),
            chargingAccounts: ko.observable(false),
            countries: ko.observable(false),
            goods: ko.observable(false),
            incoterm: ko.observable(false),
            parties: ko.observable(false),
            products: ko.observable(false),
            counterPartyNames: ko.observable(false)
        };
        self.tncValidationTracker = ko.observable();
        self.templateNameValidationTracker = ko.observable();
        self.lcDetailsValidationTracker = ko.observable();
        self.shipmentDetailsValidationTracker = ko.observable();
        self.documentsValidationTracker = ko.observable();
        self.insturctionsValidationTracker = ko.observable();
        self.branchIDoptions = ko.observable();
        self.chargesAccountType = ko.observableArray();
        self.chargesAccountList = [];
        self.productTypeOptions = ko.observable();
        self.goodsTypeOptions = ko.observable();
        self.incotermTypeOptions = ko.observable();
        self.beneCountryoptions = ko.observable();
        self.partyIDoptions = ko.observable();
        self.templateType = null;
        self.currencyListOptions = ko.observableArray();
        self.clauseTableArray = ko.observableArray();
        self.minEffectiveDate = ko.observable();
        self.remainingDays = ko.computed(function () {
            if (self.letterOfCreditDetails.applicationDate() !== null && self.letterOfCreditDetails.expiryDate() !== null) {
                var curDate = new Date(self.letterOfCreditDetails.applicationDate());
                var expiryDate = new Date(self.letterOfCreditDetails.expiryDate());
                var daysBeforeExpiryDate = parseInt((expiryDate - curDate) / (1000 * 60 * 60 * 24));
                daysBeforeExpiryDate = daysBeforeExpiryDate + 1;
                return daysBeforeExpiryDate;
            }
                return 365;

        });
        self.dataLoaded = ko.computed(function () {
            return self.dropdownListLoaded.branches() && self.dropdownListLoaded.chargingAccounts() && self.dropdownListLoaded.goods() && self.dropdownListLoaded.incoterm() && self.dropdownListLoaded.parties() && self.dropdownListLoaded.counterPartyNames() && self.dropdownListLoaded.products();
        });

        self.fetchLists = function () {
            LetterOfCreditModel.fetchProduct().done(function (productData) {
                //This is added to show multiple goods if it is of specific entity type
                if(productData.lcProductDTOList.length > 0){
                  if(productData.lcProductDTOList[0].multiGoodsConfig && productData.lcProductDTOList[0].multiGoodsConfig === "Y"){
                    self.multiGoodsSupported(true);
                  }
                }
                var products = productData.lcProductDTOList.map(function (data) {
                    return {
                        value: data.id,
                        label: data.name
                    };
                });
                self.productTypeOptions(products);
                self.dropdownListLoaded.products(true);
            });
            LetterOfCreditModel.fetchBeneName().done(function (beneData) {
                var beneficiary = beneData.beneficiaryDTOs.map(function (data) {
                    return {
                        value: data.id,
                        label: data.name
                    };
                });
                self.beneIdOptions(beneficiary);
                self.dropdownListLoaded.counterPartyNames(true);
            });
            LetterOfCreditModel.fetchGoods().done(function (goodsData) {
                var goods = goodsData.goodsList.map(function (data) {
                    return {
                        description: data.description,
                        value: data.code,
                        label: data.code
                    };
                });
                self.goodsTypeOptions(goods);
                self.dropdownListLoaded.goods(true);
            });
            LetterOfCreditModel.getAccountDetail().done(function (accountData) {
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
            LetterOfCreditModel.fetchIncoterm().done(function (incotermData) {
                var incotermList = incotermData.incotermList.map(function (data) {
                    return {
                        value: data.code,
                        label: data.description
                    };
                });
                self.incotermTypeOptions(incotermList);
                self.dropdownListLoaded.incoterm(true);
            });
            LetterOfCreditModel.fetchBeniCountry().done(function (taskData) {
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
            LetterOfCreditModel.fetchBranch().done(function (branchData) {
                var branches = branchData.branchAddressDTO.map(function (data) {
                    return {
                        value: data.id,
                        label: data.branchName
                    };
                });
                self.branchIDoptions(branches);
                self.dropdownListLoaded.branches(true);
            });
            LetterOfCreditModel.fetchParty().done(function (data) {
                LetterOfCreditModel.fetchPartyRelations().done(function (partyData) {
                    var parties = [];
                    parties.push({
                        label: data.party.id.displayValue,
                        value: data.party.id.value
                    });
                    var mappedParties = partyData.partyToPartyRelationship;
                    for (i = 0; i < mappedParties.length; i++) {
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
        self.changeTemplateType = function (event) {
            if (event.detail.value === "PUBLIC") {
                self.letterOfCreditDetails.visibility("PUBLIC");
            } else {
                self.letterOfCreditDetails.visibility("PRIVATE");
            }
        };
        self.createModelFromArray = function () {
            self.letterOfCreditDetails.attachedDocuments(self.attachedDocuments());
            if (self.deletedDocuments().length > 0) {
                for (j = 0; j < self.deletedDocuments().length; j++) {
                    LetterOfCreditModel.deleteDocument(self.deletedDocuments()[j].contentId.value);
                }
            }
            self.letterOfCreditDetails.billingDrafts.removeAll();
            self.letterOfCreditDetails.document.removeAll();
            if (self.letterOfCreditDetails.draftsRequired() === "true") {
                for (i = 0; i < self.draftArray().length; i++) {
                    self.letterOfCreditDetails.billingDrafts.push({
                        "tenor": self.draftArray()[i].tenor(),
                        "amount": {
                            "currency": self.letterOfCreditDetails.amount.currency(),
                            "amount": self.draftArray()[i].draftAmount()
                        },
                        "otherInformation": self.draftArray()[i].specifyOthers(),
                        "draweeBankId": self.draftArray()[i].draweeBank()
                    });
                }
            }
            for (i = 0; i < self.docArray().length; i++) {
                var selectedClauses = [];
                if (self.docArray()[i].docSelected()[0] === "true") {
                    for (j = 0; j < self.docArray()[i].clause.length; j++) {
                        if (self.docArray()[i].clause[j].selected()[0] === "true") {
                            selectedClauses.push({
                                "id": self.docArray()[i].clause[j].id,
                                "description": self.docArray()[i].clause[j].description(),
                                "name": self.docArray()[i].clause[j].name
                            });
                        }
                    }
                    if (selectedClauses.length > 0) {
                        self.letterOfCreditDetails.document.push({
                            "id": self.docArray()[i].id,
                            "name": self.docArray()[i].name,
                            "originals": self.docArray()[i].originals() + "/" + self.docArray()[i].originalsOutOff(),
                            "copies": self.docArray()[i].copies(),
                            "clause": selectedClauses,
                            "docType": self.docArray()[i].docType
                        });
                    } else {
                        self.letterOfCreditDetails.document.push({
                            "id": self.docArray()[i].id,
                            "name": self.docArray()[i].name,
                            "originals": self.docArray()[i].originals() + "/" + self.docArray()[i].originalsOutOff(),
                            "copies": self.docArray()[i].copies(),
                            "docType": self.docArray()[i].docType
                        });
                    }
                }
            }

            self.letterOfCreditDetails.goods.removeAll();
            if (self.multiGoodsSupported() === false) {
              self.letterOfCreditDetails.goods.push({
                "code" : self.letterOfCreditDetails.shipmentDetails.goodsCode(),
                "description" : self.letterOfCreditDetails.shipmentDetails.description(),
                "noOfUnits" : null,
                "pricePerUnit" : null
              });
            }else{
              for (i = 0; i < self.goodsArray().length; i++) {
                  if(self.goodsArray()[i].code() !== ""){
                    self.letterOfCreditDetails.goods.push({
                        "code": self.goodsArray()[i].code(),
                        "description": self.goodsArray()[i].description(),
                        "noOfUnits": self.goodsArray()[i].units() !== "" ? self.goodsArray()[i].units() : null,
                        "pricePerUnit": self.goodsArray()[i].pricePerUnit() !== "" ? self.goodsArray()[i].pricePerUnit() : null
                    });
                  }
                }
            }
        };
        function validate() {
            var validationFlag = true;
            var lcTracker = document.getElementById("lcTracker");
            if (lcTracker.valid === "valid") {
              self.stages[0].validated(true);
            }else {
                self.stages[0].validated(false);
                validationFlag = false;
                lcTracker.showMessages();
                lcTracker.focusOn("@firstInvalidShown");
            }
            var shipmentTracker = document.getElementById("shipmentTracker");
            if (shipmentTracker.valid === "valid") {
              self.stages[1].validated(true);
            }else {
                self.stages[1].validated(false);
                validationFlag = false;
                shipmentTracker.showMessages();
                shipmentTracker.focusOn("@firstInvalidShown");
            }
            var documentTracker = document.getElementById("documentTracker");
            if (documentTracker.valid === "valid") {
              self.stages[2].validated(true);
            }else {
                self.stages[2].validated(false);
                validationFlag = false;
                documentTracker.showMessages();
                documentTracker.focusOn("@firstInvalidShown");
            }
            var insturctionsValidationTracker = document.getElementById("insturctionsValidationTracker");
            if (insturctionsValidationTracker.valid === "valid") {
              self.stages[3].validated(true);
            }else {
                self.stages[3].validated(false);
                validationFlag = false;
                insturctionsValidationTracker.showMessages();
                insturctionsValidationTracker.focusOn("@firstInvalidShown");
            }
            self.stages[4].validated(true);
            return validationFlag;
        }
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
        self.openLookup = function () {
            self.clearingCodeType("SWI");
            $("#menuButtonDialog").trigger("openModal");
        };
        function triggerAction(actionType, modalName) {
            if (actionType === "DRAFT" && self.updateDraft && self.updateDraft()) {
                self.update();
            } else if (actionType === "TEMPLATE" || actionType === "DRAFT") {
                $(modalName).trigger("openModal");
            } else {
                var parameters = {
                    mode: "REVIEW",
                    letterOfCreditDetails: ko.mapping.toJS(self.letterOfCreditDetails)
                };
                params.dashboard.loadComponent("review-lc", parameters, self);
            }
        }
        function validateBICCodes(actionType, modalName) {
            if (self.letterOfCreditDetails.availableWith() !== null && self.letterOfCreditDetails.availableWith() !== "" && self.availableWithDetails() === null) {
                LetterOfCreditModel.getBankDetailsBIC(self.letterOfCreditDetails.availableWith()).done(function (data) {
                    self.availableWithDetails(data);
                    self.letterOfCreditDetails.availableWith(self.availableWithDetails().code);
                    if (self.letterOfCreditDetails.swiftId() !== null && self.letterOfCreditDetails.swiftId() !== "" && self.additionalBankDetails() === null) {
                        LetterOfCreditModel.getBankDetailsBIC(self.letterOfCreditDetails.swiftId()).done(function (data) {
                            self.additionalBankDetails(data);
                            self.letterOfCreditDetails.swiftId(self.additionalBankDetails().code);
                            triggerAction(actionType, modalName);
                        }).fail(function () {
                            self.letterOfCreditDetails.swiftId(null);
                        });
                    } else {
                        triggerAction(actionType, modalName);
                    }
                }).fail(function () {
                    self.letterOfCreditDetails.availableWith(null);
                });
            } else if (self.letterOfCreditDetails.swiftId() !== null && self.letterOfCreditDetails.swiftId() !== "" && self.additionalBankDetails() === null) {
                LetterOfCreditModel.getBankDetailsBIC(self.letterOfCreditDetails.swiftId()).done(function (data) {
                    self.additionalBankDetails(data);
                    self.letterOfCreditDetails.swiftId(self.additionalBankDetails().code);
                    triggerAction(actionType, modalName);
                }).fail(function () {
                    self.letterOfCreditDetails.swiftId(null);
                });
            } else {
                triggerAction(actionType, modalName);
            }
        }
        self.initiateLC = function () {
            if (self.multiGoodsSupported() === true) {
              totalGoodsAmount = 0;
              for (i = 0; i < self.goodsArray().length; i++) {
                  totalGoodsAmount = totalGoodsAmount + (self.goodsArray()[i].units() * self.goodsArray()[i].pricePerUnit());
              }
              if(totalGoodsAmount > 0 && (totalGoodsAmount !== self.letterOfCreditDetails.amount.amount())){
                params.baseModel.showMessages(null, [self.resourceBundle.tradeFinanceErrors.shipmentDetails.invalidGoodsAmount], "ERROR");
                return;
              }
            }
            self.createModelFromArray();
            self.letterOfCreditDetails.state("INITIATED");
            self.letterOfCreditDetails.paymentClause("RED");
            self.letterOfCreditDetails.visibility("PRIVATE");

            if (validate()) {
                var tncTracker = document.getElementById("tncTracker");
                if (tncTracker.valid === "valid") {
                  validateBICCodes(self.resourceBundle.labels.initiateLC);
                }else {
                    tncTracker.showMessages();
                    tncTracker.focusOn("@firstInvalidShown");
                }
            }
        };

        if (self.mode() === "EDIT") {
          self.letterOfCreditDetails = ko.mapping.fromJS(mergeObject(ko.toJS(self.letterOfCreditDetails), ko.toJS(self.params.letterOfCreditDetails)));
            for (i = 0; i < self.stages.length; i++) {
                self.stages[i].editable(true);
                self.stages[i].expanded(true);
                self.stages[i].disabled(true);
            }
            self.deletedDocuments.removeAll();

            if (self.letterOfCreditDetails.attachedDocuments() && self.letterOfCreditDetails.attachedDocuments().length > 0) {
                self.attachedDocuments(ko.mapping.toJS(self.letterOfCreditDetails.attachedDocuments()));
            }
            if(self.letterOfCreditDetails.goods && self.letterOfCreditDetails.goods().length > 0){
                self.goodsArray.removeAll();
                for (i = 0; i < self.letterOfCreditDetails.goods().length; i++) {
                    self.goodsArray.push({
                      id: ko.observable(i+1),
                      code: ko.observable(self.letterOfCreditDetails.goods()[i].code()),
                      description: ko.observable(self.letterOfCreditDetails.goods()[i].description()),
                      units: self.letterOfCreditDetails.goods()[i].noOfUnits ? ko.observable(self.letterOfCreditDetails.goods()[i].noOfUnits()) : ko.observable(null),
                      pricePerUnit: self.letterOfCreditDetails.goods()[i].pricePerUnit ? ko.observable(self.letterOfCreditDetails.goods()[i].pricePerUnit()) : ko.observable(null)
                    });
                }
                self.datasourceForGoods = new oj.ArrayTableDataSource(self.goodsArray, { idAttribute: "id" });
            }
        }
        self.hideInitiateLC = function(){
          $("#initiateLC").hide();
        };
        self.hideDeleteTemplate = function(){
          $("#deleteTemplate").hide();
        };
        self.createNewTemplate = function () {
            $("#updateTemplate").hide();
            self.templateName("");
            $("#saveAsDialog").trigger("openModal");
        };
        self.saveAsTemplate = function () {
            if (self.multiGoodsSupported() === true) {
              totalGoodsAmount = 0;
              for (i = 0; i < self.goodsArray().length; i++) {
                  totalGoodsAmount = totalGoodsAmount + (self.goodsArray()[i].units() * self.goodsArray()[i].pricePerUnit());
              }
              if(totalGoodsAmount > 0 && (totalGoodsAmount !== self.letterOfCreditDetails.amount.amount())){
                params.baseModel.showMessages(null, [self.resourceBundle.tradeFinanceErrors.shipmentDetails.invalidGoodsAmount], "ERROR");
                return;
              }
            }
            $("#panelDD").trigger("closeFloatingPanel");
            if (validate()) {
                self.createModelFromArray();
                self.saveAsModalHeader(self.resourceBundle.common.labels.saveTemplate);
                self.letterOfCreditDetails.state("TEMPLATE");
                self.letterOfCreditDetails.paymentClause("RED");
                var modalName = "#saveAsDialog";
                if (self.updateTemplate && self.updateTemplate()) {
                    modalName = "#updateTemplate";
                    self.templateName(self.letterOfCreditDetails.name());
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
            self.letterOfCreditDetails.state("DRAFT");
            if (!(self.updateDraft && self.updateDraft())) {
                self.draftName("");
            }
            var modalName = "#saveAsDialog";
            validateBICCodes("DRAFT", modalName);
        };
        self.save = function () {
            $("#panelDD").trigger("closeFloatingPanel");
            if (params.baseModel.showComponentValidationErrors(self.templateNameValidationTracker())) {
                $("#saveAsDialog").hide();
                if (self.letterOfCreditDetails.state() === "TEMPLATE") {
                    self.letterOfCreditDetails.name(self.templateName());
                } else {
                    self.letterOfCreditDetails.name(self.draftName());
                }
                LetterOfCreditModel.initiateLC(ko.mapping.toJSON(self.letterOfCreditDetails)).done(function () {
                    if (self.letterOfCreditDetails.state() === "TEMPLATE") {
                        self.modalHeader(self.resourceBundle.common.labels.templateSaveHeader);
                        self.modalMessage(params.baseModel.format(self.resourceBundle.common.labels.templateSaveMsg, { tempName: self.letterOfCreditDetails.name() }));
                        $("#initiateLC").trigger("openModal");
                    } else {
                        self.modalHeader(self.resourceBundle.common.labels.draftSaveHeader);
                        self.modalMessage(params.baseModel.format(self.resourceBundle.common.labels.draftSaveMsg, { draftName: self.letterOfCreditDetails.name() }));
                        $("#initiateLC").trigger("openModal");
                    }
                });
            }
        };
        self.update = function () {
            $("#updateTemplate").hide();
            LetterOfCreditModel.updateTemplate(self.letterOfCreditDetails.id(), ko.mapping.toJSON(self.letterOfCreditDetails)).done(function () {
                if (self.letterOfCreditDetails.state() === "TEMPLATE") {
                    self.modalHeader(self.resourceBundle.common.labels.templateUpdateHeader);
                    self.modalMessage(params.baseModel.format(self.resourceBundle.common.labels.templateUpdateMsg, { tempName: self.letterOfCreditDetails.name() }));
                    $("#initiateLC").trigger("openModal");
                } else {
                    self.modalHeader(self.resourceBundle.common.labels.draftUpdateHeader);
                    self.modalMessage(params.baseModel.format(self.resourceBundle.common.labels.draftUpdateMsg, { draftName: self.letterOfCreditDetails.name() }));
                    $("#initiateLC").trigger("openModal");
                }
            });
        };
        self.confirm = function () {
          var hostReferenceNumber = null;
            LetterOfCreditModel.initiateLC(ko.mapping.toJSON(self.letterOfCreditDetails)).done(function (data, status, jqXhr) {
              if (data.letterOfCredit) {
                        hostReferenceNumber = data.letterOfCredit.id;
                    }
                params.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXhr,
                    hostReferenceNumber: hostReferenceNumber,
                    transactionName:self.resourceBundle.heading.initiateLC,
                    confirmScreenExtensions: {
                      isSet: true,
                      taskCode: "TF_N_CLC",
                      confirmScreenDetails: self.confirmScreenDetails(),
                      template: "confirm-screen/trade-finance"
                  }
                }, self);
            });
        };
        self.confirmDelete = function () {
            $("#panelDD").trigger("closeFloatingPanel");
            if (self.letterOfCreditDetails.state() === "TEMPLATE") {
                self.deleteModalHeader(self.resourceBundle.common.labels.deleteTemplateHeader);
                self.deleteModalMessage(self.resourceBundle.common.labels.deleteTemplateMessage);
            } else if (self.letterOfCreditDetails.state() === "DRAFT") {
                self.deleteModalHeader(self.resourceBundle.common.labels.deleteDraftHeader);
                self.deleteModalMessage(self.resourceBundle.common.labels.deleteDraftMessage);
            } else if (self.letterOfCreditDetails.state() === "INITIATED" && self.compName() === "template-list") {
                self.deleteModalHeader(self.resourceBundle.common.labels.deleteTemplateHeader);
                self.deleteModalMessage(self.resourceBundle.common.labels.deleteTemplateMessage);
            } else if (self.letterOfCreditDetails.state() === "INITIATED" && self.compName() !== "template-list") {
                self.deleteModalHeader(self.resourceBundle.common.labels.deleteDraftMessage);
                self.deleteModalMessage(self.resourceBundle.common.labels.deleteDraftMessage);
            }
            $("#deleteTemplate").trigger("openModal");
        };
        self.delete = function () {
            $("#deleteTemplate").hide();
            LetterOfCreditModel.deleteLC(self.params.letterOfCreditDetails.id).done(function (data) {
                if (data.status.result === "SUCCESSFUL") {
                    var message;
                    if (self.letterOfCreditDetails.state() === "TEMPLATE") {
                        message = params.baseModel.format(self.resourceBundle.common.labels.templateDeleteMsg, { tempName: self.letterOfCreditDetails.name() });
                    } else if (self.letterOfCreditDetails.state() === "DRAFT") {
                        message = params.baseModel.format(self.resourceBundle.common.labels.draftDeleteMsg, { draftName: self.letterOfCreditDetails.name() });
                    }
                    params.baseModel.showMessages(null, [message], "SUCCESS", self.goBack);
                }
            });
        };

        self.menuItemSelect = function (data, event) {
            data = event.target.value;
            var menuId = data.id;
            if(menuId === "draftSave"){
              self.saveAsDraft();
            }else if(menuId === "templateSave"){
              self.saveAsTemplate();
            }
        };

        self.cancel = function () {
            $("#saveAsDialog").hide();
        };
        self.goBack = function () {
            delete self.letterOfCreditDetails;
            params.dashboard.loadComponent("lc-nav-bar", {}, self);
        };
        self.termsAndConditions = function () {
            $("#tncDialog").trigger("openModal");
        };
        self.close = function () {
            $("#tncDialog").hide();
        };
        self.showFloatingPanel = function () {
            $("#panelDD").trigger("openFloatingPanel");
        };
    };
    vm.prototype.dispose = function () {
        self.remainingDays.dispose();
        self.dataLoaded.dispose();
    };
    return vm;
});
