'use strict';
class OompaApi {
    constructor() {
        this.allOompasUrl = "https://2q2woep105.execute-api.eu-west-1.amazonaws.com/napptilus/oompa-loompas";
    }
    

    test () {
        console.log("here");
    }

    getOompaApiList(page) {
        let url = this.allOompasUrl + "?page="+page;
        let listReturn = "";
        $.ajax({
            type     : "GET",
            cache    : false,
            async: false,
            url      : url,
            // beforeSend: function() {
            //     //stop the scroller controller
            //     if(isScrollable) {
            //         isScrollable = false;
            //     }
            // },
            success: function(data) {
                console.log("---");
              //  console.log(data.results);
              listReturn = data;
            },         
            error: function() {
                console.log("data error");
            }
        });
        console.log("l: ");
        console.log(listReturn);
        return listReturn;
    }


}

module.exports = OompaApi;