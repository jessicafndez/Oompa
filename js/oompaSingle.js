$(document).ready(function() {
function loadOompa(oompaId) {
    var oompa = localStorage.getItem("oompaId"+oompaId);
    if((oompa != null) || (oompa != 'undefined')) {
        $.ajax({
            type     : "GET",
            cache    : false,
            url      : 'https://2q2woep105.execute-api.eu-west-1.amazonaws.com/napptilus/oompa-loompas/'+oompaId,
            success  : function(data) {
                oompa =  JSON.stringify(data);
                localStorage.setItem("oompaId"+oompaId, oompa);
                paintOompa(data);
            },         
        });
    }
    else {
        paintOompa(oompa);
    }    
}

function paintOompa(oompa) {
    var source = $("#oompa-single-template").html();
    var template = Handlebars.compile(source);
    Handlebars.registerHelper('ifCond', function(v1, v2, options) {
        if(v1 === v2) {
            return options.fn(this);
        }
        return options.inverse(this);
    });
    var html = template(oompa);
    $('#secondPage').html(html); 
}

});