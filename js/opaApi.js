$(document).ready(function() {
    // call for first api
    var numPages = "";
    var oopasPage = 25;
    var isScrollable = true;

    window.localStorage.clear();

    var listSaved = localStorage.getItem("oompaList");
    var listSavedJson = "";
    if((localStorage.getItem("oompaList") === 'undefined') ||
        localStorage.getItem('oompaList') === null ) {
        numPages = 1;
        listSavedJson = getDefaultOpa(numPages);
    }
    else {
        listSavedJson = JSON.parse(listSaved);
        numPages = listSavedJson.length/oopasPage;
        paintOompaContent(listSavedJson);
    }

    $(window).scroll(function(){
        if(isScrollable) {
            var wrap = $('#oompasContent')[0];
            var contentHeight = wrap.offsetHeight;
            var yOffset = window.pageYOffset;
            var y = yOffset + window.innerHeight;
            if(y >= contentHeight) {
                numPages++;
                getDefaultOpa(numPages);
            }
        } 
    });

    function getDefaultOpa(page) {
        $.ajax({
            type     : "GET",
            cache    : false,
            url      : 'https://2q2woep105.execute-api.eu-west-1.amazonaws.com/napptilus/oompa-loompas?page='+page,
            beforeSend: function() {
                if(isScrollable) {
                    isScrollable = false;
                }
            },
            success  : function(data) {
                var oompaList = JSON.stringify(data.results);
                if((localStorage.getItem("oompaList") !== null)) {
                    var actualList = localStorage.getItem("oompaList");
                    actualList = JSON.parse(actualList);
                    oompaList = actualList.concat(data.results);
                    oompaList =  JSON.stringify(oompaList);
                }
                localStorage.setItem("oompaList", oompaList);
                paintOompaContent(data.results);
                isScrollable = true;
            },         
        });
    }  

    function paintOompaContent(oompaList) {
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

    function paintOompaTemp(oompaList) {
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
        paintSearcherResults(searchName);
    });

    $("#searchOompaForm").submit(function(e) {
        e.preventDefault();
        var searchName = $('#oompaName').val().toLowerCase();
        paintSearcherResults(searchName);
    });

    function paintSearcherResults(name) {
        if((localStorage.getItem("oompaList") !== null)) {
            var actualList = localStorage.getItem("oompaList");
            var a = JSON.parse(actualList);
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
    }

    $(document).on('click', '.oompaName', function () {
        console.log("yeppp");
        var oompaId = $(this).attr('data-id');
        $('#firstPage').hide();
        $('#secondPage').show();
        console.log()
       window.history.pushState({urlPath:'/single_page.html'}, 'Oompa View', oompaId);
    //  history.replaceState({data: 'elephant'}, 'New Title')
        loadOompa(oompaId)
    });

    function loadOompa(oompaId) {
        var oompa = localStorage.getItem("oompaId"+oompaId);
        console.log("oo_");
        console.log(oompa);
        console.log(oompaId);
        if((oompa != null) || (oompa != 'undefined')) {
            $.ajax({
                type     : "GET",
                cache    : false,
                url      : 'https://2q2woep105.execute-api.eu-west-1.amazonaws.com/napptilus/oompa-loompas/'+oompaId,
                success  : function(data) {
                    console.log(data);
                    oompa =  JSON.stringify(data);
                    localStorage.setItem("oompaId"+oompaId, oompa);

                    console.log("daata: " + data);
                    paintOompa(data);
                },         
            });
        }
        else {
            paintOompa(oompa);
        }    
    }

    function paintOompa(oompa) {
        console.log("oompa List");
        console.log(oompa);
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

    window.onpopstate = function (event) {
        if (history.state && history.state.id === 'homepage') {
            // Render new content for the hompage

            console.log("heyyyy");
        }
    };

});