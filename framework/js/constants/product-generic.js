define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "baseModel",
  "framework/js/constants/constants",
  "ojL10n!resources/nls/origination-generic",
  "baseService",

  "knockout-mapping",
  "ojs/ojknockout",
  "knockout-helper",
  "ojs/ojbutton"
], function(oj, ko, $, BaseModel, Constants, resourceBundle, BaseService) {
  "use strict";
  return function(root) {
    var self = this;
    ko.utils.extend(self, BaseModel.getInstance());
    ko.utils.extend(self, root);
    var baseService = BaseService.getInstance();

    self.transformText = function(text) {
      if (!text) {
        return;
      }
      var j, pairs;
      if (text.indexOf("_") > -1) {
        pairs = text.split("_");
        for (j = 0; j < pairs.length; j++) {
          pairs[j] = pairs[j].substring(0, 1).toUpperCase() + pairs[j].substring(1).toLowerCase();
        }
        text = pairs.join(" ");
      }
      return text;
    };

    self.toCleanJson = function(input) {
      return ko.toJSON(input, function(key, value) {
        if (value === null || value === undefined) {
          return false;
        } else if (key && typeof key === "string") {
          if (!key.replace(/^temp_.*/g, "") || key === "selectedValues") {
            return false;
          }
            return value;

        }
          return value;

      });
    };
    var fetchAdditionalFlowDeferred = $.Deferred();
    self.additionalFlow = function(coappJSON) {
      var options = {
        url: "origination/flows/" + coappJSON,
        success: function(data) {
          fetchAdditionalFlowDeferred.resolve(data);
        }
      };
      baseService.fetchJSON(options);
      return fetchAdditionalFlowDeferred;
    };
    self.fetchAdditionalFlow = function() {
      var coappJSON = "co-app";
      var flowDeferred = $.Deferred();
      self.additionalFlow(coappJSON).done(function(data) {
        var SearchObject = function(key, array) {
          for (var i = 0; i < array.length; i++) {
            if (array[i].id === key) {
              return array;
            } else if (array[i].stages) {
                var x = SearchObject(key, array[i].stages);
                if (x) {
                  return x;
                }

              }
          }
        };
        for (var i = 0; i < parseInt(self.productDetails().requirements.noOfCoApplicants); i++) {
          self.applicantDetails()[i + 1] = ko.mapping.toJS(ko.mapping.fromJS(self.applicantDetails()[0]));
          self.applicantDetails()[i + 1].applicantId = ko.observable(self.applicantDetails()[i + 1].applicantId);
          self.applicantDetails()[i + 1].applicantId().displayValue = "";
          self.applicantDetails()[i + 1].applicantId().value = "";
          self.applicantDetails()[i + 1].applicantRelationshipType = "CO_APPLICANT";

          for (var j = 0; j < data.coApp.length; j++) {
            var stages = SearchObject(data.coApp[j].id, self.productDetails().productStages);
            if (stages) {
              self.modifyFlowStages(0, stages, data.coApp[j].id, data.coApp[j].name, data.coApp[j].id, {
                coappNumber: i + 1
              });
            }
          }
        }
        flowDeferred.resolve();
      });
      return flowDeferred;
    };

    self.modifyFlowStages = function(deleteCount, stages, stageId, stageName, insertStageId, obj) {
      var index, prvsIndex = 0;
      var stageLocation = deleteCount ? stageId : insertStageId;
      index = ko.utils.arrayFilter(stages, function(stage) {
        if (stage.id === stageLocation) {
          return stage.sequenceNumber;
        }
      });
      index = index[0].sequenceNumber;
      if (deleteCount > 0) {
        stages.splice((index - 1), deleteCount);
        index--;
      } else {
        stages.splice(index, 0, ko.mapping.toJS(ko.mapping.fromJS(stages[index - 1])));
        $.extend(stages[index], obj);
        ko.utils.arrayForEach(stages, function(stage) {
          if (prvsIndex === stage.sequenceNumber) {
            stage.sequenceNumber++;
            prvsIndex = stage.sequenceNumber;
          } else if (index === stage.sequenceNumber) {
            prvsIndex = index;
          }
        });
        stages[index].id = stageId;
        stages[index].name = stageName;
        stages[index].nextStagename = stages[index - 1].nextStagename;
        if (stages[index].nextStagename) {
          stages[index + 1].previousStage = stages[index].id;
        }
      }
      stages[index].previousStage = stages[index - 1].id;
      stages[index - 1].nextStagename = stages[index].id;
    };
    /**
     * This function is used to set the current stage of the product application.
     * It takes as an input the ID of the stage to be set as the current stage.
     *
     * @function setCurrentStage
     * @memberOf ProductViewModel
     * @param {string} id - The ID of the stage to set as the current stage
     * @example ProductViewModel.getNextStage()
     */
    self.setCurrentStage = function(direction) {
      self.productDetails().currentStage = self.productDetails().productStages[self.productDetails().currentStage.sequenceNumber + direction - 1];
      var currentStage = self.productDetails().currentStage;
      if (currentStage.module) {
        self.registerComponent(currentStage.id, currentStage.module);
      } else {
        var hostModule = "origination/" + Constants.host;
        self.registerComponent(currentStage.id, hostModule);
      }
      self.productComponentName(currentStage.id);
      self.productHeadingName(currentStage.name);
      self.hideBackButton(currentStage.previousStage === null);
      if (self.productDetails().submissionId) {
        self.submissionIdExists(true);
      }
    };
    /**
     * This function is used to advance to the next product application stage.
     * It finds out the next stage of the current stage, and sets it as the current stage.
     *
     * @function getNextStage
     * @memberOf ProductViewModel
     * @example ProductViewModel.getNextStage()
     */
    self.getNextStage = function() {
      self.productDetails().currentStage.isComplete = true;
      if (self.productDetails().sectionBeingEdited() === self.productDetails().currentStage.id) {
        self.productComponentName("review");
      } else {
        self.setCurrentStage(1);
      }
    };

    self.showPluginComponent = function(compName) {
      self.pluginCompName("row");
      ko.tasks.runEarly();
      self.pluginCompName(compName);
      self.productflowComponent(false);
    };

    self.showToolTip = function(id, holder) {
      var p = $("#" + holder),
        toolTipHeight, toolTipWidth;
      var position = p.position();

      toolTipHeight = $("#" + id).outerHeight();
      toolTipWidth = $("#" + id).outerWidth();
      var viewableOffset = $("#" + holder).offset().top - $(window).scrollTop();
      var positionTop = viewableOffset > toolTipHeight ? position.top - toolTipHeight : position.top + 50;
      if (self.large()) {
        $("#" + id).css("position", "absolute");
        $("#" + id).css("top", positionTop);
        $("#" + id).css("left", position.left - (toolTipWidth / 2));
        $("#" + id).css("display", "block");
      }
    };

    self.hideToolTip = function(id) {

      $("#" + id).css("display", "none");
    };

    self.applyPattern = function(input, pattern, position) {
      var x = input;
      var output = "";
      if (x.length > pattern[position] && position < pattern.length) {
        x = x.substr(pattern[position]);
        output = self.applyPattern(x, pattern, position + 1);
        output = input.substr(0, pattern[position]) + "-" + output;
        return output;
      }
        output += x;
        return output;

    };
    self.maskValue = function(val, len) {
      var a = val.substring(0, len);
      return a.replace(/\d/g, "x") + val.substring(len);
    };
    self.maskValueAll = function(val, len) {
      var a = val.substring(0, len);
      return a.replace(/[\d\D]/g, "x") + val.substring(len);
    };
    self.componentLoader = function(name, componentConfig) {
      var newComponentPath;
      newComponentPath = componentConfig.basePath + "/" + componentConfig.module + "/" + Constants.host + "/" + name + "/ko/bindings/" + name + "-bindings";
      return newComponentPath;
    };
  };
});
