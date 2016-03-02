
document.addEventListener('DOMContentLoaded',function(){
  
  var quadro1 = document.querySelector('.quadro1');
  
  quadro1.addEventListener('mouseenter',function(){
    TweenMax.to(quadro1, 1, { width:'400px', ease: Cubic.easeOut  });
  });
  quadro1.addEventListener('mouseleave',function(){
    TweenMax.to(quadro1, 1, { width:'100px', ease: Cubic.easeOut  });
  });
  
  var movido = false;
  quadro1.addEventListener('mousedown',function(){
    if(movido) TweenMax.to(quadro1, 1, { y:'0px', ease: Cubic.easeOut  });
    else TweenMax.to(quadro1, 1, { y:'150px', ease: Cubic.easeOut  });
    movido = !movido;
  });
  
});
