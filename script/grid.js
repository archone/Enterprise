(function($){
var Grid = function(tb, opts){
	$tb = $(tb);
	this.element = tb;this.opts = opts;
	//获取列
	this.columnDefines = new ColumnDefines($tb,this);
	this.rowDefines = new RowDefines($tb,this);
}
var __table = document.createElement("table");
var __tbody = document.createElement("tbody");
var __tr = document.createElement("tr");
var __td = document.createElement("td");
//列定义集合
var ColumnDefines = function($tb,grid){
	var tr = $("thead>tr.grid-columns", $tb)[0];
	this.element = tr;this.grid = grid;	
	for(var cells =tr.cells, i=0,j=cells.length;i<j;i++)this.add(new ColumnDefine(this,cells[i]));
}//--/ColumnDefines
ColumnDefines.prototype = new ArrayObject("ColumnDefine");

//列定义
var ColumnDefine = function(colDefs,defCell){
	var $el = $(colDefs);
	this.element = defCell;this.columnDefines = colDefs ;this.grid = colDefs.grid;this.name = $el.data("grid-column");
}

//行定义集合
var RowDefines = function($tb, grid){
	this.grid = grid;
	var templateRows = $("tr.grid-template",$tb);
	for(var i=0,j=templateRows.length;i<j;i++)this.add(new RowDefine(this,templateRows[i]));
	
}//--/RowDefines
RowDefines.prototype = new ArrayObject("RowDefine");

var RowDefine = function(rowDefs,defRow){
	var grid = this.grid = rowDefs.grid;this.rowDefines = rowDefs;this.element = defRow;
	var colDefs = grid.columnDefines;
	for(var cells = defRow.cells,i=0,j=cells.length;i<j;i++)this.add(new CellDefine(this,colDefs[i],cells[i]));
	this.cell = this.item;
	this.createRow = function(data){return new Row(this,data);}
}//--RowDefine
RowDefine.prototype = new ArrayObject("CellDefine");
//单元格定义
var CellDefine = function(rowDef,colDef,defCell){
	this.element = defCell;this.rowDefine = rowDef;this.columnDefine = colDef;
	this.createCell = function(model){
		$(__tr).html("").append(defCell);
		var html = $(__tr).html();
		this.createCell = function(model){
			var cell = $(html);
			this.bind(cell, model);
			return new Cell(this,cell);
		}
		return this.createCell(model);
	}//--/createCell
	
	this.bind = function(cell,model){
		
	}
	var attachBinders = function(elem,code){
		var $el = $(elem);
		var bindExpr = $el.data("grid-bind");
		if(bindExpr){this.add(new BinderBuilder(this,code,expr));}
		
		var children = elem.childNodes;
		for(var i=0,j=children.length;i<j;i++){
			var child = children[i];if(!child.tagName)continue;
			var subcode = code +".childNodes["+i+"]";
			attachBinders.call(this,child,subcode);
		}
	}
	attachBinders.call(this,defCell,"");
}
CellDefine.prototype = new ArrayObject("Binder");
var Rows = function(){}
var Columns = function(){}
var Row = function(rowDef,data){
	this.rowDefine = rowDef;
	var model = this.model = $M(data || {});
	for(var i=0,j=rowDef.length;i<j;i++)this.add(rowDef[i].createCell(model));
	this.cell = this.item;
}
Row.prototype = new ArrayObject("Cell");

var Cell = function(cellDef,elem){
	this.element = elem;this.cellDefine = cellDef;
}

var BinderBuilder = function(cellDef,route,expr){	
	this.cellDefine = cellDef;this.route = route; this.fields = fields; this.expr = expr;
	var self = this;
	this.cellBinder = cellBinder;
	this.getTarget = function(dataCell){
		if(route) {
			this.getTarget = new Function("dataCell","return dataCell" + route);
		}else this.getTarget = function(dataCell){return dataCell;}
		return this.getTarget(dataCell);
	}
	
	this.getBinder = function(elem,prop){
		var elem = this.getTarget(cellDef);
		var tagName = elem.tagName;
		if(tagName==='TEXTAREA') this.getBinder = function(elem,prop){return new TextBinder(elem,prop);}
		else if(tagName ==="SELECT") this.getBinder = function(elem,prop){return new SelectBinder(elem,prop);}
		else if(tagName==='INPUT'){
			var type = elem.type;
			if(type==='checkbox' || type==='radio') this.getBinder = function(elem,prop){return new CheckBinder(elem,prop);}
			else this.getBinder = function(elem,prop){return new ValueBinder(elem,prop);}
		}else this.getBinder = function(elem,prop){return new HtmlBinder(elem,prop);}
		return this.getBinder(elem,prop);
	}
	
	this.bind = function(dataCell,model,$param){
		var elem = this.getTarget(dataCell);
		var binder = this.getBinder();
		//binder
		for(var i=0,j=fields.length;i<j;i++){
			var field = fields[i];
			var prop = model[$M].getProp(field,true);
			prop.change(function(val){
				
			});
		}
	}
}



var ValueBinder = function(elem,props){
	this.setValue = function(value) { elem.value = value; return this; }
    this.getValue = function() { return elem.value; }
	$(elem).bind("blur", function() {props.__set(elem.value);});
	this.setValue(props.getValue());
}
var SelectBinder = function(elem,props){
	this.setValue = function(value) {
        var opts = elem.options;
        for (var i = 0, j = opts.length; i < j; i++) {
			var opt = opts[i];
            if (opt.value == value) opt.selected = "selected";
            else {
                opt.selected = false;
                opt.removeAttribute("selected");
            }
        }
    }
    this.getValue = function() {
        return elem.options.length ? elem.options[elem.selectedIndex].value : undefined;
    }
	var valuechange = function() { props.__set(elem.options.length ? elem.options[elem.selectedIndex].value : undefined); };
    $(elem).bind("blur", valuechange);
	$(elem).bind("change", valuechange);
	this.setValue(props.getValue());
}
var CheckBinder = function(elem,props){
	this.setValue = function(value) {
		if (value == elem.value) {elem.checked = true;elem.setAttribute("checked", "checked");}
        else {
            elem.checked = false;
            elem.removeAttribute("checked");
        }
    }
    this.getValue = function() { return elem.checked ? elem.value : undefined; }
	var valuechange = function(){prop.__set(elem.checked ? elem.value : undefined); }
	$(elem).bind("blur", valuechange).bind('check',valuechange);
	this.setValue(props.getValue());
}

var HtmlBinder = function(elem,props){
	this.setValue = function(value) { return elem.innerHTML = value; }
    this.getValue = function() { return elem.innerHTML; }
	this.setValue(props.getValue());
}


$.fn.grid = function(opts){
	opts || (opts ={});
	this.each(function(){new Grid(this,opts);});
}

})($);