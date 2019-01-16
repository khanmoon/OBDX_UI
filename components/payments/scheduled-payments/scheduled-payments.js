define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/scheduled-payments",
    "framework/js/constants/constants",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingtabledatasource",
    "ojs/ojlistview",
    "ojs/ojtable",
    "ojs/ojpagingcontrol",
    "ojs/ojselectcombobox"

], function(oj, ko, $, ScheduledPaymentsInfoModel, ResourceBundle, Constants) {
    "use strict";
    return function(rootParams) {
        var self = this,
            i = 0,
            getNewKoModel = function() {
                var KoModel = ScheduledPaymentsInfoModel.getNewModel();
                return KoModel;
            };
        ko.utils.extend(self, rootParams.rootModel);
        self.resource = ResourceBundle;
        if (!rootParams.dashboard.isDashboard()) {
            rootParams.dashboard.headerName(rootParams.baseModel.small() ? self.resource.upcomingPayments.smalltitle : self.resource.upcomingPayments.title);
        }
        self.upcomingPaymentsData = [];
        self.upcomingPaymentsLoaded = ko.observable(false);
        self.drillDown = ko.observable(false);
        self.currentUpcomingPaymentData = ko.observable();
        self.cancelSIClicked = ko.observable(false);
        self.fromDate = ko.observable();
        self.toDate = ko.observable();
        self.monthDate = ko.observable();
        self.switcher = ko.observable(0);
        self.validator = ko.observable();
        self.confirmScreenDetails = ko.observable();
        self.datasource = null;
        self.accountId = ko.observable();
        self.accountList = ko.observableArray();
        self.additionalDetails = ko.observable();
        self.stageOne = ko.observable(true);
        self.stageTwo = ko.observable(false);
        self.dataLoaded = ko.observable(false);
        self.isWeek = ko.observable(false);
        self.isMonth = ko.observable(true);
        self.weekCount = ko.observable(0);
        self.monthCount = ko.observable(0);
        self.menuSelection = ko.observable();
        self.menuCountOptions = ko.observableArray();
        self.uiOptions = ko.observable();

        self.paymentDetails = ko.observable({});
        self.beneficiaryName = ko.observable();
        self.extRefId = ko.observable();
        self.currentTask = ko.observable("PC_I_INSTRL");
        rootParams.baseModel.registerElement(["date-box", "modal-window", "floating-panel", "nav-bar", "confirm-screen", "account-input", "search-box", "object-card"]);
        rootParams.baseModel.registerComponent("payments-money-transfer", "payments");
        rootParams.baseModel.registerComponent("standing-instructions-landing", "payments");
        rootParams.baseModel.registerComponent("review-scheduled-payments", "payments");
        self.cancelModel = getNewKoModel().cancelModel;
        self.accountList = ko.observableArray();
        self.accountFetched = ko.observable(false);
        ScheduledPaymentsInfoModel.init();
        self.categoryChangeHandler = function(data) {
            if (data.detail.value && data.detail.trigger) {
                self.datasource = new oj.PagingTableDataSource(new oj.ArrayTableDataSource([], {
                    idAttribute: ["externalReferenceNumber", "name"]
                }));
                self.monthDatasource = null;
                self.weekDatasource = null;
                self.isWeek(false);
                self.isMonth(true);
                self.getData();
            }
        };
        self.closeDialog = function() {
            $("#noaccount").hide();
        };
        var sortAscending = true;
        /**
         * This function compares two dates
         * @param {Date} a  An object containing date
         * @param {Date} b  An object containing date
         * @return {int}  -1:when a is less than b  1:when a is greater than b  0 when a is equals to b
         */
        function sortTxnByDate(a, b) {
            if (a.date < b.date)
                return sortAscending ? -1 : 1;
            else if (a.date > b.date)
                return sortAscending ? 1 : -1;
            return 0;
        }
        self.sortcallback = function(event, ui) {
            sortAscending = ui.direction === "ascending";
            if (ui.header === "date") {
                self.monthDatasource.sort(sortTxnByDate);
                self.datasource = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.monthDatasource || [], {
                    idAttribute: ["externalReferenceNumber", "name"]
                }));
            }
        };
        self.openTab = function(applicationType, defaultTab) {
            self.selectedTab = "";
            rootParams.dashboard.loadComponent("manage-accounts", {
                applicationType: applicationType,
                defaultTab: defaultTab,
                isStandingInstruction: applicationType === "standing-instructions",
                isSuccess: self.params ? self.params.isSuccess : false
            }, self);
        };
        self.fetchAccountList = function() {
            self.accountList.removeAll();
            ScheduledPaymentsInfoModel.fetchAccountData(self.currentTask()).done(function(data) {
                if (data.accounts) {
                    self.accountList.push({
                        id: {
                            value: "all",
                            displayValue: self.resource.upcomingPayments.allAccounts
                        }
                    });
                    ko.utils.arrayPushAll(self.accountList, data.accounts);
                    self.accountFetched(true);
                } else {
                    self.accountFetched(false);
                    $("#noaccount").trigger("openModal");
                }
            }).fail(function() {
                self.accountFetched(false);
                $("#noaccount").trigger("openModal");
            });
        };
        if (!rootParams.dashboard.isDashboard())
            self.fetchAccountList();
        self.menuSelection.subscribe(function(newValue) {
            self.upcomingPaymentsLoaded(false);
            if (newValue === "month") {
                self.isMonth(true);
                self.isWeek(false);
                self.datasource = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.monthDatasource || [], {
                    idAttribute: ["externalReferenceNumber", "name"]
                }));
            } else if (newValue === "week") {
                self.isWeek(true);
                self.isMonth(false);
                self.datasource = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.weekDatasource || [], {
                    idAttribute: ["externalReferenceNumber", "name"]
                }));
            }
            ko.tasks.runEarly();
            self.upcomingPaymentsLoaded(true);
        });
        self.callMenu = function() {
            self.menuCountOptions.removeAll();
            self.menuCountOptions.push({
                label: self.resource.upcomingPayments.week,
                id: "week",
                count: self.weekCount()
            });
            self.menuCountOptions.push({
                label: self.resource.upcomingPayments.month,
                id: "month",
                count: self.monthCount()
            });
            self.menuSelection(self.menuCountOptions()[0].id);
            self.uiOptions({
                "menuFloat": "left",
                "fullWidth": false,
                "defaultOption": self.menuSelection
            });
            self.upcomingPaymentsLoaded(true);
        };
        self.uiOptions({
            "menuFloat": "left",
            "fullWidth": false,
            "defaultOption": self.menuSelection
        });
        self.showModule = function(module) {
            self.menuSelection(module.id);
        };
        self.getData = function() {
            self.upcomingPaymentsLoaded(false);
            self.baseURL = "payments/instructions?status=ACTIVE&type=ALL&fromDate={fromDate}&toDate={toDate}";
            if (Constants.userSegment === "CORP" && self.accountId() && self.accountId()[0] !== "all")
                self.baseURL = self.baseURL + "&accountId=" + self.accountId();
            var toDate = self.isWeek() ? self.toDate() : self.monthDate();
            ScheduledPaymentsInfoModel.getUpcomingPaymentsList(self.fromDate(), toDate, self.accountId(), self.baseURL).done(function(data) {
                if (data.instructionsList) {
                    var count;
                    self.upcomingPaymentsData = [];
                    count = data.instructionsList.length;
                    for (i = 0; i < count; i++) {
                        var paymenttype = data.instructionsList[i].paymentType;
                        var type = data.instructionsList[i].type;
                        self.upcomingPaymentsData[i] = {
                            date: data.instructionsList[i].nextExecutionDate,
                            amount: data.instructionsList[i].amount.amount,
                            currency: data.instructionsList[i].amount.currency,
                            formatAmount: rootParams.baseModel.formatCurrency(data.instructionsList[i].amount.amount, data.instructionsList[i].amount.currency),
                            creditAccount: data.instructionsList[i].creditAccountId.displayValue,
                            account: data.instructionsList[i].debitAccountId.displayValue,
                            dealId:data.instructionsList[i].dealId,
                            description: self.resource.upcomingPayments.type[data.instructionsList[i].paymentType],
                            externalReferenceNumber: data.instructionsList[i].externalReferenceNumber,
                            name: ("payeeNickName" in data.instructionsList[i]) ? data.instructionsList[i].payeeNickName : "-",
                            desc: self.resource.upcomingPayments.type[paymenttype],
                            descforTable: self.resource.upcomingPayments.type.table[paymenttype],
                            payType: self.resource.upcomingPayments.type[type],
                            type: type,
                            startDate: data.instructionsList[i].startDate,
                            endDate: data.instructionsList[i].endDate,
                            freqYears: data.instructionsList[i].freqYears,
                            freqDays: data.instructionsList[i].freqDays,
                            freqMonths: data.instructionsList[i].freqMonths,
                            nextExecutionDate: data.instructionsList[i].nextExecutionDate,
                            instances: data.instructionsList[i].instances,
                            paymenttype: paymenttype,
                            branch: data.instructionsList[i].branchCode,
                            remarks: data.instructionsList[i].remarks,
                            purpose: data.instructionsList[i].purpose
                        };
                    }
                    self.upcomingPaymentsData.sort(function(a, b) {
                        a = new Date(a.date);
                        b = new Date(b.date);
                        return a < b ? 1 : a > b ? -1 : 0;
                    });
                    rootParams.dashboard.backAllowed(true);
                    if (self.isWeek()) {
                        self.weekDatasource = self.upcomingPaymentsData;
                        self.datasource = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.weekDatasource || [], {
                            idAttribute: ["externalReferenceNumber", "name"]
                        }));
                        self.weekCount(count);
                        self.isWeek(false);
                        self.callMenu();
                    }
                    if (self.isMonth()) {
                        self.monthDatasource = self.upcomingPaymentsData;
                        self.monthCount(count);
                        self.isMonth(false);
                        self.isWeek(true);
                        if (Constants.userSegment === "CORP") {
                            self.getData();
                        } else if (Constants.userSegment !== "CORP" && !rootParams.dashboard.isDashboard()) {
                            self.datasource = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.monthDatasource || [], {
                                idAttribute: ["externalReferenceNumber", "name"]
                            }));

                            self.upcomingPaymentsLoaded(true);
                        }
                    }
                } else {
                    if (self.isMonth()) {
                        self.datasource = new oj.PagingTableDataSource(new oj.ArrayTableDataSource([], {
                            idAttribute: ["externalReferenceNumber", "name"]
                        }));
                        self.monthDatasource = null;
                        self.weekDatasource = null;
                        self.monthCount(0);
                        self.weekCount(0);
                    } else if (self.isWeek()) {
                        self.weekCount(0);
                        self.weekDatasource = null;

                    }
                    self.callMenu();
                }
            });
        };
        ScheduledPaymentsInfoModel.getHostDate().done(function(data) {
            self.fromDate(oj.IntlConverterUtils.dateToLocalIso(new Date(data.currentDate.valueDate)));
            var date = new Date(data.currentDate.valueDate);
            date.setDate(date.getDate() + 8);
            self.toDate(oj.IntlConverterUtils.dateToLocalIso(date));
            date.setDate(date.getDate() + 23);
            self.monthDate(oj.IntlConverterUtils.dateToLocalIso(date));
            self.getData();
        });
        var openTab;
        self.changeIcon = function(data) {
            if (data.externalReferenceNumber !== openTab) {
                $(".id_drilldown").slideUp();
                $("#" + data.externalReferenceNumber + "drilldown").slideToggle();
                openTab = data.externalReferenceNumber;
            } else {
                $(".id_drilldown").slideUp();
            }
        };
        self.getDate = function(startDate) {
            var date = startDate.substring(9, 10);
            return date;
        };
        self.cancelSI = function(data) {
            self.cancelSIClicked(false);
            self.currentUpcomingPaymentData(data);
            self.cancelSIClicked(true);
            if(!rootParams.baseModel.small())
                $("#menuButtonDialog").trigger("openModal");
            else
                rootParams.dashboard.loadComponent("cancel-standing-instruction", {
                header:self.resource.upcomingPayments.cancelTitle,
                data:self.currentUpcomingPaymentData(),
                callback:self.getData()
            },self);

        };
        self.delete = function(data) {
            self.type = data.type;
            self.extRefId(data.externalReferenceNumber);
            self.cancelModel.instructionType = data.type;
            var payload = ko.toJSON(self.cancelModel);
            ScheduledPaymentsInfoModel.initiateCancelSI(data.externalReferenceNumber, payload).done(function() {
                self.paymentDetails({
                    payeeName: data.name,
                    accountType: data.desc,
                    accountNumber: data.creditAccount,
                    accountName: "",
                    branch: data.branch,
                    amount: data.formatAmount,
                    startDate: rootParams.baseModel.formatDate(data.startDate),
                    endDate: rootParams.baseModel.formatDate(data.endDate),
                    fromAccount: data.account,
                    purpose: "",
                    frequency: self.getRepeatData(data),
                    extRefId: data.externalReferenceNumber,
                    type: data.type,
                    remarks: data.remarks,
                    isDraft: data.paymenttype.indexOf("DRAFT") > -1,
                    transactionType: data.paymenttype
                });
                self.beneficiaryName(self.paymentDetails().payeeName);
                self.dataLoaded(true);
                self.stageOne(false);
                rootParams.dashboard.loadComponent("review-scheduled-payments", {
                    reviewMode: true,
                    header: rootParams.dashboard.headerName(),
                    confirmScreenDetails: self.confirmScreenDetails(),
                    data: {
                        externalReferenceId: ko.observable(data.externalReferenceNumber)
                    }
                }, self);
                rootParams.dashboard.headerName(self.resource.upcomingPayments.titleDelete);
            });
        };
        self.back = function() {
            self.stageTwo(false);
            self.stageOne(true);
        };
        self.confirmDelete = function() {
            ScheduledPaymentsInfoModel.verifyCancelSI(self.extRefId()).done(function(data, status, jqXHR) {
                if (!data.tokenAvailable) {
                    self.stageTwo(false);
                    self.httpStatus = jqXHR.status;
                    var successMessage, statusMessages;
                    if (Constants.userSegment === "CORP" && self.httpStatus && self.httpStatus === 202) {
                        successMessage = self.resource.common.confirmScreen.corpMaker;
                        statusMessages = self.resource.common.confirmScreen.approvalMessages.PENDING_APPROVAL.statusmsg;
                    } else {
                        successMessage = self.resource.common.confirmScreen.successSI;
                        statusMessages = self.resource.common.success;
                    }
                    rootParams.dashboard.loadComponent("confirm-screen", {
                        jqXHR: jqXHR,
                        eReceiptRequired: true,
                        confirmScreenExtensions: {
                            successMessage: successMessage,
                            statusMessages: statusMessages,
                            isSet: true,
                            eReceiptRequired: true,
                            taskCode: "PC_F_PIC",
                            confirmScreenDetails: self.confirmScreenDetails(),
                            template: "confirm-screen/payments-template"
                        },
                        hostReferenceNumber: self.extRefId(),
                        transactionName: self.resource.upcomingPayments.confirmDelete
                    }, self);
                    self.transactionName = self.resource.upcomingPayments.titleDelete;
                    location.hash = "confirm";
                }
            });
        };
        self.getRepeatData = function(data) {
            if (data.type === "REC") {
                if (data.freqYears > 1) {
                    return rootParams.baseModel.format(self.resource.upcomingPayments.repeatmsgyears, {
                        n: data.freqYears
                    });
                } else if (data.freqMonths > 1) {
                    return rootParams.baseModel.format(self.resource.upcomingPayments.repeatmsgmonths, {
                        n: data.freqMonths
                    });
                } else if (data.freqDays > 1) {
                    return rootParams.baseModel.format(self.resource.upcomingPayments.repeatmsgdays, {
                        n: data.freqDays
                    });
                } else if (data.freqYears === 1) {
                    return rootParams.baseModel.format(self.resource.upcomingPayments.repeatmsgyear);
                } else if (data.freqMonths === 1) {
                    return rootParams.baseModel.format(self.resource.upcomingPayments.repeatmsgmonth);
                } else if (data.freqDays === 1) {
                    return rootParams.baseModel.format(self.resource.upcomingPayments.repeatmsgday);
                }
            } else {
                return "";
            }
        };
        self.showFloatingPanel = function() {
            $("#scheduled-payment-options").trigger("openFloatingPanel");
        };
        self.dismissDialog = function() {
            $("#menuButtonDialog").hide();
        };
        rootParams.baseModel.registerComponent("cancel-standing-instruction", "payments");
        self.menuItems = [{
            id: "cancel",
            label: self.resource.generic.common.cancel
        }];
        self.openMenu = function(data, event) {
            $("#menuLauncher-payments-contents-" + data.externalReferenceNumber).ojMenu("open", event);
        };
        self.closeHandler = function() {
            self.cancelSIClicked(false);
            $("#menuButtonDialog").hide();
        };
        self.menuItemSelect = function(data, event, ui) {
            if (ui.item[0].id === "cancel") {
                self.cancelSI(data);
            }
        };
    };
});
