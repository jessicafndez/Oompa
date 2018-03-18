class Oompa {
    constructor() {
        this.oompasPages = 25;
        this.allOompasUrl = 'https://2q2woep105.execute-api.eu-west-1.amazonaws.com/napptilus/oompa-loompas?page=';
        this.isScrollable = true;
        this.oompasList = "";
        this.actualPage = 1;

        window.addEventListener('scroll', this.bindScroll.bind(this));
    }
   
    getOmpaList(page) {
        window.localStorage.clear();
        var listSaved = localStorage.getItem("oompaList");
        var listSavedJson = "";
        if((listSaved === 'undefined') ||
            listSaved === null ) {     
                listSavedJson = this.getOompas(page, true);
        }
        else {
            listSavedJson = JSON.parse(listSaved);
            this.paintOompaContent(listSavedJson);
          //  this.numPages = listSavedJson.length/this.oopasPage;
        }
        this.oompasList = listSaved;
        this.actualPage = page;
        return listSavedJson;
    }

    getOompas(page, isScrollable) {
        var oompaResults = "";
        var that = this;
        $.ajax({
            type     : "GET",
            cache    : false,
            url      : this.allOompasUrl+page,
            beforeSend: function() {
                //stop the scroller controller
                this.isScrollable = false;
            },
            success  : function(data) {
                oompaResults = data.results;
                var oompaList = JSON.stringify(oompaResults);
                console.log("--");
                console.log(data.results);
                console.log("--");
                if((window.localStorage.getItem("oompaList") !== null)) {
                    console.log("111");
                    var actualList = localStorage.getItem("oompaList");
                    actualList = JSON.parse(actualList);
                    oompaList = actualList.concat(data.results);
                    oompaList =  JSON.stringify(oompaList);
                }
                localStorage.setItem("oompaList", oompaList);
                oompaResults = data.results;
            },  
            complete: function (data) {
                that.paintOompaContent(oompaResults);
                this.isScrollable = true;
            }
        }); 
    }

    paintOompaContent(oompaList) {
        console.log("list:");
        console.log(oompaList);
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
       // this.isLoadingOompas = false;
    }

    paintOompaSearcher(oompaList) {
        console.log("oompa List");
        console.log(oompaList);
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
        $('.oompaContentBox').html(html); 
    }

    bindScroll() {
        var that = this;
        $(window).scroll(function(){
            console.log("Is p: " + that.isScrollable);
            if(that.isScrollable) {
                var wrap = $('#oompasContent')[0];
                var contentHeight = wrap.offsetHeight;
                var yOffset = window.pageYOffset;
                var y = yOffset + window.innerHeight;
                console.log("W : "+ contentHeight);
                console.log("l: " + y);
                console.log("o: " + yOffset);
                if(y >= contentHeight) {
                   // isScrollable = false;
                    console.log("We are in the end of page");
                    that.actualPage++;
                    console.log("Pages: " + that.actualPage);
                    that.getOompas(that.actualPage, false);
                }
            } 
            else {
                console.log("Not scrolable");
            }
        });
    }

    bind() {
      //  this.bindScroll();
    }

}