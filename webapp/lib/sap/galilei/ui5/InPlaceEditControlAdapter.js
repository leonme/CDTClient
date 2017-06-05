/**
 * The sap.galilei.ui5.InPlaceEditControlAdapter is a SAP UI5 based in-place editing adapter.
 * It creates UI5 control to support in-place editing.
 
 * Date: 14/05/14
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

jQuery.sap.declare("sap.galilei.ui5.InPlaceEditControlAdapter");

(function() {
    jQuery.sap.require("sap.m.Input");
    jQuery.sap.require("sap.m.ComboBox");
    jQuery.sap.require("sap.m.Select");
    jQuery.sap.require("sap.m.TextArea");
    jQuery.sap.require("sap.galilei.ui5.InputSearch");
    jQuery.sap.require("sap.galilei.ui5.ControlFactory");

    "use strict";

    /**
     * @class
     * SAP UI5 based in-place editing adapter.
     * It creates UI5 control to support in-place editing.
     * It is used by sap.galilei.ui.editor.widget.InPlaceEditControl in the diagram editor.
     * @public
     */
    sap.galilei.ui5.InPlaceEditControlAdapter = sap.galilei.core.defineClass({
        // Define class name
        fullClassName: "sap.galilei.ui5.InPlaceEditControlAdapter",

        // Define parent
        parent: sap.galilei.ui.editor.widget.InPlaceEditControlAdapter,

        // Define properties
        properties: {
            /**
             * Indicates whether the control is ComboBox or Select.
             */
            isDropDown: false
        },

        // Define methods
        methods: {
            /**
             * Finds the parent control where the in-place edit control cab be added.
             * @name _findParentControl
             * @function
             * @memberOf sap.galilei.ui5.InPlaceEditControlAdapter#
             * @returns {Control} parent control.
             */
            _findParentControl: function () {
                var oParent;

                if (this.viewer && this.viewer.parentNode) {
                    oParent = sap.ui.getCore().byId(this.viewer.parentNode.id);
                    while (oParent) {
                        if (oParent.addContent || oParent.insertContent) {
                            return oParent;
                        }
                        oParent = oParent.oParent;
                    }
                }
                return undefined;
            },

            /**
             * Creates the HTML control instance.
             * This function is not needed anymore.
             * Workaround for the page rerender problem: Add the following controls beside the diagram editor control
             * <g:InputSearch id="DiagramEditor--editorPage-inPlaceEditControl-Input"/>
             * <TextArea id="DiagramEditor--editorPage-inPlaceEditControl-TextArea"/>
             * @name _createUi5EditControl
             * @function
             * @memberOf sap.galilei.ui5.InPlaceEditControlAdapter#
             * @returns {Control} The UI5 edit control (sap.galilei.ui5.InputSearch or sap.m.TextArea).
             */
            _createUi5EditControl: function () {
//                var oControl,
//                    oBinding = this.getBinding(),
//                    oInfo,
//                    oProperty,
//                    sTooltip = "",
//                    sPlaceHolder = "";
//
//                if (oBinding && oInfo.object) {
//                    oInfo = oBinding.getObjectAndPropertyName();
//                    oInfo = this.getEditablePropertyInfo(oInfo);
//                    if (oInfo) {
//                        oProperty = this.getPropertyMetadata(oInfo);
//                    }
//                }
//
//                if (oInfo) {
//                    // Uses control factory
//                    try {
//                        oControl = sap.galilei.ui5.ControlFactory.createControl(oInfo.object, oInfo.propertyName, this.getEditControlId());
//                        if (oControl) {
//                            oControl._isUseControlFactory = true;
//                        }
//                    } catch (e) {
//                    }
//                }
//
//                if (!oControl) {
//                    // Failback to use default UI5 control
//                    if (oProperty) {
//                        sTooltip = oProperty.description || oProperty.displayName || oInfo.propertyName;
//                        sPlaceHolder = oProperty.displayName || oInfo.propertyName;
//                    }
//                    if (this.isMultiLine)  {
//                        oControl = new sap.m.TextArea({
//                            id: this.getEditControlId(),
//                            tooltip: sTooltip,
//                            placeholder: sPlaceHolder,
//                            wrapping: sap.ui.core.Wrapping.None
//                        });
//                    } else {
//                        oControl = new sap.galilei.ui5.InputSearch({
//                            id: this.getEditControlId(),
//                            tooltip: sTooltip,
//                            placeholder: sPlaceHolder
//                        });
//                    }
//                }
//
//                if (oControl) {
//                    oControl._isNewControl = true;
//                }
//
//                return oControl;
                return undefined;
            },

            /**
             * Creates the HTML control instance.
             * @name createControl
             * @function
             * @memberOf sap.galilei.ui5.InPlaceEditControlAdapter#
             * @returns {boolean} true if the control is created.
             */
            createControl: function () {
                var self = this;
                this._createControl(self.showControl);
            },

            /**
             * Creates control instance at position.
             * @name createControlAt
             * @function
             * @memberOf sap.galilei.ui5.InPlaceEditControlAdapter#
             * @returns {boolean} true if the control is created.
             * @param {Array} aClientPoint The point in client coordinates.
             */
            createControlAt: function (aClientPoint) {
                var self = this;
                this._createControl(self.showControlAt, aClientPoint);
            },

            /**
             * Creates control internal function
             * @ignore
             * @function
             * @name _createControl
             * @memberOf sap.galilei.ui5.InPlaceEditControlAdapter#
             * @param {Function} fnShow The function to show the control
             * @param {Array} aClientPoint The point in client coordinates. (optional)
             */
            _createControl: function(fnShow, aClientPoint) {
                var self = this,
                    nField,
                    oDelegate;

                if (!this.control && this.viewer && this.viewer.parentNode) {
                    // Sets the binding index
                    if (aClientPoint) {
                        nField = this.getFieldIndex(aClientPoint);
                        if (nField !== -1) {
                            this.bindingIndex = nField;
                        }
                    }

                    // Tries to find the control by id
                    this.control = sap.ui.getCore().byId(this.getEditControlId());
                    if (this.control) {
                        // Resets the isCancelled flag (ESC)
                        this.control.isCancelled = false;
                        // Adds a new delegate for the new adapter
                        oDelegate = {
                            onAfterRendering: function (oEvent) {
                                self.updateControl();
                                if (fnShow) {
                                    if (aClientPoint) {
                                        fnShow.call(this,aClientPoint);
                                    } else {
                                        fnShow.call(this);
                                    }
                                }
                            }
                        };
                        if (this.control._oDelegate) {
                            this.control.removeEventDelegate(this.control._oDelegate);
                        }
                        this.control._oDelegate = oDelegate;
                        this.control.addEventDelegate(this.control._oDelegate, this);
                        // Setups the control
                        this.setupControl();
                        this.removeEventHandlers();
                        this.addEventHandlers();
                        this.updateControl();
                    }
                }

                return this.control !== undefined;
            },

            /**
             * Setups the edit control. If a custom adapter is used, this function may need to be overriden.
             * @name setupControl
             * @function
             * @memberOf sap.galilei.ui5.InPlaceEditControlAdapter#
             */
            setupControl: function () {
                var oBinding,
                    oInfo;

                oBinding = this.getBinding();
                if (oBinding) {
                    oInfo = oBinding.getObjectAndPropertyName();
                    oInfo = this.getEditablePropertyInfo(oInfo);
                    if (oInfo && oInfo.object) {
                        try {
                            delete this.control._isUseControlFactory;
                            delete this.control._maxSuggestionWidth;
                            if (sap.galilei.ui5.ControlFactory.updateControl(this.control, oInfo.object, oInfo.propertyName)) {
                                this.control._isUseControlFactory = true;
                            }
                        } catch (e) {
                            //noinspection Eslint
                        }
                    }
                }
            },

            /**
             * Gets the edit control id. It depends on the control type.
             * @name getEditControlId
             * @function
             * @memberOf sap.galilei.ui5.InPlaceEditControlAdapter#
             * @returns {String} The control id.
             */
            getEditControlId: function () {
                var oParent,
                    sParentId = "",
                    oBinding,
                    oInfo,
                    sControlType,
                    aParts;

                this.isDropDown = false;
                oParent = this._findParentControl();
                if (oParent) {
                    sParentId = oParent.getId() + "-inPlaceEditControl-";
                }

                if (this.isMultiLine)  {
                    sParentId += "TextArea";
                } else {
                    oBinding = this.getBinding();
                    if (oBinding) {
                        oInfo = oBinding.getObjectAndPropertyName();
                        oInfo = this.getEditablePropertyInfo(oInfo);
                        if (oInfo && oInfo.object) {
                            sControlType = sap.galilei.ui5.ControlFactory.getControlType(oInfo.object, oInfo.propertyName);
                            if (sControlType) {
                                aParts = sControlType.split(".");
                                if (aParts) {
                                    sControlType = aParts.pop();
                                    if (sControlType === "ComboBox" || sControlType === "Select") {
                                        this.isDropDown = true;
                                    }
                                    sParentId += sControlType;
                                }
                            }
                        }
                    }
                }

                return sParentId;
            },

            /**
             * Gets the inner edit control (input, textarea, ...) as jQuery node.
             * @name _getEditControl
             * @function
             * @memberOf sap.galilei.ui5.InPlaceEditControlAdapter#
             */
            _getEditControl: function () {
                var oNode,
                    oEdit;

                if (this.control && this.control.$()) {
                    oEdit = this.control.$("inner");
                    if (!oEdit) {
                        // In case the edit control cannot be found, uses the last control (the first could be the placeholder label)
                        oNode = this.control.$()[0];
                        if (oNode && oNode.childNodes && oNode.childNodes.length > 0) {
                            oEdit = jQuery(oNode.childNodes[oNode.childNodes.length - 1]);
                        }
                    }
                    return oEdit;
                }
            },

            /**
             * Gets the placeholder control (label).
             * @name _getPlaceholderControl
             * @function
             * @memberOf sap.galilei.ui5.InPlaceEditControlAdapter#
             */
            _getPlaceholderControl: function () {
                var oNode,
                    oLabel;

                if (this.control && this.control.$()) {
                    // In case the edit control cannot be found, uses the last control (the first could be the placeholder label)
                    oNode = this.control.$()[0];
                    if (oNode && oNode.childNodes && oNode.childNodes.length >= 2) {
                        oLabel = jQuery(oNode.childNodes[0]);
                    }
                    return oLabel;
                }
            },

            /**
             * Gets the search icon control.
             * @name _getSearchIconControl
             * @function
             * @memberOf sap.galilei.ui5.InPlaceEditControlAdapter#
             */
            _getSearchIconControl: function() {
                var oNode,
                    oIcon;

                if (this.control && this.control.$()) {
                    oNode = this.control.$()[0];
                    if (oNode && oNode.childNodes && oNode.childNodes.length >= 2) {
                        oIcon = jQuery(oNode.childNodes[1].childNodes[0]);
                    }
                    return oIcon;
                }
            },

            /**
             * Updates the HTML control position and value.
             * @name updateControl
             * @function
             * @memberOf sap.galilei.ui5.InPlaceEditControlAdapter#
             */
            updateControl: function () {
                var sValue = "";

                if (this.control) {
                    this.updatePosition();
                    sValue = this.getPropertyValue();
                    this.control.setValue(sValue);
                }
            },

            /**
             * Moves the edit control to a specific field.
             * @name moveToField
             * @function
             * @memberOf sap.galilei.ui5.InPlaceEditControlAdapter#
             * @param {number} nIndex The field index in the bindings.
             */
            moveToField: function (nIndex) {
                if (nIndex === undefined)  {
                    nIndex = 0;
                } else if (nIndex === -1) {
                    if (this.bindings) {
                        nIndex = this.bindings.length - 1;
                    }
                }
                if (this.bindings && this.bindings.length > 0 && nIndex !== this.bindingIndex) {
                    this.isChangingField = true;
                    this.savePropertyValue();
                    // Removes the existing control
                    this.removeControl();
                    // Creates a new one.
                    this.bindingIndex = nIndex;
                    this.createControlAt();
                    this.updateControl();
                    this.isChangingField = false;
                }
            },

            /**
             * Adds event handlers.
             * @name addEventHandlers
             * @function
             * @memberOf sap.galilei.ui5.InPlaceEditControlAdapter#
             */
            addEventHandlers: function () {
                if (this.control) {
                    this._onKeyDown = jQuery.proxy(this.onKeyDown, this);
                    this._onFocus = jQuery.proxy(this.onFocus, this);
                    this._onFocusOut = jQuery.proxy(this.onFocusOut, this);
                    this.control.attachBrowserEvent("keydown", this._onKeyDown);
                    this.control.attachBrowserEvent("focus", this._onFocus);
                    this.control.attachBrowserEvent("focusout", this._onFocusOut);
                }
            },

            /**
             * Removes event handlers.
             * @name removeEventHandlers
             * @function
             * @memberOf sap.galilei.ui5.InPlaceEditControlAdapter#
             */
            removeEventHandlers: function () {
                if (this.control) {
                    if (this._onKeyDown) {
                        this.control.detachBrowserEvent("keydown", this._onKeyDown);
                        delete this._onKeyDown;
                    }
                    if (this._onFocus) {
                        this.control.detachBrowserEvent("focus", this._onFocus);
                        delete this._onFocus;
                    }
                    if (this._onFocusOut) {
                        this.control.detachBrowserEvent("focusout", this._onFocusOut);
                        delete this._onFocusOut;
                    }
                }
            },

            /**
             * Handles the get focus event.
             * @name onFocus
             * @function
             * @memberOf sap.galilei.ui5.InPlaceEditControlAdapter#
             * @param {object} oKeyEvent The event.
             */
            onFocus: function (oKeyEvent) {
                var oEdit;

                oEdit = this._getEditControl();
                if (oEdit) {
                    oEdit.select();
                }
            },

            /**
             * Handles the lost focus event.
             * @name onFocusOut
             * @function
             * @memberOf sap.galilei.ui.editor.widget.InPlaceEditControlAdapter#
             * @param {object} oKeyEvent The event.
             */
            onFocusOut: function (oKeyEvent) {
                var self = this;
                if (this.control) {
                    this.savePropertyValue();
                    if (!this.isDropDown) {
                        setTimeout(function () {
                            self.hideControl();
                        }, 500);
                    }
                }
            },

            /**
             * Sets the value of edit control in the object property.
             * @name savePropertyValue
             * @function
             * @memberOf sap.galilei.ui5.InPlaceEditControlAdapter#
             */
            savePropertyValue: function () {
                var sOldValue,
                    sNewValue;

                if (this.control.getValue) {
                    // UI5 sap.m.Input or sap.m.ComboBox controls
                    sNewValue = this.control.getValue();
                } else if (this.control.getSelectedKey) {
                    // UI5 sap.m.Select control
                    sNewValue = this.control.getSelectedKey();
                }
                if (this.isChangingField) {
                    // Sets the value explicitely to avoid issue when using Tab to change field
                    sOldValue = this.getPropertyValue();
                    if (sOldValue != sNewValue) {
                        this.setPropertyValue(sNewValue);
                    }
                } else {
                    // If control factory is used, the object is updated using the data binding
                    if (this.control && !this.control._isUseControlFactory) {
                        this.setPropertyValue(sNewValue);
                    }
                }
            },

            /**
             * Attach the search button event
             * @ignore
             * @function
             * @name _attachSearchEvent
             * @memberOf sap.galilei.ui5.InPlaceEditControlAdapter#
             */
            _attachSearchEvent: function(){
                var self = this,
                    oSearchBtn = this._getSearchIconControl();
                if (oSearchBtn) {
                    oSearchBtn.bind("click", function () {
                        self.control.fireSearch();
                        return false;
                    });
                }
            },

            /**
             * Gets the bounding box of the edit control.
             * @name getFieldBBox
             * @function
             * @memberOf sap.galilei.ui5.InPlaceEditControlAdapter#
             * @returns {Rect}
             */
            getFieldBBox: function () {
                var oBinding = this.getBinding(),
                    oBBox,
                    oTextBBox,
                    x,
                    y,
                    width,
                    height,
                    aCenter;

                if (oBinding && oBinding.shape && this.viewer) {
                    // Gets the shape bounding box
                    oBBox = oBinding.shape.getBBox().clone();
                    if (this.symbol && this.symbol.x !== undefined && this.symbol.y !== undefined) {
                        oBBox.moveBy(this.symbol.x, this.symbol.y);
                    }
                    // Converts to client coordinates, only viewer scroll
                    oBBox = this.viewer.viewBBoxToClientBBox(oBBox, false, true);

                    x = oBBox.x;
                    y = oBBox.y;
                    if (oBBox.width + 10 < oBBox.height) {
                        width = oBBox.height;
                        height = oBBox.width;
                    } else {
                        width = oBBox.width;
                        height = oBBox.height;
                    }

                    // Uses the auto-complete values width if there are any
                    if (this.control && this.control._maxSuggestionWidth > 0 && width < this.control._maxSuggestionWidth) {
                        width = this.control._maxSuggestionWidth;
                    }

                    // Tries to adjust the width to make the text visible
                    if (oBinding.shape.text && width < oBinding.shape.text.length * 8) {
                        width = oBinding.shape.text.length * 8;
                    }
                    // Limits the text field size
                    if (width > 400) {
                        width = 400;
                    } else if (width < 100)  {
                        width = 100;
                    }
                    if (this.isMultiLine) {
                        if (height > 100) {
                            height = 100;
                        } else if (height < 24)  {
                            height = 24;
                        }
                    } else {
                        height = 24;
                    }

                    oTextBBox = new sap.galilei.ui.common.Rect(x, y, width, height);
                    aCenter = oBBox.getCenter();
                    oTextBBox.setCenter(aCenter[0], aCenter[1]);

                    return oTextBBox;
                }
                return oBBox;
            },

            /**
             * Updates the position of the edit control.
             * @name updatePosition
             * @function
             * @memberOf sap.galilei.ui5.InPlaceEditControlAdapter#
             */
            updatePosition: function () {
                if (this.control && this.control.$() && this.viewer) {
                    var oBBox = this.getFieldBBox(),
                        oViewRect = new sap.galilei.ui.common.Rect(0, 0, this.viewer.viewWidth, this.viewer.viewHeight),
                        oEdit,
                        oLabel,
                        oIcon;

                    if (oBBox && oBBox.x != undefined && oBBox.y != undefined && oBBox.width != undefined && oBBox.height != undefined && oViewRect.isRectInRect(oBBox)) {
                        // Updates the parent <div>
                        this.control.$()
                            .css("position", "absolute")
                            .css("left", Math.ceil(oBBox.x) + "px")
                            .css("top", Math.ceil(oBBox.y) + "px")
                            .css("width", Math.floor(oBBox.width) + "px")
                            .css("height", Math.floor(oBBox.height) + "px")
                            .css("overflow", "hidden")
                            .css("margin", "0px")
                            .css("margin", "0px")
                            .css("padding", "0px")
                            .css("border", "1px solid #009DE0");

                        // Updates the edit control
                        oEdit = this._getEditControl();
                        if (oEdit) {
                            oEdit
                                .css("rows", "")
                                .css("cols", "")
                                .css("width", "100%")
                                .css("height", "100%")
                                .css("line-height", "1.2")
                                .css("overflow", "hidden")
                                .css("border", "none")
                                .css("margin", "0px")
                                .css("padding", "0.2rem");
                        }

                        // Updates the placeholder control inside the edit control
                        oLabel = this._getPlaceholderControl();
                        if (oLabel) {
                            oLabel
                                .css("rows", "")
                                .css("cols", "")
                                .css("width", "100%")
                                .css("height", "100%")
                                .css("line-height", "1.2")
                                .css("overflow", "hidden")
                                .css("border", "none")
                                .css("margin", "0px")
                                .css("padding", "0.2rem");
                        }

                        oIcon = this._getSearchIconControl();
                        if (oIcon) {
                            oIcon.css("line-height", "1rem");
                        }
                    }
                }
            },

            /**
             * Shows the edit control.
             * @name showControl
             * @function
             * @memberOf sap.galilei.ui5.InPlaceEditControlAdapter#
             */
            showControl: function () {
                this._showControl();
            },

            /**
             * Shows the edit control at position.
             * @name showControlAt
             * @function
             * @memberOf sap.galilei.ui5.InPlaceEditControlAdapter#
             * @param {Array} aClientPoint The point in client coordinates. (optional)
             */
            showControlAt: function (aClientPoint) {
                this._showControl(aClientPoint);
            },

            /**
             * Shows the control internal function
             * @ignore
             * @function
             * @name _showControl
             * @memberOf sap.galilei.ui5.InPlaceEditControlAdapter#
             * @param {Array} aClientPoint The point in client coordinates. (optional)
             */
            _showControl: function(aClientPoint){
                if (this.control && this.control.$() && this.viewer) {
                    var nScale = this.viewer.zoomScale,
                        oBBox = this.getFieldBBox(),
                        oViewRect = new sap.galilei.ui.common.Rect(0, 0, this.viewer.viewWidth, this.viewer.viewHeight),
                        oEdit,
                        oLabel,
                        clientX,
                        clientY,
                        self = this;

                    if (nScale >= 0.5 && oViewRect.isRectInRect(oBBox)) {
                        this.control.$().css("visibility", "visible");
                        oEdit = this._getEditControl();
                        if (oEdit) {
                            oEdit.css("visibility", "visible");
                        }
                        oLabel = this._getPlaceholderControl();
                        if (oLabel) {
                            oLabel.css("visibility", "visible");
                        }

                        if (aClientPoint) {
                            //FIXME: Workaround to fix the search event not fired
                            clientX = aClientPoint[0];
                            clientY = aClientPoint[1];
                            if (clientY > oBBox.top && clientY < oBBox.bottom && clientX > oBBox.right-oBBox.height) {
                                this.control.fireSearch();
                            }
                        }

                        this.control.focus();
                        // Workaround to select all and for search event
                        setTimeout(function () {
                            self.onFocus();
                        }, 50);
                    }
                }
            },

            /**
             * Hides the edit control.
             * @name hideControl
             * @function
             * @memberOf sap.galilei.ui5.InPlaceEditControlAdapter#
             */
            hideControl: function () {
                if (this.control && this.control.$()) {
                    var oEdit,
                        oLabel;

                    this.control.$().css("visibility", "collapse");
                    oEdit = this._getEditControl();
                    if (oEdit) {
                        oEdit.css("visibility", "collapse");
                    }
                    oLabel = this._getPlaceholderControl();
                    if (oLabel) {
                        oLabel.css("visibility", "collapse");
                    }
                }
            },

            /**
             * Removes the edit control.
             * @name removeControl
             * @function
             * @memberOf sap.galilei.ui5.InPlaceEditControlAdapter#
             */
            removeControl: function () {
                if (this.control && this.control.$()) {
                    this.removeEventHandlers();
                    this.hideControl();
                    // Do not delete the control
                    this.control = undefined;
                }
            }
        },

        // Define static members
        statics: {
            /**
             * Hides the controls defined in the layout for in-place editing.
             * @static
             * @name initializeControls
             * @function
             * @memberOf sap.galilei.ui5.InPlaceEditControlAdapter#
             */
            initializeControls: function (editor) {
                if (editor) {
                    var oAdapter = new sap.galilei.ui5.InPlaceEditControlAdapter({
                            editor: editor,
                            viewer: editor.viewer
                        }),
                        oControl;

                    // Single line control
                    oAdapter.isMultiLine = false;
                    oControl = sap.ui.getCore().byId(oAdapter.getEditControlId());
                    if (oControl && oControl.$()) {
                        oControl.$()
                            .css("visibility", "collapse")
                            .css("position", "absolute")
                            .css("width", "1px")
                            .css("height", "1px");
                        // Detaches control from used object
                        sap.galilei.ui5.ControlFactory.detachControl(oControl);
                    }

                    // Multi-line control
                    oAdapter.isMultiLine = true;
                    oControl = sap.ui.getCore().byId(oAdapter.getEditControlId());
                    if (oControl && oControl.$()) {
                        oControl.$()
                            .css("visibility", "collapse")
                            .css("position", "absolute")
                            .css("width", "1px")
                            .css("height", "1px");
                        // Detaches control from used object
                        sap.galilei.ui5.ControlFactory.detachControl(oControl);
                    }
                }
            },

            /**
             * Detaches the controls from object.
             * @static
             * @name detachControls
             * @function
             * @memberOf sap.galilei.ui5.InPlaceEditControlAdapter#
             */
            detachControls: function (editor) {
                if (editor) {
                    var oAdapter = new sap.galilei.ui5.InPlaceEditControlAdapter({
                            editor: editor,
                            viewer: editor.viewer
                        }),
                        oControl;

                    // Single line control
                    oAdapter.isMultiLine = false;
                    oControl = sap.ui.getCore().byId(oAdapter.getEditControlId());
                    if (oControl) {
                        sap.galilei.ui5.ControlFactory.detachControl(oControl);
                    }

                    // Multi-line control
                    oAdapter.isMultiLine = true;
                    oControl = sap.ui.getCore().byId(oAdapter.getEditControlId());
                    if (oControl) {
                        sap.galilei.ui5.ControlFactory.detachControl(oControl);
                    }
                }
            }
        }
    });
}());

