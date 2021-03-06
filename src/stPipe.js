ng.module('smart-table')
  .directive('stPipe', ['stConfig', '$timeout', function (config, $timeout) {
    return {
      require: 'stTable',
      scope: {
        stPipe: '='
      },
      link: {

        pre: function (scope, element, attrs, ctrl) {

          var pipePromise = null;
          var pipeEvent = attrs.stPipeEvent || config.pipe.pipeEvent;

          if (ng.isFunction(scope.stPipe)) {
            ctrl.preventPipeOnWatch();
            ctrl.pipe = function () {

              if (pipePromise !== null) {
                $timeout.cancel(pipePromise)
              }

              pipePromise = $timeout(function () {
                scope.stPipe(ctrl.tableState(), ctrl);
              }, config.pipe.delay);

              return pipePromise;
            }

            if (pipeEvent) {
              scope.$on(pipeEvent, function () {
                  ctrl.pipe();
              });
            }
          }
        },

        post: function (scope, element, attrs, ctrl) {
          var pipeOnLoad = attrs.stExecutePipeOnLoad === "false" ? false : config.pipe.executePipeOnLoad;
          if (pipeOnLoad) {
            ctrl.pipe();
          }
        }
      }
    };
  }]);
