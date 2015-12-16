
(function(){
    document.addEventListener('DOMContentLoaded',function(){
        
        var style = document.createElement('style');
        style.type = 'text/css';
        document.querySelector('body').appendChild( style );
        style = document.styleSheets[ document.styleSheets.length-1 ];
        
        console.log( 'style', style );
        var nextRuleIdx = style.rules? style.rules.length : 0 ;
        style.insertRule('.item { '
                        +' border: 1px solid red; height: 12px; '
                        +' animation: itemAnim 4s ease infinite; '
                        +' }' , 
                nextRuleIdx++ );
        
        
        style.insertRule('@keyframes itemAnim{ '
                        +' 50% { transform: translate3d(50px,0px,0px); opacity: 0.2; } '
                        +' 100%{ transform: translate3d(0px,0px,0px); opacity: 1; } '
                        +' }' , nextRuleIdx++ );
        
        
    });
    
    //------------------------------------------------------------------------
    var obj = {
        _ok: 'as',
        '@keyframes': {
            from: { transform: 'translate3d( 0px,0px,0px); opacity: 1' },
            50  : { transform: 'translate3d(50px,0px,0px); opacity: 0.2' },
            100 : { transform: 'translate3d( 0px,0px,0px); opacity: 1' },
        }
    };
    
    console.log( obj, JSON.stringify( obj ) );
    
    /*
     * Vários atributos da CSS precisam de tratamentos especiais durante esse processo.
     * As intruções que iniciando com "@" são muito diferentes entre si.
     * 
     * 
     */
    
    var CSSParser = function(){};
    CSSParser.parse = function( cssStrOrObj ){};
    CSSParser.toObject = function( cssStr ){
        
    };
    CSSParser.toCssString = function( obj ){};
    
    
})();
