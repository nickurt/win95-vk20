window.Model = (function() {
    var LOCAL_API_ENDPOINT = 'http://localhost/git/vk/api/vk20/';
    var PROD_API_ENDPOINT = "https://labs.volkskrant.nl/api/vk20/";
    var isLocal = window.location.href.indexOf('localhost') !== -1;
    var API_ENDPOINT = isLocal ? LOCAL_API_ENDPOINT : PROD_API_ENDPOINT;

    function Model() {
        this.data = null;
    }

    Model.prototype = {
        getById : function(id) {
            return this.data.filter(function(item) {
                return item.guid === id;
            })[0];
        },

        getData : function() {
            return this.data;
        },

        load : function(cb) {
            $.getJSON(API_ENDPOINT, function(d) {
                this.data = d;
                cb();
            }.bind(this));
        }
    };

    return Model;
})();