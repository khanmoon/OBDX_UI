define([
  "jquery",
  "baseService",
  "framework/js/constants/constants"
], function($, BaseService, Constants) {
  "use strict";
  var fileUploadViewModel = function() {
    var baseService = BaseService.getInstance();
    return {
      listBTId: function() {
        var options = {
          url: "fileUploads/userFileIdentifiersMappings"
        };
        if(Constants.userSegment === "ADMIN"){
          options.url = "design-dashboard/data/corporateDashboard/bulk-file-upload/userFileIdentifiersMappings";
          return baseService.fetchJSON(options);
        }
          return baseService.fetch(options);

      },
      getApprovalTypes: function() {
        var options = {
          url: "enumerations/approvalTypes"
        };
        if(Constants.userSegment === "ADMIN"){
          options.url = "design-dashboard/data/corporateDashboard/bulk-file-upload/approval-types";
          return baseService.fetchJSON(options);
        }
          return baseService.fetch(options);

      },
      getFileFormatTypes: function() {
        var options = {
          url: "enumerations/formatTypes"
        };
        if(Constants.userSegment === "ADMIN"){
          options.url = "design-dashboard/data/corporateDashboard/bulk-file-upload/format-types";
          return baseService.fetchJSON(options);
        }
          return baseService.fetch(options);

      },
      getAccountingTypes: function() {
        var options = {
          url: "enumerations/accountingTypes"
        };
        if(Constants.userSegment === "ADMIN"){
          options.url = "design-dashboard/data/corporateDashboard/bulk-file-upload/accounting-types";
          return baseService.fetchJSON(options);
        }
          return baseService.fetch(options);

      },
      getTransactionTypes: function() {
        var options = {
          url: "enumerations/transactionTypes"
        };
        if(Constants.userSegment === "ADMIN"){
          options.url = "design-dashboard/data/corporateDashboard/bulk-file-upload/transactionTypes";
          return baseService.fetchJSON(options);
        }
          return baseService.fetch(options);

      },
      uploadDocument: function(btId, file) {
        var form = new FormData();
        form.append("file", file);
        form.append("FI", btId);
        var options = {
          url: "fileUploads/files",
          formData: form
        };
        return baseService.uploadFile(options);
      }
    };
  };
  return new fileUploadViewModel();
});
