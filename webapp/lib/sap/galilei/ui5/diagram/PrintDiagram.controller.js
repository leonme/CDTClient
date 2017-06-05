//jQuery.sap.declare("sap.galilei.ui5.diagram.PrintDiagram");

(function() {
    "use strict";

    sap.ui.controller("sap.galilei.ui5.diagram.PrintDiagram", {

        PAGE_ORIENTATION_AUTO: "auto",

        /**
         * Defines a settings JSON model for printing diagram.
         */
        _printDiagramSettings: {
            paperSizes: [
                {
                    key: sap.galilei.ui.common.PaperTypes.A5,
                    name: sap.galilei.ui.common.PaperTypes.A5
                },
                {
                    key: sap.galilei.ui.common.PaperTypes.A4,
                    name: sap.galilei.ui.common.PaperTypes.A4
                },
                {
                    key: sap.galilei.ui.common.PaperTypes.A3,
                    name: sap.galilei.ui.common.PaperTypes.A3
                },
                {
                    key: sap.galilei.ui.common.PaperTypes.B5,
                    name: sap.galilei.ui.common.PaperTypes.B5
                },
                {
                    key: sap.galilei.ui.common.PaperTypes.B4,
                    name: sap.galilei.ui.common.PaperTypes.B4
                },
                {
                    key: sap.galilei.ui.common.PaperTypes.letter,
                    name: sap.galilei.ui.common.PaperTypes.letter
                },
                {
                    key: sap.galilei.ui.common.PaperTypes.legal,
                    name: sap.galilei.ui.common.PaperTypes.legal
                },
                {
                    key: sap.galilei.ui.common.PaperTypes.ledger,
                    name: sap.galilei.ui.common.PaperTypes.ledger
                }
            ],
            paperType: sap.galilei.ui.common.PaperTypes.A4,
            pageOrientations: [
                {
                    key: "auto",
                    name: "Auto"
                },
                {
                    key: sap.galilei.ui.common.PageOrientations.portrait,
                    name: sap.galilei.ui.common.PageOrientations.portrait
                },
                {
                    key: sap.galilei.ui.common.PageOrientations.landscape,
                    name: sap.galilei.ui.common.PageOrientations.landscape
                }
            ],
            pageOrientation: sap.galilei.ui.common.PageOrientations.portrait,
            horizontalPages: 1,
            verticalPages: 1,
            totalPages: 1,
            selectedOrientation: sap.galilei.ui.common.PageOrientations.portrait,
            isFitToOnePage: false,
            isBestFitToPages: true,
            pageScalePercent: 100.0,
            marginUnit: sap.galilei.ui.common.MeasureUnits.mm,
            isMm: true,
            isInch: false,
            paperLeftMargin: 10,
            paperTopMargin: 10,
            paperRightMargin: 10,
            paperBottomMargin: 10
        },

        /**
         * The viewer.
         */
        diagramViewer: undefined,

        /**
         * The diagram SVG.
         */
        SVGContent: undefined,

        /** The global view rectangle.
         globalViewRect: undefined,

         /**
         * The parent shape of the SVG content.
         */
        groupShape: undefined,

        /**
         * The used pages shapes
         */
        usedPageShapes: [],

        /**
         * Initializes the controller.
         */
        onInit: function () {
            var oModel = new sap.ui.model.json.JSONModel();

            this.getView().setModel(oModel);
        },

        /**
         * Gets the print diagram settings.
         * @returns {*}
         */
        getPrintDiagramSettings: function () {
            if (!isNaN(this._printDiagramSettings.pageScalePercent)) {
                this._printDiagramSettings.pageScalePercent = +this._printDiagramSettings.pageScalePercent;
            }
            if (!isNaN(this._printDiagramSettings.paperLeftMargin)) {
                this._printDiagramSettings.paperLeftMargin = +this._printDiagramSettings.paperLeftMargin;
            }
            if (!isNaN(this._printDiagramSettings.paperTopMargin)) {
                this._printDiagramSettings.paperTopMargin = +this._printDiagramSettings.paperTopMargin;
            }
            if (!isNaN(this._printDiagramSettings.paperRightMargin)) {
                this._printDiagramSettings.paperRightMargin = +this._printDiagramSettings.paperRightMargin;
            }
            if (!isNaN(this._printDiagramSettings.paperBottomMargin)) {
                this._printDiagramSettings.paperBottomMargin = +this._printDiagramSettings.paperBottomMargin;
            }
            return this._printDiagramSettings;
        },

        /**
         * Gets the settings and update the current page.
         * @param {sap.galilei.ui.common.Page} oPage The page to update.
         */
        getPageSettings: function (oPage) {
            var oPrintSettings,
                sOrientation;

            /**
             * Gets the value as millimeter.
             * @param nValue The value.
             * @param sUnit The unit (mm or inch).
             * @returns {*}
             */
            function getMillimeter (nValue, sUnit) {
                if (sUnit === sap.galilei.ui.common.MeasureUnits.mm) {
                    return nValue;
                } else {
                    return sap.galilei.ui.common.Measure.convertMeasure(nValue, sap.galilei.ui.common.MeasureUnits.inch, sap.galilei.ui.common.MeasureUnits.mm, 1);
                }
            }


            if (oPage) {
                oPrintSettings = this.getPrintDiagramSettings();
                oPage.setPaperSize(oPrintSettings.paperType);
                sOrientation = oPrintSettings.pageOrientation;
                if (sOrientation === sap.galilei.ui.common.PageOrientations.portrait || sOrientation === sap.galilei.ui.common.PageOrientations.landscape) {
                    oPage.pageOrientation = sOrientation;
                    oPage.isCanChangeOrientation = false;
                } else {
                    oPage.isCanChangeOrientation = true;
                }
                if (!isNaN(oPrintSettings.pageScalePercent)) {
                    oPage.pageScale = oPrintSettings.pageScalePercent / 100;
                }
                if (!isNaN(oPrintSettings.paperLeftMargin)) {
                    oPage.paperLeftMargin = getMillimeter(oPrintSettings.paperLeftMargin, oPrintSettings.marginUnit);
                }
                if (!isNaN(oPrintSettings.paperTopMargin)) {
                    oPage.paperTopMargin = getMillimeter(oPrintSettings.paperTopMargin, oPrintSettings.marginUnit);
                }
                if (!isNaN(oPrintSettings.paperRightMargin)) {
                    oPage.paperRightMargin = getMillimeter(oPrintSettings.paperRightMargin, oPrintSettings.marginUnit);
                }
                if (!isNaN(oPrintSettings.paperBottomMargin)) {
                    oPage.paperBottomMargin = getMillimeter(oPrintSettings.paperBottomMargin, oPrintSettings.marginUnit);
                }
            }
        },

        /**
         * Handling paper size change.
         * @param oEvent
         */
        onPaperTypeChange: function (oEvent) {
            this.updateDiagramPreview();
        },

        /**
         * Handling orientation change.
         * @param oEvent
         */
        onOrientationChange: function (oEvent) {
            this.updateDiagramPreview();
        },

        /**
         * Best fits to pages.
         * @param oEvent
         */
        onBestFitToPagesSelected: function (oEvent) {
            this.updateDiagramPreview();
        },

        /**
         * Fits to one page.
         * @param oEvent
         */
        onFitToOnePageSelected: function (oEvent) {
            this.updateDiagramPreview();
        },

        /**
         * Uses mm.
         * @param oEvent
         */
        onUnitMmSelected: function (oEvent) {
            this.changeMarginUnit(sap.galilei.ui.common.MeasureUnits.mm);
        },

        /**
         * Uses inch.
         * @param oEvent
         */
        onUnitInchSelected: function (oEvent) {
            this.changeMarginUnit(sap.galilei.ui.common.MeasureUnits.inch);
        },

        /**
         * Changes the unit of margins.
         * @param sUnit
         */
        changeMarginUnit: function (sUnit) {
            var oModel = this.getView().getModel(),
                oPrintSettings,
                nDigit;

            oPrintSettings = this.getPrintDiagramSettings();
            if (sUnit && sUnit !== oPrintSettings.marginUnit) {
                nDigit = (sUnit === sap.galilei.ui.common.MeasureUnits.mm ? 1 : 3);
                if (!isNaN(oPrintSettings.paperLeftMargin)) {
                    oModel.setProperty("/paperLeftMargin", sap.galilei.ui.common.Measure.convertMeasure(oPrintSettings.paperLeftMargin, oPrintSettings.marginUnit, sUnit, nDigit));
                }
                if (!isNaN(oPrintSettings.paperTopMargin)) {
                    oModel.setProperty("/paperTopMargin", sap.galilei.ui.common.Measure.convertMeasure(oPrintSettings.paperTopMargin, oPrintSettings.marginUnit, sUnit, nDigit));
                }
                if (!isNaN(oPrintSettings.paperRightMargin)) {
                    oModel.setProperty("/paperRightMargin", sap.galilei.ui.common.Measure.convertMeasure(oPrintSettings.paperRightMargin, oPrintSettings.marginUnit, sUnit, nDigit));
                }
                if (!isNaN(oPrintSettings.paperBottomMargin)) {
                    oModel.setProperty("/paperBottomMargin", sap.galilei.ui.common.Measure.convertMeasure(oPrintSettings.paperBottomMargin, oPrintSettings.marginUnit, sUnit, nDigit));
                }
                oPrintSettings.marginUnit = sUnit;
            }
        },

        /**
         * Updates the print diagram settings.
         */
        updatePrintDiagramSettings: function () {
            var index,
                sName,
                oModel;

            // TODO: Localize the paper size names
            for (index = 0; index < this._printDiagramSettings.paperSizes.length; index++) {
                sName = this._printDiagramSettings.paperSizes[index].name;
            }
            // TODO: Localize the page orientation names
            for (index = 0; index < this._printDiagramSettings.pageOrientations.length; index++) {
                sName = this._printDiagramSettings.pageOrientations[index].name;
            }

            oModel = this.getView().getModel();
            oModel.setData(this._printDiagramSettings);
            this.getView().setModel(oModel);
        },

        /**
         * Displays the diagram preview.
         */
        showDiagramPreview: function () {
            var sContainerId = "printDiagramDialog--view--printDiagramPreview",
                oViewer;

            oViewer = new sap.galilei.ui.common.svg.Viewer("#" + sContainerId, {
                viewBorderWidth: 1,
                showGrid: false,
                showZoomTools: false
            });
            this.diagramViewer = oViewer;

            if (this._printDiagramSettings.SVGContent) {
                this.groupShape = new sap.galilei.ui.common.shape.Group({
                    x: 0,
                    y: 0,
                    isEnableTransform: true
                });
                this.groupShape.draw(oViewer);
                jQuery(this.groupShape.svgNode).append(this._printDiagramSettings.SVGContent);
            }

            // Gets the diagram rectangle.
            this.globalViewRect = this.diagramViewer.getGlobalViewRect() || (new sap.galilei.ui.common.Rect());
            // x and y are 0.
            this.globalViewRect.inflate(sap.galilei.ui.common.svg.Svg.SVG_RECT_MARGIN, sap.galilei.ui.common.svg.Svg.SVG_RECT_MARGIN);

            this.updateDiagramPreview();
        },

        /**
         * Updates the diagram preview.
         */
        updateDiagramPreview: function () {
            var oPage,
                oFitToPages,
                oModel = this.getView().getModel();

            // Removes pages limit
            this.removeUsedPagesShapes();

            // Gets the page
            oPage = this.diagramViewer.page;
            // Sets page properties
            this.getPageSettings(oPage);
            oPage.pageScale = 1.0; // TODO: Uses the diagram editor page scale

            if (this._printDiagramSettings.isFitToOnePage) {
                // Tries to fit in one page.
                oFitToPages = oPage.fitToOnePage(this.globalViewRect, oPage.isCanChangeOrientation);
            } else {
                // Tries to best fit in pages.
                oFitToPages = oPage.fitToPages(this.globalViewRect, oPage.isCanChangeOrientation);
            }

            // Updates the page properties
            oPage.pageOrientation = oFitToPages.pageOrientation;
            oPage.pageScale = oFitToPages.pageScale;
            oModel.setProperty("/horizontalPages", oFitToPages.horizontalPages);
            oModel.setProperty("/verticalPages", oFitToPages.verticalPages);
            oModel.setProperty("/totalPages", oFitToPages.totalPages);
            oModel.setProperty("/selectedOrientation", oFitToPages.pageOrientation);
            oModel.setProperty("/pageScalePercent", +(oPage.pageScale * 100).toFixed(1));

            // Updates the page background
            this.diagramViewer.pageHorzNumber = oFitToPages.horizontalPages;
            this.diagramViewer.pageVertNumber = oFitToPages.verticalPages;
            this.diagramViewer.updatePageSize();

            // Offsets the diagram in the viewer: left, top of the center page + diagram offset.
            this.groupShape.x = this.diagramViewer.allPagesLeft + oFitToPages.diagramLeftOffset / oPage.pageScale;
            this.groupShape.y = this.diagramViewer.allPagesTop + oFitToPages.diagramTopOffset / oPage.pageScale;
            this.groupShape.updateDrawing(this.diagramViewer, undefined, [ "groupTransform" ]);

            this.showPageLimit(oFitToPages.usedPages);
            this.diagramViewer.showUsedPages();
        },

        /**
         * Shows the page limit.
         * @param aUsedPages
         */
        showPageLimit: function (aUsedPages) {
            var aPages = aUsedPages,
                index,
                oPageRect,
                oShape;

            if (!aPages || aPages.length === 0) {
                aPages = [];
                aPages.push({
                    x: 0,
                    y: 0,
                    width: this.diagramViewer.pageWidth,
                    height: this.diagramViewer.pageHeight
                });
            }

            for (index = 0; index < aPages.length; index++) {
                oPageRect = aPages[index];
                oShape = new sap.galilei.ui.common.shape.Rectangle({
                    x: oPageRect.x + this.diagramViewer.allPagesLeft,
                    y: oPageRect.y + this.diagramViewer.allPagesTop,
                    width: oPageRect.width,
                    height: oPageRect.height,
                    fill: "none",
                    stroke: "black",
                    strokeWidth: 2
                });
                oShape.draw(this.diagramViewer);
                this.usedPageShapes.push(oShape);
            }
        },

        /**
         * Removes pages shapes.
         */
        removeUsedPagesShapes: function () {
            var index;

            if (this.usedPageShapes && this.usedPageShapes.length > 0) {
                for (index = 0; index < this.usedPageShapes.length; index++) {
                    this.usedPageShapes[index].dispose();
                }
                this.usedPageShapes = [];
            }
        },

        /**
         * Frees the resource.
         */
        dispose: function () {
            if (this.diagramViewer) {
                this.diagramViewer.dispose();
                this.diagramViewer = undefined;
            }
        }
    });
}());

