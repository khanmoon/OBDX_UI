define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "./model",
    "ojL10n!resources/nls/view-letter-of-credit",
    "ojs/ojaccordion",
    "ojs/ojcollapsible",
    "ojs/ojvalidation",
    "ojs/ojknockout-validation",
    "ojs/ojvalidationgroup",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingtabledatasource",
    "ojs/ojnavigationlist",
    "ojs/ojdatetimepicker",
    "ojs/ojconveyorbelt",
    "ojs/ojradioset",
    "ojs/ojswitch",
    "ojs/ojpagingcontrol",
    "ojs/ojcheckboxset"
], function (oj, ko, $, AmendLetterOfCreditModel, resourceBundle) {
    "use strict";
    var self,vm = function (params) {
        self = this;
        var i, totalGoodsAmount = 0;
        ko.utils.extend(self, params.rootModel);
        self.resourceBundle = resourceBundle;
        self.mode = ko.observable(self.params.mode);
        self.amendLC = true;
        self.sectionHeading = ko.observable();
        self.dataLoaded = ko.observable(false);
        self.reviewDataLoaded = ko.observable(false);
        self.checkIfLcDetailsLoaded = ko.observable(false);
        self.isExpiryDateChanged = ko.observable(false);
        self.isShipmentDateChanged = ko.observable(false);
        self.shipmentDatePeriodRadioSetValue = ko.observable();
        params.baseModel.registerElement("confirm-screen");
        params.baseModel.registerComponent("review-amend-lc", "letter-of-credit");
        self.lcDetailsFromViewLC = ko.observable();
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
        self.datasourceForAmendedGoods = ko.observableArray();
        self.goodsArray = self.goodsArray || ko.observableArray([{
                id: 1,
                code: ko.observable(""),
                description: ko.observable(""),
                noOfUnits: ko.observable(""),
                pricePerUnit: ko.observable("")
        }]);
        self.datasourceForAmendedGoods = new oj.ArrayTableDataSource(self.goodsArray, { idAttribute: "id" });
        self.amendStages = [
            {
                stageName: self.resourceBundle.heading.general,
                expanded: ko.observable(true),
                templateName: ko.observable("trade-finance/amend-lc-details"),
                editable: true,
                validated: ko.observable()
            },
            {
                stageName: self.resourceBundle.heading.shipment,
                expanded: ko.observable(false),
                templateName: ko.observable("trade-finance/amend-shipment-details"),
                editable: true,
                validated: ko.observable()
            },
            {
                stageName: self.resourceBundle.heading.documents,
                expanded: ko.observable(false),
                templateName: ko.observable("trade-finance/document-details"),
                editable: false,
                validated: ko.observable()
            },
            {
                stageName: self.resourceBundle.heading.instructions,
                expanded: ko.observable(false),
                templateName: ko.observable("trade-finance/amend-instructions-details"),
                editable: true,
                validated: ko.observable()
            }
        ];


        params.dashboard.headerName(self.resourceBundle.heading.initiateLCAmendment);
        self.sectionHeading(params.baseModel.format(self.resourceBundle.labels.lcNumber, { lcNumber: self.letterOfCreditDetails.id }));
        var getNewKoModel = function () {
            var KoModel = AmendLetterOfCreditModel.getNewModel();
            return ko.mapping.fromJS(KoModel);
        };
        self.tncValue = ko.observable([]);
        self.tncValidationTracker = ko.observable();
        self.lcDetailsValidationTracker = ko.observable();
        self.shipmentDetailsValidationTracker = ko.observable();
        self.instructionDetailsValidationTracker = ko.observable();
        self.minEffectiveDate = ko.observable();

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

        AmendLetterOfCreditModel.fetchBranchDate(self.letterOfCreditDetails.branchId).done(function (res) {
            var date = new Date(res.branchDate);
            date.setDate(date.getDate() + 1);
            self.minEffectiveDate(oj.IntlConverterUtils.dateToLocalIso(new Date(date.setHours(0, 0, 0, 0))));
        });
        function loadDataIntoModel() {
            self.lcAmendmentDetails.lcId(self.letterOfCreditDetails.id);
            self.lcAmendmentDetails.issueDate(self.letterOfCreditDetails.applicationDate);
            self.lcAmendmentDetails.partyId.displayValue(self.letterOfCreditDetails.partyId.displayValue);
            self.lcAmendmentDetails.partyId.value(self.letterOfCreditDetails.partyId.value);
            self.lcAmendmentDetails.newAmount.amount(self.letterOfCreditDetails.amount.amount);
            self.lcAmendmentDetails.newAmount.currency(self.letterOfCreditDetails.amount.currency);
            self.lcAmendmentDetails.newExpiryDate(self.letterOfCreditDetails.expiryDate);
            self.lcAmendmentDetails.toleranceType(self.letterOfCreditDetails.toleranceType);
            self.lcAmendmentDetails.toleranceUnder(self.letterOfCreditDetails.toleranceUnder);
            self.lcAmendmentDetails.toleranceAbove(self.letterOfCreditDetails.toleranceAbove);
            ko.utils.extend(self.lcAmendmentDetails.shipmentDetails, self.letterOfCreditDetails.shipmentDetails);
            self.lcAmendmentDetails.shipmentDetails = ko.mapping.fromJS(self.lcAmendmentDetails.shipmentDetails);
            self.dataLoaded(true);
        }
        if (self.mode() === "CREATE") {
            self.rootModelInstance = ko.observable(getNewKoModel());
            self.lcAmendmentDetails = self.rootModelInstance().AmendedLCDetails;
            loadDataIntoModel();
            //Load goods into local array when multiple goods are supported
            if(self.letterOfCreditDetails.multiGoodsSupported && self.letterOfCreditDetails.multiGoodsSupported === "Y"){
              if(self.letterOfCreditDetails.goods && self.letterOfCreditDetails.goods.length > 0){
                  self.goodsArray.removeAll();
                  for (i = 0; i < self.letterOfCreditDetails.goods.length; i++) {
                      self.goodsArray.push({
                        id: i+1,
                        code: ko.observable(self.letterOfCreditDetails.goods[i].code),
                        description: ko.observable(self.letterOfCreditDetails.goods[i].description),
                        noOfUnits: self.letterOfCreditDetails.goods[i].noOfUnits ? ko.observable(self.letterOfCreditDetails.goods[i].noOfUnits) : ko.observable(null),
                        pricePerUnit: self.letterOfCreditDetails.goods[i].pricePerUnit ? ko.observable(self.letterOfCreditDetails.goods[i].pricePerUnit) : ko.observable(null)
                      });
                  }
                  self.datasourceForAmendedGoods = new oj.ArrayTableDataSource(self.goodsArray, { idAttribute: "id" });
              }else{
                 self.goodsArray.removeAll();
              }
            }
        } else {
            self.dataLoaded(true);
        }
        if (self.lcAmendmentDetails.shipmentDetails.date() && self.lcAmendmentDetails.shipmentDetails.date() !== null) {
            self.shipmentDatePeriodRadioSetValue("latestdateofShipment");
        } else if (self.lcAmendmentDetails.shipmentDetails.period() && self.lcAmendmentDetails.shipmentDetails.period() !== null) {
            self.shipmentDatePeriodRadioSetValue("latestperiodofShipment");
        }
        self.remainingDays = ko.computed(function () {
            if (self.letterOfCreditDetails.applicationDate !== null && self.lcAmendmentDetails.newExpiryDate() !== null) {
                var curDate = new Date(self.letterOfCreditDetails.applicationDate);
                var expiryDate = new Date(self.lcAmendmentDetails.newExpiryDate());
                var daysBeforeExpiryDate = parseInt((expiryDate - curDate) / (1000 * 60 * 60 * 24));
                daysBeforeExpiryDate = daysBeforeExpiryDate + 1;
                return daysBeforeExpiryDate;
            }
                return 365;

        });
        self.exposureAmount = ko.computed(function () {
            if (self.lcAmendmentDetails.newAmount.amount() === null) {
                return 0;
            }
            return (parseFloat(self.lcAmendmentDetails.newAmount.amount() * 0.01 * self.lcAmendmentDetails.toleranceAbove()) + parseFloat(self.lcAmendmentDetails.newAmount.amount())).toFixed(2);
        });
        self.shipmentRadioBtnSubscribe = self.shipmentDatePeriodRadioSetValue.subscribe(function (newValue) {
            if (self.mode() !== "ACCEPTANCE" && self.mode() !== "VIEW") {
                if (newValue === "latestdateofShipment") {
                    self.lcAmendmentDetails.shipmentDetails.period(null);
                } else if (newValue === "latestperiodofShipment") {
                    self.lcAmendmentDetails.shipmentDetails.date(null);
                }
            }
        });
        self.termsAndConditions = function () {
            $("#tncDialog").trigger("openModal");
        };
        self.hideTncDialog = function(){
            $("#tncDialog").hide();
        };
        function validate() {
            var validationFlag = true;
            var amendLcTracker = document.getElementById("amendLcTracker");
            if (amendLcTracker.valid === "valid") {
              self.amendStages[0].validated(true);
            }else {
                self.amendStages[0].validated(false);
                validationFlag = false;
                amendLcTracker.showMessages();
                amendLcTracker.focusOn("@firstInvalidShown");
            }

            var amendShipmentTracker = document.getElementById("amendShipmentTracker");
            if (amendShipmentTracker.valid === "valid") {
              self.amendStages[1].validated(true);
            }else {
                self.amendStages[1].validated(false);
                validationFlag = false;
                amendShipmentTracker.showMessages();
                amendShipmentTracker.focusOn("@firstInvalidShown");
            }
            var amendInsturctionsTracker = document.getElementById("amendInsturctionsTracker");
            if (amendInsturctionsTracker.valid === "valid") {
              self.amendStages[3].validated(true);
            }else {
                self.amendStages[3].validated(false);
                validationFlag = false;
                amendInsturctionsTracker.showMessages();
                amendInsturctionsTracker.focusOn("@firstInvalidShown");
            }

            var tncTracker = document.getElementById("tncTracker");
            if (tncTracker.valid !== "valid") {
                validationFlag = false;
                tncTracker.showMessages();
                tncTracker.focusOn("@firstInvalidShown");
            }
            return validationFlag;
        }
        self.amendLC = function () {
            if(self.letterOfCreditDetails.multiGoodsSupported && self.letterOfCreditDetails.multiGoodsSupported === "Y"){
              totalGoodsAmount = 0;
              self.lcAmendmentDetails.goods.removeAll();
              if(self.goodsArray().length > 0){
                for (i = 0; i < self.goodsArray().length; i++) {
                    self.lcAmendmentDetails.goods.push({
                        "code": self.goodsArray()[i].code(),
                        "description": self.goodsArray()[i].description(),
                        "noOfUnits": self.goodsArray()[i].noOfUnits(),
                        "pricePerUnit": self.goodsArray()[i].pricePerUnit()
                    });
                    totalGoodsAmount = totalGoodsAmount + (self.goodsArray()[i].noOfUnits() * self.goodsArray()[i].pricePerUnit());
                }
              }
              if(totalGoodsAmount > self.lcAmendmentDetails.newAmount.amount()){
                params.baseModel.showMessages(null, [self.resourceBundle.tradeFinanceErrors.shipmentDetails.invalidGoodsAmount], "ERROR");
                return;
              }
            }else{
                  self.lcAmendmentDetails.goods.push({
                    "code" : self.lcAmendmentDetails.shipmentDetails.goodsCode(),
                    "description" : self.lcAmendmentDetails.shipmentDetails.description(),
                    "noOfUnits" : null,
                    "pricePerUnit" : null
                 });
            }
            if (validate()) {
                var parameters = { mode: "REVIEW" };
                self.checkIfLcDetailsLoaded(true);
                params.dashboard.loadComponent("review-amend-lc", parameters, self);
            }
        };
        self.validateLCAmount = {
            validate: function (value) {
                if (value) {
                    if (value <= 0) {
                        throw new oj.ValidatorError("", self.resourceBundle.tradeFinanceErrors.lcDetails.invalidAmountErrorMessage);
                    }
                    var numberfractional1 = value.toString().split(".");
                    if (numberfractional1[0] && (numberfractional1[0].length > 13 || !/^[0-9]+$/.test(numberfractional1[0]))) {
                        throw new oj.ValidatorError("", self.resourceBundle.tradeFinanceErrors.lcDetails.lcAmountError);
                    }
                    if (numberfractional1[1]) {
                        if (numberfractional1[1].length > 2 || !/^[0-9]+$/.test(numberfractional1[1])) {
                            throw new oj.ValidatorError("", self.resourceBundle.tradeFinanceErrors.lcDetails.lcAmountError);
                        }
                    }
                }
                return true;
            }
        };

        self.goBack = function () {
            var parameters = {
                mode: "VIEW",
                letterOfCreditDetails: self.letterOfCreditDetails
            };
            params.dashboard.loadComponent("view-letter-of-credit", parameters, self);
        };
        self.getRowId = function (rowIndex) {
            return ++rowIndex;
        };
        self.remove = function (data) {
            self.goodsArray.splice(data, 1);
        };
    };
    vm.prototype.dispose = function () {
        this.shipmentRadioBtnSubscribe.dispose();
        self.remainingDays.dispose();
        self.exposureAmount.dispose();
    };
    return vm;
});
