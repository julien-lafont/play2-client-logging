'use strict'

angular.module('app.directives')
.directive('logs', [function factory() {
  return {
    restrict: 'A',
    templateUrl: 'logs/assets/clientlog/views/logs.html',
    link: function link(scope, iElement, iAttrs, controller) {
      scope.search = {
        text: "",
        url: "",
        identifier: "",
        dateFrom: "",
        dateTo: "",
        unique: false,
        level : {
          error: true,
          info: true
        }
      }
      scope.logs = new Array()
      if(!!window.EventSource) {
        scope.source = new EventSource("http://localhost:9000/logs/live");
      }

      scope.onMess = function(e) {
        var line = JSON.parse(e.data)
        if(line.level=='error') line.class="label-danger"
        if(line.level=='info') line.class="label-info"
        scope.$apply(function() { scope.logs.unshift(line)} )
      }
      scope.source.onmessage = scope.onMess
    }
  }
}]).filter('filterLogs', function() {
  return function(input, search) {
    var out = Array()
    var match = false
    for(var i in input) {
      if(input[i].level == 'error' && search.level.error == true) match = true
      else if(input[i].level == 'info' && search.level.info == true) match = true

      if(match) {
        var found = 0
        var words = search.text.split(' ')
        for(var w in words) {
          if(input[i].message.indexOf(words[w]) != -1) {
            found++
          }
        }

        var url = search.url.split(' ')
        for(var f in url) {
          if(input[i].url.indexOf(url[f]) != -1) {
            found++
          }
        }

        var idt = search.identifier.split(' ')
        for(var id in idt) {
          var val = (input[i].ip != '') ? input[i].ip : input[i].login
          if(val.indexOf(idt[id]) != -1) {
            found++
          }
        }

        if(search.dateFrom != '') {
          var dateFrom = moment(search.dateFrom, 'DD/MM/YY HH:mm:ss')

          if(dateFrom.isValid()) {
            var lDate = moment(input[i].date, 'YYYY-MM-DD')
            if(dateFrom.isBefore(lDate))
              found++
          }
        } else {
          found++
        }
        if(search.dateTo != '') {
          var dateTo = moment(search.dateTo, 'DD/MM/YY HH:mm:ss')

          if(typeof dateTo != 'undefined' && dateTo.isValid()) {
            var lDate = moment(input[i].date, 'YYYY-MM-DD')
            if(dateTo.isAfter(lDate))
              found++
          }
        } else {
          found++
        }

        if(found > 3) out.push(input[i])
      }
      match = false
    }
    if(search.unique) {
      var res = []
      for(var i=0;i<out.length;i++) {
        var cur = out[i]
        var duplicate = false
        for(var j = i+1; j< out.length; j++) {
          var aim = out[j]
          if(cur.message == aim.message &&
              cur.url == aim.url &&
              (cur.ip == aim.ip || cur.login == aim.login) &&
              cur.level == aim.level) {
                duplicate = true
              }
        }
        if(!duplicate) res.push(cur)
      }
      out = res
    }
    return out
  }
});


angular.module('app.directives')
.directive('dateF', [function factory() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$parsers.unshift(function(viewValue) {
        var dd = moment(viewValue, 'DD/MM/YY HH:mm:ss')
        if(dd != null && dd.isValid()) {
          ctrl.$setValidity('dateF', true);
          for(var i =0; i<elm.length;i++) {
            var cl = elm[i].className
            elm[i].className = elm[i].className.replace(/invalid/g, '')
          }
          return viewValue
        } else {
          for(var i in elm)
            elm[i].className = elm[i].className+' invalid'
          return undefined;
        }
      });
    }
  };
}]);
