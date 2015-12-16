
(function(){
    document.addEventListener('DOMContentLoaded',function(){
        
        var style = document.createElement('style');
        style.type = 'text/css';
        document.querySelector('body').appendChild( style );
        style = document.styleSheets[ document.styleSheets.length-1 ];
        
        console.log( 'style', style );
        var nextRuleIdx = style.rules? style.rules.length : 0 ;
        style.insertRule('.item { border: 1px solid red; }' , nextRuleIdx );
        
        
    });
})();
