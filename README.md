backbone.raphael.transformable
==============================

A Backbone view and model which provide a transformable Raphael JS element.

## Live Demo

A live demo can be found [here](http://www.willdemaine.co.uk/demos/transformable/). This demo uses backbone and localStorage to persist the drawings.

### Installation

Due to the number of dependencies, I would suggest using bower to install:

``bower install backbone.raphael.transformable``

Then, set up your require config. Mine looks something like this:

```javascript
    paths: {
        jquery: '../bower_components/jquery/jquery',
        backbone: '../bower_components/backbone/backbone',
        underscore: '../bower_components/underscore/underscore',
        eve:          '../bower_components/raphael-amd/eve.0.3.4',
        raphael:      '../bower_components/raphael-amd/raphael.2.1.0.amd',
        'raphael.core': '../bower_components/raphael-amd/raphael.2.1.0.core',
        'raphael.svg':  '../bower_components/raphael-amd/raphael.2.1.0.svg',
        'raphael.vml':  '../bower_components/raphael-amd/raphael.2.1.0.vml',
        'backbone.raphael': '../bower_components/backbone.raphael-amd/backbone.raphael',
        'raphael.freeTransform': '../bower_components/raphael.free_transform/raphael.free_transform',
        'backbone.transformable': '../bower_components/backbone.raphael.transformable/backbone.raphael.transformable'
    }
```

#### Dependencies

[Raphael](https://github.com/DmitryBaranovskiy/raphael/) by @DmitryBaranovskiv

[Raphael FreeTransform](https://github.com/ElbertF/Raphael.FreeTransform) by @ElbertF

[Raphael Backbone](https://github.com/Willyham/backbone.raphael-amd) by @Willyham, @tomasAlabes


### What It Provides

This module provides a RaphaelTransformableView and RaphaelTransformableModel on the Backbone object.

## RaphaelTransformableView

This is a view which extends RaphaelView and gives automatic functionality for tying together backbone, raphael and raphael free transform.

##### Public API

RaphaelTransformableView exposes 3 public methods:

``initElement(raphaelElement, transformOptions)``

initElement establishes the transformable behaviour on any Raphael.Element that you supply. Optionally pass an object ``transformOptions`` to change the behaviour of the
free transform module. See a list of available options [here](https://github.com/ElbertF/Raphael.FreeTransform#options).

``applyAttributes(attributes)``

Apply a set of Raphael attributes to the view's raphael element. For example, if you wanted to change the colour of an element, you could pass ``{fill: '#FFF'}`` here.
Any existing attributes which you do not specify will not be removed. Note that you *cannot* use this to change attributes of the element which deal with positioning or transformations.
Calling this method without supplying an ``attributes`` parameter will apply the model's attributes by default.

``applyTransformationAttributes(attributes)``

Apply a set of transformaton attributes as defined by [free transform](https://github.com/ElbertF/Raphael.FreeTransform). This is used internally to apply saved transformations, but
can be used externally too. This method **does not** save the underlying model.

#### Options

Boolean ``saveOnChange`` . Default ``true``. Set to false to not save the model after a transformation.

## RaphaelTransformableModel

Defines some default properties which you will need to draw a RaphaelElement. Any model can be used, this is simply for convenience.

## Example Usage


```javascript
require([
    'backbone',
    'raphael',
    'raphael.freeTransform',
    'backbone.raphael',
    'backbone.transformable',
], function (Backbone, Raphael) {

    // Create a raphael instance
    var paper = Raphael('paper', 500, 500);

    // Create a Backbone RaphaelView
    var RectangleView = Backbone.RaphaelTransformableView.extend({

        events: {
            'click' : 'changeColour'
        },

        initialize: function(){
            if(!this.model){
                throw new Error('Model needed to create RaphaelTransformableView');
            }
            if(!this.options.paper){
                throw new Error('Paper needed to create RaphaelTransformableView');
            }
        },

        render: function(){
            var rect = this.options.paper.rect(this.model.get('x'), this.model.get('y'), this.model.get('width'),this.model.get('height'));
            this.initElement(rect);
        },

        changeColour: function(){
            var colour = '#' + Math.random().toString(16).substring(2,8);
            // Setting attributes on the model automatically changes the SVG
            this.model.set('fill', colour);
        }

    });

    var mySquare = new Backbone.RaphaelTransformableModel({
        x: 100,
        y: 100,
        width: 50,
        height: 50
    });

    // Create a new instance of the view, and render
    new RectangleView({
        paper: paper,
        model: mySquare,
        // Transforming the shape will save the model by default, so set this to false if you don't define a model url.
        saveOnChange: true
    }).render();
});
```
