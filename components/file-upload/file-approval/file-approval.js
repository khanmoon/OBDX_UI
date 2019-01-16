define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/file-approval",
    "ojs/ojbutton",
    "ojs/ojinputtext"
], function (oj, ko, $, fileApprovalModel, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.Nls = resourceBundle.fileApproval;
        rootParams.dashboard.headerName(self.Nls.bulkFileApproval);
        var fileData = ko.utils.unwrapObservable(self.params.data);
        self.fileReferenceId = ko.observable(fileData.fileRefId());
        self.fileDetails = ko.observable();
        self.isFileDetailsLoaded = ko.observable(false);
        self.statusList = ko.observableArray();
        self.statusListMap = {};
        self.isStatusListLoaded = ko.observable(false);
        self.fileDetails = ko.observable();
        rootParams.baseModel.registerComponent("file-history", "file-upload");
        rootParams.baseModel.registerComponent("record-listing", "file-upload");
        fileApprovalModel.getFileStatus().done(function (data) {
            self.statusList(data.enumRepresentations[0].data);
            for (var i = 0; i < self.statusList().length; i++) {
                self.statusListMap[self.statusList()[i].code] = self.statusList()[i].description;
            }
            self.isStatusListLoaded(true);
            fileApprovalModel.listFiles(self.fileReferenceId()).done(function (data) {
                if (data.fileDetails) {
                    for (var i = 0; i < data.fileDetails.length; i++) {
                        var fileData = data.fileDetails[i].fileUpload;
                        fileData.fileStatusDesc = self.statusListMap[fileData.fileStatus];
                        fileData.fileId = fileData.key.id;
                        fileData.description = fileData.fileIdentifier + "-" + fileData.fileIdentifierDescription;
                        if (fileData.creationDate) {
                            fileData.uploadDate = rootParams.baseModel.formatDate(fileData.creationDate, "dd-MMM-yyyy hh:mm:ss a");
                        }
                        fileData.paymentType = self.Nls[fileData.transaction];
                        self.fileDetails(fileData);
                    }
                    self.isFileDetailsLoaded(true);
                }
            });
        });
    };
});