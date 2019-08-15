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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNhbXBsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGZ1bmN0aW9uKCkgeyBcclxuICAvLyBJbml0IHdvdy5qc1xyXG4gIHZhciB3b3cgPSBuZXcgV09XKHtvZmZzZXQ6IDEwMH0pO1xyXG4gIHdvdy5pbml0KCk7XHJcblxyXG4gIC8vIEFuaW1hdGlvbiBwYXVzZSB3aGVuIHBhZ2Ugc2Nyb2xsZWQgZG93blxyXG4gIHZhciBhbmltYXRlZENvdmVyQm90dG9tUG9zaXRpb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYW5pbWF0ZWQtY292ZXInKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5ib3R0b207XHJcbiAgdmFyIGFuaW1hdGVkQ292ZXJFbGVtZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5hbmltYXRpb24nKTtcclxuXHJcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIGZ1bmN0aW9uKCl7XHJcbiAgICBpZiAod2luZG93LnBhZ2VZT2Zmc2V0ID4gYW5pbWF0ZWRDb3ZlckJvdHRvbVBvc2l0aW9uKSB7XHJcbiAgICAgIGZvcihpPTA7IGk8YW5pbWF0ZWRDb3ZlckVsZW1lbnRzLmxlbmd0aDtpKyspIHtcclxuICAgICAgICBhbmltYXRlZENvdmVyRWxlbWVudHNbaV0uY2xhc3NMaXN0LmFkZCgnYW5pbWF0aW9uLXBhdXNlZCcpO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBmb3IoaT0wOyBpPGFuaW1hdGVkQ292ZXJFbGVtZW50cy5sZW5ndGg7aSsrKSB7XHJcbiAgICAgICAgYW5pbWF0ZWRDb3ZlckVsZW1lbnRzW2ldLmNsYXNzTGlzdC5yZW1vdmUoJ2FuaW1hdGlvbi1wYXVzZWQnKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0pO1xyXG59KTsiXX0=
