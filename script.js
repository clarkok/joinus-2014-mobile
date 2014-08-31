"use strict";
(function (w, $) {
  var test_ele = $('#notice').css({
    width : '100vw'
  });

  if (test_ele.width() !== $(w).width()) {
    console.log('old');
    $('<link />').attr({
      rel: 'stylesheet',
      type: 'text/css',
      href: 'style-old.css'
    }).appendTo('head');
  }

  $('#notice').css({
    width : ''
  });
})(window, window.jQuery);

(function (w, $) {
  var Notifier = function () {
    this.target = $('#notice');
    this.context = this.target.find('#notice-content');
    this.target.removeClass('show');
    this.r = 0;
    this.target.on('click', function () {
      $(this).removeClass('show error');
    });
  };

  Notifier.prototype.notice = function (txt) {
    w.clearTimeout(this.r);
    var _this = this;
    this.context.html(txt);
    this.target.addClass('show');
    this.target.removeClass('error');
    this.r = w.setTimeout(function () {
      _this.target.removeClass('show');
    }, 5000);
  };

  Notifier.prototype.error = function (txt) {
    w.clearTimeout(this.r);
    var _this = this;
    this.context.html(txt);
    this.target.addClass('show error');
    this.r = w.setTimeout(function () {
      _this.target.removeClass('show error');
    }, 5000);
  };

  w.Notifier = Notifier;
})(window, window.jQuery);

(function (w, $) {
  $('input[type=text]').on('focus', function () {
    $(this).parents('.input').addClass('focus');
  }).on('blur', function () {
    if ($(this).val().length > 0)
      $(this).parents('.input').addClass('focus');
    else
      $(this).parents('.input').removeClass('focus');
  }).on('blur');

  $('select').on('change', function () {
    $(this).parents('.input').children('label').text($(this).children('[value='+$(this).val()+']').text());
  }).trigger('change');

  $('.input-select').on('click', function () {
    console.log('click');
    $(this).find('select').focus();
  });
  $('select').on('click', function (e) {
    e.stopPropagation();
  });

  var notifier = new w.Notifier();

  $('#joinus-wrapper').on('submit', function (e) {
    e.preventDefault();
    w.location.hash = '#intro';
    $('.error').removeClass('error');
    console.log($(this).attr('action'));
    $.post($(this).attr('action'), $(this).serialize(), function (data) {
      if (data.code == 1) {
        notifier.error('提交失败，请稍后重试');
      }
      else if (data.code == 2) {
        notifier.error('表单中有错误，<a href="#joinus">点击查看</a>');
        var l = data.error_list.length;
        for (var i = 0; i < l; ++i) {
          $('#input-' + data.error_list[i]).addClass('error');
        }
      }
      else if (data.code == -1) {
        w.location.hash = '#detail-tech';
        notifier.notice('年轻人有前途，快加入技术研发中心吧');
      }
      else {
        notifier.notice('提交成功');
        $('.error').removeClass('error');
      }
    }, 'json');
  });

  $('.input-submit .button').on('click', function () {
    console.log('submit');
    $(this).parents('form').trigger('submit');
  });

  if (w.location.hash.length <= 1) {
    w.location.hash = '#intro';
  }
})(window, window.jQuery);
