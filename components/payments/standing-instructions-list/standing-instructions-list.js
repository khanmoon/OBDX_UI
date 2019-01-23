define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/standing-instructions",
    "ojs/ojinputnumber",
    "ojs/ojtable",
    "ojs/ojpagingcontrol",
    "ojs/ojlistview",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingtabledatasource"
], function (oj, ko, $, SIModel, ResourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this, baseModel = rootParams.baseModel,
        getNewKoModel = function () {
                var KoModel = ko.mapping.fromJS(SIModel.getNewModel());
                return KoModel;
            };
        ko.utils.extend(self, rootParams.rootModel.previousState ? rootParams.rootModel.previousState.retainedData : rootParams.rootModel);
        self.resource = ResourceBundle.payments.standinginstructions;
        self.lebel = ResourceBundle.payments.label;
        self.generic = ResourceBundle.payments.generic;
        self.common = ResourceBundle.payments.common;
        rootParams.dashboard.headerName(self.resource.standinginstruction_header);
        self.SIList = ko.observableArray();
        self.isSIListLoaded = ko.observable(false);
        self.dataLoaded = ko.observable(false);
        self.stageOne = ko.observable(true);
        self.SIListDataSource = ko.observable(null);
        self.isStandingInstruction = true;
        self.paymentType = ko.observable();
        self.SIDetailsLoaded = ko.observable(false);
        self.confirmScreenDetails = ko.observable();
        self.stopClicked = ko.observable(false);
        self.paymentDetails = ko.observable({});
        self.isStandingInstruction = true;
        self.paymentType = ko.observable();
        self.selectedSIExternRfNum = ko.observable();
        self.modelWindowLoaded = ko.observable(false);
        self.SICancelModel = getNewKoModel().standingInstructionCancelModel;
        baseModel.registerComponent("payments-money-transfer", "payments");
        baseModel.registerComponent("standing-instruction-detail", "payments");
        baseModel.registerElement([
            "search-box",
            "confirm-screen"
        ]);
        self.menuItems = [
            {
                id: "view",
                label: self.lebel.view
            },
            {
                id: "stop",
                label: self.lebel.stop
            }
        ];
        self.openMenu = function (data, event) {
            $("#menuLauncher-standingInstruction-contents-" + data.externalReferenceNumber).ojMenu("open", event);
        };
        self.menuItemSelect = function (data, event) {
            self.selectedSIExternRfNum(data.externalReferenceNumber);
            if (event.target.id === "stop") {
                self.stopClicked(true);
                if (baseModel.large()) {
                    self.modelWindowLoaded(true);
                    $("#view-SI").trigger("openModal");
                } else
                    self.loadDetailsComponent(data);
            } else if (event.target.id === "view") {
                self.paymentType(data.paymentType);
                self.stopClicked(false);
                if (baseModel.large()) {
                    self.modelWindowLoaded(true);
                    $("#view-SI").trigger("openModal");
                } else
                    self.loadDetailsComponent(data);
            }
        };
        var sortAscending = true;
        function sortTxnByDate(a, b) {
            if (a.nextExecDateObj < b.nextExecDateObj)
                return sortAscending ? -1 : 1;
            else if (a.nextExecDateObj > b.nextExecDateObj)
                return sortAscending ? 1 : -1;
            return 0;
        }
        function sortTxnByAmount(a, b) {
            if (a.amount.amount < b.amount.amount)
                return sortAscending ? -1 : 1;
            else if (a.amount.amount > b.amount.amount)
                return sortAscending ? 1 : -1;
            return 0;
        }
        self.sortcallback = function (event, ui) {
            sortAscending = ui.direction === "ascending";
            if (ui.header === "nextExecutionDate") {
                self.SIList.sort(sortTxnByDate);
                self.SIListDataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.SIList(), { idAttribute: ["payeeNickName"] } || [])));
            } else if (ui.header === "amount") {
                self.SIList.sort(sortTxnByAmount);
                self.SIListDataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.SIList(), { idAttribute: ["payeeNickName"] } || [])));
            }
        };
        SIModel.init();
        self.paymentType = ko.observable();
        self.loadDetailsComponent = function (data) {
            self.dataLoaded(false);
            self.paymentType(data.paymentType);
            self.selectedSIExternRfNum(data.externalReferenceNumber);
            rootParams.dashboard.loadComponent("standing-instruction-detail", {
                externalReferenceId: self.selectedSIExternRfNum(),
                retainedData: self,
                paymentType: self.paymentType,
                isStopClicked: self.stopClicked,
                getRepeatData: self.getRepeatData,
                closeModal: self.closeModal,
                confirmScreenDetails: self.confirmScreenDetails
            }, self);
        };
        self.formatFrequency = function (fyear, fmonth, fday) {
            if (fyear && fmonth && fday)
                return rootParams.baseModel.format(self.resource.frequencymsg.everynyearsnmonthsndays, {
                    y: fyear,
                    m: fmonth,
                    d: fday
                });
            else if (fyear && fmonth)
                return rootParams.baseModel.format(self.resource.frequencymsg.everynyearsnmonths, {
                    y: fyear,
                    m: fmonth
                });
            else if (fyear && fday)
                return rootParams.baseModel.format(self.resource.frequencymsg.everynyearsndays, {
                    y: fyear,
                    d: fday
                });
            else if (fmonth && fday)
                return rootParams.baseModel.format(self.resource.frequencymsg.everynmonthsndays, {
                    m: fmonth,
                    d: fday
                });
            else if (fyear > 1)
                return rootParams.baseModel.format(self.resource.frequencymsg.everynyears, { y: fyear });
            else if (fmonth > 1)
                return rootParams.baseModel.format(self.resource.frequencymsg.everynmonths, { m: fmonth });
            else if (fday > 1)
                return rootParams.baseModel.format(self.resource.frequencymsg.everyndays, { d: fday });
            else if (fyear)
                return self.resource.frequencymsg.everyyear;
            else if (fmonth)
                return self.resource.frequencymsg.everymonth;
            else if (fday)
                return self.resource.frequencymsg.everyday;
        };
        self.closeModal = function () {
            if (self.userSegment !== "CORP" && baseModel.large()) {
                self.stopClicked(false);
                $("#view-SI").hide();
                self.modelWindowLoaded(false);
            } else
                rootParams.dashboard.hideDetails();
        };
        self.getData = function () {
            SIModel.getSIList().done(function (data) {
                self.isSIListLoaded(false);
                self.SIList.removeAll();
                if ("instructionsList" in data) {
                    for (var i = 0; i < data.instructionsList.length; i++) {
                        var obj = data.instructionsList[i];
                        obj.transactionType = self.resource.msgtype.table[obj.paymentType];
                        obj.frequency = self.formatFrequency(obj.freqYears, obj.freqMonths, obj.freqDays);
                        obj.acno = obj.debitAccountId.displayValue;
                        obj.startDate = rootParams.baseModel.formatDate(obj.startDate);
                        obj.endDate = rootParams.baseModel.formatDate(obj.endDate);
                        obj.nextExecDateObj = new Date(obj.nextExecutionDate);
                        self.SIList.push(obj);
                    }
                }
                self.SIListDataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.SIList(), { idAttribute: ["payeeNickName"] } || [])));
                self.isSIListLoaded(true);
            });
            rootParams.dashboard.backAllowed(true);
        };
        self.getData();
        self.createSI = function () {
            rootParams.dashboard.loadComponent("payments-money-transfer", {
                isStandingInstruction: true,
                retainedData: self
            });
        };
        self.getRepeatData = function (data) {
            return self.formatFrequency(data.freqYears, data.freqMonths, data.freqDays);
        };
    };
});