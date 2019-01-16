define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/view-letter-of-credit",
    "ojs/ojaccordion",
    "ojs/ojcollapsible",
    "ojs/ojvalidation",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingtabledatasource",
    "ojs/ojnavigationlist",
    "ojs/ojdatetimepicker",
    "ojs/ojconveyorbelt",
    "ojs/ojradioset",
    "ojs/ojswitch",
    "ojs/ojlistview",
    "ojs/ojpagingcontrol"
], function (oj, ko, $, ViewLCDetailsModel, resourceBundle) {
    "use strict";
    var vm = function (params) {
        var self = this;
        var chargesLength, commissionLength, i;
        self.setMenuAsBills = ko.observable(false);
        self.setMenuAsAmendment = ko.observable(false);
        self.resourceBundle = resourceBundle;
        self.sectionName = ko.observable();
        ko.utils.extend(self, params.rootModel);

        params.baseModel.registerElement("action-header");
        params.baseModel.registerComponent("view-bills", "collection");
        params.baseModel.registerComponent("amend-letter-of-credit", "letter-of-credit");
        params.baseModel.registerComponent("review-amend-lc", "letter-of-credit");
        params.baseModel.registerComponent("attach-documents", "trade-finance");
        params.baseModel.registerComponent("initiate-collection", "collection");
        params.baseModel.registerElement("floating-panel");
        params.baseModel.registerElement("confirm-screen");
        params.baseModel.registerElement("nav-bar");
        self.letterOfCreditDetails = self.params.letterOfCreditDetails;


        self.menuSelection = ko.observable();
        self.menuOptions = ko.observableArray();
        self.menuOptions([
            {
                id: "main",
                label: self.resourceBundle.leftMenu.viewLCDetails,
                templatePath: self.resourceBundle.leftMenu.viewLCDetails
            },
            {
                id: "ammendments",
                label: self.resourceBundle.leftMenu.amendments,
                templatePath: "trade-finance/view-lc/amendments"
            },
            {
                id: "bills",
                label: self.resourceBundle.leftMenu.bills,
                templatePath: "trade-finance/view-lc/bills"
            },
            {
                id: "attachedDocs",
                label: self.resourceBundle.leftMenu.viewAttachedDocuments,
                templatePath: self.resourceBundle.leftMenu.viewAttachedDocuments
            },
            {
                id: "guarantee",
                label: self.resourceBundle.leftMenu.guarantee,
                templatePath: "trade-finance/view-lc/guarantee-letter-of-credit"
            },
            {
                id: "charges",
                label: self.resourceBundle.leftMenu.charges,
                templatePath: "trade-finance/view-lc/charges-letter-of-credit"
            },
            {
                id: "viewSwiftMessages",
                label: self.resourceBundle.leftMenu.viewSwiftMessages,
                templatePath: "trade-finance/swift-message"
            },
            {
                id: "viewAdvice",
                label: self.resourceBundle.leftMenu.viewAdvice,
                templatePath: "trade-finance/advices"
            },
            {
                id: "banks",
                label: self.resourceBundle.leftMenu.banks,
                templatePath: "trade-finance/view-lc/bank-view-letter-of-credit"
            }
        ]);
        if (self.letterOfCreditDetails.lcType === "Export") {
            self.menuOptions.remove(function (data) {
                if (data.id === "guarantee") {
                    return true;
                }
                    return false;

            });
        }

        if(self.setMenuAsBills()){
            self.menuSelection("bills");
            self.sectionName(self.resourceBundle.leftMenu.bills);
        }else if(self.setMenuAsAmendment()){
          self.menuSelection("ammendments");
          self.sectionName(self.resourceBundle.leftMenu.amendments);
        }else{
          self.menuSelection("main");
          self.sectionName(self.resourceBundle.leftMenu.viewLCDetails);
        }
        self.uiOptions = {
            "menuFloat": "left",
            "fullWidth": false,
            "defaultOption": self.menuSelection
        };
        self.chargesOrCommissionSelection = ko.observable("COMMISION");
        self.chargesCommissionFlag = ko.observable("false");
        self.documentPresentationDays = ko.observable(0);
        self.mode = ko.observable("VIEW");
        self.lcId = ko.observable();
        self.dataLoaded = ko.observable(false);
        self.documentsLoaded = ko.observable(false);
        self.billingDraftsLoaded = ko.observable(false);
        self.datasourceForDraftReview = ko.observable();
        self.datasourceForDocReview = ko.observable();
        self.clauseTableArrayForReview = [];
        self.billList = ko.observableArray();
        self.datasourceForBills = ko.observable();
        self.adviceList = ko.observableArray();
        self.datasourceForAdvices = ko.observable();
        self.swiftList = ko.observableArray();
        self.datasourceForSwift = ko.observable();
        self.guaranteeList = ko.observableArray();
        self.dataSourceForGuarentee = ko.observable();
        self.amendmentList = ko.observableArray();
        self.dataForAmendment = ko.observable();
        self.commisionList = ko.observableArray();
        self.commissionDataSource = ko.observable();
        self.chargesList = ko.observableArray();
        self.chargesDataSource = ko.observable();
        self.reviewFlag = ko.observable(true);
        self.confirmingBank = ko.observable();
        self.reimbursingBank = ko.observable();
        self.reimbursingBankDetails = ko.observable();
        self.confirmingBankDetails = ko.observable();
        self.additionalIssueBankDetails = ko.observable();
        self.advisingThroughBankDetails = ko.observable();
        self.additionalBankDetails = ko.observable();
        self.advisingBankDetails = ko.observable();
        self.availableWithDetails = ko.observable(null);
        self.clauses = ko.observableArray();
        self.documentDetails = ko.observableArray();
        self.attachedDocuments = ko.observableArray();
        self.deletedDocuments = ko.observableArray();
        self.contractModified = ko.observable(false);
        self.addtionalBanksLoaded = ko.observable(false);
        self.amendmentDetails = ko.observable();
        self.amendmentDetailsLoaded = ko.observable(false);
        self.lcAmendValuesLoaded = ko.observable(false);
        self.chargesDetailsLoaded = ko.observable(false);
        self.reviewDataLoaded = ko.observable(false);
        self.amendmentId = ko.observable();
        self.clauseModalHeading = ko.observable();
        self.selectedClauses = ko.observable();
        self.backToViewLC = ko.observable(true);
        self.datasourceForGoodsReview = ko.observable();
        self.multiGoodsSupported = ko.observable(false);
        self.goodsLists = ko.observableArray();
        self.docTblColumns=null;
        if (params.baseModel.large()) {
            self.docTblColumns = [
                { headerText: self.resourceBundle.documents.labels.docName },
                { headerText: self.resourceBundle.documents.labels.original },
                { headerText: self.resourceBundle.documents.labels.copies }
            ];
        } else {
            self.docTblColumns = [
                { headerText: self.resourceBundle.documents.labels.docName },
                { headerText: self.resourceBundle.documents.labels.original },
                { headerText: self.resourceBundle.documents.labels.copies },
                { headerText: self.resourceBundle.documents.labels.clause }
            ];
        }
        self.lcAmendValues = ko.observable();
        var countryList = [];
        self.applicantName = ko.observable();
        self.applicantAddress = {
            line1: ko.observable(),
            line2: ko.observable(),
            line3: ko.observable(),
            country: ko.observable()
        };
        self.beneName = ko.observable();
        self.beneAddress = {
            line1: ko.observable(),
            line2: ko.observable(),
            line3: ko.observable(),
            country: ko.observable()
        };
        self.adviceDetails = {
            message: ko.observable(),
            eventDesc: ko.observable(),
            eventDate: ko.observable(),
            description: ko.observable(),
            dcnNo: ko.observable()
        };
        self.swiftDetails = {
            message: ko.observable(),
            eventDesc: ko.observable(),
            eventDate: ko.observable(),
            description: ko.observable(),
            dcnNo: ko.observable()
        };
        self.dropdownLabels = {
            product: ko.observable(),
            branch: ko.observable(),
            incoterm: ko.observable()
        };
        self.bankDetailsAvailable = {
            advisingBank: ko.observable(false),
            confirmingBank: ko.observable(false),
            issuingBank: ko.observable(false),
            reimbursingBank: ko.observable(false)
        };
        self.shipmentDatePeriodRadioSetValue = ko.observable();
        var getNewKoModel = function () {
            var KoModel = ViewLCDetailsModel.getNewModel();
            return ko.mapping.fromJS(KoModel);
        };
        self.rootModelInstance = ko.observable(getNewKoModel());
        self.modifyContractPayload = self.rootModelInstance().ModifyContractModel;
        if (self.letterOfCreditDetails.documentPresentationDays && self.letterOfCreditDetails.documentPresentationDays !== null) {
            self.documentPresentationDays(self.letterOfCreditDetails.documentPresentationDays);
        }
        if(self.letterOfCreditDetails.multiGoodsSupported && self.letterOfCreditDetails.multiGoodsSupported === "Y"){
            self.multiGoodsSupported(true);
            if(self.letterOfCreditDetails.goods && self.letterOfCreditDetails.goods.length > 0){
              self.goodsLists.removeAll();
              for (i = 0; i < self.letterOfCreditDetails.goods.length; i++) {
                self.goodsLists.push({
                    code:self.letterOfCreditDetails.goods[i].code,
                    description:self.letterOfCreditDetails.goods[i].description,
                    noOfUnits:(self.letterOfCreditDetails.goods[i].noOfUnits === 0) ? "" :self.letterOfCreditDetails.goods[i].noOfUnits,
                    pricePerUnit:(self.letterOfCreditDetails.goods[i].pricePerUnit === 0.00) ?"":self.letterOfCreditDetails.goods[i].pricePerUnit
                });
              }
              self.datasourceForGoodsReview = new oj.ArrayTableDataSource(self.goodsLists());
            }else{
              self.datasourceForGoodsReview = new oj.ArrayTableDataSource([]);
            }
        }
        if (self.letterOfCreditDetails.lcType === "Import") {
            params.dashboard.headerName(self.resourceBundle.heading.importLC);
            self.beneName(self.letterOfCreditDetails.counterPartyName);
            if (self.letterOfCreditDetails.counterPartyAddress) {
                self.beneAddress.line1(self.letterOfCreditDetails.counterPartyAddress.line1);
                self.beneAddress.line2(self.letterOfCreditDetails.counterPartyAddress.line2);
                self.beneAddress.line3(self.letterOfCreditDetails.counterPartyAddress.line3);
            }
            ViewLCDetailsModel.fetchPartyDetails(self.letterOfCreditDetails.partyId.value).done(function (data) {
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
        } else {
            params.dashboard.headerName(self.resourceBundle.heading.exportLC);
            self.applicantName(self.letterOfCreditDetails.counterPartyName);
            if (self.letterOfCreditDetails.counterPartyAddress) {
                self.applicantAddress.line1(self.letterOfCreditDetails.counterPartyAddress.line1);
                self.applicantAddress.line2(self.letterOfCreditDetails.counterPartyAddress.line2);
                self.applicantAddress.line3(self.letterOfCreditDetails.counterPartyAddress.line3);
            }
            ViewLCDetailsModel.fetchPartyDetails(self.letterOfCreditDetails.partyId.value).done(function (data) {
                self.beneName(data.party.personalDetails.fullName);
                for (i = 0; i < data.party.addresses.length; i++) {
                    if (data.party.addresses[i].type === "PST") {
                        self.beneAddress.line1(data.party.addresses[i].postalAddress.line1);
                        self.beneAddress.line2(data.party.addresses[i].postalAddress.line2);
                        self.beneAddress.line3(data.party.addresses[i].postalAddress.line3);
                        self.beneAddress.country(data.party.addresses[i].postalAddress.country);
                    }
                }
            });
        }
        self.stages = [
            {
                stageName: self.resourceBundle.heading.general,
                expanded: ko.observable(true),
                templateName: ko.observable("trade-finance/lc-details")
            },
            {
                stageName: self.resourceBundle.heading.shipment,
                expanded: ko.observable(false),
                templateName: ko.observable("trade-finance/shipment-details")
            },
            {
                stageName: self.resourceBundle.heading.documents,
                expanded: ko.observable(false),
                templateName: ko.observable("trade-finance/document-details")
            },
            {
                stageName: self.resourceBundle.heading.instructions,
                expanded: ko.observable(false),
                templateName: ko.observable("trade-finance/instructions-details")
            }
        ];
        function getCountryNameFromCode(countryCode) {
            var countryName = countryList.filter(function (data) {
                return data.code === countryCode;
            });
            return countryName.length > 0 ? countryName[0].description : null;
        }
        function capitalize(string) {
            return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
        }
        if (self.letterOfCreditDetails) {
            self.dropdownLabels.product(self.letterOfCreditDetails.productName);
            if (self.letterOfCreditDetails.incoterm) {
                self.dropdownLabels.incoterm(self.letterOfCreditDetails.incoterm.description);
            }
            ViewLCDetailsModel.fetchBeniCountry().done(function (data) {
                countryList = data.enumRepresentations[0].data;
                var country = data.enumRepresentations[0].data.filter(function (data) {
                    return data.code === self.letterOfCreditDetails.counterPartyAddress.country;
                });
                if (self.letterOfCreditDetails.lcType === "Import") {
                    self.beneAddress.country(country[0].description);
                } else {
                    self.applicantAddress.country(country[0].description);
                }
                if (self.letterOfCreditDetails.reimbursingBankCode || self.letterOfCreditDetails.confirmingBankCode || self.letterOfCreditDetails.advisingThroughBankCode) {
                    self.addtionalBanksLoaded(true);
                    if (self.letterOfCreditDetails.reimbursingBankCode) {
                        ViewLCDetailsModel.getBankDetailsBIC(self.letterOfCreditDetails.reimbursingBankCode).done(function (data) {
                            data.branchAddress.country = getCountryNameFromCode(data.branchAddress.country);
                            self.reimbursingBankDetails(data);
                        });
                    }
                    if (self.letterOfCreditDetails.confirmingBankCode) {
                        ViewLCDetailsModel.getBankDetailsBIC(self.letterOfCreditDetails.confirmingBankCode).done(function (data) {
                            data.branchAddress.country = getCountryNameFromCode(data.branchAddress.country);
                            self.confirmingBankDetails(data);
                        });
                    }
                    if (self.letterOfCreditDetails.advisingThroughBankCode) {
                        ViewLCDetailsModel.getBankDetailsBIC(self.letterOfCreditDetails.advisingThroughBankCode).done(function (data) {
                            data.branchAddress.country = getCountryNameFromCode(data.branchAddress.country);
                            self.advisingThroughBankDetails(data);
                        });
                    }
                }
                if (self.letterOfCreditDetails.lcType === "Export" && self.letterOfCreditDetails.issuingBankCode) {
                    ViewLCDetailsModel.getBankDetailsBIC(self.letterOfCreditDetails.issuingBankCode).done(function (data) {
                        data.branchAddress.country = getCountryNameFromCode(data.branchAddress.country);
                        self.additionalIssueBankDetails(data);
                    });
                } else if (self.letterOfCreditDetails.lcType === "Import" && self.letterOfCreditDetails.advisingBankCode) {
                    ViewLCDetailsModel.getBankDetailsBIC(self.letterOfCreditDetails.advisingBankCode).done(function (data) {
                        data.branchAddress.country = getCountryNameFromCode(data.branchAddress.country);
                        self.additionalBankDetails(data);
                    });
                }
                if (self.letterOfCreditDetails.availableWith) {
                    ViewLCDetailsModel.getBankDetailsBIC(self.letterOfCreditDetails.availableWith).done(function (data) {
                        data.branchAddress.country = getCountryNameFromCode(data.branchAddress.country);
                        self.availableWithDetails(data);
                    });
                }
            });
            ViewLCDetailsModel.fetchBranch().done(function (data) {
                var beneBranch = data.branchAddressDTO.filter(function (data) {
                    return data.id === self.letterOfCreditDetails.branchId;
                });
                if(beneBranch && beneBranch.length > 0){
                  self.dropdownLabels.branch(beneBranch[0].branchName);
                }
            });
            if (self.letterOfCreditDetails.draftsRequired) {
                if (self.letterOfCreditDetails.draftsRequired.toString() === "true" && self.letterOfCreditDetails.billingDrafts && self.letterOfCreditDetails.billingDrafts.length > 0) {
                    self.datasourceForDraftReview = new oj.ArrayTableDataSource(self.letterOfCreditDetails.billingDrafts);
                    self.billingDraftsLoaded(true);
                }
            }
            if (self.letterOfCreditDetails.attachedDocuments) {
                self.attachedDocuments.removeAll();
                for (i = 0; i < self.letterOfCreditDetails.attachedDocuments.length; i++) {
                    self.attachedDocuments.push({
                        contentId: self.letterOfCreditDetails.attachedDocuments[i].contentId,
                        documentName: self.letterOfCreditDetails.attachedDocuments[i].documentName,
                        category: self.letterOfCreditDetails.attachedDocuments[i].category,
                        type: self.letterOfCreditDetails.attachedDocuments[i].type,
                        remarks: self.letterOfCreditDetails.attachedDocuments[i].remarks,
                        newDocument: false
                    });
                }
            }
            if (self.letterOfCreditDetails.shipmentDetails.date && self.letterOfCreditDetails.shipmentDetails.date !== null) {
                self.shipmentDatePeriodRadioSetValue("latestdateofShipment");
            } else if (self.letterOfCreditDetails.shipmentDetails.period && self.letterOfCreditDetails.shipmentDetails.period !== null) {
                self.shipmentDatePeriodRadioSetValue("latestperiodofShipment");
            }
            self.dataLoaded(true);
        }
        function fetchAmendments() {
            ViewLCDetailsModel.getAmendments(self.letterOfCreditDetails.id).done(function (data) {
                self.amendmentList(data.letterOfCreditAmendmentDTOs);
                self.dataForAmendment(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.amendmentList(), { idAttribute: "id" })));
            });
        }
        self.fetchAmendmentDetails = function (amendmentId) {
            ViewLCDetailsModel.getAmendmentDetails(self.letterOfCreditDetails.id, amendmentId).done(function (data) {
                var parameters = {
                    mode: "VIEW",
                    data: ko.mapping.fromJS(data.letterOfCreditAmendment)
                };
                self.reviewDataLoaded(true);
                params.dashboard.loadComponent("review-amend-lc", parameters, self);
            });
        };
        self.initiateAmend = function () {
            var parameters = { mode: "CREATE" };
            params.dashboard.loadComponent("amend-letter-of-credit", parameters, self);
        };
        self.initiateBill = function () {
            var parameters = {
                mode: "CREATE",
                lcId: self.letterOfCreditDetails.id
            };
            params.dashboard.loadComponent("initiate-collection", parameters, self);
        };
        function fetchLCBills() {
            ViewLCDetailsModel.getLCBills(self.letterOfCreditDetails.id).done(function (data) {
                self.billList(data.letterOfCreditBillsDTOs);
                self.datasourceForBills(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.billList())));
            });
        }
        self.fetchLCBillDetails = function (billNo) {
            ViewLCDetailsModel.getBillDetails(billNo).done(function (response) {
                if (response.bill) {
                    response.bill.contractStatus = capitalize(response.bill.contractStatus);
                    var parameters = {
                        mode: "VIEW",
                        billDetails: ko.mapping.toJS(response.bill)
                    };
                    params.dashboard.loadComponent("view-bills", parameters, self);
                } else {
                    params.baseModel.showMessages(null, [self.resourceBundle.tradeFinanceErrors.messages.noDataFound], "ERROR");
                }
            });
        };
        function fetchGuarantees() {
            ViewLCDetailsModel.getGuarantees(self.letterOfCreditDetails.id).done(function (data) {
                self.guaranteeList(data.lcGuaranteeDTO);
                self.dataSourceForGuarentee(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.guaranteeList())));
            });
        }
        self.getDocumentDetails = function () {
            if (self.letterOfCreditDetails.document && self.letterOfCreditDetails.document.length > 0) {
                self.datasourceForDocReview = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.letterOfCreditDetails.document, { idAttribute: "id" }));
                for (i = 0; i < self.letterOfCreditDetails.document.length; i++) {
                    if (self.letterOfCreditDetails.document[i].clause && self.letterOfCreditDetails.document[i].clause.length > 0) {
                        self.clauseTableArrayForReview.push({
                            docName: self.letterOfCreditDetails.document[i].name + " Clauses",
                            datasourceForClause: new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.letterOfCreditDetails.document[i].clause))
                        });
                    }
                }
                self.documentsLoaded(true);
            }
        };
        self.getDocumentDetails();
        self.viewClauses = function (selectedDoc) {
            var clauses = selectedDoc.clause;
            if (clauses === undefined) {
                clauses = [];
            }
            self.selectedClauses({
                docId: selectedDoc.id,
                docName: selectedDoc.name + " Clauses",
                datasourceForClause: new oj.PagingTableDataSource(new oj.ArrayTableDataSource(clauses))
            });
            self.clauseModalHeading(selectedDoc.name + " Clauses");
            $("#documentClauses").trigger("openModal");
        };
        function fetchLCCharges() {
            ViewLCDetailsModel.getChargesDetails(self.letterOfCreditDetails.id).done(function (data) {
                self.chargesDetailsLoaded(false);
                chargesLength = data.letterOfCreditChargesDTOs[0].charges ? data.letterOfCreditChargesDTOs[0].charges.length : 0;
                commissionLength = data.letterOfCreditChargesDTOs[0].commissions ? data.letterOfCreditChargesDTOs[0].commissions.length : 0;
                if (commissionLength > 0) {
                    self.commisionList(data.letterOfCreditChargesDTOs[0].commissions);
                    self.commissionDataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.commisionList())));
                } else {
                    self.commissionDataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource([])));
                }
                if (chargesLength > 0) {
                    self.chargesList(data.letterOfCreditChargesDTOs[0].charges);
                    self.chargesDataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.chargesList())));
                }else{
                  self.chargesDataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource([])));
                }
                self.chargesDetailsLoaded(true);
            });
        }
        self.totalLabelFunc = function (context) {
            if (chargesLength > 0) {
                var parentElement = $(context.footerContext.parentElement);
                parentElement.append(self.resourceBundle.labels.totalCharges);
            }
        };
        self.fadeOutWarningContainer = function(){
            $("#warning-container").fadeOut("slow");
        };
        self.totalCommissionLabelFunc = function (context) {
            if (commissionLength > 0) {
                var parentElement = $(context.footerContext.parentElement);
                parentElement.append(self.resourceBundle.labels.totalCommission);
            }
        };
        self.totalFunc = function (context) {
            var datasource = context.footerContext.datasource;
            if (!datasource) {
                return;
            }
            var total = 0;
            var totalRowCount = datasource.totalSize();
            var addAmount = function (rowNum) {
                datasource.at(rowNum).then(function (row) {
                    var currency = row.data.amount.currency;
                    total = total + parseFloat(row.data.amount.amount);
                    if (rowNum < totalRowCount - 1) {
                        addAmount(rowNum + 1);
                    } else {
                        var parentElement = $(context.footerContext.parentElement);
                        parentElement.append(params.baseModel.formatCurrency(total, currency));
                    }
                });
            };
            if (datasource.data.length > 0) {
                addAmount(0);
            }
        };
        self.adviceList(self.letterOfCreditDetails.advices);
        self.datasourceForAdvices(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.adviceList(), { idAttribute: "dcnNo" })));
        self.swiftList(self.letterOfCreditDetails.swiftMessages);
        self.datasourceForSwift(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.swiftList(), { idAttribute: "dcnNo" })));
        self.openAdviceDetails = function (dcnNo) {
            ViewLCDetailsModel.getAdviceDetails(self.letterOfCreditDetails.id, dcnNo).done(function (data) {
                self.adviceDetails.dcnNo(data.adviceDTO.dcnNo);
                self.adviceDetails.message(data.adviceDTO.message);
                self.adviceDetails.eventDesc(data.adviceDTO.eventDesc);
                self.adviceDetails.eventDate(params.baseModel.formatDate(data.adviceDTO.eventDate));
                $("#adviceDialog").trigger("openModal");
            });
        };
        self.saveAdvice = function () {
            ViewLCDetailsModel.fetchAdvicePDF(self.letterOfCreditDetails.id, self.adviceDetails.dcnNo());
        };
        self.openSwiftDetails = function (dcnNo) {
            ViewLCDetailsModel.getSwiftDetails(self.letterOfCreditDetails.id, dcnNo).done(function (data) {
                self.swiftDetails.dcnNo(data.swiftMessageDTO.dcnNo);
                self.swiftDetails.message(data.swiftMessageDTO.message);
                self.swiftDetails.eventDesc(data.swiftMessageDTO.eventDesc);
                self.swiftDetails.eventDate(params.baseModel.formatDate(data.swiftMessageDTO.eventDate));
                $("#swiftDialog").trigger("openModal");
            });
        };
        self.saveSwiftDetails = function () {
            ViewLCDetailsModel.fetchSwiftPDF(self.letterOfCreditDetails.id, self.swiftDetails.dcnNo());
        };
        self.goBack = function () {
            self.setMenuAsBills(false);
            self.setMenuAsAmendment(false);
            if (self.letterOfCreditDetails.lcType === "Import") {
                params.dashboard.loadComponent("import-lc", {}, self);
            } else {
                params.dashboard.loadComponent("export-lc", {}, self);
            }
        };
        self.showSection = function (sectionName, templatePath) {
            $("#panelDD").trigger("closeFloatingPanel");
            switch (sectionName) {
            case self.resourceBundle.leftMenu.viewLCDetails:
                if (params.baseModel.small() === true) {
                    self.chargesCommissionFlag("false");
                    if (self.letterOfCreditDetails.lcType === "Export") {
                        params.dashboard.headerName(self.resourceBundle.heading.exportLC);
                    } else {
                        params.dashboard.headerName(self.resourceBundle.heading.importLC);
                    }
                }
                break;
            case self.resourceBundle.leftMenu.amendments:
                if (params.baseModel.small() === true) {
                    self.chargesCommissionFlag("false");
                    params.dashboard.headerName(self.resourceBundle.leftMenu.amendments);
                }
                fetchAmendments();
                break;
            case self.resourceBundle.leftMenu.bills:
                if (params.baseModel.small() === true) {
                    self.chargesCommissionFlag("false");
                    params.dashboard.headerName(self.resourceBundle.leftMenu.bills);
                }
                fetchLCBills();
                break;
            case self.resourceBundle.leftMenu.viewAttachedDocuments:
                if (params.baseModel.small() === true) {
                    self.chargesCommissionFlag("false");
                    params.dashboard.headerName(self.resourceBundle.leftMenu.viewAttachedDocuments);
                }
                break;
            case self.resourceBundle.leftMenu.guarantee:
                if (params.baseModel.small() === true) {
                    self.chargesCommissionFlag("false");
                    params.dashboard.headerName(self.resourceBundle.leftMenu.guarantee);
                }
                fetchGuarantees();
                break;
            case self.resourceBundle.leftMenu.charges:
                if (params.baseModel.small() === true) {
                    params.dashboard.headerName(self.resourceBundle.leftMenu.charges);
                    self.chargesCommissionFlag("true");
                }
                fetchLCCharges();
                break;
            case self.resourceBundle.leftMenu.viewSwiftMessages:
                if (params.baseModel.small() === true) {
                    self.chargesCommissionFlag("false");
                    params.dashboard.headerName(self.resourceBundle.leftMenu.viewSwiftMessages);
                }
                break;
            case self.resourceBundle.leftMenu.viewAdvice:
                if (params.baseModel.small() === true) {
                    self.chargesCommissionFlag("false");
                    params.dashboard.headerName(self.resourceBundle.leftMenu.viewAdvice);
                }
                break;
            case self.resourceBundle.leftMenu.banks:
                if (params.baseModel.small() === true) {
                    self.chargesCommissionFlag("false");
                    params.dashboard.headerName(self.resourceBundle.leftMenu.banks);
                }
                break;
            }
            self.sectionName(templatePath);
        };
        self.modifyContract = function () {
            self.modifyContractPayload.attachedDocuments(self.attachedDocuments());
            self.modifyContractPayload.deletedDocuments(self.deletedDocuments());
            self.modifyContractPayload.counterPartyName(self.beneName());
            self.modifyContractPayload.amount.amount(self.letterOfCreditDetails.amount.amount);
            self.modifyContractPayload.amount.currency(self.letterOfCreditDetails.amount.currency);
            ViewLCDetailsModel.modifyContract(self.letterOfCreditDetails.id, ko.mapping.toJSON(self.modifyContractPayload)).done(function (data, status, jqXhr) {
                var hostReferenceNumber = null;
                if (data.letterOfCredit) {
                    hostReferenceNumber = data.letterOfCredit.id;
                }
                params.dashboard.loadComponent("confirm-screen", {
                   jqXHR: jqXhr,
                   hostReferenceNumber: hostReferenceNumber,
                   transactionName: self.resourceBundle.documents.labels.docForLC,
                   confirmScreenExtensions: {
                       isSet: true,
                       taskCode: "TF_N_ULC",
                       confirmScreenDetails: [],
                       template: "confirm-screen/trade-finance"
                   }
               }, self);
            });
        };
        self.totalCharges = function () {
            var chargesRowCount = self.chargesList().length;
            if (chargesRowCount > 0) {
                var chargesTotal = 0;
                var chargesCurrency;
                for (i = 0; i < chargesRowCount; i++) {
                    chargesCurrency = self.chargesList()[i].amount.currency;
                    chargesTotal = chargesTotal + parseFloat(self.chargesList()[i].amount.amount);
                }
                var chargesTotalAmount = params.baseModel.formatCurrency(chargesTotal, chargesCurrency);
                return chargesTotalAmount;
            }
        };
        self.totalCommision = function () {
            var commissionRowCount = self.commisionList().length;
            if (commissionRowCount > 0) {
                var commissionTotal = 0;
                var commissionCurrency;
                for (i = 0; i < commissionRowCount; i++) {
                    commissionCurrency = self.commisionList()[i].amount.currency;
                    commissionTotal = commissionTotal + parseFloat(self.commisionList()[i].amount.amount);
                }
                var commissionTotalAmount = params.baseModel.formatCurrency(commissionTotal, commissionCurrency);
                return commissionTotalAmount;
            }
        };
        self.getRowId = function (rowIndex) {
            return ++rowIndex;
        };
        self.showFloatingPanel = function () {
            $("#panelDD").trigger("openFloatingPanel");
        };
        self.menuSelectionSubscribe = self.menuSelection.subscribe(function (newValue) {
            var menuOption = self.menuOptions().filter(function (data) {
                return data.id === newValue;
            });
            self.showSection(menuOption[0].id, menuOption[0].templatePath);
        });
    };
    vm.prototype.dispose = function () {
        this.menuSelectionSubscribe.dispose();
    };
    return vm;
});
