$(document).ready(function() {
    // call for first api
    var numPages = "";
    var oopasPage = 25;

    var isScrollable = true;

    //localStorage.clear();

    var listSaved = localStorage.getItem("oompaList");
    var listSavedJson = "";
    if((localStorage.getItem("oompaList") === 'undefined') ||
        localStorage.getItem('oompaList') === null ) {
        numPages = 1;
        listSavedJson = getDefaultOpa(numPages);
        console.log("Calling endpoint");
    }
    else {
      //  console.log(listSaved);
        listSavedJson = JSON.parse(listSaved);
        numPages = listSavedJson.length/oopasPage;
        console.log("Pages: " + numPages);
        console.log("not calling endpoint");
        paintOompaContent(listSavedJson);

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
                getDefaultOpa(numPages);
            }
        } 
        else {
            console.log("Not scrolable");
        }
    });

    function getDefaultOpa(page) {
        console.log("Page: " + numPages);
        $.ajax({
            type     : "GET",
            cache    : false,
            url      : 'https://2q2woep105.execute-api.eu-west-1.amazonaws.com/napptilus/oompa-loompas?page='+page,
            beforeSend: function() {
                //stop the scroller controller
                if(isScrollable) {
                    isScrollable = false;
                }
            },
            success  : function(data) {
                console.log(data);
                
                var oompaList = JSON.stringify(data.results);
                console.log("--");
                console.log(localStorage.getItem("oompaList"));
                console.log("--");
                if((localStorage.getItem("oompaList") !== null)) {
                    console.log("111");
                    var actualList = localStorage.getItem("oompaList");
                    actualList = JSON.parse(actualList);
                    oompaList = actualList.concat(data.results);
                    oompaList =  JSON.stringify(oompaList);
                }
                localStorage.setItem("oompaList", oompaList);
                console.log("result");
                console.log(oompaList);

                paintOompaContent(data.results);
                isScrollable = true;
            },         
        });
    }  

    function paintOompaContent(oompaList) {
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
        $('#oompasContent').append(html);
    }

    function paintOompaTemp(oompaList) {
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


    $('#oompaName').bind("change paste keyup", function() {
        var searchName = $('#oompaName').val().toLowerCase();
        console.log("---");
        console.log(searchName);
        if((localStorage.getItem("oompaList") !== null)) {
            var actualList = localStorage.getItem("oompaList");
            console.log("---:");
            var a = JSON.parse(actualList);
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

    $("#searchOompaForm").submit(function(e) {
        e.preventDefault();
        var searchName = $('#oompaName').val().toLowerCase();
        if((localStorage.getItem("oompaList") !== null)) {
            var actualList = localStorage.getItem("oompaList");
            console.log(":---:");
            var a = JSON.parse(actualList);
           // console.log(a);
           var tempResults = [];
            a.forEach(function(element){
                var name = element['first_name'].toLowerCase();
                var lastName = element['last_name'].toLowerCase();
                var profession = element['profession'].toLowerCase();

                console.log("profession: " + profession);
               
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

    $(document).on('click', '.oompaName', function () {
        // your function here
        console.log("yeppp");
        var oompaId = $(this).attr('data-id');
        $('#firstPage').hide();
        $('#secondPage').show();
        window.history.pushState('page2', 'Title', oompaId);
        loadOompa(oompaId)
    });

    function loadOompa(oompaId) {
        var ooompa = localStorage.getItem("oompaId"+oompaId);
        if(oompa != null) {
            $.ajax({
                type     : "GET",
                cache    : false,
                url      : 'https://2q2woep105.execute-api.eu-west-1.amazonaws.com/napptilus/oompa-loompas/'+oompaId,
                success  : function(data) {
                    oompa =  JSON.stringify(data.results);
                    localStorage.setItem("oompaId"+oompaId, oompa);
                    paintOompa(data.results);
                },         
            });
        }
        else {
            paintOompa(oompa);
        }    
    }

    function paintOompa(oompa) {
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

});