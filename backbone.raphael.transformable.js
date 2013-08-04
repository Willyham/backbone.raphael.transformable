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

        initElement: function(raphaelElement, transformOptions){
            if(_.isNull(this._element)){
                this._element = raphaelElement;
                this._paper = this._element.paper;
                this.setElement(this._element);
            }
            this._element.attr(_.omit(this.model.toJSON(),['x','y','width','height']));
            this._paper.freeTransform(this._element, transformOptions, _.bind(this._handleEvents, this));
        },

        _handleEvents: function(ft, events){
            if(_.contains(events, 'drag end')){
                this.applyTranslation(ft.attrs.translate.x,ft.attrs.translate.y);
                this.model.save();
            }
        },

        applyTranslation: function(xDelta, yDelta){
            this.model.set({
                x: this.model.get('x') +  xDelta,
                y: this.model.get('y') +  yDelta
            });
        }
    });
    return Backbone;
}));
