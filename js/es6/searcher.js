'use strict';
const Oompa = require('./oompa.js');

class Searcher {
    constructor() {
        console.log("Hey searcher");
        this.oompa = new Oompa();
        this.bind();
    }

    bindSearcher() {
        $('#oompaName').bind("change paste keyup", function() {
            var searchName = $('#oompaName').val().toLowerCase();
            console.log("-kk--");
            console.log(searchName);

            console.log("!-!--");
            console.log(oompa.getOompaList());
            console.log("----");

            console.log("____");
            console.log(this.actualOompaList);
            if((this.actualOompaList !== null)) {
                console.log("---:");
                console.log(this.actualOompaList);

                var a = JSON.parse(this.actualList);
               // console.log(a);
               var tempResults = [];
                a.forEach(function(element){
                    var name = element['first_name'].toLowerCase();
                    var lastName = element['last_name'].toLowerCase();
                    var profession = element['profession'].toLowerCase();

                   searchName = searchName;
                  // console.log(name + "--" + searchName);

                   if(name.includes(searchName) || lastName.includes(searchName) ||
                   profession.includes(searchName)) {
                        console.log("found: ");
                        console.log(element);
                        tempResults.push(element);
                   }
                   else {
                   //    console.log("Not found");
                   }
                });
                paintOompaTemp(tempResults);
            }
            else {
                console.log("ompa list is empty")
            }
        });
    }

    bind() {
        this.bindSearcher();
    }
}

var se = new Searcher();

module.exports = Searcher;