(function($){
var Grid = function(tb, opts){
	$tb = $(tb);
	this.element = tb;this.opts = opts;
	//获取列
	this.columns = new Columns($tb,this);
}
var Columns = function($tb, grid){
	var tr = $("thead>tr.grid-columns", $tb)[0];
	var cells = tr.cells,head,tail,count =  cells.length,named = {};
	this.element = tr;this.grid = grid;this.length = count;
	this.item = function(index){
		if(typeof(index)==='string') return named[index];
		var column = head;while(column && index--){column = column.next;}return column;
	}
	this.count = function(){return count;}
	
	for(var i=0,j=cells.length;i<j;i++){
		var column = new Column(cells[i],this,grid);
		named[column.name] = column;
		//创建链
		if(!tail){head = tail = column;}
		else{tail.next = column;column.prev = tail;tail = column;}
	}
	
}

var Column = function(th , cols ,grid){
	var $el = $(th);
	this.element = th;this.columns = cols ;this.grid = grid;this.name = $el.data("grid-column");
}
//模板行集合
var Templates = function(tb ,grid){
	var templateRows = $("tr.grid-template",tb);
	var named = {},count = templateRows.length;
	this.length = count;this.grid = grid;
	for(var i=0,j=templateRows.length;i<j;i++){
		var tpl = new Template(templateRows[i],this,grid);
		this[i] = named[tpl.name] = tpl;
	}
	this.item = function(name){return named[name];}
	this.count = function(){return count;}
}//-- class Templates
//模板行
var Template = function(tr,tpls , grid){
	var cells = tr.cells,count = cells.length,$elem = $(tr);
	this.name = $elem.data('grid-template');this.element = tr;this.templates = tpls;this.grid = grid;this.length = count;
	var fields = {};
	this.__addBinder = function(binder){
		var field = binder.field;if (!field)return this;
		if(binder.readonly && fields[field]){
			
		}
		var exists = fields[field];
		fields[binder.field] = binder;
	}
	for(var i=0,j=cells.length;i<j;i++){this[i] = new CellBinder(cells[i],this,grid);}
	
	//从模板中创建一列
	this.createRow = function(data){
		var html = "<tr class='grid-data-row'>" + tr.innerHTML + "</tr>";
		var changeLogField = "__yiy_{{(_)*&&\"`2";
		this.createRow = function(data){
			var tr = $(html)[0],cells = tr.cells;
			for(var i=0,j=count;i<j;i++)cellBinder.bind(cells[i],data);
			$(tr).blur(function(){
				if(data[changeLogField] && grid.opts.datachange){
					data[changeLogField] = false;
					grid.opts.datachange(data); 
				}
			});
			tr.__grid_template = this;
			tr.__grid_bind = function(data){
				for(var i=0,j=count;i<j;i++)cellBinder.bind(cells[i],data);
				tr.__grid_data = data;
			}
			return tr;
		}
		return this.createRow(data);
	}
	
	var createRowBinder = function(){}
}

var RowBinder = function(tpl,row){
	this.template = tpl;
	this.element = row;
	//重置数据，或获取数据访问对象
	this.model = function(data){
		
	}
}
var SETDATA="_(rqe7234\":{|}/`\":{{";
var INTERNALDATA= "~!@^%%(#@@\":{}";
var Model = function(){
	var props = {};
	this.__getProp = function(name){
		var prop = props[name];
		if(!prop) prop = props[name] = createProperty(this,name);
		return prop;
	}
	var data =this[INTERNALDATA]= {};
	this[SETDATA] = function(data){
		data = data || {};
		for(var n in props) props[n].setValue(data[n]);
		return this;
	}
	this.__each = function(cb){
		for(var n in props) if(cb.call(this,props[n],n)===false)return this;
		return this;
	}
}
var createProperty = function(model, name){
	this.name = name;
	var prop = function(val){
		if(val===undefined) return model[INTERNALDATA][name]; 
		return setValue(val);
	}
	var onChange;
	var getValue = prop.getValue = function(){
		return model[INTERNALDATA][name];
	}
	var setValue = prop.setValue = function(value){
		var old = model[INTERNALDATA][name];
		if(old===value) return prop;
		model[INTERNALDATA][name] = value;
		onChange.call(prop,value,old);
		return prop;
	}
}

var RowBinder1 = function(data,dataRow,tpl,grid){
	this.element = dataRow;
	this.setValue = function(name, val){
		
	}
	this.getValue = function(name){
	}
}
//模板单元格的绑定器
var CellBinderMaker = function(tplTd,tpl,grid) {
	this.element = tplTd;this.template =tpl;this.grid = grid;
	var paths =[],count =0;
	var attachBinders = function(elem,code){
		var $el = $(elem);
		var bindValue = $el.data("grid-bind"),expr = $el.data("grid-bind-expr");bindFields;
		if(bindValue) {this[count++] = new Binder(this,code,[bindValue],expr?expr:bindValue + "()");}
		else if(bindFields = $el.data('grid-bind-fields')){
			var fields = bindFields.split(",");
			this[count++] = new Binder(this,code,fields,expr);
		}
		var children = elem.childNodes;
		for(var i=0,j=children.length;i<j;i++){
			var child = children[i];if(!child.tagName)continue;
			var subcode = code +".childNodes["+i+"]";
			attachBinders.call(this,child,subcode);
		}
	}
	attachBinders.call(this,tplTd,"");
	this.bind = function(dataCell,rowModel){for(var i=0;i<count;i++){this[i].bind(dataCell,rowModel);}};
}

var Binder = function(cellBinder,route,fields,expr){	
	var self = this;
	this.cellBinder = cellBinder;
	this.getTarget = function(dataCell){
		if(route) {
			this.getTarget = new Function("dataCell","return dataCell" + route);
		}else this.getTarget = function(dataCell){return dataCell;}
		return this.getTarget(dataCell);
	}
	
	this.getValue = function(){};
	var bindToProp = function(prop,elem){
		
	}
	
	var displayValue = function(__$_YIY_model,$param){
		var code = "with(__$_YIY_model,$param){ return " + expr + ";}";
		displayValue = new Function("__$_YIY_model","$param",code);
		return displayValue(__$_YIY_model,$param);
	}
	this.bind = function(dataCell,rowModel,$param){
		var elem = this.getTarget(dataCell);
		for(var i=0,j=fields.length;i<j;i++){
			var field = fields[i];
			var prop = rowModel.getProp(field);
			prop.change(function(val){
				
			});
		}
	}
	
}

$.fn.grid = function(opts){
	opts || (opts ={});
	this.each(function(){new Grid(this,opts);});
}
var model = {id:12};
with(model){
	alert(id);
}
})($);