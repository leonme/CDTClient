/**
 * Supports UI commands.
 
 * Date: 29/01/15
 * (c) Copyright 2013-2015 SAP SE. All rights reserved
 */

jQuery.sap.declare("sap.galilei.ui5.command.Command");

(function () {
    "use strict";

    /**
     * @class
     * UI command class.
     */
    sap.galilei.ui5.command.Command = sap.galilei.core.defineClass({
        // Define class name
        fullClassName: "sap.galilei.ui5.command.Command",

        // Define parent
        parent: sap.galilei.ui.editor.command.Command,

        // Define properties
        properties: {
            /**
             * Gets or sets the UI5 controller.
             * @name controller
             * @memberOf sap.galilei.ui5.command.Command#
             * @type {Controller}
             */
            controller: undefined
        }
    });
}());
