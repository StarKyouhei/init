jQuery(function($) {
  //IE
    if (!window.console) window.console = { 'log' : function () {} };
 
    //String
    String.prototype.parseInt  = function(){
        return parseInt( this.concat() );
    };
 
    String.prototype.replaceAll = function( before , after ){
        return ( typeof before === 'string' &&  typeof after === 'string') ? this.concat().split( before ).join( after ) : this.concat();
    };
    String.prototype.slicePrefix = function(){
        return this.concat().slice( 1 , this.concat().length );
    };
 
    //String && jQuery
    String.prototype.getjQuery  = function(){
        return $( this.concat() );
    };
 
    //jQuery
    $.fn.href  = function(){
        return this.attr( 'href' ) || this;
    };
    $.fn.src   = function(){
        return this.attr( 'src' )  || this;
    };
    $.fn.block = function(){
        return this.css( 'display' ,'block' );
    };
    $.fn.none  = function(){
        return this.css( 'display' ,'none' );
    };
    $.fn.backgroundImg = function( path ){
        if( !path ) return this;
        var stockImg = new Image();
        stockImg.onload = function(){
            this.css( 'background-image' , path );
            stockImg = null;
        };
        stockImg.src = path;
        return this;
    };
    $.fn.replaceClass = function( before , after ){
        return ( typeof before === 'string' &&  typeof after === 'string') ? this.removeClass( before ).addClass( after ) : this;
    };
    $.fn.replaceAttr = function( targetAttr , before , after ){
        var stockImg , afterAttr , $mine;
        $mine = this;
        after = after || '';
        if ( typeof targetAttr == 'string' && typeof before === 'string' &&  typeof after == 'string'){
            afterAttr = this.attr( targetAttr ).replace( before , after);
            if( targetAttr === 'src' ){
                stockImg = new Image();
                stockImg.onload = function(){
                    $mine.attr( targetAttr , afterAttr);
                    stockImg = null;
                };
                stockImg.src = afterAttr;
            }else{
                this.attr( targetAttr , afterAttr);
            }
        }
        return this;
    };
    $.fn.debug = function( message ){
        ( !this.length ) ? console.log( 'jQuery object length zero!!' ) : console.log( ( message || 'Debug chain this selecter "' + this.selector + '"' ) );
        return this;
    };
    $.fn.emitter = function( callback ){
        if( typeof callback === 'function' ) callback.call( this );
        return this;
    };
    //jQuery effect
    $.fn.smooth = function( duration ){
        var $wrap = $( 'html,body' );
        duration = duration || 150;
        this.each(function(){
            $(this).bind( 'click' , function( e ){
                e.preventDefault();
                var $mine = $( this );
                $wrap.animate( {scrollTop: (( $mine.length ) ? $mine.href().getjQuery().offset().top : 0)} , duration );
            });
        });
        return this;
    };
    $.resizeCallback = function( callback , time ){
        var doit;
        time = time || 20;
        $(window).resize( function(){
            clearTimeout(doit);
            doit = setTimeout( callback , time );
        });
    };
    //extend function
    window.cloneObject = function( obj ) {
        if (obj === null || typeof obj !== "object") return obj;
        var copy = obj.constructor();
        for (var attr in obj) {
            if ( obj.hasOwnProperty( attr ) ) copy[attr] = obj[attr];
        }
        return copy;
    };
 
    //dont fixed
    window.singleton = function(){
        var instance;
        singleton = function(){
            return instance;
        };
        singleton.prototype = this;
        instance = new singleton();
        instance.constructor = singleton;
        return instance;
    };
 
    window.extend = function(obj) {
        $.each( Array.prototype.slice.call( arguments, 1 ), function(source) {
            if (source) {
                for (var prop in source) {
                    obj[prop] = source[prop];
                }
            }
        });
        return obj;
    };
});
