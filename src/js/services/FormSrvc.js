'use strict';

function FormSrvc(RESTSrvc, $rootScope) {
  return {
    getFormsList:
      function(baseAuthToken) {
        return RESTSrvc.getPromise( {method: 'GET', url: $rootScope.protocol + $rootScope.server + ":" + $rootScope.port + "/" + $rootScope.webapp + '/form/info?size=500', headers: {'Authorization' : baseAuthToken} });
      },
    // create new form object
    newForm:
      function(form, formType, baseAuthToken) {
        return RESTSrvc.getPromise( {method: 'POST', url: $rootScope.protocol + $rootScope.server + ":" + $rootScope.port + "/" + $rootScope.webapp + '/form/object/' + formType, data: form,
                                     headers: {'Authorization' : baseAuthToken} });
      },
    // update form object
    updateForm:
      function(id, form, formType, baseAuthToken) {
        return RESTSrvc.getPromise( {method: 'PUT', url: $rootScope.protocol + $rootScope.server + ":" + $rootScope.port + "/" + $rootScope.webapp + '/form/object/' + formType + '/' + id, data: form, headers: {'Authorization' : baseAuthToken} });
      },
    // get form object
    getFormMetadata:
      function(formType, baseAuthToken) {
        return RESTSrvc.getPromise( {method: 'GET', url: $rootScope.protocol + $rootScope.server + ":" + $rootScope.port + "/" + $rootScope.webapp + '/form/info/' + formType, headers: {'Authorization' : baseAuthToken} });
      },
    getCatalog:
      function(catalog, baseAuthToken) {
        return RESTSrvc.getPromise( {method: 'GET', url: $rootScope.protocol + $rootScope.server + ":" + $rootScope.port + "/" + $rootScope.webapp + '/form/objects/' + catalog + '/infoclass?size=500', headers: {'Authorization' : baseAuthToken} });
      },
    getCatalogMeta:
      function(catalog, baseAuthToken) {
        return RESTSrvc.getPromise( {method: 'GET', url: $rootScope.protocol + $rootScope.server + ":" + $rootScope.port + "/" + $rootScope.webapp + '/form/info/' + catalog, headers: {'Authorization' : baseAuthToken} });
      },
    getFormObjectsInfo:
      function(formType, baseAuthToken) {
        return RESTSrvc.getPromise( {method: 'GET', url: $rootScope.protocol + $rootScope.server + ":" + $rootScope.port + "/" + $rootScope.webapp + '/form/objects/' + formType + '/info?size=500&orderby=2', headers: {'Authorization' : baseAuthToken} });
      },
    getFormObject:
      function(formType, objectId, baseAuthToken) {
        return RESTSrvc.getPromise( {method: 'GET', url: $rootScope.protocol + $rootScope.server + ":" + $rootScope.port + "/" + $rootScope.webapp + '/form/object/' + formType + '/' + objectId, headers: {'Authorization' : baseAuthToken} });
      },
    deleteObject:
      function(formType, objectId, baseAuthToken) {
        return RESTSrvc.getPromise( {method: 'DELETE', url: $rootScope.protocol + $rootScope.server + ":" + $rootScope.port + "/" + $rootScope.webapp + '/form/object/' + formType + '/' + objectId, headers: {'Authorization' : baseAuthToken} });
      }
  }
}
// resolving minification problems
FormSrvc.$inject = ['RESTSrvc', "$rootScope"];
servicesModule.factory('FormSrvc', FormSrvc);
