// Generated by CoffeeScript 1.4.0
(function() {
  var jqel, yeti;

  tinymce.PluginManager.requireLangPack('yeti');

  tinymce.create('tinymce.plugins.yeti', {
    init: function(ed, url) {
      ed.addCommand('yeti', function() {
        return yeti.show();
      });
      ed.addButton('yeti', {
        title: 'Yeti YouTube Search',
        cmd: 'yeti',
        image: window.yeti_icon
      });
      return ed.addShortcut('alt+shift+y', ed.getLang('yeti'), 'yeti');
    },
    getInfo: function() {
      return {
        longname: 'WordPress Yeti YouTube Search',
        author: 'Adam Mesha',
        authorurl: 'http://www.mesha.org',
        infourl: 'https://github.com/sagittarian/yeti',
        version: "0.1"
      };
    }
  });

  tinymce.PluginManager.add('yeti', tinymce.plugins.yeti);

  jqel = function($) {
    var attrletters, el, tagletters;
    tagletters = 'a-zA-Z0-9';
    attrletters = tagletters + '_-';
    el = $.el = function(tag, attrs) {
      var $el, attr, classes, cls, id, rest, sigil, signs, split, val, _i, _j, _len, _len1;
      if (tag == null) {
        tag = '';
      }
      if (attrs == null) {
        attrs = {};
      }
      classes = [];
      split = tag.match(RegExp("^([" + tagletters + "]*)(([#.][" + attrletters + "]+)*)$"));
      tag = split[1] ? split[1] : 'div';
      if (split[2] != null) {
        signs = split[2].match(RegExp("([#.][" + attrletters + "]+)", "g"));
        if (signs != null) {
          for (_i = 0, _len = signs.length; _i < _len; _i++) {
            attr = signs[_i];
            sigil = attr.slice(0, 1);
            rest = attr.slice(1);
            if (sigil === '#') {
              id = rest;
            } else {
              classes.push(rest);
            }
          }
        }
      }
      $el = $(document.createElement(tag));
      for (_j = 0, _len1 = classes.length; _j < _len1; _j++) {
        cls = classes[_j];
        $el.addClass(cls);
      }
      if (id != null) {
        $el.attr('id', id);
      }
      for (attr in attrs) {
        val = attrs[attr];
        if (attr === 'text' || attr === 'html' || attr === 'val') {
          $el[attr](val);
        } else {
          $el.attr(attr, val);
        }
      }
      return $el;
    };
    $.fn.el = function(tag, attrs) {
      return el(tag, attrs).appendTo(this);
    };
    $.fn.appendEl = function(tag, attrs) {
      return this.append(el(tag, attrs));
    };
    return el;
  };

  yeti = (function($) {
    var $controls, $nextbtn, $prevbtn, $resultarea, $resultinfo, $results, $searchbox, $searchbtn, $searchlabel, $searchwidget, $start, $stop, $total, $window, $yeti, $yeti_iframe, $yeti_player, apiurl, default_max_results, el, fetch_query, iframe_height, iframe_width, query, set_search_results, show_player, submitsearch, wheight, wwidth, youtube_item;
    el = jqel($);
    iframe_width = 560;
    iframe_height = 315;
    default_max_results = 10;
    apiurl = 'https://gdata.youtube.com/feeds/api/videos';
    query = {
      key: 'AI39si7j4ZTYLG5G7FETVf--y8c8PcPG2qLUzIoKEvlsxYxs0p6vSPjQG4Av_VZVA1XmJ_AHGSwaAI5xJ67H9D1BB_X4FCE3rw',
      v: 2,
      alt: 'jsonc',
      q: '',
      'max-results': default_max_results,
      'start-index': 1
    };
    $yeti = el('#yeti').appendTo('body');
    $searchwidget = el('#yeti-searchwidget').appendTo($yeti);
    $searchlabel = el('label', {
      "for": 'yeti-searchbox',
      text: 'Search:'
    }).appendTo($searchwidget);
    $searchbox = el('input#yeti-searchbox', {
      type: 'text'
    }).appendTo($searchwidget);
    $searchbtn = el('input#yeti-searchbtn', {
      type: 'submit'
    }).appendTo($searchwidget);
    $results = $yeti.appendEl('hr').el('#yeti-results').hide();
    $total = el('span');
    $start = el('span');
    $stop = el('span');
    $resultinfo = $results.el('#yeti-result-info').append('Results ', $start, ' - ', $stop, ' of ', $total);
    $results.appendEl('hr');
    $resultarea = el('#yeti-results').appendTo($results);
    $nextbtn = el('button#yeti-next', {
      text: 'Next'
    });
    $prevbtn = el('button#yeti-prev', {
      text: 'Prev'
    });
    $controls = $results.el('.controls').append($prevbtn, $nextbtn);
    $yeti_player = el('#yeti-player').appendTo('body');
    $yeti_iframe = $yeti_player.el('iframe#yeti-iframe', {
      width: iframe_width,
      height: iframe_height,
      frameborder: 0,
      allowfullscreen: ''
    });
    $yeti_player.el('button#yeti-back', {
      text: 'Back'
    }).click(function() {
      $yeti_player.dialog('close');
      return $yeti.dialog('open');
    });
    $yeti_player.el('button#yeti-insert', {
      text: 'Insert'
    }).click(function() {
      var s, vid;
      vid = $yeti_player.data('vid');
      $yeti_player.dialog('close');
      s = "[embed]http://www.youtube.com/watch?v=" + vid + "[/embed]";
      return tinyMCE.activeEditor.selection.setContent(s);
    });
    youtube_item = function(item) {
      var $a, $item, minutes, rating, seconds;
      $item = el('.yeti-item');
      $a = el('a', {
        href: item.player["default"]
      }).data('vid', item.id).appendTo($item).appendEl('img', {
        src: item.thumbnail.sqDefault
      });
      minutes = Math.floor(item.duration / 60);
      seconds = item.duration % 60;
      rating = Math.round(item.rating * 100) / 100;
      $item.append("<ul>\n  <li class=\"title\">" + item.title + "</li>\n  <li>" + item.description + "</li>\n  <li><span class=\"label\">Uploaded:</span> " + item.uploaded + "</li>\n  <li><span class=\"label\">Uploader:</span> " + item.uploader + "</li>\n  <li><span class=\"label\">Duration:</span> " + minutes + ":" + seconds + "</li>\n  <li><span class=\"label\">Rating:</span> " + rating + "</li>\n</ul>");
      return $item;
    };
    show_player = function(ev) {
      var src, vid;
      vid = $(ev.currentTarget).data('vid');
      $yeti_player.data('vid', vid);
      src = "http://www.youtube.com/embed/" + vid + "?rel=0";
      $yeti.dialog('close');
      $yeti_player.dialog('open');
      $yeti_iframe.attr('src', src);
      return false;
    };
    set_search_results = function(data) {
      var item, _i, _len, _ref;
      $results.show();
      $total.text(data.data.totalItems);
      $start.text(data.data.startIndex);
      $stop.text(data.data.startIndex + data.data.itemsPerPage - 1);
      $resultarea.empty();
      _ref = data.data.items;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        $resultarea.append(youtube_item(item), el('hr'));
      }
      return $resultarea.find('a').click(show_player);
    };
    fetch_query = function() {
      return $.getJSON(apiurl, query, set_search_results);
    };
    submitsearch = function() {
      query.q = $searchbox.val();
      query['start-index'] = 1;
      return fetch_query();
    };
    $searchbtn.click(submitsearch);
    $searchbox.keypress(function(ev) {
      if (ev.keyCode === 13) {
        return submitsearch();
      }
    });
    $prevbtn.click(function() {
      if (query['start-index'] - query['max-results'] > 0) {
        query['start-index'] -= query['max-results'];
        return fetch_query();
      }
    });
    $nextbtn.click(function() {
      if (query['start-index'] + query['max-results'] <= parseInt($total.text())) {
        query['start-index'] += query['max-results'];
        return fetch_query();
      }
    });
    $window = $(window);
    wheight = $window.height();
    wwidth = $window.width();
    $yeti.dialog({
      autoOpen: false,
      modal: true,
      width: wwidth * 0.8,
      height: wheight * 0.8,
      dialogClass: 'wp-dialog',
      title: 'Yeti Youtube Search'
    });
    $yeti_player.dialog({
      autoOpen: false,
      modal: true,
      width: iframe_width + 100,
      height: iframe_height + 120,
      dialogClass: 'wp-dialog',
      title: 'Yeti Youtube Search',
      close: function(event, ui) {
        $yeti_iframe.removeAttr('src');
        return $yeti_player.data('vid', null);
      }
    });
    return {
      show: function() {
        return $yeti.dialog('open');
      }
    };
  })(jQuery);

}).call(this);
