define(["module","text!./select-persona.html", "./select-persona", "text!./select-persona.css","baseModel"], function (module,template, viewModel,css,BaseModel) {
    "use strict";
    var baseModel=BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
    };
  });