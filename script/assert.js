(function(){
var attach = function(oElement, sEvent,fnHandler){
	oElement.addEventListener ? oElement.addEventListener(sEvent, fnHandler, false) : oElement.attachEvent("on" + sEvent, fnHandler);
}
var detech = function (oElement, sEvent, fnHandler) {
	oElement.removeEventListener ? oElement.removeEventListener(sEvent, fnHandler, false) : oElement.detachEvent("on" + sEvent, fnHandler);
}
var Console = function(bg){
	var elem = document.createElement("div");
	elem.style.cssText = "position:fixed;background-color:"+(bg|| "#333333")+";color:white;border:1px solid black;width:400px;height:300px;z-index:9999;bottom:0;right:0;overflow:auto;padding:5px;font-size:12px;";
	var color = "#eeeeee";
	this.color = function(c) {color = c;return this;}
	var strong = false;
	this.strong = function(c){strong = c!==false;return this;}
	var valText = function(text){
		if(text===undefined) return "<i>undefined</i>";
		else if (text ===null) return "<i>null</i>";
		return "<strong>" + text.toString().replace(/</g,"&lt;") + "</strong>";
	}
	var prefix=0;
	this.tab = function(back){
		if(back===false) prefix--;
		else if(back===null) prefix=0;
		else prefix++;
		return this;
	}
	this.write = function(text){
		var line = document.createElement("div");
		line.style.marginLeft = prefix*24 + "px";
		if(color)line.style.color = color;
		if(strong) line.style.fontWeight="bold";
		if(text===null|| text === undefined) {
			line.innerHTML = valText(text);
			elem.appendChild(line);elem.scollTop = elem.offsetHeight;
			return this;
		}
		text = text.replace(/</g,"&lt;").replace(/\n/g,"<br />");
		for(var i=1,j=arguments.length;i<j;i++){
			text = text.replace(new RegExp("\\{" + i + "\}"),valText(arguments[i]));
		}
		line.innerHTML = text;
		elem.appendChild(line);elem.scrollTop = elem.offsetHeight;
		return this;
	}
	this.error = function(){
		color = "red";return this.write.apply(this,arguments);
	}
	this.success = function(){color="green";return this.write.apply(this,arguments);}
	this.warming = function(){color="orange";return this.write.apply(this,arguments);}
	this.notice = function(){color="blue";return this.write.apply(this,arguments);}
	this.text = function(){color="white";return this.write.apply(this,arguments);}
	var isVisible;
	this.show = function(isFull){
		if(isFull) elem.style.width = elem.style.height = "100%";
		if(document.body) document.body.appendChild(elem);
		else isVisible = true;
	}
	this.hide = function(){if(elem.parentNode)elem.parentNode.removeChild(elem);}
	this.toggle = function(){
		if(elem.parentNode) this.hide();else this.show();
	}
	var self = this;
	var ready = function(){
		if(isVisible) self.show();
		detech(window,"load",ready);
	}
	attach(window,"load",ready);
	this.fullscreen = function(){
		elem.style.width = elem.style.height = "100%";
	}
}
assert = new Console();
attach(window,'keyup',function(e){
	var evt =e || event;
	if(evt.altKey && evt.ctrlKey && evt.keyCode===191){
		assert.toggle();
	}
});

var toggleConsole = function(){
	
}
assert.operation = function(fn){
	if(typeof(fn)==='function'){
		fn();
		str = fn.toString();
		var b = str.indexOf("{");
		if(b){
			e = str.lastIndexOf("}");
			text = str.substring(b+1,e-1);
			return this.strong().text(text).strong(false);
		}
	}
	return this.strong().text.apply(this,arguments).strong(false);
}
assert.text = function(){
	return this.color("white").write.apply(this,arguments);
}

assert.eq = function(expected,actual,message){
	if(expected!=actual) return this.error("{3}[eq (expected:{1},actual:{2})]",expected,actual,message||"");
	return this.success(message);
}
assert.EQ = function(expected,actual,message){
	if(expected!==actual) return this.error("{3}[EQ (expected:{1},actual:{2})]",expected,actual,message||"");
	return this.success(message);
}
assert.neq = function(expected,actual,message){
	if(expected==actual) return this.error("{3}[neq(expected:{1},actual:{2})]",expected,actual,message||"");
	return this.success(message);
}
assert.NEQ = function(expected,actual,message){
	if(expected==actual) return this.error("{3}[NEQ(expected:{1},actual:{2})]",expected,actual,message||"");
	return this.success(message);
}
assert.null = function(actual,message){
	if(null===actual) return this.error("{2}[null(actual:{1})]",actual,message||"");
	return this.success(message);
}
assert.undefined = function(actual,message){
	if(null===undefined) return this.error("{2}[undefined(actual:{1})]",actual,message);
	return this.success(message);
}
window.$A.fullscreen = function(){
	
}

window.$A = assert;

})();//---end package log/assert