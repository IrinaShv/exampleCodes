document.addEventListener("DOMContentLoaded", function() { 
  // Init wow.js
  var wow = new WOW({offset: 100});
  wow.init();

  // Animation pause when page scrolled down
  var animatedCoverBottomPosition = document.querySelector('.animated-cover').getBoundingClientRect().bottom;
  var animatedCoverElements = document.querySelectorAll('.animation');

  window.addEventListener('scroll', function(){
    if (window.pageYOffset > animatedCoverBottomPosition) {
      for(i=0; i<animatedCoverElements.length;i++) {
        animatedCoverElements[i].classList.add('animation-paused');
      }
    } else {
      for(i=0; i<animatedCoverElements.length;i++) {
        animatedCoverElements[i].classList.remove('animation-paused');
      }
    }
  });
});