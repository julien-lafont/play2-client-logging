'use strict'

angular.module('app.directives')
.directive('logs', ["$http", function factory($http) {
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
          info: true,
          trace: true
        }
      }
      scope.logs = new Array()
      if(!!window.EventSource) {
        scope.source = new EventSource("http://localhost:9000/logs/live");
      }

      $http.get('/logs/pullAll')
        .success(function(data) {
          scope.$broadcast("resetErrorGauge");
          scope.$broadcast("resetInfoGauge");
          scope.$broadcast("resetTraceGauge");
          scope.logs = []
          for(i in data) data[i].count = 1
          scope.logs.push(data)
        })
        .error(function(err) {
        })

      scope.onMess = function(e) {
        var line = JSON.parse(e.data)
        line.count = 1
        if(line.level=='error') {
          scope.$broadcast("updateErrorGauge");
        }
        if(line.level=='info') {
          scope.$broadcast("updateInfoGauge");
        }
        if(line.level=='trace') {
          scope.$broadcast("updateTraceGauge");
        }
        scope.$apply(function() { scope.logs.unshift(line)} )
      }
      scope.source.onmessage = scope.onMess
      scope.coucou=  function() {
        ChuckNorris_Is_a_Loser = true
      }
    }
  }
}]).filter('filterLogs', function() {
  return function(input, search) {
    var out = Array()
    var match = false
    for(var i in input) {
      if(input[i].level == 'error' && search.level.error == true) match = true
      else if(input[i].level == 'info' && search.level.info == true) match = true
      else if(input[i].level == 'trace' && search.level.trace == true) match = true

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
          var val = (input[i].login != '') ? input[i].login : input[i].ip
          if(val.indexOf(idt[id]) != -1) {
            found++
          }
        }

        var dateFrom = moment(search.dateFrom, 'DD/MM/YY HH:mm:ss')
        if(search.dateFrom != '' && typeof dateFrom != 'undefined' && dateFrom.isValid()) {
          var lDate = moment(input[i].date, 'YYYY-MM-DDTHH:mm:ss')
          if(dateFrom.isBefore(lDate))
            found++
        } else {
          found++
        }

        var dateTo = moment(search.dateTo, 'DD/MM/YY HH:mm:ss')
        if(search.dateTo != '' && typeof dateTo != 'undefined' && dateTo.isValid()) {
          var lDate = moment(input[i].date, 'YYYY-MM-DDTHH:mm:ss')
          if(dateTo.isAfter(lDate))
            found++
        } else {
          found++
        }

        if(found > 4) out.push(input[i])
      }
      match = false
    }
    if(search.unique) {
      var res = []
      for(var i=0;i<out.length;i++) {
        var cur = out[i]
        cur.count = 1
        var duplicate = false
        if(typeof cur.duplicate == 'undefined' || !cur.duplicate) {
          for(var j = i+1; j<out.length; j++) {
            var aim = out[j]
            if(cur.message == aim.message &&
                cur.url == aim.url &&
                (cur.ip == aim.ip || cur.login == aim.login) &&
                cur.level == aim.level) {
                  aim.duplicate = true
                  cur.count++
            }
          }
        }
        if(!cur.duplicate) res.push(cur)
      }
      out = res
    } else {
      for(i in out)
        out[i].count = 1
    }
    return out
  }
}).filter('displayDate', function() {
  return function(input) {
    return moment(input, 'YYYY-MM-DDTHH:mm:ss').format('DD/MM/YY HH:mm:ss')
  }
});


angular.module('app.directives')
.directive('dateF', [function factory() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$parsers.unshift(function(viewValue) {
        var dd = moment(viewValue, 'DD/MM/YY HH:mm:ss')
        if(viewValue =='' || (dd != null && dd.isValid())) {
          ctrl.$setValidity('dateF', true);
          for(var i =0; i<elm.length;i++) {
            elm[i].className = elm[i].className.replace(/has-error/g, '')
          }
          return viewValue
        } else {
          for(var i in elm)
            elm[i].className = elm[i].className+' has-error'
          return undefined;
        }
      });
    }
  };
}]);
