
window.Gridagram = (function($) { 

    var options = {};

    var defaults = { 
        width: 200,
        height: 100,
        titleField: "title",
        bodyField: "body",
        widgetId: null
    };


    $.fn.gridagram = function(array, opts) { 

        $.extend(options, defaults, (opts||{}) );

        if($.type(array) !== "array") { 
            throw "not an array";
        }

        var container = $(this);
        var g = new Grid(container);
        array.forEach(function(elem) { 
            var title = (typeof options.titleField === "function") ? options.titleField(elem) : elem[options.titleField];
            var body  = (typeof options.bodyField  === "function") ? options.bodyField(elem)  : elem[options.bodyField];
            var w = g.addWidget(title, body, elem);
        });

        return g;

    }

    return { 
        Grid: Grid,
        Widget: Widget
    }

    function Grid(root) { 
        this.index = $(".gridagram").length;
        this.id = "grid-" + this.index;
        this.widgets = [];
        this.root = root;
        this.autoHeight = false;
        this.root.addClass('gridagram');

        this.addWidget = function(title, body, data) { 
            var widgetId = this.widgets.length;
            var w = new Widget(widgetId, this, title, body, data);
            this.widgets.push(w);
            return w;
        }

        this.empty = function() { 
            this.root.empty();
        };

    }

    function Widget(index, parent, title, body, data) { 

        var w = this;

        this.index = index;
        this.data = data;

        if(options.widgetId !== null) { 
            if(typeof options.widgetId !== "function") { throw("widget id must be set using a function"); }
            this.id = options.widgetId(this.data);
        }
        else { 
            this.id = "grid-" + parent.index + "-widget-" + this.index;
        }

        this.width  = options.width;
        this.height = options.height;
        this.lines = 0;
        this.selection = null;
        this.lines = 0;
        this.autoStretch = false;

        var container = $("<div>")
            .attr("id", this.id)
            .addClass("widget")
            .attr("style", "width: " + this.width + "px; " + "height: " + this.height + "px;");

        var titleDiv = $("<div>").addClass("title")
        var bodyDiv = $("<div>").addClass("body")

        container.append(titleDiv).append(bodyDiv);

        parent.root.append(container);

        this.selection = $("#" + this.id);

        this.title = function(titleText) { 
            if(typeof titleText === "undefined") titleText = "";
            var titleContents = $("<span>").addClass("title-text").html(titleText);
            var titleDiv = this.selection.find(".title");
            titleDiv.html(titleContents);
        };

        this.body = function(bodyHTML) { 
            if(typeof bodyHTML === "undefined") bodyHTML = "";
            var bodyDiv = this.selection.find(".body");
            bodyDiv.html(bodyHTML);
        };

        this.title(title);
        this.body(body);

        this.addLine = function(text, klass) { 
            this.addLineEntry("<p>", false)(text, klass);
        };

        this.addListItem = function(text, klass) { 
            this.addLineEntry("<li>", true)(text, klass);
        };

        this.addList = function() { 
            var listHTML = $("<ul></ul>", {});
            if(this.selection.find("ul").length === 0)
                this.selection.append(listHTML);
            return this.selection.find("ul");
        };

        this.addKeyValue = function(key, value, mesg, opts) { 
            if(opts === undefined) var opts = {};
            if(mesg === undefined || mesg === null || mesg === '') var mesg = undefined;
            var keyAttrs   = (opts.key   === undefined) ? {} : opts.key;
            var valueAttrs = (opts.value === undefined) ? {} : opts.value;
            var msgAttrs   = (opts.msg   === undefined) ? {} : opts.msg;
            keyAttrs = $.extend({}, keyAttrs);
            keyAttrs.class = "key " + keyAttrs.class;
            var keySpan = $("<span>", keyAttrs).html(key);
            valueAttrs = $.extend({}, valueAttrs);
            valueAttrs.class = "value " + valueAttrs.class;
            var valSpan = $("<span>", valueAttrs).html(value);
            var keyElement = this.addLineEntry("<li>", true)(keySpan);
            keyElement.append(valSpan);
            if(mesg !== undefined) { 
                var msgSpan = $("<div>", msgAttrs).html(mesg);
                keyElement.append(msgSpan);
                msgSpan.hide();
                valSpan.click(function(e) { 
                    msgSpan.toggle();
                    msgSpan.css('top', e.pageY);
                    msgSpan.css('left', e.pageX - 300);
                });
            }
            this.widget.find("ul").addClass("leaders");
        };

        this.addLineEntry = function(type, isListType) {
            return function(text, klass) {
                var klass = (klass === undefined) ? "" : klass;
                var id = w.id + "-line-" + (w.lines++);
                var entryHTML = $(type, { id: id, class: "line " + klass });
                if(isListType)
                    var target = w.addList();
                else
                    var target = w.widget;
                target.append(entryHTML);
                if(text !== undefined) $("#" + id).html(text);
                if(w.autoStretch) w.stretchToFit();
                return $("#" + id);
            }
        };

        this.css = function(attr, value) { 
            if(value === undefined) return this.selection.css(attr);
            this.selection.css(attr, value);
        };

        this.addClass = function(klass) { 
            this.selection.addClass(klass);
        };

        this.cssHeight = function(height) { 
            if(height !== undefined)
                this.selection.css("height", height + "px");
            return parseInt(this.selection.css("height"));
        };

        this.applyHeights = function(height) { 
            grid.widgets.forEach( 
                function(w) { 
                    w.cssHeight(height);
                }
            );            
        };

        this.stretchToFit = function() { 
            if(this.hasVerticalScrollBar()) { 
                var newHeight = this.widget[0].scrollHeight;
                this.cssHeight(newHeight);
            }
            if(grid.autoHeight) { 
                this.applyHeights(newHeight);
                grid.widgetDefaults.height = newHeight;
            }
        };

        this.hasVerticalScrollBar = function() { 
            return ((this.selection[0].clientHeight < this.selection[0].scrollHeight));
        };

        this.empty = function() { 
            this.selection.empty();
        };

        //this.addList();

    };


}(jQuery));
