/**
Copyright 2009 Dave Mankoff
http://ohthehugemanatee.net/word-o-matic/
**/

var wordomatic = {
    chunk_size: 2,
    randomInt: function (min, max) {
        return Math.floor(Math.random()*(max-min+1)) + min;
    },

    analyze: function (input, chunk_size) {
        var num = input.length;
        var i;
        var j;
        var c;
        var p;
        var cur;
        var len;
        var stats = {};

        for (i = 0; i < num; i++) {
            cur = input[i];
            len = cur.length;
            if (len <= chunk_size)
                continue;
            p = c = "\0";
            
            for (j = 0; j <= len; j++) {
                if (j - chunk_size >= 0)
                    p = cur.substr(j-chunk_size, chunk_size);
                else if (j != 0)
                    continue;
                c = cur.substr(j, chunk_size);
                if (typeof(stats[p]) == 'undefined')
                    stats[p] = {total:0, options: {}};
                if (typeof(stats[p].options[c]) == 'undefined')
                    stats[p].options[c] = 0;
                stats[p].total++;
                stats[p].options[c]++;
            }
        }

        return stats;
    },

    generate: function (stats, chunk_size) {
        var c = "\0";
        var ret = "";
        var r;
        var i;
        var options;
        while (typeof(stats[c]) != 'undefined') {
            r = wordomatic.randomInt(1, stats[c].total);
            options = stats[c].options;
            for (i in options) {
                r -= options[i];
                if (r <= 0) {
                    if (i != "\n" && i != '') {
                        ret += i;
                        c = ret.substr(-chunk_size, chunk_size);
                    }
                    else
                        c = "\n";
                    break;
                }
            }
        }

        return ret;
    }
};


new Behavior.Class('Wordomatic', {
    context: "body.word-o-matic",
    events: {
        'submit': {
            'form': 'saveInput'
        },
        'click': {
            '.show-source':'clickShowSource',
            '.hide-source':'clickHideSource',
            '.save':'clickSave',
            '.generate':'clickGenerate'
        }
    },
    initialize: function() {
        var preset = /\/[^\/]+\/[^\/]+/.exec(location.pathname);
        if (preset) {
            new Ajax.Request(preset[0]+'.json', {
		method: 'get',
		onSuccess: function(response) {
		    this.context.down('textarea[name=input]').setValue(response.responseJSON.input);
		    this.context.down('input[name=title]').setValue(response.responseJSON.title);
		    this.generate(this.context.down('form'));
		}.bind(this)
	    });
        }
        this.generate(this.context.down('form'));
        this.context.down('form').onsubmit = null;
        this.defaultTitle = $F(this.context.down('.save-form input'));
        this.context.down('.save-form input').observe('focus', this.focusTitle.bind(this));
        this.context.down('.save-form input').observe('blur', this.blurTitle.bind(this));
    },
    clickShowSource: function(evt) {
        evt.stop();
        this.context.select('div.input,button.save').invoke('show');
        this.context.select('.show-source').invoke('hide');
        this.context.select('.hide-source').invoke('show');
    },
    clickHideSource: function(evt) {
        evt.stop();
        this.context.select('div.input,button.save,div.save-form').invoke('hide');
        this.context.select('.hide-source').invoke('hide');
        this.context.select('.show-source').invoke('show');
    },
    clickSave: function(evt) {
        evt.stop();
        evt.element().up('form').down('.save-form').show();
    },
    focusTitle: function(evt) {
        var el = evt.element();
        if (el.hasClassName('default')) {
            el.removeClassName('default');
            el.value = '';
        }
    },
    blurTitle: function(evt) {
        var el = evt.element();
        if ($F(el).strip() == '') {
            el.value = this.defaultTitle;
            el.addClassName('default');
        }
    },
    saveInput: function(evt) {
        var el = evt.element();
        var input = el.down('textarea.input');
        var title = el.down('input.title');
        if ($F(input).strip() == '') {
            this.error('Please enter some input text before saving.');
            evt.stop();
        }
        else if (title.hasClassName('default') || $F(title).strip() == '') {
            this.error('Please enter a title');
            evt.stop();
        }
    },
    error: function(message) {
        this.context.down('ul.errors').insert({bottom:'<li>'+message+'</li>'});
    },
    clickGenerate: function(evt) {
        evt.stop();
        this.generate(evt.element().up('form'));
    },
    generate: function(form) {
        var input = $F(form.down('textarea.input')).replace(/\W|_/g, ' ').replace(/\s+/g, ' ').split(' ');
        var stats = wordomatic.analyze(input, wordomatic.chunk_size);
        var word = "";
        var i;
        //words shorter than 4 characters tend to suck, so lets try to generate longer words if we can
        for (i = 0; i < 10 && (word.length < 4 || word.length > 15 || input.include(word)); i++)
            word = wordomatic.generate(stats, wordomatic.chunk_size);
        if (word) {
            var result = this.context.down('.results .result');
            if (result.hasClassName('none'))
                result.removeClassName('none');
            else {
                var prev = this.context.down('.results .previous-words ul');
                while (prev.childElements().length >= 5) {
                    prev.childElements()[prev.childElements().length-1].remove();
                }
                prev.insert({top: '<li>'+result.innerHTML+'</li>'});
                prev.up().show();
            }
            result.innerHTML = word.capitalize();
        }
    }
});

