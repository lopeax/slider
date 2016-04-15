(function($){
    $.fn.slidey = function(opts){
        var clicked = (navigator.userAgent.match(/iPad/i)) ? 'touchstart' : 'click';
        var $slidewrap = $(this);
        opts = $.extend({
            slides: '.slide',
            tabs: '.slide-tab',
            viewport: '.slide-viewport'
        }, opts);

        // The slides
        var $slides = $slidewrap.find(opts.slides);

        // The tabs
        var $slidetabs = $slidewrap.find(opts.tabs);

        // The viewport
        var $slideviewport = $slidewrap.find(opts.viewport);

        // Execute after an amount of time has passed
        var executeAfter = (function () {
          var timers = {};
          return function (callback, ms, uniqueId) {
            if (!uniqueId) {
              uniqueId = "Don't call this twice without a uniqueId";
            }
            if (timers[uniqueId]) {
              clearTimeout (timers[uniqueId]);
            }
            timers[uniqueId] = setTimeout(callback, ms);
          };
        })();

        // Slide to the current tab and slide
        var animSlide = function(tab, slide){
            // Make the current tab active
            $slidetabs.removeClass('active');
            tab.addClass('active');

            // Make the current slide active
            $slides.removeClass('active');
            slide.addClass('active');

            // Readjust the height
            slide.closest('.slides').css({
                'height': slide[0].getBoundingClientRect().height
            });

            // Slide the viewport
            var left = 0;
            if($slidetabs.index(tab) > 0) {
                left = (-$slidetabs.index(tab) * 100).toString() + '%';
            }
            $slideviewport.css({
                'transform': 'translateX('+left+')'
            });
        }

        // Setup the slides to be slideable
        $slides.each(function(a, b){
            $slide = $(this);

            // Calculate the slide's position
            var left = 0;
            if(a > 0) {
                left = (a * 100).toString() + '%';
            }

            // Setup the original height of the slider wrap
            if(a == 0) {
                $slide.closest('.slides').css({
                    'height': $slide[0].getBoundingClientRect().height
                });
            }

            // Move the slides into position
            $slide.css({
                'position': 'absolute',
                'left': left,
            });
        });

        // On resize recalulate the height of the slider wrap for the current
        // slide
        $(window).resize(function(){
            executeAfter(function(){
                var $currentslide = $slidewrap.find('.slides .active')[0];
                $slidewrap.find('.slides').css({
                    'height': $currentslide.getBoundingClientRect().height
                })
            }, 50, Date.now().toString());
        });

        $slidetabs.on(clicked, function(e){
            var $tab = $(this);
            var tindex = $slidetabs.index($tab);
            animSlide($tab, $slides.eq(tindex));
        });
    }
})(jQuery);
