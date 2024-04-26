document.addEventListener( 'DOMContentLoaded', function() {
	if ( 'onwheel' in document ) {
		window.onwheel = function( event ) {
			if( typeof( this.RDSmoothScroll ) !== undefined ) {
				try { window.removeEventListener( 'DOMMouseScroll', this.RDSmoothScroll.prototype.onWheel ); } catch( error ) {}
				event.stopPropagation();
			}
		};
	} else if ( 'onmousewheel' in document ) {
		window.onmousewheel= function( event ) {
			if( typeof( this.RDSmoothScroll ) !== undefined ) {
				try { window.removeEventListener( 'onmousewheel', this.RDSmoothScroll.prototype.onWheel ); } catch( error ) {}
				event.stopPropagation();
			}
		};
	}

	try { $('body').unmousewheel(); } catch( error ) {}
});

function includeAsync(scriptUrl) {
    return new Promise(function(resolve, reject) {
        var script = document.createElement('script');
        script.src = scriptUrl;
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

function isIE() {
    var myNav = navigator.userAgent.toLowerCase();
    return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
};

(function ($) {
    if(isIE() && isIE() < 11){
        includeAsync('js/pointer-events.js');
        $('html').addClass('lt-ie11');
        $(document).ready(function(){
            PointerEventsPolyfill.initialize({});
        });
    }
})(jQuery);

(function ($) { 
    includeAsync('js/rd-smoothscroll.min.js'); 
})(jQuery);


;(function ($) { 
    includeAsync('js/rd-smoothscroll.min.js'); 
})(jQuery);

;
(function ($) {
    var currentYear = (new Date).getFullYear();
    $(document).ready(function () {
        $("#copyright-year").text((new Date).getFullYear());
    });
})(jQuery);

/* Google Map
 ========================================================*/
;
(function ($) {
    var o = document.getElementById("google-map");
    if (o) {
        includeAsync('https://maps.googleapis.com/maps/api/js?key=AIzaSyBwS3if8IXgfOQS4YGRzdZNc05JrNNvTDQ&loading=async&callback=initMap');
        includeAsync('js/jquery.rd-google-map.js');
    }
})(jQuery);

/* WOW
 ========================================================*/
;
function initMap() {
	const myLatLng = { lat: 53.755473, lng: 20.459818 };
    var map = new google.maps.Map(document.getElementById('google-map'), {
        zoom: 15,
        center: myLatLng,
	    mapId: 30ee2ef7615e6de1,
    });
	new google.maps.AdvancedMarkerElement({
    position: myLatLng,
    map,
    title: "Uniwerek",
  });
}

(function ($) {
    var o = $('html');

    if ((navigator.userAgent.toLowerCase().indexOf('msie') == -1 ) || (isIE() && isIE() > 9)) {
        if (o.hasClass('desktop')) {
            includeAsync('js/wow.js').then(function() {
                $(document).ready(function () {
                    new WOW().init();
                });
            });
        }
    }
})(jQuery);


/* Orientation tablet fix
 ========================================================*/
$(function () {
    // IPad/IPhone
    var viewportmeta = document.querySelector && document.querySelector('meta[name="viewport"]'),
        ua = navigator.userAgent,

        gestureStart = function () {
            viewportmeta.content = "width=device-width, minimum-scale=0.25, maximum-scale=1.6, initial-scale=1.0";
        },

        scaleFix = function () {
            if (viewportmeta && /iPhone|iPad/.test(ua) && !/Opera Mini/.test(ua)) {
                viewportmeta.content = "width=device-width, minimum-scale=1.0, maximum-scale=1.0";
                document.addEventListener("gesturestart", gestureStart, false);
            }
        };

    scaleFix();
    // Menu Android
    if (window.orientation != undefined) {
        var regM = /ipod|ipad|iphone/gi,
            result = ua.match(regM);
        if (!result) {
            $('.sf-menus li').each(function () {
                if ($(">ul", this)[0]) {
                    $(">a", this).toggle(
                        function () {
                            return false;
                        },
                        function () {
                            window.location.href = $(this).attr("href");
                        }
                    );
                }
            })
        }
    }
});
var ua = navigator.userAgent.toLocaleLowerCase(),
    regV = /ipod|ipad|iphone/gi,
    result = ua.match(regV),
    userScale = "";
if (!result) {
    userScale = ",user-scalable=1"
}
document.write('<meta name="viewport" content="width=device-width,initial-scale=1.0' + userScale + '">');

;
(function ($) {
    includeAsync('js/jquery.-parallax.js');
})(jQuery);
