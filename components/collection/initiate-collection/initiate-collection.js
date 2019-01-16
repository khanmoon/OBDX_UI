define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "./model",
    "ojL10n!resources/nls/initiate-collection",
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
    "ojs/ojcube",
    "ojs/ojdatagrid",
    "ojs/ojswitch",
    "ojs/ojpagingcontrol",
    "ojs/ojpagingdatagriddatasource"
], function (oj, ko, $, CollectionModel, resourceBundle) {
    "use strict";
    var self,vm = function (params) {
        self = this;
        var j,totalGoodsAmount;
        self.mode = ko.observable("CREATE");
        self.confirmScreenDetails = ko.observable();
        ko.utils.extend(self, params.rootModel);
        self.resourceBundle = resourceBundle;
        params.dashboard.headerName(self.resourceBundle.heading.collectionInitiation);
        var getNewKoModel = function () {
            var KoModel = CollectionModel.getNewModel();
            return ko.mapping.fromJS(KoModel);
        };
        self.rootModelInstance = ko.observable(getNewKoModel());
        self.collectionDetails = self.rootModelInstance().CollectionDetails;
        self.bicCodeError = ko.observable(false);
        self.lookup = ko.observable(false);
        self.counterPartyNameOptions = ko.observable();
        self.dropdownListLoaded = {
            parties: ko.observable(false),
            countries: ko.observable(false),
            branches: ko.observable(false),
            goods: ko.observable(false),
            productList: ko.observable(false),
            incoterm: ko.observable(false),
            beneficiary: ko.observable(false),
            baseDateDescriptionList: ko.observable(false)
        };
        self.saveAsModalHeader = ko.observable("");
        self.modalHeader = ko.observable("");
        self.modalMessage = ko.observable("");
        self.deleteModalHeader = ko.observable("");
        self.deleteModalMessage = ko.observable("");
        self.templateName = ko.observable("");
        self.draftName = ko.observable("");
        self.partyId = ko.observable();
        self.partyIdoptions = ko.observableArray();
        self.instructionDetails = ko.observableArray();
        self.tenorDisabled = ko.observable(false);
        self.lcDetails = ko.observable(null);
        self.maxTenor = ko.observable();
        self.minTenor = ko.observable();
        self.attachedDocuments = ko.observableArray();
        self.deletedDocuments = ko.observableArray();
        self.beneVisibility = ko.observable();
        self.tncValue = ko.observable([]);
        params.baseModel.registerElement("bank-look-up");
        params.baseModel.registerElement("confirm-screen");
        params.baseModel.registerComponent("lc-lookup", "trade-finance");
        params.baseModel.registerComponent("attach-documents", "trade-finance");
        params.baseModel.registerComponent("collection-filters", "collection");
        params.baseModel.registerComponent("collection-details", "collection");
        params.baseModel.registerComponent("bill-details", "collection");
        params.baseModel.registerComponent("collection-documents", "collection");
        params.baseModel.registerComponent("collection-instructions", "collection");
        params.baseModel.registerComponent("review-collection", "collection");
        params.baseModel.registerComponent("list-collection", "collection");
        params.baseModel.registerElement("floating-panel");
        self.stages = [
            {
                stageName: self.resourceBundle.heading.parties,
                expanded: ko.observable(true),
                editable: ko.observable(true),
                validated: ko.observable(),
                moduleName: "collection-details",
                disabled: ko.observable(false),
                visible: ko.observable("true")
            },
            {
                stageName: self.resourceBundle.heading.shipmentDetails,
                expanded: ko.observable(false),
                editable: ko.observable(true),
                validated: ko.observable(),
                moduleName: "bill-details",
                disabled: ko.observable(false),
                visible: ko.observable("true")
            },
            {
                stageName: self.resourceBundle.heading.documents,
                expanded: ko.observable(false),
                editable: ko.observable(true),
                validated: ko.observable(),
                moduleName: "collection-documents",
                disabled: ko.observable(false),
                visible: ko.observable("false")
            },
            {
                stageName: self.resourceBundle.heading.instructions,
                expanded: ko.observable(false),
                editable: ko.observable(true),
                validated: ko.observable(),
                moduleName: "collection-instructions",
                disabled: ko.observable(false),
                visible: ko.observable("true")
            },
            {
                stageName: self.resourceBundle.heading.attachments,
                expanded: ko.observable(false),
                editable: ko.observable(true),
                validated: ko.observable(),
                moduleName: "attach-documents",
                disabled: ko.observable(false),
                visible: ko.observable("true")
            }
        ];
        self.applicantName = ko.observable();
        self.applicantAddress = {
            line1: ko.observable(),
            line2: ko.observable(),
            line3: ko.observable(),
            country: ko.observable()
        };
        self.networkCode = ko.observable();
        self.clearingCodeType = ko.observable("SWI").extend({ notify: "always" });
        self.networkCode = ko.observable();
        self.additionalBankDetails = ko.observable(null);
        self.draweeCountry = ko.observable();
        self.draweeCountryoptions = ko.observable();
        self.baseDtDescriptionOptions = ko.observable();
        self.dropdownLabels = {
            branch: ko.observable(),
            country: ko.observable(),
            product: ko.observable(),
            incoterm: ko.observable(),
            baseDateDescription: ko.observable()
        };
        self.collectionDetailsValidationTracker = ko.observable();
        self.billDetailsValidationTracker = ko.observable();
        self.instructionDetailValidationTracker = ko.observable();
        self.documentsValidationTracker = ko.observable();
        self.filterValidationTracker = ko.observable();
        self.tncValidationTracker = ko.observable();
        self.templateNameValidationTracker = ko.observable();
        self.currency = ko.observable(null);
        self.productListForCollections = ko.observableArray();
        self.branchId = ko.observable();
        self.branchIdOptions = ko.observable();
        self.incotermValue = ko.observable();
        self.incotermOptions = ko.observable();
        self.productId = ko.observable();
        self.goodsCode = ko.observable("");
        self.productTypeOptions = ko.observable();
        self.docArray = ko.observableArray([]);
        self.clauseTableArray = ko.observableArray();
        self.dataSourceForCube = ko.observable();
        self.showDocuments = ko.observable(false);
        self.currencyListOptions = ko.observableArray();
        self.multiGoodsSupported = ko.observable(false);
        self.baseDateCode = ko.observable();
        self.goodsTypeOptions = ko.observable();
        /* for Validation Groups*/
        self.collectionValidationTracker = ko.observable();
        self.collectionGroupValid = ko.observable();
        self.billsValidationTracker = ko.observable();
        self.billsGroupValid = ko.observable();
        self.docValidationTracker = ko.observable();
        self.documentsGroupValid = ko.observable();
        self.instructionsValidationTracker = ko.observable();
        self.instructionsGroupValid = ko.observable();
        self.filterTracker = ko.observable();
        self.filterGroupValid = ko.observable();
        self.tncTracker = ko.observable();
        self.tncGroupValid = ko.observable();
        self.menuItems = [{
                id: "draftSave",
                label: self.resourceBundle.common.labels.draftSave},{
                id: "templateSave",
                label: self.resourceBundle.common.labels.templateSave
            }];
        self.datasourceForGoods = ko.observableArray();
        self.goodsArray = ko.observableArray([{
                id: ko.observable(1),
                goodsCode: ko.observable(""),
                description: ko.observable(""),
                units: ko.observable(""),
                pricePerUnit: ko.observable("")
        }]);
        self.datasourceForGoods = new oj.ArrayTableDataSource(self.goodsArray, { idAttribute: "id" });
        if (self.params && self.params.mode) {
            self.mode(self.params.mode);
        }
        self.filterValues = {
            paymentType: ko.observable("SIGHT"),
            docAttached: ko.observable("false"),
            lcLinked: ko.observable("false"),
            lcNumber: ko.observable()
        };
        function triggerAction(actionType, modalName) {
            if (actionType === "DRAFT" && self.updateDraft && self.updateDraft()) {
                self.update();
            } else if (actionType === "TEMPLATE" || actionType === "DRAFT") {
                $(modalName).trigger("openModal");
            } else {
                var parameters = {
                    mode: "REVIEW",
                    collectionDetails: ko.mapping.toJS(self.collectionDetails)
                };
                params.dashboard.loadComponent("review-collection", parameters, self);
            }
        }
        function loadDataIntoModel(obj1, obj2) {
            for (var element in obj2) {
                if (obj2[element] && obj2[element] !== null) {
                    if (obj2[element].constructor === Object) {
                        obj1[element] = loadDataIntoModel(obj1[element], obj2[element]);
                    } else {
                        obj1[element] = obj2[element];
                    }
                }
            }
            return obj1;
        }
        function validate() {
            var validationFlag = true;
            var filterTracker = document.getElementById("filterTracker");
            if (filterTracker.valid !== "valid") {
                validationFlag = false;
                filterTracker.showMessages();
                filterTracker.focusOn("@firstInvalidShown");
            }

            var collectionValidationTracker = document.getElementById("collectionValidationTracker");
            if (collectionValidationTracker.valid === "valid") {
              self.stages[0].validated(true);
            }else {
                self.stages[0].validated(false);
                validationFlag = false;
                collectionValidationTracker.showMessages();
                collectionValidationTracker.focusOn("@firstInvalidShown");
            }

            var billsValidationTracker = document.getElementById("billsValidationTracker");
            if (billsValidationTracker.valid === "valid") {
              self.stages[1].validated(true);
            }else {
                self.stages[1].validated(false);
                validationFlag = false;
                billsValidationTracker.showMessages();
                billsValidationTracker.focusOn("@firstInvalidShown");
            }

            var docValidationTracker = document.getElementById("docValidationTracker");
            if(docValidationTracker){
              if (docValidationTracker.valid === "valid") {
                  self.stages[2].validated(true);
              }else {
                  self.stages[2].validated(false);
                  validationFlag = false;
                  docValidationTracker.showMessages();
                  docValidationTracker.focusOn("@firstInvalidShown");
              }
            }

            var instructionsValidationTracker = document.getElementById("instructionsValidationTracker");
            if (instructionsValidationTracker.valid === "valid") {
                self.stages[3].validated(true);
            }else {
                self.stages[3].validated(false);
                validationFlag = false;
                instructionsValidationTracker.showMessages();
                instructionsValidationTracker.focusOn("@firstInvalidShown");
            }
            self.stages[4].validated(true);
            return validationFlag;
        }
        function createModelFromArray() {
            self.collectionDetails.attachedDocuments(self.attachedDocuments());
            if (self.deletedDocuments().length > 0) {
                for (j = 0; j < self.deletedDocuments().length; j++) {
                    CollectionModel.deleteDocument(self.deletedDocuments()[j].contentId.value);
                }
            }
            self.collectionDetails.instructions.removeAll();
            self.collectionDetails.document.removeAll();
            for (var k = 0; k < self.instructionDetails().length; k++) {
                if (self.instructionDetails()[k].instructionSelected()[0] === "true") {
                    self.collectionDetails.instructions.push({
                        "instructionCode": self.instructionDetails()[k].code,
                        "instructionDesc": self.instructionDetails()[k].description()
                    });
                }
            }
            if (self.filterValues.docAttached() === "true") {
                for (var i = 0; i < self.docArray().length; i++) {
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
                            self.collectionDetails.document.push({
                                "id": self.docArray()[i].id,
                                "name": self.docArray()[i].docName,
                                "originals": self.docArray()[i].originals() + "/" + self.docArray()[i].originalsOutOff(),
                                "copies": self.docArray()[i].copies(),
                                "secondOriginals": self.docArray()[i].secondOriginals() + "/" + self.docArray()[i].secondOriginalsOutOff(),
                                "secondCopies": self.docArray()[i].secondCopies(),
                                "docType": self.docArray().docType,
                                "clause": selectedClauses
                            });
                        } else {
                            self.collectionDetails.document.push({
                                "id": self.docArray()[i].id,
                                "name": self.docArray()[i].docName,
                                "originals": self.docArray()[i].originals() + "/" + self.docArray()[i].originalsOutOff(),
                                "copies": self.docArray()[i].copies(),
                                "secondOriginals": self.docArray()[i].secondOriginals() + "/" + self.docArray()[i].secondOriginalsOutOff(),
                                "secondCopies": self.docArray()[i].secondCopies(),
                                "docType": self.docArray().docType
                            });
                        }
                    }
                }
            }
            self.collectionDetails.goods.removeAll();
            if (self.multiGoodsSupported() === false) {
              self.collectionDetails.goods.push({
                "code" : self.collectionDetails.shipmentDetails.goodsCode(),
                "description" : self.collectionDetails.shipmentDetails.description(),
                "noOfUnits" : null,
                "pricePerUnit" : null
              });
            }else{
              for (i = 0; i < self.goodsArray().length; i++) {
                  if(self.goodsArray()[i].goodsCode() !== ""){
                    self.collectionDetails.goods.push({
                        "code": self.goodsArray()[i].goodsCode(),
                        "description": self.goodsArray()[i].description(),
                        "noOfUnits": self.goodsArray()[i].units() !=="" ? self.goodsArray()[i].units() : null,
                        "pricePerUnit": self.goodsArray()[i].pricePerUnit() !=="" ? self.goodsArray()[i].pricePerUnit() : null
                    });
                  }
              }
            }
        }
        function validateBICCodes(actionType, modalName) {
            if (self.filterValues.lcLinked() === "true" && self.lcDetails() === null) {
                CollectionModel.getLcDetails(self.filterValues.lcNumber()).done(function (data) {
                    self.filterValues.lcNumber(data.letterOfCredit.id);
                    self.collectionDetails.lcRefNo(data.letterOfCredit.id);
                    self.collectionDetails.lcCustomer.displayValue(data.letterOfCredit.partyId.displayValue);
                    self.collectionDetails.lcCustomer.value(data.letterOfCredit.partyId.value);
                    if (self.collectionDetails.swiftId() !== null && self.collectionDetails.swiftId() !== "" && self.additionalBankDetails() === null) {
                        CollectionModel.getBankDetailsBIC(self.collectionDetails.swiftId()).done(function (data) {
                            self.additionalBankDetails(data);
                            self.collectionDetails.swiftId(self.additionalBankDetails().code);
                            self.collectionDetails.bankName(data.name);
                            self.collectionDetails.bankAddress.line1(data.branchAddress.line1);
                            self.collectionDetails.bankAddress.line2(data.branchAddress.line2);
                            self.collectionDetails.bankAddress.line3(data.branchAddress.line3);
                            self.collectionDetails.bankAddress.country(data.branchAddress.country);
                            triggerAction(actionType, modalName);
                        }).fail(function () {
                            self.collectionDetails.swiftId(null);
                        });
                    } else {
                        triggerAction(actionType, modalName);
                    }
                }).fail(function () {
                    self.filterValues.lcNumber(null);
                    self.collectionDetails.lcRefNo(null);
                    self.collectionDetails.lcCustomer.displayValue(null);
                    self.collectionDetails.lcCustomer.value(null);
                });
            } else if (self.collectionDetails.swiftId() !== null && self.collectionDetails.swiftId() !== "" && self.additionalBankDetails() === null) {
                CollectionModel.getBankDetailsBIC(self.collectionDetails.swiftId()).done(function (data) {
                    self.additionalBankDetails(data);
                    self.collectionDetails.swiftId(self.additionalBankDetails().code);
                    self.collectionDetails.bankName(data.name);
                    self.collectionDetails.bankAddress.line1(data.branchAddress.line1);
                    self.collectionDetails.bankAddress.line2(data.branchAddress.line2);
                    self.collectionDetails.bankAddress.line3(data.branchAddress.line3);
                    self.collectionDetails.bankAddress.country(data.branchAddress.country);
                    triggerAction(actionType, modalName);
                }).fail(function () {
                    self.collectionDetails.swiftId(null);
                });
            } else {
                triggerAction(actionType, modalName);
            }
        }

        if (self.mode() === "EDIT") {
            for (var i = 0; i < self.stages.length; i++) {
                self.stages[i].editable(true);
                self.stages[i].expanded(true);
                self.stages[i].disabled(true);
            }
            self.deletedDocuments.removeAll();
            self.collectionDetails = ko.mapping.fromJS(loadDataIntoModel(ko.toJS(self.collectionDetails), ko.toJS(self.params.collectionDetails)));
            self.filterValues = ko.mapping.fromJS(ko.utils.extend(self.filterValues, self.params.filterDetails));
            if (self.collectionDetails.attachedDocuments() && self.collectionDetails.attachedDocuments().length > 0) {
                self.attachedDocuments(ko.mapping.toJS(self.collectionDetails.attachedDocuments()));
            }
            if(self.collectionDetails.goods && self.collectionDetails.goods().length > 0){
                self.goodsArray.removeAll();
                for (i = 0; i < self.collectionDetails.goods().length; i++) {
                    self.goodsArray.push({
                      id: ko.observable(i+1),
                      goodsCode: ko.observable(self.collectionDetails.goods()[i].code()),
                      description: ko.observable(self.collectionDetails.goods()[i].description()),
                      units: self.collectionDetails.goods()[i].noOfUnits ? ko.observable(self.collectionDetails.goods()[i].noOfUnits()) : ko.observable(null),
                      pricePerUnit: self.collectionDetails.goods()[i].pricePerUnit ? ko.observable(self.collectionDetails.goods()[i].pricePerUnit()) : ko.observable(null)
                    });
                }
                self.datasourceForGoods = new oj.ArrayTableDataSource(self.goodsArray, { idAttribute: "id" });
            }else if(self.filterValues.lcLinked() !== "true"){
                    self.datasourceForGoods = new oj.ArrayTableDataSource(self.goodsArray, { idAttribute: "id" });
                }else{
                    self.goodsArray.removeAll();
                    self.datasourceForGoods = new oj.ArrayTableDataSource(self.goodsArray, { idAttribute: "id" });
                }
        }
        self.minEffectiveDate = ko.observable();
        self.validateInterCode = {
            "validate": function (value) {
                if (value.length < 1) {
                    self.bicCodeError(true);
                } else if (value.length > 20 || !/^[a-zA-Z0-9]+$/.test(value)) {
                    self.bicCodeError(true);
                    throw new oj.ValidatorError("", oj.Translations.getTranslatedString(self.resourceBundle.errors.invalidSwiftId));
                } else {
                    self.bicCodeError(false);
                }
            }
        };
        self.openLookup = function () {
            self.clearingCodeType("SWI");
            $("#menuButtonDialog").trigger("openModal");
        };
        self.hideTncDialog = function(){
            $("#tncDialog").hide();
        };
        self.hideSaveAsDialog = function(){
            $("#saveAsDialog").hide();
        };
        self.hideInitiateCollection = function(){
            $("#initiateCollection").hide();
        };
        self.hideDeleteTemplate = function(){
            $("#deleteTemplate").hide();
        };
        self.checkShipmentDataLength = function () {
            if (self.collectionDetails.shipmentDetails.source() !== null && self.collectionDetails.shipmentDetails.source() !== "" && (self.collectionDetails.shipmentDetails.loadingPort() !== null && self.collectionDetails.shipmentDetails.loadingPort() !== "")) {
                if (self.collectionDetails.shipmentDetails.source().length + self.collectionDetails.shipmentDetails.loadingPort().length > 64) {
                    params.baseModel.showMessages(null, [self.resourceBundle.tradeFinanceErrors.messages.sourceLenValidation], "ERROR");
                    return false;
                }
            }
            if (self.collectionDetails.shipmentDetails.destination() !== null && self.collectionDetails.shipmentDetails.destination() !== "" && (self.collectionDetails.shipmentDetails.dischargePort() !== null && self.collectionDetails.shipmentDetails.dischargePort() !== "")) {
                if (self.collectionDetails.shipmentDetails.destination().length + self.collectionDetails.shipmentDetails.dischargePort().length > 64) {
                    params.baseModel.showMessages(null, [self.resourceBundle.tradeFinanceErrors.messages.destinationLenValidation], "ERROR");
                    return false;
                }
            }
            return true;
        };
        self.createNewTemplate = function () {
            $("#updateTemplate").hide();
            self.templateName("");
            $("#saveAsDialog").trigger("openModal");
        };
        CollectionModel.fetchBeneName().done(function (beneData) {
            var beneficiary = beneData.beneficiaryDTOs.map(function (data) {
                return {
                    value: data.id,
                    label: data.name
                };
            });
            self.counterPartyNameOptions(beneficiary);
            self.dropdownListLoaded.beneficiary(true);
        });
        CollectionModel.fetchGoods().done(function (goodsData) {
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
        self.confirmDelete = function () {
            if (self.collectionDetails.state() === "TEMPLATE") {
                self.deleteModalHeader(self.resourceBundle.common.labels.deleteTemplateHeader);
                self.deleteModalMessage(self.resourceBundle.common.labels.deleteTemplateMessage);
            } else if (self.collectionDetails.state() === "DRAFT") {
                self.deleteModalHeader(self.resourceBundle.common.labels.deleteDraftHeader);
                self.deleteModalMessage(self.resourceBundle.common.labels.deleteDraftMessage);
            } else if (self.collectionDetails.state() === "INITIATED" && self.componentId() === "TEMPLATES") {
                self.deleteModalHeader(self.resourceBundle.common.labels.deleteTemplateHeader);
                self.deleteModalMessage(self.resourceBundle.common.labels.deleteTemplateMessage);
            } else if (self.collectionDetails.state() === "INITIATED" && self.componentId() !== "TEMPLATES") {
                self.deleteModalHeader(self.resourceBundle.common.labels.deleteDraftMessage);
                self.deleteModalMessage(self.resourceBundle.common.labels.deleteDraftMessage);
            }
            $("#deleteTemplate").trigger("openModal");
        };
        self.delete = function () {
            $("#deleteTemplate").hide();
            CollectionModel.deleteCollection(self.params.collectionDetails.id).done(function (data) {
                if (data.status.result === "SUCCESSFUL") {
                    var message;
                    if (self.collectionDetails.state() === "TEMPLATE") {
                        message = params.baseModel.format(self.resourceBundle.common.labels.templateDeleteMsg, { tempName: self.collectionDetails.name() });
                    } else if (self.collectionDetails.state() === "DRAFT") {
                        message = params.baseModel.format(self.resourceBundle.common.labels.draftDeleteMsg, { draftName: self.collectionDetails.name() });
                    }
                    params.baseModel.showMessages(null, [message], "SUCCESS", self.goBack);
                }
            });
        };
        self.saveAsDraft = function () {
            createModelFromArray();
            self.saveAsModalHeader(self.resourceBundle.common.labels.saveDraft);
            self.collectionDetails.state("DRAFT");
            if (!(self.updateDraft && self.updateDraft())) {
                self.draftName("");
            }
            var modalName = "#saveAsDialog";
            validateBICCodes("DRAFT", modalName);
        };
        self.saveAsTemplate = function () {
          if (self.multiGoodsSupported() === true && self.goodsArray().length > 0) {
            totalGoodsAmount = 0;
            for (i = 0; i < self.goodsArray().length; i++) {
                totalGoodsAmount = totalGoodsAmount + (self.goodsArray()[i].units() * self.goodsArray()[i].pricePerUnit());
            }
            if(self.filterValues.lcLinked() === "true"){
              if(totalGoodsAmount !== self.collectionDetails.amount.amount()){
                params.baseModel.showMessages(null, [self.resourceBundle.tradeFinanceErrors.shipmentDetails.invalidBillUnderLcGoodsAmount], "ERROR");
                return;
              }
            }
           }
            if (self.checkShipmentDataLength() && validate()) {
                createModelFromArray();
                self.saveAsModalHeader(self.resourceBundle.common.labels.saveTemplate);
                self.collectionDetails.state("TEMPLATE");
                var modalName = "#saveAsDialog";
                if (self.updateTemplate && self.updateTemplate()) {
                    modalName = "#updateTemplate";
                    self.templateName(self.collectionDetails.name());
                } else {
                    self.templateName("");
                }
                validateBICCodes("TEMPLATE", modalName);
            }
        };
        self.update = function () {
            $("#updateTemplate").hide();
            CollectionModel.updateTemplate(self.collectionDetails.id(), ko.mapping.toJSON(self.collectionDetails)).done(function () {
                if (self.collectionDetails.state() === "TEMPLATE") {
                    self.modalHeader(self.resourceBundle.common.labels.templateUpdateHeader);
                    self.modalMessage(params.baseModel.format(self.resourceBundle.common.labels.templateUpdateMsg, { tempName: self.collectionDetails.name() }));
                    $("#initiateCollection").trigger("openModal");
                } else {
                    self.modalHeader(self.resourceBundle.common.labels.draftUpdateHeader);
                    self.modalMessage(params.baseModel.format(self.resourceBundle.common.labels.draftUpdateMsg, { draftName: self.collectionDetails.name() }));
                    $("#initiateCollection").trigger("openModal");
                }
            });
        };
        self.confirm = function () {
          var hostReferenceNumber = null;
             CollectionModel.initiateCollection(ko.mapping.toJSON(self.params.collectionDetails)).done(function (data, status, jqXhr) {
              if(data.bill)
                hostReferenceNumber = data.bill.id;
                params.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXhr,
                    hostReferenceNumber: hostReferenceNumber,
                    transactionName:self.resourceBundle.heading.collectionInitiation,
                    confirmScreenExtensions: {
                      isSet: true,
                      taskCode: "TF_N_CLC",
                      confirmScreenDetails: self.confirmScreenDetails(),
                      template: "confirm-screen/trade-finance"
                  }
                }, self);
            });
        };
        self.save = function () {
            if (params.baseModel.showComponentValidationErrors(self.templateNameValidationTracker())) {
                $("#saveAsDialog").hide();
                if (self.collectionDetails.state() === "TEMPLATE") {
                    self.collectionDetails.name(self.templateName());
                } else {
                    self.collectionDetails.name(self.draftName());
                }
                CollectionModel.initiateCollection(ko.mapping.toJSON(self.collectionDetails)).done(function () {
                    if (self.collectionDetails.state() === "TEMPLATE") {
                        self.modalHeader(self.resourceBundle.common.labels.templateSaveHeader);
                        self.modalMessage(params.baseModel.format(self.resourceBundle.common.labels.templateSaveMsg, { tempName: self.collectionDetails.name() }));
                        $("#initiateCollection").trigger("openModal");
                    } else {
                        self.modalHeader(self.resourceBundle.common.labels.draftSaveHeader);
                        self.modalMessage(params.baseModel.format(self.resourceBundle.common.labels.draftSaveMsg, { draftName: self.collectionDetails.name() }));
                        $("#initiateCollection").trigger("openModal");
                    }
                });
            }
        };
        self.initiate = function () {
          if (self.multiGoodsSupported() === true && self.goodsArray().length > 0) {
            totalGoodsAmount = 0;
            for (i = 0; i < self.goodsArray().length; i++) {
                totalGoodsAmount = totalGoodsAmount + (self.goodsArray()[i].units() * self.goodsArray()[i].pricePerUnit());
            }
            if(self.filterValues.lcLinked() === "true"){
              if(totalGoodsAmount !== self.collectionDetails.amount.amount()){
                params.baseModel.showMessages(null, [self.resourceBundle.tradeFinanceErrors.shipmentDetails.invalidBillUnderLcGoodsAmount], "ERROR");
                return;
              }
            }
           }
          var tncTracker = document.getElementById("tncTracker");
          if (tncTracker.valid === "valid") {
            if(validate() && self.checkShipmentDataLength()){
              self.collectionDetails.state("INITIATED");
              createModelFromArray();
              validateBICCodes(self.resourceBundle.labels.initiateLC);
            }
          }else {
              tncTracker.showMessages();
              tncTracker.focusOn("@firstInvalidShown");
          }
        };

      self.cancel = function () {
            params.dashboard.openDashBoard();
        };
        self.hideDocumentAccordion = ko.computed(function () {
            self.stages[2].visible(self.filterValues.docAttached());
        });
        self.collectionDetails.docAttached = ko.computed(function () {
            if (self.filterValues.docAttached() === "true") {
                return true;
            }
                return false;

        });
        self.termsAndConditions = function () {
            $("#tncDialog").trigger("openModal");
        };
        self.goBack = function () {
            params.dashboard.loadComponent("list-collection", {}, self);
        };
        self.showFloatingPanel = function () {
            $("#panelDD").trigger("openFloatingPanel");
        };
        self.menuClose = function () {
            $("#mediaFormatLauncher").removeClass("bold");
        };
    };
    vm.prototype.dispose = function () {
        self.hideDocumentAccordion.dispose();
        self.collectionDetails.docAttached.dispose();
        delete self.collectionDetails;
    };
    return vm;
});
