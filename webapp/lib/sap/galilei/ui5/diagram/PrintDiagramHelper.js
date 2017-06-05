/**
 * Provides printing diagram functions.
 
 * Date: 17/10/14
 * (c) Copyright 2013-2014 SAP SE. All rights reserved
 */

jQuery.sap.declare("sap.galilei.ui5.diagram.PrintDiagramHelper");

(function () {
    jQuery.sap.require("sap.galilei.ui5.utils.Locale");
    jQuery.sap.require("sap.galilei.ui5.utils.Url");
    jQuery.sap.require("sap.m.Dialog");
    jQuery.sap.require("sap.m.Button");

    "use strict";

    /**
     * @class
     * Provides printing diagram functions.
     * @public
     */
    sap.galilei.ui5.diagram.PrintDiagramHelper = sap.galilei.core.defineClass({
        // Define class name
        fullClassName: "sap.galilei.ui5.diagram.PrintDiagramHelper",

        // Define statics
        statics: {
            /**
             * The print dialog.
             */
            printDialog: undefined,

            /**
             * The print dialog view controller.
             */
            printViewController: undefined,

            /**
             * The diagramEditor.
             */
            diagramEditor: undefined,

            /**
             * Indicates whether to include decorators/markers.
             */
            includeDecoratorLayers: false,

            /**
             * Prints the diagram. Shows the print diagram dialog, then print the diagram.
             * @static
             * @name printDiagram
             * @memberOf sap.galilei.ui5.diagram.PrintDiagramHelper#
             * @param {sap.galilei.ui.editor.DiagramEditor} oDiagramEditor The diagram editor.
             * @param {object} oOptions (optional) The print options.
             *     includeDecoratorLayers: Indicates whether decorator layers should be included. Default: false.
             */
            printDiagram: function (oDiagramEditor, oOptions) {
                var sDialogId = "printDiagramDialog",
                    oPrintView,
                    oOkButton,
                    oCancelButton,
                    sTitle,
                    sPrint,
                    sCancel;

                this.diagramEditor = oDiagramEditor;
                oOptions = oOptions || {};
                this.includeDecoratorLayers = oOptions.includeDecoratorLayers !== undefined ? oOptions.includeDecoratorLayers : false;

                oPrintView = sap.ui.view({
                    id : sDialogId + "--" + "view",
                    type: sap.ui.core.mvc.ViewType.XML,
                    viewName: "sap.galilei.ui5.diagram.PrintDiagram"
                });

                if (oPrintView) {
                    this.printViewController = oPrintView.getController();
                    this.setPrinterSettings();

                    sTitle = sap.galilei.ui5.utils.Locale.getProperty("PRINT_DIAGRAM_DIALOG_TITLE", "Print Diagram");
                    sPrint = sap.galilei.ui5.utils.Locale.getProperty("PRINT_DIAGRAM_PRINT_BUTTON", "Print Diagram");
                    sCancel = sap.galilei.ui5.utils.Locale.getProperty("CANCEL_BUTTON", "Cancel");

                    oOkButton = new sap.m.Button({
                        id: sDialogId + "--" + "printButton",
                        text: sPrint
                    });
                    oOkButton.attachPress(undefined, this.onPrint, this);

                    oCancelButton = new sap.m.Button({
                        id: sDialogId + "--" + "cancelButton",
                        text: sCancel
                    });
                    oCancelButton.attachPress(undefined, this.onCancel, this);

                    this.printDialog = new sap.m.Dialog({
                        id: sDialogId,
                        title: sTitle,
                        horizontalScrolling: false,
                        verticalScrolling: false,
                        content: oPrintView,
                        beginButton: oOkButton,
                        endButton: oCancelButton
                    });
                    this.printDialog.addStyleClass("sapUiContentPadding");

                    this.printDialog.open();
                    this.showDiagramPreview();
                }
            },

            /**
             * Sets the printer settings.
             * @static
             * @name setPrinterSettings
             * @memberOf sap.galilei.ui5.diagram.PrintDiagramHelper#
             */
            setPrinterSettings: function () {
                var oDiagramEditor = this.diagramEditor,
                    oPrintSettings,
                    oPage;

                if (oDiagramEditor && this.printViewController) {
                    oPrintSettings = this.printViewController.getPrintDiagramSettings();
                    oPage = oDiagramEditor.viewer.page;
                    oPrintSettings.paperType = oPage.paperType;
                    oPrintSettings.pageScalePercent = +(oPage.pageScale * 100).toFixed(1);
                    if (oPage.isCanChangeOrientation !== false) {
                        oPrintSettings.pageOrientation = this.printViewController.PAGE_ORIENTATION_AUTO;
                    } else {
                        oPrintSettings.pageOrientation = oPage.pageOrientation;
                    }
                    oPrintSettings.selectedOrientation = oPage.pageOrientation;
                    oPrintSettings.paperLeftMargin = oPage.paperLeftMargin;
                    oPrintSettings.paperTopMargin = oPage.paperTopMargin;
                    oPrintSettings.paperRightMargin = oPage.paperRightMargin;
                    oPrintSettings.paperBottomMargin = oPage.paperBottomMargin;

                    this.printViewController.updatePrintDiagramSettings();
                }
            },

            /**
             * Gets the printer settings and update the page object.
             * @static
             * @name getPrinterSettings
             * @memberOf sap.galilei.ui5.diagram.PrintDiagramHelper#
             * @param {sap.galilei.ui.common.Page} oPage The page object.
             */
            getPrinterSettings: function (oPage) {
                if (oPage && this.printViewController) {
                    this.printViewController.getPageSettings(oPage);
                }
            },

            /**
             * Shows the diagram preview.
             * @static
             * @name showDiagramPreview
             * @memberOf sap.galilei.ui5.diagram.PrintDiagramHelper#
             */
            showDiagramPreview: function () {
                var oDiagramEditor = this.diagramEditor,
                    oPrintSettings,
                    sSVGContent;

                if (oDiagramEditor && this.printViewController) {
                    sSVGContent = oDiagramEditor.viewer.generateSVG({
                        includeDecoratorLayers: this.includeDecoratorLayers,
                        replaceImageURL: false
                    });
                    oPrintSettings = this.printViewController.getPrintDiagramSettings();
                    oPrintSettings.SVGContent = sSVGContent;

                    this.printViewController.showDiagramPreview();
                }
            },

            /**
             * Before closing the print dialog.
             * @static
             * @name onBeforeClose
             * @memberOf sap.galilei.ui5.diagram.PrintDiagramHelper#
             */
            onBeforeClose: function () {
                this.printViewController.dispose();
                this._repairSVG();
                this.printDialog.close();
            },

            /**
             * Frees the resource.
             * @static
             * @name dispose
             * @memberOf sap.galilei.ui5.diagram.PrintDiagramHelper#
             */
            dispose: function () {
                this.printViewController = undefined;
                this.printDialog.destroy();
                this.printDialog = undefined;
                this.diagramEditor = undefined;
            },

            /**
             * Workaround to repair the initial SVG if it has multiple <defs>.
             * Need to modify the ids of elements in the <defs> or the ids used in the SVG elements.
             * Otherwise the elements would have black background instead of gradient.
             * @private
             * @static
             * @name _repairSVG
             * @memberOf sap.galilei.ui5.diagram.PrintDiagramHelper#
             */
            _repairSVG: function () {
                var oDefsSelection = d3.selectAll("defs");

                // Need to change all <defs>. There may be several if the diagram is SVG based.
                if (oDefsSelection.length > 0 && oDefsSelection[0].length > 0) {
                    oDefsSelection[0].forEach(function (oDefs) {
                        var index,
                            oDefsNode,
                            sOldId;

                        // Do not change the first <defs>
                        for (index = 0; index < oDefs.childNodes.length; index++) {
                            oDefsNode = oDefs.childNodes[index];
                            if (oDefsNode.id) {
                                // Changes the id to trigger a redraw.
                                sOldId = oDefsNode.id;
                                oDefsNode.id = "_" + oDefsNode.id + "_";
                                oDefsNode.id = sOldId;
                            }
                        }
                    });
                }
            },

            /**
             * Print event handler.
             * @static
             * @name onPrint
             * @memberOf sap.galilei.ui5.diagram.PrintDiagramHelper#
             */
            onPrint: function () {
                var bSupportPDF = false;

                // Only supports Chrome, Firefox, Opera, Safari and Edge, for now. Opera is like Chrome.
                if (navigator.userAgent.toLowerCase().indexOf("chrome") !== -1 || navigator.userAgent.toLowerCase().indexOf("firefox") !== -1 ||
                    navigator.userAgent.toLowerCase().indexOf("safari") !== -1 || navigator.userAgent.toLowerCase().indexOf("edge") !== -1) {
                    bSupportPDF = sap.galilei.ui.common.PdfWriter.isSupportPDF;
                }

                this.onBeforeClose();
                if (bSupportPDF) {
                    try {
                        this._generateDiagramPDF();
                    } catch (e) {
                        bSupportPDF = false;
                    }
                }
                if (!bSupportPDF) {
                    this._generateDiagramPage();
                }
                this.dispose();
            },

            /**
             * Cancel event handler.
             * @static
             * @name onCancel
             * @memberOf sap.galilei.ui5.diagram.PrintDiagramHelper#
             */
            onCancel: function () {
                this.onBeforeClose();
                this.dispose();
            },

            /**
             * Generates a PDF for the diagram.
             * @private
             * @static
             * @name _generateDiagramPDF
             * @memberOf sap.galilei.ui5.diagram.PrintDiagramHelper#
             */
            _generateDiagramPDF: function () {
                var oDiagramEditor = this.diagramEditor,
                    oPage,
                    oPrintSettings,
                    oOptions,
                    oPrint;

                if (oDiagramEditor) {
                    oPage = oDiagramEditor.viewer.page.clone();
                    this.getPrinterSettings(oPage);
                    // Takes the selected orientation
                    oPrintSettings = this.printViewController.getPrintDiagramSettings();
                    oPage.pageOrientation = oPrintSettings.selectedOrientation;
                    oPage.isCanChangeOrientation = false;
                    oPage.pageScale = 1.0; // TODO: Uses the diagram editor page scale

                    // Setups options
                    oOptions = {};
                    oOptions.includeDecoratorLayers = this.includeDecoratorLayers;
                    oOptions.isFitToOnePage = oPrintSettings.isFitToOnePage;
                    oOptions.fileName = oDiagramEditor.diagram && oDiagramEditor.diagram.diagramObject && oDiagramEditor.diagram.diagramObject.Name;
                    if (oOptions.fileName) {
                        oOptions.fileName += ".pdf";
                    }

                    oPrint = new sap.galilei.ui.common.Print();
                    oPrint.printDiagram(oDiagramEditor.viewer, oPage, oOptions);
                }
            },

            /**
             * Generates a special page that contains the diagram images for each page.
             * @private
             * @static
             * @name _generateDiagramPage
             * @memberOf sap.galilei.ui5.diagram.ExportDiagram#
             */
            _generateDiagramPage: function () {
                var oDiagramEditor = this.diagramEditor,
                    oGalileiDiagram,
                    oSavePage,
                    oPage,
                    oGlobalViewRect,
                    oPrintSettings,
                    oFitToPages,
                    sSVGContent,
                    nPages = 1,
                    sImageRootKey = "print.diagram.page",
                    sPaperType,
                    sOrientation,
                    sLeftMargin,
                    sTopMargin,
                    sRightMargin,
                    sBottomMargin,
                    oBundle,
                    sMessage,
                    index,
                    sRelativePath,
                    sURL,
                    sOption,
                    sLocalStorageKey,
                    aLocalStorageKeys = [];

                if (oDiagramEditor) {
                    oGalileiDiagram = oDiagramEditor.diagram;
                    if (window && window.localStorage) {
                        // Gets the diagram size
                        oGlobalViewRect = oDiagramEditor.viewer.getGlobalViewRect() || (new sap.galilei.ui.common.Rect());
                        oGlobalViewRect.inflate(sap.galilei.ui.common.svg.Svg.SVG_RECT_MARGIN, sap.galilei.ui.common.svg.Svg.SVG_RECT_MARGIN);
                        // Saves the current page
                        oSavePage = oDiagramEditor.viewer.page.clone();
                        oPage = oDiagramEditor.viewer.page;
                        oPrintSettings = this.printViewController.getPrintDiagramSettings();
                        this.getPrinterSettings(oPage);
                        oPage.pageOrientation = oPrintSettings.selectedOrientation;
                        oPage.isCanChangeOrientation = false;

                        // Adds extra margin (10mm) to workaround browser scaling issues
                        oPage.paperWidth -= 10;
                        oPage.paperHeight -= 10;

                        if (oPrintSettings.isFitToOnePage) {
                            // Tries to fit in one page.
                            oFitToPages = oPage.fitToOnePage(oGlobalViewRect, oPage.isCanChangeOrientation);
                        } else {
                            // Tries to best fit in pages.
                            oFitToPages = oPage.fitToPages(oGlobalViewRect, oPage.isCanChangeOrientation);
                        }

                        // Generates the new SVG
                        nPages = oFitToPages.totalPages;
                        for (index = 0; index < nPages; index++) {
                            sSVGContent = oDiagramEditor.viewer.generateSVG({
                                includeDecoratorLayers: this.includeDecoratorLayers,
                                replaceImageURL: false,
                                offsetX: oFitToPages.diagramLeftOffset - (oFitToPages.usedPages ? oFitToPages.usedPages[index].x : 0) * oFitToPages.pageScale,
                                offsetY: oFitToPages.diagramTopOffset - (oFitToPages.usedPages ? oFitToPages.usedPages[index].y : 0) * oFitToPages.pageScale,
                                zoomScale: oFitToPages.pageScale,
                                clipRectWidth: oFitToPages.pageWidthPixels + 16 + sap.galilei.ui.common.svg.Svg.SVG_RECT_MARGIN, // Adds margin in clipping to avoid truncating image
                                clipRectHeight: oFitToPages.pageHeightPixels + sap.galilei.ui.common.svg.Svg.SVG_RECT_MARGIN
                            });

                            sLocalStorageKey = sImageRootKey + (index + 1);
                            localStorage[sLocalStorageKey] = sSVGContent;
                            aLocalStorageKeys.push(sLocalStorageKey);
                        }

                        // Builds the URL. It has the following parameters: pages, imageKey, paperType, orientation, leftMargin, topMargin, rightMargin, bottomMargin
                        sPaperType = oPage.paperType;
                        if (sPaperType === sap.galilei.ui.common.PaperTypes.custom) {
                            sPaperType = "" + oPage.pageWidth + "mm " + oPage.pageHeight + "mm";
                        }
                        sOrientation = oPage.pageOrientation;
                        sLeftMargin = "" + oPage.pageLeftMargin + "mm";
                        sTopMargin = "" + oPage.pageTopMargin + "mm";
                        sRightMargin = "" + oPage.pageRightMargin + "mm";
                        sBottomMargin = "" + oPage.pageBottomMargin + "mm";
                        sRelativePath = "pages/printDiagram.html?pages=" + nPages + "&imageKey=" + sImageRootKey + "&paperType=" + sPaperType + "&orientation=" + sOrientation + "&leftMargin=" + sLeftMargin + "&topMargin=" + sTopMargin + "&rightMargin=" + sRightMargin + "&bottomMargin=" + sBottomMargin;
                        sURL = sap.galilei.ui5.utils.Url.getFullUrl(sRelativePath, true, true);
                        if (window.screen) {
                            sOption = "resizable=yes, scrollbars=yes, width=" + (screen.availWidth - 20) + ", height=" + (screen.availHeight - 60);
                        }

                        // Restores the page.
                        oDiagramEditor.viewer.page = oSavePage;

                        // Displays a message
                        oBundle = sap.galilei.ui5.utils.Locale.resourceModel;
                        sMessage = oBundle.getResourceBundle().getText("PRINT_DIAGRAM_INSTRUCTION", [sPaperType, sOrientation]);

                        jQuery.sap.require("sap.m.MessageBox");
                        sap.m.MessageBox.show(
                            sMessage,
                            sap.m.MessageBox.Icon.INFORMATION,
                            oBundle.getProperty("INFORMATION_TITLE"),
                            [sap.m.MessageBox.Action.CLOSE],
                            function () {
                                // Opens the print page
                                sap.galilei.ui5.utils.Url.openUrlInNewTab(sURL, undefined, sOption);
                                // Cleans local storage after 1mn when the page will be loaded
                                setTimeout(function () {
                                    for (index = 0; index < aLocalStorageKeys.length; index++) {
                                        sLocalStorageKey = aLocalStorageKeys[index];
                                        delete localStorage[sLocalStorageKey];
                                    }
                                }, 60000);
                            }
                        );
                    } else {
                        // TODO: Show an error message
                        console.log("The print diagram cannot be supported because your web browser does not support local storage.");
                    }
                }
            }
        }
    });
}());
