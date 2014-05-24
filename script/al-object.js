var ArrayObject = function(){
	var count = 0, named = {};
	this.add = function(item,at){
		if(item && item.name) named[item.name] = item;
		if(at===undefined || at==count){
			this[count++] = item;
			return this;
		}
		var nextItem = this[at]; this[at] = item;
		while(++at<count){
			var t = this[at];this[at] = nextItem;nextItem = t;
		}
		this[at] = nextItem;
		this.length = ++count;
		return this;
	}
	this.remove = function(item){
		var at=0;
		for(var i=0;i<count;i++){
			var c = this[i];
			if(c!=item)this[at++] = c;
		}
		for(var i=at;i<count;i++) delete this[i];
		this.length = count = at;
		return this;
	}
	this.removeAt = function(at){
		for(var i=at;i<count;i++)this[i]= this[i+1];
		delete this[(this.length=--count)];
		return this;
	}
	this.count = function(){return count;}
	this.indexOf = function(item){
		for(var i=0;i<count;i++)if(item===this[i])return i;
		return -1;
	}
	this.item = function(index,value){
		if(value==undefined){
			if(typeof(index)==='string') return named[index];
			return this[index];
		}
		if(typeof(index)==='string') {
			var item;
			for(var i=0;i<count;i++)if((item=this[i]) && item.name==index){index=i;break;}
		}
		this[index] = value;
		return this;
	}
}
/*
var list = new Collection();
list.add("a").add("b").add("d").add("e").add("f");
list.add('c',2);
list.add("-",0);
list.add("c",5);
list.remove('c');
list.removeAt(2);
*/