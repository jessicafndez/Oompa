'use strict'; //if needed

class Oompa {
    constructor() {
        this.oompasPages = 25;
        this.allOompasUrl = 'https://2q2woep105.execute-api.eu-west-1.amazonaws.com/napptilus/oompa-loompas?page=';
        this.isScrollable = true;
        this.oompasList = "";
        this.actualPage = 1;

        //los metodos a bindear
        this.bind();
        //window.addEventListener('scroll', this.bindScroll.bind(this));
    }
   
    getOmpaList(page) {
        //para reestart el localStorage
        //window.localStorage.clear();
        var listSaved = localStorage.getItem("oompaList");
        var listSavedJson = "";
        if((listSaved === 'undefined') ||
            listSaved === null ) {     
                listSavedJson = this.getOompas(page, true);
        }
        else {
            listSavedJson = JSON.parse(listSaved);
            this.paintOompaContent(listSavedJson);
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
                this.isScrollable = false;
            },
            success  : function(data) {
                oompaResults = data.results;
                var oompaList = JSON.stringify(oompaResults);
        
                if((window.localStorage.getItem("oompaList") !== null)) {
                    var actualList = localStorage.getItem("oompaList");
                    actualList = JSON.parse(actualList);
                    oompaList = actualList.concat(data.results); //suma a la actual
                    oompaList =  JSON.stringify(oompaList); //para string directa a localStorage
                }
                localStorage.setItem("oompaList", oompaList);
                oompaResults = data.results;
            },  
            complete: function (data) {
                that.paintOompaContent(oompaResults);
                this.isScrollable = true; //queremos this no that
            }
        }); 
    }

    paintOompaContent(oompaList) {
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

    paintOompaSearcher(oompaList) {
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

    //bindeamos el scroller 
    bindScroll() {
        var that = this;
        $(window).scroll(function(){
            if(that.isScrollable) {
                var wrap = $('#oompasContent')[0];
                var contentHeight = wrap.offsetHeight;
                var yOffset = window.pageYOffset;
                var y = yOffset + window.innerHeight;
                if(y >= contentHeight) {
                    that.actualPage++;
                    that.getOompas(that.actualPage, false);
                }
            } 
        });
    }

    //bindeamos la entrada del buscador
    bindSearcher() {
        $('#oompaName').bind("change paste keyup", function() {
            var searchName = $('#oompaName').val().toLowerCase();  
            if((this.actualOompaList !== null)) {
                var a = JSON.parse(this.actualList);
                var tempResults = [];
                a.forEach(function(element){
                    var name = element['first_name'].toLowerCase();
                    var lastName = element['last_name'].toLowerCase();
                    var profession = element['profession'].toLowerCase();

                    if(name.includes(searchName) || lastName.includes(searchName) ||
                        profession.includes(searchName)) {
                        tempResults.push(element);
                   }
                });
                paintOompaTemp(tempResults);
            }
        });
    }

    bind() {
        this.bindScroll();
        this.bindSearcher();
    }

}

module.exports = Oompa;

