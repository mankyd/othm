var Behavior = {
    init: function() {
        Element.addMethods(Behavior.ObsFunctions);
        for (m in Behavior.ObsFunctions) {
            var o = {};
            o[m] = Behavior.ObsFunctions[m].methodize();
            Object.extend(document, o);
        }

        Event.observe(window, 'load', Behavior.loadFunctions);
        //addDOMLoadEvent(HLG.loadFunctions);
        document.obs('behavior:contentchanged', Behavior.loadFunctions);
        Ajax.Responders.register({onComplete: Behavior.loadFunctions});
        //Ajax.Responders.register({onComplete: HLG.trackAjax});
        this.GLOBALS = {};
    },
    Class: function(name) {
        if (!name || !Object.isString(name))
            throw "Behavior.Class requires a class name as its first argument";
        var properties = $A(arguments);
        properties.shift();
        Behavior[name] = Class.create.apply(Class, properties);

        Behavior[name].prototype.initialize = Behavior[name].prototype.initialize.wrap(
            function(proceed, context) {
                if (context[name] && Object.isFunction(context[name].uninitialize))
                    context[name].uninitialize();
                var properties = $A(arguments);
                properties.shift();
                this.context = context;
                proceed.apply(this, properties);
            }
        );

        Behavior[name].load = function() {
            if (Behavior[name].loaded)
                return;
            Behavior[name].loaded = true;

            properties.each(function(o) {
                var f = false;
                if (!Object.isString(o.context))
                    throw "Behavior.Class requires context property set as a string";

                $$(o.context).each(function(context) {
                    //prevent behaviors from being attached twice
                    if (context[name])
                        return;
                    context[name] = true;
                    context[name] = new Behavior[name](context);

                    if (typeof(o.events) == 'object') {
                        $H(o.events).each(function(p) {
                            context.obs(p.key, function(evt) {
                                var target = evt.element();
                                $H(p.value).each(function(i) {
                                    context.select(i.key).each(function(el) {
                                        if (el == target)
                                            context[name][i.value].call(context[name], evt);
                                    });
                                });
                            });
                        });
                    }
                });
            });
        };

        Behavior.loadFunction(Behavior[name].load);
        Behavior[name].load();

        return Behavior[name];
    },
    ObsFunctions: {
        obs: function(e, w, f, x) {
            if (!e.exclusive)
                e.exclusive = {};
            if (!Object.isArray(w))
                w = [w];
            w.each(function(w) {
                if (e.exclusive[w])
                    return e;
                if (x) {
                    e.obsClear(w);
                    e.exclusive[w] = true;
                }
                Event.observe(e, w, f);
                if (!e.observers)
                    e.observers = {};
                if (!e.observers[w])
                    e.observers[w] = [];
                e.observers[w].push(f);
            });
            return e;
        },
        obsStop: function(e, w, f) {
            if (!Object.isArray(w))
                w = [w];
            w.each(function(w) {
                Event.stopObserving(e, w, f);
                e.observers[w] = e.observers[w].without(f);
            });
        },
        obsClear: function (e, w) {
            if (!Object.isArray(w))
                w = [w];
            w.each(function(w) {
                e['on'+w] = null;
                if (!e.observers || !e.observers[w])
                    return e;
                e.observers[w].each(function(f) {
                    e.obsStop(w, f);
                });
            });

            return e;
        },
        obsInherit: function (e, p, w) {
            if (!Object.isArray(w))
                w = [w];
            w.each(function(w) {
                e['on'+w] = p['on'+w];
                if (!p.observers || !p.observers[w])
                    return e;

                p.observers[w].each(function(f) {
                    Behavior.ObsFunctions.obs(e ,w, f, p.exclusive[w]);
                });
            });

            return e;
        }
    },
    contentChanged: function(memo) {
        document.fire('behavior:contentchanged', memo);
    },

    loadFunction: function(f) {
        if (!Behavior.load_functions)
            Behavior.load_functions = [];

        Behavior.load_functions.push(f);
    },
    loadFunctions: function() {
        if (!Behavior.load_functions)
            return;
        Behavior.load_functions.each(function(f) { f(); });
    }
};

Behavior.init();
