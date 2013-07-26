'use strict'

angular.module('app.directives')
.directive('logs', [function factory() {
  return {
    restrict: 'A',
    templateUrl: 'logs/assets/clientlog/views/logs.html',
    link: function link(scope, iElement, iAttrs, controller) {
      scope.logs = new Array()
      if(!!window.EventSource) {
        scope.source = new EventSource("http://localhost:9000/logs/live");
      }

      scope.onMess = function(e) {
        var line = JSON.parse(e.data)
        scope.$apply(function() { scope.logs.push(line)} )
      }
      scope.source.onmessage = scope.onMess
    }
  }
}]);
