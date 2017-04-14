'use strict';

// Session service
function SessionSrvc(RESTSrvc, $rootScope) {
  return {
    logout:
      function(baseAuthToken) {
        return RESTSrvc.getPromise( {method: 'GET', url: "http://" + $rootScope.server + ":" + $rootScope.port + "/" + $rootScope.webapp + '/logout', headers: {'Authorization' : baseAuthToken} });
      },

    getLanguageList:
    function(baseAuthToken) {
      return RESTSrvc.getPromise( {method: 'GET', url: "http://" + $rootScope.server + ":" + $rootScope.port + "/" + $rootScope.webapp + '/info', headers: {'Authorization' : baseAuthToken} });
    }
  }
}
// resolving minification problems
SessionSrvc.$inject = ['RESTSrvc', '$rootScope'];
servicesModule.factory('SessionSrvc', SessionSrvc);
