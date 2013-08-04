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

        _raphaelElement: null,
        _paper: null,
        _initialState: null,
        _freeTransform: null,

        initElement: function(raphaelElement, transformOptions){
            transformOptions = transformOptions || {};
            if(_.isNull(this._raphaelElement)){
                this._raphaelElement = raphaelElement;
                this._paper = this._raphaelElement.paper;
                this._initialState = this._raphaelElement.attrs;
                this.setElement(this._raphaelElement);
            }
            this.listenTo(this.model, 'change', _.bind(this._applyAttributes,this));
            this.listenTo(this.model, 'change:transformationAttributes', $.noop);
            this.applyAttributes();

            this._freeTransform = this._paper.freeTransform(this._raphaelElement, transformOptions, _.bind(this._saveTransformation, this));
            var attributes = this.model.get('transformationAttributes');
            if (attributes){
                this.applySavedTransformationAttributes(attributes);
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
                this.model.save();
            }
        },

        _applyAttributes: function(model, event){
            this.applyAttributes(model.attributes);
        },

        applyAttributes: function(attr){
            attr = attr || _.omit(this.model.toJSON(),['x','y','width','height']);
            this._raphaelElement.attr(attr);
        },

        applySavedTransformationAttributes: function(attributes){
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

