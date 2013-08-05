/*
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 *
 */
(function (root, factory) {
    if ( typeof define === 'function' && define.amd ) {
        // AMD. Register as an anonymous module.
        define(['backbone'], function(Backbone) {
            // Use global variables if the locals are undefined.
            return factory(Backbone || root.Backbone);
        });
    } else {
        // RequireJS isn't being used. Assume underscore and backbone are loaded in <script> tags
        factory(Backbone);
    }
}(this, function(Backbone) {

    Backbone.RaphaelTransformableView = Backbone.RaphaelView.extend({

        defaults: {
            // Set to false to not save the model after a transformation
            saveOnChange: true
        },

        _raphaelElement: null,
        _freeTransform: null,

        initElement: function(raphaelElement, transformOptions){
            transformOptions = transformOptions || {};

            // Set the element, wire events and set initial attributes
            this._raphaelElement = raphaelElement;
            this.setElement(this._raphaelElement);
            this.applyAttributes();

            // Setup events
            this.listenTo(this.model, 'change', _.bind(this._applyAttributes,this));
            this.listenTo(this.model, 'destroy', _.bind(this._destroyFreeTransform, this));

            this._freeTransform = this.options.paper.freeTransform(this._raphaelElement, transformOptions, _.bind(this._saveTransformation, this));
            var attributes = this.model.get('transformationAttributes');
            if (attributes){
                this.applyTransformationAttributes(attributes);
            }
        },

        _isTransformationEnd: function(events){
            return _.any(events, function(event){
                return _.contains(event.split(' '), 'end');
            });
        },

        _saveTransformation : function(ft, events){
            if(this._isTransformationEnd(events)){
                this.model.set('transformationAttributes', this._freeTransform.attrs);
                if(this.options.saveOnChange){
                    this.model.save();
                }
            }
        },

        _applyAttributes: function(model){
            this.applyAttributes(model.attributes);
        },

        _destroyFreeTransform: function(){
            this._raphaelElement.remove();
            this._raphaelElement = null;
            this._freeTransform.unplug();
            this._freeTransform = null;
        },

        remove: function(){
            this._destroyFreeTransform();
            this.$el.remove();
            this.stopListening();
            return this;
        },

        applyAttributes: function(attr){
            attr = attr || this.model.toJSON();
            attr = _.omit(attr, ['x','y','width','height']);
            this._raphaelElement.attr(attr);
        },

        applyTransformationAttributes: function(attributes){
            this._freeTransform.attrs = attributes;
            this._freeTransform.updateHandles();
            this._freeTransform.apply();
        }
    });

    Backbone.RaphaelTransformableModel = Backbone.Model.extend({
        defaults:{
            x: 0,
            y: 0,
            fill: '#00ff00',
            stroke: '#000000'
        }
    });

    return Backbone;
}));
