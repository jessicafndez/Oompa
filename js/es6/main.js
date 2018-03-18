'use strict';
const Oompa = require('./oompa.js');

global.isScrollable = true;

class Main {
    constructor() {
      //  localStorage.clear();
        console.log("hello from maieen");
        this.oompa = new Oompa();
        this.actualOompaList = "";
        this.bind();
    }

    init() {
        //it returns 
        this.actualOompaList = this.oompa.getOompaList();
        this.paintOompaList(this.actualOompaList);

        console.log("Listiiinaaa: ");
        console.log(this.actualOompaList);
    }

    actualList() {
        return this.actualOompaList;
    }

    paintOompaList(oompaList) {
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

    bind() {
       // this.init();
    }

}

$(window).scroll(function(){
    if(isScrollable) {
        console.log("Is scrollable");
        var wrap = $('#oompasContent')[0];
        var contentHeight = wrap.offsetHeight;
        var yOffset = window.pageYOffset;
        var y = yOffset + window.innerHeight;
        if(y >= contentHeight) {
            console.log("We are in the end of page");
            numPages++;
            //getDefaultOpa(numPages);
        }
    } 
    else {
        console.log("Not scrolable");
    }
});


var main = new Main();
main.init();