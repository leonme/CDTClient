/**
 * This file defines a SAP UI5 control for the diagram editor.
 
 * Date: 02/10/13
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

jQuery.sap.declare("sap.galilei.ui5.Editor");

(function () {
    "use strict";

    /**
     * @class
     * @name sap.galilei.ui5.EditorSettings
     * Defines the diagram editor UI5 control default settings.
     * These default parameters can be modified before creating a diagram editor control.
     */
    sap.galilei.ui5.EditorSettings = {
        isReadOnly: true,
        showViewBorder: true,
        viewBorderWidth: sap.galilei.ui.common.svg.Viewer.VIEW_BORDER_WIDTH,
        viewBorderColor: sap.galilei.ui.common.svg.Viewer.VIEW_BORDER_COLOR,
        viewBackgroundFill: sap.galilei.ui.common.svg.Viewer.VIEW_BACKGROUND_COLOR,
        pageHorzNumber: sap.galilei.ui.common.svg.Viewer.PAGE_HORZ_NUMBER,
        pageVertNumber: sap.galilei.ui.common.svg.Viewer.PAGE_VERT_NUMBER,
        pageBackgroundFill: sap.galilei.ui.common.svg.Viewer.PAGE_BACKGROUND_COLOR,
        showPageLimit: false,
        pageLimitColor: sap.galilei.ui.common.svg.Viewer.pageLimitColor,
        showGrid: false,
        gridSize: sap.galilei.ui.common.svg.Viewer.GRID_SIZE,
        gridBorderInnerColor: sap.galilei.ui.common.svg.Viewer.GRID_BORDER_INNER_COLOR,
        gridBorderOuterColor: sap.galilei.ui.common.svg.Viewer.GRID_BORDER_OUTER_COLOR,
        snapToGrid: false,
        snapToShapes: true,
        useContextButtonPad: true,
        orientation: undefined,
        showZoomTools: true,
        zoomToolHorizontalAlignment: sap.galilei.ui.common.HorizontalAlignment.right,
        zoomToolVerticalAlignment: sap.galilei.ui.common.VerticalAlignment.top,
        enableInPlaceEditing: true,
        enableInPlaceEditingAfterCreate: true,
        enablePreserveLinkAfterDelete: true
    };

    /**
     * @class
     * @name sap.galilei.ui5.Editor
     * Defines the diagram editor UI5 control class.
     * It provides the most used functions.
     * For more advanced functions, you can use the inner diagram editor. See sap.galilei.ui.editor.DiagramEditor.
     */
    sap.ui.core.Control.extend("sap.galilei.ui5.Editor", {
        metadata : {
            properties: {
                /**
                 * The control width.
                 * @name width
                 * @memberOf sap.galilei.ui5.Editor#
                 * @type {sap.ui.core.CSSSize}
                 * @default "100%"
                 */
                "width": { type: "sap.ui.core.CSSSize", defaultValue: "100%" },
                /**
                 * The control height.
                 * @name height
                 * @memberOf sap.galilei.ui5.Editor#
                 * @type {sap.ui.core.CSSSize}
                 * @default "100%"
                 */
                "height": { type: "sap.ui.core.CSSSize", defaultValue: "100%" },
                /**
                 * The diagram editor extension class name.
                 * @name editorExtensionClassName
                 * @memberOf sap.galilei.ui5.Editor#
                 * @type {string}
                 */
                "editorExtensionClassName": { type: "string" },
                /**
                 * Indicates whether the diagram editor is in read-only mode.
                 * @name isReadOnly
                 * @memberOf sap.galilei.ui5.Editor#
                 * @type {boolean}
                 * @default true
                 */
                "isReadOnly": { type: "boolean", defaultValue: sap.galilei.ui5.EditorSettings.isReadOnly },
                /**
                 * Indicates whether to show a border around the diagram editor control.
                 * @name showViewBorder
                 * @memberOf sap.galilei.ui5.Editor#
                 * @type {boolean}
                 * @default true
                 */
                "showViewBorder": { type: "boolean", defaultValue: sap.galilei.ui5.EditorSettings.showViewBorder },
                /**
                 * Gets or sets the border size.
                 * @name viewBorderWidth
                 * @memberOf sap.galilei.ui5.Editor#
                 * @type {int}
                 * @default 1
                 */
                "viewBorderWidth": { type: "int", defaultValue: sap.galilei.ui5.EditorSettings.viewBorderWidth },
                /**
                 * Gets or sets the border color.
                 * @name viewBorderColor
                 * @memberOf sap.galilei.ui5.Editor#
                 * @type {string}
                 */
                "viewBorderColor":  { type: "string", defaultValue: sap.galilei.ui5.EditorSettings.viewBorderColor },
                /**
                 * Gets or sets the view background color.
                 * @name viewBackgroundFill
                 * @memberOf sap.galilei.ui5.Editor#
                 * @type {string}
                 */
                "viewBackgroundFill": { type: "string", defaultValue: sap.galilei.ui5.EditorSettings.viewBackgroundFill },
                /**
                 * Gets or sets the horizontal number of pages.
                 * @name pageHorzNumber
                 * @memberOf sap.galilei.ui5.Editor#
                 * @type {int}
                 * @default 21
                 */
                "pageHorzNumber": { type: "int", defaultValue: sap.galilei.ui5.EditorSettings.pageHorzNumber },
                /**
                 * Gets or sets the vertical number of pages.
                 * @name pageVertNumber
                 * @memberOf sap.galilei.ui5.Editor#
                 * @type {int}
                 * @default 15
                 */
                "pageVertNumber": { type: "int", defaultValue: sap.galilei.ui5.EditorSettings.pageVertNumber },
                /**
                 * Gets or sets the page background color.
                 * @name pageBackgroundFill
                 * @memberOf sap.galilei.ui5.Editor#
                 * @type {string}
                 */
                "pageBackgroundFill": { type: "string", defaultValue: sap.galilei.ui5.EditorSettings.pageBackgroundFill },
                /**
                 * Indicates whether to show the page limit.
                 * @name showPageLimit
                 * @memberOf sap.galilei.ui5.Editor#
                 * @type {boolean}
                 * @default false
                 */
                "showPageLimit": { type: "boolean", defaultValue: sap.galilei.ui5.EditorSettings.showPageLimit },
                /**
                 * Gets or sets the page limit color.
                 * @name pageLimitColor
                 * @memberOf sap.galilei.ui5.Editor#
                 * @type {string}
                 */
                "pageLimitColor": { type: "string", defaultValue: sap.galilei.ui5.EditorSettings.pageLimitColor },
                /**
                 * Indicates whether to show the grid.
                 * @name showGrid
                 * @memberOf sap.galilei.ui5.Editor#
                 * @type {boolean}
                 * @default false
                 */
                "showGrid": { type: "boolean", defaultValue: sap.galilei.ui5.EditorSettings.showGrid },
                /**
                 * Gets or sets the grid size.
                 * @name gridSize
                 * @memberOf sap.galilei.ui5.Editor#
                 * @type {int}
                 * @default 10
                 */
                "gridSize": { type: "int", defaultValue: sap.galilei.ui5.EditorSettings.gridSize },
                /**
                 * Gets or sets the grid inner color.
                 * @name gridBorderInnerColor
                 * @memberOf sap.galilei.ui5.Editor#
                 * @type {string}
                 */
                "gridBorderInnerColor": { type: "string", defaultValue: sap.galilei.ui5.EditorSettings.gridBorderInnerColor },
                /**
                 * Gets or sets the grid outer color.
                 * @name gridBorderOuterColor
                 * @memberOf sap.galilei.ui5.Editor#
                 * @type {string}
                 */
                "gridBorderOuterColor": { type: "string", defaultValue: sap.galilei.ui5.EditorSettings.gridBorderOuterColor },
                /**
                 * Gets or sets the snap-to-grid mode.
                 * @name snapToGrid
                 * @memberOf sap.galilei.ui5.Editor#
                 * @type {boolean}
                 * @default false
                 */
                "snapToGrid": { type: "boolean", defaultValue: sap.galilei.ui5.EditorSettings.snapToGrid },
                /**
                 * Gets or sets the snap-to-shapes mode.
                 * @name snapToShapes
                 * @memberOf sap.galilei.ui5.Editor#
                 * @type {boolean}
                 * @default true
                 */
                "snapToShapes": { type: "boolean", defaultValue: sap.galilei.ui5.EditorSettings.snapToShapes },
                /**
                 * Gets or sets the use context button pad mode.
                 * @name useContextButtonPad
                 * @memberOf sap.galilei.ui5.Editor#
                 * @type {boolean}
                 * @default true
                 */
                "useContextButtonPad": {type: "boolean", defaultValue: sap.galilei.ui5.EditorSettings.useContextButtonPad },
                /**
                 * Gets or sets the diagram orientation. The supported values are: undefined, "horizontal", "vertical".
                 * @name orientation
                 * @memberOf sap.galilei.ui5.Editor#
                 * @type {string}
                 * @default undefined
                 */
                "orientation": { type: "string", defaultValue: sap.galilei.ui5.EditorSettings.orientation },
                /**
                 * Indicates whether to show the zoom tools.
                 * @name showZoomTools
                 * @memberOf sap.galilei.ui5.Editor#
                 * @type {boolean}
                 * @default true
                 */
                "showZoomTools": { type: "boolean", defaultValue: sap.galilei.ui5.EditorSettings.showZoomTools },
                /**
                 * Gets or sets the horizontal position of the zoom tools.
                 * @name zoomToolHorizontalAlignment
                 * @memberOf sap.galilei.ui5.Editor#
                 * @type {string}
                 * @default sap.galilei.ui.common.VerticalAlignment.left
                 */
                "zoomToolHorizontalAlignment": { type: "string", defaultValue: sap.galilei.ui5.EditorSettings.zoomToolHorizontalAlignment },
                /**
                 * Gets or sets the vertical position of the zoom tools.
                 * @name zoomToolVerticalAlignment
                 * @memberOf sap.galilei.ui5.Editor#
                 * @type {string}
                 * @default sap.galilei.ui.common.VerticalAlignment.top
                 */
                "zoomToolVerticalAlignment": { type: "string", defaultValue: sap.galilei.ui5.EditorSettings.zoomToolVerticalAlignment },
                /**
                 * Indicates whether in-place editing is enabled.
                 * @name enableInPlaceEditing
                 * @memberOf sap.galilei.ui5.Editor#
                 * @type {boolean}
                 * @default true
                 */
                "enableInPlaceEditing": { type: "boolean", defaultValue: sap.galilei.ui5.EditorSettings.enableInPlaceEditing },
                /**
                 * Indicates whether in-place editing after creating a symbol is enabled.
                 * @name enableInPlaceEditingAfterCreate
                 * @memberOf sap.galilei.ui5.Editor#
                 * @type {boolean}
                 * @default true
                 */
                "enableInPlaceEditingAfterCreate": { type: "boolean", defaultValue: sap.galilei.ui5.EditorSettings.enableInPlaceEditingAfterCreate },
                /**
                 * Indicates whether preserve link after deleting a node symbol is enabled.
                 * @name enablePreserveLinkAfterDelete
                 * @memberOf sap.galilei.ui5.Editor#
                 * @type {boolean}
                 * @default true
                 */
                "enablePreserveLinkAfterDelete": { type: "boolean", defaultValue: sap.galilei.ui5.EditorSettings.enablePreserveLinkAfterDelete }
            },
            events: {
                "ready": { enablePreventDefault : true }
            }
        },

        /**
         * Indicates whether the editor is rendered.
         * @private
         * @name _isReady
         * @memberOf sap.galilei.ui5.Editor#
         * @type {Boolean}
         */
        _isReady: false,

        /**
         * Gets or sets the inner diagram editor instance.
         * @private
         * @name _editor
         * @memberOf sap.galilei.ui5.Editor#
         * @type {sap.galilei.ui.editor.DiagramEditor}
         */
        _editor: undefined,

        /**
         * Gets or sets the diagram instance. It is only used if the inner diagram editor is not created yet.
         * @private
         * @name _diagram
         * @memberOf sap.galilei.ui5.Editor#
         * @type {sap.galilei.ui.diagram.Diagram}
         */
        _diagram: undefined,

        /**
         * The default UI5 control initialization function.
         * @name init
         * @memberOf sap.galilei.ui5.Editor#
         */
        init: function () {
            var aKeys,
                index,
                sProperty;

            // Checks whether superclass implements the method
            if (sap.ui.core.Control.prototype.init) {
                // Calls the method with the original arguments
                sap.ui.core.Control.prototype.init.apply(this, arguments);
            }

            // Sets the default parameters in case they are modified in sap.galilei.ui5.EditorSettings.
            aKeys = Object.keys && Object.keys(sap.galilei.ui5.EditorSettings);
            if (aKeys && aKeys.length > 0) {
                for (index = 0; index < aKeys.length; index++) {
                    sProperty = aKeys[index];
                    this.setProperty(sProperty, sap.galilei.ui5.EditorSettings[sProperty]);
                }
            }
        },

        /**
         * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
         * @memberOf sap.galilei.ui5.Editor#
         * @param {sap.ui.core.RenderManager} oRenderManager The RenderManager that can be used for writing to the render output buffer
         * @param {sap.ui.core.Control} oControl An object representing the control that should be rendered
         */
        renderer: function(oRenderManager, oControl) {
            if (oRenderManager && oControl) {
                oControl._isReady = false;
                oRenderManager.write("<div id=\"" + oControl.getId() + "\" style='width:" + oControl.getWidth() + "; height:" + oControl.getHeight() + ";' > ");
                oRenderManager.write("</div>");
            }
        },

        /**
         * Default callback when the diagram editor control is rendered.
         * @name defaultOnAfterRendering
         * @memberOf sap.galilei.ui5.Editor#
         */
        defaultOnAfterRendering: function () {
            // Initializes the editor
            this.initEditor("#" + this.getId());
        },

        /**
         * Callback when the diagram editor control is rendered.
         * @name onAfterRendering
         * @memberOf sap.galilei.ui5.Editor#
         */
        onAfterRendering: function () {
            this.defaultOnAfterRendering();
        },

        /**
         * Initializes the diagram editor control.
         * @name initEditor
         * @memberOf sap.galilei.ui5.Editor#
         * @param {String} sContainerSelector The selector of the parent element of the editor.
         */
        initEditor: function (sContainerSelector) {
            var self = this,
                oViewerNode;

            if (!this._editor) {
                // Creates the diagram editor
                this._editor = new sap.galilei.ui.editor.DiagramEditor(this._diagram, sContainerSelector, {
                    extension: {
                        extensionClass: this.getEditorExtensionClassName()
                    },
                    viewer: {
                        viewBackgroundFill: this.getViewBackgroundFill(),
                        showViewBorder: this.getShowViewBorder(),
                        viewBorderWidth: this.getViewBorderWidth(),
                        viewBorderColor: this.getViewBorderColor(),
                        pageHorzNumber: this.getPageHorzNumber(),
                        pageVertNumber: this.getPageVertNumber(),
                        showPageLimit: this.getShowPageLimit(),
                        pageLimitColor: this.getPageLimitColor(),
                        pageBackgroundFill: this.getPageBackgroundFill(),
                        showGrid: this.getShowGrid(),
                        gridSize: this.getGridSize(),
                        gridBorderInnerColor: this.getGridBorderInnerColor(),
                        gridBorderOuterColor: this.getGridBorderOuterColor(),
                        showZoomTools: this.getShowZoomTools(),
                        zoomToolHorizontalAlignment: this.getZoomToolHorizontalAlignment(),
                        zoomToolVerticalAlignment: this.getZoomToolVerticalAlignment()
                    },
                    isReadOnly: this.getIsReadOnly(),
                    snapToGrid: this.getSnapToGrid(),
                    snapToShapes: this.getSnapToShapes(),
                    useContextButtonPad: this.getUseContextButtonPad(),
                    orientation: this.getOrientation(),
                    enableInPlaceEditing: this.getEnableInPlaceEditing(),
                    enableInPlaceEditingAfterCreate: this.getEnableInPlaceEditingAfterCreate(),
                    enablePreserveLinkAfterDelete: this.getEnablePreserveLinkAfterDelete()
                });
                // Do not need the saved diagram anymore
                if (this._diagram) {
                    this._diagram = undefined;
                }
            } else {
                // The parent view could be dropped and recreated (flushed), we need to recreate the viewer and reinitialize the diagram editor.
                oViewerNode = jQuery(this.getId() + ">.svgRoot");
                if (!oViewerNode || oViewerNode.length !== 1) {
                    this._editor.setParentSelector(sContainerSelector, true);
                }
            }

            // Updates the initial viewer size.
            this.onResize();

            // Fires the ready event once.
            if (!this._isReady) {
                this._isReady = true;
                this.fireReady();

                // Updates the viewer size again after the parent control has finished the rendering of all the other controls.
                setTimeout(function () {
                    self.onResize();
                }, 100);
            }
        },

        /**
         * The default UI5 control exit function.
         * @name exit
         * @memberOf sap.galilei.ui5.Editor#
         */
        exit: function () {
            // Checks whether superclass implements the method
            if (sap.ui.core.Control.prototype.exit) {
                // Calls the method with the original arguments
                sap.ui.core.Control.prototype.exit.apply(this, arguments);
            }

            if (this._editor) {
                this._editor.dispose();
                this._editor = undefined;
            }
        },

        /**
         * Sets the diagram editor control width.
         * @memberOf sap.galilei.ui5.Editor#
         * @param {sap.ui.core.CSSSize} sWidth The width.
         */
        setWidth: function (sWidth) {
            this.setProperty("width", sWidth);
            this.$().css("width", sWidth);
            this.onResize();
            return this; // return "this" to allow method chaining
        },

        /**
         * Sets the diagram editor control height.
         * @memberOf sap.galilei.ui5.Editor#
         * @param {sap.ui.core.CSSSize} sHeight The height.
         */
        setHeight: function (sHeight) {
            this.setProperty("height", sHeight);
            this.$().css("height", sHeight);
            this.onResize();
            return this; // return "this" to allow method chaining
        },

        /**
         * Sets the editor extension class name.
         * @memberOf sap.galilei.ui5.Editor#
         * @param {String} sEditorExtensionClassName The editor extension class name.
         */
        setEditorExtensionClassName: function (sEditorExtensionClassName) {
            this.mProperties.editorExtensionClassName = sEditorExtensionClassName;
            if (this._editor) {
                this._editor.extensionClass = sEditorExtensionClassName;
                this._editor.createExtension();
            }
            return this; // return "this" to allow method chaining
        },

        /**
         * Sets the show diagram editor control border mode.
         * @memberOf sap.galilei.ui5.Editor#
         * @param {Boolean} bShow Indicates whether to show a border around the diagram editor control.
         */
        setShowViewBorder: function (bShow) {
            if (bShow !== undefined) {
                this.mProperties.showViewBorder = bShow;
                if (this._editor) {
                    this._editor.viewer.showViewBorder = bShow;
                }
            }
            return this; // return "this" to allow method chaining
        },

        /**
         * Sets the diagram editor control border width.
         * @memberOf sap.galilei.ui5.Editor#
         * @param {Number} nWidth The border width.
         */
        setViewBorderWidth: function (nWidth) {
            if (nWidth !== undefined) {
                this.mProperties.viewBorderWidth = nWidth;
                if (this._editor) {
                    this._editor.viewer.viewBorderWidth = nWidth;
                }
            }
            return this; // return "this" to allow method chaining
        },

        /**
         * Sets the diagram editor control border color.
         * @memberOf sap.galilei.ui5.Editor#
         * @param {String} sColor The diagram editor control border color.
         */
        setViewBorderColor: function (sColor) {
            if (sColor) {
                this.mProperties.viewBorderColor = sColor;
                if (this._editor) {
                    this._editor.viewer.viewBorderColor = sColor;
                }
            }
            return this; // return "this" to allow method chaining
        },

        /**
         * Sets the diagram editor view background color.
         * @memberOf sap.galilei.ui5.Editor#
         * @param {String} sColor The diagram editor view background color.
         */
        setViewBackgroundFill: function (sColor) {
            if (sColor) {
                this.mProperties.viewBackgroundFill = sColor;
                if (this._editor) {
                    this._editor.viewer.viewBackgroundFill = sColor;
                }
            }
            return this; // return "this" to allow method chaining
        },

        /**
         * Sets the horizontal number of pages.
         * @memberOf sap.galilei.ui5.Editor#
         * @param {Number} nPages The horizontal number of pages.
         */
        setPageHorzNumber: function (nPages) {
            if (nPages !== undefined) {
                this.mProperties.pageHorzNumber = nPages;
                if (this._editor) {
                    this._editor.viewer.pageHorzNumber = nPages;
                }
            }
            return this; // return "this" to allow method chaining
        },

        /**
         * Sets the vertical number of pages.
         * @memberOf sap.galilei.ui5.Editor#
         * @param {Number} nPages The vertical number of pages.
         */
        setPageVertNumber: function (nPages) {
            if (nPages !== undefined) {
                this.mProperties.pageVertNumber = nPages;
                if (this._editor) {
                    this._editor.viewer.pageVertNumber = nPages;
                }
            }
            return this; // return "this" to allow method chaining
        },

        /**
         * Sets the diagram editor page background color.
         * @memberOf sap.galilei.ui5.Editor#
         * @param {String} sColor The diagram editor page background color.
         */
        setPageBackgroundFill: function (sColor) {
            if (sColor) {
                this.mProperties.pageBackgroundFill = sColor;
                if (this._editor) {
                    this._editor.viewer.pageBackgroundFill = sColor;
                }
            }
            return this; // return "this" to allow method chaining
        },

        /**
         * Sets the show page limit mode.
         * @memberOf sap.galilei.ui5.Editor#
         * @param {Boolean} bShow Indicates whether to show the page limit.
         */
        setShowPageLimit: function (bShow) {
            if (bShow !== undefined) {
                this.mProperties.showPageLimit = bShow;
                if (this._editor) {
                    this._editor.viewer.showPageLimit = bShow;
                }
            }
            return this; // return "this" to allow method chaining
        },

        /**
         * Sets the page limit color.
         * @memberOf sap.galilei.ui5.Editor#
         * @param {Boolean} sColor The page limit color.
         */
        setPageLimitColor: function (sColor) {
            if (sColor) {
                this.mProperties.pageLimitColor = sColor;
                if (this._editor) {
                    this._editor.viewer.pageLimitColor = sColor;
                }
            }
            return this; // return "this" to allow method chaining
        },

        /**
         * Sets the show background grid mode.
         * @memberOf sap.galilei.ui5.Editor#
         * @param {Boolean} bShow Indicates whether to show the background grid.
         */
        setShowGrid: function (bShow) {
            if (bShow !== undefined) {
                this.mProperties.showGrid = bShow;
                if (this._editor) {
                    this._editor.showGrid = bShow;
                }
            }
            return this; // return "this" to allow method chaining
        },

        /**
         * Sets the grid size.
         * @memberOf sap.galilei.ui5.Editor#
         * @param {Number} nSize The grid size.
         */
        setGridSize: function (nSize) {
            if (nSize !== undefined) {
                this.mProperties.gridSize = nSize;
                if (this._editor) {
                    this._editor.gridSize = nSize;
                }
            }
            return this; // return "this" to allow method chaining
        },

        /**
         * Sets the grid inner color.
         * @memberOf sap.galilei.ui5.Editor#
         * @param {Boolean} sColor The grid inner color.
         */
        setGridBorderInnerColor: function (sColor) {
            if (sColor) {
                this.mProperties.gridBorderInnerColor = sColor;
                if (this._editor) {
                    this._editor.viewer.gridBorderInnerColor = sColor;
                }
            }
            return this; // return "this" to allow method chaining
        },

        /**
         * Sets the grid outer color.
         * @memberOf sap.galilei.ui5.Editor#
         * @param {Boolean} sColor The grid outer color.
         */
        setGridBorderOuterColor: function (sColor) {
            if (sColor) {
                this.mProperties.gridBorderOuterColor = sColor;
                if (this._editor) {
                    this._editor.viewer.gridBorderOuterColor = sColor;
                }
            }
            return this; // return "this" to allow method chaining
        },

        /**
         * Sets the snap-to-grid mode.
         * @memberOf sap.galilei.ui5.Editor#
         * @param {Boolean} bSnap The snap-to-grid mode.
         */
        setSnapToGrid: function (bSnap) {
            if (bSnap !== undefined) {
                this.mProperties.snapToGrid = bSnap;
                if (this._editor) {
                    this._editor.snapToGrid = bSnap;
                }
            }
            return this; // return "this" to allow method chaining
        },

        /**
         * Sets the snap-to-shapes mode.
         * @memberOf sap.galilei.ui5.Editor#
         * @param {Boolean} bSnap The snap-to-shapes mode.
         */
        setSnapToShapes: function (bSnap) {
            if (bSnap !== undefined) {
                this.mProperties.snapToShapes = bSnap;
                if (this._editor) {
                    this._editor.snapToShapes = bSnap;
                }
            }
            return this; // return "this" to allow method chaining
        },

        /**
         * Sets the use context button pad mode.
         * @memberOf sap.galilei.ui5.Editor#
         * @param {Boolean} bUseContextButtonPad The use context button pad mode.
         */
        setUseContextButtonPad: function (bUseContextButtonPad) {
            if (bUseContextButtonPad !== undefined) {
                this.mProperties.useContextButtonPad = bUseContextButtonPad;
                if (this._editor) {
                    this._editor.useContextButtonPad = bUseContextButtonPad;
                }
            }
            return this; // return "this" to allow method chaining
        },

        /**
         * Sets the diagram orientation. The supported values are: undefined, "horizontal", "vertical".
         * @memberOf sap.galilei.ui5.Editor#
         * @param {String} sOrientation The orientation.
         */
        setOrientation: function (sOrientation) {
            if (sOrientation) {
                this.mProperties.orientation = sOrientation;
                if (this._editor) {
                    this._editor.orientation = sOrientation;
                }
            }
            return this; // return "this" to allow method chaining
        },

        /**
         * Sets the show zoom tools mode.
         * @memberOf sap.galilei.ui5.Editor#
         * @param {Boolean} bShow Indicates whether to show the zoom tools.
         */
        setShowZoomTools: function (bShow) {
            if (bShow !== undefined) {
                this.mProperties.showZoomTools = bShow;
                if (this._editor) {
                    this._editor.viewer.showZoomTools = bShow;
                }
            }
            return this; // return "this" to allow method chaining
        },

        /**
         * Sets the horizontal alignment of the zoom tools.
         * @memberOf sap.galilei.ui5.Editor#
         * @param {sap.galilei.ui.common.HorizontalAlignment} sAlignment Horizontal alignment.
         */
        setZoomToolHorizontalAlignment: function (sAlignment) {
            if (sAlignment) {
                this.mProperties.zoomToolHorizontalAlignment = sAlignment;
                if (this._editor) {
                    this._editor.viewer.zoomToolHorizontalAlignment = sAlignment;
                }
            }
            return this; // return "this" to allow method chaining
        },

        /**
         * Sets the horizontal alignment of the zoom tools.
         * @memberOf sap.galilei.ui5.Editor#
         * @param {sap.galilei.ui.common.VerticalAlignment} sAlignment Vertical alignment.
         */
        setZoomToolVerticalAlignment: function (sAlignment) {
            if (sAlignment) {
                this.mProperties.zoomToolVerticalAlignment = sAlignment;
                if (this._editor) {
                    this._editor.viewer.zoomToolVerticalAlignment = sAlignment;
                }
            }
            return this; // return "this" to allow method chaining
        },

        /**
         * Sets the enable in-place editing mode.
         * @memberOf sap.galilei.ui5.Editor#
         * @param {Boolean} bEnable Indicates whether in-place editing is enabled.
         */
        setEnableInPlaceEditing: function (bEnable) {
            if (bEnable !== undefined) {
                this.mProperties.enableInPlaceEditing = bEnable;
                if (this._editor) {
                    this._editor.enableInPlaceEditing = bEnable;
                }
            }
            return this; // return "this" to allow method chaining
        },

        /**
         * Sets the enable in-place editing after creating a symbol mode.
         * @memberOf sap.galilei.ui5.Editor#
         * @param {Boolean} bEnable Indicates whether in-place editing is enabled after creating a symbol.
         */
        setEnableInPlaceEditingAfterCreate: function (bEnable) {
            if (bEnable !== undefined) {
                this.mProperties.enableInPlaceEditingAfterCreate = bEnable;
                if (this._editor) {
                    this._editor.enableInPlaceEditingAfterCreate = bEnable;
                }
            }
            return this; // return "this" to allow method chaining
        },

        /**
         * Sets the enable preserve link after deleting a node symbol mode.
         * @memberOf sap.galilei.ui5.Editor#
         * @param {Boolean} bEnable Indicates whether preserve link is enabled after deleting a node symbol.
         */
        setEnablePreserveLinkAfterDelete: function (bEnable) {
            if (bEnable !== undefined) {
                this.mProperties.enablePreserveLinkAfterDelete = bEnable;
                if (this._editor) {
                    this._editor.enablePreserveLinkAfterDelete = bEnable;
                }
            }
            return this; // return "this" to allow method chaining
        },

        /**
         * Sets the diagram editor readonly mode.
         * @memberOf sap.galilei.ui5.Editor#
         * @param {Boolean} bReadOnly Indicates whether the diagram editor is in readonly mode.
         */
        setIsReadOnly: function (bReadOnly) {
            if (bReadOnly !== undefined) {
                if (bReadOnly !== this.mProperties.isReadOnly) {
                    this.mProperties.isReadOnly = bReadOnly;
                    if (this._editor) {
                        this._editor.isReadOnly = bReadOnly;
                    }
                }
            }
            return this; // return "this" to allow method chaining
        },

        /**
         * Gets the inner diagram editor.
         * @name getInnerEditor
         * @memberOf sap.galilei.ui5.Editor#
         * @returns {sap.galilei.ui.editor.DiagramEditor}
         */
        getInnerEditor: function () {
            return this._editor;
        },

        /**
         * Sets the diagram of the diagram editor.
         * @name setDiagram
         * @memberOf sap.galilei.ui5.Editor#
         * @param {sap.galilei.ui.diagram.Diagram} oDiagram The diagram to be set.
         */
        setDiagram: function (oDiagram) {
            if (this._editor) {
                // TODO: We need to find the diagram definition and switch editor extension automatically.
                this._editor.diagram = oDiagram;
            } else {
                // The inner diagram editor is not created yet, keeps the diagram
                this._diagram = oDiagram;
            }
        },

        /**
         * Gets the diagram of the diagram editor.
         * @name getDiagram
         * @memberOf sap.galilei.ui5.Editor#
         * @returns {sap.galilei.ui.diagram.Diagram}
         */
        getDiagram: function () {
            if (this._editor) {
                return this._editor.diagram;
            } else {
                // Uses the default diagram.
                return this._diagram;
            }
        },

        /**
         * Gets the model of the diagram.
         * @name getDiagramModel
         * @memberOf sap.galilei.ui5.Editor#
         * @returns {sap.galilei.model.Model}
         */
        getDiagramModel: function () {
            if (this._editor) {
                return this._editor.model;
            } else if (this._diagram) {
                // Uses the default model.
                return this._diagram.model;
            }
        },

        /**
         * Gets the resource of the diagram and model.
         * @name getResource
         * @memberOf sap.galilei.ui5.Editor#
         * @returns {sap.galilei.model.Resource}
         */
        getResource: function () {
            if (this._editor) {
                return this._editor.resource;
            } else if (this._diagram) {
                // Uses the default resource.
                return this._diagram.resource;
            }
        },

        /**
         * Resets the diagram editor so that it could be reused for another diagram.
         * @name resetEditor
         * @memberOf sap.galilei.ui5.Editor#
         */
        resetEditor: function () {
            if (this._editor) {
                this._editor.resetEditor();
            }
        },

        /**
         * Undoes the previous action.
         * @name undo
         * @memberOf sap.galilei.ui5.Editor#
         */
        undo: function () {
            if (this._editor) {
                this._editor.undo();
            }
        },

        /**
         * Redoes the undone action.
         * @name redo
         * @memberOf sap.galilei.ui5.Editor#
         */
        redo: function () {
            if (this._editor) {
                this._editor.redo();
            }
        },

        /**
         * Deletes the selected symbols from the diagram.
         * @function
         * @name deleteSelectedSymbols
         * @memberOf sap.galilei.ui5.Editor#
         * @param {Boolean} bDeleteObject (optional) Indicates whether the object of the symbol should be deleted. The default is true.
         * @param {Boolean} bPreserveLink (optional) Indicates whether the source link should be preserved. The default is true.
         * @param {Boolean} bUseUndoAction (optional) Indicates whether a new undo action should be used. The default is true.
         */
        deleteSelectedSymbols: function (bDeleteObject, bPreserveLink) {
            if (this._editor) {
                this._editor.deleteSelectedSymbols(bDeleteObject, bPreserveLink);
            }
        },

        /**
         * Reviews the viewer when the parent element size is changed.
         * @name onResize
         * @memberOf sap.galilei.ui5.Editor#
         */
        onResize: function () {
            if (this._editor) {
                this._editor.viewer.onResize();
            }
        },

        /**
         * Zooms in.
         * @function
         * @name zoomIn
         * @memberOf sap.galilei.ui5.Editor#
         */
        zoomIn: function () {
            if (this._editor) {
                this._editor.viewer.zoomIn();
            }
        },

        /**
         * Zooms out.
         * @function
         * @name zoomOut
         * @memberOf sap.galilei.ui5.Editor#
         */
        zoomOut: function () {
            if (this._editor) {
                this._editor.viewer.zoomOut();
            }
        },

        /**
         * Shows the global view.
         * @function
         * @name showGlobalView
         * @memberOf sap.galilei.ui5.Editor#
         * @param {Boolean} bUseAnimation (Optional) Indicates whether the animation can be used. The default is true.
         */
        showGlobalView: function (bUseAnimation) {
            if (this._editor) {
                this._editor.showGlobalView(bUseAnimation);
            }
        },

        /**
         * Shows the actual size (100%)
         * @function
         * @name showActualSize
         * @memberOf sap.galilei.ui5.Editor#
         */
        showActualSize: function () {
            if (this._editor) {
                this._editor.viewer.showActualSize();
            }
        },

        /**
         * Shows the initial view (100%, no offset).
         * @function
         * @name showInitialView
         * @memberOf sap.galilei.ui5.Editor#
         */
        showInitialView: function () {
            if (this._editor) {
                this._editor.viewer.showInitialView();
            }
        },

        /**
         * Shows all pages in view.
         * @function
         * @name showAllPages
         * @memberOf sap.galilei.ui5.Editor#
         */
        showAllPages: function () {
            if (this._editor) {
                this._editor.viewer.showAllPages();
            }
        },

        /**
         * Shows the used pages in the view.
         * @function
         * @name showUsedPages
         * @memberOf sap.galilei.ui5.Editor#
         */
        showUsedPages: function () {
            if (this._editor) {
                this._editor.viewer.showUsedPages();
            }
        },

        /**
         * Selects the pointer tool.
         * @function
         * @name selectPointerTool
         * @memberOf sap.galilei.ui5.Editor#
         */
        selectPointerTool: function () {
            if (this._editor) {
                this._editor.selectTool(sap.galilei.ui.editor.tool.PointerTool.NAME);
            }
        },

        /**
         * Selects the lasso tool.
         * @function
         * @name selectLassoTool
         * @memberOf sap.galilei.ui5.Editor#
         */
        selectLassoTool: function () {
            if (this._editor) {
                this._editor.selectTool(sap.galilei.ui.editor.tool.LassoTool.NAME);
            }
        },

        /**
         * Selects a tool.
         * @function
         * @name selectTool
         * @memberOf sap.galilei.ui5.Editor#
         * @param {String} sTool The tool name. If the tool name is not default, no tool will be selected.
         * @param {Boolean} bUnselectSymbols (optional) Unselect the selected symbols. The default is true.
         */
        selectTool: function (sToolName, bUnselectSymbols) {
            if (this._editor) {
                this._editor.selectTool(sToolName, bUnselectSymbols);
            }
        },

        /**
         * Changes to edit mode.
         * @function
         * @name setEditMode
         * @memberOf sap.galilei.ui5.Editor#
         */
        setEditMode: function () {
            this.setIsReadOnly(false);
        },

        /**
         * Changes to readonly mode.
         * @function
         * @name setReadOnlyMode
         * @memberOf sap.galilei.ui5.Editor#
         */
        setReadOnlyMode: function () {
            this.setIsReadOnly(true);
        },

        /**
         * Toggles the the readonly/edit mode.
         * @function
         * @name toggleReadOnly
         * @memberOf sap.galilei.ui5.Editor#
         */
        toggleReadOnly: function () {
            this.setIsReadOnly(this.getIsReadOnly());
        },

        /**
         * Toggles the the readonly/edit mode.
         * @function
         * @name save
         * @memberOf sap.galilei.ui5.Editor#
         */
        save: function () {
            // You could use the following code to save your model & diagram in default Galilei json format.
//            if (this._editor) {
//                var oWriter = new sap.galilei.model.JSONWriter(),
//                    oResult = oWriter.save(this.getResource());
//                console.log(oResult);
//            }
        },

        /**
         * Prints the diagram. It shows a Print Diagram dialog to allow the user to select the printer settings.
         * To print the diagram, it generates a PDF (Chrome and Firefox) or a HTML page depending on the Web browser.
         * Note: Some web browsers (IE, Safari) don't allow the conversion of SVG to image.
         * @name print
         * @memberOf sap.galilei.ui5.Editor#
         * @param {object} oOptions (Optional) The print diagram options.
         *     includeDecoratorLayers: Indicates whether decorator layers should be included. Default: false.
         */
        print: function (oOptions) {
            if (this._editor) {
                jQuery.sap.require("sap.galilei.ui5.diagram.PrintDiagramHelper");
                sap.galilei.ui5.diagram.PrintDiagramHelper.printDiagram(this._editor, oOptions);
            }
        },

        /**
         * Exports the diagram image.
         * @memberOf sap.galilei.ui5.Editor#
         * @param {sap.galilei.ui.editor.DiagramEditor} oDiagramEditor The diagram editor.
         * @param {object} oOptions (optional) The export options. The options are:
         *     includeDecoratorLayers: Indicates whether decorator layers should be included. Default: false.
         *     fileName: The file name without extension.
         *     imageType: The image type. It could be: "image/png", "image/jpeg", "image/svg". The default is "image/svg".
         */
        exportImage: function (oOptions) {
            if (this._editor) {
                jQuery.sap.require("sap.galilei.ui5.diagram.ExportDiagram");
                sap.galilei.ui5.diagram.ExportDiagram.exportImage(this._editor, oOptions);
            }
        }
    });
}());
