
  //Animsition
  $(document).ready(function() {

    $(".animsition").animsition({

      inClass               :   'fade-in-down',
      outClass              :   'fade-out-down',
      inDuration            :    1100,
      outDuration           :    1100,
      linkElement           :   '.animsition-link',
      // e.g. linkElement   :   'a:not([target="_blank"]):not([href^=#])'
      touchSupport          :    false,
      loading               :    true,
      loadingParentElement  :   'body', //animsition wrapper element
      loadingClass          :   'animsition-loading',
      unSupportCss          : [ 'animation-duration',
                                '-webkit-animation-duration',
                                '-o-animation-duration'
                              ],
      //"unSupportCss" option allows you to disable the "animsition" in case the css property in the array is not supported by your browser.
      //The default setting is to disable the "animsition" in a browser that does not support "animation-duration".

      overlay               :   false,

      overlayClass          :   'animsition-overlay-slide',
      overlayParentElement  :   'body'
    });

  });

    $(document).ready(function() {
      var menuToggle = $('#js-mobile-menu').unbind();
      $('#js-navigation-menu').removeClass("show");

      menuToggle.on('click', function(e) {
        e.preventDefault();
        $('#js-navigation-menu').slideToggle(function(){
          if($('#js-navigation-menu').is(':hidden')) {
            $('#js-navigation-menu').removeAttr('style');
          }
        });
      });
    });


    // Modal Refill
    $(function() {
      $(".modal-state").on("change", function() {
        if ($(this).is(":checked")) {
          $("body").addClass("modal-open");
        } else {
          $("body").removeClass("modal-open");
        }
      });

      $(".modal-window").on("click", function() {
        $(".modal-state:checked").prop("checked", false).change();
      });

      $(".modal-inner").on("click", function(e) {
        e.stopPropagation();
      });
    });
