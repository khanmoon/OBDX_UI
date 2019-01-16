define([
  "ojL10n!resources/nls/messages",
  "ojL10n!resources/nls/generic"
], function(Messages, Generic) {
  "use strict";
  var OriginationLocale = function() {
    return {
      root: {
        note:"Note",
        buildFormData: "You need to Approve or Reject the request first and then you can update the status of the same. There is an option to provide comments while updating the request status so that the reason or any other important information can be captured and referred on a later date.",
        createServiceRequestInfo: "This screen allows you to view and process the service requests that have been raised by the Retail users.",
        serviceRequest: {
          header: "Request Processing",
          raiseNewHeader: "Raise New Request",
          detailHeader: "Service Request Details",
          reset: "Reset",
          search: "Search",
          trackRequest: "Track Service Requests",
          help: "Help",
          raiseNewHelp: "Want to raise a new Service Request?",
          raiseNewText: "Simply type what you are looking for in the search bar and click on the search results to raise a new request. Incase you want to select the request from the available list of Requests, select a Product and Category under it to view the same.",
          back: "Back",
          ok: "Ok",
          userfirstname: "First Name",
          userlastname: "Last Name",
          partyname: "Party ID",
          statustype: "Status",
          refnumber: "Reference No",
          daterange: "Date Range",
          userid: "User Name",
          date: "Date",
          requesttype: "Request Type",
          requestedby: "Requested By",
          requesttypes: "Request Types",
          fromDateFilter: "From Date",
          toDateFilter: "To Date",
          approve: "Approve",
          cancel: "Cancel",
          reject: "Reject",
          confirmation: "Confirmation",
          serviceRequestConfigurationSaved: "Maintenance Saved Successfully",
          transactionId: "Transaction Id",
          backToDashboard: "Back to Dashboard",
          products: "Products",
          requestCategory: "Request Category",
          severity: "Severity",
          moreOptions: "More Search Options",
          lessOptions: "Less Search Options",
          srList: "Or Choose from Product and Category to raise a new Request",
          selectOneLabel:"Click here to Select",
          selectAllLabel:"Click here to Select All",
          searchByName: "Search By Request Name",
          click: {
            requestTypeClickTitle: "Click to show details for service request {refnumber}",
            requestTypeClick: "Service request type {requesttype}"
          },
          description: {
            description: "Description"
          },

          messages: {
            requesttypes: "All",
            statustype: "Please select status",
            remarks: "Please enter remarks",
            fromDate: "Please select start date of the date range",
            toDate: "Please select end date of the date range"
          },
          status: {
            status: "Status",
            PE: "Open",
            CO: "Completed",
            CA: "Cancel",
            RE: "Rejected"
          },
          trainStatusAdmin: {
            PE: "Initiated",
            CO: "Approved",
            RE: "Rejected",
            creationDate: "Date of creation : {creationDate}",
            lastUpdatedDate: "Last updated date : {updatedDate}",
            createdBy: "Created by : {createdBy}",
            updatedBy: "Updated by : {updatedBy}",
            note: "Remarks : {note}",
            complete: "Approved/Rejected"
          },
          batchProcessApprovals: {
            reject: "Reject",
            approve: "Approve",
            otherTransactionsApproval: "{nature} Transactions Approval",
            selectedTransactions: "Selected Transactions ({count})",
            remarks: "Remarks",
            cancel: "Cancel",
            confirm: "Confirm",
            modify: "Request for Modification",
            allSuccessText: "{successCount} Transaction(s) successfully {status}",
            someSuccessText: "{successCount} Transaction(s) successfully {status}, {failureCount} transaction(s) failed",
            transactionMessage: "Transaction {task} successfully.",
            removeMessage: "Click here to remove the message",
            removeMessageTitle: "Click to remove the message",
            remarksMandatory: "Please provide a comment. Max length 100."
          },
          requestName: "Request Name",
          requestCreateHeader: "Create Service Request",
          searchByType: "Search by Category",
          SRAriaLabel: "List Service Requests",
          noRecords: "No Records"
        },

        areYouSurePopUpText: "Are you sure you want to approve this request?",
        areYouSurePopUpText2: "Are you sure you want to reject this request?",
        common: Generic
      },
      ar: true,
      fr: true,
      cs: true,
      sv: true,
      en: false,
      "en-us": false,
      el: true
    };
  };
  return new OriginationLocale();
});
