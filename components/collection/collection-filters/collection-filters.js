define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "./model",
    "ojs/ojaccordion",
    "ojs/ojcollapsible",
    "ojs/ojvalidation",
    "ojs/ojinputtext",
    "ojs/ojradioset",
    "ojs/ojknockout-validation",
    "ojs/ojdatetimepicker",
    "ojs/ojcheckboxset",
    "ojs/ojselectcombobox"
], function (oj, ko, $, CollectionFilterModel) {
    "use strict";
    var vm = function (params) {
        var self = this,i;
        ko.utils.extend(self, params.rootModel);
        self.lcLookupFlag = ko.observable("true");
        self.disableLcDetails = ko.observable(false);
        function setClauseArray(docId, documentClauses, selectedClauses) {
            var clause = [];
            for (var k = 0; k < documentClauses.length; k++) {
                var clauseSelected = "false";
                var clauseDesc = documentClauses[k].description;
                if (selectedClauses) {
                    for (var l = 0; l < selectedClauses.length; l++) {
                        if (selectedClauses[l].id() === documentClauses[k].id) {
                            clauseSelected = "true";
                            clauseDesc = selectedClauses[l].description();
                            break;
                        }
                    }
                }
                clause.push({
                    selected: ko.observable([clauseSelected]),
                    rowId: docId + "_" + documentClauses[k].id,
                    id: documentClauses[k].id,
                    description: ko.observable(clauseDesc),
                    name: documentClauses[k].name
                });
            }
            return clause;
        }
        function setDocumentArray(productDocumentList, selectedDocumentList) {
            var clause = [];
            for (i = 0; i < productDocumentList.length; i++) {
                var clauseSelectedFlag = false;
                clause = [];
                var docSelected = "false";
                var originals = "0";
                var originalsOutOff = "0";
                var copies = 0;
                var secondOriginals = "0";
                var secondOriginalsOutOff = "0";
                var secondCopies = 0;
                for (var j = 0; j < selectedDocumentList().length; j++) {
                    if (selectedDocumentList()[j].id() === productDocumentList[i].id) {
                        docSelected = "true";
                        originals = selectedDocumentList()[j].originals();
                        if (originals.indexOf("/") !== -1) {
                            originalsOutOff = originals.split("/")[1];
                            originals = originals.split("/")[0];
                        }
                        if (selectedDocumentList()[j].secondOriginals) {
                            secondOriginals = selectedDocumentList()[j].secondOriginals();
                            if (secondOriginals.indexOf("/") !== -1) {
                                secondOriginalsOutOff = secondOriginals.split("/")[1];
                                secondOriginals = secondOriginals.split("/")[0];
                            }
                        } else {
                            secondOriginalsOutOff = 0;
                            secondOriginals = 0;
                        }
                        copies = selectedDocumentList()[j].copies();
                        if (selectedDocumentList()[j].secondCopies) {
                            secondCopies = selectedDocumentList()[j].secondCopies();
                        } else {
                            secondCopies = 0;
                        }
                        if (selectedDocumentList()[j].clause && selectedDocumentList()[j].clause().length > 0) {
                            clauseSelectedFlag = true;
                            clause = setClauseArray(productDocumentList[i].id, productDocumentList[i].clause, selectedDocumentList()[j].clause());
                        }
                    }
                }
                if (!clauseSelectedFlag) {
                    clause = setClauseArray(productDocumentList[i].id, productDocumentList[i].clause, []);
                }
                self.docArray.push({
                    docSelected: ko.observable([docSelected]),
                    id: productDocumentList[i].id,
                    docName: productDocumentList[i].name,
                    docType: productDocumentList[i].docType,
                    originals: ko.observable(originals),
                    originalsOutOff: ko.observable(originalsOutOff),
                    copies: ko.observable(copies),
                    secondOriginals: ko.observable(secondOriginals),
                    secondOriginalsOutOff: ko.observable(secondOriginalsOutOff),
                    secondCopies: ko.observable(secondCopies),
                    clause: clause
                });
                if (clauseSelectedFlag && clause.length > 0) {
                    self.clauseTableArray.push({
                        allClauseSelected: ko.observable(["false"]),
                        docId: productDocumentList[i].id,
                        docName: productDocumentList[i].name + " Clauses",
                        datasourceForClause: new oj.PagingTableDataSource(new oj.ArrayTableDataSource(clause, { idAttribute: "rowId" }))
                    });
                }
            }
            self.showDocuments(true);
        }
        function fetchDocumentListForLCProduct(productId, lcDocumentList) {
            self.docArray.removeAll();
            CollectionFilterModel.fetchLCProductDetails(productId).done(function (productDetails) {
                setDocumentArray(productDetails.letterOfCreditProductDTO.documents, ko.mapping.fromJS(lcDocumentList));
            });
        }
        self.filterValuesSubscribe = self.filterValues.lcLinked.subscribe(function (value) {
            self.resetAllLcData();
            if (value === "true") {
                self.lcLookupFlag("true");
            }
        });
        self.openLCLookup = function () {
            $("#lcLookupDialog").trigger("openModal");
        };
        if (self.params.lcId) {
            self.disableLcDetails(true);
        }
        self.loadLCDetails = function () {
            if (self.filterValues.lcNumber()) {
                self.lcLookupFlag("false");
                CollectionFilterModel.getLcDetails(self.filterValues.lcNumber()).done(function (data) {
                    self.lcDetails(data.letterOfCredit);
                });
            }
        };
        function fetchApplicantDetails(partyId) {
            CollectionFilterModel.fetchPartyDetails(partyId).done(function (data) {
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
        self.lcDdetailSubscribe = self.lcDetails.subscribe(function (letterOfCredit) {
            if (letterOfCredit !== null) {
                self.lcLookupFlag("false");
                self.filterValues.lcNumber(letterOfCredit.id);
                self.partyId(letterOfCredit.partyId.value);
                fetchApplicantDetails(self.partyId());
                self.collectionDetails.partyId.displayValue(letterOfCredit.partyId.displayValue);
                self.collectionDetails.partyId.value(letterOfCredit.partyId.value);
                self.collectionDetails.lcRefNo(letterOfCredit.id);
                self.collectionDetails.lcCustomer.displayValue(letterOfCredit.partyId.displayValue);
                self.collectionDetails.lcCustomer.value(letterOfCredit.partyId.value);
                self.collectionDetails.customerRefNo(letterOfCredit.beneRefNo);
                self.collectionDetails.bankRefNo(letterOfCredit.bankRefNo);
                self.collectionDetails.counterPartyName(letterOfCredit.counterPartyName);
                self.collectionDetails.draweePartyId.displayValue(letterOfCredit.counterPartyId.displayValue);
                self.collectionDetails.draweePartyId.value(letterOfCredit.counterPartyId.value);
                if (letterOfCredit.counterPartyAddress.line1) {
                    self.collectionDetails.counterPartyAddress.line1(letterOfCredit.counterPartyAddress.line1.replace(/&lrm;|\u200E/gi, " "));
                }
                if (letterOfCredit.counterPartyAddress.line2) {
                    self.collectionDetails.counterPartyAddress.line2(letterOfCredit.counterPartyAddress.line2.replace(/&lrm;|\u200E/gi, " "));
                }
                if (letterOfCredit.counterPartyAddress.line3) {
                    self.collectionDetails.counterPartyAddress.line3(letterOfCredit.counterPartyAddress.line3.replace(/&lrm;|\u200E/gi, " "));
                }
                if (letterOfCredit.counterPartyAddress.country) {
                    self.collectionDetails.counterPartyAddress.country(letterOfCredit.counterPartyAddress.country.replace(/&lrm;|\u200E/gi, " "));
                }
                self.draweeCountry(letterOfCredit.counterPartyAddress.country);
                self.collectionDetails.applicationDate(letterOfCredit.applicationDate);
                self.collectionDetails.swiftId(letterOfCredit.issuingBankCode);
                CollectionFilterModel.getBankDetailsBIC(self.collectionDetails.swiftId()).done(function (data) {
                    self.additionalBankDetails(data);
                    self.collectionDetails.bankName(data.name);
                    self.collectionDetails.bankAddress.line1(data.branchAddress.line1);
                    self.collectionDetails.bankAddress.line2(data.branchAddress.line2);
                    self.collectionDetails.bankAddress.line3(data.branchAddress.line3);
                    self.collectionDetails.bankAddress.country(data.branchAddress.country);
                });
                self.branchId(letterOfCredit.branchId);
                self.collectionDetails.branchId(letterOfCredit.branchId);
                self.goodsCode(letterOfCredit.shipmentDetails.goodsCode);
                self.currency(letterOfCredit.outstandingAmount.currency);
                self.collectionDetails.amount.amount(letterOfCredit.outstandingAmount.amount);
                self.collectionDetails.shipmentDetails.description(letterOfCredit.shipmentDetails.description);
                if(letterOfCredit.shipmentDetails.source && letterOfCredit.shipmentDetails.source !== undefined){
                  self.collectionDetails.shipmentDetails.source(letterOfCredit.shipmentDetails.source);
                }
                if(letterOfCredit.shipmentDetails.dischargePort && letterOfCredit.shipmentDetails.dischargePort !== undefined){
                  self.collectionDetails.shipmentDetails.dischargePort(letterOfCredit.shipmentDetails.dischargePort);
                }
                if(letterOfCredit.shipmentDetails.loadingPort && letterOfCredit.shipmentDetails.loadingPort !== undefined){
                  self.collectionDetails.shipmentDetails.loadingPort(letterOfCredit.shipmentDetails.loadingPort);
                }
                if(letterOfCredit.shipmentDetails.destination && letterOfCredit.shipmentDetails.destination !== undefined){
                  self.collectionDetails.shipmentDetails.destination(letterOfCredit.shipmentDetails.destination);
                }
                //Load goods into local array when multiple goods are supported
                if(letterOfCredit.multiGoodsSupported && letterOfCredit.multiGoodsSupported === "Y"){
                  if(letterOfCredit.goods && letterOfCredit.goods.length > 0){
                      self.goodsArray.removeAll();
                      for (i = 0; i < letterOfCredit.goods.length; i++) {
                          self.goodsArray.push({
                            id: i+1,
                            goodsCode: ko.observable(letterOfCredit.goods[i].code),
                            description: ko.observable(letterOfCredit.goods[i].description),
                            units: letterOfCredit.goods[i].noOfUnits ? ko.observable(letterOfCredit.goods[i].noOfUnits) : null,
                            pricePerUnit: letterOfCredit.goods[i].pricePerUnit ? ko.observable(letterOfCredit.goods[i].pricePerUnit) : null
                          });
                      }
                      self.datasourceForGoods = new oj.ArrayTableDataSource(self.goodsArray, { idAttribute: "id" });
                  }else{
                     self.goodsArray.removeAll();
                  }
                }
                fetchDocumentListForLCProduct(letterOfCredit.productId, letterOfCredit.document);
            }
        });
        if (self.params.lcId && self.params.lcId !== null) {
            self.filterValues.lcNumber(self.params.lcId);
            self.filterValues.lcLinked("true");
            CollectionFilterModel.getLcDetails(self.filterValues.lcNumber()).done(function (data) {
                self.lcDetails(data.letterOfCredit);
            });
        } else if (self.mode() === "EDIT") {
            self.filterValues.lcNumber(self.collectionDetails.lcRefNo());
            if (self.filterValues.lcLinked() === "true") {
                CollectionFilterModel.getLcDetails(self.filterValues.lcNumber()).done(function (data) {
                    fetchDocumentListForLCProduct(data.letterOfCredit.productId, self.collectionDetails.document);
                });
            }
        }
        self.resetLC = function () {
            self.resetAllLcData();
            self.lcLookupFlag("true");
        };
        self.resetAllLcData = function () {
            self.lcDetails(null);
            self.partyId([]);
            self.filterValues.lcNumber("");
            self.collectionDetails.lcRefNo(null);
            self.collectionDetails.lcCustomer.value(null);
            self.collectionDetails.lcCustomer.displayValue(null);
            self.collectionDetails.customerRefNo(null);
            self.collectionDetails.bankRefNo(null);
            self.collectionDetails.counterPartyName(null);
            self.collectionDetails.remarks(null);
            self.collectionDetails.billOperation(null);
            self.collectionDetails.baseDateDescription(null);
            self.collectionDetails.baseDateCode(null);
            self.collectionDetails.counterpartyId(null);
            self.collectionDetails.tenor(null);
            self.collectionDetails.swiftId(null);
            self.collectionDetails.amount.amount(null);
            self.collectionDetails.applicationDate(null);
            self.collectionDetails.branchId(null);
            self.collectionDetails.shipmentDetails.goodsCode(null);
            self.collectionDetails.shipmentDetails.description(null);
            self.collectionDetails.shipmentDetails.source(null);
            self.collectionDetails.shipmentDetails.dischargePort(null);
            self.collectionDetails.shipmentDetails.loadingPort(null);
            self.collectionDetails.shipmentDetails.destination(null);
            self.collectionDetails.counterPartyAddress.line1(null);
            self.collectionDetails.counterPartyAddress.line2(null);
            self.collectionDetails.counterPartyAddress.line3(null);
            self.collectionDetails.draweePartyId.displayValue(null);
            self.collectionDetails.draweePartyId.value(null);
            self.collectionDetails.baseDateCode(null);
            self.collectionDetails.productId(null);
            self.collectionDetails.daysFrom(null);
            self.dropdownLabels.country(null);
            self.draweeCountry([]);
            self.productId([]);
            self.branchId([]);
            self.currency(null);
            self.goodsCode(null);
            self.baseDateCode(null);
            self.additionalBankDetails("");
            self.goodsArray.removeAll();
        };
    };
    vm.prototype.dispose = function () {
        this.filterValuesSubscribe.dispose();
        this.lcDdetailSubscribe.dispose();
    };
    return vm;
});
