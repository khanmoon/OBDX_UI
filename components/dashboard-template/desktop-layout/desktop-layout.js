define([
  "ojs/ojcore",
  "knockout",
  "jquery",

  "ojL10n!resources/nls/dashboard-create",
  "ojL10n!resources/nls/design-dashboard-component-name",
  "ojL10n!resources/nls/design-dashboard-component-input", "base-model",
  "ojs/ojtable", "ojs/ojmenu",
  "ojs/ojarraytabledatasource", "jqueryui-amd/widgets/sortable", "jqueryui-amd/widgets/draggable"
], function (oj, ko, $, locale, componentNames, componentInput, baseModel) {
  "use strict";
  var sortableRow = "<div data-bind='ojContextMenu: {},attr:{id:id,rowindex:$index()}' contextmenu='dashboardContextMenu' class='oj-flex oj-sm-12 design_row'>" +
    "<!-- ko foreach:rowComponents() --><div class='oj-flex-item gridItem' data-bind='htmlBound:html,css:customGrids,attr:{designWidth:customGrids()?customGrids().substring(6):$parent.gridChoice()?12/$parent.gridChoice():null}'></div><!-- /ko -->" +
    "</div>";

  var gridTypes = {
    "1": "<ul class='connectedSortable droppable oj-flex-item' data-bind='attr:{id:id}'><!-- ko foreach:myComponents() -->" +
      "<li class='ui-state-highlight image-section' data-bind=\"attr:{id:componentName+$index()+$parentContext.$index(),'dd-el-width':width.large,'dd-el-height':height,'dd-el-module':module,'dd-el-icon':icon,'dd-el-template':template,'dd-el-input':JSON.stringify(input)}\">" +
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
  /**
   * The function is called to set Grid Controls
   * @param  {Object} noOfGrids It will set number of grids required for the Grid
   * @function GridControls
   * @returns {void}
   */
  function GridControls(noOfGrids) {
    var self = this;
    self.html = gridTypes[noOfGrids];
    self.myComponents = ko.observableArray();
    self.id = "designGrid" + new baseModel().incrementIdCount();
    self.customGrids = ko.observable();
  }
  /**
   * The function is called to set Droppable Grid Controls
   * @param  {Object} data The data to intialize the control
   * @param  {Object} extraParams It will set input if any required for the control
   * @function DroppableGrid
   * @returns {void}
   */
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
  var customGridReference;
  var refreshGridSizeInput;
  /**
   * The function is called to refresh Grid input values
   * @function refreshCustomGridChoice
   * @returns {void}
   */
  function refreshCustomGridChoice() {
    refreshGridSizeInput(false);
    ko.tasks.runEarly();
    customGridReference().forEach(function (element, index) {
      customGridReference()[index] = "";
    });
    refreshGridSizeInput(true);
  }
  /**
   * The function is called to set Row Controls
   * @param  {Object} type The type to set html for the control
   * @function RowControls
   * @returns {void}
   */
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
            self.updateAllowedProperty();
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

      } else if (newValue === "custom") {
        $("#customGrid").trigger("openModal");
        refreshCustomGridChoice();
        $("#customGrid").attr("custom-row", $("#" + self.id).parent().index());
      }
    });
    self.updateAllowedProperty = function () {
      var allowed_width = (12 / parseInt(self.gridChoice()));
      $("#" + self.id + " ul").each(function (index, element) {
        $(element).attr("allowed-width", allowed_width);
      });
    };
  }

  var vm = function (params) {
    var self = this;
    ko.utils.extend(self, params.rootModel);
    var componentList=[];
    self.componentListPromise.then(function(){
      self.moduleComponentsDesktop().forEach(function(element){
        componentList.push(element);
      });
    });
    self.resourceBundle = locale;
    self.componentNameNLS = componentNames;
    self.componentInputNLS = componentInput;
    self.refreshGridSizeInput = ko.observable(true);
    refreshGridSizeInput = self.refreshGridSizeInput;
    var ContextMenuRow;
    self.getContextMenuRow = function (event) {
      ContextMenuRow = $(event.target).ojMenu("getCurrentOpenOptions").launcher.attr("rowindex");
    };
    self.dashboardContextMenuAction = function (event) {
      if (event.target.value !== "removeMe") {
        self.desktopTemplate()[ContextMenuRow].gridChoice(event.target.value);
      } else if (event.target.value === "removeMe") {
        self.desktopTemplate.splice(ContextMenuRow, 1);
      }
    };
    $(document).ready(function () {
      $(".connectedSortable, #componentList").sortable({
        connectWith: ".connectedSortable",
        placeholder: "highlight",
        start: function (event, ui) {
          var targetSize = ui.item[0].attributes["dd-el-width"].value;
          $("#dndOverlay").show();
          $("#design_container ul").each(function (index, ele) {
            if (targetSize.indexOf($(ele).attr("allowed-width")) >= 0) {
              $(ele).addClass("highlightTarget");
            }
          });
        },
        stop: function () {
          $("#dndOverlay").hide();
          $("#design_container ul").removeClass("highlightTarget");
        },
        update: function (event, ui) {
          if (($(ui.item[0]).attr("dd-el-width").indexOf($(ui.item[0]).parent().attr("allowed-width")) === -1) || ($(ui.item[0]).parent().attr("id") === "componentList") || event.target.id !== "componentList") {
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
      self.desktopTemplate.push(new RowControls("sortableRow"));
    };
    self.updateViewModel = function (data, row, grid, listLocation, componentInput) {
      self.desktopTemplate()[row].rowComponents()[grid].myComponents.splice(listLocation, 0, new DroppableGrid(data, componentInput));
    };
    params.baseModel.registerElement("modal-window");
    params.baseModel.registerComponent("image-caption", "dashboard-template");
    self.gridValidationTracker = ko.observable();
    self.customGridSize = ko.observable();
    self.customGridDetails = ko.observableArray();
    self.customGridSize.subscribe(function (newValue) {
      self.customGridDetails.removeAll();
      for (var i = 0; i < newValue; i++) {
        self.customGridDetails.push(null);
      }
    });
    customGridReference = self.customGridDetails;
    /**
     * The function is called to update the "allowed-width" for all droppable grids
     * @param  {Object} index Not Required
     * @param  {Object} val This is DIV for which we will update the property.
     * @function updateAllowedWidth
     * @returns {void}
     */
    function updateAllowedWidth(index, val) {
      if ($(val).parent().attr("designwidth")) {
        $(val).attr("allowed-width", $(val).parent().attr("designwidth"));
      }
    }

    self.saveCustomGridSize = function () {
      if (!params.baseModel.showComponentValidationErrors(self.gridValidationTracker())) {
        return;
      }
      var temp = 0,
        i;
      for (i = 0; i < self.customGridDetails().length; i++) {
        temp = temp + parseInt(self.customGridDetails()[i]);
      }
      if (isNaN(temp)) {
        $("#customErrorMessage3").show();
        return;
      }
      if (temp > 12) {
        $("#customErrorMessage2").show();
        return;
      }
      temp = ($("#customGrid").attr("custom-row"));
      self.desktopTemplate()[temp].rowComponents.removeAll();
      for (i = 0; i < self.customGridDetails().length; i++) {
        self.desktopTemplate()[temp].rowComponents.push(new GridControls("1"));
        self.desktopTemplate()[temp].rowComponents()[i].customGrids("oj-sm-" + self.customGridDetails()[i]);
      }

      setTimeout(function () {
        $("#" + self.desktopTemplate()[temp].id + " ul").each(updateAllowedWidth);
        $(".connectedSortable, #componentList").sortable({
          connectWith: ".connectedSortable",
          stop: function (event) {
            $("#design_container ul").css("background-color", "#fff");
            $("#design_container ul").removeClass("highlightTarget");
            if (event.target.id !== "componentList") {
              $(event.target).sortable("cancel");

            }
          }
        });
      }, 200);
      $("#customErrorMessage2,#customErrorMessage3").hide();
      $("#customGrid").hide();
    };

    $(".template_dashboard_design").on("click", ".removeMe", function (event) {
      var rowIndex, componentIndex, elementIndex;
      elementIndex = ($(event.target).closest("li").index());
      componentIndex = ($(event.target).closest("li").parent().parent().index());
      rowIndex = ($(event.target).closest("li").parent().parent().parent().parent().index());
      self.desktopTemplate()[rowIndex].rowComponents()[componentIndex].myComponents.splice(elementIndex, 1);
    });

    /**
     * The function is called to intialize all controls and set required data in edit mode.
     * @function createEditConfig
     * @returns {void}
     */
    function createEditConfig() {
      function processChildPanels(component){
        component.childPanel.forEach(function (subComponent) {
          if(!subComponent.module){
            subComponent.module=component.module;
          }
          params.baseModel.registerComponent(subComponent.componentName, "widgets/" + subComponent.module);
          if (typeof subComponent.data === "string") {
            subComponent.data = JSON.parse(subComponent.data.replace(/\'/g, "\""));
          }
          self.desktopTemplate()[self.desktopTemplate().length - 1].rowComponents()[self.desktopTemplate()[self.desktopTemplate().length - 1].rowComponents().length - 1].myComponents.push(new DroppableGrid(subComponent));
        });
      }
      function processComponent(component){
        params.baseModel.registerComponent(component.componentName, "widgets/" + (component.module || self.dashboardStructure.name));
                if (!component.module) {
                  component.module = self.dashboardStructure.name;
                }
                if (typeof component.data === "string") {
                  component.data = JSON.parse(component.data.replace(/\'/g, "\""));
                }
                self.desktopTemplate()[self.desktopTemplate().length - 1].rowComponents()[self.desktopTemplate()[self.desktopTemplate().length - 1].rowComponents().length - 1].myComponents.push(new DroppableGrid(component));
      }
      if (self.params.mode === "edit" && !self.desktopEdit()) {
        var rowWidth = 12;
        self.desktopEdit(true);
        self.params.data.layout.dashboardLayout.large.forEach(function (component) {
          if ((rowWidth + parseInt(component.style.substring(6))) <= 12) {
            rowWidth = rowWidth + parseInt(component.style.substring(6));
            self.desktopTemplate()[self.desktopTemplate().length - 1].rowComponents.push(new GridControls("1"));
            self.desktopTemplate()[self.desktopTemplate().length - 1].rowComponents()[self.desktopTemplate()[self.desktopTemplate().length - 1].rowComponents().length - 1].customGrids(component.style);
            if (component.childPanel.length) {
              component.childPanel.forEach(function (subComponent) {
                self.desktopTemplate()[self.desktopTemplate().length - 1].rowComponents()[self.desktopTemplate()[self.desktopTemplate().length - 1].rowComponents().length - 1].myComponents.push(new DroppableGrid(subComponent));
              });
            } else {
              self.desktopTemplate()[self.desktopTemplate().length - 1].rowComponents()[self.desktopTemplate()[self.desktopTemplate().length - 1].rowComponents().length - 1].myComponents.push(new DroppableGrid(component));
            }
          } else {
            rowWidth = parseInt(component.style.substring(6));
            self.desktopTemplate.push(new RowControls("sortableRow"));
            self.desktopTemplate()[self.desktopTemplate().length - 1].rowComponents.push(new GridControls("1"));
            self.desktopTemplate()[self.desktopTemplate().length - 1].rowComponents()[self.desktopTemplate()[self.desktopTemplate().length - 1].rowComponents().length - 1].customGrids(component.style);
            if (component.childPanel.length) {
              component.childPanel.forEach(function (subComponent) {
                self.desktopTemplate()[self.desktopTemplate().length - 1].rowComponents()[self.desktopTemplate()[self.desktopTemplate().length - 1].rowComponents().length - 1].myComponents.push(new DroppableGrid(subComponent));
              });
            } else {
              self.desktopTemplate()[self.desktopTemplate().length - 1].rowComponents()[self.desktopTemplate()[self.desktopTemplate().length - 1].rowComponents().length - 1].myComponents.push(new DroppableGrid(component));
            }
          }
        });
        setTimeout(function () {
          for (var i = 0; i < self.desktopTemplate().length; i++) {
            $("#" + self.desktopTemplate()[i].id + " ul").each(updateAllowedWidth);
          }
        }, 200);
      } else if (self.params.mode === "create") {
        setTimeout(function () {
          for (var i = 0; i < self.desktopTemplate().length; i++) {
            $("#" + self.desktopTemplate()[i].id + " ul").each(updateAllowedWidth);
          }
        }, 200);

        if (self.dashboardStructure) {
          var structure, structureType, style;
          if (self.dashboardStructure.dashboardLayout.large.length) {
            structure = self.dashboardStructure.dashboardLayout.large;
            structureType = "large";
          } else {
            structure = self.dashboardStructure.dashboardLayout.defaultLayout;
            structureType = "defaultLayout";
          }
          structure.forEach(function (component) {
            if (structureType === "large") {
              style = parseInt(component.style.substring(6));
            } else {
              style = parseInt(component.style.match(/oj\-lg\-[0-9]+/)[0].match(/[0-9]+/)[0]);
            }
            if ((rowWidth + style) <= 12) {
              rowWidth = rowWidth + style;
              self.desktopTemplate()[self.desktopTemplate().length - 1].rowComponents.push(new GridControls("1"));
              self.desktopTemplate()[self.desktopTemplate().length - 1].rowComponents()[self.desktopTemplate()[self.desktopTemplate().length - 1].rowComponents().length - 1].customGrids(component.style.match(/oj\-lg\-[0-9]+/)[0]);
              if (component.childPanel.length) {
                if(!component.module){
                  component.module=self.dashboardStructure.name;
                }
                processChildPanels(component);
              } else {
                processComponent(component);
              }
            } else {
              rowWidth = style;
              self.desktopTemplate.push(new RowControls("sortableRow"));
              self.desktopTemplate()[self.desktopTemplate().length - 1].rowComponents.push(new GridControls("1"));
              self.desktopTemplate()[self.desktopTemplate().length - 1].rowComponents()[self.desktopTemplate()[self.desktopTemplate().length - 1].rowComponents().length - 1].customGrids(component.style.match(/oj\-lg\-[0-9]+/)[0]);
              if (component.childPanel.length) {
                if(!component.module){
                  component.module=self.dashboardStructure.name;
                }
                processChildPanels(component);
              } else {
                processComponent(component);
              }
            }


          });
          setTimeout(function () {
            for (var i = 0; i < self.desktopTemplate().length; i++) {
              $("#" + self.desktopTemplate()[i].id + " ul").each(updateAllowedWidth);
            }
            params.rootModel.params.dashboardStructure = null;
            params.rootModel.dashboardStructure = null;
          }, 200);
        }else if(!self.desktopTemplate().length){
          self.desktopTemplate.push(new RowControls("sortableRow"));
          self.desktopTemplate()[0].gridChoice(3);
          self.desktopTemplate.push(new RowControls("sortableRow"));
          self.desktopTemplate()[1].gridChoice(2);
        }
      }
      setTimeout(function () {
        for (var i = 0; i < self.desktopTemplate().length; i++) {
          $("#" + self.desktopTemplate()[i].id + " ul").each(updateAllowedWidth);
        }
      }, 200);
    }
    createEditConfig();

    self.hideCustomGrid = function () {
      self.refreshGridSizeInput(false);
      self.customGridSize(2);
      $("#customGrid,#customErrorMessage2,#customErrorMessage3").hide();
      self.refreshGridSizeInput(true);
    };
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
          self.moduleComponentsDesktop.removeAll();
          self.moduleComponentsDesktop([].concat(filteredResult));
        }
      }else{
        self.moduleComponentsDesktop.removeAll();
        self.moduleComponentsDesktop([].concat(componentList));
      }
    });
    self.desktopPromiseReference();
    self.pauseVideo=function(){
      $("#tutorialVideo video").trigger("pause");
    };
    params.dashboard.headerName(locale.header);
  };
  return vm;
});