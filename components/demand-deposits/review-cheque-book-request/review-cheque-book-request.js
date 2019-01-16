define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/review-cheque-book-request"
], function (oj, ko, $, reviewChequeBookRequestModel, ResourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.resource = ResourceBundle;
        var getNewKoModel = function () {
            var KoModel = reviewChequeBookRequestModel.getNewModel();
            return ko.mapping.fromJS(KoModel);
        };
        self.rootModelInstance = ko.observable(getNewKoModel());
        self.common = self.resource.common;
        rootParams.dashboard.headerName(self.resource.header);
        self.addresstoShow = ko.observable();
        self.address = ko.observable();
        self.reviewTransactionName = [];
        self.reviewTransactionName.header = self.resource.common.review;
        self.reviewTransactionName.reviewHeader = self.resource.common.reviewHeader;
        self.isAddressLoaded = ko.observable(false);
        if (self.addressDetails) {
            self.isAddressLoaded(true);
        } else {
            self.address = self.rootModelInstance().addressDetails;
            if (self.params.data.chequeBookDetails.chequeDeliveryDetailsDTO.addressType) {
                self.addressType = self.params.data.chequeBookDetails.chequeDeliveryDetailsDTO.addressType();
                self.addresstoShow(self.params.data.chequeBookDetails.chequeDeliveryDetailsDTO.address);
                self.address.modeofDelivery(self.params.data.chequeBookDetails.chequeDeliveryDetailsDTO.deliveryOption());
                self.address.addressType(self.addressType);
                self.address.addressTypeDescription(self.resource.chequeBookRequest.addressType[self.addressType]);
                self.address.postalAddress = self.addresstoShow();
                self.addressDetails = self.address;
                self.isAddressLoaded(true);
            } else if (!self.params.data.chequeBookDetails.chequeDeliveryDetailsDTO.addressType && self.params.data.chequeBookDetails.chequeDeliveryDetailsDTO.deliveryOption() === "BRN" && self.params.data.chequeBookDetails.chequeDeliveryDetailsDTO.branchCode) {
                self.branchCode = self.params.data.chequeBookDetails.chequeDeliveryDetailsDTO.branchCode();
                reviewChequeBookRequestModel.fetchAddress(self.branchCode).done(function (data) {
                    self.addresstoShow(data.addressDTO[0].branchAddress.postalAddress);
                    self.address.modeofDelivery(self.params.data.chequeBookDetails.chequeDeliveryDetailsDTO.deliveryOption());
                    self.address.addressType("");
                    self.address.addressTypeDescription("");
                    self.address.postalAddress = self.addresstoShow();
                    self.address.postalAddress.branchName = data.addressDTO[0].branchName;
                    self.addressDetails = self.address;
                    self.isAddressLoaded(true);
                });
            } else {
                self.addresstoShow(self.params.data.chequeBookDetails.chequeDeliveryDetailsDTO.address);
                self.address.modeofDelivery(self.params.data.chequeBookDetails.chequeDeliveryDetailsDTO.deliveryOption());
                self.address.addressType("");
                self.address.addressTypeDescription("");
                self.address.postalAddress = self.addresstoShow();
                self.addressDetails = self.address;
                self.isAddressLoaded(true);
            }
        }
        rootParams.baseModel.registerElement("address");
        (function (extensionObject) {
            extensionObject.isSet = true;
            extensionObject.data = self.params.data.chequeBookDetails;
            extensionObject.template = "confirm-screen/cheque-book-request";
            extensionObject.resourceBundle = ResourceBundle;
            extensionObject.successMessage = "";
            extensionObject.statusMessages = "";
            extensionObject.taskCode = "CH_N_CBR";
            extensionObject.confirmScreenMsgEval = function (jqXHR, txnName, status, referenceNo, hostReferenceNo) {
                return rootParams.baseModel.format(ResourceBundle.confirmationMsg[status], {
                    txnName: txnName,
                    referenceNo: referenceNo,
                    hostReferenceNo: hostReferenceNo
                });
            };
        })(self.params.confirmScreenExtensions);
    };
});
