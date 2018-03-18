class ApiControllers {

    constructor(url) {
        this.url = url;
    }

    getOompaList(page) {
        $.ajax({
            type     : "GET",
            cache    : false,
            url      : this.url+page,
            beforeSend: function() {
                //stop the scroller controller
                if(isScrollable) {
                    isScrollable = false;
                }
            },
            success  : function(data) {
                console.log(data);

            }});
    }
}