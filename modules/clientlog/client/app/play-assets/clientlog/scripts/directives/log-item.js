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
        if(scope.item.level == 'trace') return 'label-default'
        if(scope.item.level == 'info') return 'label-info'
        if(scope.item.level == 'warn') return 'label-warning'
      }
      scope.getIdentifier = function() {
        if(scope.item.login != '') return scope.item.login
        if(scope.item.ip == '0:0:0:0:0:0:0:1%0') return 'localhost'
        return scope.item.ip
      }
      scope.line = function() {
        if(scope.item.line != '') return ":"+scope.item.line
        return ""
      }
    }
  }
}]);
