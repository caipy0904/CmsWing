var
VERSION = "1.0",
CONFIG = {//系统配置
//	ctx:"http://192.168.0.17:8080/basepro/service/entrance/",
	ctx:"http://192.168.1.134:8080/basepro/service/entrance/",
	DOWN_IMG:"http://192.168.1.134:8080/basepro/image/get/"
},
SID = {//请求SID
	"userprofile":"service/service_query_user_profile",
	"upload":"service/upload/save_user_images",
	"favourite":"service_update_post_favorite"
	
},
RETCODE = {//状态码
	"SUC":"000"
},

clover = {
	page : function(funArr){
		for(var i=0;i<funArr.length;i++){
			funArr[i].method();
		}	
		
	},
	
	lazyImg : function(dom){
		mui(dom).imageLazyload({
			placeholder: '../../resources/images/badge_bg.png.png'
		});
		
	},
	
	ajax:function(sid,param,successDB,errorDB){//ajax 请求
		var xhr = new plus.net.XMLHttpRequest();
		xhr.onreadystatechange = function () {
			if(xhr.readyState==4){
				if(xhr.status == 200){
					successDB(JSON.parse(xhr.responseText));
					if ( xhr ) {
						xhr.abort();
						xhr = null;
					}
					
				}else {
					errorDB(xhr);
					if ( xhr ) {
						xhr.abort();
						xhr = null;
					}
				}
			}
		}
		xhr.timeout = 10000;
		xhr.overrideMimeType( "text/plain; charset=utf-8" );
//		xhr.setRequestHeader('Content-Type','application/json');
		xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
		return {
			beforeSend : function(){
				
			},
			afterSend : function(){
				
			},
			post:function(){
				this.beforeSend();
				if(param==null){
					param = {"uid":"111"};
				}else{
					param = mui.extend(param,{"uid":"111"});
				}
				
				try{
					xhr.open("POST", CONFIG.ctx+sid);
					xhr.send(JSON.stringify(param));
				}catch(e){ 
					errorDB(e);
					if ( xhr ) {
						xhr.abort();
						xhr = null;
					}
				}
				
			},
			
			get:function(){
				
				this.beforeSend();
				
				if(param==null){
					param = {"uid":"111"};
				}else{
					param = mui.extend(param,{"uid":"111"});
				}
				
				try{
					xhr.open("get", CONFIG.ctx+sid);
					xhr.send(); 
				}catch(e){ 
					errorDB(e);
					if ( xhr ) {
						xhr.abort();
						xhr = null;
					}
				}
				
			}
			
			
		}
	},
	
	upload:function(uid,filepath,callback){
		var task = plus.uploader.createUpload( 
			CONFIG.ctx+SID.upload+"/"+uid ,
			{ method:"POST",blocksize:204800,priority:100,timeout:10},
			callback
		);
		
		task.addFile(filepath, {key:"file"} );
		task.start();
		return task;
	},
	
	loadImg : function(imageId){
		var uid = "";
		return CONFIG.DOWN_IMG+uid+'?imageId='+imageId+'&version=' + Math.random() * 1000;
	},
	
	cat : function(_in){//at解析
	
		var node = document.createElement("div");
		node.innerHTML = _in;
		
		return {
			getAts : function(_conf){
				
				var ats = node.querySelectorAll("span[data-type=at]");
				for(var i=0;i<ats.length;i++){
					ats[i].onclick = _conf.atClick;
					ats[i].classList.add(_conf.atClass);
				}
				
				return ats;
			},
			
			getSharps : function(_conf){
				
				var sharps = node.querySelectorAll("span[data-type=sharp]");
				
				for(var i=0;i<sharps.length;i++){
					sharps[i].onclick = _conf.sharpClick;
					sharps[i].classList.add(_conf.sharpClass);
				}
				
				return sharps;
			},
			
			getImgs : function(_conf){
				
				var images = node.querySelectorAll("span[data-type=img]");
				
				return images;
			},
			
			getVideos : function(_conf){
				
				var videos = node.querySelectorAll("span[data-type=video]");
				
				return videos;
			},
			
			getAudios : function(_conf){
				
				var audios = node.querySelectorAll("span[data-type=audio]");
				
				return audios;
			},
			
			dom : function (_conf){
				this.getAts(_conf);
				this.getSharps(_conf);
				return node.firstChild;
			},
			
			putElement : function (_frmdivId,_conf){
				var mDom = dom(_conf);
				document.querySelector("#"+_frmdivId).appendChild(mDom);
			}
			
		};
	},
	
	keyListener : function(_conf){//编辑器添加键盘事件
		var mInput = document.querySelector(_conf.selector);
		mInput.addEventListener("keyup",function(e){
	
			var range=document.getSelection().getRangeAt(0);  
			range.setStart(range.startContainer,range.startOffset-1);
	        range.setEnd(range.startContainer,range.endOffset);
			
			var inChar = range.toString();
			if(inChar=='@'){
				_conf.atEvent();
				
			}
			
			if(inChar=='#'){
				_conf.sharpEvent();
			}
			
		});
		
	},
	
	edit : function(){//编辑器
	
		var range=document.getSelection().getRangeAt(0);
		
		return  {
			
			createAt : function(_conf){
	
				var atDom = document.createElement("span");
				atDom.dataset.id = _conf.id;
				atDom.dataset.type = "at";
				atDom.classList.add(_conf.clsname);
				atDom.onclick = _conf.atEvent;
				atDom.innerText = _conf.nickname;
				
				range.setStart(range.startContainer,range.startOffset-1);
				range.setEnd(range.startContainer,range.endOffset);
				range.deleteContents();
				range.insertNode(atDom);
				return atDom;
			},
			
			createSharp : function(_conf){
	
				var sharpDom = document.createElement("span");
				sharpDom.dataset.id = _conf.id;
				sharpDom.dataset.type = "sharp";
				sharpDom.classList.add(_conf.clsname);
				sharpDom.onclick = _conf.atEvent;
				sharpDom.innerText = _conf.nickname;
				
				range.setStart(range.startContainer,range.startOffset-1);
				range.setEnd(range.startContainer,range.endOffset);
				range.deleteContents();
				range.insertNode(sharpDom);
				return sharpDom;
			},
			
			bold : function(){
				var toBoldStr = range.toString();
				var b = document.createElement("b");
				b.innerText = toBoldStr;
				range.deleteContents();
				range.insertNode(b);
			}
			
		};
	},
	
	template : function(url,key){//模版解析
		
		var div = document.createElement("div");
		if(url.indexOf(".hmb")>0){
			var temp = clover.getRespText(url).responseText;
			div.innerHTML = temp;
		}else{
			var fullHmb = document.createElement("div");
			var temp = localStorage.getItem("hmb_"+url);
			fullHmb.innerHTML = temp;
			div.innerHTML = fullHmb.querySelector(key);
		}
		
		return {
			get : function(){
				return div.firstChild;
			},
			
			dom : function(selector){
				return div.querySelector(selector);
			},
			
			val : function(iSelector,value){
				
				div.querySelector(iSelector).innerHTML = value;
				
				return this.get();
			},
			
			domVal : function(iSelector,attr,value){
				
				div.querySelector(iSelector).setAttribute(attr,value);
				
				return this.get();
			},
			
			bind : function(iSelector,eventType,func){
				div.querySelector(iSelector).addEventListener(eventType,func);
				
				return this.get();
			}
		};
	},
	
	pageFilter : function(pageKey,unitFunArr){//页面过滤--灰度升级
	
		var pageUnitArr = localStorage.getItem(pageKey);
		if(pageUnitArr!=null){//此页面有需要隐藏的单元
			var unShowArr = pageUnitArr.split(",");
			
			for(var i=0;i<unitFunArr.length;i++){
				
				if(pageUnitArr.indexOf(unitFunArr[i].id)>=0){
					unitFunArr.splice(i,1);
				}
			}
		}
	},
	
	doJson : function(){//json封装
		this.arr = new Array();
		
		return {
			serialize : function (fmId){
				
				try{
					var jsonBody = '';
					if(fmId){
						var form = document.querySelector("#"+fmId);
						for (var i=0;i<form.length;i++){
							
							if(form.elements[i].dataset.tojson=='tojson'){
								var name = form.elements[i].name;
								var val = form.elements[i].value;
								jsonBody += '"'+name+'"'+':'+'"'+val+'"'+',';
							}
						}
						
						jsonBody = jsonBody.substr(0,jsonBody.length-1);
						
						jsonBody = '{'+jsonBody+'}';
						
						return JSON.parse(jsonBody);
						
					}else{
						return {};
					}
				}catch(e){
					return {};
				}
				
			},
			
			toJson : function (str){
				return JSON.parse(str);
			},
			
			toString : function (obj){
				return JSON.stringify(obj);
			},
			
			add : function (key,value){
				this.arr.push({"key":key,"value":value});
			},
			
			getJson : function (){
				var jsonBody = '';
				for(var i=0;i<this.arr.length;i++){
					jsonBody += '"'+this.arr[i].key+'"'+':'+'"'+this.arr[i].value+'"'+',';
				}
				jsonBody = jsonBody.substr(0,jsonBody.length-1);
				jsonBody = '{'+jsonBody+'}';
				
				this.arr = new Array();
				return JSON.parse(jsonBody);
			},
			
			clear : function (){
				this.arr = new Array();
			},
			
			stringify : function (){
				var jsonBody = '';
				for(var i=0;i<this.arr.length;i++){
					jsonBody += '"'+this.arr[i].key+'"'+':'+'"'+this.arr[i].value+'"'+',';
				}
				jsonBody = jsonBody.substr(0,jsonBody.length-1);
				jsonBody = '{'+jsonBody+'}';
				
				this.arr = new Array();
				return JSON.stringify(jsonBody);
			}
		};
	},
	
	inner : function(selector,text){
		document.querySelector(selector).innerHTML = text;
	},
	
	appendChild : function(selector, dom){
		document.querySelector(selector).appendChild(dom);
	},
	
	dom : function(selector){
		return document.querySelector(selector);
	},
	
	alert:function(){
		alert(12222);
	},
	
	getRespText : function(url){
		
		return mui.ajax(url,{
			async:false,
			type:"get",
			dataType:"html",
			success:function(data){
				
			},
			error:function(e){
			}
		});
	}
	
};

