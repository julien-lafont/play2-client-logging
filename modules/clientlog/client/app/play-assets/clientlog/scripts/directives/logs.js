'use strict'

angular.module('app.directives')
.directive('logs', [function factory() {
  return {
    restrict: 'A',
    templateUrl: 'logs/assets/clientlog/views/logs.html',
    link: function link(scope, iElement, iAttrs, controller) {
      scope.search = {
        text: "",
        file: "",
        identifier: "",
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

      for(var i = 0;i<100;i++)
        if(i%7>2) scope.logs.push({
          level:'error',
          date: '03/98/56 14:45',
          file: 'index.js',
          line: '45',
          login: 'jean.dupont',
          ip: '127.0.0.1',
          message:'hihihihihihih',
          class:'label-danger'
        })
        else scope.logs.push({level:'info',
          date: '01/01/13 14:45',
          file: 'main.html',
          line: '1',
          login: '',
          ip: '192.67.01.23',
          message:'hihihihihihih', class:'label-info'})
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

        var file = search.file.split(' ')
        for(var f in file) {
          if(input[i].file.indexOf(file[f]) != -1) {
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

        if(found > 2) out.push(input[i])
      }
      match = false
    }
    return out
  }
});
