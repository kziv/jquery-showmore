/**
 * jQuery plugin to incrementally display a given number of items in a given container at a time.
 *
 * @author Karen Ziv
 */
// The semi-colon before the function invocation is a safety
// net against concatenated scripts and/or other plugins
// that are not closed properly.
;(function ($, window, document, undefined) {

  // undefined is used here as the undefined global
  // variable in ECMAScript 3 and is mutable (i.e. it can
  // be changed by someone else). undefined isn't really
  // being passed in so we can ensure that its value is
  // truly undefined. In ES5, undefined can no longer be
  // modified.

  // Create the defaults once
  var pluginName = 'showmore';
  var defaults = {
    //infiniteScroll: true // Whether or not to use infinite scrolling. If true, showMoreText is never displayed
    childSelector: 'div', // jQuery selector of the children elements to show
    showInitialNumberOfItems: 10, // Number of items to initially display
    showMoreMarkup: '<div class="showmore-toggle">Show More</div>',
    showMoreNumberOfItems: 10, // Number of additional items to display when showing more. 0 means show all remaining
    slideOptions: {} // Passthrough of jquery.slideDown() animation options
  };

  // The actual plugin constructor
  function Plugin(element, options) {
    this.element = element;

    // Override any default options with user-supplied values
    this.options = $.extend( {}, defaults, options) ;

    this._defaults = defaults;
    this._name = pluginName;

    this.init();
  }

  // Plugin functionality
  Plugin.prototype = {

    init: function() {
      var current = $(this.element);
      var _self = this;

      // If there's less than the number of items per show batch size, we don't need to do anything
      var children = current.children(this.options.childSelector);
      if (children.length <= this.options.showInitialNumberOfItems) {
        return;
      }

      // Get the Nth item that should stay shown
      var showLast = children.eq(this.options.showInitialNumberOfItems - 1);

      showLast.nextAll(this.options.childSelector).hide();

      // Create the show more toggle
      $(this.options.showMoreMarkup)
        .insertAfter(showLast) // Insert the show more toggle after the last visible element
        .click(function(e) {
          e.preventDefault();
          _self.showMore(this, _self.options);
        });

    },

    /**
     * Displays the next N items
     */
    showMore: function(el, options) {
      var lastItem;

      if (options.showMoreNumberOfItems) {
        // Show the next N items after the show more link
        lastItem = $(el).nextAll(this.options.childSelector)
          .slice(0, options.showMoreNumberOfItems)
          .slideDown(options.slideOptions)
          .last();
      }
      else {
        // Show all the remaining items after the show more link
        lastItem = $(el).nextAll(this.options.childSelector)
          .slideDown(options.slideOptions)
          .last();
      }

      // Are there more hidden items (i.e. another "page"+)?
      if (lastItem.nextAll(options.childSelector + ':hidden').length) {
        // Move the show more link to the end of the visible items
        $(el).insertAfter(lastItem);
      }
      else {
        // Remove the show more link entirely
        $(el).remove();
      }
    }
  };

  // A really lightweight plugin wrapper around the constructor,
  // preventing against multiple instantiations
  $.fn[pluginName] = function ( options ) {
    return this.each(function () {
      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName,
                new Plugin( this, options ));
      }
    });
  };

})(jQuery, window, document);
