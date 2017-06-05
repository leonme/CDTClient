/**
 * A control that extends the sap.m.Input with the option to show search button
 
 * Date: 17/05/15
 * (c) Copyright 2013-2015 SAP SE. All rights reserved
 */
jQuery.sap.declare("sap.galilei.ui5.InputSearch");
(function () {
    jQuery.sap.require("sap.m.Input");

    "use strict";

    /***
     * Extending input control with search button and search event
     *
     */
    sap.m.Input.extend("sap.galilei.ui5.InputSearch", {
        metadata: {
            properties: {
                "showSearch" : {type: "boolean", defaultValue:"true"}
            },
            events: {
                "search" : {preventDefault: "true"}  // search event
            }
        },

        /***
         *  Get the search icon
         */
        _getSearchIcon: function () {
            var that = this;

            if (!this._oSearchIcon) {
                jQuery.sap.require("sap.ui.core.IconPool");

                var sURI = sap.ui.core.IconPool.getIconURI("search");
                this._oSearchIcon = sap.ui.core.IconPool.createControlByURI({
                    id: this.getId() + "__vse",
                    src: sURI
                });

                this._oSearchIcon.addStyleClass("sapMInputValHelpInner");
                this._oSearchIcon.attachPress(function (evt) {
                    that.fireSearch();
                });
            }

            return this._oSearchIcon;
        },

        renderer: {

            writeSearchIcon: function (oRm, oControl) {
                if (oControl.getShowSearch() && oControl.getEnabled() && oControl.getEditable()) {
                    oRm.write('<div class="sapMInputValHelp">');
                    oRm.renderControl(oControl._getSearchIcon());
                    oRm.write("</div>");
                }

            },

            writeInnerContent: function (oRm, oControl) {
                if (!oControl.getDescription()) {
                    this.writeSearchIcon(oRm, oControl);
                } else {
                    var sDescription = oControl.getDescription();
                    oRm.write("<span>");
                    this.writeSearchIcon(oRm, oControl);
                    oRm.writeEscaped(sDescription);
                    oRm.write("</span>");
                }
            }
        }

    });

}());
