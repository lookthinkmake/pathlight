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

function sortProperties(zip_code_range, callback_1, callback_2) {
    $.ajax({
        url: "https://webreq.propertyware.com/pw/marketing/website.do?sid=171048968&wid=273088512&forSale=false&action=l&sort=&selectedTab=pw_listing_widget_tabs_list&apageNumber=0&noCacheIE=1440610398358",
        type: "GET",
        crossDomain: true,
        dataType: "jsonp",
        success: function(data) {
            for(var k=0; k<=data.buildings.length - 1; k++) {
                for(var i=0; i<=zip_code_range.length - 1; i++) {
                    var property_zip = parseInt(data.buildings[k].zip);

                    if((property_zip >= zip_code_range[i].start_zip && property_zip <= zip_code_range[i].end_zip) && zip_code_range[i].is_listed != true) {
                        zip_code_range[i].is_listed = true;
                        //zip_code_range[i].prop_count = zip_code_range[i].prop_count + 1;
                    }

                    if((property_zip >= zip_code_range[i].start_zip && property_zip <= zip_code_range[i].end_zip) && zip_code_range[i].is_listed == true) {
                        zip_code_range[i].prop_count = zip_code_range[i].prop_count + 1;
                    }
                }
            }

            //sorts object by property count, starting from 0
            var by_prop_count = zip_code_range.slice(0);
            by_prop_count.sort(function(a,b) {
                return a.city.localeCompare(b.city);
            });
            callback_1(by_prop_count);
            callback_2(by_prop_count);
        },
        error: function() { 
            console.log('Failed!'); 
        }
    });
}


function drawAlsoSearch(zip_code_range) {
    $(".alsoSearch a").remove();
    var _html = '';
    for(var k=0; k <= zip_code_range.length-1; k++) {
        if(zip_code_range[k].prop_count != 0) {
            _html += "<a href='http://pathlightmgt.com/search-rentals/" + zip_code_range[k].slug + "?amnts=" + zip_code_range[k].query_string + "'>" + zip_code_range[k].city + "</a>";
        }
    }
    $(_html).appendTo(".alsoSearch");
}

function drawSearchLocation(zip_code_range) {
    $("#pw_listing_widget_search_location").empty();
    var _html = '';
    for(var k=0; k <= zip_code_range.length-1; k++) {
        if(zip_code_range[k].prop_count != 0) {
            _html += "<li class='amenitiesListItem'><input type='checkbox' name='amnts' value='" + zip_code_range[k].query_string + "'>" + zip_code_range[k].city + "</li>";
        }
    }
    $(_html).appendTo("#pw_listing_widget_search_location");
}

function drawCityDropDown(zip_code_range) {
    $("#citySelectBox option[value!='City/Area']").remove();
    var _html = '';

    _html += "<option value='http://pathlightmgt.com/search-rentals/all-areas'>All Areas</option>";

    for(var k=0; k <= zip_code_range.length-1; k++) {
        if(zip_code_range[k].prop_count != 0) {
            _html += "<option value='http://pathlightmgt.com/search-rentals/" + zip_code_range[k].slug + "?amnts=" + zip_code_range[k].query_string + "'>" + zip_code_range[k].city + "</option>";
        }
    }
    $(_html).appendTo("#citySelectBox");
}

function drawCityList(zip_code_range) {
    $(".cityList a").remove();
    var _html = '';

    _html += "<a href='http://pathlightmgt.com/search-rentals/all-areas'><div class='cityTitle'><h3>All Areas</h3></div></a>";

    for(var k=0; k <= zip_code_range.length-1; k++) {
        if(zip_code_range[k].prop_count != 0) {
            _html += "<a href='http://pathlightmgt.com/search-rentals/" + zip_code_range[k].slug + "?amnts=" + zip_code_range[k].query_string + "'><div class='cityTitle' ";
            if (zip_code_range[k].bg_img != '') {
                _html += "style='background-image: url(" + zip_code_range[k].bg_img + "); background-size:cover; background-position: 50%;' ";
            }
            _html += "><h3>" + zip_code_range[k].city + "</h3></div></a>";
        }
    }
    $(_html).appendTo(".cityList");
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

    if ($("#searchRentalsDetails").length >= 1) {
        var _html = "";

        _html = "<div><span style='font-weight: bold;'>Location</span><ul id='pw_listing_widget_search_location'></ul></div>";
        $(_html).appendTo("#moreOptsRow");

        $("#pw_listing_widget_search_amenities_list li").each(function(index) {
            var input_val = $(this).find("input").val();
             if(input_val.match(/_/g)) {
                 $(this).remove();
             }
        });
        sortProperties(zip_code_range, drawAlsoSearch, drawSearchLocation);
    }

    if ($("#searchRentalsList").length >= 1) {
        sortProperties(zip_code_range, drawCityDropDown, drawCityList);
    }
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

// $('.heroBox').click(function(){
//     $('#heroImage').attr('src', $(this).data('background'));
//     $('#heroHeadline').text($(this).data('headline'));
//     $('#heroSubhead').text($(this).data('subhead'));

//     if ($(window).width() > 1024){
//         if ($('#heroSubhead').parent().is('a')){
//             console.log('parent is a link');
//             if ($(this).data('link') != '#'){
//                 $('#heroSubhead').parent('a').attr('href', $(this).data('link'));
//             }
//             else{
//                 $('#heroSubhead').unwrap();
//             }
//         }
//         else{
//             console.log('parent not a link');
//             if ($(this).data('link') != '#'){
//                 $('#heroSubhead').wrap("<a href='"+$(this).data('link')+"'></div>");
//             }
//         }
//     }
//     else{
//         if ($(this).data('link') != '#'){
//             window.location = $(this).data('link');
//         }
//     }
// });

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
