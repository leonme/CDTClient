/**
 * Simplified Flow Graph Model editor extension.
 
 * Date: 13/03/15
 * (c) Copyright 2013-2015 SAP AG. All rights reserved
 */

(function () {
    "use strict";

    /**
     * @class
     * The diagram editor extension for Flow Graph Model
     * @name DiagramEditorExtension
     */
    sap.modeling.flowgraph.ui.DiagramEditorExtension = sap.galilei.ui.editor.defineDiagramEditorExtension({
        // Define class name
        fullClassName: "sap.modeling.flowgraph.ui.DiagramEditorExtension",

        // Define properties
        properties: {
            // Symbol classes
            NODE_SYMBOL: "sap.modeling.flowgraph.ui.NodeSymbol",
            INPUT_SYMBOL: "sap.modeling.flowgraph.ui.InputSymbol",
            OUTPUT_SYMBOL: "sap.modeling.flowgraph.ui.OutputSymbol",
            FLOW_SYMBOL: "sap.modeling.flowgraph.ui.FlowSymbol",

            // Object classes
            NODE_OBJECT: "sap.modeling.flowgraph.Node",
            INPUT_OBJECT: "sap.modeling.flowgraph.Input",
            OUTPUT_OBJECT: "sap.modeling.flowgraph.Output",
            FLOW_OBJECT: "sap.modeling.flowgraph.Flow",

            // Create object parameters
            NODE_OBJECT_PARAM: "",
            INPUT_OBJECT_PARAM: "",
            OUTPUT_OBJECT_PARAM: "",
            FLOW_OBJECT_PARAM: "",

            // Adds input command
            ADD_INPUT_COMMAND: "Sap.Modeling.Flowgraph.AddInput",
            ADD_OUTPUT_COMMAND: "Sap.Modeling.Flowgraph.AddOutput"
        },

        // Define methods
        methods: {
            /**
             * Performs initialization of the extension.
             * @function
             * @name onInitialize
             * @memberOf sap.modeling.flowgraph.ui.DiagramEditorExtension#
             */
            onInitialize: function () {
                // Add gradients fill
                this.addLinearGradient("nodeFill", "#D4E7F8", "#E8F2FA", "#F9FBFC");

                // Enable highlight connected symbols
                this.editor.showConnectedSymbols = true;
            },

            /**
             * Defines a gradient.
             * @function
             * @name addLinearGradient
             * @memberOf sap.modeling.flowgraph.ui.DiagramEditorExtension#
             */
            addLinearGradient: function (sGradientId, sStartColor, sMiddleColor, sStopColor) {
                var oGradient = new sap.galilei.ui.common.style.LinearGradient({
                    id: sGradientId,
                    stops: [
                        { offset: "5%", color: sStartColor },
                        { offset: "50%", color: sMiddleColor },
                        { offset: "85%", color: sStopColor }
                    ]
                });

                oGradient.createGradient(this.viewer);
            },

            /**
             * Checks whether a new object with class and properties can be created under certain parent.
             * @function
             * @name canCreateObject
             * @memberOf sap.modeling.flowgraph.ui.DiagramEditorExtension#
             * @param {String} sObjectClassName The object class qualified name.
             * @param {sap.galilei.model.Object} oParentObject The container object.
             * @param {Object} oProperties The initial properties (key value pairs) to be set to the new object.
             * @returns {Boolean} true if the object can be created and all properties can be set.
             */
            canCreateObject: function (sObjectClassName, oParentObject, oProperties) {
                switch (sObjectClassName) {
                    case this.NODE_OBJECT:
                    // Do not add node symbol under node symbol
                    if (oParentObject && sap.galilei.model.isInstanceOf(oParentObject, this.NODE_OBJECT)) {
                        return false;
                    }
                    break;
                }
                return this.defaultCanCreateObject(sObjectClassName, oParentObject, oProperties);
            },

            /**
             * Performs transformation after the creation of a node symbol.
             * @function
             * @name postCreateSymbol
             * @memberOf sap.modeling.flowgraph.ui.DiagramEditorExtension#
             * @param {Symbol} oSymbol The symbol.
             */
            postCreateSymbol: function (oSymbol) {
                var self = this,
                    sSymbolClass;

                function addInputsAndOutputs() {
                    var nInputs = 1,
                        nOutputs = 1,
                        index,
                        oCommand;

                    // Determines nInputs and nOutputs based on the node type

                    // Creates inputs
                    for (index = 0; index < nInputs; index++) {
                        oCommand = new sap.modeling.flowgraph.ui.AddInputCommand();
                        oCommand.execute({
                            editor: self.editor,
                            symbol: oSymbol
                        });
                    }

                    // Creates outputs
                    for (index = 0; index < nOutputs; index++) {
                        oCommand = new sap.modeling.flowgraph.ui.AddOutputCommand();
                        oCommand.execute({
                            editor: self.editor,
                            symbol: oSymbol
                        });
                    }
                }

                if (oSymbol) {
                    sSymbolClass = oSymbol.classDefinition.qualifiedName;

                    switch (sSymbolClass) {
                    case this.NODE_SYMBOL:
                        this.resource.applyUndoableAction(addInputsAndOutputs, "Add inputs and outputs");
                        break;
                    }
                }
            },

            /**
             * Post delete one symbol.
             * @function
             * @name postDeleteSymbol
             * @memberOf sap.modeling.flowgraph.ui.DiagramEditorExtension#
             * @param {Object} oContainer The previous container of deleted symbol.
             * @param {Object} oDeletedSymbol The symbol already deleted (just holds its information).
             * @param {Boolean} bDeleteObject (optional) Indicates whether the object of the symbol should be deleted.
             * @param {Boolean} bPreserveLink (optional) Indicates whether the source link should be preserved.
             * @param {Boolean} bUseUndoAction (optional) Indicates whether a new undo action should be used.
             */
            postDeleteSymbol: function(oContainer, oDeletedSymbol, bDeleteObject, bPreserveLink, bUseUndoAction) {
                if (oContainer) {
                    switch (oContainer.classDefinition.qualifiedName) {
                    case this.NODE_SYMBOL:
                        oContainer.updateBoundarySymbols(undefined, undefined, true, this.editor.viewer, this.editor.transitionDefinition);
                        break;
                    }
                }
            },

            /**
             * Gets the context button pad definition for symbol.
             * @function
             * @name getContextButtonPad
             * @memberOf sap.modeling.flowgraph.ui.DiagramEditorExtension#
             * @param {Object} oSymbol The symbol.
             */
            getContextButtonPad: function (oSymbol) {
                var aButtons = [];

                if (oSymbol) {
                    switch (oSymbol.classDefinition.qualifiedName) {
                    case this.NODE_SYMBOL:
                        aButtons.push({
                            toolName: this.NODE_SYMBOL
                        });
                        aButtons.push({
                            commandName: this.ADD_INPUT_COMMAND
                        });
                        aButtons.push({
                            commandName: this.ADD_OUTPUT_COMMAND
                        });
                        break;
                    case this.OUTPUT_SYMBOL:
                        aButtons.push({
                            toolName: this.FLOW_SYMBOL,
                            tooltip: "Create Flow to an Input"
                        });
                        break;
                    }
                }

                this.addImagesFolder(aButtons);
                return aButtons;
            },

            /**
             * Gets the tools definition. The definition is an array of tool definition.
             * Create node symbol tool definition the parameters:
             * name: <(optional) The tool name>,
             * type: sap.galilei.ui.editor.tool.Types.createNodeSymbolTool
             * symbolClass: <The symbol class qualified name>
             * symbolParam: <(optional) The symbol property values>
             * objectClass: < (optional) The object class qualified name>
             * objectParam:  <(optional) The object property values>
             * objectReference: <(optional) The name of the reference where the object should be added>
             * smallIcon: <The small icon URL, usually 16x16>
             * largeIcon: <(optional) The large icon URL, usually 32x32>
             * cursor: <(optional) The cursor URL, usually 32x32>
             *
             * Create link symbol tool definition the parameters:
             * name: <The tool name>
             * type: sap.galilei.ui.editor.tool.Types.createLinkSymbolTool
             * linksDefinition: <Array of supported link symbols>
             * {
             * sourceSymbol: <The source symbol class qualified name>
             * targetSymbol: <The target symbol class qualified name>
             * linkSymbolClass: <The link symbol class qualified name>
             * linkSymbolParam: <(optional) The link symbol property values>
             * linkObjectClass: < (optional) The link object class qualified name>
             * linkObjectParam:  <(optional) The link object property values>
             * linkObjectReference: <(optional) The name of the reference where the link object should be added>
             * }
             * smallIcon: <The small icon URL, usually 16x16>
             * largeIcon: <(optional) The large icon URL, usually 32x32>
             * cursor: <The cursor URL>
             *
             * Normal tool definition the parameters:
             * name: <The tool name>
             * type: sap.galilei.ui.editor.tool.Types.tool
             * canExecute: function (oParam), where oParam contains editor, diagram, symbol
             * execute: function (oParam)
             * smallIcon: <The small icon URL, usually 16x16>
             * largeIcon: <(optional) The large icon URL, usually 32x32>
             * cursor: <The cursor URL>
             * @function
             * @name getToolsDefinition
             * @memberOf sap.modeling.flowgraph.ui.DiagramEditorExtension#
             * @param {Array} The tools definition.
             */
            getToolsDefinition: function () {
                var self = this,
                    oToolsDef;

                oToolsDef = [
                    // Node tool
                    {
                        name: this.NODE_SYMBOL,
                        type: sap.galilei.ui.editor.tool.Types.createNodeSymbolTool,
                        tooltip: "Add Node",
                        symbolClass: this.NODE_SYMBOL,
                        objectParam: this.NODE_OBJECT_PARAM,
                        smallIcon: "Node16.png"
                    },
                    // Flow tool
                    {
                        name: this.FLOW_SYMBOL,
                        type: sap.galilei.ui.editor.tool.Types.createLinkSymbolTool,
                        tooltip: "Add Flow",
                        smallIcon: "Flow16.png",
                        cursor: "FlowCursor.png",
                        linksDefinition: [
                            {
                                sourceSymbol: this.OUTPUT_SYMBOL,
                                targetSymbol: this.INPUT_SYMBOL,
                                linkSymbolClass: this.FLOW_SYMBOL,
                                linkObjectParam: this.FLOW_OBJECT_PARAM
                            }
                        ]
                    }
                ];

                this.addImagesFolder(oToolsDef);
                return oToolsDef;
            },

            /**
             * Gets the commands definition. The definition is an array of command definition.
             * Command definition has the parameters:
             * name: <The command name>
             * displayName: <The command display name>
             * tooltip: <The command tooltip>
             * type: <(optional) The command type>
             * isEnabled: <Indicates if the command is enabled>
             * isHidden: <Indicates if the command is visible>
             * canExecute: function (oParam), where oParam contains editor, diagram, symbol
             * execute: function (oParam)
             * smallIcon: <The small icon URL, usually 16x16>
             * largeIcon: <(optional) The large icon URL, usually 32x32>
             * @function
             * @name getCommandsDefinition
             * @memberOf sap.modeling.flowgraph.ui.DiagramEditorExtension#
             * @param {Array} The commands definition.
             */
            getCommandsDefinition: function () {
                var self = this,
                    oCommandsDef;

                oCommandsDef = [
                    {
                        // Define an adds input command
                        name: this.ADD_INPUT_COMMAND,
                        className: "sap.modeling.flowgraph.ui.AddInputCommand",
                        tooltip: "Add Input",
                        smallIcon: "AddInput.png"
                    },
                    {
                        // Define an adds input command
                        name: this.ADD_OUTPUT_COMMAND,
                        className: "sap.modeling.flowgraph.ui.AddOutputCommand",
                        tooltip: "Add Output",
                        smallIcon: "AddOutput.png"
                    }
                ];

                this.addImagesFolder(oCommandsDef);
                return oCommandsDef;
            }
        }
    });
}());