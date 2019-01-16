define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "./model",
    "ojL10n!resources/nls/view-letter-of-credit",
    "ojs/ojaccordion",
    "ojs/ojcollapsible",
    "ojs/ojvalidation",
    "ojs/ojvalidationgroup",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingtabledatasource",
    "ojs/ojnavigationlist",
    "ojs/ojconveyorbelt",
    "ojs/ojradioset",
    "ojs/ojswitch",
    "ojs/ojpagingcontrol",
    "ojs/ojcheckboxset"
], function (oj, ko, $, ReviewAmendLcModel, resourceBundle) {
    "use strict";
    var self, vm = function (params) {
        self = this;
        var i;
        ko.utils.extend(self, params.rootModel);
        self.resourceBundle = resourceBundle;
        self.mode = ko.observable(self.params.mode);
        params.baseModel.registerElement("confirm-screen");
        params.baseModel.registerComponent("amend-letter-of-credit", "letter-of-credit");
        params.baseModel.registerComponent("attach-documents", "trade-finance");
        self.documentPresentationDays = ko.observable(0);
        self.reviewTransactionName = [];
        self.reviewTransactionName.header = self.resourceBundle.generic.common.review;
        self.reviewTransactionName.reviewHeader = self.resourceBundle.heading.reviewMsg;
        /*for validation groups in amend lc*/
        self.amendLcTracker = ko.observable();
        self.amendLcGroupValid = ko.observable();
        self.amendShipmentTracker = ko.observable();
        self.amendShipmentGroupValid = ko.observable();
        self.amendInsturctionsTracker = ko.observable();
        self.amendInstructionsGroupValid = ko.observable();
        self.tncTracker = ko.observable();
        self.tncGroupValid = ko.observable();
        /**/
        function capitalize(string) {
            if (string) {
                string = string.concat("ed");
                return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
            }
        }
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
        self.getLCDetails = function () {
            self.beneName(self.letterOfCreditDetails.counterPartyName);
            self.beneAddress.line1(self.letterOfCreditDetails.counterPartyAddress.line1);
            self.beneAddress.line2(self.letterOfCreditDetails.counterPartyAddress.line2);
            self.beneAddress.line3(self.letterOfCreditDetails.counterPartyAddress.line3);
            self.dropdownLabels.product(self.letterOfCreditDetails.productName);
            if (self.letterOfCreditDetails.incoterm) {
                self.dropdownLabels.incoterm(self.letterOfCreditDetails.incoterm.description);
            }
            if (self.letterOfCreditDetails.attachedDocuments) {
                self.attachedDocuments(self.letterOfCreditDetails.attachedDocuments);
            }
            ReviewAmendLcModel.fetchPartyDetails(self.letterOfCreditDetails.partyId.value).done(function (data) {
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
            if (self.letterOfCreditDetails.documentPresentationDays && self.letterOfCreditDetails.documentPresentationDays !== null) {
                self.documentPresentationDays(self.letterOfCreditDetails.documentPresentationDays);
            }
            if (self.letterOfCreditDetails.incoterm) {
                ReviewAmendLcModel.fetchIncoterm(self.letterOfCreditDetails.incoterm.code).done(function (data) {
                    self.dropdownLabels.incoterm(data.incotermList[0].description);
                });
            }
            if(self.letterOfCreditDetails.multiGoodsSupported && self.letterOfCreditDetails.multiGoodsSupported === "Y"){
              self.multiGoodsSupported(true);
              if(self.letterOfCreditDetails.goods && self.letterOfCreditDetails.goods.length > 0){
                self.datasourceForAmendedGoods = new oj.ArrayTableDataSource(ko.mapping.fromJS(self.letterOfCreditDetails.goods));
              }else{
                self.datasourceForAmendedGoods = new oj.ArrayTableDataSource([]);
              }
            }
            ReviewAmendLcModel.fetchBeniCountry().done(function (data) {
                var beneCountry = data.enumRepresentations[0].data.filter(function (data) {
                    return data.code === self.letterOfCreditDetails.counterPartyAddress.country;
                });
                self.beneAddress.country(beneCountry[0].description);
            });
            ReviewAmendLcModel.fetchBranch().done(function (data) {
                var beneBranch = data.branchAddressDTO.filter(function (data) {
                    return data.id === self.letterOfCreditDetails.branchId;
                });
                self.dropdownLabels.branch(beneBranch[0].branchName);
            });
            ReviewAmendLcModel.getBankDetailsBIC(self.letterOfCreditDetails.availableWith).done(function (data) {
                self.availableWithDetails(data);
            });
            if (self.letterOfCreditDetails.swiftId && self.letterOfCreditDetails.swiftId !== null) {
                ReviewAmendLcModel.getBankDetailsBIC(self.letterOfCreditDetails.swiftId).done(function (data) {
                    if (self.letterOfCreditDetails.lcType === "Import") {
                        self.additionalBankDetails(data);
                    } else {
                        self.additionalIssueBankDetails(data);
                    }
                });
            }
            if (self.letterOfCreditDetails.draftsRequired.toString() === "true" && self.letterOfCreditDetails.billingDrafts && self.letterOfCreditDetails.billingDrafts.length > 0) {
                self.datasourceForDraftReview = new oj.ArrayTableDataSource(self.letterOfCreditDetails.billingDrafts);
                self.billingDraftsLoaded(true);
            }
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
            self.checkIfLcDetailsLoaded(true);
        };

          /*This Component called with following modes
          ACCEPTANCE : From Customer Acceptance Export amendment
          VIEW : From importLC View Amendments
          REVIEW : From importLC Initiate amendment
          approval : From Approval Flow of Amendment Initiation and Export amendment
          */
        if (self.mode() === "approval" || self.mode() === "ACCEPTANCE" || self.mode() === "VIEW") {
            if (self.mode() === "ACCEPTANCE") {
                params.dashboard.headerName(self.resourceBundle.heading.customerAcceptance);
            } else if (self.mode() === "VIEW") {
              if(self.letterOfCreditDetails && self.letterOfCreditDetails.lcType){
                  if(self.letterOfCreditDetails.lcType === "Export"){
                    params.dashboard.headerName(self.resourceBundle.heading.exportLCAmendment);
                  }else{
                    params.dashboard.headerName(self.resourceBundle.heading.importLCAmendment);
                  }
              }else{
                    params.dashboard.headerName(self.resourceBundle.heading.importLCAmendment);
              }
            }
            self.checkIfLcDetailsLoaded = ko.observable(false);
            self.isExpiryDateChanged = ko.observable(false);
            self.shipmentDatePeriodRadioSetValue = ko.observable();
            self.isShipmentDateChanged = ko.observable(false);
            self.amendStages = [
                {
                    stageName: self.resourceBundle.heading.general,
                    templateName: ko.observable("trade-finance/amend-lc-details")
                },
                {
                    stageName: self.resourceBundle.heading.shipment,
                    templateName: ko.observable("trade-finance/amend-shipment-details")
                },
                {
                    stageName: self.resourceBundle.heading.documents,
                    templateName: ko.observable("trade-finance/document-details")
                },
                {
                    stageName: self.resourceBundle.heading.instructions,
                    templateName: ko.observable("trade-finance/amend-instructions-details")
                }
            ];
            if (self.mode() === "ACCEPTANCE") {
                var getNewKoModel = function () {
                    var KoModel = ReviewAmendLcModel.getNewModel();
                    return ko.mapping.fromJS(KoModel);
                };
                self.rootModelInstance = ko.observable(getNewKoModel());
                self.exportAmendAcceptanceDetails = self.rootModelInstance().ExportAmendAcceptanceDetails;
            }
            self.sectionHeading = ko.observable();
            self.additionalBankDetails = ko.observable();
            self.additionalIssueBankDetails = ko.observable();
            self.availableWithDetails = ko.observable();
            self.datasourceForDraftReview = ko.observable();
            self.datasourceForDocReview = ko.observable();
            self.datasourceForAmendedGoods = ko.observableArray();
            self.multiGoodsSupported = ko.observable(false);
            self.billingDraftsLoaded = ko.observable(false);
            self.documentsLoaded = ko.observable(false);
            self.attachedDocuments = ko.observableArray();
            self.clauseTableArrayForReview = [];
            self.selectedClauses = ko.observable();
            self.clauseModalHeading = ko.observable();
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
            self.dropdownLabels = {
                country: ko.observable(),
                product: ko.observable(),
                branch: ko.observable(),
                incoterm: ko.observable()
            };
            self.reviewDataLoaded = ko.observable(false);
            if (self.mode() === "approval" && self.params.data.customerAcceptanceStatus) {
                ReviewAmendLcModel.getAmendmentDetails(self.params.data.lcId(), self.params.data.id()).done(function (data) {
                    self.lcAmendmentDetails = ko.mapping.fromJS(data.letterOfCreditAmendment);
                    ReviewAmendLcModel.getImportLC(self.params.data.lcId(), self.lcAmendmentDetails.versionNo()).done(function (data) {
                        self.letterOfCreditDetails = data.letterOfCredit;
                        self.sectionHeading(params.baseModel.format(self.resourceBundle.labels.lcNoWithAmendNoStatus, {
                            lcNumber: self.letterOfCreditDetails.id,
                            amendmentNumber: self.params.data.id(),
                            status: capitalize(self.params.data.customerAcceptanceStatus())
                        }));
                        self.getLCDetails();
                        self.reviewDataLoaded(true);
                    });
                });
            } else {
                self.lcAmendmentDetails = self.params.data;
                ReviewAmendLcModel.getImportLC(self.params.data.lcId(), self.lcAmendmentDetails.versionNo()).done(function (data) {
                    self.letterOfCreditDetails = data.letterOfCredit;
                    if (self.mode() === "VIEW" || self.mode() === "ACCEPTANCE") {
                        if (self.lcAmendmentDetails.id) {
                            self.sectionHeading(params.baseModel.format(self.resourceBundle.labels.lcNoWithAmendNo, {
                                lcNumber: self.letterOfCreditDetails.id,
                                amendmentNumber: self.lcAmendmentDetails.id()
                            }));
                        } else {
                            self.sectionHeading(params.baseModel.format(self.resourceBundle.labels.lcNumber, { lcNumber: self.letterOfCreditDetails.id }));
                        }
                    } else {
                        self.sectionHeading(params.baseModel.format(self.resourceBundle.labels.lcNumber, { lcNumber: self.letterOfCreditDetails.id }));
                    }
                    self.getLCDetails();
                    self.reviewDataLoaded(true);
                });
            }
        } else {
            self.reviewDataLoaded(true);
            params.dashboard.headerName(self.resourceBundle.heading.initiateLCAmendment);
        }
        self.exposureAmount = ko.computed(function () {
            if (self.reviewDataLoaded()) {
                if (self.lcAmendmentDetails.newAmount.amount() === null) {
                    return 0;
                }
                return (parseFloat(self.lcAmendmentDetails.newAmount.amount() * 0.01 * self.lcAmendmentDetails.toleranceAbove()) + parseFloat(self.lcAmendmentDetails.newAmount.amount())).toFixed(2);
            }
        });
        self.isExpiryDateChanged = ko.computed(function () {
            if (self.reviewDataLoaded()) {
                if (self.letterOfCreditDetails && self.lcAmendmentDetails.newExpiryDate() !== null) {
                    var prevExpiryDate = new Date(self.letterOfCreditDetails.expiryDate);
                    var newExpiryDate = new Date(self.lcAmendmentDetails.newExpiryDate());
                    newExpiryDate.setHours(0, 0, 0, 0);
                    return prevExpiryDate.toISOString() !== newExpiryDate.toISOString();
                }
            }
        });
        self.isShipmentDateChanged = ko.computed(function () {
            if (self.reviewDataLoaded()) {
                if (self.letterOfCreditDetails && ko.utils.unwrapObservable(self.lcAmendmentDetails.shipmentDetails.date) && self.letterOfCreditDetails.shipmentDetails.date) {
                    var prevShipmentDate = new Date(self.letterOfCreditDetails.shipmentDetails.date);
                    var newShipmentDate = new Date(self.lcAmendmentDetails.shipmentDetails.date());
                    newShipmentDate.setHours(0, 0, 0, 0);
                    return prevShipmentDate.toISOString() !== newShipmentDate.toISOString();
                }
            }
        });
        self.editAll = function () {
            var parameters = { mode: "EDIT" };
            params.dashboard.loadComponent("amend-letter-of-credit", parameters, self);
        };
        self.confirmAmendment = function () {
            self.lcAmendmentDetails.versionNo(self.letterOfCreditDetails.versionNo);
            self.lcAmendmentDetails.counterPartyName(self.letterOfCreditDetails.counterPartyName);
            ReviewAmendLcModel.initiateAmendment(self.letterOfCreditDetails.id, ko.mapping.toJSON(self.lcAmendmentDetails)).done(function (data, status, jqXhr) {
              var confirmScreenDetailsArray = [
                      [{
                          label: self.resourceBundle.lcDetails.labels.applicantName,
                          value: self.applicantName()
                      },
                      {
                          label: self.resourceBundle.lcDetails.labels.beneficiaryName,
                          value: self.beneName()
                      }
                    ],
                    [ {
                          label: self.resourceBundle.lcDetails.labels.product,
                          value: self.dropdownLabels.product()
                      },
                      {
                          label: self.resourceBundle.lcDetails.labels.dateofExpiry,
                          value: params.baseModel.formatDate(self.lcAmendmentDetails.newExpiryDate())
                      }]
              ];
              if(self.letterOfCreditDetails.advisingBankCode && self.letterOfCreditDetails.advisingBankCode !== null && self.letterOfCreditDetails.advisingBankCode !== ""){
                confirmScreenDetailsArray.push([{
                          label: self.resourceBundle.common.labels.amount,
                          value: params.baseModel.formatCurrency(self.letterOfCreditDetails.amount.amount,self.letterOfCreditDetails.amount.currency)
                      },
                      {
                          label: self.resourceBundle.instructionsDetails.labels.advBankSwiftCode,
                          value: self.letterOfCreditDetails.advisingBankCode
                      }]);
              }else{
                confirmScreenDetailsArray.push([{
                          label: self.resourceBundle.common.labels.amount,
                          value: params.baseModel.formatCurrency(self.letterOfCreditDetails.amount.amount,self.letterOfCreditDetails.amount.currency)
                      }]);
              }
                params.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXhr,
                    transactionName: self.resourceBundle.heading.initiateLCAmendment,
                    confirmScreenExtensions: {
                        isSet: true,
                        taskCode: "TF_N_ALC",
                        confirmScreenDetails: confirmScreenDetailsArray,
                        template: "confirm-screen/trade-finance"
                    }
                }, self);
            });
        };
        self.initiateAcceptance = function () {
            self.exportAmendAcceptanceDetails.customerAcceptanceStatus("ACCEPT");
            self.exportAmendAcceptanceDetails.counterPartyName(self.letterOfCreditDetails.counterPartyName);
            self.exportAmendAcceptanceDetails.newAmount.amount(self.lcAmendmentDetails.newAmount.amount());
            self.exportAmendAcceptanceDetails.newAmount.currency(self.lcAmendmentDetails.newAmount.currency());
            ReviewAmendLcModel.exportAmendAcceptance(self.lcAmendmentDetails.lcId(), self.lcAmendmentDetails.id(), ko.mapping.toJSON(self.exportAmendAcceptanceDetails)).done(function (data, status, jqXhr) {
              var confirmScreenDetailsArray = [
                      [{
                          label: self.resourceBundle.labels.lcNo,
                          value: self.lcAmendmentDetails.lcId()
                      },
                      {
                          label: self.resourceBundle.common.labels.amount,
                          value: params.baseModel.formatCurrency(self.lcAmendmentDetails.newAmount.amount(),self.lcAmendmentDetails.newAmount.currency())
                      }
                    ]
                ];
                if(self.letterOfCreditDetails.remarks && self.lcAmendmentDetails.narrative && self.letterOfCreditDetails.remarks!== null && self.letterOfCreditDetails.remarks!== "" && self.lcAmendmentDetails.narrative !== null && self.lcAmendmentDetails.narrative!== ""){
                  confirmScreenDetailsArray.push([{
                          label: self.resourceBundle.lcDetails.labels.applicantName,
                          value: self.applicantName()
                      },
                      {
                          label: self.resourceBundle.instructionsDetails.labels.remarks,
                          value: self.letterOfCreditDetails.remarks
                      }],
                      [{
                          label: self.resourceBundle.lcDetails.amendments.narrative,
                          value: self.lcAmendmentDetails.narrative
                      }]);
                }else if(self.letterOfCreditDetails.remarks && self.letterOfCreditDetails.remarks!== null && self.letterOfCreditDetails.remarks!== ""){
                  confirmScreenDetailsArray.push([{
                          label: self.resourceBundle.lcDetails.labels.applicantName,
                          value: self.applicantName()
                      },
                      {
                          label: self.resourceBundle.instructionsDetails.labels.remarks,
                          value: self.letterOfCreditDetails.remarks
                      }]);
                }else if(self.lcAmendmentDetails.narrative && self.lcAmendmentDetails.narrative!== null && self.lcAmendmentDetails.narrative!== ""){
                  confirmScreenDetailsArray.push([{
                          label: self.resourceBundle.lcDetails.labels.applicantName,
                          value: self.applicantName()
                      },
                      {
                          label: self.resourceBundle.instructionsDetails.labels.remarks,
                          value: self.lcAmendmentDetails.narrative
                      }]);
                }else{
                  confirmScreenDetailsArray.push([{
                          label: self.resourceBundle.lcDetails.labels.applicantName,
                          value: self.applicantName()
                      }]);
                }
                params.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXhr,
                    transactionName: self.resourceBundle.heading.customerAcceptance,
                    confirmScreenExtensions: {
                        isSet: true,
                        taskCode: "TF_N_ALC",
                        confirmScreenDetails: confirmScreenDetailsArray,
                        template: "confirm-screen/trade-finance"
                    }
                }, self);
            });
        };
        self.rejectAcceptance = function () {
            self.exportAmendAcceptanceDetails.customerAcceptanceStatus("REJECT");
            self.exportAmendAcceptanceDetails.counterPartyName(self.letterOfCreditDetails.counterPartyName);
            self.exportAmendAcceptanceDetails.newAmount.amount(self.lcAmendmentDetails.newAmount.amount());
            self.exportAmendAcceptanceDetails.newAmount.currency(self.lcAmendmentDetails.newAmount.currency());
            ReviewAmendLcModel.exportAmendAcceptance(self.lcAmendmentDetails.lcId(), self.lcAmendmentDetails.id(), ko.mapping.toJSON(self.exportAmendAcceptanceDetails)).done(function (data, status, jqXhr) {
            var confirmScreenDetailsArray = [
                      [{
                          label: self.resourceBundle.labels.lcNo,
                          value: self.lcAmendmentDetails.lcId()
                      },
                      {
                          label: self.resourceBundle.common.labels.amount,
                          value: params.baseModel.formatCurrency(self.lcAmendmentDetails.newAmount.amount(),self.lcAmendmentDetails.newAmount.currency())
                      }
                    ]
                ];
                if(self.letterOfCreditDetails.remarks && self.lcAmendmentDetails.narrative && self.letterOfCreditDetails.remarks!== null && self.letterOfCreditDetails.remarks!== "" && self.lcAmendmentDetails.narrative !== null && self.lcAmendmentDetails.narrative!== ""){
                  confirmScreenDetailsArray.push([{
                          label: self.resourceBundle.lcDetails.labels.applicantName,
                          value: self.applicantName()
                      },
                      {
                          label: self.resourceBundle.instructionsDetails.labels.remarks,
                          value: self.letterOfCreditDetails.remarks
                      }],
                      [{
                          label: self.resourceBundle.lcDetails.amendments.narrative,
                          value: self.lcAmendmentDetails.narrative
                      }]);
                }else if(self.lcAmendmentDetails.narrative && self.lcAmendmentDetails.narrative!== null && self.lcAmendmentDetails.narrative!== ""){
                  confirmScreenDetailsArray.push([{
                          label: self.resourceBundle.lcDetails.labels.applicantName,
                          value: self.applicantName()
                      },
                      {
                          label: self.resourceBundle.instructionsDetails.labels.remarks,
                          value: self.lcAmendmentDetails.narrative
                      }]);
                }else if(self.letterOfCreditDetails.remarks && self.letterOfCreditDetails.remarks!== null && self.letterOfCreditDetails.remarks!== ""){
                  confirmScreenDetailsArray.push([{
                          label: self.resourceBundle.lcDetails.labels.applicantName,
                          value: self.applicantName()
                      },
                      {
                          label: self.resourceBundle.instructionsDetails.labels.remarks,
                          value: self.letterOfCreditDetails.remarks
                      }]);
                }else{
                  confirmScreenDetailsArray.push([{
                          label: self.resourceBundle.lcDetails.labels.applicantName,
                          value: self.applicantName()
                      }]);
                }
                params.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXhr,
                    transactionName: self.resourceBundle.heading.customerAcceptance,
                    confirmScreenExtensions: {
                        isSet: true,
                        taskCode: "TF_N_ALC",
                        confirmScreenDetails: confirmScreenDetailsArray,
                        template: "confirm-screen/trade-finance"
                    }
                }, self);
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
        self.goBack = function () {
          if(self.setMenuAsAmendment){
              self.setMenuAsAmendment(true);
          }
          history.back();
        };
        self.getRowId = function (rowIndex) {
            return ++rowIndex;
        };
    };
    vm.prototype.dispose = function () {
        self.exposureAmount.dispose();
        self.isExpiryDateChanged.dispose();
        self.isShipmentDateChanged.dispose();
    };
    return vm;
});
