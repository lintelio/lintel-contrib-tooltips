(function() {
  'use strict';

  var Tooltip = function(element) {
    this.$tooltip = $(element);
  };

  Tooltip.prototype.init = function() {
    // On event in, show tooltip
    this.$tooltip.on('mouseenter focusin', $.proxy(this.show, this));

    // On event out, hide tooltip
    this.$tooltip.on('mouseleave focusout', $.proxy(this.hide, this));
  };

  Tooltip.prototype.show = function(e) {

    console.log(e);
  };

  Tooltip.prototype.hide = function(e) {
    console.log(e);
  };

  // Define jQuery plugin
  function Plugin(method, options) {
    var settings = $.extend({}, Plugin.defaults, options);

    return this.each(function() {
      var $this = $(this);

      var data = $this.data('lt.tooltip');
      if (!data) {
        data = new Tooltip(this);
        $this.data('lt.tooltip', data);
      }
      if (typeof method === 'string') { data[method](); }

      settings.callback.call($this);
    });
  }

  Plugin.defaults = {
    template: '<div class="tooltip" role="tooltip"></div>',
    placement: 'top',
    callback: function() {}
  };

  $.fn.tooltip = Plugin;

})(jQuery);
