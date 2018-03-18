$(document).ready(function() {
    var isScrollable = true;
    var numPages = 1;

    var oompaObject = new Oompa();

    var list = oompaObject.getOmpaList(1);
    console.log("list");
    console.log(list);
  //  oompaObject.paintOompaContent(list);

   // console.log("S: " + isScrollable);
    //event para entrada buscador automatico
    $('#oompaName').bind("change paste keyup", function() {
        var searchName = $('#oompaName').val().toLowerCase();
        this.searchOompas(searchName);
    });

    //event para buscador sin automatico, con click button 
    $("#searchOompaForm").submit(function(e) {
        e.preventDefault();
        var searchName = $('#oompaName').val().toLowerCase();
        this.searchOompas(searchName);
    });

    //buscador a partir de string
    function searchOompas(searchValue) {
        if((localStorage.getItem("oompaList") !== null)) {
            var actualList = localStorage.getItem("oompaList");
            var a = JSON.parse(actualList);
            var tempResults = [];

            a.forEach(function(element){
                var name = element['first_name'].toLowerCase();
                var lastName = element['last_name'].toLowerCase();
                var profession = element['profession'].toLowerCase();
               
               if(name.includes(searchValue) || lastName.includes(searchValue) ||
               profession.includes(searchValue)) {
                    tempResults.push(element);
               }
            });    
            oompaObject.paintOompaSearcher(tempResults);
        }
        else {
            console.log("ompa list is empty")
        }
    }

    //call api si llegas al final de la pagina
    // $(window).scroll(function(){
    //     console.log("Is p: ");
    //     console.log(oompaObject.isLoadingOompas);
    //     if(isScrollable) {
    //         var wrap = $('#oompasContent')[0];
    //         var contentHeight = wrap.offsetHeight;
    //         var yOffset = window.pageYOffset;
    //         var y = yOffset + window.innerHeight;
    //         console.log("W : "+ contentHeight);
    //         console.log("l: " + y);
    //         if(y === contentHeight) {
    //            // isScrollable = false;
    //             console.log("We are in the end of page");
    //             numPages++;
    //             console.log("Pages: " + numPages);
    //             oompaObject.getOompas(numPages, false);
    //             // oompaObject.getOompas(numPages, false).then(function(){
    //             //     console.log("wait till load");
    //             //     isScrollable = false;
    //             // });
    //          //   isScrollable = true;
    //         //  console.log("a: ");
    //         //  console.log(list.length);
    //         //  console.log("b: ");
    //         //  console.log(oompaObject.oompasList.length);
    //         //     if(list != 'undefined' ||
    //         //         (list.length === oompaObject.oompasList)) {
    //         //         isScrollable = false;

    //         //     }
    //         //     else {
    //         //         isScrollable = true;
    //         //     }
    //         }
    //     } 
    //     else {
    //         console.log("Not scrolable");
    //     }
    // });

});