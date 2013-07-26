'use strict'

angular.module('app.directives')
.directive('logItem', [function factory() {
  return {
    restrict: 'A',
    templateUrl: 'logs/assets/clientlog/views/log-item.html',
    scope : {
      item : '='
    },
    link: function link(scope, iElement, iAttrs, controller) {
      scope.getClass = function() {
        if(scope.item.level == 'error') return 'label-danger'
        if(scope.item.level == 'info') return 'label-info'
      }
      scope.getIdentifier = function() {
        if(scope.item.login != '') return scope.item.login
        return scope.item.ip
      }
    }
  }
}]);
