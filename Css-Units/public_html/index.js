
  // funções parecidas com as do jQuery
function $(str){ return document.querySelector(str); }
function $A(str){ return document.querySelectorAll(str); }

  // para adicionar eventos ao prototype informado
function _bindOn( proto ){ 
  proto.on = function(name, callback, bubble){
    return this.addEventListener( name, callback, bubble );
  };
  proto.off = function(name, callback, bubble){
    return this.removeEventListener( name, callback, bubble );
  };
}

// No IE e no iPad (Chrome e Safari) o Objeto/Interface "EventTarget" não existe!
// Nesses casos precisaremos usar a interface Node (porém os objeto "document" e "window" não são Nodes):
if( window.EventTarget ){
  _bindOn( window.EventTarget.prototype );
}else{
  _bindOn( window.Node.prototype );
  _bindOn( document );
  _bindOn( window );
}

(function(){

  function getValues(){
    
      // informção relacionada a metatag Viewport
    var metaViewport = $('meta[name=viewport]');
    $('.semMetaViewport').style.display = 'block';
    $('.comMetaViewport').style.display = 'block';
    if( metaViewport ){
      $('.semMetaViewport').style.display = 'none';
      $('.comMetaViewport .contentViewport').textContent = metaViewport.outerHTML;
    } else {
      $('.comMetaViewport').style.display = 'none';
    }
    
      // Informações relacionadas a tela do computador
    var cmPx = parseFloat( getComputedStyle( $('.medidaCmRef'), null ).width );
    
        // medidas em pixels:
    $('#windowInnerWidth').textContent = window.innerWidth ;
    $('#windowInnerHeight').textContent = window.innerHeight ;
    $('#windowOuterWidth').textContent = window.outerWidth ;
    $('#windowOuterHeight').textContent = window.outerHeight ;
    $('#screenWidth').textContent = screen.width ;
    $('#screenHeight').textContent = screen.height ;
    $('#screenAvailWidth').textContent = screen.availWidth ;
    $('#screenAvailHeight').textContent = screen.availHeight ;
    
        // medidas em centimetros:
    $('#windowInnerWidthCm').textContent = (window.innerWidth / cmPx).toFixed(2) ;
    $('#windowInnerHeightCm').textContent = (window.innerHeight / cmPx).toFixed(2) ;
    $('#windowOuterWidthCm').textContent = (window.outerWidth / cmPx).toFixed(2) ;
    $('#windowOuterHeightCm').textContent = (window.outerHeight / cmPx).toFixed(2) ;
    $('#screenWidthCm').textContent = (screen.width / cmPx).toFixed(2) ;
    $('#screenHeightCm').textContent = (screen.height / cmPx).toFixed(2) ;
    $('#screenAvailWidthCm').textContent = (screen.availWidth / cmPx).toFixed(2) ;
    $('#screenAvailHeightCm').textContent = (screen.availHeight / cmPx).toFixed(2) ;


    $('#devicePixelRatio').textContent = window.devicePixelRatio ;
    $('#colorDepth').textContent = screen.colorDepth ;
    $('#pixelDepth').textContent = screen.pixelDepth ;
    if( screen.orientation ){
      $('#orientationAngle').textContent = screen.orientation.angle ;
      $('#orientationType').textContent = screen.orientation.type ;
    }
    
    
      // testes mostrando relação de tamanho das unidades
    var sizeTestes = $A('.sizeTest .testing');
    for( var i = 0; i < sizeTestes.length; i++ ){
      var block = sizeTestes[ i ];
      var styles = getComputedStyle( block.querySelector('.sizeTestBlock') , null);
      block.querySelector('.valorPixel').textContent = styles.width;
    }
    
      // testes que usam "matchMedia" para verificar propriedades do navegador
    if( matchMedia ){
      var lista = $A('.matchMedia [data-media]'), i = lista.length, el, mediaStr;
      while( i-- ){
        el = lista[i];
        mediaStr = el.attributes.item('data-media').value ;
        if( matchMedia(mediaStr).matches ){
          el.textContent = 'Sim';
          el.className = 'verde';
        } else {
          el.textContent = 'Não';
          el.className = 'verm';
        }
      }
    }
  }
  
  document.on('DOMContentLoaded', function(){
    getValues();
    window.on('resize', getValues);
    $('#recalc').on('click', getValues);
    
    if( !matchMedia ) $('.matchMedia').style.display = 'none';
    else $('.matchMediaMissing').style.display = 'none';
    
    // Para adicionar a meta tag Viewport (para mobile)
    // !! Atenção: após adicionar esta tag, remover a tag não irá remover as alterações que 
    //             ela causa (na maioria dos navegadores, incluindo mobile).
    $('#toggleViewportTag').on('click', function(){
      var metaTag = $('meta[name=viewport]');
      
      if( metaTag ){
        metaTag.remove();
      } else {
        metaTag = document.createElement('meta');
        metaTag.name = 'viewport';
        metaTag.content = 'width=device-width';
        $('html head').appendChild( metaTag );
      }
      
      getValues(); // recarregar valores após adicionar meta[viewport]
    });
  });
  
})();
