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
    }
  }
}]);
