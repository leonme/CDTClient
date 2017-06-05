/**
 * @class
 * Defines the diagram editor extension for BPMN
 * @name DiagramEditorExtension
 */
sap.modeling.bpmn.ui.DiagramEditorExtension = sap.galilei.ui.editor.defineDiagramEditorExtension({
    // Define class name
   fullClassName: "sap.modeling.bpmn.ui.DiagramEditorExtension",

    // Define properties
    properties: {
        // Node symbol names
        START_EVENT_SYMBOL: "sap.modeling.bpmn.ui.StartEventSymbol",
        TASK_SYMBOL: "sap.modeling.bpmn.ui.TaskSymbol",
        GATEWAY_SYMBOL: "sap.modeling.bpmn.ui.GatewaySymbol",
        END_EVENT_SYMBOL: "sap.modeling.bpmn.ui.EndEventSymbol",
        SCRAP_SYMBOL: "sap.modeling.bpmn.ui.ScrapSymbol",
        HOLD_SYMBOL: "sap.modeling.bpmn.ui.HoldSymbol",
        DONE_SYMBOL: "sap.modeling.bpmn.ui.DoneSymbol",
        // Link symbol names
        SEQUENCE_FLOW_SYMBOL: "sap.modeling.bpmn.ui.SequenceFlowSymbol",

        // Link symbol tool name
        LINK_SYMBOL_TOOL: "sap.modeling.bpmn.ui.LinkSymbols",

        // Images folder
        imagesFolder: "images"
    },

    // Define methods
   methods: {
        /**
         * Performs initialization of the extension.
         * @function
         * @name onInitialize
         * @memberOf sap.modeling.bpmn.ui.DiagramEditorExtension
         */
        onInitialize: function () {
            console.log("Initialize the BPMN diagram editor extension");

            var dropShadowFilter,
                oGradient;

            // Add gradients for the CSS with gradient
            oGradient = new sap.galilei.ui.common.style.LinearGradient({
                id: "taskGradient",
                stops: [
                    {offset: "0%", color: "#F3FCFF"},
                    {offset: "65%", color: "#D5EDFF"},
                    {offset: "100%", color: "#C1E4FF"}
                ]
            });
            oGradient.createGradient(this.viewer);
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
         * @memberOf sap.modeling.bpmn.ui.DiagramEditorExtension
         * @param {Array} The tools definition.
         */
        getToolsDefinition: function () {
            var self = this,
                oToolsDef = [
                    // Defines a tool for creating StartEventSymbol
                    {
                        name: this.START_EVENT_SYMBOL,
                        type: sap.galilei.ui.editor.tool.Types.createNodeSymbolTool,
                        symbolClass: this.START_EVENT_SYMBOL,
                        smallIcon: "StartEvent16.png"
                    },
                    // Defines a tool for creating TaskSymbol
                    {
                        name: this.TASK_SYMBOL,
                        type: sap.galilei.ui.editor.tool.Types.createNodeSymbolTool,
                        symbolClass: this.TASK_SYMBOL,
                        smallIcon: "Task16.png"
                    },
                    // Defines a tool for creating GatewaySymbol
                    {
                        name: this.GATEWAY_SYMBOL,
                        type: sap.galilei.ui.editor.tool.Types.createNodeSymbolTool,
                        symbolClass: this.GATEWAY_SYMBOL,
                        smallIcon: "Gateway16.png"
                    },
                    // Defines a tool for creating EndEventSymbol
                    {
                        name: this.END_EVENT_SYMBOL,
                        type: sap.galilei.ui.editor.tool.Types.createNodeSymbolTool,
                        symbolClass: this.END_EVENT_SYMBOL,
                        smallIcon: "EndEvent16.png"
                    },
                    // Defines a tool for creating ScrapSymbol
                    {
                        name: this.SCRAP_SYMBOL,
                        type: sap.galilei.ui.editor.tool.Types.createNodeSymbolTool,
                        symbolClass: this.SCRAP_SYMBOL,
                        smallIcon: "Scrap.png"
                    },// Defines a tool for creating ScrapSymbol
                    {
                        name: this.HOLD_SYMBOL,
                        type: sap.galilei.ui.editor.tool.Types.createNodeSymbolTool,
                        symbolClass: this.HOLD_SYMBOL,
                        smallIcon: "Hold.png"
                    },// Defines a tool for creating ScrapSymbol
                    {
                        name: this.DONE_SYMBOL,
                        type: sap.galilei.ui.editor.tool.Types.createNodeSymbolTool,
                        symbolClass: this.DONE_SYMBOL,
                        smallIcon: "Done.png"
                    },
                    // Defines a tool for creating SequenceFlowSymbol
                    {
                        name: this.LINK_SYMBOL_TOOL,
                        type: sap.galilei.ui.editor.tool.Types.createLinkSymbolTool,
                        smallIcon: "SequenceFlow16.png",
                        linksDefinition: [
                            // Source: StartEventSymbol can be connected to TaskSymbol and GatewaySymbol
                            {
                                sourceSymbol: this.START_EVENT_SYMBOL,
                                targetSymbol: this.TASK_SYMBOL,
                                linkSymbolClass: this.SEQUENCE_FLOW_SYMBOL
                            },
                            {
                                sourceSymbol: this.START_EVENT_SYMBOL,
                                targetSymbol: this.GATEWAY_SYMBOL,
                                linkSymbolClass: this.SEQUENCE_FLOW_SYMBOL
                            },
                            // Source: TaskSymbol can be connected to TaskSymbol, GatewaySymbol and EndEventSymbol
                            {
                                sourceSymbol: this.TASK_SYMBOL,
                                targetSymbol: this.TASK_SYMBOL,
                                linkSymbolClass: this.SEQUENCE_FLOW_SYMBOL
                            },
                            {
                                sourceSymbol: this.TASK_SYMBOL,
                                targetSymbol: this.GATEWAY_SYMBOL,
                                linkSymbolClass: this.SEQUENCE_FLOW_SYMBOL
                            },
                            {
                                sourceSymbol: this.TASK_SYMBOL,
                                targetSymbol: this.END_EVENT_SYMBOL,
                                linkSymbolClass: this.SEQUENCE_FLOW_SYMBOL
                            },
                            // Source: GatewaySymbol can be connected to TaskSymbol, GatewaySymbol and EndEventSymbol
                            {
                                sourceSymbol: this.GATEWAY_SYMBOL,
                                targetSymbol: this.TASK_SYMBOL,
                                linkSymbolClass: this.SEQUENCE_FLOW_SYMBOL
                            },
                            {
                                sourceSymbol: this.GATEWAY_SYMBOL,
                                targetSymbol: this.GATEWAY_SYMBOL,
                                linkSymbolClass: this.SEQUENCE_FLOW_SYMBOL
                            },
                            {
                                sourceSymbol: this.GATEWAY_SYMBOL,
                                targetSymbol: this.END_EVENT_SYMBOL,
                                linkSymbolClass: this.SEQUENCE_FLOW_SYMBOL
                            },
                            {
                                sourceSymbol: this.TASK_SYMBOL,
                                targetSymbol: this.SCRAP_SYMBOL,
                                linkSymbolClass: this.SEQUENCE_FLOW_SYMBOL
                            },
                            {
                                sourceSymbol: this.GATEWAY_SYMBOL,
                                targetSymbol: this.SCRAP_SYMBOL,
                                linkSymbolClass: this.SEQUENCE_FLOW_SYMBOL
                            },
                            {
                                sourceSymbol: this.TASK_SYMBOL,
                                targetSymbol: this.HOLD_SYMBOL,
                                linkSymbolClass: this.SEQUENCE_FLOW_SYMBOL
                            },
                            {
                                sourceSymbol: this.GATEWAY_SYMBOL,
                                targetSymbol: this.HOLD_SYMBOL,
                                linkSymbolClass: this.SEQUENCE_FLOW_SYMBOL
                            },
                            {
                                sourceSymbol: this.TASK_SYMBOL,
                                targetSymbol: this.DONE_SYMBOL,
                                linkSymbolClass: this.SEQUENCE_FLOW_SYMBOL
                            },
                            {
                                sourceSymbol: this.GATEWAY_SYMBOL,
                                targetSymbol: this.DONE_SYMBOL,
                                linkSymbolClass: this.SEQUENCE_FLOW_SYMBOL
                            }
                        ]
                    }
                ];

            this.addImagesFolder(oToolsDef);
            return oToolsDef;
        },

        /**
         * Gets the context button pad definition for symbol.
         * @function
         * @name getContextButtonPad
         * @memberOf sap.modeling.bpmn.ui.DiagramEditorExtension
         * @param {Object} oSymbol The symbol.
         */
        getContextButtonPad: function (oSymbol) {
            var aButtons;
            if (oSymbol) {
                switch (oSymbol.classDefinition.qualifiedName) {
                    case this.START_EVENT_SYMBOL:
                        aButtons = [
                            {
                                toolName: this.LINK_SYMBOL_TOOL
                            },
                            {
                                toolName: this.TASK_SYMBOL
                            },
                            {
                                toolName: this.GATEWAY_SYMBOL
                            }
                        ];
                        break;
                    case this.TASK_SYMBOL:
                    case this.GATEWAY_SYMBOL:
                        aButtons = [
                            {
                                toolName: this.LINK_SYMBOL_TOOL
                            },
                            {
                                toolName: this.TASK_SYMBOL
                            },
                            {
                                toolName: this.GATEWAY_SYMBOL
                            },
                            {
                                toolName: this.END_EVENT_SYMBOL
                            },
                            {
                                toolName: this.SCRAP_SYMBOL
                            },
                            {
                                toolName: this.HOLD_SYMBOL
                            },
                            {
                                toolName: this.DONE_SYMBOL
                            }
                        ];
                        break;
                }
            }

            this.addImagesFolder(aButtons);
            return aButtons;
        },

        /**
         * Selects a link symbol tool definition between the source symbol and target symbol.
         * @function
         * @name selectLinkSymbolDefinition
         * @memberOf sap.modeling.bpmn.ui.DiagramEditorExtension
         * @param {Symbol} oSourceSymbol The source symbol.
         * @param {Symbol} oTargetSymbol The target symbol.
         * @returns {Object} The link symbol definition to use.
         */
        selectLinkSymbolDefinition: function (oSourceSymbol, oTargetSymbol) {
            // We can only create sequence flow symbol between node symbols
            return {
                linkSymbolClass: this.SEQUENCE_FLOW_SYMBOL
            };
        }
    }
});
