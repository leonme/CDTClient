/**
 * This file defines a SAP UI5 impact and lineage analysis editor control.
 
 * Date: 25/05/15
 * (c) Copyright 2013-2015 SAP SE. All rights reserved
 */

jQuery.sap.declare("sap.galilei.ui5.ImpactAnalysisEditor");

(function () {
    jQuery.sap.require("sap.galilei.ui5.Editor");

    "use strict";

    /**
     * @class
     * @name sap.galilei.ui5.EditorSettings
     * Defines the diagram editor UI5 control default settings.
     * These default parameters can be modified before creating a diagram editor control.
     */
    sap.galilei.ui5.ImpactAnalysisEditorSettings = {
        impactAnalyzerClassName: "sap.galilei.ui.editor.impactAnalysis.ImpactAnalyzer",
        editorExtensionClassName: "sap.galilei.ui.editor.impactAnalysis.DiagramEditorExtension",
        impactAnalysisModelClassName: "sap.galilei.impactAnalysis.Model",
        impactAnalysisNodeClassName: "sap.galilei.impactAnalysis.Node",
        impactAnalysisNodeLinkClassName: "sap.galilei.impactAnalysis.NodeLink",
        impactAnalysisDiagramClassName: "sap.galilei.impactAnalysis.ui.Diagram",
        impactAnalysisNodeSymbolClassName: "sap.galilei.impactAnalysis.ui.NodeSymbol",
        impactAnalysisNodeLinkSymbolClassName: "sap.galilei.impactAnalysis.ui.NodeLinkSymbol",
        objectAdapterClassName: "sap.galilei.impactAnalysis.ObjectAdapter",
        serviceProviderClassName: "sap.galilei.impactAnalysis.ServiceProvider",
        objectSerializerClassName: "sap.galilei.impactAnalysis.ObjectSerializer",
        orientation: sap.galilei.ui.symbol.Orientation.horizontal,
        showImpact: true,
        showLineage: false,
        showPath: true,
        autoUpdateExpander: true,
        expandLevel: 1,
        supportBusyDialog: false
    };

    /**
     * @class
     * @name sap.galilei.ui5.ImpactAnalysisEditor
     * Defines the SAP UI5 impact and lineage analysis editor control.
     */
    sap.galilei.ui5.Editor.extend("sap.galilei.ui5.ImpactAnalysisEditor", {
        metadata : {
            /**
             * Defines the UI5 control properties
             */
            properties: {
                /**
                 * Gets or sets the impact analyzer class name.
                 * @name impactAnalyzerClassName
                 * @memberOf sap.galilei.ui5.ImpactAnalysisEditor#
                 * @type {string}
                 * @default "sap.galilei.ui.editor.impactAnalysis.ImpactAnalyzer"
                 */
                "impactAnalyzerClassName": { type: "string", defaultValue: sap.galilei.ui5.ImpactAnalysisEditorSettings.impactAnalyzerClassName },

                /**
                 * The diagram editor extension class name.
                 * @name editorExtensionClassName
                 * @memberOf sap.galilei.ui5.ImpactAnalysisEditor#
                 * @type {string}
                 */
                "editorExtensionClassName": { type: "string", defaultValue: sap.galilei.ui5.ImpactAnalysisEditorSettings.editorExtensionClassName },

                /**
                 * Gets or sets the impact analysis model class name.
                 * @name impactAnalysisModelClassName
                 * @memberOf sap.galilei.ui5.ImpactAnalysisEditor#
                 * @type {String}
                 */
                "impactAnalysisModelClassName": { type: "string", defaultValue: sap.galilei.ui5.ImpactAnalysisEditorSettings.impactAnalysisModelClassName },

                /**
                 * Gets or sets the impact analysis node class name.
                 * @name impactAnalysisNodeClassName
                 * @memberOf sap.galilei.ui5.ImpactAnalysisEditor#
                 * @type {String}
                 */
                "impactAnalysisNodeClassName": { type: "string", defaultValue: sap.galilei.ui5.ImpactAnalysisEditorSettings.impactAnalysisNodeClassName },

                /**
                 * Gets or sets the impact analysis node link class name.
                 * @name impactAnalysisNodeLinkClassName
                 * @memberOf sap.galilei.ui5.ImpactAnalysisEditor#
                 * @type {String}
                 */
                "impactAnalysisNodeLinkClassName": { type: "string", defaultValue: sap.galilei.ui5.ImpactAnalysisEditorSettings.impactAnalysisNodeLinkClassName },

                /**
                 * Gets or sets the impact analysis diagram class name.
                 * @name impactAnalysisDiagramClassName
                 * @memberOf sap.galilei.ui5.ImpactAnalysisEditor#
                 * @type {String}
                 */
                "impactAnalysisDiagramClassName": { type: "string", defaultValue: sap.galilei.ui5.ImpactAnalysisEditorSettings.impactAnalysisDiagramClassName },

                /**
                 * Gets or sets the impact analysis node symbol class name.
                 * @name impactAnalysisNodeSymbolClassName
                 * @memberOf sap.galilei.ui5.ImpactAnalysisEditor#
                 * @type {String}
                 */
                "impactAnalysisNodeSymbolClassName": { type: "string", defaultValue: sap.galilei.ui5.ImpactAnalysisEditorSettings.impactAnalysisNodeSymbolClassName },

                /**
                 * Gets or sets the impact analysis node link symbol class name.
                 * @name impactAnalysisNodeLinkSymbolClassName
                 * @memberOf sap.galilei.ui5.ImpactAnalysisEditor#
                 * @type {String}
                 */
                "impactAnalysisNodeLinkSymbolClassName": { type: "string", defaultValue: sap.galilei.ui5.ImpactAnalysisEditorSettings.impactAnalysisNodeLinkSymbolClassName },

                /**
                 * Gets or sets the object adapter class name.
                 * @name objectAdapterClassName
                 * @memberOf sap.galilei.ui5.ImpactAnalysisEditor#
                 * @type {String}
                 */
                "objectAdapterClassName": { type: "string", defaultValue: sap.galilei.ui5.ImpactAnalysisEditorSettings.objectAdapterClassName },

                /**
                 * Gets or sets the srrvice provider class name.
                 * @name serviceProviderClassName
                 * @memberOf sap.galilei.ui5.ImpactAnalysisEditor#
                 * @type {String}
                 */
                "serviceProviderClassName": { type: "string", defaultValue: sap.galilei.ui5.ImpactAnalysisEditorSettings.serviceProviderClassName },

                /**
                 * Gets or sets the object serializer class name.
                 * @name objectSerializerClassName
                 * @memberOf sap.galilei.ui5.ImpactAnalysisEditor#
                 * @type {String}
                 */
                "objectSerializerClassName": { type: "string", defaultValue: sap.galilei.ui5.ImpactAnalysisEditorSettings.objectSerializerClassName },

                /**
                 * Gets or sets the orientation.
                 * @name orientation
                 * @memberOf sap.galilei.ui5.ImpactAnalysisEditor#
                 * @type {sap.galilei.ui.symbol.Orientation}
                 * @default sap.galilei.ui.symbol.Orientation.horizontal
                 */
                "orientation": { type: "string", defaultValue: sap.galilei.ui5.ImpactAnalysisEditorSettings.orientation },

                /**
                 * Indicates whether to show impact analysis.
                 * @name showImpact
                 * @memberOf sap.galilei.ui5.ImpactAnalysisEditor#
                 * @type {boolean}
                 * @default true
                 */
                "showImpact": { type: "boolean", defaultValue: sap.galilei.ui5.ImpactAnalysisEditorSettings.showImpact },

                /**
                 * Indicates whether to show lineage analysis.
                 * @name showLineage
                 * @memberOf sap.galilei.ui5.ImpactAnalysisEditor#
                 * @type {boolean}
                 * @default false
                 */
                "showLineage": { type: "boolean", defaultValue: sap.galilei.ui5.ImpactAnalysisEditorSettings.showLineage },

                /**
                 * Indicates whether to highlight the path between a symbol and the initial symbol.
                 * @name showPath
                 * @memberOf sap.galilei.ui5.ImpactAnalysisEditor#
                 * @type {boolean}
                 * @default true
                 */
                "showPath": { type: "boolean", defaultValue: sap.galilei.ui5.ImpactAnalysisEditorSettings.showPath },

                /**
                 * Indicates whether to automatically update the expander status.
                 * @name autoUpdateExpander
                 * @memberOf sap.galilei.ui5.ImpactAnalysisEditor#
                 * @type {boolean}
                 * @default true
                 */
                "autoUpdateExpander": { type: "boolean", defaultValue: sap.galilei.ui5.ImpactAnalysisEditorSettings.autoUpdateExpander },

                /**
                 * Gets or sets the default expand levels.
                 * @name expandLevel
                 * @memberOf sap.galilei.ui5.ImpactAnalysisEditor#
                 * @type {Number}
                 * @default 1
                 */
                "expandLevel": { type: "int", defaultValue: sap.galilei.ui5.ImpactAnalysisEditorSettings.expandLevel },

                /**
                 * Indicates whether to highlight the path between a symbol and the initial symbol.
                 * @name supportBusyDialog
                 * @memberOf sap.galilei.ui5.ImpactAnalysisEditor#
                 * @type {boolean}
                 * @default false
                 */
                "supportBusyDialog": { type: "boolean", defaultValue: sap.galilei.ui5.ImpactAnalysisEditorSettings.supportBusyDialog }
            },

            /**
             * Defines the UI5 control events
             */
            events: {
            }
        },

        /**
         * Gets or sets the impact analyzer instance.
         * @private
         * @name _impactAnalyzer
         * @memberOf sap.galilei.ui5.ImpactAnalysisEditor#
         * @type {sap.galilei.ui.editor.impactAnalysis.ImpactAnalyzer}
         */
        _impactAnalyzer: undefined,

        /**
         * The default UI5 control initialization function.
         * @name init
         * @memberOf sap.galilei.ui5.ImpactAnalysisEditor#
         */
        init: function () {
            // Checks whether superclass implements the method
            if (sap.galilei.ui5.Editor.prototype.init) {
                // Calls the method with the original arguments
                sap.galilei.ui5.Editor.prototype.init.apply(this, arguments);
            }

            // Sets the default parameters in case they are modified.
        },

        /**
         * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
         * Just reuse the renderer defined in Editor control.
         * @memberOf sap.galilei.ui5.ImpactAnalysisEditor#
         * @param {sap.ui.core.RenderManager} oRenderManager The RenderManager that can be used for writing to the render output buffer
         * @param {sap.ui.core.Control} oControl An object representing the control that should be rendered
         */
        renderer: {},

        /**
         * Callback when the diagram editor control is rendered.
         * @name onAfterRendering
         * @memberOf sap.galilei.ui5.ImpactAnalysisEditor#
         */
        onAfterRendering: function () {
            // Calls the default onAfterRendering() defined in Editor control.
            this.defaultOnAfterRendering();
        },

        /**
         * The default UI5 control exit function.
         * @name exit
         * @memberOf sap.galilei.ui5.ImpactAnalysisEditor#
         */
        exit: function () {
            // Checks whether superclass implements the method
            if (sap.galilei.ui5.Editor.prototype.exit) {
                // Calls the method with the original arguments
                sap.galilei.ui5.Editor.prototype.exit.apply(this, arguments);
            }

            // Specific clean up
            if (this._impactAnalyzer) {
                this._impactAnalyzer.dispose();
                this._impactAnalyzer = undefined;
            }
        },

        /**
         * Sets the impact analyzer class name.
         * @memberOf sap.galilei.ui5.ImpactAnalysisEditor#
         * @param {String} sClassName The class name.
         */
        setImpactAnalyzerClassName: function (sClassName) {
            if (sClassName) {
                this.mProperties.impactAnalyzerClassName = sClassName;
            }
            return this;
        },

        /**
         * Sets the impact analysis editor extension class name.
         * @memberOf sap.galilei.ui5.ImpactAnalysisEditor#
         * @param {String} sClassName The class name.
         */
        setEditorExtensionClassName: function (sClassName) {
            this.mProperties.editorExtensionClassName = sClassName;
            if (this._editor) {
                this._editor.extensonClass = sClassName;
                this._editor.createExtenson();
            }
            return this;
        },

        /**
         * Sets the impact analysis model class name.
         * @memberOf sap.galilei.ui5.ImpactAnalysisEditor#
         * @param {String} sClassName The class name.
         */
        setImpactAnalysisModelClassName: function (sClassName) {
            if (sClassName) {
                this.mProperties.impactAnalysisModelClassName = sClassName;
            }
            return this;
        },

        /**
         * Sets the impact analysis node class name.
         * @memberOf sap.galilei.ui5.ImpactAnalysisEditor#
         * @param {String} sClassName The class name.
         */
        setImpactAnalysisNodeClassName: function (sClassName) {
            if (sClassName) {
                this.mProperties.impactAnalysisNodeClassName = sClassName;
            }
            return this;
        },

        /**
         * Sets the impact analysis node link class name.
         * @memberOf sap.galilei.ui5.ImpactAnalysisEditor#
         * @param {String} sClassName The class name.
         */
        setImpactAnalysisNodeLinkClassName: function (sClassName) {
            if (sClassName) {
                this.mProperties.impactAnalysisNodeLinkClassName = sClassName;
            }
            return this;
        },

        /**
         * Sets the impact analysis diagram class name.
         * @memberOf sap.galilei.ui5.ImpactAnalysisEditor#
         * @param {String} sClassName The class name.
         */
        setImpactAnalysisDiagramClassName: function (sClassName) {
            if (sClassName) {
                this.mProperties.impactAnalysisDiagramClassName = sClassName;
            }
            return this;
        },

        /**
         * Sets the impact analysis node symbol class name.
         * @memberOf sap.galilei.ui5.ImpactAnalysisEditor#
         * @param {String} sClassName The class name.
         */
        setImpactAnalysisNodeSymbolClassName: function (sClassName) {
            if (sClassName) {
                this.mProperties.impactAnalysisNodeSymbolClassName = sClassName;
            }
            return this;
        },

        /**
         * Sets the impact analysis node link symbol class name.
         * @memberOf sap.galilei.ui5.ImpactAnalysisEditor#
         * @param {String} sClassName The class name.
         */
        setImpactAnalysisNodeLinkSymbolClassName: function (sClassName) {
            if (sClassName) {
                this.mProperties.impactAnalysisNodeLinkSymbolClassName = sClassName;
            }
            return this;
        },

        /**
         * Sets the object adapter class name.
         * @memberOf sap.galilei.ui5.ImpactAnalysisEditor#
         * @param {String} sClassName The class name.
         */
        setObjectAdapterClassName: function (sClassName) {
            if (sClassName) {
                this.mProperties.objectAdapterClassName = sClassName;
            }
            return this;
        },

        /**
         * Sets the service provider class name.
         * @memberOf sap.galilei.ui5.ImpactAnalysisEditor#
         * @param {String} sClassName The class name.
         */
        setServiceProviderClassName: function (sClassName) {
            if (sClassName) {
                this.mProperties.serviceProviderClassName = sClassName;
            }
            return this;
        },

        /**
         * Sets the object adapter class name.
         * @memberOf sap.galilei.ui5.ImpactAnalysisEditor#
         * @param {String} sClassName The class name.
         */
        setObjectSerializerClassName: function (sClassName) {
            if (sClassName) {
                this.mProperties.objectSerializerClassName = sClassName;
            }
            return this;
        },

        /**
         * Sets the diagram orientation.
         * @memberOf sap.galilei.ui5.ImpactAnalysisEditor#
         * @param {String} sOrientation The diagram orientation. The supported values are "horizontal", "vertical".
         */
        setOrientation: function (sOrientation) {
            if (sOrientation !== undefined) {
                this.mProperties.orientation = sOrientation;
                if (this._impactAnalyzer) {
                    this._impactAnalyzer.orientation = sOrientation;
                }
            }
            return this;
        },

        /**
         * Sets the show impact mode.
         * @memberOf sap.galilei.ui5.ImpactAnalysisEditor#
         * @param {Boolean} bShow Indicates whether to show impact.
         */
        setShowImpact: function (bShow) {
            if (bShow !== undefined) {
                this.mProperties.showImpact = bShow;
                if (this._impactAnalyzer) {
                    this._impactAnalyzer.showImpact = bShow;
                }
            }
            return this;
        },

        /**
         * Sets the show lineage mode.
         * @memberOf sap.galilei.ui5.ImpactAnalysisEditor#
         * @param {Boolean} bShow Indicates whether to show lineage.
         */
        setShowLineage: function (bShow) {
            if (bShow !== undefined) {
                this.mProperties.showLineage = bShow;
                if (this._impactAnalyzer) {
                    this._impactAnalyzer.showLineage = bShow;
                }
            }
            return this;
        },

        /**
         * Sets the show path mode.
         * @memberOf sap.galilei.ui5.ImpactAnalysisEditor#
         * @param {Boolean} bShow Indicates whether to show path.
         */
        setShowPath: function (bShow) {
            if (bShow !== undefined) {
                this.mProperties.showPath = bShow;
                if (this._impactAnalyzer) {
                    this._impactAnalyzer.showPath = bShow;
                }
            }
            return this;
        },

        /**
         * Sets the auto-update expander mode.
         * @memberOf sap.galilei.ui5.ImpactAnalysisEditor#
         * @param {Boolean} bUpdate Indicates whether to automatically update the expander.
         */
        setAutoUpdateExpander: function (bUpdate) {
            if (bUpdate !== undefined) {
                this.mProperties.autoUpdateExpander = bUpdate;
                if (this._impactAnalyzer) {
                    this._impactAnalyzer.autoUpdateExpander = bUpdate;
                }
            }
            return this;
        },

        /**
         * Sets the expand level.
         * @memberOf sap.galilei.ui5.ImpactAnalysisEditor#
         * @param {Number} nLevel The expand level.
         */
        setExpandLevel: function (nLevel) {
            if (nLevel !== undefined) {
                this.mProperties.expandLevel = nLevel;
                if (this._impactAnalyzer) {
                    this._impactAnalyzer.expandLevel = nLevel;
                }
            }
            return this;
        },


        /**
         * Sets the support busy dialog mode.
         * @memberOf sap.galilei.ui5.ImpactAnalysisEditor#
         * @param {Boolean} bSupport Indicates whether a busy dialog is supported.
         */
        setSupportBusyDialog: function (bSupport) {
            if (bSupport !== undefined) {
                this.mProperties.supportBusyDialog = bSupport;
                if (this._impactAnalyzer) {
                    this._impactAnalyzer.supportBusyDialog = bSupport;
                }
            }
            return this;
        },

        /**
         * Gets the impact analyzer instance.
         * @name getImpactAnalyzer
         * @memberOf sap.galilei.ui5.ImpactAnalysisEditor#
         * @returns {sap.galilei.ui.editor.impactAnalysis.ImpactAnalyzer}
         */
        getImpactAnalyzer: function () {
            return this._impactAnalyzer;
        },

        /**
         * Creates the impact analyzer instance.
         * @name createImpactAnalyzer
         * @memberOf sap.galilei.ui5.ImpactAnalysisEditor#
         * @param {Object} oParams The impact analyzer parameters
         * @returns {sap.galilei.ui.editor.impactAnalysis.ImpactAnalyzer}
         */
        createImpactAnalyzer: function (oParams) {
            var oOptions = {},
                oDiagramEditor;

            oParams = oParams || {};
            sap.galilei.core.copyProperties(oOptions, oParams, true);

            // Sets the properties
            oOptions.impactAnalysisModelClassName          = oOptions.impactAnalysisModelClassName          || this.getProperty("impactAnalysisModelClassName");
            oOptions.impactAnalysisNodeClassName           = oOptions.impactAnalysisNodeClassName           || this.getProperty("impactAnalysisNodeClassName");
            oOptions.impactAnalysisNodeLinkClassName       = oOptions.impactAnalysisNodeLinkClassName       || this.getProperty("impactAnalysisNodeLinkClassName");
            oOptions.impactAnalysisDiagramClassName        = oOptions.impactAnalysisDiagramClassName        || this.getProperty("impactAnalysisDiagramClassName");
            oOptions.impactAnalysisNodeSymbolClassName     = oOptions.impactAnalysisNodeSymbolClassName     || this.getProperty("impactAnalysisNodeSymbolClassName");
            oOptions.impactAnalysisNodeLinkSymbolClassName = oOptions.impactAnalysisNodeLinkSymbolClassName || this.getProperty("impactAnalysisNodeLinkSymbolClassName");
            oOptions.objectAdapterClassName                = oOptions.objectAdapterClassName                || this.getProperty("objectAdapterClassName");
            oOptions.serviceProviderClassName              = oOptions.serviceProviderClassName              || this.getProperty("serviceProviderClassName");
            oOptions.objectSerializerClassName             = oOptions.objectSerializerClassName             || this.getProperty("objectSerializerClassName");
            oOptions.orientation                           = oOptions.orientation                           || this.getProperty("orientation");
            oOptions.showImpact                            = oOptions.showImpact                            || this.getProperty("showImpact");
            oOptions.showLineage                           = oOptions.showLineage                           || this.getProperty("showLineage");
            oOptions.showPath                              = oOptions.showPath                              || this.getProperty("showPath");
            oOptions.autoUpdateExpander                    = oOptions.autoUpdateExpander                    || this.getProperty("autoUpdateExpander");
            oOptions.expandLevel                           = oOptions.expandLevel                           || this.getProperty("expandLevel");
            oOptions.supportBusyDialog                     = oOptions.supportBusyDialog                     || this.getProperty("supportBusyDialog");

            // Sets the editor
            oDiagramEditor = this.getInnerEditor();
            if (oDiagramEditor) {
                oOptions.editor = oDiagramEditor;

                // Allows users to move the nodes
                oDiagramEditor.isReadOnly = false;

                // Do not change fill color when showing path
                oDiagramEditor.highlightFillColor = undefined;

                // Do not allow deleting symbol
                oDiagramEditor.enableDeleteSymbol = false;

                // Do not support in-place editing
                oDiagramEditor.enableInPlaceEditing = false;

                delete oOptions.parentSelector;
            }

            this._impactAnalyzer = sap.galilei.core.createNewInstance(this.getProperty("impactAnalyzerClassName"), oOptions);
            return this._impactAnalyzer;
        },

        /**
         * Gets or creates the impact analyzer instance.
         * @name getOrCreateImpactAnalyzer
         * @memberOf sap.galilei.ui5.ImpactAnalysisEditor#
         * @param {Object} oParams (Optional) The impact analyzer parameters
         * @returns {sap.galilei.ui.editor.impactAnalysis.ImpactAnalyzer}
         */
        getOrCreateImpactAnalyzer: function (oParams) {
            var oImpactAnalyzer = this._impactAnalyzer;

            if (!oImpactAnalyzer) {
                oImpactAnalyzer = this.createImpactAnalyzer(oParams);
            }
            return oImpactAnalyzer;
        },

        /**
         * Analyzes the impact and/or lineage of an object.
         * @name analyze
         * @memberOf sap.galilei.ui5.ImpactAnalysisEditor#
         * @param {sap.galilei.common.Object} oAnalysisObject The object to be analyzed for the impact and the lineage.
         * @param {sap.galilei.common.Model} oParams (optional) The option parameters that can properties of ImpactAnalyzer.
         */
        analyze: function (oAnalysisObject, oParams) {
            var oImpactAnalyzer = this.getImpactAnalyzer();

            if (oImpactAnalyzer && oAnalysisObject) {
                oImpactAnalyzer.analyze(oAnalysisObject, oParams);
            }
            return this; // return "this" to allow method chaining
        },

        /**
         * Analyzes the impact of an object.
         * @name analyzeImpact
         * @memberOf sap.galilei.ui5.ImpactAnalysisEditor#
         * @param {sap.galilei.common.Object} oAnalysisObject The object to be analyzed for the impact and the lineage.
         * @param {sap.galilei.common.Model} oParams (optional) The option parameters that can properties of ImpactAnalyzer.
         */
        analyzeImpact: function (oAnalysisObject, oParams) {
            var oImpactAnalyzer = this.getImpactAnalyzer();

            if (oImpactAnalyzer && oAnalysisObject) {
                oImpactAnalyzer.analyzeImpact(oAnalysisObject, oParams);
            }
            return this; // return "this" to allow method chaining
        },

        /**
         * Analyzes the lineage of an object.
         * @name analyzeLineage
         * @memberOf sap.galilei.ui5.ImpactAnalysisEditor#
         * @param {sap.galilei.common.Object} oAnalysisObject The object to be analyzed for the impact and the lineage.
         * @param {sap.galilei.common.Model} oParams (optional) The option parameters that can properties of ImpactAnalyzer.
         */
        analyzeLineage: function (oAnalysisObject, oParams) {
            var oImpactAnalyzer = this.getImpactAnalyzer();

            if (oImpactAnalyzer && oAnalysisObject) {
                oImpactAnalyzer.analyzeLineage(oAnalysisObject, oParams);
            }
            return this; // return "this" to allow method chaining
        },

        /**
         * Changes the analysis object.
         * @memberOf sap.galilei.ui5.ImpactAnalysisEditor#
         * @param {sap.galilei.common.Object} oAnalysisObject The object to be analyzed for the impact and the lineage.
         * @param {sap.galilei.common.Model} oParams (optional) The option parameters that can properties of ImpactAnalyzer.
         */
        changeAnalysisObject: function (oAnalysisObject, oParams) {
            return this.analyze(oAnalysisObject, oParams);
        },

        /**
         * Expands all the nodes.
         * @memberOf sap.galilei.ui5.ImpactAnalysisEditor#
         * @param {Boolean} bImpact Indicates whether to show impact. Default: the current setting.
         * @param {Boolean} bLineage Indicates whether to show lineage. Default: the current setting.
         * @param {Boolean} bShowGlobalView Indicates whether to show global view. Default: false.
         * @param {Function} fnFinish Callback to handle the end of expand.
         */
        expandAll: function (bImpact, bLineage, bShowGlobalView, fnFinish) {
            var self = this;

            if (this._impactAnalyzer) {
                this._impactAnalyzer.expandRooNode(bImpact, bLineage, bShowGlobalView, sap.galilei.ui.editor.impactAnalysis.ImpactAnalyzer.MAX_EXPAND_LEVEL, fnFinish);
            }
            return this; // return "this" to allow method chaining
        },

        /**
         * Expands the selected nodes.
         * @memberOf sap.galilei.ui5.ImpactAnalysisEditor#
         * @param {Boolean} bImpact Indicates whether to show impact. Default: the current setting.
         * @param {Boolean} bLineage Indicates whether to show lineage. Default: the current setting.
         * @param {Boolean} bShowGlobalView Indicates whether to show global view. Default: false.
         * @param {Number} nExpandLevel The maximum expand level limited to 10. If it is not defined, use the default expand level.
         * @param {Function} fnFinish Callback to handle the end of expand.
         */
        expandSelectedNodes: function (bImpact, bLineage, bShowGlobalView, nExpandLevel, fnFinish) {
            if (this._impactAnalyzer) {
                this._impactAnalyzer.expandSelectedNodes(bImpact, bLineage, bShowGlobalView, nExpandLevel, fnFinish);
            }
            return this; // return "this" to allow method chaining
        },

        /**
         * Collapses the selected nodes.
         * @memberOf sap.galilei.ui5.ImpactAnalysisEditor#
         * @param {Boolean} bImpact Indicates whether to show impact. Default: the current setting.
         * @param {Boolean} bLineage Indicates whether to show lineage. Default: the current setting.
         * @param {Boolean} bShowGlobalView Indicates whether to show global view. Default: false.
         * @param {Function} fnFinish Callback to handle the end of collapse.
         */
        collapseSelectedNodes: function (bImpact, bLineage, bShowGlobalView, fnFinish) {
            if (this._impactAnalyzer) {
                this._impactAnalyzer.collapseSelectedNodes(bImpact, bLineage, bShowGlobalView, fnFinish);
            }
            return this; // return "this" to allow method chaining
        },

        /**
         * Collapses all the nodes.
         * @memberOf sap.galilei.ui5.ImpactAnalysisEditor#
         * @param {Boolean} bImpact Indicates whether to show impact. Default: the current setting.
         * @param {Boolean} bLineage Indicates whether to show lineage. Default: the current setting.
         * @param {Boolean} bShowGlobalView Indicates whether to show global view. Default: false.
         * @param {Function} fnFinish Callback to handle the end of collapse.
         */
        collapseAll: function (bImpact, bLineage, bShowGlobalView, fnFinish) {
            if (this._impactAnalyzer) {
                this._impactAnalyzer.collapseNode(this._impactAnalyzer.rootNodeSymbol, bImpact, bLineage, bShowGlobalView, fnFinish);
            }
            return this; // return "this" to allow method chaining
        },

        /**
         * Highlights the path between the root symbol and the selected symbol.
         * @name highlightPath
         * @memberOf sap.galilei.ui5.ImpactAnalysisEditor#
         * @param {sap.galilei.ui.Symbol} oSymbol The symbol.
         */
        highlightPath: function (oSymbol) {
            if (oSymbol && this._impactAnalyzer) {
                this._impactAnalyzer.highlightPath(oSymbol);
            }
        },

        /**
         * Unhighlights the path between the root symbol and the selected symbol.
         * @name unhighlightPath
         * @memberOf sap.galilei.ui5.ImpactAnalysisEditor#
         */
        unhighlightPath: function () {
            if (this._impactAnalyzer) {
                this._impactAnalyzer.unhighlightPath();
            }
        },

        /**
         * Layouts the diagram.
         * @name layoutDiagram
         * @memberOf sap.galilei.ui5.ImpactAnalysisEditor#
         * @param {Boolean} bImpact Layout impact nodes. Default: the current mode.
         * @param {Boolean} bLineage Layout lineage nodes. Default: the current mode.
         * @param {Boolean} bShowGlobalView Show global view after the layout. Default: false.
         * @returns {sap.galilei.impactAnalysis.ui.NodeSymbol}
         */
        layoutDiagram: function (bImpact, bLineage, bShowGlobalView) {
            if (this._impactAnalyzer) {
                this._impactAnalyzer.layoutDiagram(bImpact, bLineage, bShowGlobalView);
            }
            return this; // return "this" to allow method chaining
        },

        /**
         * Handles the expand impact for selected nodes event.
         * @memberOf sap.galilei.ui5.ImpactAnalysisEditor#
         * @param {Object} oEvent The UI5 event object.
         */
        onExpandImpact: function (oEvent) {
            this.expandSelectedNodes(true, false);
        },

        /**
         * Handles the collapse impact for selected nodes event.
         * @memberOf sap.galilei.ui5.ImpactAnalysisEditor#
         * @param {Object} oEvent The UI5 event object.
         */
        onCollapseImpact: function (oEvent) {
            this.collapseSelectedNodes(true, false);
        },

        /**
         * Handles the expand impact for selected nodes event.
         * @memberOf sap.galilei.ui5.ImpactAnalysisEditor#
         * @param {Object} oEvent The UI5 event object.
         */
        onExpandLineage: function (oEvent) {
            this.expandSelectedNodes(false, true);
        },

        /**
         * Handles the collapse impact for selected nodes event.
         * @memberOf sap.galilei.ui5.ImpactAnalysisEditor#
         * @param {Object} oEvent The UI5 event object.
         */
        onCollapseLineage: function (oEvent) {
            this.collapseSelectedNodes(false, true);
        },

        /**
         * Handles the event of changing the analysis object to the object of the selected symbol.
         * @memberOf sap.galilei.ui5.ImpactAnalysisEditor#
         * @param {Object} oEvent The UI5 event object.
         */
        onChangeAnalysisObject: function (oEvent) {
            var oSymbol,
                oAnalysisObject;

            if (this._editor && this._editor.selectedSymbols.length === 1 && this._impactAnalyzer) {
                oSymbol = this._editor.selectedSymbols.get(0);
                oAnalysisObject = oSymbol.object && oSymbol.object.analysisObject;
                if (oAnalysisObject) {
                    this.changeAnalysisObject(oAnalysisObject);
                }
            }
        },

        /**
         * Handles the click on show impact button event.
         * The show impact button could a CheckBox or a ToggleButton.
         * @memberOf sap.galilei.ui5.ImpactAnalysisEditor#
         * @param {Object} oEvent The UI5 event object.
         */
        onShowImpact: function (oEvent) {
            var oSource = oEvent && oEvent.getSource(),
                bShow;

            if (oSource && (oSource.getSelected || oSource.getPressed)) {
                bShow = oSource.getSelected ? oSource.getSelected() : oSource.getPressed();
                this.setShowImpact(bShow);
            }
        },

        /**
         * Handles the click on show lineage button event.
         * The show lineage button could a CheckBox or a ToggleButton.
         * @memberOf sap.galilei.ui5.ImpactAnalysisEditor#
         * @param {Object} oEvent The UI5 event object.
         */
        onShowLineage: function (oEvent) {
            var oSource = oEvent && oEvent.getSource(),
                bShow;

            if (oSource && (oSource.getSelected || oSource.getPressed)) {
                bShow = oSource.getSelected ? oSource.getSelected() : oSource.getPressed();
                this.setShowLineage(bShow);
            }
        },

        /**
         * Handles the click on show path button event.
         * The show path button could a CheckBox or a ToggleButton.
         * @memberOf sap.galilei.ui5.ImpactAnalysisEditor#
         * @param {Object} oEvent The UI5 event object.
         */
        onShowPath: function (oEvent) {
            var oSource = oEvent && oEvent.getSource(),
                bShow,
                oSymbol;

            if (oSource && (oSource.getSelected || oSource.getPressed)) {
                bShow = oSource.getSelected ? oSource.getSelected() : oSource.getPressed();
                this.setShowPath(bShow);
            }
        }
    });
}());
