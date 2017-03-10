    $('#main_menu>.item').click(function(){
        $(this).addClass('active');
        $(this).siblings('.item').removeClass('active');
    });

    $('#size>button').click(function(){
        $('#images').removeClass('large small');
        $('#images').addClass($(this).attr('value'));
    });




const fs = require('fs');
function test(){
    let s = fs.readdirSync('.');
    console.log(s.toString());
}
