// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"epB2":[function(require,module,exports) {
var localSite = JSON.parse(localStorage.getItem("localSite")) || [{
  name: 'github',
  logo: "G",
  url: "https://github.com/",
  img: "https://github.com/favicon.ico"
}, {
  name: 'b站',
  logo: "B",
  url: "https://www.bilibili.com",
  img: "https://www.bilibili.com/favicon.ico"
}];
var $siteList = $(".siteList");
var $lastLi = $(".last");
var $modelWrap = $('.modelWrap');
var $model = $('.model');
var isTouchDevice = ("ontouchstart" in document.documentElement);

var manageLogo = function manageLogo(site) {
  if (site.img) {
    return "<img src='".concat(site.img, "'/>");
  } else {
    return site.logo;
  }
};

var simplyUrl = function simplyUrl(url) {
  return url.replace("https://", "").replace("http://", "").replace("www.", "").replace(/\/.*/, "");
};

var renderSite = function renderSite() {
  $siteList.find('li:not(".last")').remove();
  localSite.forEach(function (site, index) {
    var $site = $("<li>\n      <div class=\"site\">\n        <div class=\"logo\">".concat(manageLogo(site), "</div>\n        <div class=\"link\">").concat(site.name, "</div>\n        <div class='delete ").concat(isTouchDevice ? '' : 'hide', "'>\n          <svg class=\"icon\">\n            <use xlink:href=\"#icon-delete\"></use>\n          </svg>\n        </div>\n      </div>\n    </li>")).insertBefore($lastLi);
    $site.on("click", function (e) {
      window.open(site.url);
    });
    $site.on("click", ".delete", function (e) {
      e.stopPropagation();
      localSite.splice(index, 1);
      renderSite();
      return;
    });
  });
  showOrHideAddButton();
};

var showOrHideAddButton = function showOrHideAddButton() {
  if (localSite.length >= 10) {
    $(".last").addClass('hide');
  } else {
    $(".last").removeClass('hide');
  }
};

$(".addButton").on("click", function () {
  $modelWrap.removeClass('hide');
});
$('.model .cancel-button').click(function () {
  $model.find('input[type=text]').val('');
  $modelWrap.addClass('hide');
});
$('.model .ensure-button').click(function () {
  var siteNameVal = $('[name=siteName]').val().trim();
  var siteUrlVal = $('[name=siteUrl]').val().trim();

  if (siteUrlVal.indexOf('https://') === -1) {
    siteUrlVal = 'https://' + siteUrlVal;
  }

  if (siteUrlVal[siteUrlVal.length - 1] !== '/') {
    siteUrlVal = siteUrlVal + '/';
  }

  var siteImg = siteUrlVal + 'favicon.ico'; //测试图片

  img.setAttribute('src', siteImg);

  img.onload = function () {
    localSite.push({
      name: siteNameVal,
      logo: simplyUrl(siteUrlVal)[0].toUpperCase(),
      url: siteUrlVal,
      img: siteImg
    });
    render();
  };

  img.onerror = function () {
    localSite.push({
      name: siteNameVal,
      logo: simplyUrl(siteUrlVal)[0].toUpperCase(),
      url: siteUrlVal
    });
    render();
  };

  function render() {
    renderSite();
    $model.find('input[type=text]').val('');
    $modelWrap.addClass('hide');
  }
});
$model.find('input[type=text]').on('keyup', function (e) {
  var siteNameVal = $('[name=siteName]').val().trim();
  var siteUrlVal = $('[name=siteUrl]').val().trim();

  if (siteNameVal === '' || siteUrlVal === '') {
    $('.ensure-button').attr('disabled', true);
  } else {
    $('.ensure-button').removeAttr("disabled");
  }
});
renderSite();

window.onbeforeunload = function () {
  localStorage.setItem("localSite", JSON.stringify(localSite));
};

$(document).on('keypress', function (e) {
  var targetName = e.target.getAttribute('name');
  if (targetName === 'wd' || targetName === 'siteName' || targetName === 'siteUrl') return;
  var key = e.key;
  localSite.forEach(function (site) {
    if (site.logo.toLowerCase() === key.toLowerCase()) {
      window.open(site.url);
    }
  });
});
},{}]},{},["epB2"], null)
//# sourceMappingURL=main.1e859c7b.js.map