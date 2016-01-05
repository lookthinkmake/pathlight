'use strict';

function sizeHome(){
    var windowHeight = $(window).height();
    var heroBoxesHeight = $('.heroBoxes').outerHeight();
    var navHeight = $('nav').outerHeight();
    var homeBoxHeight = $('.homeSection').height();
    if ((windowHeight - homeBoxHeight)/2 > 0){
        console.log($(this).height());
        $('.homeSection').css({
          'min-height': windowHeight- heroBoxesHeight
        });
        $('.hero').css({
            'margin-top': (windowHeight - homeBoxHeight)/2
        });
    }
    else{
        $('.homeSection').attr('style','');
        $('.hero').css({
            'margin-top': navHeight
        });
    }
}

function initStickyFooter(){
    var bottomContainerHeight = $('.bottomContainer').height();
    $('body').css({
        'margin-bottom': bottomContainerHeight
    });
    $('.bottomContainer').css({
        'height': bottomContainerHeight
    });
}

function internalPagePadding(){
    var navHeight = $('nav').outerHeight();
    $('body').css({
        'padding-top': navHeight
    });
}
$(document).ready(function(){

    $(".sayHello input[type='submit']").click(function(e) {
        e.preventDefault();
        var form = $(this).parent();
        //var container = $(form).parent().parent();
        var _submit = true;
         $(form).find('input, textarea, select').each(function(key, value) {
            if(this.value == "" || this.value == null) {
                //console.log(this);
                $(this).css( "background", "rgb(223, 23, 23)");
                //$(container).css("background",  "rgb(223, 23, 23)");
                _submit = false;
            }
         });

         if (_submit == true) {
            form.submit();
         }
    });

    

});


$(window).load(function(){
    initStickyFooter();

    if($('body').hasClass('internal')){
        internalPagePadding();
        if ($('.cityTitle').length){
            $('.cityTitle').imagefill();
            console.log('city titled');
        }
    }
    else{
        imagesLoaded( $('body'), function(){
            sizeHome();
        });
        $('.homeSection').imagefill();
        $('.heroBox').imagefill();
    }

    //if ($("#test-page").length >= 1) {

        var _html = "";
        _html += "<div><span style='font-weight: bold;'>Location</span><ul id='pw_listing_widget_search_location'>";

        $("#pw_listing_widget_search_amenities_list li").each(function(index) {
            var input_val = $(this).find("input").val();
             if(input_val.match(/_/g)) {

                _html += "<li class='amenitiesListItem'>";
                _html += "<input type='checkbox' name='amnts' value='" + input_val + "'>" + input_val.replace(/_/g, "") + "</li>";
                 $(this).remove();
             }
        });

        _html += "</ul></div>";
        $(_html).appendTo("#moreOptsRow");

        var url = window.location.search;
        url = url.replace("?", "").split("&");
        
        for (var k = 1; k <= url.length - 1; k++) {
            if (url[k].match(/amnts/g)) {
                var _check = url[k].replace("amnts=", "");
                $("#pw_listing_widget_search_location").find("input[type=checkbox][value='" + _check.replace("+", " ") + "']").prop("checked", true);
            }
        }
    //}


});


// Would write the value of the QueryString-variable called name to the console  




$(window).resize(function(){
    if($('body').hasClass('internal')){
        internalPagePadding();
    }
    else{
        sizeHome();
    }
});

$('#citySelectSubmit').click(function(){
    window.location = $('#citySelectBox option:selected').val();
});

$('.heroBox').click(function(){
    $('#heroImage').attr('src', $(this).data('background'));
    $('#heroHeadline').text($(this).data('headline'));
    $('#heroSubhead').text($(this).data('subhead'));

    if ($(window).width() > 1024){
        if ($('#heroSubhead').parent().is('a')){
            console.log('parent is a link');
            if ($(this).data('link') != '#'){
                $('#heroSubhead').parent('a').attr('href', $(this).data('link'));
            }
            else{
                $('#heroSubhead').unwrap();
            }
        }
        else{
            console.log('parent not a link');
            if ($(this).data('link') != '#'){
                $('#heroSubhead').wrap("<a href='"+$(this).data('link')+"'></div>");
            }
        }
    }
    else{
        if ($(this).data('link') != '#'){
            window.location = $(this).data('link');
        }
    }
});

$('.mobileToggle').click(function(){
    // $('nav ul').slideToggle();
    if ($('nav ul:visible').length) {

        console.log('Nav is visible!');
        $('nav ul').slideToggle();
    }
    else{
        console.log('Nav is hidden!');
        $('nav ul').slideToggle();
    }
});
