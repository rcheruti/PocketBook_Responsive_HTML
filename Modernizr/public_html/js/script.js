(function(window){
    window.M = Modernizr ;
    var logDiv = null;
    window.con = {log: function(){
        var str = '';
        for( var g in arguments ) str += arguments[g]+' ';
        logDiv.innerHTML += str + '<br />';
    },logPrefixed:function( str, val ){
        var tStylePrefix = M.prefixed( str );
        con.log('---  prefixed: ', tStylePrefix);
        var tStylePrefix = M.prefixedCSS( str );
        con.log('---  prefixedCSS: ', tStylePrefix);
        var tStylePrefix = M.prefixedCSSValue( str, val );
        con.log('---  prefixedCSSValue: ', tStylePrefix);
    },logTestProps:function( prop, val ){
        var tStyle = M.testAllProps( prop , val );
        con.log( '.testAllProps: [ '+prop+' = '+val+' ]', tStyle );
        if( tStyle ) con.logPrefixed( prop, val );
        else con.log( '---  Não existe suporta para: [ '+prop+' = '+val+' ]' );
    }}; 
    
    document.addEventListener('DOMContentLoaded', _testsModernizr );
    
    function _testsModernizr(){
        logDiv = document.querySelector('#logDiv');
        console.log( 'Modernizr', M );

        var mqW800 = M.mq('(max-width: 800px)');
        con.log( '.mq: (max-width: 800px)', mqW800 );
        var mqScreen = M.mq('screen');
        con.log( '.mq: screen', mqScreen );
        var mqTv = M.mq('tv');
        con.log( '.mq: tv', mqTv );
        
        con.logTestProps( 'transformStyle', 'preserve-3d' );
        con.logTestProps( 'filter', 'blur(1px)' );
        
        var atRule = M.atRule('@keyframes');
        con.log( '@keyframes', atRule );
        var atRule = M.atRule('@font-face');
        con.log( '@font-face', atRule );
        
    }
    
})(window);