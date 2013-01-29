/*Event.observe(window, 'load', function() {
    new Ajax.Autocompleter($('tags'), $('tags_dropdown'), '/blog/autocomplete/tags/', {paramName: 'q', tokens: [',',"\n"]});
});
*/

new Behavior.Class('iFrameUploader', {
    context: "form.iframe-uploader",
    events: {
    },
    initialize: function() {
        this.context.obs('submit', this.submit.bind(this));
        this.iframe = new Element('iframe', {'src': this.context.action, 'name': 'upload', 'style':'border: none; height: 1px; width: 1px; display: none;'});
        this.context.insert({'after': this.iframe});
        this.context.target = 'upload';
        this.context.uploaded = this.uploaded.bind(this);
        this.uploading = false;
    },

    submit: function(evt) {
        this.uploading = true;
    },

    uploaded: function(success, errors) {
        if (!this.uploading)
            return;

        if (success) {
            this.context.select('span.error').invoke('remove');
            this.context.select('input').each(function(inp) {
                if (inp.type != 'submit' && inp.type != 'button')
                    inp.value = '';
            });
            this.context.select('select').each(function(sel) {
                sel.down('option').selected=true;
            });
            alert('uploaded');
        }
        else {
            $H(errors).each(function(field) {
                field.value.each(function(message) {
                    inp = this.context.down('input[name="'+field.key+'"]');
                    var err = new Element('span', {'class': 'error'});
                    err.innerHTML = message;
                    inp.insert({'after': err});
                }.bind(this));
            }.bind(this));
        }

        this.uploading = false;
    }
});

new Behavior.Class('UploadsBrowser', {
    context: "div.uploads-browser",
    events: {
        'click': {
            'li.directory a':'dir_click',
            'li.file a':'file_click'
        },
/* blur does not currently work
        'blur': {
            'li.file input': 'file_blur'
        }
*/
    },
    initialize: function() {
        ol = new Element('ol');
        this.context.insert(ol);
        this.request_path.bind(this).defer('/', ol);
    },

    request_path: function(path, ol) {
        new Ajax.Request('/uploads'+path, {
            method: 'get',
            onSuccess: this.receive_results.bind(this, ol)
        });
    },

    receive_results: function(ol, t) {
        ol.innerHTML = '';
        
        var len = t.responseJSON.length;
        for (i = 0; i < len; i++)
            this.add_file(ol, t.responseJSON[i]);

        var parent = ol.up('li');
        if (parent && parent.hasClassName('directory'))
            parent.addClassName('expanded');
    },
    add_file: function(ol, info) {
        var li = new Element('li', {'class': 'path ' + (info[0] ? 'directory' : 'file')});
        var a = new Element('a', {'href': '#null'});
        a.innerHTML = info[1];
        li.appendChild(a);
        if (info[0]) {
            var subdir = new Element('ol');
            li.appendChild(subdir);
        }
        ol.appendChild(li);
    },
    determine_path: function(a) {
        var ancestors = a.ancestors();
        var file_name = '';
        var len = ancestors.length;
        for (i = 0; i < len && ancestors[i].hasClassName('path'); i += 2)
            file_name = '/' + ancestors[i].down('a').innerHTML + file_name;
        return file_name;
    },

    dir_click: function(evt) {
        evt.stop();
        var a = evt.element();
        var container = a.up('li');
        if (container.hasClassName('expanded')) {
            container.down('ol').innerHTML = '';
            container.removeClassName('expanded');
        }
        else {
            file_name = this.determine_path(a);
            this.request_path(file_name, container.down('ol'));
        }
    },
    file_click: function(evt) {
        evt.stop();
        var a = evt.element();
        var file_name = a.innerHTML;
        var inp = new Element('input');
        inp.value = MEDIA_URL + 'uploads' + this.determine_path(a);
        a.insert({'after': inp});
        a.hide();
        inp.obs('blur', this.file_blur.bind(this));
        inp.focus();
        inp.select();
    },
    file_blur: function(evt) {
        var inp = evt.element();
        inp.previous('a').show();
        inp.remove();
    }
});

