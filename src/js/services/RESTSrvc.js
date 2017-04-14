'use strict';

function RESTSrvc($http, $q) {
    return {
        getPromise:
            function(config) {
                var deferred = $q.defer();

                config.headers['Accept-Language'] = angular.fromJson(localStorage.rflanguage) || 'en-US';

                $http(config)
                    .success(function(data, status, headers, config) {
                        deferred.resolve(data);
                    })
                    .error(function(data, status, headers, config) {
                        deferred.reject(data, status, headers, config);
                    });

            return deferred.promise;
        }
    }
}
// resolving minification problems
RESTSrvc.$inject = ['$http', '$q'];
servicesModule.factory('RESTSrvc', RESTSrvc);
