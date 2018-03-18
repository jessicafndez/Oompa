'use strict';
const OompaApi = require('./controllers/oompaApi.js');

class Oompa {
    constructor(){
        console.log("Hello from ompa");
        this.numPages = 1;
        this.oompasPerPage = 25;
        this.isPageScrollable = true;
        this.oompaList = localStorage.getItem("oompaList");

        this.oompaApi = new OompaApi();
    }

    getOompaList(page) {
        if((this.oompaList === null) || 
            (this.oompaList === 'undefined')) {
            let jsonResults = this.oompaApi.getOompaApiList(this.numPages);

            //saved in local storage
            let jsonOompas = JSON.stringify(jsonResults.results);
            localStorage.setItem("oompaList", jsonOompas);
            this.oompaApi = jsonResults.results;

            console.log("case 1");
            return jsonResults.results;;
        }
        else {
            console.log("case 2");
            let listSavedJson = JSON.parse(this.oompaList);
            this.numPages = listSavedJson.length/this.oompasPerPage;
            return listSavedJson;
        }
    } 

    getLocalStorageList() {
        let listSaved = localStorage.getItem("oompaList");
        var listSavedJson = "";
        if((localStorage.getItem("oompaList") === 'undefined') ||
            localStorage.getItem('oompaList') === null ) {
            return null;
        }
        else {
            this.oompaList = listSaved;
            listSavedJson = JSON.parse(listSaved);
            this.numPages = listSavedJson.length/this.oompasPerPage;
            return listSavedJson;
        }
    }


    
}

module.exports = Oompa;

