'use strict';

// Session service
function SessionSrvc(RESTSrvc, $rootScope) {    
  return {
    // save worklist object
    logout:
      function(baseAuthToken) {
        return RESTSrvc.getPromise( {method: 'GET', url: "http://" + $rootScope.server + ":" + $rootScope.port + "/" + $rootScope.webapp + '/logout', headers: {'Authorization' : baseAuthToken} });
      }
  }
}
// resolving minification problems
SessionSrvc.$inject = ['RESTSrvc', '$rootScope'];
servicesModule.factory('SessionSrvc', SessionSrvc);
