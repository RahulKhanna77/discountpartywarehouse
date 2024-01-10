jQuery.fn.isInViewport = function() {
    if(jQuery(this).length == 0) return false;
    var elementTop = $(this).offset().top;
    var elementBottom = elementTop + $(this).outerHeight();

    var viewportTop = $(window).scrollTop();
    var viewportBottom = viewportTop + $(window).height();

    return elementBottom > viewportTop && elementTop < viewportBottom;
};

var Infinite_Scroll = {

    current_page: 1,
    current_search_params: '',
    load_more_trigger: {},
    is_loading: false,
    is_last_page_loaded: false,
    sort: '',
    init: function() {

        var pagination = $('.page-content > .pagination');

        if( pagination.length === 0 ) { return; }


        pagination.html('<h4>Loading...</h4>');
        $('.sort-and-pagination > .pagination').hide();

        Infinite_Scroll.load_more_trigger = $('footer');
        Infinite_Scroll.current_search_params = window.location.search;

        $('#sort').on('change', function() {

            Infinite_Scroll.sort = $(this).val();

        }).change();

        $(window).on('scroll', function() {

            if(Infinite_Scroll.current_search_params !== window.location.search) {

                Infinite_Scroll.re_init();

            }

            if( Infinite_Scroll.load_more_trigger.isInViewport() && !Infinite_Scroll.is_last_page_loaded ) {

                Infinite_Scroll.load_more();
            
            }

        });

    },
    re_init: function() {

        Infinite_Scroll.current_search_params = window.location.search;
        Infinite_Scroll.current_page = 1;
        Infinite_Scroll.is_last_page_loaded = false;
        $('.page-content > .pagination').html('<h4>Loading...</h4>');
        $('.sort-and-pagination > .pagination').hide();

    },
    end_listener: function() {

        Infinite_Scroll.is_last_page_loaded = true;
        $('.page-content > .pagination').html('<h4>There are no more results</h4>');

    },
    load_more: function() {

        if(Infinite_Scroll.is_loading) { return; }
        Infinite_Scroll.is_loading = true;

        Infinite_Scroll.current_page++;

        var search_url = Infinite_Scroll.set_url_param('sort', Infinite_Scroll.sort);
        search_url = Infinite_Scroll.set_url_param('page', Infinite_Scroll.current_page, search_url);


        $.ajax({
          url: window.location.pathname + search_url,
          success: function(res) {

            var page = $($.parseHTML(res));

            var li = page.find('.productGrid li');

            if( li.length > 0 ) {
                $('.productGrid').append( li );

            } else {
                Infinite_Scroll.end_listener();

            }
            

            Infinite_Scroll.is_loading = false;

            },
            error: function(){
                Infinite_Scroll.end_listener();
            }
        });

    },
    get_url_param: function(key) {

        key = key || '';

        var url_search = window.location.search.replace('?', '').split('&');
        var return_val = false;

        $.each(url_search, function(k, v) {

            var key_val = v.split('=');

            if( key_val[0] === key ) {

                return_val = key_val[1] || false;
                return false;

            }

        });

        return return_val;

    },
    set_url_param: function(key, val, str) {

        str = typeof str === 'undefined' ? window.location.search : str;

        if( str === '' ){
        
            return '?'+key+'='+val;
    
        }

        var url_search = str.replace('?', '').split('&');
        var updated_url_search = [];
        var is_found = false;

        $.each(url_search, function(k, v) {

            var key_val = v.split('=');

            if( key_val[0] === key ) {

                updated_url_search.push( key + '=' + val );
                is_found = true;

            } else {

                updated_url_search.push( v );

            }

        });

        if( is_found ) {

            return '?' + updated_url_search.join('&');

        } else {

            return '?' + updated_url_search.join('&') + '&' + key + '=' + val;

        }

    }

};
$(Infinite_Scroll.init);
