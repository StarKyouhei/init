;(function($,window,document){
'use strict';
function AppUtil(){}
AppUtil.prototype.UA = (function(){
	return (function( ua ){
		if (~ua.indexOf('msie')) return 'ie';
		else if (~ua.indexOf('chrome')) return 'chrome';
		else if (~ua.indexOf('safari')) return 'safari';
		else if (~ua.indexOf('gecko')) return 'gecko';
		else return 'more!!!';
	}( window.navigator.userAgent.toLowerCase()));
}());
AppUtil.prototype.arrDEVICE = (function(){
	return (function(ua){
		if (~ua.indexOf('IPHONE')) return ['sp','iphone'];
		else if (~ua.indexOf('ANDROID')) return ['sp','android'];
		else if (~ua.indexOf('IPAD')) return ['tab','ipad'];
		else if (~ua.indexOf('MOBILE')) return ['mobile','andMore'];
		else return ['pc','notSpTab'];
	})( window.navigator.userAgent.toUpperCase());
}());
AppUtil.prototype.MSVERSION = (function(){
	return (function( uav ){
		if (AppUtil.prototype.UA !== 'ie') return void 0;
		if (~uav.indexOf("msie 6.")) return 'ie6';
		else if (~uav.indexOf("msie 7.")) return 'ie7';
		else if (~uav.indexOf("msie 8.")) return 'ie8';
		else return 'IEelse';
	})( window.navigator.appVersion.toLowerCase() );
}());
AppUtil.prototype.CLICKTYPE = (function(){
	return (AppUtil.prototype.arrDEVICE[0] === 'pc') ? 'click' : 'touchstart';
}());
AppUtil.prototype.arrQUERY = (function(){
	return (function(search){
		if(!search.length) return void 0;
		return $.map( search.substring( 1 ).split( '&' ) , function(v){
			return {key:v.split('=')[0],value:v.split('=')[1]};
		});
	})(window.location.search);
}());
AppUtil.prototype.NAME = (function(){
	return (function(name){
		var sName = name.split('/');
		var tmpName = sName[sName.length - 1 ];
		return (/./.test(tmpName)) ? tmpName.split('.')[0] : 'index';
	})(window.location.pathname);
}());
AppUtil.prototype.addStyle = function( path ){
	var link = document.createElement('link');
	link.rel = 'stylesheet';
	link.type = 'text/css';
	link.href = path;
	document.getElementsByTagName('head').item(0).appendChild(link);
};
AppUtil.prototype.clone = function( obj ){
	if (obj === null || typeof obj !== "object") return obj;
	var copy = obj.constructor();
	for (var attr in obj) if ( obj.hasOwnProperty( attr ) ) copy[attr] = obj[attr];
	return copy;
};
AppUtil.prototype.getOrientation = function(){
	return (window.innerHeight > window.innerWidth) ? 'horizon' : 'landscape';
};
AppUtil.prototype.loadImage = function( data ){
	var arrImg = [];
	for(var i=0 , len = data.length; i<len; i++){
		arrImg[i] = new Image();
		arrImg[i].src = data[i];
	}
};
AppUtil.prototype.setCookie = function(key,value,expireday){
	var expiredays = expireday || 30;
	var expires = new Date( new Date().getTime() + (60*60*24*1000*expiredays));
	document.cookie = key + '=' + encodeURIComponent(value) + '; ' + 'path=/; ' + 'expires=' + expires.toUTCString() + ';';
};
AppUtil.prototype.getCookie = function(){
	return	$.map( document.cookie.split( ';' ),function(v){
		return {key:v.split('=')[0],value:v.split('=')[1]};
	});
};
//test
AppUtil.prototype.domReady = function( callback ){
	if(document.addEventListener){
		document.addEventListener('DOMContentLoaded', callback, false);
	}else if(AppUtil.prototype.UA === 'ie'){
		try {
			document.documentElement.doScroll('left');
		} catch(e){
			setTimeout(arguments.callee, 0);
			return;
		}
		callback();
	} else {
		window.onload = callback;
	}
};
AppUtil.prototype.STORAGE_STATUS = (function(){
	return (function(storage){
		return (storage) ? true : false;
	})(window.sessionStorage);
}());
AppUtil.prototype.JSON_BE = (function(){
	return (function(json){
		return (typeof json === 'object') ? true : false;
	})(window.JSON);
}());
AppUtil.prototype.setSession = function( key ,value ){
	if(!AppUtil.prototype.STORAGE_STATUS && !AppUtil.prototype.JSON_BE ) return void 0;
	window.sessionStorage.setItem( key , window.JSON.stringify( value ));
};
AppUtil.prototype.getSession = function( key ){
	if(!AppUtil.prototype.STORAGE_STATUS && !AppUtil.prototype.JSON_BE ) return void 0;
	return window.JSON.parse(window.sessionStorage.getItem( key ));
};
//======================================================================
// Base
//======================================================================
function AppBase(){}
AppBase.prototype.LOG = (function(){
	if (!window.console) window.console = { 'log' : function () {} };
}());
AppBase.prototype.Resize = function( callback ){
	var callbacks = $.Callbacks();
	callbacks.add( callback );
	$( window ).on( 'resize' , function(){ callbacks.fire(); });
	this.Resize = function( callback ){ callbacks.add( callback ); };
};
AppBase.prototype.Orientation = function( callback ){
	var callbacks = $.Callbacks();
	callbacks.add( callback );
	$( window ).on( 'orientationchange' , function(){ callbacks.fire(); });
	this.Orientation = function( callback ){ callbacks.add( callback ); };
};
AppBase.prototype.Box = (function(){
	var box = {};
	return {
		set : function( key,value ){
			if(box[key] || box[key] === 0){
				throw new Error('use '+key+' exist!!');
			}else{
				box[key] = value;
			}
		},
		get : function( key ){ return box[key]; },
		getAll : function(){ return box; },
		update : function( key ,value){
			if(box[key] || box[key] === 0){
				delete box[key];
				box[key] = value;
			}else{
				throw new Error('box '+key+' nil!!');
			}
		},
		remove : function(key){
			delete box[key];
		}
	};
}());
//======================================================================
// jQuery
//======================================================================
$.fn.srcReplace = function(before,after){
	var afterAttr = this.attr('src').replace( before , after);
	var stockImg = new Image();
	stockImg.onload = $.proxy(function(){
		this.attr('src', afterAttr);
		stockImg = null;
	},this);
	stockImg.src = afterAttr;
};
//======================================================================
// functions
//======================================================================
function AppFunctions(){}
AppFunctions.prototype.lightBoxCreate = function( imgPath ){
	var content = '<div id="lby"><img src="'+imgPath+'" width="100%" height="100%"/></div><div id="pbw"></div>';
	$('body').children().append(content);
	$( document.getElementById('lb_overlay') ).css({
		position: 'fixed',
		top: 0,
		left: 0,
		width: '100%',
		'z-index': 100
	});
	$( document.getElementById('popUpBlockWrap') ).css({
		position: 'absolute',
		top: '50%',
		left: '50%',
		'z-index': 200
	});
};
AppFunctions.prototype.lightboxMake = function( path ){
	var fadeTime = 100,$popUpBlockWrap,$overlay,$closeBtn;
	var lightboxPosition = function( $target ,defer){
		var doc = document.documentElement, body = document.body;
		var top = (doc && doc.scrollTop  || body && body.scrollTop  || 0);
/*custom*/(true) ? $target.css({ 'margin-top' : (  top + ( doc.clientHeight / 20 ) ), 'margin-left' : -( $target.width() /2)}) : $target.css({ 'top' : ( top ) });
		defer();
	};
	var lightboxHide = function(e){
		e.preventDefault();
		$popUpBlockWrap.stop().fadeOut( fadeTime + 100 , function(){
			$closeBtn.stop().fadeOut( fadeTime );
			$overlay.stop().fadeOut( fadeTime );
			$popUpBlockWrap.empty();
		});
	};
	$popUpBlockWrap = $( document.getElementById('pbw') );
	$overlay  = $( document.getElementById('lby') ).css('height' ,$( document ).height() ).on( 'click' , lightboxHide );
	$closeBtn = $( '.closeBtn' ).on( 'click' , lightboxHide );
	$.Deferred(function( defer ){
		$popUpBlockWrap.load( path , defer.resolve);
	}).then(function(){
		var defer = new $.Deferred;
		$overlay.fadeIn( fadeTime ,defer.resolve);
		return defer.promise();
	}).then(function(){
		var defer = new $.Deferred;
		lightboxPosition( $popUpBlockWrap ,defer.resolve);
		return defer.promise();
	}).then(function(){
		$closeBtn.fadeIn( fadeTime );
		$popUpBlockWrap.fadeIn( fadeTime );
	});
};
//======================================================================
// AppMain
//======================================================================
function AppMain(){
	$.extend(this, new AppBase, new AppUtil);
}
AppMain.prototype.test1 = function(){
	console.log('test1');
	return this;
};
AppMain.prototype.test2 = function(){
	console.log('test2');
	return this;
};
//======================================================================
// AppController
//======================================================================
function AppController(){
	this.Main = {};
	$.extend(this.Main,new AppMain);
	this[this.Main.NAME]();
}
AppController.prototype.index = function(){
	this.Main.test1().test2();
};
//======================================================================
// Main
//======================================================================
new AppController();

})(jQuery,window,document);