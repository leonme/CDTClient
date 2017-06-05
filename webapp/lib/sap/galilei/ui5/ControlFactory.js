/**
 
 * Date: 17/04/14
 * (c) Copyright 2013-2014 SAP SE. All rights reserved
 */

jQuery.sap.declare("sap.galilei.ui5.ControlFactory");

(function () {
    "use strict";

    var nsModel = sap.galilei.model;

    /**
     * @class Factory used to create model-bound UI5 Controls for galilei object features.
     * @name sap.galilei.ui5.ControlFactory
     * @memberOf sap.galilei.ui5
     * @public
     */
    sap.galilei.ui5.ControlFactory = sap.galilei.core.defineClass({
        // Define class name
        fullClassName: "sap.galilei.ui5.ControlFactory",

        methods: {
            /**
             * Creates a UI5 control for a given Galilei object instance and feature
             * @memberOf sap.galilei.ui5.ControlFactory#
             * @param {sap.galilei.model.Object} oInstance The Galilei object instance.
             * @param {string} sFeatureName The feature name.
             * @returns {sap.ui.core.Control} The UI5 control.
             */
            createControl: function (oInstance, sFeatureName) {
                var gDataTypes = nsModel.dataTypes,
                    oControl,
                    oFeature,
                    oConstraint,
                    oAllowedValues,
                    oSuggestedValues,
                    oClassSuggestedValues;

                // NOTE: boilerplate for retrieving feature based on (oInstance, sFeatureName) pair
                // should be factored out as helper in galilei model
                if (!oInstance || !oInstance.classDefinition || !sFeatureName) {
                    throw new Error();
                }
                oFeature = oInstance.classDefinition.getFeature(sFeatureName);
                if (!oFeature) {
                    throw new Error();
                }

                // Custom feature-based control factory?
                if (oFeature.createControl) {
                    oControl = oFeature.createControl(oInstance);
                } else if (oFeature.classDefinition.name === "Property") {
                    // Property?
                    oConstraint = oFeature.constraint;
                    if (oConstraint) {
                        oAllowedValues = oConstraint.allowedValues;
                        if (oAllowedValues instanceof Function) {
                            oAllowedValues = oConstraint.allowedValues(oInstance);
                        }
                        if (!oAllowedValues) {
                            // check suggested values
                            oSuggestedValues = oConstraint.suggestedValues;
                            oClassSuggestedValues = oConstraint.classSuggestedValues;
                            if (oClassSuggestedValues instanceof Function) {
                                // An evaluation exists at the class level,
                                // check if any value is available for current class
                                // some cases need to get information from Model
                                // some cases need to get instance info
                                oClassSuggestedValues = oConstraint.classSuggestedValues(oInstance.classDefinition, oInstance.Model, oInstance);
                                // No real dynamic suggested values in that case
                                oSuggestedValues = undefined;
                            }
                            if (oClassSuggestedValues && oClassSuggestedValues.length == 0) {
                                oClassSuggestedValues = undefined;
                            }
                        }

                        if (oAllowedValues) {
                            // Closed list of allowed values
                            oControl = this.createSelectControl(oInstance, oFeature, oAllowedValues);
                        } else if (oClassSuggestedValues) {
                            // Static list of suggested values
                            oControl = this.createEditableComboBoxControl(oInstance, oFeature, oClassSuggestedValues);
                        } else if (oFeature.dataType === gDataTypes.gString) {
                            // Special case: string value with open set of suggested values
                            oControl = this.createInputWithSuggestionControl(oInstance, oFeature, oSuggestedValues);
                        }
                    }

                    if (!oControl) {
                        if (oFeature.dataType === gDataTypes.gString) {
                            // TODO: implement
                        } else if (oFeature.dataType === gDataTypes.gBool) {
                            // TODO: implement
                        }
                        // ...
                        // TODO: implement
                    }
                } else if (oFeature.classDefinition.name === "Reference") {
                    // Reference?
                }

                // derive control id from feature name + control class
                if (oControl) {
                    oControl.id = sFeatureName + "-" + oControl.getMetadata().getElementName();
                }
                return oControl;
            },

            /**
             * Create a Select control based on an array of allowed values
             * @memberOf sap.galilei.ui5.ControlFactory#
             * @param {sap.galilei.model.Object} oInstance The Galilei object instance.
             * @param {sap.galilei.model.Property} oFeature The Galilei meta property object
             * @param {Array} oAllowedValues The array of allowed values
             * @returns {sap.ui.core.Control} The UI5 Select control.
             */
            createSelectControl: function (oInstance, oFeature, oAllowedValues, sKeyValue, bEditable, bIsRelative) {
                var oControl,
                    sFeatureName = oFeature && oFeature.name,
                    oConstraint = oFeature && oFeature.constraint,
                    self = this;

                // Create Select control
                oControl = new sap.m.Select({
                    autoAdjustWidth: bIsRelative === true,
                    enabled: bEditable,
                    selectedKey: {
                        path: bIsRelative === true ? sFeatureName : "/" + sFeatureName,
                        mode: sap.ui.model.BindingMode.OneWay,
                        formatter: function (sValue) {
                            var sResult = sValue,
                                aAllowedValuesKeys = self.getAllowedValuesKeys(oInstance, oFeature, oAllowedValues, sKeyValue),
                                nAllowedValuesCount = aAllowedValuesKeys ? aAllowedValuesKeys.length || 0 : 0;                            
                            if (sResult === undefined && nAllowedValuesCount > 0) {
                                sResult = aAllowedValuesKeys[0];
                            } else {
                                if (oConstraint && (oConstraint.formatValue instanceof Function)) {
                                    sResult = oConstraint.formatValue(oInstance, sValue);
                                }
                            }
                            return sResult;
                        }
                    }
                });
                this.updateSelectControl(oControl, oInstance, oFeature, oAllowedValues, sKeyValue, bEditable, bIsRelative);

                return oControl;
            },

            /**
             * Updates a Select control based on an array of allowed values
             * @memberOf sap.galilei.ui5.ControlFactory#
             * @param {sap.ui.core.Control} oControl The UI5 Select control.
             * @param {sap.galilei.model.Object} oInstance The Galilei object instance.
             * @param {sap.galilei.model.Property} oFeature The Galilei meta property object
             * @param {Array} oAllowedValues The array of allowed values
             * @returns {sap.ui.core.Control} The UI5 Select control.
             */
            updateSelectControl: function (oControl, oInstance, oFeature, oAllowedValues, sKeyValue, bEditable, bIsRelative) {
                var self = this,
                    sFeatureName = oFeature && oFeature.name,
                    sPath = (bIsRelative === true) ? sFeatureName : "/" + sFeatureName,
                    oConstraint = oFeature && oFeature.constraint,
                    sKey,
                    oItem,
                    bEdit = bEditable === undefined ? true : bEditable,
                    aAllowedValuesKeys,
                    nAllowedValuesCount,
                    nAllowedValuesIndex,
                    sDynamicAllowedValuesName,
                    vObject,
                    sObjectFeatureName,
                    fnGetObjectFeatureName = oConstraint && (oConstraint.getObjectFeatureName instanceof Function) && oConstraint.getObjectFeatureName;

                function _removeItems(oControl) {
                    var index,
                        max;

                    if (oControl) {
                        // Clear existing items
                        if (oControl.getItems()) {
                            for (max = oControl.getItems().length, index = max - 1; index >= 0; index--) {
                                oControl.removeItem(index);
                            }
                        }
                    }
                }

                function _addItems(oControl) {
                    if (oControl) {
                        aAllowedValuesKeys = self.getAllowedValuesKeys(oInstance, oFeature, oAllowedValues, sKeyValue);
                        nAllowedValuesCount = aAllowedValuesKeys ? aAllowedValuesKeys.length || 0 : 0;
                        // Add items
                        for (nAllowedValuesIndex = 0; nAllowedValuesIndex < nAllowedValuesCount; nAllowedValuesIndex++) {
                            sKey = aAllowedValuesKeys[nAllowedValuesIndex];
                            oItem = new sap.ui.core.Item({
                                text: oAllowedValues[sKey],
                                key: sKey
                            });
                            oControl.addItem(oItem);
                        }
                    }
                }

                if (oControl) {
                    _removeItems(oControl);

                    if (oFeature && oFeature.constraint && oFeature.constraint.getDynamicAllowedValuesName instanceof Function) {
                        // Uses dynamically allowed values name
                        sDynamicAllowedValuesName = oFeature.constraint.getDynamicAllowedValuesName();
                        oControl.setItems({
                                path: bIsRelative === true ? (sDynamicAllowedValuesName ? sDynamicAllowedValuesName : sFeatureName) :
                                    "/" + (sDynamicAllowedValuesName ? sDynamicAllowedValuesName : sFeatureName),
                                mode: sap.ui.model.BindingMode.OneWay,
                                templateShareable: true,
                                template: new sap.ui.core.Item({
                                    key : "{key}",
                                    text : "{text}"
                                })
                            });
                    } else {
                        // If no dynamic allowed values name, we still have to use old way,
                        // since no way to set its path and the format of old allowed values are different and cannot be used to bind
                        _addItems(oControl);
                    }

                    // Attaches change event handler
                    oControl._fnChange = function (oEventArgs) {
                        var oSelectedItem = oEventArgs && oEventArgs.getParameter("selectedItem"),
                            oSource,
                            oBindingContext,
                            oCurrInstance,
                            vNewValue = oSelectedItem && oSelectedItem.getKey();

                        if (oConstraint && (oConstraint.coerceValue instanceof Function)) {
                            vNewValue = oConstraint.coerceValue(oInstance, vNewValue);
                        }

                        if (bIsRelative || !oInstance) {
                            oSource = oEventArgs && oEventArgs.getSource();
                            oBindingContext = oSource && oSource.getBindingContext();
                            oCurrInstance = oBindingContext && oBindingContext.getProperty();
                        } else {
                            oCurrInstance = oInstance;
                        }
                        if (oCurrInstance && sFeatureName && oSelectedItem) {
                            oCurrInstance[sFeatureName] = vNewValue;
                        }

                        // Support set value to object feature(2nd feature)
                        if (fnGetObjectFeatureName) {
                            sObjectFeatureName = fnGetObjectFeatureName.call(oConstraint, oCurrInstance);
                        }
                        if (sObjectFeatureName) {
                            vObject = oConstraint && oConstraint.coerceValue instanceof Function && oConstraint.coerceValue(oCurrInstance, vNewValue, true);
                            oCurrInstance[sObjectFeatureName] = vObject;
                        }
                    };
                    oControl.attachChange(oControl._fnChange);

                    if (bEdit) {
                        this.bindEnabledProperty(oControl, oInstance, oFeature, sPath);
                    }
                }

                return oControl;
            },

            /**
             * Create an editable ComboBox control based on an array of suggested values
             * @memberOf sap.galilei.ui5.ControlFactory#
             * @param {sap.galilei.model.Object} oInstance The Galilei object instance.
             * @param {sap.galilei.model.Property} oFeature The Galilei meta property object
             * @param {Array} oSuggestedValues The array of allowed values
             * @returns {sap.ui.core.Control} The UI5 ComboBox
             *  control.
             */
            createEditableComboBoxControl: function (oInstance, oFeature, oSuggestedValues, sKeyValue, bEditable, bIsRelative) {
                var oControl;

                // Create ComboBox control
                oControl = new sap.m.ComboBox();
                this.updateEditableComboBoxControl(oControl, oInstance, oFeature, oSuggestedValues, sKeyValue, bEditable, bIsRelative);

                return oControl;
            },

            /**
             * Create an editable ComboBox control based on an array of suggested values
             * @memberOf sap.galilei.ui5.ControlFactory#
             * @param {sap.ui.core.Control} oControl The UI5 ComboBox control.
             * @param {sap.galilei.model.Object} oInstance The Galilei object instance.
             * @param {sap.galilei.model.Property} oFeature The Galilei meta property object
             * @param {Array} oSuggestedValues The array of allowed values
             * @returns {sap.ui.core.Control} The UI5 ComboBox
             *  control.
             */
            updateEditableComboBoxControl: function (oControl, oInstance, oFeature, oSuggestedValues, sKeyValue, bEditable, bIsRelative) {
                var sFeatureName = oFeature && oFeature.name,
                    sPath = (bIsRelative === true) ? sFeatureName : "/" + sFeatureName,
                    sKey,
                    oItem,
                    oConstraint = oFeature && oFeature.constraint,
                    bEdit = bEditable === undefined ? true : bEditable,
                    fnCoerceValue = oConstraint && (oConstraint.coerceValue instanceof Function) && oConstraint.coerceValue,
                    fnFormatValue = oConstraint && (oConstraint.formatValue instanceof Function) && oConstraint.formatValue,
                    aAllowedValuesNames = this.getAllowedValuesKeys(oInstance, oFeature, oSuggestedValues, sKeyValue),
                    nAllowedValuesCount = aAllowedValuesNames ? aAllowedValuesNames.length || 0 : 0,
                    nAllowedValuesIndex,
                    vObject,
                    sObjectFeatureName,
                    fnGetObjectFeatureName = oConstraint && (oConstraint.getObjectFeatureName instanceof Function) && oConstraint.getObjectFeatureName,
                    index,
                    max;

                if (oControl) {
                    oControl
                        .setEditable(bEdit)
                        .setEnabled(bEdit)
                        .setTooltip(oFeature.description || oFeature.displayName)
                        .setPlaceholder(oFeature.description || oFeature.displayName || sFeatureName)
                        .setValue({
                            path: bIsRelative === true ? sFeatureName : "/" + sFeatureName,
                            mode: sap.ui.model.BindingMode.OneWay,
                            formatter: function (sValue) {
                                var sTemp = sValue,
                                    sResult;
                                if (!sTemp && nAllowedValuesCount > 0) {
                                    sTemp = aAllowedValuesNames[0];
                                }
                                sResult = oSuggestedValues[sTemp] || (fnFormatValue ? fnFormatValue.call(oConstraint, oInstance, sTemp) : sTemp);
                                return sResult;
                            }
                        })
                        .data("automationId", oFeature.name + "_inplaceedit_cb", true);

                    // Attaches change event handler
                    oControl._fnChange = function (oEventArgs) {
                        var oSelectedItem = oEventArgs && oEventArgs.oSource && oEventArgs.oSource.getSelectedItem(),
                            vOriginalValue = oEventArgs && oEventArgs.mParameters &&oEventArgs.mParameters.newValue,
                            vNewValue = oSelectedItem && oSelectedItem.getKey(),
                            oSource,
                            oBindingContext,
                            oCurrInstance;

                        if (bIsRelative || !oInstance) {
                            oSource = oEventArgs && oEventArgs.getSource();
                            oBindingContext = oSource && oSource.getBindingContext();
                            oCurrInstance = oBindingContext && oBindingContext.getProperty();
                        } else {
                            oCurrInstance = oInstance;
                        }
                        if (oCurrInstance && sFeatureName) {
                            if (!oSelectedItem) {
                                vNewValue = vOriginalValue || undefined;
                            }
                            if (fnCoerceValue) {
                                vNewValue = fnCoerceValue.call(oConstraint, oCurrInstance, vNewValue);
                            }
                            oCurrInstance[sFeatureName] = vNewValue;

                            // Support set value to object feature(2nd feature)
                            if (fnGetObjectFeatureName) {
                                sObjectFeatureName = fnGetObjectFeatureName.call(oConstraint, oCurrInstance);
                            }
                            if (sObjectFeatureName) {
                                vObject = fnCoerceValue.call(oConstraint, oCurrInstance, vNewValue, true);
                                oCurrInstance[sObjectFeatureName] = vObject;
                            }
                        }
                    };
                    oControl.attachChange(oControl._fnChange);

                    // Clear existing items
                    if (oControl.getItems()) {
                        for (max = oControl.getItems().length, index = max - 1; index >= 0; index--) {
                            oControl.removeItem(index);
                        }
                    }

                    // Add items
                    for (nAllowedValuesIndex = 0; nAllowedValuesIndex < nAllowedValuesCount; nAllowedValuesIndex++) {
                        sKey = aAllowedValuesNames[nAllowedValuesIndex];
                        oItem = new sap.ui.core.ListItem({
                            text: oSuggestedValues[sKey],
                            key: sKey
                        });
                        oControl.addItem(oItem);
                    }

                    // Only UI5 1.21.1 or higher supports setMaxSuggestionWidth()
                    if (!oControl._maxSuggestionWidth) {
                        oControl._maxSuggestionWidth = 150;
                    }

                    if (bEdit) {
                        this.bindEnabledProperty(oControl, oInstance, oFeature, sPath);
                    }
                }

                return oControl;
            },

            /**
             * Gets allowed value keys.
             * @memberOf sap.galilei.ui5.ControlFactory#
             * @param {sap.galilei.model.Object} oInstance The Galilei object instance.
             * @param {sap.galilei.model.Property} oFeature The Galilei meta property object
             * @param {Object} oAllowedValues The allowed values keys and values.
             * @param sKeyValue
             * @returns {*}
             */
            getAllowedValuesKeys: function (oInstance, oFeature, oAllowedValues, sKeyValue) {
                var aResult;

                if (!oFeature || !oAllowedValues) {
                    return aResult;
                }
                if (oFeature.constraint && oFeature.constraint.getOrderValues) {
                    aResult = oFeature.constraint.getOrderValues(oAllowedValues);
                }
                if (!aResult) {
                    aResult = Object.getOwnPropertyNames(oAllowedValues);
                }
                if (!aResult) {
                    aResult = sKeyValue;
                }
                return aResult;
            },

            /**
             * Binds enabled property to the isReadOnly function of the value editor.
             * @memberOf sap.galilei.ui5.ControlFactory#
             * @param {sap.ui.core.Control} oControl The control.
             * @param {sap.galilei.model.Object} oInstance The Galilei object instance.
             * @param {sap.galilei.model.Property} oFeature The Galilei meta property object
             * @param fnSpecificIsReadOnly Optional function for specific read-only logic
             */
            bindEnabledProperty: function(oControl, oInstance, oFeature, sPath, fnSpecificIsReadOnly) {
                var oConstraint = oFeature && oFeature.constraint,
                    fnSupportReadOnly = oConstraint && oConstraint.supportReadonly,
                    fnReadOnly = fnSpecificIsReadOnly || (oConstraint && oConstraint.isReadonly),
                    sProperty,
                    sBindPath = sPath || "",
                    bSupportReadonly = false,
                    self = this;

                if (fnSpecificIsReadOnly instanceof Function) {
                    bSupportReadonly = true;
                } else if (oInstance && fnSupportReadOnly instanceof Function) {
                    bSupportReadonly = fnSupportReadOnly.call(oConstraint, oInstance);
                } else if (!oInstance && fnReadOnly instanceof Function) {
                    bSupportReadonly = true;
                }
                if (oControl && bSupportReadonly) {
                    //if (oControl && bSupportReadonly && fnReadOnly instanceof Function) {
                    if (oControl.getEnabled instanceof Function) {
                        sProperty = "enabled";
                    } else if (oControl.getEditable instanceof Function) {
                        sProperty = "editable";
                    }
                    if (sProperty) {
                        oControl.bindProperty(
                            sProperty,
                            // settings
                            {
                                path: sBindPath
//                                formatter: function () {
//                                    var bEditable = true,
//                                        oCurrObj = oInstance;
//                                    self.onMonitorRead(oControl, sProperty, oCurrObj, oFeature.name, function() {
//                                        bEditable = !fnReadOnly.call(oConstraint, oCurrObj);
//                                    });
//                                    return bEditable;
//                                }
                            }
                        );
                    }
                }
            },

            /**
             * Create an Input control with suggestion items
             * @memberOf sap.galilei.ui5.ControlFactory#
             * @param {sap.galilei.model.Object} oInstance The Galilei object instance.
             * @param {sap.galilei.model.Property} oFeature The Galilei meta property object
             * @param {Function} fnSuggestion The function that computes the suggestion list
             * (or closed list of values)
             * @returns {sap.ui.core.Control} The UI5 Input control.
             */
            createInputWithSuggestionControl: function (oInstance, oFeature, fnSuggestion) {
                var oControl;

                jQuery.sap.require("sap.galilei.ui5.InputSearch");
                oControl = new sap.galilei.ui5.InputSearch();
                this.updateInputWithSuggestionControl(oControl, oInstance, oFeature, fnSuggestion);

                return oControl;
            },

            /**
             * Create an Input control with suggestion items
             * @memberOf sap.galilei.ui5.ControlFactory#
             * @param {sap.ui.core.Control} oControl The UI5 Input control.
             * @param {sap.galilei.model.Object} oInstance The Galilei object instance.
             * @param {sap.galilei.model.Property} oFeature The Galilei meta property object
             * @param {Function} fnSuggestion The function that computes the suggestion list
             * (or closed list of values)
             * @returns {sap.ui.core.Control} The UI5 Input control.
             */
            updateInputWithSuggestionControl: function (oControl, oInstance, oFeature, fnSuggestion, bIsEditable) {
                var self = this,
                    sFeatureName = oFeature && oFeature.name,
                    oConstraint = oFeature && oFeature.constraint,
                    fnCoerceValue = oConstraint && (oConstraint.coerceValue instanceof Function) && oConstraint.coerceValue,
                    oSearchCommand,
                    bShowSearch = false;

                if (oControl && oInstance && sFeatureName) {
                    //oControl.setValue(oValueBinding);
                    oControl.bindProperty("value", oFeature.CustomBinding || { path: "/" + sFeatureName, mode: sap.ui.model.BindingMode.OneWay });
                    oControl.setTooltip(oFeature.description || oFeature.displayName);
                    oControl.setPlaceholder(oFeature.description || oFeature.displayName || sFeatureName);
                    oControl.setShowSuggestion(oConstraint !== undefined);

                    if (oConstraint) {
                    // Attaches suggest event handler
                    oControl._fnSuggest = function (oEvent) {
                        var sInputValue,
                            oSuggestedValues,
                            fnUpdateSuggestionItems,
                            nMaxWidth = 0;

                        // TODO: implement caching
                        fnUpdateSuggestionItems = function (aSuggestedValues, bComplete) {
                            oControl.destroySuggestionItems();
                            if (aSuggestedValues && aSuggestedValues.length > 0) {
                                jQuery.each(aSuggestedValues, function (i, vSuggestedValue) {
                                    var sText = (oConstraint.formatValue && oConstraint.formatValue(oInstance, vSuggestedValue)) || vSuggestedValue,
                                        oItem = new sap.ui.core.ListItem({
                                            text: sText,
                                            additionalText: oConstraint.getValueDescription && oConstraint.getValueDescription(oInstance, vSuggestedValue),
                                            icon: oConstraint.getValueDisplayImage && oConstraint.getValueDisplayImage(oInstance, vSuggestedValue)
                                        });

                                    oControl._fnFilter = function (v, i) {
                                        return true;
                                    };
                                    // ensure the suggestion item satisfies the control filter, otherwise a pop-up close timeout might get registered!
                                    if (!oControl._fnFilter || oControl._fnFilter(sInputValue, oItem)) {
                                        oItem.data("value", vSuggestedValue);
                                        oControl.addSuggestionItem(oItem);
                                        nMaxWidth = Math.max(nMaxWidth, sap.galilei.ui.common.Text.measureTextLineWidth(sText, "12px Arial, Helvetica"));
                                    }
                                });
                            }
                            // UI5 1.21.1 or higher
                            if (nMaxWidth > 0 && oControl.setMaxSuggestionWidth) {
                                oControl.setMaxSuggestionWidth((nMaxWidth + 8)+ "px" );
                            }

                        };
                        sInputValue = oEvent.getParameter("suggestValue");
                        oSuggestedValues = fnSuggestion;
                        if (oSuggestedValues instanceof Function) {
                            oSuggestedValues.call(oConstraint, oInstance, sInputValue, fnUpdateSuggestionItems);
                        } else {
                            fnUpdateSuggestionItems(oSuggestedValues);
                        }
                    };
                    oControl.attachSuggest(oControl._fnSuggest);

                    // Attaches SuggestionItemSelected event handler
                    oControl._fnSuggestionItemSelected = function (oEvent) {
                        var oSelectedItem = oEvent && oEvent.mParameters && oEvent.mParameters.selectedItem,
                            vValue = oSelectedItem && oSelectedItem.data('value');

                        if (oInstance && vValue !== undefined) {
                            if (fnCoerceValue && oInstance) {
                                vValue = fnCoerceValue.call(oConstraint, oInstance, vValue);
                            }
                            oInstance[sFeatureName] = vValue;
                        }
                    };
                    oControl.attachSuggestionItemSelected(oControl._fnSuggestionItemSelected);

                    // Shows the search button
                    if (oConstraint.getSearchCommand) {
                            oSearchCommand = oConstraint.getSearchCommand(oInstance);
                        if (oSearchCommand instanceof Function) {
                            oControl._fnSearch = jQuery.proxy(oSearchCommand, this, { control: oControl, propertyName: sFeatureName, cancelBubble: true });
                            oControl.attachSearch(oControl._fnSearch);
                            bShowSearch = true;
                        }
                    }
                    oControl.setShowSearch(bShowSearch);
                    }

                    // Attaches change event handler
                    oControl._fnChange = function () {
                        if (!oControl.isCancelled) {
                            var vValue = oControl.getValue();

                            if (fnCoerceValue && oInstance && oConstraint) {
                                vValue = fnCoerceValue.call(oConstraint, oInstance, vValue);
                            }
                            oInstance[sFeatureName] = vValue;
                        }
                    };
                    oControl.attachChange(oControl._fnChange);

                    // Only UI5 1.21.1 or higher supports setMaxSuggestionWidth()
                    if (!oControl._maxSuggestionWidth) {
                        oControl._maxSuggestionWidth = 150;
                    }
                }

                return oControl;
            },

            /**
             * Gets the control type.
             * @memberOf sap.galilei.ui5.ControlFactory#
             * @param {sap.galilei.model.Object} oInstance The Galilei object instance.
             * @param {String} sFeatureName The Galilei meta property name.
             * @returns {String} The type of control: "sap.galilei.ui5.InputSearch", "sap.m.Input", "sap.m.ComboBox", "sap.m.Select"
             */
            getControlType: function (oInstance, sFeatureName) {
                var gDataTypes = nsModel.dataTypes,
                    sControlType = "sap.galilei.ui5.InputSearch",
                    oFeature,
                    oConstraint,
                    oAllowedValues,
                    oSuggestedValues,
                    oClassSuggestedValues;

                // NOTE: boilerplate for retrieving feature based on (oInstance, sFeatureName) pair
                // should be factored out as helper in galilei model
                if (!oInstance || !oInstance.classDefinition || !sFeatureName) {
                    throw new Error();
                }
                oFeature = oInstance.classDefinition.getFeature(sFeatureName);
                if (!oFeature) {
                    throw new Error();
                }

                // Custom feature-based control factory?
                if (oFeature.classDefinition.name === "Property") {
                    // Property?
                    oConstraint = oFeature.constraint;
                    if (oConstraint) {
                        oAllowedValues = oConstraint.allowedValues;
                        if (oAllowedValues instanceof Function) {
                            oAllowedValues = oConstraint.allowedValues(oInstance);
                        }
                        if (!oAllowedValues) {
                            // check suggested values
                            oSuggestedValues = oConstraint.suggestedValues;
                            oClassSuggestedValues = oConstraint.classSuggestedValues;
                            if (oClassSuggestedValues instanceof Function) {
                                // An evaluation exists at the class level,
                                // check if any value is available for current class
                                // some cases need to get information from Model
                                // some cases need to get instance info
                                oClassSuggestedValues = oConstraint.classSuggestedValues(oInstance.classDefinition, oInstance.Model, oInstance);
                                // No real dynamic suggested values in that case
                                oSuggestedValues = undefined;
                            }
                            if (oClassSuggestedValues && oClassSuggestedValues.length === 0) {
                                oClassSuggestedValues = undefined;
                            }
                        }

                        if (oAllowedValues) {
                            // Closed list of allowed values
                            sControlType = "sap.m.Select";
                        } else if (oClassSuggestedValues) {
                            // Static list of suggested values
                            sControlType = "sap.m.ComboBox";
                        } else if (oFeature.dataType === gDataTypes.gString) {
                            // Special case: string value with open set of suggested values
                            sControlType = "sap.galilei.ui5.InputSearch";
                        }
                    }
                }

                return sControlType;
            },

            // TODO: Find a way to reuse the control factor created control.
            /**
             * Updates a UI5 control for a given Galilei object instance and feature in case the control is reused.
             * @memberOf sap.galilei.ui5.ControlFactory#
             * @param {sap.ui.core.Control} oControl The UI5 control.
             * @param {sap.galilei.model.Object} oInstance The Galilei object instance.
             * @param {string} sFeatureName The feature name.
             * @returns {Boolean} The UI5 control is updated.
             */
            updateControl: function (oControl, oInstance, sFeatureName) {
                var self = this,
                    gDataTypes = nsModel.dataTypes,
                    oFeature,
                    oConstraint,
                    oAllowedValues,
                    oSuggestedValues,
                    oClassSuggestedValues;

                // NOTE: boilerplate for retrieving feature based on (oInstance, sFeatureName) pair
                // should be factored out as helper in galilei model
                if (!oInstance || !oInstance.classDefinition || !sFeatureName) {
                    throw new Error();
                }
                oFeature = oInstance.classDefinition.getFeature(sFeatureName);
                if (!oFeature) {
                    throw new Error();
                }

                // Custom feature-based control factory?
                if (oControl && oFeature.classDefinition.name === "Property") {
                    this.detachControl(oControl);

                    // Property?
                    oConstraint = oFeature.constraint;
                    if (oConstraint) {
                        oAllowedValues = oConstraint.allowedValues;
                        if (oAllowedValues instanceof Function) {
                            oAllowedValues = oConstraint.allowedValues(oInstance);
                        }
                        if (!oAllowedValues) {
                            // check suggested values
                            oSuggestedValues = oConstraint.suggestedValues;
                            oClassSuggestedValues = oConstraint.classSuggestedValues;
                            if (oClassSuggestedValues instanceof Function) {
                                // An evaluation exists at the class level,
                                // check if any value is available for current class
                                // some cases need to get information from Model
                                // some cases need to get instance info
                                oClassSuggestedValues = oConstraint.classSuggestedValues(oInstance.classDefinition, oInstance.Model, oInstance);
                                // No real dynamic suggested values in that case
                                oSuggestedValues = undefined;
                            }
                            if (oClassSuggestedValues && oClassSuggestedValues.length == 0) {
                                oClassSuggestedValues = undefined;
                            }
                        }

                        if (oAllowedValues) {
                            // Closed list of allowed values
                            this.updateSelectControl(oControl, oInstance, oFeature, oAllowedValues);
                        } else if (oClassSuggestedValues) {
                            // Static list of suggested values
                            this.updateEditableComboBoxControl(oControl, oInstance, oFeature, oClassSuggestedValues);
                        } else if (oFeature.dataType === gDataTypes.gString) {
                            // Special case: string value with open set of suggested values
                            this.updateInputWithSuggestionControl(oControl, oInstance, oFeature, oSuggestedValues);
                        }
                    } else {
                        // Handles change notification
                        this.updateInputWithSuggestionControl(oControl, oInstance, oFeature);
                    }

                    return true;
                }

                return false;
            },

            /**
             * Detaches a UI5 control for a given Galilei object instance and feature.
             * @memberOf sap.galilei.ui5.ControlFactory#
             * @param {sap.ui.core.Control} oControl The UI5 control.
             */
            detachControl: function (oControl) {
                var index,
                    max;

                if (oControl) {
                    if (oControl._fnSuggest) {
                        if (oControl.detachSuggest) {
                            oControl.detachSuggest(oControl._fnSuggest);
                        }
                        delete oControl._fnSuggest;
                    }
                    if (oControl._fnSuggestionItemSelected) {
                        if (oControl.detachSuggestionItemSelected) {
                            oControl.detachSuggestionItemSelected(oControl._fnSuggestionItemSelected);
                        }
                        delete oControl._fnSuggestionItemSelected;
                    }
                    if (oControl.setShowSuggestion) {
                        oControl.setShowSuggestion(false);
                    }
                    if (oControl._fnSearch) {
                        if (oControl.detachSearch) {
                            oControl.detachSearch(oControl._fnSearch);
                        }
                        delete oControl._fnSearch;
                    }
                    if (oControl.setShowSearch) {
                        oControl.setShowSearch(false);
                    }
                    if (oControl.destroySuggestionItems) {
                        oControl.destroySuggestionItems();
                    }

                    if (oControl._fnChange) {
                        if (oControl.detachChange) {
                            oControl.detachChange(oControl._fnChange);
                        }
                        delete oControl._fnChange;
                    }

                    // Clear existing items
                    if (oControl.getItems && oControl.getItems() > 0) {
                        for (max = oControl.getItems().length, index = max - 1; index >= 0; index--) {
                            oControl.removeItem(index);
                        }
                    }
                }
            }
        },

        statics: {
            /**
             * NOTE: this static API is temporary. control factory should be retrieved through service lookup
             * @static
             * @memberOf sap.galilei.ui5.ControlFactory#
             * @param {sap.galilei.model.Object} oInstance The Galilei object instance.
             * @param {string} sFeatureName The feature name.
             * @returns {sap.ui.core.Control} The UI5 control.
             */
            createControl: function (oInstance, sFeatureName) {
                // inline singleton pattern implementation
                var controlFactoryClass = sap.galilei.ui5.ControlFactory;

                if (controlFactoryClass.INSTANCE === undefined) {
                    controlFactoryClass.INSTANCE = new sap.galilei.ui5.ControlFactory();
                }
                return controlFactoryClass.INSTANCE.createControl(oInstance, sFeatureName);
            },

            /**
             * Gets the control type.
             * @static
             * @memberOf sap.galilei.ui5.ControlFactory#
             * @param {sap.galilei.model.Object} oInstance The Galilei object instance.
             * @param {String} sFeatureName The Galilei meta property name.
             * @returns {String} The type of control: "sap.galilei.ui5.InputSearch", "sap.m.Input", "sap.m.ComboBox", "sap.m.Select"
             */
            getControlType: function (oInstance, sFeatureName) {
                // inline singleton pattern implementation
                var controlFactoryClass = sap.galilei.ui5.ControlFactory;

                if (controlFactoryClass.INSTANCE === undefined) {
                    controlFactoryClass.INSTANCE = new sap.galilei.ui5.ControlFactory();
                }

                if (controlFactoryClass.INSTANCE) {
                    return controlFactoryClass.INSTANCE.getControlType(oInstance, sFeatureName);
                }
                return "sap.m.Input";
            },

            /**
             * Updates a UI5 control for a given Galilei object instance and feature in case the control is reused.
             * @static
             * @memberOf sap.galilei.ui5.ControlFactory#
             * @param {sap.ui.core.Control} oControl The UI5 control.
             * @param {sap.galilei.model.Object} oInstance The Galilei object instance.
             * @param {string} sFeatureName The feature name.
             * @returns {Boolean} true if succeeded.
             */
            updateControl: function (oControl, oInstance, sFeatureName) {
                // inline singleton pattern implementation
                var controlFactoryClass = sap.galilei.ui5.ControlFactory;

                if (controlFactoryClass.INSTANCE === undefined) {
                    controlFactoryClass.INSTANCE = new sap.galilei.ui5.ControlFactory();
                }

                if (controlFactoryClass.INSTANCE) {
                    return controlFactoryClass.INSTANCE.updateControl(oControl, oInstance, sFeatureName);
                }
                return false;
            },

            /**
             * Detaches a UI5 control for a given Galilei object instance and feature.
             * @static
             * @memberOf sap.galilei.ui5.ControlFactory#
             * @param {sap.ui.core.Control} oControl The UI5 control.
             */
            detachControl: function (oControl) {
                // inline singleton pattern implementation
                var controlFactoryClass = sap.galilei.ui5.ControlFactory;

                if (controlFactoryClass.INSTANCE) {
                    controlFactoryClass.INSTANCE.detachControl(oControl);
                }
            }
        }
    });
}());
