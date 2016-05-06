(function() {
    var $body = $("body");
    var templates = new vk.Templates();
    var model = new Model();

    function bindEventHandlers() {
        $(window).on('hashchange', goHash);
    }

    function goHash() {
        var hash = window.location.hash.replace('#', '');

        if (!hash) {
            renderHome();
        } else {
            renderArticle(hash);
        }
    }

    function renderArticle(id) {
        templates.get('article').renderTo("#content", model.getById(id));
    }

    function renderHome() {
        templates.get('home').renderTo("#content", model.getData());
    }

    function main() {
        FastClick.attach(document.body);
        model.load(function() {
            bindEventHandlers();
            goHash();
        });
    }

    main();
})();