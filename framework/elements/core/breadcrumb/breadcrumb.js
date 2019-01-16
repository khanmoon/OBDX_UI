define([
    "knockout"
], function (ko) {
    "use strict";
    return function (params) {
        var self = this;
        ko.utils.extend(self, params.rootModel);
        self.breadcrumbs([{
                label: "home",
                type: "home"
            }]);
        self.separator = ">";
        self.onBreadCrumbChange = function (data) {
            switch (data.type) {
            case "home":
                params.dashboard.switchModule(params.dashboard.application());
                break;
            case "component":
                if (params.baseModel.QueryParams.get("page") !== data.label) {
                    var itemIndex = self.breadcrumbs().length - self.breadcrumbs().map(function (item) {
                        return item.label;
                    }).indexOf(data.label) - 1;
                    self.breadcrumbs.splice(-itemIndex, self.breadcrumbs().length);
                    history.go(-itemIndex);
                }
                break;
            }
        };
    };
});