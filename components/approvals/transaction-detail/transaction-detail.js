define([
    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/transactions",
    "framework/js/constants/task-component-mapping"
], function (ko, $, TransactionDetailModel, resourceBundle, Task) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.Nls = resourceBundle;
        rootParams.baseModel.registerElement("amount-input");
        rootParams.baseModel.registerElement("row");
        rootParams.baseModel.registerElement("page-section");
        rootParams.baseModel.registerComponent("transaction-journey", "approvals");
        rootParams.baseModel.registerComponent("batch-process-approvals", "approvals");
        if (self.isPendingApproval) {
            self.forceShow = ko.observable(true);
        }
        self.hideOnSuccess = ko.observable(true);
        rootParams.dashboard.headerName(self.params.type);
        self.confirmScreenExtensions = {};
        self.loadComponentName = ko.observable();
        self.transactionDetails = ko.observable();
        self.transactionDetailsLoaded = ko.observable(false);
        self.transactionId = self.params.transactionId;
        self.taskForApproval = null;
        self.eReceiptTransactionList = [
            "PC_F_DDD",
            "PC_F_DDDI",
            "PC_F_IDD",
            "PC_F_IDDI",
            "CH_N_CBR",
            "TD_F_TTD",
            "PC_F_ITR",
            "PC_F_ITRI",
            "PC_F_DFT",
            "PC_F_DFTI",
            "PC_F_ITF",
            "PC_F_ITFI",
            "PC_F_SFT",
            "PC_F_SFTI",
            "TD_F_OTD",
            "TD_N_ATD",
            "LN_F_LRP",
            "PC_F_GNIP",
            "PC_F_GNITNP",
            "PC_F_GNDP",
            "CH_N_CIN",
            "PC_F_CDDD",
            "PC_F_CIDD",
            "PC_F_CIDDI",
            "PC_F_CDDDI",
            "PC_F_CITFI",
            "PC_F_CITRI",
            "PC_F_CDFTI",
            "PC_F_CITF",
            "PC_F_CITR",
            "PC_F_CDFT",
            "PC_F_CBPT",
            "TD_F_RTD",
            "PC_I_INSTRL",
            "PC_F_PIC",
            "PC_F_BPT",
            "PC_F_CSFT",
            "PC_F_CSFTI",
            "PC_F_INTRNL",
            "PC_F_DOM",
            "PC_F_IT"
        ];
        self.enableEReceipt = ko.observable(false);
        TransactionDetailModel.readTransaction(self.transactionId).done(function (data) {
            self.transactionDetails(data.transactionDTO);
            var obj = data.transactionDTO.transactionSnapshot;
            var task = Task[self.transactionDetails().taskDTO.id];
            self.taskForApproval = task;
            if (self.eReceiptTransactionList.indexOf(self.transactionDetails().taskDTO.id) !== -1) {
                self.enableEReceipt(true);
            } else {
                self.enableEReceipt(false);
            }
            self.params = {
                "data": ko.mapping.fromJS(obj),
                "transactionId": self.transactionId,
                "versionId": data.transactionDTO.version,
                "type": self.params.type,
                "taskCode": self.transactionDetails().taskDTO.id,
                "mode": "approval",
                "confirmScreenExtensions": self.confirmScreenExtensions
            };
            if (data.transactionDTO.approvalDetails.status === "MODIFICATION_REQUESTED") {
                rootParams.baseModel.registerComponent(task.initComponent.name, task.initComponent.module);
                self.loadComponentName(task.initComponent.name);
            } else {
                rootParams.baseModel.registerComponent(task.reviewComponent.name, task.reviewComponent.module);
                self.loadComponentName(task.reviewComponent.name);
            }
            self.transactionDetailsLoaded(true);
        });
        self.downloadEreceipt = function () {
            TransactionDetailModel.downloadEreceipt(self.transactionId);
        };
    };
});
