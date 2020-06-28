$(function(){

// The HTML has aria-hidden="false" so accessibility tools can traverse the
// popup even when JS is disabled. With JS enabled, clicks on the buttons
// toggle the popup (as opposed to depending on focus), so an explicit
// aria-hidden override is no longer needed.
$('.filter-button-wrapper .filter-popup').removeAttr('aria-hidden');

$('.filter-button-wrapper .filter-popup').on('mouseover', 'a', function() {
  this.focus();
});

var onFilterButtonClick = function(event) {
  var buttonWrapper = $(this);
  var popup = buttonWrapper.find('.filter-popup').first();
  if (!popup) {
    return;
  }
  // Ignore clicks inside this button's popup.
  if ($(event.target).closest(popup).length) {
    return;
  }

  var getLinks = function() {
    return popup.find('li a');
  };

  var showPopup = function() {
    popup.show();
    buttonWrapper.attr('aria-expanded', 'true');
    var firstItemLink = getLinks().first();
    setTimeout(function() {
      firstItemLink.focus();
    }, 10);
    $(document).on('click', closePopupOnClickOutside);
    $(buttonWrapper).on('keydown', closePopupOnEscape);
    $(popup).on('keydown', handleArrowKeyNavigation);
  };

  var hidePopup = function() {
    popup.hide();
    buttonWrapper.attr('aria-expanded', 'false');
    $(document).off('click', closePopupOnClickOutside);
    $(buttonWrapper).off('keydown', closePopupOnEscape);
    $(popup).off('keydown', handleArrowKeyNavigation);
  };

  var closePopupOnClickOutside = function(event) {
    var isInsideButton = $(event.target).closest(buttonWrapper).length;
    if (!isInsideButton) {
      hidePopup();
    }
  };

  var closePopupOnEscape = function(event) {
    if (event.which === 27) {
      // Escape
      hidePopup();
      buttonWrapper.focus();
    }
  };

  var handleArrowKeyNavigation = function(event) {
    if (event.which === 38) {  // ArrowUp
      advanceFocus(-1);
    } else if (event.which === 40) {  // ArrowDown
      advanceFocus(1);
    } else {
      return;
    }
    event.preventDefault();
  };

  var advanceFocus = function(by) {
    var links = getLinks();
    var currentLinkIndex = links.toArray().indexOf(document.activeElement);
    if (currentLinkIndex < 0) {
      return;
    }
    var newLinkIndex = currentLinkIndex + by;
    if (newLinkIndex >= 0 && newLinkIndex < links.length) {
      links.eq(newLinkIndex).focus();
    }
  };

  if (popup.css('display') === 'none') {
    showPopup();
  } else {
    hidePopup();
  }
  event.preventDefault();
};

var onFilterButtonKeydown = function(event) {
  if (event.which === 32 || event.which === 13) {  // Space or Enter
    onFilterButtonClick.call(this, event);
  }
};

$('.filter-button-wrapper')
    .on('click', onFilterButtonClick)
    .on('keydown', onFilterButtonKeydown);

});
