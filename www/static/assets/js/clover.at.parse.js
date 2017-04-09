var cat = function(_in){
	
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
			return node;
		},
		
		putElement : function (_frmdivId,_conf){
			var mDom = dom(_conf);
			document.querySelector("#"+_frmdivId).appendChild(mDom);
		}
		
	};
}

var keyListener = function(_conf){
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
	
}


var edit = function(){
	
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
}