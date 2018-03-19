$(document).ready(function() {
    //variables iniciales
    var numPages = ""; //paginas cargadas
    var oopasPage = 25; //elementos por pagina
    var isScrollable = true; //no scroll mientras ajax is loading!

    //window.localStorage.clear();
    //window.sessionStorage.clear();

    var listSaved = localStorage.getItem("oompaList");
    var listSavedJson = "";

    //primero miramos si tenemos resultados guardados en el buscador
    if(sessionStorage.getItem('oompaListSearch')) {
        var a = sessionStorage.getItem('oompaListSearch');
        listSavedJson = JSON.parse(sessionStorage.getItem('oompaListSearch'));
        var searchName = sessionStorage.getItem('oompaNameSearch');
        $('#oompaName').val(searchName);
        paintOompaSearch(listSavedJson, searchName);
    }
    //este es el bloque por defecto
    else {
        if((localStorage.getItem("oompaList") === 'undefined') ||
            localStorage.getItem('oompaList') === null ) {
            numPages = 1;
            listSavedJson = getDefaultOpa(numPages); //to get de ajax
        }
        else {
            //significa que si k tenemos datos de sesion guardados, miramos tiempo
            var lastUpdate = localStorage.getItem("oompaDate");
            var now = (new Date()).getTime();
       
            //1 dia:
            var day = 1000 * 60 * 60 * 24;
            if((now - lastUpdate) > day) {
                listSavedJson = getDefaultOpa(numPages); //recargamos la lista por la pagina 1
            }
            else {
                console.log(listSaved);
                listSavedJson = JSON.parse(listSaved);
            }
            //por si tenemos una lista larga, al hacer el scroll necesitamos el numero de pagina para el get
            numPages = listSavedJson.length/oopasPage;
            paintOompaContent(listSavedJson);
        }
    }

    $(window).scroll(function(){
        //en el bloque de busqueda no queremos que sea scroll, verdad?
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

        //esto es para el boton de 'goTop'
        if ($(this).scrollTop() > 100) {
            $('.scrollToTop').fadeIn();
        } else {
            $('.scrollToTop').fadeOut();
        }
    });

    //normal ajax get
    function getDefaultOpa(page) {
        $.ajax({
            type     : "GET",
            cache    : false,
            url      : 'https://2q2woep105.execute-api.eu-west-1.amazonaws.com/napptilus/oompa-loompas?page='+page,
            beforeSend: function() {
                //paramos el scroll mientras hace la consulta
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
            },    
            complete: function () {
                isScrollable = true; //al finalizar ya es scroll active
            }     
        });
    }  

    //pintado de la lista de oompas
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
        //queremos que la pinte poco a poco?
        $(html).delay(100).fadeIn('slow');
    }

    //cada vez que se pulsa una tecla actualiza la busqueda
    $('#oompaName').bind("change paste keyup", function() {
        var searchName = $('#oompaName').val().toLowerCase();
        searcherResults(searchName);
    });

    //busqueda con el boton de busqueda
    $("#searchOompaForm").submit(function(e) {
        e.preventDefault();
        var searchName = $('#oompaName').val().toLowerCase();
        searcherResults(searchName);
    });

    //por si queremos una plantilla diferente para los resultados
    function searcherResults(searchName) {
        if((localStorage.getItem("oompaList") !== null)) {
            //search templates ON
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
            paintOompaSearch(tempResults, searchName);
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
        sessionStorage.setItem("oompaListSearch", JSON.stringify(oompaListSearch));
        sessionStorage.setItem('oompaNameSearch', searchName);

        $('.oompaContentBox').empty();
        $('#oompasContentSearch').append(html);    
    }

    //pasamos a vista del oompa
    $(document).on('click', '.oompaName', function () {
        var oompaId = $(this).attr('data-id');
        $('#firstPage').hide();
        $('#secondPage').show();
        window.history.pushState({urlPath:'/'}, 'Oompa Single View', oompaId);
        loadOompa(oompaId)
    });

    //para que suba de forma progresiva
    $('.scrollToTop').click(function () {
        $("html, body").animate({ scrollTop: 0 }, 600);
        return false;
    });


});