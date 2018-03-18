$(document).ready(function() {
    // call for first api
    var numPages = "";
    var oopasPage = 25;
    var isScrollable = true;

    //window.localStorage.clear();

    var listSaved = localStorage.getItem("oompaList");
    var listSavedJson = "";

    console.log("LS: ");
    console.log(listSaved);

    //primero miramos si tenemos resultados guardados en el buscador
    if(sessionStorage.getItem('oompaListSearch')) {
        listSavedJson = JSON.parse(sessionStorage.getItem('oompaListSearch'));
        var searchName = sessionStorage.getItem('oompaNameSearch');
        $('#oompaName').val(searchName);
        paintOompaContent(listSavedJson);
    }
    else {
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
    }

    $(window).scroll(function(){
        if(!$('.searchContent').is(':visible') &&
            isScrollable) {
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
                var currentTime = { "oompaTime" : new Date().getTime()};
                localStorage.setItem("oompaDate", currentTime);
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

    $('#oompaName').bind("change paste keyup", function() {
        var searchName = $('#oompaName').val().toLowerCase();
        paintSearcherResults(searchName);
    });

    $("#searchOompaForm").submit(function(e) {
        e.preventDefault();
        var searchName = $('#oompaName').val().toLowerCase();
        paintSearcherResults(searchName);
    });

    function paintSearcherResults(searchName) {
        console.log("S: " + searchName);
        if((localStorage.getItem("oompaList") !== null)) {

            //search templates
            $('.searchContent').css('display', 'block');
            $('.wrapContent').css('display', 'none');

            var actualList = localStorage.getItem("oompaList");
            var a = JSON.parse(actualList);
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
            console.log("A: ");
            console.log(tempResults);   
            paintOompaSearch(tempResults, searchName);
        }
        else {
            console.log("its empty");
        }
    }

    function paintOompaSearch(oompaListSearch, searchName) {
        var source = $("#oompa-list-template-search").html();
        var template = Handlebars.compile(source);
        var wrapper  = {objects: oompaListSearch};
        Handlebars.registerHelper('ifCond', function(v1, v2, options) {
            if(v1 === v2) {
                return options.fn(this);
            }
            return options.inverse(this);
        });
        var html = template(wrapper);

        //queremos guardar los resultados de la busqueda para
        //cuando volvamos al 'index'?
        sessionStorage.setItem("oompaListSearch", oompaListSearch);
        sessionStorage.setItem('oompaNameSearch', searchName);

        $('.oompaContentBox').empty();
        $('#oompasContentSearch').append(html);    
    }

    $(document).on('click', '.oompaName', function () {
        var oompaId = $(this).attr('data-id');
        $('#firstPage').hide();
        $('#secondPage').show();
        window.history.pushState({urlPath:'/'}, 'Oompa Single View', oompaId);
        loadOompa(oompaId)
    });


});