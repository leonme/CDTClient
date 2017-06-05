namespace("sap.modeling.dbSchema");namespace("sap.modeling.dbSchema.ui");
(function(){var oResource,oReader,oModelDef={contents:{"Sap.Modeling.DbSchema.Model":{classDefinition:"sap.galilei.model.Package",displayName:"Database Schema Model",namespaceName:"sap.modeling.dbSchema",classifiers:{Table:{displayName:"Table",parent:"sap.galilei.common.NamedObject",properties:{},references:{"Table.Columns":{name:"columns",contentType:"sap.modeling.dbSchema.Column",isMany:true,isContainment:true,isOrdered:true}}},Column:{displayName:"Column",parent:"sap.galilei.common.NamedObject",properties:{"Column.isKey":{name:"isKey",dataType:sap.galilei.model.dataTypes.gBool,defaultValue:false},"Column.dataType":{name:"dataType",dataType:sap.galilei.model.dataTypes.gString,defaultValue:"string"},"Column.length":{name:"length",dataType:sap.galilei.model.dataTypes.gULong,defaultValue:10},"Column.precision":{name:"precision",dataType:sap.galilei.model.dataTypes.gUInteger,defaultValue:0},"Column.isMandatory":{name:"isMandatory",dataType:sap.galilei.model.dataTypes.gBool,defaultValue:false}}},Join:{displayName:"Join",parent:"sap.galilei.common.LinkObject",properties:{sourceColumn:{get:function(){return this.source},set:function(oSource){this.source=oSource}},targetColumn:{get:function(){return this.target},set:function(oSource){this.target=oSource}},sourceTable:{get:function(){return this.source&&this.source.container}},targetTable:{get:function(){return this.target&&this.target.container}},joinCardinality:{dataType:sap.galilei.model.dataTypes.gString},joinType:{dataType:sap.galilei.model.dataTypes.gString,defaultValue:"inner"},errorOrWarnings:{dataType:sap.galilei.model.dataTypes.gInteger,defaultValue:0},showWarning:{get:function(){return this.errorOrWarnings!=0}}}},Model:{displayName:"Model",parent:"sap.galilei.common.Model",references:{"Model.tables":{name:"tables",contentType:"sap.modeling.dbSchema.Table",isMany:true,isContainment:true},"Model.joins":{name:"joins",contentType:"sap.modeling.dbSchema.Join",isMany:true,isContainment:true}}}}}}};oResource=new sap.galilei.model.Resource();oReader=new sap.galilei.model.JSONReader();oReader.load(oResource,oModelDef)}());
(function(){var oResource,oReader,oDiagramDef={contents:{"Sap.Modeling.dbSchema.Diagram":{classDefinition:"sap.galilei.model.Package",displayName:"Database Schema Diagram",namespaceName:"sap.modeling.dbSchema.ui",classifiers:{Diagram:{displayName:"Diagram",parent:"sap.galilei.ui.diagram.Diagram"},TableSymbol:{displayName:"Table Symbol",parent:"sap.galilei.ui.diagram.TableSymbol",properties:{"TableSymbol.minWidth":{name:"minWidth",defaultValue:100},"TableSymbol.minHeight":{name:"minHeight",defaultValue:20},"TableSymbol.stroke":{name:"stroke",defaultValue:"#B3B3B3"},"TableSymbol.strokeWidth":{name:"strokeWidth",defaultValue:1},"TableSymbol.fill":{name:"fill",defaultValue:"#C9DFF1"},"TableSymbol.font":{name:"font",defaultValue:"12px Arial,sans-serif"},"TableSymbol.textColor":{name:"textColor",defaultValue:"#333333"}},methods:{getConnectedSymbols:function(bIncludeSource,bIncludeTarget,bIncludeLinkSymbols){return[]}},statics:{objectClass:{value:"sap.modeling.dbSchema.Table"},layoutTemplate:{mainShape:[{shape:"RoundedRectangle",r:3,domClass:"table",stroke:"{stroke}",strokeWidth:"{strokeWidth}",fill:"#FFFFFF",padding:0,width:100,height:60},{shape:"Panel",shapes:[{shape:"RoundedSameSideRectangle",r:3,dockPosition:"width",height:20,stroke:"{stroke}",strokeWidth:"{strokeWidth}",fill:"{fill}"}]}],contentShape:{shape:"Stack",horizontalAlignment:"width",verticalAlignment:"top",innerAlignment:"center",padding:0,innerPadding:0,contentPosition:2,shapes:[{shape:"Stack",orientation:"horizontal",padding:2,innerPadding:2,shapes:[{shape:"Image",href:"images/Table16.png",width:16,height:16},{shape:"Text",domClass:"tableName",text:"{object/displayName}",font:"{font}",fill:"{textColor}",horizontalAlignment:"width",verticalAlignment:"height",isWordWrap:true,isEllipsis:true},{shape:"Image",domClass:"tableExpander",tooltip:"{isExpanded:expanderTooltip}",href:"{isExpanded:expanderIcon}",width:16,height:16,events:{pointerdown:function(oEvent,oSymbol,oEditorExtension){oEditorExtension.toggleExpanded(oSymbol)}}}]}]},items:{path:"object/columns",template:[{columnHeader:"Icon",shape:"Image",href:"images/Table16.png",width:12,height:12},{columnHeader:"Name",shape:"Text",domClass:"columnName",text:"{object/displayName}",font:"{font}",fill:"{textColor}",horizontalAlignment:"left",verticalAlignment:"middle",isWordWrap:true},{columnHeader:"Data Type",shape:"Text",domClass:"columnName",marginLeft:8,text:"{object/dataType}",font:"{font}",fill:"{textColor}",horizontalAlignment:"left",verticalAlignment:"middle",isWordWrap:true}],rowSymbolClass:"sap.modeling.dbSchema.ui.ColumnSymbol",paddingLeft:0,paddingRight:0,paddingTop:0,paddingBottom:0,marginLeft:4,marginRight:4,marginTop:4,marginBottom:4,columnPadding:4,rowPadding:2}},formatters:{expanderIcon:function(bExpanded){return bExpanded?"images/CollapseAll.png":"images/ExpandAll.png"},expanderTooltip:function(bExpanded){return bExpanded?"Collapse":"Expand"}}}},ColumnSymbol:{displayName:"Column Symbol",parent:"sap.galilei.ui.diagram.RowSymbol",properties:{"ColumnSymbol.font":{name:"font",defaultValue:"10px Arial,sans-serif"},"ColumnSymbol.textColor":{name:"textColor",defaultValue:"#333333"}},methods:{getAttachPoints:function(bIsSource){var oBBox=this.getBBox();return{isFixedPoints:true,points:[[oBBox.x,oBBox.y+0.5*oBBox.height],[oBBox.x+oBBox.width,oBBox.y+0.5*oBBox.height]]}}},statics:{events:{pointerdown:function(oEvent,oSymbol,oExtension){console.log("Click row symbol.")},dragstart:function(oEvent,oSymbol,oExtension){var oEditor=oExtension.editor,oTool=oEditor.selectTool("sap.modeling.dbSchema.ui.JoinSymbol",false),aViewPoint,aClientPoint;oEvent.preventDefault();oEvent.stopPropagation();aClientPoint=oEditor.viewer.normalizePointerEvent(oEvent,false);aViewPoint=oEditor.viewer.clientPointToViewPoint(aClientPoint);oEvent.clientViewX=aViewPoint[0];oEvent.clientViewY=aViewPoint[1];oEvent._clientX=aClientPoint[0];oEvent._clientY=aClientPoint[1];oEvent._type="drag";oTool.isContextButton=true;oEvent.contextButtonSymbol=oSymbol;oTool.onPointerDown(oEvent);oTool.onDragStart(oEvent)},pointermove:function(oEvent,oSymbol,oExtension){var oEditor=oExtension.editor;if(oEditor.tool&&oEditor.tool.onPointerMove){oEditor.tool.onPointerMove(oEvent)}},drag:function(oEvent,oSymbol,oExtension){var oEditor=oExtension.editor;if(oEditor.tool&&oEditor.tool.onDrag){oEditor.tool.onDrag(oEvent)}},dragend:function(oEvent,oSymbol,oExtension){var oEditor=oExtension.editor;if(oEditor.tool&&oEditor.tool.onDragEnd){oEditor.tool.onDragEnd(oEvent)}},contextmenu:function(oEvent){console.log("Popup row symbol.")}}}},JoinSymbol:{displayName:"Join Symbol",parent:"sap.galilei.ui.diagram.LinkSymbol",properties:{lineStyle:{defaultValue:sap.galilei.ui.common.LineStyle.horzDiagonal},supportedSourceDirections:{defaultValue:function(){return[sap.galilei.ui.common.LinkDirection.west,sap.galilei.ui.common.LinkDirection.east]}},supportedTargetDirections:{defaultValue:function(){return[sap.galilei.ui.common.LinkDirection.west,sap.galilei.ui.common.LinkDirection.east]}},contentOffsetX:{dataType:sap.galilei.model.dataTypes.gDouble,defaultValue:15},contentOffsetY:{dataType:sap.galilei.model.dataTypes.gDouble,defaultValue:1},"JoinSymbol.stroke":{name:"stroke",defaultValue:"#B3B3B3"},"JoinSymbol.strokeWidth":{name:"strokeWidth",defaultValue:1},"JoinSymbol.font":{name:"font",defaultValue:"10px Arial,sans-serif"},"JoinSymbol.textColor":{name:"textColor",defaultValue:"#333333"}},methods:{getConnectedSymbols:function(bIncludeSource,bIncludeTarget,bIncludeLinkSymbols){if(this.sourceSymbol.parentSymbol&&this.sourceSymbol.parentSymbol.isExpanded&&this.targetSymbol.parentSymbol&&this.targetSymbol.parentSymbol.isExpanded){return this.defaultGetConnectedSymbols(bIncludeSource,bIncludeTarget,bIncludeLinkSymbols)}return[]}},statics:{objectClass:{value:"sap.modeling.dbSchema.Join"},layoutTemplate:{stroke:"{stroke}",strokeWidth:"{strokeWidth}",lineStyle:"{lineStyle}",targetArrow:"Arrows.LineEnd",middleArrow:{shape:"Stack",shapes:[{shape:"Image",href:"images/Warning.png",width:16,height:16,isVisible:"{object/showWarning}"},{shape:"Image",href:"{object/joinType:joinTypeImage}",width:16,height:16}],orientation:"horizontal"},targetContent:{shape:"Text",text:"{object/joinCardinality:targetCardinality}",font:"{font}",fill:"{textColor}",horizontalAlignment:"middle",verticalAlignment:"middle",isEllipsis:false,isVisible:true},sourceContent:{shape:"Text",text:"{object/joinCardinality:sourceCardinality}",font:"{font}",fill:"{textColor}",horizontalAlignment:"middle",verticalAlignment:"middle",isEllipsis:false,isVisible:true}},formatters:{sourceArrowMarker:{"default":"Arrows.SlashStart",condition:"Arrows.DiamondStart"},sourceCardinality:{"1..1":"1","1..n":"1","n..1":"n","n..m":"n"},targetCardinality:{"1..1":"1","1..n":"n","n..1":"1","n..m":"m"},joinTypeImage:{left:"images/leftJoin_b.png",right:"images/rightJoin_b.png",inner:"images/innerJoin_b.png",outer:"images/outerJoin_b.png",text:"images/text.gif"}},decorators:[{id:"errorMarker",shapeTemplate:[{shape:"Callout",x:0,y:0,width:24,height:20,isVisible:"{object/showWarning}",fill:"#FFFFDC",stroke:"#D3B21D",strokeWidth:1,arrowLength:6,arrowBaseOffset:3,arrowOffset:-2},{shape:"Text",isVisible:"{object/showWarning}",x:0,y:0,width:24,height:15,text:"{object/errorOrWarnings}",font:"Bold 10px Arial",horizontalAlignment:"center",verticalAlignment:"middle"}],events:{pointerdown:function(oEvent,oSymbol,oExtension){console.log("The join symbol has "+oSymbol.object.errorOrWarnings+" error(s) or warning(s).")}}}]}}}}}};oResource=new sap.galilei.model.Resource();oReader=new sap.galilei.model.JSONReader();oReader.load(oResource,oDiagramDef)}());
(function(){sap.modeling.dbSchema.ui.DiagramEditorExtension=sap.galilei.ui.editor.defineDiagramEditorExtension({fullClassName:"sap.modeling.dbSchema.ui.DiagramEditorExtension",properties:{TABLE_SYMBOL:"sap.modeling.dbSchema.ui.TableSymbol",COLUMN_SYMBOL:"sap.modeling.dbSchema.ui.ColumnSymbol",JOIN_SYMBOL:"sap.modeling.dbSchema.ui.JoinSymbol",TABLE_OBJECT:"sap.modeling.dbSchema.Table",COLUMN_OBJECT:"sap.modeling.dbSchema.Column",JOIN_OBJECT:"sap.modeling.dbSchema.Join",COLUMNS_REFERENCE:"columns",TABLE_OBJECT_PARAM:undefined,COLUMN_OBJECT_PARAM:undefined,JOIN_OBJECT_PARAM:undefined,ADD_COLUMN_COMMAND:"sap.modeling.dbSchema.command.AddColumn",ADD_COLUMN_ABOVE_COMMAND:"sap.modeling.dbSchema.command.AddColumnAbove",ADD_COLUMN_BELOW_COMMAND:"sap.modeling.dbSchema.command.AddColumnBelow",MOVE_COLUMN_UP_COMMAND:"sap.modeling.dbSchema.command.MoveColumnUp",MOVE_COLUMN_DOWN_COMMAND:"sap.modeling.dbSchema.command.MoveColumnDown"},methods:{onInitialize:function(){this.addLinearGradient("tableFill","#99BAE1","#D0E0F1");this.editor.showConnectedSymbols=true},addLinearGradient:function(sGradientId,sStartColor,sStopColor){var oGradient=new sap.galilei.ui.common.style.LinearGradient({id:sGradientId,stops:[{offset:"5%",color:sStartColor},{offset:"85%",color:sStopColor}]});oGradient.createGradient(this.viewer)},selectLinkSymbolDefinition:function(oSourceSymbol,oTargetSymbol){var oTool=sap.galilei.ui.editor.tool.getTool(this.JOIN_SYMBOL);if(oTool&&oTool.selectLinkSymbolDefinition){return oTool.selectLinkSymbolDefinition(oSourceSymbol,oTargetSymbol)}return{linkSymbolClass:this.JOIN_SYMBOL}},getContextButtonPad:function(oSymbol){var aButtons=[];if(oSymbol){switch(oSymbol.classDefinition.qualifiedName){case this.TABLE_SYMBOL:aButtons.push({toolName:this.TABLE_SYMBOL});aButtons.push({commandName:this.ADD_COLUMN_COMMAND});break;case this.COLUMN_SYMBOL:aButtons.push({commandName:this.ADD_COLUMN_ABOVE_COMMAND});aButtons.push({commandName:this.ADD_COLUMN_BELOW_COMMAND});aButtons.push({commandName:this.MOVE_COLUMN_UP_COMMAND});aButtons.push({commandName:this.MOVE_COLUMN_DOWN_COMMAND});aButtons.push({toolName:this.JOIN_SYMBOL});break}}this.addImagesFolder(aButtons);return aButtons},getToolsDefinition:function(){var self=this,oToolsDef;oToolsDef=[{name:this.TABLE_SYMBOL,type:sap.galilei.ui.editor.tool.Types.createNodeSymbolTool,tooltip:"Create Table",symbolClass:this.TABLE_SYMBOL,objectParam:this.TABLE_OBJECT_PARAM,smallIcon:"Table16.png"},{name:this.JOIN_SYMBOL,type:sap.galilei.ui.editor.tool.Types.createLinkSymbolTool,tooltip:"Create Join between Columns",smallIcon:"Join16.png",cursor:"JoinCursor.png",linksDefinition:[{sourceSymbol:this.COLUMN_SYMBOL,targetSymbol:this.COLUMN_SYMBOL,linkSymbolClass:this.JOIN_SYMBOL,linkObjectParam:this.JOIN_OBJECT_PARAM}]}];this.addImagesFolder(oToolsDef);return oToolsDef},getCommandsDefinition:function(){var self=this,oCommandsDef;oCommandsDef=[{name:this.ADD_COLUMN_COMMAND,className:"sap.galilei.ui.editor.command.InsertRow",tooltip:"Add a Column",tableClassName:this.TABLE_OBJECT,rowClassName:this.COLUMN_OBJECT,rowsReferenceName:this.COLUMNS_REFERENCE,index:-1,smallIcon:"AddRow16.png"},{name:this.ADD_COLUMN_ABOVE_COMMAND,className:"sap.galilei.ui.editor.command.InsertRow",tooltip:"Add a Column Above",tableClassName:this.TABLE_OBJECT,rowClassName:this.COLUMN_OBJECT,rowsReferenceName:this.COLUMNS_REFERENCE,smallIcon:"InsertRow16.png"},{name:this.ADD_COLUMN_BELOW_COMMAND,className:"sap.galilei.ui.editor.command.InsertRow",tooltip:"Add a Column Below",tableClassName:this.TABLE_OBJECT,rowClassName:this.COLUMN_OBJECT,rowsReferenceName:this.COLUMNS_REFERENCE,isBelow:true,smallIcon:"AddRow16.png"},{name:this.MOVE_COLUMN_UP_COMMAND,className:"sap.galilei.ui.editor.command.MoveRow",tooltip:"Move Column Up",rowClassName:this.COLUMN_OBJECT,rowsReferenceName:this.COLUMNS_REFERENCE,direction:"up",smallIcon:"MoveRowUp16.png"},{name:this.MOVE_COLUMN_DOWN_COMMAND,className:"sap.galilei.ui.editor.command.MoveRow",tooltip:"Move Column Down",rowClassName:this.COLUMN_OBJECT,rowsReferenceName:this.COLUMNS_REFERENCE,direction:"down",smallIcon:"MoveRowDown16.png"}];this.addImagesFolder(oCommandsDef);return oCommandsDef},toggleExpanded:function(oSymbol){if(oSymbol){oSymbol.toggleExpanded(this.viewer,this.transitionDefinition)}},canSupportInPlaceEditing:function(oSymbol,aClientPoint){return true},canInsertSymbolOnLinkSymbol:function(sSymbolClass,oCreateParam){return false}}})}());
