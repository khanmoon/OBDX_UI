define([
  "ojs/ojcore",
  "knockout",
  "jquery",

  "ojL10n!resources/nls/dashboard-create",
  "ojL10n!resources/nls/design-dashboard-component-name",
  "ojL10n!resources/nls/design-dashboard-component-input", "base-model",
  "ojs/ojtable", "ojs/ojmenu", "ojs/ojcheckboxset",
  "ojs/ojarraytabledatasource", "jqueryui-amd/widgets/sortable", "jqueryui-amd/widgets/draggable"
], function (oj, ko, $, locale, componentNames, componentInput, baseModel) {
  "use strict";
  var sortableRow = "<div data-bind='ojContextMenu: {},attr:{id:id,rowindex:$index()}' contextmenu='dashboardContextMenu' class='oj-flex oj-sm-12 design_row'>" +
    "<!-- ko foreach:rowComponents() --><div class='oj-flex-item' data-bind='htmlBound:html,css:customGrids,attr:{designWidth:customGrids()?customGrids().substring(6):$parent.gridChoice()?12/$parent.gridChoice():null}'></div><!-- /ko -->" +
    "</div>";
  var openDialog = true;
  var gridTypes = {
    "1": "<ul class='connectedSortable droppable oj-flex-item' data-bind='attr:{id:id}'><!-- ko foreach:myComponents() -->" +
      "<li class='ui-state-highlight image-section' data-bind=\"attr:{id:componentName+$index()+$parentContext.$index(),'dd-el-width':width.medium?width.medium:width.large,'dd-el-height':height,'dd-el-module':module,'dd-el-icon':icon,'dd-el-template':template,'dd-el-input':JSON.stringify(input)}\">" +
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
    self.data=data.data?data.data:{};
    if (extraParams) {
      ko.utils.extend(self.data, extraParams);
    }
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

      } else if (newValue === "custom" && openDialog) {

        $("#customGrid").trigger("openModal");
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

  /**
   * The function is called to intialize drag and drop functionality.
   * @param  {Object} self Setting scope for function
   * @function docuemntReady
   * @returns {void}
   */
  function docuemntReady(self, params) {
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
  }

  /**
   * The function is is to copy Desktop Layout to Tab Layout
   * @param  {Object} scope Setting scope for function
   * @function userEditFunction
   * @returns {void}
   */
  function userEditFunction(scope) {
    if (!scope.tabTemplate().length) {
      scope.desktopTemplate().forEach(function (rowItem, index) {
        scope.tabTemplate.push(new RowControls("sortableRow"));
          openDialog = false;
          var rowLength=0;
          rowItem.rowComponents().forEach(function (columnItem,columnIndex) {
            scope.tabTemplate()[index].rowComponents.push(new GridControls("1"));
            var max=0;

            scope.desktopTemplate()[index].rowComponents()[columnIndex].myComponents().forEach(function(searchComponent){
              scope.moduleComponentsTab().every(function(tabComponent){
                if(tabComponent.componentName ===searchComponent.componentName && tabComponent.module===searchComponent.module){
                  if(parseInt(tabComponent.width.medium)>max){
                    max=parseInt(tabComponent.width.medium);
                    return false;
                  }
                }
                return true;
              });
            });

            rowLength=rowLength+max;
            if(rowLength>12){
              rowLength=max;
            }
            scope.tabTemplate()[index].rowComponents()[scope.tabTemplate()[index].rowComponents().length - 1].customGrids("oj-sm-"+max);
          });

      });
      (function(scope){
      setTimeout(function () {
        $(".connectedSortable, #componentList").sortable({
          connectWith: ".connectedSortable"
        });
        for (var i = 0; i < scope.tabTemplate().length; i++) {
          $("#" + scope.tabTemplate()[i].id + " ul").each(function (index, val) {
            if ($(val).parent().attr("designwidth")) {
              $(val).attr("allowed-width", $(val).parent().attr("designwidth"));
            }
          });
        }
        scope.desktopTemplate().forEach(function (item, index) {
          item.rowComponents().forEach(function (item2, index2) {
            item2.myComponents().forEach(function (item3) {
              if (item3.input.length > 2) {
                item3.input = JSON.parse(item3.input);
              }
              scope.tabTemplate()[index].rowComponents()[index2].myComponents.push(new DroppableGrid(item3));
            });
          });
        });

        openDialog = true;
      }, 200);
    })(scope);
    }
  }

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

  /**
   * The function is called to set all the required controls
   * @param  {Object} scope Setting scope for function
   * @function codeToRunAtComponentLoading
   * @returns {void}
   */
  function codeToRunAtComponentLoading(scope) {
    if (scope.params.mode === "edit" && !scope.tabEdit()) {
      scope.tabEdit(true);

      var rowWidth = 12;

      scope.params.data.layout.dashboardLayout.medium.forEach(function (component) {
        if ((rowWidth + parseInt(component.style.substring(6))) <= 12) {
          rowWidth = rowWidth + parseInt(component.style.substring(6));
          scope.tabTemplate()[scope.tabTemplate().length - 1].rowComponents.push(new GridControls("1"));
          scope.tabTemplate()[scope.tabTemplate().length - 1].rowComponents()[scope.tabTemplate()[scope.tabTemplate().length - 1].rowComponents().length - 1].customGrids(component.style);
          if (component.childPanel.length) {
            component.childPanel.forEach(function (subComponent) {
              scope.tabTemplate()[scope.tabTemplate().length - 1].rowComponents()[scope.tabTemplate()[scope.tabTemplate().length - 1].rowComponents().length - 1].myComponents.push(new DroppableGrid(subComponent));
            });
          } else {
            scope.tabTemplate()[scope.tabTemplate().length - 1].rowComponents()[scope.tabTemplate()[scope.tabTemplate().length - 1].rowComponents().length - 1].myComponents.push(new DroppableGrid(component));
          }
        } else {
          rowWidth = parseInt(component.style.substring(6));
          scope.tabTemplate.push(new RowControls("sortableRow"));
          scope.tabTemplate()[scope.tabTemplate().length - 1].rowComponents.push(new GridControls("1"));
          scope.tabTemplate()[scope.tabTemplate().length - 1].rowComponents()[scope.tabTemplate()[scope.tabTemplate().length - 1].rowComponents().length - 1].customGrids(component.style);
          if (component.childPanel.length) {
            component.childPanel.forEach(function (subComponent) {
              scope.tabTemplate()[scope.tabTemplate().length - 1].rowComponents()[scope.tabTemplate()[scope.tabTemplate().length - 1].rowComponents().length - 1].myComponents.push(new DroppableGrid(subComponent));
            });
          } else {
            scope.tabTemplate()[scope.tabTemplate().length - 1].rowComponents()[scope.tabTemplate()[scope.tabTemplate().length - 1].rowComponents().length - 1].myComponents.push(new DroppableGrid(component));
          }
        }
      });
      setTimeout(function () {
        for (var i = 0; i < scope.tabTemplate().length; i++) {
          $("#" + scope.tabTemplate()[i].id + " ul").each(updateAllowedWidth);
        }
      }, 200);
    } else if (scope.params.mode === "create") {
      setTimeout(function () {
        for (var i = 0; i < scope.tabTemplate().length; i++) {
          $("#" + scope.tabTemplate()[i].id + " ul").each(updateAllowedWidth);
        }
      }, 200);
    }
    if (scope.params.mode === "create" && !scope.tabEdit()) {
      scope.tabEdit(true);
    }
    $(".template_dashboard_design").on("click", ".removeMe", function (event) {
      var rowIndex, componentIndex, elementIndex;
      elementIndex = ($(event.target).closest("li").index());
      componentIndex = ($(event.target).closest("li").parent().parent().index());
      rowIndex = ($(event.target).closest("li").parent().parent().parent().parent().index());
      scope.tabTemplate()[rowIndex].rowComponents()[componentIndex].myComponents.splice(elementIndex, 1);
    });
    if (scope.params.mode === "edit" && scope.tabEdit()) {
      setTimeout(function () {
        for (var i = 0; i < scope.tabTemplate().length; i++) {
          $("#" + scope.tabTemplate()[i].id + " ul").each(updateAllowedWidth);
        }
      }, 200);
    }
  }

  var vm = function (params) {
    var self = this;
    ko.utils.extend(self, params.rootModel);
    var componentList=[];
    self.componentListPromise.then(function(){
      self.moduleComponentsTab().forEach(function(element){
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
        self.tabTemplate()[ContextMenuRow].gridChoice(event.target.value);
      } else if (event.target.value === "removeMe") {
        self.tabTemplate.splice(ContextMenuRow, 1);
      }
    };
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
      self.tabTemplate.push(new RowControls("sortableRow"));
    };
    self.updateViewModel = function (data, row, grid, listLocation, componentInput) {
      self.tabTemplate()[row].rowComponents()[grid].myComponents.splice(listLocation, 0, new DroppableGrid(data, componentInput));
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

    self.saveCustomGridSize = function () {
      if (!params.baseModel.showComponentValidationErrors(self.gridValidationTracker())) {
        return;
      }
      var temp = 0,
        i;
      for (i = 0; i < self.customGridDetails().length; i++) {
        temp = temp + parseInt(self.customGridDetails()[i]);
      }
      if (temp > 12) {
        $("#customErrorMessage2").show();
        return;
      }
      temp = ($("#customGrid").attr("custom-row"));
      self.tabTemplate()[temp].rowComponents.removeAll();
      for (i = 0; i < self.customGridDetails().length; i++) {
        self.tabTemplate()[temp].rowComponents.push(new GridControls("1"));
        self.tabTemplate()[temp].rowComponents()[i].customGrids("oj-sm-" + self.customGridDetails()[i]);
      }

      setTimeout(function () {
        $("#" + self.tabTemplate()[temp].id + " ul").each(updateAllowedWidth);
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
      $("#customErrorMessage2").hide();
      $("#customGrid").hide();
    };

    self.userEdit = ko.observableArray();

    codeToRunAtComponentLoading(self);
    docuemntReady(self, params);
    userEditFunction(self);
    self.hideCustomGrid=function(){
      $("#customGrid").hide();
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
          self.moduleComponentsTab.removeAll();
          self.moduleComponentsTab([].concat(filteredResult));
        }
      }else{
        self.moduleComponentsTab.removeAll();
        self.moduleComponentsTab([].concat(componentList));
      }
    });
    self.tabPromiseReference();
    self.pauseVideo=function(){
      $("#tutorialVideo video").trigger("pause");
    };
  };
  return vm;
});