// Requires Handlebars, jQuery
(function() {
    function Template(id, html) {
        this.id = id;
        this.tmpl = Handlebars.compile(html);
        Handlebars.registerPartial(id, html, this.tmpl);
    }

    Template.prototype = {
        render : function(data) {
            return this.tmpl(data);
        },

        renderTo : function(selector, data) {
            var html = this.tmpl(data);
            $(selector).html(html);
        }
    };

    function Templates() {
        this.templates = {};
        var self = this;

        $('script[id^="tmpl-"]').each(function() {
            var $el = $(this);
            var id = $el.attr('id').replace('tmpl-', '');
            var html = $el.html();
            self.templates[id] = new Template(id, html);
        });
    }

    Templates.prototype.get = function(id) {
        return this.templates[id];
    }

    if (typeof window.vk === 'object') {
        window.vk.Templates = Templates;
    }
})();