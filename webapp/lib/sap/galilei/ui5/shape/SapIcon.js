/**
 * @deprecated
 * Note: You can use sap.galilei.ui.common.shape.IconFont instead of sap.galilei.ui5.shape.SapIcon.
 * Supports shapes based on SAP UI5 icons.
 * Date: 07/04/15
 * (c) Copyright 2013-2015 SAP SE. All rights reserved
 */

jQuery.sap.declare("sap.galilei.ui5.shape.SapIcon");

namespace("sap.galilei.ui5.shape", function (nsLocal) {
    "use strict";

    /**
     * @class
     * Shape based on SAP UI5 icons. To use it, you can set:
     *     src: The SAP icon name. Example: sap-icon://video.
     *     size: The icon size. Default: 16.
     *     fill: The icon color. Examples: "blue", "#666666".
     * @public
     * @augments sap.galilei.ui.common.shape.IconFont
     */
    sap.galilei.ui5.shape.SapIcon = sap.galilei.ui.common.shape.defineShape({
        // Define class name
        fullClassName: "sap.galilei.ui5.shape.SapIcon",

        // Define parent
        parent: sap.galilei.ui.common.shape.IconFont,

        // Define shape name
        shapeName: "SapIcon",

        // Define shape category
        shapeCategory: "Standard"
    });
});
