
sap.galilei.model.metamodel("Sap.Modeling.Bpmn.Ui", {
    contents: {
        // Defines the diagram metamodel. The key is the name.
        "Sap.Modeling.Bpmn.Diagram": {
            name: "Sap.Modeling.Bpmn.Ui",
            classDefinition: "sap.galilei.model.Package", // Indicates the class of the item (it is a package)
            displayName: "Sap Modeling Bpmn Diagram",
            namespaceName: "sap.modeling.bpmn.ui", // Indicates the namespace of the diagram constructor
            // Declares symbol metaclasses
            classifiers: {
                // The diagram, the container for other symbols.
                "Diagram": {
                    displayName: "Diagram",
                    parent: "sap.galilei.ui.diagram.Diagram" // It is a subclass of Galilei diagram
                },

                // The StartEventSymbol class.
                "StartEventSymbol": {
                    displayName: "Start Event Symbol",
                    parent: "sap.galilei.ui.diagram.Symbol",
                    // Defines the initialization function
                    onInitialize: function(oResource, oParam) {
                        // Set symbol default parameters
                        oParam.isKeepSize = true;
                        oParam.width = 40;
                        oParam.height = 40;
                    },
                    properties: {
                    },
                    // Defines static members
                    statics: {
                        // Indicates the object class of the symbol
                        objectClass: { value: "sap.modeling.bpmn.StartEvent" },
                        // Defines the symbol layout template
                        layoutTemplate: {
                            // The main shape is a circle with an envelop icon. It defines the boundary of the symbol.
                            mainShape: [
                                // The circle shape
                                { shape: "Circle", domClass: "startEvent", cx: 20, cy: 20, r: 20, stroke: "#0080c0", strokeWidth: 2, fill: "white" },
                                // The panel shape that takes the size of the circle shape. It is used to layout the icon shape.
                                { shape: "Panel",  shapes: [
                                    // The rectangle of the envelop
                                    { shape: "Rectangle", domClass: "startEventIcon", x: 9, y: 13, width: 22, height: 14, stroke: "#0080c0", fill: "none" },
                                    // The polyline for the internal the envelop
                                    { shape: "Polyline", domClass: "startEventIcon", points: "9,13 20,20 31,13", stroke: "#0080c0", fill: "none" }
                                ]}
                            ]
                        }
                    }
                },

                // The EndEventSymbol class.
                "EndEventSymbol": {
                    displayName: "End Event Symbol",
                    parent: "sap.galilei.ui.diagram.Symbol",
                    // Defines the initialization function
                    onInitialize: function(oResource, oParam) {
                        // Set symbol default parameters
                        oParam.isKeepSize = true;
                        oParam.width = 40;
                        oParam.height = 40;
                    },
                    properties: {
                    },
                    statics: {
                        objectClass: { value: "sap.modeling.bpmn.EndEvent" },
                        layoutTemplate: {
                            mainShape: [
                                { shape: "Circle", domClass: "endEvent", cx: 20, cy: 20, r: 20, stroke: "#0080c0", strokeWidth: 4, fill: "white" }
                            ]
                        }
                    }
                },

                // The TaskSymbol class.
                "TaskSymbol": {
                    displayName: "Task Symbol",
                    parent: "sap.galilei.ui.diagram.Symbol",
                    onInitialize: function(oResource, oParam) {
                    	this.on("click", function (oEvent) {
                            var oSymbol = oEvent.sourceSymbol;
//                            console.log(oSymbol);
                            this.updateSelectedSymbol();
                        });
                    },
                    methods: {
                    	updateSelectedSymbol:function(){
                    		if(this.object.model == 'routing'){
	                    		if(this.object.isSelected == undefined){
	                    			this.object.isSelected = 'true';
	                    		}else if(this.object.isSelected != 'true'){
	                    			this.object.isSelected = 'true';
	                    		}else{
	                    			this.object.isSelected = 'false';
	                    		}
                    		}
                    	}
                    },
                    statics: {
                        objectClass: { value: "sap.modeling.bpmn.Task" },
                        layoutTemplate: {
                            // The main shape is a rounded rectangle with an envelop icon
                            mainShape: [
                                { shape: "RoundedRectangle", domClass: "task", r: 8, stroke: "#428EB0", strokeWidth: 1, fill: "white", width: 100, height: 50, }
                            ],
                            // The content shape is the template of the interior of the symbol
                            contentShape: {
                                // The stack shape is used to layout the the image and text.
                                shape: "Stack", horizontalAlignment: "width", verticalAlignment: "height", innerPadding: 0, contentPosition: 1, contentMargin: 10, 
                                shapes: [
                                    // The image shape shows an icon. The icon URL has a data-binding to the object type.
                                    // The object type could be "service", "script", ... The type cannot be used as an image URL.
                                    // We have to use a formatter: typeIconUrl.
                                    // A formatter could be a map or a function. In this case, we use a map.
                                    // The icons (#Bpmn.ServiceTaskIcon, ...) are defined in library.js.
                                    // Where Bpmn is the libray name, ServiceTaskIcon is the library item name.
                                    { shape: "Image", domClass: "taskIcon", href: "{object/isSelected:selectedIconUrl}", dockPosition: "topRight", width: 10, height: 10 },
                                    // The text shape's text attribute has a data-binding to the object name.
                                    { shape: "Text", domClass: "taskName", text: "{object/name}", font: "16px Calibri bold", fill: "black", horizontalAlignment: "right", verticalAlignment: "center" }
                                ]
                            }
                        },
                        formatters: {
                            // The typeIconUrl formatter. It is in map format.
//                            typeIconUrl: {
//                                "service": "#Bpmn.ServiceTaskIcon",
//                                "script": "#Bpmn.ScriptTaskIcon",
//                                "user": "#Bpmn.UserTaskIcon",
//                                "manual": "#Bpmn.ManualTaskIcon",
//                                "businessRule": "#Bpmn.BusinessRuleTaskIcon"
//                            }
                        	selectedIconUrl: {
                        		"true":"images/Selected.png"
                        	}
                        }
                    }
                },

                // The GatewaySymbol class.
                "GatewaySymbol": {
                    displayName: "Gateway Symbol",
                    parent: "sap.galilei.ui.diagram.Symbol",
                    onInitialize: function(oResource, oParam) {
                        oParam.isAdjustToContent = false;
                        oParam.displayMode = sap.galilei.ui.common.ShapeLayoutModes.icon;
                        oParam.isKeepSize = true;
                        oParam.width = 42;
                        oParam.height = 42;
                    },
                    statics: {
                        objectClass: { value: "sap.modeling.bpmn.Gateway" },
                        layoutTemplate: {
                            displayMode: sap.galilei.ui.common.ShapeLayoutModes.icon,
                            mainShape: [
                                { shape: "Polygon", domClass: "gateway", points: "21,1 41,21 21,41 1,21", stroke: "#997C35", strokeWidth: 1, fill: "white", strokeLineJoin: "round" },
                                { shape: "Panel", shapes: [
                                    { shape: "Image", domClass: "gatewayIcon", useReference: true, href: "{object/type:typeIconUrl}", x: 1, y: 1, width: 40, height: 40 }
                                ]}
                            ]
                        }
                    }
                },

                // The SequenceFlowSymbol class.
                "SequenceFlowSymbol": {
                    displayName: "Sequence Flow Symbol",
                    parent: "sap.galilei.ui.diagram.LinkSymbol",
                    statics: {
                        objectClass: { value: "sap.modeling.bpmn.SequenceFlow" },
                        layoutTemplate: {
                            domClass: "sequence",
                            stroke: "#0080c0",
                            strokeWidth: 1,
                            fill: "#0080c0",
                            lineStyle: sap.galilei.ui.common.LineStyle.rounded,
                            targetArrow: "Arrows.FilledEnd",
                            middleContent: {
                                shape: "Text",
                                text: "{object/condition}",
                                font: "12px Calibri",
                                fill: "black",
                                horizontalAlignment: "middle",
                                verticalAlignment: "middle",
                                isEllipsis: true,
                                isVisible: true
                            }							
                        }
                    }
                },
                
             // The ScrapSymbol class.
                "ScrapSymbol": {
                    displayName: "Scrap Symbol",
                    parent: "sap.galilei.ui.diagram.Symbol",
                    onInitialize: function(oResource, oParam) {
                        oParam.isAdjustToContent = false;
                        oParam.displayMode = sap.galilei.ui.common.ShapeLayoutModes.icon;
                        oParam.isKeepSize = true;
                        oParam.width = 42;
                        oParam.height = 42;
                    },
                    statics: {
                        objectClass: { value: "sap.modeling.bpmn.Scrap" },
                        layoutTemplate: {
                            displayMode: sap.galilei.ui.common.ShapeLayoutModes.icon,
                            mainShape: [
                            	{ shape: "Circle", domClass: "scrap", cx: 20, cy: 20, r: 20, stroke: "#0080c0", strokeWidth: 0},
                                { shape: "Panel", shapes: [
                                    { shape: "Image", href: "images/Scrap.png", dockPosition: "center", width: 50, height: 50,
                                      events: {
                                          "pointerdown": function (oEvent, oSymbol, oExtension) {
                                              console.log("Clicked on the icon of node " + oSymbol.object.name);
                                          }
                                      }}
                                ]}
                            ]
                        }
                    }
                },
                
                // The HoldSymbol class.
                   "HoldSymbol": {
                       displayName: "Hold Symbol",
                       parent: "sap.galilei.ui.diagram.Symbol",
                       onInitialize: function(oResource, oParam) {
                           oParam.isAdjustToContent = false;
                           oParam.displayMode = sap.galilei.ui.common.ShapeLayoutModes.icon;
                           oParam.isKeepSize = true;
                           oParam.width = 42;
                           oParam.height = 42;
                       },
                       statics: {
                           objectClass: { value: "sap.modeling.bpmn.Hold" },
                           layoutTemplate: {
                               displayMode: sap.galilei.ui.common.ShapeLayoutModes.icon,
                               mainShape: [
                               	{ shape: "Circle", domClass: "hold", cx: 20, cy: 20, r: 20, stroke: "#0080c0", strokeWidth: 0},
                                   { shape: "Panel", shapes: [
                                       { shape: "Image", href: "images/Hold.png", dockPosition: "center", width: 50, height: 50,
                                         events: {
                                             "pointerdown": function (oEvent, oSymbol, oExtension) {
                                                 console.log("Clicked on the icon of node " + oSymbol.object.name);
                                             }
                                         }}
                                   ]}
                               ]
                           }
                       }
                   },
                   
                   // The DoneSymbol class.
                      "DoneSymbol": {
                          displayName: "Done Symbol",
                          parent: "sap.galilei.ui.diagram.Symbol",
                          onInitialize: function(oResource, oParam) {
                              oParam.isAdjustToContent = false;
                              oParam.displayMode = sap.galilei.ui.common.ShapeLayoutModes.icon;
                              oParam.isKeepSize = true;
                              oParam.width = 42;
                              oParam.height = 42;
                          },
                          statics: {
                              objectClass: { value: "sap.modeling.bpmn.Done" },
                              layoutTemplate: {
                                  displayMode: sap.galilei.ui.common.ShapeLayoutModes.icon,
                                  mainShape: [
                                  	{ shape: "Circle", domClass: "done", cx: 20, cy: 20, r: 20, stroke: "#0080c0", strokeWidth: 0},
                                      { shape: "Panel", shapes: [
                                          { shape: "Image", href: "images/Done.png", dockPosition: "center", width: 50, height: 50,
                                            events: {
                                                "pointerdown": function (oEvent, oSymbol, oExtension) {
                                                    console.log("Clicked on the icon of node " + oSymbol.object.name);
                                                }
                                            }}
                                      ]}
                                  ]
                              }
                          }
                      }
            }
        }
    }
});

// Load all metamodels defined
sap.galilei.model.loadMetamodels();