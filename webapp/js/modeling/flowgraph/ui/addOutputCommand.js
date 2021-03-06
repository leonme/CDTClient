/**
 * This command adds an output on a node.
 
 * Date: 13/03/15
 * (c) Copyright 2013-2015 SAP SE. All rights reserved
 */

(function () {
    "use strict";

    /**
     * @class
     * This command helps users to select a value from a list of values  then change the value of a attribute of an object.
     * @param {Object} options The command properties to initialize. All the properties supported by the command or parent command can be used.
     */
    sap.modeling.flowgraph.ui.AddOutputCommand = sap.galilei.core.defineClass({
        // Define class name
        fullClassName: "sap.modeling.flowgraph.ui.AddOutputCommand",

        // Define parent
        parent: sap.galilei.ui.editor.command.Command,

        // Define methods
        methods: {
            /**
             * This function defines how to execute this command.
             * @function
             * @name execute
             * @memberOf sap.modeling.flowgraph.ui.AddOutputCommand#
             * @param {Object} oParam The parameters. It may contain:
             * {
             *     source: <The source widget>,
             *     editor: <The editor>,
             *     diagram: <The diagram>,
             *     symbol: <The symbol>
             * }
             */
            execute: function (oParam) {
                var self = this,
                    oNode,
                    oOutput,
                    oOutputSymbol;

                function addOutput() {
                    oOutputSymbol = self.editor.createSymbolAndObject(self.editor.extension.OUTPUT_SYMBOL, {}, self.symbol, undefined,
                        undefined, self.editor.extension.OUTPUT_OBJECT_PARAM, undefined, undefined, undefined);
                    if (oOutputSymbol) {
                        self.symbol.updateBoundarySymbols(undefined, undefined, true, self.editor.viewer, self.editor.transitionDefinition);
                        oOutputSymbol.drawSymbol(self.editor.viewer, self.editor.transitionDefinition);
                    }
                }

                if (oParam) {
                    this.getParameters(oParam);
                    if (this.symbol && this.editor) {
                        this.resource.applyUndoableAction(addOutput, "Add output");
                    }
                }
            }
        }
    });
}());