define([
  "ojs/ojcore",
  "knockout",
  "jquery",

  "ojL10n!resources/nls/dashboard-create",
  "ojL10n!resources/nls/design-dashboard-component-name", "ojL10n!resources/nls/design-dashboard-component-input",
  "base-model",
  "ojs/ojtable", "ojs/ojmenu",
  "ojs/ojarraytabledatasource", "jqueryui-amd/widgets/sortable", "jqueryui-amd/widgets/draggable"
], function (oj, ko, $, locale, componentNames, componentInput, baseModel) {
  "use strict";
  var sortableRow = "<div data-bind='ojContextMenu: {},attr:{id:id,rowindex:$index()}' contextmenu='dashboardContextMenu' class='oj-flex oj-sm-12 design_row'>" +
    "<!-- ko foreach:rowComponents() --><div class='oj-flex-item oj-sm-12 gridItem' data-bind='htmlBound:html,css:customGrids,attr:{designWidth:customGrids()?customGrids().substring(6):$parent.gridChoice()?12/$parent.gridChoice():null}'></div><!-- /ko -->" +
    "</div>";

  var gridTypes = {
    "1": "<ul class='connectedSortable droppable oj-flex-item' data-bind='attr:{id:id}'><!-- ko foreach:myComponents() -->" +
      "<li class='ui-state-highlight image-section' data-bind=\"attr:{id:componentName+$index(),'dd-el-width':width.small?width.small:width.medium?width.medium:width.large,'dd-el-height':height,'dd-el-module':module,'dd-el-icon':icon,'dd-el-template':template,'dd-el-input':JSON.stringify(input)}\">" +
      "<div class='oj-flex oj-sm-12' data-bind=\"component:{name:componentName,params:{rootModel:$component,dashboardBuilder:{'isWidget':true},data:$data}}\"></div>" +
      "<div class='oj-flex oj-sm-12 no-pad-cols caption-section'>" +
      "<div class='oj-flex oj-sm-12 oj-flex-items-pad'>" +
      "<div class='oj-flex-item oj-sm-11'>" +
      "<label data-bind='text:$baseModel.format($component.componentNameNLS.wrapper,{name:$component.componentNameNLS.names[module][componentName]})'></label>" +
      "</div>" +
      "<span class='icons oj-flex-item no-pad-cols oj-sm-1 icon-cancel removeMe'></span>" +
      "</div>" +
      "</div>" +
      "</li>" +
      "<!-- /ko --></ul>"
  };

  function GridControls(noOfGrids) {
    var self = this;
    self.html = gridTypes[noOfGrids];
    self.myComponents = ko.observableArray();
    self.id = "designGrid" + new baseModel().incrementIdCount();
    self.customGrids = ko.observable();
  }

  function DroppableGrid(data, extraParams) {
    var self = this;
    self.componentName = data.componentName ? data.componentName : "";
    self.height = data.height ? data.height : "";
    self.icon = data.icon ? data.icon : "";
    self.module = data.module ? data.module : "";
    self.width = data.width ? data.width : "";
    self.input = data.input ? data.input : {};
    self.template = data.template ? data.template : "";
    self.segment = data.segment ? data.segment : "";
    self.data = data.data ? data.data : {};
    if (extraParams) {
      ko.utils.extend(self.data, extraParams);
    }
  }

  function RowControls(type) {
    var self = this;
    self.html = null;
    self.rowComponents = ko.observableArray();
    self.id = "designControl" + new baseModel().incrementIdCount();
    self.gridChoice = ko.observable().extend({
      notify: "always"
    });
    if (type === "sortableRow") {
      self.html = sortableRow;
    }
    self.gridChoice.subscribe(function (newValue) {
      if (newValue !== "custom") {
        $("#" + self.id + " ul").remove();
        self.rowComponents.removeAll();
        for (var i = 0; i < parseInt(newValue); i++) {
          self.rowComponents.push(new GridControls("1"));
          self.rowComponents()[i].customGrids("oj-sm-" + (12 / parseInt(newValue)));
        }
        (function () {
          setTimeout(function () {
            $(".connectedSortable, #componentList").sortable({
              connectWith: ".connectedSortable",
              stop: function (event) {
                $("#dndOverlay").hide();
                $("#design_container ul").removeClass("highlightTarget");
                if (event.target.id !== "componentList") {
                  $(event.target).sortable("cancel");
                }
              }
            });
          }, 100);
        })();

      }
    });
  }
  var vm = function (params) {
    var self = this;
    ko.utils.extend(self, params.rootModel);
    var componentList=[];
    self.componentListPromise.then(function(){
      self.moduleComponentsMobile().forEach(function(element){
        componentList.push(element);
      });
    });
    params.dashboard.headerName(locale.header);
    self.resourceBundle = locale;
    self.componentNameNLS = componentNames;
    self.componentInputNLS = componentInput;
    var ContextMenuRow;
    self.getContextMenuRow = function (event) {
      ContextMenuRow = $(event.target).ojMenu("getCurrentOpenOptions").launcher.attr("rowindex");
    };
    self.dashboardContextMenuAction = function (event) {
      if (event.target.value !== "removeMe") {
        self.mobileTemplate()[ContextMenuRow].gridChoice(event.target.value);
      } else if (event.target.value === "removeMe") {
        self.mobileTemplate.splice(ContextMenuRow, 1);
      }
    };
    $(document).ready(function () {
      $(".connectedSortable, #componentList").sortable({
        connectWith: ".connectedSortable",
        placeholder: "highlight",
        start: function () {
          $("#dndOverlay").show();
          $("#design_container ul").each(function (index, ele) {
            $(ele).addClass("highlightTarget");
          });
        },
        stop: function () {
          $("#dndOverlay").hide();
          $("#design_container ul").removeClass("highlightTarget");
        },
        update: function (event, ui) {
          if (($(ui.item[0]).parent().attr("id") === "componentList") || event.target.id !== "componentList") {
            $(event.target).sortable("cancel");
          } else {
            var temp = {};
            var updatedRowIndex = ($(ui.item[0]).parent().parent().parent().parent().index());
            var updatedGridIndex = ($(ui.item[0]).parent().parent().index());
            temp.componentName = $(ui.item[0]).attr("componentName");
            temp.height = $(ui.item[0]).attr("dd-el-height");
            temp.icon = $(ui.item[0]).attr("dd-el-icon");
            temp.module = $(ui.item[0]).attr("dd-el-module");
            temp.width = $(ui.item[0]).attr("dd-el-width");
            temp.template = $(ui.item[0]).attr("dd-el-template");
            temp.input = $(ui.item[0]).attr("dd-el-input");
            params.baseModel.registerComponent(temp.componentName, "widgets/" + temp.module);
            if (temp.input.length === 2) {
              self.updateViewModel(temp, updatedRowIndex, updatedGridIndex, ui.item.index());
            } else {
              self.getComponentInput(temp, updatedRowIndex, updatedGridIndex, ui.item.index());
            }
            $(event.target).sortable("cancel");
          }
          $("#dndOverlay").hide();
          $("#design_container ul").removeClass("highlightTarget");
        }
      });
    });
    self.inputDetails = ko.observable();
    self.renderComponentInputs = ko.observable(false);
    self.componentInputValues = ko.observableArray();
    var draggedComponent = {};
    self.componentInputSource = ko.observable();
    self.getComponentInput = function (temp, updatedRowIndex, updatedGridIndex, uiLocation) {
      draggedComponent.temp = temp;
      draggedComponent.updatedRowIndex = updatedRowIndex;
      draggedComponent.updatedGridIndex = updatedGridIndex;
      draggedComponent.uiLocation = uiLocation;
      self.componentInputValues(new Array(JSON.parse(temp.input).options.length).fill(null));
      self.componentInputSource({
        "componentName": temp.componentName,
        "module": temp.module
      });
      self.inputDetails(JSON.parse(temp.input));
      self.renderComponentInputs(true);
      $("#componentInputDialog").trigger("openModal");
    };
    self.componentInputEntered = function () {
      var componentInput = {};
      self.componentInputValues().forEach(function (input, index) {
        componentInput[self.inputDetails().options[index]] = input;
      });
      self.renderComponentInputs(false);
      $("#componentInputDialog").hide();
      self.updateViewModel(draggedComponent.temp, draggedComponent.updatedRowIndex, draggedComponent.updatedGridIndex, draggedComponent.uiLocation, componentInput);
    };
    self.addRow = function () {
      self.mobileTemplate.push(new RowControls("sortableRow"));
    };

    if (!self.mobileTemplate().length) {
      self.mobileTemplate.push(new RowControls("sortableRow"));
      self.mobileTemplate()[0].rowComponents.push(new GridControls("1"));
      if (self.params.mode === "create") {
        self.desktopTemplate().forEach(function (row) {
          row.rowComponents().forEach(function (rowComponents) {
            rowComponents.myComponents().forEach(function (component) {
              self.mobileTemplate()[0].rowComponents()[0].myComponents.push(new DroppableGrid(component));
            });
          });
        });
      }
    }
    self.updateViewModel = function (data, row, grid, listLocation, componentInput) {
      self.mobileTemplate()[row].rowComponents()[grid].myComponents.splice(listLocation, 0, new DroppableGrid(data, componentInput));
    };
    params.baseModel.registerElement("modal-window");
    params.baseModel.registerComponent("image-caption", "dashboard-template");
    params.baseModel.registerElement("modal-window");
    self.gridValidationTracker = ko.observable();
    self.customGridSize = ko.observable();
    self.customGridDetails = ko.observableArray();
    self.customGridSize.subscribe(function (newValue) {
      self.customGridDetails.removeAll();
      for (var i = 0; i < newValue; i++) {
        self.customGridDetails.push(null);
      }
    });

    $(".template_dashboard_design").on("click", ".removeMe", function (event) {
      var rowIndex, componentIndex, elementIndex;
      elementIndex = ($(event.target).closest("li").index());
      componentIndex = ($(event.target).closest("li").parent().parent().index());
      rowIndex = ($(event.target).closest("li").parent().parent().parent().parent().index());
      self.mobileTemplate()[rowIndex].rowComponents()[componentIndex].myComponents.splice(elementIndex, 1);
    });
    if (self.params.mode === "edit" && !self.mobileEdit()) {
      self.mobileEdit(true);
      self.params.data.layout.dashboardLayout.small.forEach(function (component) {
        self.mobileTemplate()[0].rowComponents()[0].myComponents.push(new DroppableGrid(component));
      });
    }
    self.showTutVideo=function(){
      $("#tutorialVideo").trigger("openModal");
    };
    self.searchComponent=ko.observable();
    self.searchComponent.subscribe(function(newValue){
      var filteredResult=[];
      if(newValue.length){
        componentList.forEach(function(value){
          if(self.componentNameNLS.names[value.module][value.componentName].toLowerCase().indexOf(newValue.toLowerCase())>=0){
            filteredResult.push(value);
          }
        });
        if(filteredResult.length){
          self.moduleComponentsMobile.removeAll();
          self.moduleComponentsMobile([].concat(filteredResult));
        }
      }else{
        self.moduleComponentsMobile.removeAll();
        self.moduleComponentsMobile([].concat(componentList));
      }
    });
    self.mobilePromiseReference();
    self.pauseVideo=function(){
      $("#tutorialVideo video").trigger("pause");
    };
  };
  return vm;
});