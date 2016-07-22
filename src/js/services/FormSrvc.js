'use strict'; 

function FormSrvc(RESTSrvc) {    
  return {
    getFormsList:
      function(baseAuthToken) {
        return RESTSrvc.getPromise( {method: 'GET', url: RESTWebApp.appName + '/form/info?size=500', headers: {'Authorization' : baseAuthToken} });
      },
    // create new form object
    newForm:
      function(form, formType, baseAuthToken) {
        return RESTSrvc.getPromise( {method: 'POST', url: RESTWebApp.appName + '/form/object/' + formType, data: form, 
                                     headers: {'Authorization' : baseAuthToken} });
      },
    // update form object
    updateForm: 
      function(id, form, formType, baseAuthToken) {
        return RESTSrvc.getPromise( {method: 'PUT', url: RESTWebApp.appName + '/form/object/' + formType + '/' + id, data: form, headers: {'Authorization' : baseAuthToken} });
      },
    // get form object
    getFormMetadata:
      function(formType, baseAuthToken) {
        return RESTSrvc.getPromise( {method: 'GET', url: RESTWebApp.appName + '/form/info/' + formType, headers: {'Authorization' : baseAuthToken} });
      },
    getCatalog: 
      function(catalog, baseAuthToken) {
        return RESTSrvc.getPromise( {method: 'GET', url: RESTWebApp.appName + '/form/objects/' + catalog + '/infoclass?size=500', headers: {'Authorization' : baseAuthToken} });
      },
    getCatalogMeta: 
      function(catalog, baseAuthToken) {
        return RESTSrvc.getPromise( {method: 'GET', url: RESTWebApp.appName + '/form/info/' + catalog, headers: {'Authorization' : baseAuthToken} });
      },
    getFormObjectsInfo: 
      function(formType, baseAuthToken) {
        return RESTSrvc.getPromise( {method: 'GET', url: RESTWebApp.appName + '/form/objects/' + formType + '/info?size=500&orderby=2', headers: {'Authorization' : baseAuthToken} });
      },
    getFormObject: 
      function(formType, objectId, baseAuthToken) {
        return RESTSrvc.getPromise( {method: 'GET', url: RESTWebApp.appName + '/form/object/' + formType + '/' + objectId, headers: {'Authorization' : baseAuthToken} });
      },
    deleteObject:
      function(formType, objectId, baseAuthToken) {
        return RESTSrvc.getPromise( {method: 'DELETE', url: RESTWebApp.appName + '/form/object/' + formType + '/' + objectId, headers: {'Authorization' : baseAuthToken} });
      }
  }
}
// resolving minification problems
FormSrvc.$inject = ['RESTSrvc'];
servicesModule.factory('FormSrvc', FormSrvc);
