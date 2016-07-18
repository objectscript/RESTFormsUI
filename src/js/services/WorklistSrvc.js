'use strict';

// Worklist service
function WorklistSrvc(RESTSrvc) {
  return {
    // save worklist object
    save:
        function(worklist, baseAuthToken) {
            return RESTSrvc.getPromise( {method: 'POST', url: RESTWebApp.appName + '/tasks/' + worklist._id, data: worklist,
                                         headers: {'Authorization' : baseAuthToken} });
        },

    // get worklist by id
    get:
        function(id, baseAuthToken) {
            return RESTSrvc.getPromise( {method: 'GET', url: RESTWebApp.appName + '/tasks/' + id,headers: {'Authorization' : baseAuthToken} });
        },

    // get all worklists for current user
    getAll:
        function(baseAuthToken) {
            return RESTSrvc.getPromise( {method: 'GET', url: RESTWebApp.appName + '/tasks', headers: {'Authorization' : baseAuthToken} });
        },
    createTask:
        function(bptype, baseAuthToken) {
            return RESTSrvc.getPromise( {method: 'GET', url: RESTWebApp.appName + '/createdataentrybp/' + bptype, headers: {'Authorization' : baseAuthToken} });
        },
    getObjectsList:
        function(ids, formType, baseAuthToken) {
            return RESTSrvc.getPromise( {method: 'POST', url: RESTWebApp.appName + '/form/objects/' + formType + '/info', data: ids, headers: {'Authorization' : baseAuthToken} });
        }
  }
};

// resolving minification problems
WorklistSrvc.$inject = ['RESTSrvc'];
servicesModule.factory('WorklistSrvc', WorklistSrvc);
