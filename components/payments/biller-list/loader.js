define(["module", "text!./biller-list.html","text!./biller-list-corporate.html","./biller-list", "text!./biller-list.css","baseModel","framework/js/constants/constants"], function (module, retailTemplate, corporateTemplate, viewModel, css, BaseModel, Constants) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(Constants.userSegment === "CORP" ? corporateTemplate : retailTemplate, css, baseModel.getComponentName(module))
    };
  });
