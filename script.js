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
  var start_time = new Date();
  var fill_time;

  $(w).on('hashchange', function () {
    if (w.location.hash == '#joinus')
      fill_time = new Date();
  });

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
    var current = new Date();
    $('#input-fill').val(current - fill_time);
    $('#input-view').val(current - start_time);
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
    $(this).parents('form').trigger('submit');
  });

  $('.input-file .button').on('click', function () {
    $(this).parents('.input-file').find('input[type=file]').trigger('click');
  });

  $('input[type=file]').fileupload({
    url : '../upload.php',
    add : function (e, data) {
      if ($('input[name=id]').val().length) {
        if (data.files[0].size > 15 * 1024 * 1024) {
          alert('每个文件最大15M，更大可以传网盘嗷');
        }
        $('#list').append(
          data.list_item_jquery = $('<li />').addClass('list-item').text(data.files[0].name).css('color', 'grey')
        );
        data.process().done(function () {
          data.submit();
        });
      }
      else {
        alert('请先填写学号');
        return false;
      }
    },
    done : function (e, data) {
      data.list_item_jquery.css('color', 'black');
    }
  }).bind('fileuploadsubmit', function (e, data) {
    if ($('input[name=id]').val().length) {
      data.formData = {
        id : $('input[name=id]').val()
      };
      return true;
    }
    else {
      alert('ID first');
      return false;
    }
  });

  if (w.location.hash.length <= 1) {
    w.location.hash = '#intro';
  }
})(window, window.jQuery);
