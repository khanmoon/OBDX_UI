define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "./model",
    "ojL10n!resources/nls/view-bills",
    "ojs/ojaccordion",
    "ojs/ojcollapsible",
    "ojs/ojvalidation",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingtabledatasource",
    "ojs/ojnavigationlist",
    "ojs/ojconveyorbelt",
    "ojs/ojradioset",
    "ojs/ojcheckboxset",
    "ojs/ojcube",
    "ojs/ojdatagrid",
    "ojs/ojinputtext",
    "ojs/ojswitch",
    "ojs/ojpagingcontrol"
], function (oj, ko, $, ViewBillDetailsModel, resourceBundle) {
    "use strict";
    return function (params) {
        var self = this;
        var i, countryList = [];
        ko.utils.extend(self, params.rootModel);
        self.resourceBundle = resourceBundle;
        params.baseModel.registerElement("action-header");
        params.baseModel.registerElement("floating-panel");
        params.baseModel.registerComponent("attach-documents", "trade-finance");
        params.baseModel.registerComponent("import-bills", "collection");
        params.baseModel.registerComponent("export-bills", "collection");
        params.baseModel.registerElement("nav-bar");
        self.collectionDetails = self.params.billDetails;
        self.mode = self.params.mode;
        self.datasourceForAdvices = ko.observable();
        self.adviceList = ko.observableArray();
        self.datasourceForSwift = ko.observable();
        self.discrepanciesData = ko.observable();
        self.swiftList = ko.observableArray();
        self.additionalBankDetails = ko.observable();
        self.datasourceForDocReview = ko.observable();
        self.clauseTableArrayForReview = [];
        self.documentsLoaded = ko.observable(false);
        self.clauseModalHeading = ko.observable();
        self.selectedClauses = ko.observable();
        self.goodsLists = ko.observableArray();
        self.applicantName = ko.observable();
        if(self.collectionDetails.multiGoodsSupported && self.collectionDetails.multiGoodsSupported === "Y"){
          self.multiGoodsSupported = ko.observable(true);
        }else{
          self.multiGoodsSupported = ko.observable(false);
        }
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
        self.dropdownLabels = {
            branch: ko.observable(),
            country: ko.observable(),
            product: ko.observable(),
            baseDateDescription: ko.observable(),
            incoterm: ko.observable()
        };
        self.filterValues = {
            paymentType: ko.observable(),
            docAttached: ko.observable(),
            lcLinked: ko.observable(),
            lcNumber: ko.observable()
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
        self.sectionName = ko.observable(self.resourceBundle.leftMenu.viewBillDetails);
        self.stages = [
            {
                stageName: self.collectionDetails.lcReferenceOur ? params.baseModel.format(self.resourceBundle.heading.generalLinkedWithLC, {
                    lcNumber: self.collectionDetails.lcReferenceOur,
                    status: self.collectionDetails.contractStatus
                }) : params.baseModel.format(self.resourceBundle.heading.generalLinkedWithOutLC, { status: self.collectionDetails.contractStatus }),
                expanded: ko.observable(true),
                templateName: "trade-finance/view-collections/collection-details",
                visible: ko.observable("true")
            },
            {
                stageName: self.resourceBundle.heading.shipmentDetails,
                expanded: ko.observable(false),
                templateName: "trade-finance/view-collections/bill-details",
                visible: ko.observable("true")
            },
            {
                stageName: self.resourceBundle.heading.documents,
                expanded: ko.observable(false),
                templateName: "trade-finance/view-collections/collection-documents",
                visible: self.collectionDetails.docAttached ? ko.observable("true") : ko.observable("false")
            },
            {
                stageName: self.resourceBundle.heading.instructions,
                expanded: ko.observable(false),
                templateName: "trade-finance/view-collections/collection-instructions-details",
                visible: ko.observable("true")
            }
        ];
        self.menuSelection = ko.observable();
        self.menuOptions = ko.observableArray();
        self.uiOptions = {
            "menuFloat": "left",
            "fullWidth": false,
            "defaultOption": self.menuSelection
        };
        self.menuOptions([
            {
                id: "main",
                label: self.resourceBundle.leftMenu.viewBillDetails,
                templatePath: self.resourceBundle.leftMenu.viewBillDetails
            },
            {
                id: "discrepancies",
                label: self.resourceBundle.leftMenu.discrepancies,
                templatePath: "trade-finance/view-collections/discrepancies-details"
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
            }
        ]);
        if (!self.collectionDetails.lcReferenceOur) {
            self.menuOptions.remove(function (data) {
                if (data.id === "discrepancies") {
                    return true;
                }
                    return false;

            });
        }
        self.menuSelection("main");
        /**
        * This is a function which returns name of country taking country code as it's parameter
        * @function getCountryNameFromCode
		* @param {string} countryCode - code of the country
		* @returns {string} name of the country represented by the code
        */
        function getCountryNameFromCode(countryCode) {
            var countryName = countryList.filter(function (data) {
                return data.code === countryCode;
            });
            return countryName.length > 0 ? countryName[0].description : null;
        }
        if (self.collectionDetails.billType === "IMPORT") {
            params.dashboard.headerName(self.resourceBundle.heading.importBills);
            if (self.collectionDetails.counterPartyAddress) {
                self.applicantName(self.collectionDetails.counterPartyName);
                self.applicantAddress.line1(self.collectionDetails.counterPartyAddress.line1);
                self.applicantAddress.line2(self.collectionDetails.counterPartyAddress.line2);
                self.applicantAddress.line3(self.collectionDetails.counterPartyAddress.line3);
            }
            ViewBillDetailsModel.fetchPartyDetails(self.collectionDetails.partyId.value).done(function (data) {
                self.beneName(data.party.personalDetails.fullName);
                for (i = 0; i < data.party.addresses.length; i++) {
                    if (data.party.addresses[i].type === "PST") {
                        self.beneAddress.line1(data.party.addresses[i].postalAddress.line1);
                        self.beneAddress.line2(data.party.addresses[i].postalAddress.line2);
                        self.beneAddress.line3(data.party.addresses[i].postalAddress.line3);
                        self.beneAddress.country(data.party.addresses[i].postalAddress.country);
                        self.dropdownLabels.country(data.party.addresses[i].postalAddress.country);
                    }
                }
            });
        } else {
            params.dashboard.headerName(self.resourceBundle.heading.exportBills);
            if (self.collectionDetails.counterPartyAddress) {
                self.beneName(self.collectionDetails.counterPartyName);
                self.beneAddress.line1(self.collectionDetails.counterPartyAddress.line1);
                self.beneAddress.line2(self.collectionDetails.counterPartyAddress.line2);
                self.beneAddress.line3(self.collectionDetails.counterPartyAddress.line3);
            }
            ViewBillDetailsModel.fetchPartyDetails(self.collectionDetails.partyId.value).done(function (data) {
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
        ViewBillDetailsModel.fetchBranch().done(function (data) {
            var beneBranch = data.branchAddressDTO.filter(function (data) {
                return data.id === self.collectionDetails.branchId;
            });
            self.dropdownLabels.branch(beneBranch[0].branchName);
        });
        self.dropdownLabels.product(self.collectionDetails.productName);
        self.filterValues.paymentType(self.collectionDetails.tenorCode);
        if (self.collectionDetails.docAttached) {
            self.filterValues.docAttached("true");
        } else {
            self.filterValues.docAttached("false");
        }
        if (self.collectionDetails.lcReferenceOur) {
            self.filterValues.lcLinked("true");
        } else {
            self.filterValues.lcLinked("false");
        }
        self.dropdownLabels.baseDateDescription(self.collectionDetails.baseDateDescription);
        ViewBillDetailsModel.fetchIncoterm(self.collectionDetails.incoterm).done(function (data) {
            self.dropdownLabels.incoterm(data.incotermList[0].description);
        });
        ViewBillDetailsModel.fetchBeniCountry().done(function (data) {
            countryList = data.enumRepresentations[0].data;
            if (self.collectionDetails.billType === "IMPORT") {
                if (self.collectionDetails.counterPartyAddress) {
                    self.applicantAddress.country(getCountryNameFromCode(self.collectionDetails.counterPartyAddress.country));
                }
                if (self.collectionDetails.lcReferenceOur) {
                    if (self.collectionDetails.negotiatingBankCode !== undefined) {
                        ViewBillDetailsModel.getBankDetailsBIC(self.collectionDetails.negotiatingBankCode).done(function (data) {
                            data.branchAddress.country = getCountryNameFromCode(data.branchAddress.country);
                            self.additionalBankDetails(data);
                        });
                    }
                } else if (self.collectionDetails.remittingBankCode !== undefined) {
                        ViewBillDetailsModel.getBankDetailsBIC(self.collectionDetails.remittingBankCode).done(function (data) {
                            data.branchAddress.country = getCountryNameFromCode(data.branchAddress.country);
                            self.additionalBankDetails(data);
                        });
                    }
            } else {
                if (self.collectionDetails.counterPartyAddress) {
                    self.dropdownLabels.country(getCountryNameFromCode(self.collectionDetails.counterPartyAddress.country));
                }
                if (self.collectionDetails.lcReferenceOur) {
                    if (self.collectionDetails.confirmingBankCode !== undefined) {
                        ViewBillDetailsModel.getBankDetailsBIC(self.collectionDetails.confirmingBankCode).done(function (data) {
                            data.branchAddress.country = getCountryNameFromCode(data.branchAddress.country);
                            self.additionalBankDetails(data);
                        });
                    }
                } else if (self.collectionDetails.collectingBankCode !== undefined) {
                        ViewBillDetailsModel.getBankDetailsBIC(self.collectionDetails.collectingBankCode).done(function (data) {
                            data.branchAddress.country = getCountryNameFromCode(data.branchAddress.country);
                            self.additionalBankDetails(data);
                        });
                    }
            }
        });
        if (self.collectionDetails.document && self.collectionDetails.document.length > 0) {
            self.datasourceForDocReview = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.collectionDetails.document, { idAttribute: "name" }));
            for (i = 0; i < self.collectionDetails.document.length; i++) {
                if (self.collectionDetails.document[i].clause && self.collectionDetails.document[i].clause.length > 0) {
                    self.clauseTableArrayForReview.push({
                        docName: self.collectionDetails.document[i].name + " Clauses",
                        datasourceForClause: new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.collectionDetails.document[i].clause))
                    });
                }
            }
            self.documentsLoaded(true);
        }
        if (self.collectionDetails.document && self.collectionDetails.document.length > 0) {
            var docArr = [];
            var docIndex = 0;
            for (i = 0; i < self.collectionDetails.document.length; i++) {
                docArr.push({
                    "index": docIndex++,
                    "docName": self.collectionDetails.document[i].name,
                    "original": self.collectionDetails.document[i].originals,
                    "copies": self.collectionDetails.document[i].copies,
                    "type": self.resourceBundle.documents.labels.firstMail
                });
                if (self.collectionDetails.document[i].secondCopies) {
                    docArr.push({
                        "index": docIndex++,
                        "docName": self.collectionDetails.document[i].name,
                        "original": self.collectionDetails.document[i].secondOriginals,
                        "copies": self.collectionDetails.document[i].secondCopies,
                        "type": self.resourceBundle.documents.labels.secondMail
                    });
                }
            }
        }
        self.adviceList(self.collectionDetails.advices);
        self.datasourceForAdvices(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.collectionDetails.advices, { idAttribute: "dcnNo" })));
        self.swiftList(self.collectionDetails.swiftMessages);
        self.datasourceForSwift(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.collectionDetails.swiftMessages, { idAttribute: "dcnNo" })));
        if (self.collectionDetails.discrepancies && self.collectionDetails.discrepancies.length > 0) {
            var listDescrepancies = [];
            for (i = 0; i < self.collectionDetails.discrepancies.length; i++) {
                listDescrepancies.push({
                    receivedDate: params.baseModel.formatDate(self.collectionDetails.discrepancies[i].receivedDate),
                    description: self.collectionDetails.discrepancies[i].description,
                    status: self.collectionDetails.discrepancies[i].resolved ? self.resourceBundle.discrepancies.resolved : self.resourceBundle.discrepancies.unresolved,
                    resolvedDate: params.baseModel.formatDate(self.collectionDetails.discrepancies[i].resolvedDate),
                    approvedDate: params.baseModel.formatDate(self.collectionDetails.discrepancies[i].approvedDate)
                });
            }
            self.discrepanciesData(new oj.ArrayTableDataSource(listDescrepancies));
        }
        if(self.multiGoodsSupported()){
            if(self.collectionDetails.goods && self.collectionDetails.goods.length > 0){
              self.goodsLists.removeAll();
              for (i = 0; i < self.collectionDetails.goods.length; i++) {
                self.goodsLists.push({
                    code:self.collectionDetails.goods[i].code,
                    description:self.collectionDetails.goods[i].description,
                    noOfUnits:(self.collectionDetails.goods[i].noOfUnits === 0) ? "" :self.collectionDetails.goods[i].noOfUnits,
                    pricePerUnit:(self.collectionDetails.goods[i].pricePerUnit === 0.00) ? "" :self.collectionDetails.goods[i].pricePerUnit
                });
              }
              self.datasourceForGoodsReview = new oj.ArrayTableDataSource(self.goodsLists());
            }else{
              self.datasourceForGoodsReview = new oj.ArrayTableDataSource([]);
            }
        }
        self.showSection = function (sectionName, templatePath) {
            $("#panelDD").trigger("closeFloatingPanel");
            switch (sectionName) {
            case self.resourceBundle.leftMenu.viewBillDetails:
                if (params.baseModel.small() === true) {
                    if (self.collectionDetails.billType === "Export") {
                        params.dashboard.headerName(self.resourceBundle.heading.exportBills);
                    } else {
                        params.dashboard.headerName(self.resourceBundle.heading.importBills);
                    }
                }
                break;
            case self.resourceBundle.leftMenu.discrepancies:
                if (params.baseModel.small() === true) {
                    params.dashboard.headerName(self.resourceBundle.leftMenu.discrepancies);
                }
                break;
            case self.resourceBundle.leftMenu.viewSwiftMessages:
                if (params.baseModel.small() === true) {
                    params.dashboard.headerName(self.resourceBundle.leftMenu.viewSwiftMessages);
                }
                break;
            case self.resourceBundle.leftMenu.viewAdvice:
                if (params.baseModel.small() === true) {
                    params.dashboard.headerName(self.resourceBundle.leftMenu.viewAdvice);
                }
                break;
            }
            self.sectionName(templatePath);
        };
        self.openAdviceDetails = function (dcnNo) {
            ViewBillDetailsModel.getAdviceDetails(self.collectionDetails.id, dcnNo).done(function (data) {
                self.adviceDetails.dcnNo(data.adviceDTO.dcnNo);
                self.adviceDetails.message(data.adviceDTO.message);
                self.adviceDetails.eventDesc(data.adviceDTO.eventDesc);
                self.adviceDetails.eventDate(params.baseModel.formatDate(data.adviceDTO.eventDate));
                $("#adviceDialog").trigger("openModal");
            });
        };
        self.openSwiftDetails = function (dcnNo) {
            ViewBillDetailsModel.getSwiftDetails(self.collectionDetails.id, dcnNo).done(function (data) {
                self.swiftDetails.dcnNo(data.swiftMessageDTO.dcnNo);
                self.swiftDetails.message(data.swiftMessageDTO.message);
                self.swiftDetails.eventDesc(data.swiftMessageDTO.eventDesc);
                self.swiftDetails.eventDate(params.baseModel.formatDate(data.swiftMessageDTO.eventDate));
                $("#swiftDialog").trigger("openModal");
            });
        };
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
        self.saveAdvice = function () {
            ViewBillDetailsModel.fetchAdvicePDF(self.collectionDetails.id, self.adviceDetails.dcnNo());
        };
        self.saveSwiftDetails = function () {
            ViewBillDetailsModel.fetchSwiftPDF(self.collectionDetails.id, self.swiftDetails.dcnNo());
        };
        self.goBack = function () {
          if(self.backToViewLC){
              self.setMenuAsBills(true);
              history.back();
          }
          else if (self.collectionDetails.billType === "IMPORT") {
                params.dashboard.loadComponent("import-bills", {}, self);
            }else if(self.collectionDetails.billType === "EXPORT"){
                params.dashboard.loadComponent("export-bills", {}, self);
            }
        };
        self.showFloatingPanel = function () {
            $("#panelDD").trigger("openFloatingPanel");
        };
        self.getRowId = function (rowIndex) {
            return ++rowIndex;
        };
        self.menuSelection.subscribe(function (newValue) {
            var menuOption = self.menuOptions().filter(function (data) {
                return data.id === newValue;
            });
            self.showSection(menuOption[0].data, menuOption[0].templatePath);
        });
    };
});
