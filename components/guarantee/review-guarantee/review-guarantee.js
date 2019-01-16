define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/initiate-guarantee",
    "ojs/ojaccordion",
    "ojs/ojcollapsible",
    "ojs/ojcheckboxset",
    "ojs/ojselectcombobox",
    "ojs/ojtable",
    "ojs/ojlistview",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingcontrol",
    "ojs/ojpagingtabledatasource"
], function (oj, ko, $, ReviewGuaranteeModel, locale) {
    "use strict";
    return function (params) {
        var self = this;
        ko.utils.extend(self, params.rootModel);
        self.contractList = ko.observableArray();
        self.confirmScreenDetails = params.rootModel.confirmScreenDetails;
        self.resourceBundle = locale;
        self.mode = ko.observable();
        params.baseModel.registerComponent("attach-documents", "trade-finance");
        self.disabledState = ko.observable(true);
        self.datasourceForContractReview = ko.observable();
        self.contractsLoaded = ko.observable(false);
        self.reviewTransactionName = [];
        self.reviewTransactionName.header = self.resourceBundle.generic.common.review;
        self.reviewTransactionName.reviewHeader = self.resourceBundle.heading.confirmGuarantee;
        self.stages = [
            {
                stageName: self.resourceBundle.heading.guaranteeDetails,
                templateName: "trade-finance/view-guarantees/bank-guarantee-parties"
            },
            {
                stageName: self.resourceBundle.heading.commitmentDetails,
                templateName: "trade-finance/view-guarantees/bank-guarantee-commitment"
            },
            {
                stageName: self.resourceBundle.heading.bankInstructions,
                templateName: "trade-finance/view-guarantees/bank-guarantee-instructions"
            },
            {
                stageName: self.resourceBundle.heading.guarantee,
                templateName: "trade-finance/view-guarantees/bank-guarantee-contracts"
            },
            {
                stageName: self.resourceBundle.heading.attachments,
                templateName: "attach-documents"
            }
        ];
        if (self.params.mode) {
            self.mode(self.params.mode);
        }
        if (self.mode() !== "approval") {
            params.dashboard.headerName(self.resourceBundle.heading.initiateGuarantee);
        }
        self.fillconfirmScreenExtension =function(){
            var confirmScreenDetailsArray = [
                  [ {
                        label: self.resourceBundle.guaranteeDetails.labels.applicantName,
                        value: self.applicantName()
                    },
                    {
                        label: self.resourceBundle.guaranteeDetails.labels.beneficiaryName,
                        value: self.guaranteeDetails.beneName
                    }],
                  [ {
                        label: self.resourceBundle.guaranteeDetails.labels.product,
                        value: self.dropdownLabels.product()
                    },
                    {
                        label: self.resourceBundle.guaranteeDetails.labels.expiryDate,
                        value: params.baseModel.formatDate(self.guaranteeDetails.expiryDate)
                    }],
                  [ {
                        label: self.resourceBundle.common.labels.amount,
                        value: params.baseModel.formatCurrency(self.guaranteeDetails.contractAmount.amount, self.guaranteeDetails.contractAmount.currency)
                    },
                    {
                        label: self.resourceBundle.instructionsDetails.labels.advBankSwiftCode,
                        value: self.guaranteeDetails.advisingBankCode
                    }]
            ];

            if (typeof self.confirmScreenDetails === "function")
                self.confirmScreenDetails(confirmScreenDetailsArray);
            else if (self.confirmScreenExtensions) {
                $.extend(self.confirmScreenExtensions, {
                    isSet: true,
                    taskCode: "TF_N_CBG",
                    confirmScreenDetails: confirmScreenDetailsArray,
                    template: "confirm-screen/trade-finance"
                });
            }
          };
          self.getDetails = function(){
      if(typeof self.params.guaranteeDetails!=="undefined"){
              self.guaranteeDetails = self.params.guaranteeDetails;
              if (self.guaranteeDetails.bgId && self.guaranteeDetails.bgId !== null && self.updateDraft()) {
                  ReviewGuaranteeModel.deleteGuarantee(self.guaranteeDetails.bgId);
              }

        } else {
          self.guaranteeDetails = ko.mapping.toJS(self.params.data);
        }
        self.reviewFlag = ko.observable(true);
        self.dataLoaded = ko.observable(false);
        self.attachedDocuments = ko.observable(self.guaranteeDetails.attachedDocuments);
        self.applicantName = ko.observable();
        self.additionalBankDetails = ko.observable();
        self.applicantAddress = {
            line1: ko.observable(),
            line2: ko.observable(),
            line3: ko.observable(),
            country: ko.observable()
        };
        self.dropdownLabels = {
            country: ko.observable(),
            product: ko.observable(),
            branch: ko.observable(),
            guaranteeType: ko.observable()
        };
        ReviewGuaranteeModel.fetchBeniCountry().done(function (data) {
            var beneCountry = data.enumRepresentations[0].data.filter(function (data) {
                return data.code === self.guaranteeDetails.beneAddress.country;
            });
            self.dropdownLabels.country(beneCountry[0].description);
        });
        ReviewGuaranteeModel.fetchBranch().done(function (data) {
            var beneBranch = data.branchAddressDTO.filter(function (data) {
                return data.id === self.guaranteeDetails.branchId;
            });
            self.dropdownLabels.branch(beneBranch[0].branchName);
        });
        if (self.guaranteeDetails.advisingBankCode && self.guaranteeDetails.advisingBankCode !== null) {
            ReviewGuaranteeModel.getBankDetailsBIC(self.guaranteeDetails.advisingBankCode).done(function (data) {
                self.additionalBankDetails(data);
            });
        }

        if (self.guaranteeDetails.bankGuaranteeContract && self.guaranteeDetails.bankGuaranteeContract.length > 0) {
            self.contractList(self.guaranteeDetails.bankGuaranteeContract);
            self.datasourceForContractReview(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.contractList, { idAttribute: "contractId" })));
            self.contractsLoaded(true);
        }
        ReviewGuaranteeModel.fetchGuranteeType().done(function (typeData) {
               var guaranteeType = typeData.bankGuaranteeTypeDTO.filter(function (typeData){
                   return typeData.id = self.guaranteeDetails.guaranteetype;
               });
                self.dropdownLabels.guaranteeType(guaranteeType[0].description);
           });
           Promise.all([ReviewGuaranteeModel.fetchPartyDetails(self.guaranteeDetails.partyId.value),
               ReviewGuaranteeModel.fetchProduct(self.guaranteeDetails.productId)
             ])
             .then(function(data) {
               var fetchPartyResponse = data[0];
               var fetchProductResponse = data[1];
               self.applicantName(fetchPartyResponse.party.personalDetails.fullName);
               for (var i = 0; i < fetchPartyResponse.party.addresses.length; i++) {
                   if (fetchPartyResponse.party.addresses[i].type === "PST") {
                       self.applicantAddress.line1(fetchPartyResponse.party.addresses[i].postalAddress.line1);
                       self.applicantAddress.line2(fetchPartyResponse.party.addresses[i].postalAddress.line2);
                       self.applicantAddress.line3(fetchPartyResponse.party.addresses[i].postalAddress.line3);
                       self.applicantAddress.country(fetchPartyResponse.party.addresses[i].postalAddress.country);
                   }
               }
               if (fetchProductResponse.bankGuaranteeProductDTO)
                   self.dropdownLabels.product(fetchProductResponse.bankGuaranteeProductDTO.name);
               self.fillconfirmScreenExtension();
    });
        self.dataLoaded(true);
      };
      self.getDetails();
        self.editAll = function () {
            var parameters = {
                mode: "EDIT",
                guaranteeDetails: ko.mapping.toJS(self.guaranteeDetails)
            };
            params.dashboard.loadComponent("initiate-guarantee", parameters, self);
        };
        self.getRowId = function (rowIndex) {
            return ++rowIndex;
        };
    };
});