new Behavior.Class('AutoComplete', {
    context: "input[type='text'].ac",
    events: {},
    initialize: function(inp) {
        this.change_obs = false;
        this.ajax = false;
        this.tags = [];
        this.div = new Element('div', {className: 'ac', style: 'position: relative;'});

        ['marginBottom', 'marginTop', 'marginLeft', 'marginRight'].each(function(style) {
            st = {};
            st[style] = inp.getStyle(style);
            this.div.setStyle(st);
        }.bind(this));
        inp.insert({after:this.div});
        inp.remove();

        this.inp = new Element('input', {type: 'text', value: '', style: 'display: inline; width: 10px; border: none; margin: 0;' });
        this.inp.shadow = new Element('span', {className: 'inp_shadow', style: 'position: absolute; left: -1000px; top: -1000px;'});
        this.div.insert(this.inp);
        this.div.insert(this.inp.shadow);

        this.hidden_inp = new Element('input', {type:'hidden', name: inp.name});
        this.div.insert(this.hidden_inp);
        tags = $F(inp).split(',');
        tags.each(function(t) {
            this.add_tag(t);
        }.bind(this));

        this.div.obs('click', function(evt) { this.inp.focus(); }.bind(this));
        this.change_input = this.change_input.bind(this);
        this.inp.obs('keypress', this.change_input);
        this.inp.obs('change', this.change_input);
        //this.inp.obs('keyup', this.change_input);
        this.ac_list = new Element('ol', {className: 'list', style: 'display: none;'});
        this.div.insert(this.ac_list);
        //new Ajax.Autocompleter(this.inp, ac_list, '/blog/autocomplete/tags/', 
        //                       {paramName: 'q', afterUpdateElement: this.select_tag.bind(this)});
    },
    select_tag: function(inp, li) {
        this.add_tag(li.innerHTML);
        this.inp.value = '';
    },
    add_tag: function(tag) {
        if (!tag.blank()) {
            tag = tag.strip();
            if (this.tags.indexOf(tag) != -1)
                return;

            this.tags.push(tag);
            var span = new Element('span', {className: 'tag'});
            var inner_span = new Element('span', {className: 'value'});
            var a = new Element('a', {href:'#null'});
            a.innerHTML = 'x';
            inner_span.innerHTML = tag;
            span.insert(inner_span);
            span.insert(a);
            this.inp.insert({before:span});
            a.obs('click', this.remove_tag.bind(this));
            this.hidden_inp.value += tag+',';
        }        
    },
    remove_tag: function(evt) {
        evt.stop();
        var a = evt.element();
        var span = a.up('span.tag');
        tag = span.down('span.value').innerHTML;
        span.remove();
        this.hidden_inp.value = $F(this.hidden_inp).replace(tag, '').replace(',,', ',');
    },
    change_input: function(evt) {
        var inp = evt.element();
        inp.shadow.innerHTML = $F(inp)+'__';
        inp.setStyle({width: inp.shadow.getWidth()+'px'});


        switch(evt.keyCode){
        case Event.KEY_TAB:
        case Event.KEY_RETURN:
            this.select_option();
        case Event.KEY_ESC:
            this.inp.value = '';
            this.inp.shadow.innerHTML = '__';
            this.inp.setStyle({width: this.inp.shadow.getWidth()+'px'});
            this.hide_options();
            evt.stop();
            return;
/*
        case Event.KEY_LEFT:
        case Event.KEY_RIGHT:
            return;
*/
        case Event.KEY_UP:
            this.select_prev();
            evt.stop();
            return;
        case Event.KEY_DOWN:
            this.select_next();
            evt.stop();
            return;
        default:
            if(this.change_obs) clearTimeout(this.change_obs);
            this.change_obs = setTimeout(this.query.bind(this), 500);
        }
    },
    query: function() {
        this.change_obs = false;
        if ($F(this.inp).length > 2) {
            new Ajax.Request('/autocomplete/tags/', {
                method: 'get',
                parameters: {q: $F(this.inp)},
                onSuccess: function(t) {
                    var len = t.responseJSON.length;
                    this.clear_options();
                    for (i = 0; i < len; i++)
                        this.add_option(t.responseJSON[i]);
                }.bind(this)
            });
        }
        else
            this.hide_options;
    },
    select_option: function() {
        var cur = this.ac_list.down('.current');
        if (!cur)
            return;
        this.add_tag(cur.innerHTML);
    },
    hide_options: function() {
        //new Effect.Fade(this.ac_list, {duration: .2, afterFinish: this.clear_options.bind(this)});
        this.ac_list.hide();
    },
    clear_options: function() {
        this.ac_list.innerHTML = '';
    },
    add_option: function(opt) {
        if (!this.ac_list.visible())
            this.ac_list.show();
        
        var li = new Element('li', {className: '', style: ''});
        li.innerHTML = opt;
        if ($F(this.inp) == opt)
            this.set_current(li);
        this.ac_list.insert({'bottom': li});
    },
    set_current: function(li) {
        this.ac_list.select('.current').invoke('removeClassName', 'current');
        li.addClassName('current');
    },
    select_next: function() {
        var cur = this.ac_list.down('.current');
        if (!cur)
            return;
        var next = cur.next('li');
        if (!next)
            next = this.ac_list.firstDescendant('li');
        this.set_current(next);
    },
    select_prev: function() {
        var cur = this.ac_list.down('.current');
        if (!cur)
            return;
        var prev = cur.previous('li');
        if (!prev)
            prev = this.ac_list.childElements().last();
        this.set_current(prev);
    }
});
