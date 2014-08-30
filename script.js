"use strict";
(function (w, $) {
  $('input[type=text]').on('focus', function () {
    $(this).parents('.input').addClass('focus');
  }).on('blur', function () {
    if ($(this).val().length > 0)
      $(this).parents('.input').addClass('focus');
    else
      $(this).parents('.input').removeClass('focus');
  }).on('blur');

  $('.input-select').on('click', function () {
    $(this).find('select').trigger('click');
  });
  $('select').on('click', function (e) {
    e.stopPropagation();
  });
})(window, window.jQuery);
