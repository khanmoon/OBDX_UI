define([
    "knockout",
    "jquery",
    "ojs/ojcore",
    "./model",
    "framework/js/constants/constants",
    "ojL10n!resources/nls/dashboard",
    "framework/js/base-models/ko/formatters",
    "platform",
    "ojs/ojoffcanvas",
    "ojs/ojbutton"
], function(ko, $, oj, DashboardModel, Constants, locale, Formatters, Platform) {
    "use strict";
    return function(rootParams) {
        var self = this;
        rootParams.baseModel.setFormatter(Formatters).then(function() {
            Object.seal(rootParams.baseModel);
        });
        var genericViewModel = rootParams.rootModel;
        self.userData = {};
        self.constants = Constants;
        self.locale = locale;
        self.layout = ko.observableArray();
        var paramContexts = {};
        var layout = [];
        self.renderModuleData = ko.observable(false);
        var initialViewPort = rootParams.baseModel.getDeviceSize();
        self.isDashboard = ko.observable(true);
        self.backAllowed = ko.observable(false);
        self.isConfirmScreenVisited = ko.observable(false);
        self.breadcrumbs = ko.observableArray();
        self.isHelpAvailable = ko.observable(false);
        self.modalComponent = ko.observable();
        self.languageOptions = ko.observableArray();
        self.menuLoaded = ko.observable(false);
        self.mailbox = {
            unreadmailCount: ko.observable(0),
            unreadAlertCount: ko.observable(0),
            unreadNotificationCount: ko.observable(0),
            totalMailboxCount: ko.observable(0)
        };
        self.loadedComponent = ko.observable().extend({
            notify: "always"
        });
        self.headerName = ko.observable();
        self.headerCaption = ko.observable();
        self.application = ko.observable();
        self.fatcaCheckRequired = ko.observable(false);
        self.pageTitle = ko.pureComputed(function() {
            return rootParams.baseModel.format("{txn_name} - {bankName}", {
                txn_name: self.headerName() || self.locale.bankName,
                bankName: self.locale.bankName
            });
        });
        self.data = {};
        var module = null;
        var prvsPage = null;
        var prvsModule = null;
        var previousState = null;
        self.helpComponent = {
            "componentName": ko.observable(),
            "params": ko.observable()
        };
        var currentModule, componentsWithStates = {
            "manage-accounts": "applicationType"
        };

        function registerRequiredComponents(registerElement) {
            registerElement([
                "responsive-img",
                "page-section",
                "row",
                "virtual-keyboard",
                "manage-accounts"
            ]);
            registerElement("menu", "core");
            registerElement("offline-notification", "core");
            registerElement("error", "core");
            registerElement("header", "core");
            registerElement("footer", "core");
            registerElement("docked-menu", "core");
            registerElement("dashboard-heading", "core");
        }
        registerRequiredComponents(rootParams.baseModel.registerElement);
        rootParams.baseModel.registerComponent("change-password", "change-password");
        rootParams.baseModel.registerComponent("compliance-base", "compliance");

        function getMailCount() {
            DashboardModel.getMailCount().then(function(data) {
                self.mailbox.unreadmailCount(data.summary.items[0].unReadCount);
                self.mailbox.unreadAlertCount(data.summary.items[1].unReadCount);
                self.mailbox.unreadNotificationCount(data.summary.items[2].unReadCount);
                self.mailbox.totalMailboxCount(self.mailbox.unreadmailCount() + self.mailbox.unreadAlertCount() + self.mailbox.unreadNotificationCount());
            });
        }

        function startLoader(time) {
            $("body").addClass("page-is-changing");
            setTimeout(function() {
                $("body").removeClass("page-is-changing");
            }, time || 1000);
        }

        function computeState(state) {
            if (state)
                return "~~" + state;
            return "";
        }

        function maintainHistory(fragment, isModule, params) {
            var shortUrl = window.location.origin + window.location.pathname,
                newUrl;
            if (isModule) {
                newUrl = shortUrl + "?module=" + fragment;
            } else {
                shortUrl += "?module=" + rootParams.baseModel.QueryParams.get("module");
                newUrl = shortUrl + "&page=" + fragment;
                if (Object.keys(componentsWithStates).indexOf(fragment) > -1) {
                    newUrl += "&state=" + params[componentsWithStates[fragment]];
                }
            }
            if (newUrl !== shortUrl) {
                history.pushState(null, null, newUrl);
            }
            return true;
        }

        function resetVM() {
            self.helpComponent.componentName(void 0);
            ko.tasks.runEarly();
            self.isHelpAvailable(false);
            self.headerName(void 0);
            self.headerCaption(void 0);
            startLoader();
            rootParams.baseModel.onTFAScreen(false);
            window.scrollTo(0, 0);
        }

        function goToDashBoard() {
            self.switchModule();
        }

        function registerDashBoardComponent() {
            if (layout.length) {
                for (var j = 0; j < layout.length; j++) {
                    if (layout[j].componentName) {
                        rootParams.baseModel.registerComponent(layout[j].componentName, "widgets/" + (layout[j].module || module.name));
                        if (layout[j].data && typeof layout[j].data === "string") {
                            layout[j].data = JSON.parse(layout[j].data.replace(/'/g, "\""));
                        }
                    }
                    if (layout[j].childPanel) {
                        for (var k = 0; k < layout[j].childPanel.length; k++) {
                            rootParams.baseModel.registerComponent(layout[j].childPanel[k].componentName, "widgets/" + (layout[j].childPanel[k].module || module.name));
                            if (layout[j].childPanel[k].data && typeof layout[j].childPanel[k].data === "string") {
                                layout[j].childPanel[k].data = JSON.parse(layout[j].childPanel[k].data.replace(/'/g, "\""));
                            }
                        }
                    }
                }
            }
        }

        var mutex = true;

        function copytolayout(noOfItems) {
            var current = self.layout().length;
            for (var i = 0; i < noOfItems; i++) {
                if (layout[current + i]) {
                    self.layout.push(layout[current + i]);
                } else {
                    // eslint-disable-next-line no-use-before-define
                    window.removeEventListener("scroll", lazyLoadWidgets);
                }
            }
            mutex = true;
        }


        function lazyLoadWidgets() {
            if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight - 25) {
                if (mutex) {
                    mutex = false;
                    copytolayout(2);
                }
            }
        }

        function setLayout() {
            var deviceSize = rootParams.baseModel.getDeviceSize() === "xl" ? "large" : rootParams.baseModel.getDeviceSize();
            if (module.dashboardLayout[deviceSize] && module.dashboardLayout[deviceSize].length) {
                layout = module.dashboardLayout[deviceSize];
            } else {
                layout = module.dashboardLayout.defaultLayout;
            }
            registerDashBoardComponent();
            self.layout.removeAll();
            if (rootParams.baseModel.small()) {
                copytolayout(3);
            } else {
                ko.utils.arrayPushAll(self.layout, layout);
            }
        }

        function setModulesData(data) {
            module = data;
            setLayout();
            self.headerName(self.locale.headers[module.titleName]);
            self.headerCaption(self.locale.headers[module.titleCaption]);
            self.renderModuleData(true);
            self.isDashboard(true);
        }

        function loadDashboard() {
            if (!currentModule.homeComponent) {
                var metadata = genericViewModel.getModuleData(currentModule.moduleName);
                if (!metadata.layout) {
                    DashboardModel.fetchModules(currentModule.moduleName).then(function(data) {
                        metadata.layout = data.dashboardDTO.layout;
                        setModulesData(metadata.layout);
                    });
                } else {
                    setModulesData(metadata.layout);
                }
            } else {
                self.data = self;
                rootParams.baseModel.registerComponent(currentModule.homeComponent, currentModule.moduleName);
                self.renderModuleData(true);
                self.loadedComponent(currentModule.homeComponent);
                self.isDashboard(false);
            }
            window.addEventListener("scroll", lazyLoadWidgets);
        }

        function dbAuthenticator(redirectURL) {
            if (Constants.authenticator === "OBDXAuthenticator") {
                if (!self.userData.userProfile) {
                    if (window.location.pathname === Constants.pages.securePage) {
                        rootParams.baseModel.switchPage({
                            module: "login",
                            redirect_url: encodeURIComponent(redirectURL),
                            menuNavigationAvailable:  genericViewModel.queryMap ? genericViewModel.queryMap.menuNavigationAvailable : genericViewModel.menuNavigationAvailable
                        }, false);
                    }
                }
            }
        }

        function componentChange(componentName, params, context) {
            params = params || {};
            if (params === context) {
                context = null;
            }
            self.breadcrumbs.push({
                label: componentName,
                type: "component"
            });
            paramContexts[componentName + computeState(params[componentsWithStates[componentName]])] = params;
            self.data = context || {};
            self.data.params = params;
            previousState = params;
            document.getElementById("message-box").closeAll(function(message) {
                return message.severity === "error";
            });
            maintainHistory(componentName, false, params);
            prvsPage = rootParams.baseModel.QueryParams.get("page");
            prvsModule = rootParams.baseModel.QueryParams.get("module");
            rootParams.baseModel.webAnalytics("trackPageView", {
                userId: self.userData.userProfile ? self.userData.userProfile.userName : ""
            }, function() {
                resetVM();
                self.loadedComponent(componentName);
                self.helpComponent.componentName(componentName);
                self.isDashboard(false);
                self.backAllowed(true);
            });
        }
        self.loadComponent = function(componentName, params, context) {
            dbAuthenticator();
            $(window).off("hashchange");
            $(document).off();
            ko.components.defaultLoader.getConfig(componentName, function(componentConfig) {
                rootParams.baseModel.currentPage.module = componentConfig.module;
                rootParams.baseModel.currentPage.component = componentName;
                rootParams.baseModel.runAxe().then(function(data) {
                    if (rootParams.baseModel.displayAccessibilityIssues(data.violations)) {
                        rootParams.baseModel.showMessages(null, ["accessibility_issues_found_see_the_console_for_details"], "ERROR");
                    }
                    componentChange(componentName, params, context);
                }).catch(function() {
                    componentChange(componentName, params, context);
                });
            });

        };
        self.switchModule = function(module) {
            if (typeof module !== "string") {
                module = null;
            }
            dbAuthenticator();
            self.breadcrumbs.remove(function(item) {
                return item.type !== "home";
            });
            $(window).off("hashchange");
            $(document).off();
            self.isConfirmScreenVisited(false);
            maintainHistory(module, true);
            prvsModule = rootParams.baseModel.QueryParams.get("module");
            currentModule = genericViewModel.getModuleData(module) || genericViewModel.getDefaultDashboard(self.userData);
            module = currentModule.moduleName;
            self.application(currentModule.moduleName);
            self.renderModuleData(false);
            document.getElementById("message-box").closeAll();
            self.layout.removeAll();
            ko.tasks.runEarly();
            history.replaceState({}, {}, window.location.origin + window.location.pathname + "?module=" + module);
            rootParams.baseModel.webAnalytics("trackPageView", {
                userId: self.userData.userProfile ? self.userData.userProfile.userName : ""
            });
            resetVM();
            loadDashboard();
        };
        self.hideDetails = function() {
            document.getElementById("message-box").closeAll();
            self.helpComponent.componentName(void 0);
            ko.tasks.runEarly();
            self.isHelpAvailable(false);
            history.back();
        };
        self.openDashBoard = function(confirmMsg) {
            if (!genericViewModel.menuNavigationAvailable) return;
            if (confirmMsg) {
                var currentTime = Date.now();
                $(".confirm-dialog").remove();
                var parent = document.createElement("div");
                parent.setAttribute("class", "confirm-dialog");
                parent.setAttribute("data-bind", "component :  {name: \"confirm-dialog\", params:{rootModel: $data}}");
                rootParams.baseModel.registerElement("confirm-dialog", "core");
                rootParams.baseModel.registerElement("modal-window");
                parent.id = currentTime;
                document.body.appendChild(parent);
                var confirmBoxContext = {
                    onYes: goToDashBoard,
                    registerElement: rootParams.baseModel.registerElement
                };
                ko.applyBindings(confirmBoxContext, document.getElementById(currentTime));
            } else {
                goToDashBoard();
            }
        };
        self.getDashboardContext = function() {
            return Object.seal({
                isDashboard: self.isDashboard,
                isHelpAvailable: self.isHelpAvailable,
                headerName: self.headerName,
                headerCaption: self.headerCaption,
                application: self.application,
                helpComponent: self.helpComponent,
                loadComponent: self.loadComponent,
                switchModule: self.switchModule,
                hideDetails: self.hideDetails,
                openDashBoard: self.openDashBoard,
                userData: self.userData,
                modalComponent: self.modalComponent,
                isConfirmScreenVisited: self.isConfirmScreenVisited,
                backAllowed: self.backAllowed,
                resetModalComponent: self.resetModalComponent,
                getMailCount: getMailCount
            });
        };
        self.menuOptionSelect = function(data) {
            if (data.name === "DASHBOARD") {
                return self.switchModule();
            }
            if (data.type && data.type === "MODULE") {
                return self.switchModule(data.resource);
            } else if (data.type && data.type === "PAGE") {
                rootParams.baseModel.switchPage(data.location.args, data.location.isSecure);
                return false;
            } else if (data.type && data.type === "FUNCTION") {
                rootParams.baseModel[data.functionName](data.params);
            } else if (data.type && data.type === "MODAL") {
                rootParams.baseModel.registerComponent(data.name, data.module);
                self.modalComponent(data.name);
            } else if (data.applicationType) {
                self.loadComponent("manage-accounts", {
                    applicationType: data.applicationType,
                    defaultTab: data.name,
                    moduleURL: data.moduleURL,
                    jsonData: data
                });
            } else {
                rootParams.baseModel.registerComponent(data.name, data.module);
                self.loadComponent(data.name, {
                    type: data.type,
                    jsonData: data
                });
            }
        };
        var parseUrl = function() {
            if (self.isConfirmScreenVisited()) {
                return self.switchModule(currentModule.moduleName);
            }
            $("#generic-authentication").remove();
            $("div.primarycontent").show();
            self.headerName(void 0);
            self.headerCaption(void 0);
            var currModule = rootParams.baseModel.QueryParams.get("module");
            if (prvsModule === currModule) {
                var currPage = rootParams.baseModel.QueryParams.get("page");
                if (currPage === "confirm-screen") return self.switchModule(currentModule.moduleName);
                self.data.params = paramContexts[currPage + computeState(rootParams.baseModel.QueryParams.get("state"))];
                self.data.previousState = previousState;
                if (prvsPage !== currPage || Object.keys(componentsWithStates).indexOf(currPage) > -1) {
                    if (currPage) {
                        self.backAllowed(true);
                        self.loadedComponent(currPage);
                        self.backAllowed(true);
                    } else {
                        self.backAllowed(false);
                        if (!currentModule.homeComponent) {
                            self.headerName(self.locale.headers[module.titleName]);
                            self.headerCaption(self.locale.headers[module.titleCaption]);
                            window.addEventListener("scroll", lazyLoadWidgets);
                            setLayout();
                            self.isDashboard(true);
                        } else {
                            if (!self.data) {
                                self.data = self;
                            }
                            self.loadedComponent(currentModule.homeComponent);
                        }
                        rootParams.baseModel.setwebhelpID(currentModule.moduleName + "-dashboard");
                    }
                    prvsPage = currPage;
                }
            } else {
                self.switchModule(currModule);
                prvsModule = currModule;
            }
        };
        $(window).bind("popstate", parseUrl);
        var resizeHandler = ko.computed(function() {
            if (initialViewPort !== rootParams.baseModel.getDeviceSize()) {
                initialViewPort = rootParams.baseModel.getDeviceSize();
                if (self.isDashboard() && module) {
                    setLayout();
                }
                self.changeMenuState("close");
            }
            return rootParams.baseModel.large() ^ rootParams.baseModel.medium() ^ rootParams.baseModel.small() ^ rootParams.baseModel.xl();
        }, self);
        self.changeMenuState = function(state) {
            if (!genericViewModel.menuNavigationAvailable) return;
            if (["close", "open", "toggle"].indexOf(state) === -1) return;
            if (!rootParams.baseModel.xl()) {
                var headerHeight = $(".fixed-header").height();
                $("#innerDrawer").height("calc(100vh - " + headerHeight + "px)");
                $("#innerDrawer").css("top", headerHeight + "px");
            } else {
                $("#innerDrawer").css("top", 0);
            }
            oj.OffcanvasUtils[state]({
                "selector": "#innerDrawer",
                "content": ".oj-web-applayout-page",
                "displayMode": "push",
                "edge": "start",
                "modality": rootParams.baseModel.xl() ? "modeless" : "modal",
                "autoDismiss": "none"
            });
        };
        $("#innerDrawer").on("ojclose",
            function() {
                self.menuLoaded(false);
                $("span.hamburger-icon").removeClass("cross");
            });
        $("#innerDrawer").on("ojopen",
            function() {
                $("span.hamburger-icon").addClass("cross");
                self.menuLoaded(open);
            });

        $(".back-top").hide();
        $(window).scroll(function() {
            if ($(this).scrollTop() > 100) {
                $(".back-top").fadeIn();
            } else {
                $(".back-top").fadeOut();
            }
        });

        $(".back-top a").click(function() {
            $("body,html").animate({
                scrollTop: 0
            }, 600);
            return false;
        });
        var partyData;
        genericViewModel.userInfoPromise.then(function(data) {
            currentModule = data.currentModule;
            if (!currentModule) {
                rootParams.baseModel.showMessages(null, [locale.noDashboardFound], "ERROR");
                return false;
            }
            self.application(currentModule.moduleName);
            $.extend(self.userData, data.userData);
            dbAuthenticator(window.location.search);
            history.replaceState({}, {}, window.location.origin + window.location.pathname + "?module=" + currentModule.moduleName);
            rootParams.baseModel.setwebhelpID(currentModule.moduleName + "-dashboard");
            if (self.userData.userProfile) {
                genericViewModel.isUserDataSet(true);
                Platform.getInstance().then(function(platform) {
                    platform("postLogin");
                });
            }
            loadDashboard();
            DashboardModel.fetchAvailableLocale().then(function(data) {
                self.languageOptions(data.enumRepresentations[0].data);
            });
            if (self.userData.userProfile && Constants.userSegment !== "ADMIN") {
                DashboardModel.fetchPartyDetails().then(function(data) {
                    if (data.party.fatcaCheckRequired) {
                        partyData = data.party;
                        self.fatcaCheckRequired(true);
                    }
                });
            }
        });

        self.showFatcaForm = function() {
            self.loadComponent("compliance-base", partyData);
        };

        self.resetModalComponent = function() {
            self.modalComponent(null);
        };

        self.dispose = function() {
            resizeHandler.dispose();
        };

        self.sessionExpiredHandler = function() {
            window.location.search = "";
        };
    };
});