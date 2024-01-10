$(function() {

	$('.read-more-btn').parent().nextAll().hide();
	$('.read-more-btn').on('click', function() {

		var _ = $(this).parent();

		_.hide();
		_.nextAll().show();

	});

	$('#instafeed').load('https://sf.appsbyba.com/instagram/feed/discountpartywarehouse.com.au');

});

// auto play carousel on /industry-partners
$(function() {

    if( !window.location.pathname.includes('/industry-partners')) { return; }

    setInterval(function() {
        $('[class^="bc-carousel-container"] .bc-carousel__arrow--right').click();
    }, 5000);

});

