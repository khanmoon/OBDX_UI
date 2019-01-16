define([
    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/loan-analysis"
], function (ko, $, AnalysisModel,locale) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.locale = locale;
        self.summaryData = null;
        self.options = null;
        self.totalAccounts = null;
        self.filteredAccounts = null;
        self.noAccountsData = {
            image: "analysis/loans.svg",
            noAccountText: self.locale.analysis.noData,
            bottomText: self.locale.analysis.bottomText
        };
        self.dataFetched = ko.observable(false);
        self.totalOutstanding = ko.observable();
        self.totalBorrowings = ko.observable();
        self.checkedOption = ko.observable();
        self.mapModule = {
            "CON": {
                outStandingBalance: "totalActiveOutstandingBalance",
                borrowingBalance: "totalActiveBorrowings"
            },
            "ISL": {
                outStandingBalance: "totalISLActiveOutstandingBalance",
                borrowingBalance: "totalISLActiveBorrowings"
            }
        };
        self.checkedOption.subscribe(function (newValue) {
            self.totalOutstanding(rootParams.baseModel.formatCurrency(self.summaryData[self.mapModule[newValue].outStandingBalance].amount, self.summaryData[self.mapModule[newValue].outStandingBalance].currency));
            self.totalBorrowings(rootParams.baseModel.formatCurrency(self.summaryData[self.mapModule[newValue].borrowingBalance].amount, self.summaryData[self.mapModule[newValue].borrowingBalance].currency));
            self.drawData(self.summaryData[self.mapModule[newValue].outStandingBalance].amount / self.summaryData[self.mapModule[newValue].borrowingBalance].amount);
        });

        function setData(bankConfiguration, accountsData) {
            if (accountsData.accounts && accountsData.accounts.length) {
                self.totalAccounts = accountsData.accounts.length;
                var modules = bankConfiguration.bankConfigurationDTO.moduleList;
                self.summaryData = accountsData.summary.items[0];
                self.filteredAccounts = accountsData.accounts.reduce(function (accumulator, item) {
                    if (!accumulator[item.module]) {
                        accumulator[item.module] = [];
                    }
                    accumulator[item.module].push(item);
                    return accumulator;
                }, {});
                self.options = modules.map(function (item) {
                    return {
                        id: item,
                        count: self.filteredAccounts[item] ? self.filteredAccounts[item].length : 0,
                        label: self.locale.accountType[item]
                    };
                });
                self.dataFetched(true);
                ko.tasks.runEarly();
                self.checkedOption(self.options[0].id);
            }
        }

        $.when(AnalysisModel.fetchBankConfig(), AnalysisModel.fetchAccountData()).done(function (bankConfiguration, accountsData) {
            setData(bankConfiguration, accountsData);
        });

        self.drawData = function (dataPercent) {
            (function ($) {
                function LoansAnalysis(canvas, config) {
                    this.repaint(canvas, config);
                }
                LoansAnalysis.prototype = {
                    repaint: function (canvas, config) {
                        if (canvas) {
                            canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
                            this.intitialize(canvas, config);
                        }
                    },
                    intitialize: function (canvas, config) {
                        this.drawContainer(canvas, config);
                    },
                    drawContainer: function (canvas, config) {
                        var context = canvas.getContext("2d");
                        var gap = config.lineWidth * 2;
                        var r = config.radius - gap;
                        var data = config.data;
                        var lineWidth = config.lineWidth;
                        var fillColor = config.fillColor;
                        var textColor = config.textColor;
                        var font = config.font;
                        var wave = config.wave;
                        var x = config.radius + (lineWidth / 2) + 26;
                        var y = config.radius + (lineWidth / 2) + 26;
                        context.beginPath();
                        context.lineWidth = 2;
                        context.strokeStyle = textColor;
                        context.moveTo(x, y - config.radius);
                        context.lineTo(x, y - config.radius - 24);
                        context.stroke();
                        context.beginPath();
                        context.lineWidth = 2;
                        context.strokeStyle = textColor;
                        context.moveTo(x, y - config.radius - 24);
                        context.lineTo(x + 14, y - config.radius - 24);
                        context.stroke();
                        context.moveTo(x, y - config.radius - 24);
                        context.lineTo(x - 14, y - config.radius - 24);
                        context.stroke();
                        context.beginPath();
                        context.arc(x, y, config.radius, 0, Math.PI * 2);
                        context.lineWidth = 5;
                        context.strokeStyle = textColor;
                        context.stroke();
                        context.fillStyle = textColor;
                        context.fill();
                        this.animation(context, r, data, lineWidth, fillColor, x, y, wave);
                        if (typeof config.txt === "string") {
                            this.writeContent(context, textColor, font, config.radius, data, x, y, config.txt);
                        }
                        context.fillStyle = textColor;
                        context.fill();
                        context.beginPath();
                        context.lineWidth = 2;
                        context.strokeStyle = fillColor;
                        if (dataPercent === 0 || isNaN(dataPercent)) {
                            context.moveTo(x, y + config.radius);
                        } else {
                            context.moveTo(x, y + config.radius - 4);
                        }
                        context.lineTo(x, y + config.radius + 24);
                        context.stroke();
                        context.beginPath();
                        context.lineWidth = 2;
                        context.strokeStyle = fillColor;
                        context.moveTo(x, y + config.radius + 24);
                        context.lineTo(x + 14, y + config.radius + 24);
                        context.stroke();
                        context.moveTo(x, y + config.radius + 24);
                        context.lineTo(x - 14, y + config.radius + 24);
                        context.stroke();

                    },
                    fillContainer: function (context, r, data, lineWidth, fillColor, x, y, wave) {
                        context.beginPath();
                        context.globalCompositeOperation = "source-over";
                        var sy = r * ((2 * (1 - data)) + (y - r));
                        var sx = x - Math.sqrt(r * (r - ((y - sy) * (y - sy))));
                        var mx = x;
                        var my = sy;
                        var ex = (2 * mx) - sx;
                        var ey = sy;
                        var extent;
                        if (data > 0.9 || data < 0.1 || !wave) {
                            extent = sy;
                        } else {
                            extent = sy - ((mx - sx) / 4);
                        }
                        context.beginPath();
                        context.moveTo(sx, sy);
                        context.quadraticCurveTo((sx + mx) / 2, extent, mx, my);
                        context.quadraticCurveTo((mx + ex) / 2, (2 * sy) - extent, ex, ey);
                        var startAngle = -Math.asin((x - sy) / r);
                        var endAngle = Math.PI - startAngle;
                        context.arc(x, y, r, startAngle, endAngle, false);
                        context.fillStyle = fillColor;
                        context.fill();
                    },
                    writeContent: function (context, textColor, font, radius, data, x, y, txt) {
                        context.globalCompositeOperation = "source-over";
                        var size = font ? font.replace(/\D+/g, "") : 0.4 * radius;
                        context.font = font ? font : "bold " + size + "px Microsoft Yahei";
                        txt = txt.length ? txt : (data * 100) + "%";
                        var sy = y + (size / 2);
                        var sx = x - (context.measureText(txt).width / 2);
                        context.fillStyle = textColor;
                        context.fillText(txt, sx, sy);
                    },
                    animation: function (context, r, data, lineWidth, fillColor, x, y, wave) {
                        var datanow = {
                            value: 0
                        };
                        var requestAnimationFrame = window.requestAnimationFrame || window.msRequestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || function (func) {
                            setTimeout(func, 16);
                        };
                        var self = this;
                        var update = function () {
                            if (datanow.value < data) {
                                datanow.value += (data + 0.05 - datanow.value) / 15;
                                self._runing = true;
                            } else {
                                self._runing = false;
                            }
                        };
                        var step = function () {
                            self.fillContainer(context, r, datanow.value, lineWidth, fillColor, x, y, wave);
                            update();
                            if (self._runing) {
                                requestAnimationFrame(step);
                            }
                        };
                        step();
                    }
                };
                $.fn.loansChart = function (options) {
                    var config = $.extend({
                        radius: 100,
                        lineWidth: undefined,
                        data: undefined,
                        fillColor: "rgba(25, 139, 201, 1)",
                        textColor: "rgba(189, 99, 40, 1)",
                        font: "",
                        wave: false,
                        txt: undefined
                    }, options);
                    var canvas = this[0];
                    config.lineWidth = config.lineWidth ? config.lineWidth : config.radius / 24;
                    new LoansAnalysis(canvas, config);
                    return this;
                };
            }($));
            $("#loan-analysis-card").loansChart({
                radius: 68,
                lineWidth: 1.5,
                data: dataPercent,
                fillColor: "#82345b",
                textColor: "#d37da4",
                font: "",
                wave: false,
                txt: undefined
            });
        };
    };
});