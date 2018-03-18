function paintOompaList(list) {
    var source = $("#oompa-list-template").html();
    var template = Handlebars.compile(source);
    var wrapper  = {objects: oompaList};
    Handlebars.registerHelper('ifCond', function(v1, v2, options) {
        if(v1 === v2) {
            return options.fn(this);
        }
        return options.inverse(this);
    });
    var html = template(wrapper);
    $('#oompasContent').append(html).show('slow');
    var t = 100;
    $(html).delay(t).fadeIn('slow');
}