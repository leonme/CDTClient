sap.galilei.model.metamodel("Sap.Modeling.Bpmn", {
    contents: {
        // Defines the metamodel. The key is the name.
        "Sap.Modeling.Bpmn.Model": {
            name: "Sap.Modeling.Bpmn",
            classDefinition: "sap.galilei.model.Package", // Indicates the class of the item (it is a package)
            displayName: "Sap Modeling Bpmn Model",
            namespaceName: "sap.modeling.bpmn", // Indicates the namespace of the model constructor
            // Declares object metaclasses
            classifiers: {
                // The model, the container for other objects.
                "Model": {
                    displayName: "Model",
                    parent: "sap.galilei.common.Model", // It is a subclass of Galilei model
                    // Defines references
                    references: {
                        // The key is the identifier. It must be unique.
                        "Model.startEvents": {
                            name: "startEvents", // The name of the reference
                            contentType: "sap.modeling.bpmn.StartEvent", // The type of object it will contain.
                            isMany: true, // It can have more than one instance.
                            isContainment: true // It is a composition.
                        },
                        "Model.endEvents": {
                            name: "endEvents",
                            contentType: "sap.modeling.bpmn.EndEvent",
                            isMany: true,
                            isContainment: true
                        },
                        "Model.activities": {
                            name: "activities",
                            contentType: "sap.modeling.bpmn.Activity",
                            isMany: true,
                            isContainment: true
                        },
                        "Model.gateways": {
                            name: "gateways",
                            contentType: "sap.modeling.bpmn.Gateway",
                            isMany: true,
                            isContainment: true
                        },
                        "Model.sequenceFlows": {
                            name: "sequenceFlows",
                            contentType: "sap.modeling.bpmn.SequenceFlow",
                            isMany: true,
                            isContainment: true
                        },
						"Model.subprocesses": {
							name: "subprocesses",
							contentType: "sap.modeling.bpmn.SubProcess",
							isMany: true,
							isContainment: true
						}						
                    }
                },
                // The StartEvent class.
                "StartEvent": {
                    displayName: "Start Event",
                    properties: {
                    }
                },
                // The EndEvent class.
                "EndEvent": {
                    displayName: "End Event",
                    properties: {
                    }
                },
                // The Activity class.
                "Activity": {
                    displayName: "Activity",
                    properties: {
                        "Activity.type": { name: "type", dataType: sap.galilei.model.dataTypes.gString }
                    }
                },
                // The Task class.
                "Task": {
                    displayName: "Task",
                    parent: "sap.modeling.bpmn.Activity",
                    // Define properties
                    properties: {
                        // The key is the identifier. It must be unique.
                        "Task.name": {
                            name: "name", // The name of the property
                            dataType: sap.galilei.model.dataTypes.gString // The data type
                        },
                        "Task.type": { name: "type", dataType: sap.galilei.model.dataTypes.gString },
                        "Task.model": { name: "model", dataType: sap.galilei.model.dataTypes.gString },
                        "Task.isSelected": { name: "isSelected", dataType: sap.galilei.model.dataTypes.gString },
                        "Task.loopType": { name: "loopType", dataType: sap.galilei.model.dataTypes.gString },
                        "Task.implementation": { name: "implementation", dataType: sap.galilei.model.dataTypes.gString }
                    }
                },
                // The Gateway class.
                "Gateway": {
                    displayName: "Gateway",
                    properties: {
                        "Gateway.type": { name: "type", dataType: sap.galilei.model.dataTypes.gString },
                        "Gateway.direction": { name: "direction", dataType: sap.galilei.model.dataTypes.gString }
                    }
                },
                // The Scrap class.
                "Scrap": {
                    displayName: "Scrap",
                    properties: {
                    }
                },// The Hold class.
                "Hold": {
                    displayName: "Hold",
                    properties: {
                    }
                },// The Done class.
                "Done": {
                    displayName: "Done",
                    properties: {
                    }
                },
                // The SequenceFlow class.
                "SequenceFlow": {
                    displayName: "Sequence Flow",
                    parent: "sap.galilei.common.LinkObject",
                    properties: {
                        "SequenceFlow.isImmediate": { name: "isImmediate", dataType: sap.galilei.model.dataTypes.gBool },
                        "SequenceFlow.condition": { name: "condition", dataType: sap.galilei.model.dataTypes.gString }
                    }
                },
				// The subProcess class
				"SubProcess": {
					displayName: "Sub-Process",
					parent: "sap.modeling.bpmn.Activity",
					properties: {
						"SubProcess.type": { name: "type", dataType: sap.galilei.model.dataTypes.gString },
						"SubProcess.isEventBased": { name: "isEventBased", dataType: sap.galilei.model.dataTypes.gBool }
					},
					references: {
						"SubProcess.startEvents": {
							name: "startEvents",
							contentType: "sap.modeling.bpmn.StartEvent",
							isMany: true,
							isContainment: true
						},
						"SubProcess.endEvents": {
							name: "endEvents",
							contentType: "sap.modeling.bpmn.EndEvent",
							isMany: true,
							isContainment: true
						},
						"SubProcess.activities": {
							name: "activities",
							contentType: "sap.modeling.bpmn.Activity",
							isMany: true,
							isContainment: true
						},
						"SubProcess.gateways": {
							name: "gateways",
							contentType: "sap.modeling.bpmn.Gateway",
							isMany: true,
							isContainment: true
						},
						"SubProcess.sequenceFlows": {
							name: "sequenceFlows",
							contentType: "sap.modeling.bpmn.SequenceFlow",
							isMany: true,
							isContainment: true
						}
					}
				}
            }
        }
    }
});

// Load all metamodels defined
sap.galilei.model.loadMetamodels();