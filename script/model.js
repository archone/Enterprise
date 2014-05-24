(function(window,document,undefined){

var NULL = window.NULL = {};

var PK = "__YIY__internal_field)_^%%!~@\":><";

var fnCluster = function(){
	var funcs = [];
	var cluster = function(){
		var returnValue;
		for(var i=0,j=funcs.length;i<j;i++)
			if((returnValue = funcs[i].apply(this,arguments))===false) return false;
		return returnValue;
	}
	cluster.add = function(fn){
		funcs.push(fn);return this;
	},
	cluster.remove = function(fn){
		for(var i=0,j=funcs.length;i<j;i++)
			if((f=funcs.shift())!=fn) funcs.push(f);
		return this;
	},
	cluster.each = function(h){
		for(var i=0,j=funcs.length;i<j;i++)
			if(h.call(this,funcs,i)===false)return this;
		return this;
	},
	cluster.count = function(){return funcs.length;},
	cluster.clear = function(){funcs = [];}
	return cluster;
}
var FUNCS ="__fnCluster_"+PK;



if(!Object.defineProperty) Object.defineProperty = function(obj,name,defs){obj[name]=defs.value;}	
var __readonly__ = function(obj,name,value){Object.defineProperty(obj,name,{value: value, writable: false, enumerable: true, configurable: false });}
var __private__ = function(obj,name,value){Object.defineProperty(obj,name,{value: value, writable: false, enumerable: false, configurable: false });}
var __protected__ = function(obj,name,value){Object.defineProperty(obj,name,{value: value, writable: true, enumerable: false, configurable: true });}
var __override__ = function(obj,name,value){Object.defineProperty(obj,name,{value: value, writable: false, enumerable: true, configurable: true });}

var isArray = function(obj){return obj && obj.length!==undefined && obj.push && obj.pop && obj.shift && obj.unshift; }

var Property = function(model,name,target,intialValue){
	var onMChange=model[HANDLER].change[FUNCS],self =this;
	var accessor = function(val){
		if(val===undefined) return target[name];
		return setValue(val);
	}
	var getValue = function(){ return target[name];}
	var __set = function(value){target[name]  = value;return accessor;}
	var setValue =function(value){
		var oldValue = target[name];
		var newValue  =(value === $M)?undefined:value;
		if(oldValue===newValue) return accessor;
		target[name] = newValue;
		onChange.call(accessor,newValue,oldValue);
		onMChange.call(model,name,newValue,oldValue);
		return accessor;
	}
	
	accessor.toString = function(){ var val; (val= target[name])?val.toString():(val===null||val===undefined?"":val.toString());}
	var onChange=fnCluster();
	var change = function(func,remove){
		if(func===null) {
			if(remove)onChange.remove(remove);
			else onChange.clear();
			return accessor;
		}
		onChange.add(func);
		return accessor;
	} 
	change[FUNCS]=onChange;
	accessor[HANDLER] = this;
	__readonly__(model,name,accessor);
	__readonly__(this,"name",accessor.name = name);
	__readonly__(this,"getValue",accessor.getValue = getValue);
	__readonly__(this,"setValue",accessor.setValue = setValue);
	__readonly__(this,"__set",accessor.__set = __set);
	__readonly__(this,"change",accessor.change = change);
	__readonly__(this,"accessor",accessor);
	__readonly__(this,"model",model);
	accessor.val = accessor;
	
	var onItemChange=fnCluster();
	var itemchange = function(func,remove){
		if(func===null) {
			if(remove)onItemChange.remove(remove);
			else onItemChange.clear();
			return accessor;
		}
		onItemChange.add(func);
		return accessor;
	}
	itemchange[FUNCS]=onItemChange;
	
	var push = function(item){
		var arr = target[name];
		if(arr&& arr.push){
			arr.push(item);
			onItemChange.call(accessor,"push",item);
		}
		return accessor;
	}
	var pop = function(){
		var arr = target[name],item;
		if(arr&& arr.pop){
			item = arr.push(item);
			onItemChange.call(accessor,"pop",item);
		}
		return accessor;
	}
	var shift = function(){
		var arr = target[name],item;
		if(arr&& arr.shift){
			item = arr.shift(item);
			onItemChange.call(accessor,"shift",item);
		}
		return accessor;
	}
	var unshift = function(item){
		var arr = target[name];
		if(arr&& arr.unshift){
			item = arr.unshift(item);
			onItemChange.call(accessor,"unshift",item);
		}
		return accessor;
	}
	var item = function(i,_item){
		var arr = target[name],item;
		if(arr){
			if(_item===undefined){return arr[i];}
			_item = arr[i] = _item===$M?undefined:_item;
			onItemChange.call(accessor,"set",_item,i);
		}
		return accessor;
	}
	var count = function(){
		var arr = target[name];
		if(arr) return arr.length;
	}
	var clear = function(){
		var arr = target[name];
		if(arr){
			onItemChange.call(accessor,"clear",arr,i);
			arr.length = 0;
		}
	}
	__readonly__(this,"count",accessor.count = count);
	__readonly__(this,"item",accessor.item = item);
	__readonly__(this,"pop",accessor.pop = pop);
	__readonly__(this,"push",accessor.push = push);
	__readonly__(this,"shift",accessor.shift = shift);
	__readonly__(this,"unshift",accessor.unshift = unshift);
	__readonly__(this,"clear",accessor.clear = clear);
	__readonly__(this,"itemchange",accessor.itemchange = itemchange);
	__readonly__(this,"isArray",accessor.isArray = function(){return isArray(target[name]);});
	
	
	var update = function(obj){
		var type = typeof(intialValue = (intialValue || obj));
		if(type=="object"){
			if(isArray(intialValue)){
				update = function(arr){
					var old = target[name];
					onItemChange.call(accessor,"update",arr,target[name]);
					if(!old)old = arr;else for(var i=0,j=arr.length;i<j;i++) old[i]=arr[i];
					return accessor;
					
				}
			}else if(Object.prototype.toString.call(intialValue)==="[object RegExp]"){
				update = setValue;
			}else{
				update = function(obj){
					var old = target[name];
					if(!old) old = target[name]={};
					$M(obj)[$M].update(obj);
				}
			}
		}else update = setValue;
		__override__(self,"update",accessor.update= upate);
		return update(obj);
	}
	__override__(this,"update",accessor.update = update);
	
}
var MODEL = "__model_" + PK;
var HANDLER= "__handler__" + PK;
var Model = function(target){
	var handler = {},self= this;
	var getValue = function(name){return target[name];}
	var setValue = function(name, value){
		var prop = props[name];
		if(prop) return prop.setValue(value);
		props[name]= new Property(self,name,target);
		target[name] = value;
		onChange.call(self,name,value,undefined,true);
		return self;
	}
	var __set = function(name,value){target[name] = value;return self;}
	var __get = function(name,getter){
		if(getter===undefined) return target[name];
		props[name]= new Property(self,name,target,getter);
		return getter.call(self);
	}

	var getProp = function(name,retAny){
		var prop = props[name];
		if(prop) return prop;
		if(retAny!==undefined){
			return props[name] = new Property(self,name,target,retAny);
		}
		
	}
	var each = function(cb){
		for(var n in props) if(cb.call(self,props[n])===false)break;
		return self;
	}
	var onChange=fnCluster();
	var change =  function(name,func,remove){
		if(typeof name =="string"){
			getProp(name,true).change(func,remove);return self;
		}
		remove = func;func = name;
		if(func===null) {
			if(remove)onChange.remove(remove);
			else onChange.clear();
			return self;
		}
		onChange.add(func);
		return self;
	} 
	var update = function(obj){
		for(var n in props) if(props[n].update(obj[n]))break;
		return self;
	}
	
	var expr = function(exprstr){
		var match;
		if(match = exprstr.match(propRegx)) 
			return handler.getProp(match[0],true).accessor;
		if(match = exprstr.match(propsRegx)) 
			return (new Expression(self,exprstr,match[0].split(','),null)).accessor;
		if(match = exprstr.match(lamdaRegx)) return (new Expression(self,exprstr,match[1].split(','),match[2])).accessor;
	}
	
	change[FUNCS]=onChange;

	__readonly__(handler,"change",change);
	__readonly__(handler,"getValue",getValue);
	__readonly__(handler,"setValue",setValue);
	__readonly__(handler,"__set",__set);
	__readonly__(handler,"getProp",getProp);
	__readonly__(handler,"update",update);
	__readonly__(handler,"expr",expr);
	__readonly__(handler,"each",each);
	__readonly__(handler,"actual",target);
	__readonly__(handler,"model",self);
	__private__(self,HANDLER,handler);
	__private__(target,MODEL,self);
	
	var props={};
	for(var n in target){props[n] = new Property(self,n,target,target[n]);}
	
	this.toString =handler.toString = function(){
		var ps =[];
		for(var n in props){
			ps.push(n + ":" + target[n].toString());
		}
		var s = "[object Model{"+ps.join(",")+"}]";
		return s;
	}
}

var propRegx = /^[_a-zA-Z][_a-zA-Z0-9]*$/;
var propsRegx = /^(?:[_a-zA-Z][_a-zA-Z0-9]*)(?:,[_a-zA-Z][_a-zA-Z0-9]*)*$/g;
var getterRegx = /^([_a-zA-Z][_a-zA-Z0-9]*)=>(.*)$/;
var lamdaRegx= /^\(((?:[_a-zA-Z][_a-zA-Z0-9]*)(?:,[_a-zA-Z][_a-zA-Z0-9]*)*)?\)=>(.*)$/;

var WRAPPER = "__WRAPPER_" + PK;
var Expression = function(model,name,fields,expr){
	var accessor = function(value){
		if(value===undefined) return getValue();
		return setValue(value);
	}
	
	var props = [], mh = model[$M];
	for(var i=0,j=fields.length;i<j;i++)props.push(mh.getProp(fields[i],true));
	
	var setValue = function(value){for(var i=0,j=props.length;i<j;i++)props[i].setValue(value);return accessor;}
	var getValue;
	if(expr){
		var code = "with(_$_yiy_model__){ return " + expr + ";}";
		var getter  = new Function("_$_yiy_model__","_$",code);
		getValue = function($){return getter(model,$);}
	}else {getValue = props[0].getValue;}
	var __set = function(value){for(var i=0,j=props.length;i<j;i++)props[i].__set(value);return this;}
	var change;
	if(expr){
		change = function(fn,remove){
			if(fn===null){
				for(var i=0,j=props.length;i<j;i++) props[i].change(null,remove[WRAPPER]);
				return accessor;
			}
			var wrapper = function(value){fn.call(this,getValue());};
			fn[WRAPPER] = wrapper;
			for(var i=0,j=props.length;i<j;i++) props[i].change(wrapper,remove);
			return accessor;
		}
	}else{
		change = function(fn,remove){for(var i=0,j=props.length;i<j;i++) props[i].change(fn,remove);}
	}
	
	accessor[HANDLER] = this;
	__readonly__(this,"name",name);
	__readonly__(this,"getValue",getValue);
	__readonly__(this,"setValue",setValue);
	__readonly__(this,"__set",__set);
	__readonly__(this,"change",change);
	__readonly__(this,"accessor",accessor);
	__readonly__(this,"model",model);
	
}



window.$M = $M = function(target){
	return typeof(target)==='object'?(target[MODEL] || (new Model(target))):null;
}
$M.fn = Model.prototype = {};
$M.fnCluster = fnCluster;
$M.__private__ = __private__;
$M.toString = function(){return HANDLER;}




})(window,document);