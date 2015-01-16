(function() {
  'use strict';

  var Tooltip = function(element, options) {
    this.$trigger = $(element);
    this.options = options || {};
    this.id = this.generateId();
    this.visible = false;
  };

  Tooltip.prototype.init = function() {
    // On event in, show tooltip
    this.$trigger.on('mouseenter focusin', $.proxy(this.show, this));

    // On event out, hide tooltip
    this.$trigger.on('mouseleave focusout', $.proxy(this.hide, this));
  };

  Tooltip.prototype.generateId = function() {
    return 'tooltip' + Math.floor((Math.random() * 1000) + 1) + Date.now().toString().slice(7);
  };

  Tooltip.prototype.show = function(e) {
    if (this.visible) { return; }

    // Create tooltip
    var $tooltip = $($.parseHTML(this.options.template));

    $tooltip
      .attr('id', this.id)
      .addClass('tooltip-' + this.options.placement)
      .addClass(this.options.state ? 'tooltip-' + this.options.state : null);

    // Show event
    var showEvent = $.Event('show.lt.tooltip', {
      relatedTarget: $tooltip
    });
    this.$trigger.trigger(showEvent);

    // Allow event to be prevented
    if (showEvent.isDefaultPrevented()) { return; }

    // Show tooltip
    $tooltip
      .appendTo(document.body)
      .offset(this.getOffset($tooltip));

    this.visible = true;

    this.$trigger.attr('aria-labelledby', this.id);

    // Get title
    this.getTitle($tooltip).then(
      function(options) {
        if (typeof options === 'object') {
          this.options = $.extend(this.options, options);
        }
        else {
          this.options.title = options.toString();
        }

        // Set content
        if (this.options.html) {
          $tooltip
            .find('.tooltip-content')
            .html(this.options.title);
        } else {
          $tooltip
            .find('.tooltip-content')
            .text(this.options.title);
        }

        // Update classes and re-center
        $tooltip
          .addClass(this.options.state ? 'tooltip-' + this.options.state : null)
          .addClass('tooltip-' + this.options.placement)
          .offset(this.getOffset($tooltip));

        this.options.onShow.call(this, this.$trigger, $tooltip);
      }.bind(this),
      function(err, options) {
        $tooltip
          .find('.tooltip-content')
          .text(err && err.message ? err.message : 'Error');

        $tooltip
          .addClass('tooltip-error')
          .offset(this.getOffset($tooltip));

        this.options.onShow.call(this, this.$trigger, $tooltip);
      }.bind(this)
    );

    // Shown event
    var shownEvent = $.Event('shown.lt.tooltip', {
      relatedTarget: $tooltip
    });
    this.$trigger.trigger(shownEvent);
  };

  Tooltip.prototype.getTitle = function($tooltip) {
    var deferred = $.Deferred();

    if (typeof this.options.title === 'string') {
      deferred.resolve(this.options.title);
    }
    else if (typeof this.options.title === 'function') {
      $.when(this.options.title.call(this, $tooltip, this.$trigger)).then(function(result) {
        deferred.resolve(result);
      }, function(err) {
        deferred.reject(err);
      });
    }
    else if (typeof this.options.title === 'object') {
      $.when(this.options.title).then(function(result) {
        deferred.resolve(result);
      }, function(err) {
        deferred.reject(err);
      });
    }
    else {
      deferred.resolve(this.$trigger.attr('title'));
    }

    return deferred;
  };

  Tooltip.prototype.getOffset = function($tooltip) {
    var coords = this.$trigger.offset();
    var position = this.options.placement;

    var top = coords.top;
    var left = coords.left;

    var height = this.$trigger.outerHeight();
    var width = this.$trigger.outerWidth();

    var tooltipHeight = $tooltip.outerHeight();
    var tooltipWidth = $tooltip.outerWidth();

    var result = {
      top: top,
      left: left
    };

    if (position === 'top' || position === 'bottom') {
      result.left = left + Math.floor(width / 2) - Math.floor(tooltipWidth / 2);
    }

    if (position === 'right' || position === 'left') {
      result.top = top + Math.floor(height / 2) - Math.floor(tooltipHeight / 2);
    }

    if (position === 'top') {
      result.top = top - tooltipHeight;
    }
    else if (position === 'right') {
      result.left = left + width;
    }
    else if (position === 'bottom') {
      result.top = top + height;
    }
    else if (position === 'left') {
      result.left = left - tooltipWidth;
    }

    return result;
  };

  Tooltip.prototype.hide = function(e) {
    if (!this.visible) { return; }
    var $tooltip = $('#' + this.id);

    // Hide event
    var hideEvent = $.Event('hide.lt.tooltip', {
      relatedTarget: $tooltip
    });
    this.$trigger.trigger(hideEvent);

    // Allow event to be prevented
    if (hideEvent.isDefaultPrevented()) { return; }

    // Set state and remove tooltip
    this.visible = false;

    $tooltip.remove();
    this.$trigger.attr('aria-labelledby', null);

    this.options.onHide.call(this, this.$trigger);

    // Hidden event
    var hiddenEvent = $.Event('hidden.lt.tooltip', {
      relatedTarget: $tooltip
    });
    this.$trigger.trigger(hiddenEvent);
  };

  // Define jQuery plugin
  function Plugin(method) {
    return this.each(function() {
      var $this = $(this);
      var settings = $.extend({}, Plugin.defaults, $this.data(), typeof method === 'object' && method);

      var data = $this.data('lt.tooltip');

      if (!data) {
        data = new Tooltip(this, settings);
        $this.data('lt.tooltip', data);
      }
      if (typeof method === 'string') {
        data[method]();
      } else {
        data.init();
      }
    });
  }

  Plugin.defaults = {
    onShow: function() {},
    onHide: function() {},
    html: false,
    state: null,
    placement: 'top',
    template: '<div class="tooltip" role="tooltip"><div class="tooltip-content">Loading...</div></div>'
  };

  $.fn.tooltip = Plugin;

})(jQuery);
