/// Main controller
/// Controls the authentication. Loads all the worklists for user.
function MainCtrl($s, $state, $cookies, FormSrvc, SessionSrvc, UtilSrvc, $timeout) {
    'use strict';

/*===============================================================
                       VARIABLES INITIALIZATION
===============================================================*/

    $s.main = {};
    $s.utils = UtilSrvc;
    $.loginError = false;

    var main = $s.main;

    main.loading = false;
    main.busy = false;
    main.loadingClass = '';
    main.loginState = $cookies['Token'] ? 1 : 0;
    main.authToken = $cookies['Token'];

    main.showBusyDimmer = function() { main.busy = true };
    main.hideBusyDimmer = function() { main.busy = false };
    main.isLoggedIn = function() { return !!main.loginState };

    $s.extensionsCSS = {
        'pdf'  : 'pdf',
        'txt'  : 'text',
        'ppt'  : 'powerpoint',
        'pptx' : 'powerpoint',
        'pps'  : 'powerpoint',
        'doc'  : 'word',
        'docx' : 'word',
        'jpg'  : 'image',
        'xls'  : 'excel',
        'xlsx' : 'excel'
    };

/*===============================================================
                        PRIVATE FUNCTIONS
===============================================================*/

    /// Creates string for BaseAuth HTTP header
    function makeBaseAuth(user, password) {
        var token = user + ':' + password;
        var hash = Base64.encode(token);
        return 'Basic ' + hash;
    }

/*===============================================================
                        EXPORTED FUNCTIONS
===============================================================*/

    $s.getErrorText = function(err) {
        return (err && err.summary) ? err.summary : '';
    };

    $s.closeObject = function() {
        $s.$broadcast('closeObject');
    };

    /// Goes to specified state
    main.goState = function(state) {
        main.showBusyDimmer();
        $state.go(state, {}, { reload: true, inherit: false });
    };

    $s.getExtension = function(fileName) {
        var regex = /(?:\.([^.]+))?$/;
        return regex.exec(fileName)[1];
    };

    main.getLocalDate = UtilSrvc.toJSONLocal;

    /// Makes user log in
    main.doLogin = function(login, password) {

        var authToken = makeBaseAuth(login, password);
        main.loading = true;
        main.loadingClass = 'loading';

        

        FormSrvc.getFormsList(authToken)
            .then(function(data) {
                main.loginState = 1;
                $s.loginError = false;

                main.authToken = authToken;
                // set cookie to restore loginState after page reload
                $cookies['User'] = login;
                $cookies['Token'] = main.authToken;

                $s.$broadcast('login', data);
                $state.go('forms', {}, { reload: true, inherit: false, notify: true });
            })
            .catch(function(err) {
                $s.loginError = true;
            })
            .finally(function () {
                main.loading = false;
                main.loadingClass = '';
            });
    };

    /// Makes user log out
    main.doExit = function () {
        return SessionSrvc.logout(main.authToken)
            .then(function(data) {
                main.loginState = 0;
                main.page = 'login';
                main.loading = false;
                main.loadingClass = '';

                // clear cookies
                delete $cookies['User'];
                delete $cookies['Token'];
                document.cookie = "CacheBrowserId" + "=; Path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
                document.cookie = "CSPSESSIONID" + "=; Path=" + RESTWebApp.appName + "; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
                document.cookie = "CSPWSERVERID" + "=; Path=" + RESTWebApp.appName + "; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
            })
            .catch(function(err) {
                var errorText = $s.getErrorText(err);
                alert('An unexpected error occurred, contact your administrator \n' + errorText);
            });
    };

    main.logout = function() {
        $s.$broadcast('logout');
    };

    main.goMain = function() {
        $s.$broadcast('goMain');
    };

    main.dataInit = function() {
        $s.$broadcast('refresh');
    };

/*===============================================================
                     CONTROLLER INITIALIZATION
===============================================================*/

    $s.init = function() {
        if (!main.loginState) {
            return
        }
    };

    $s.init();
}

// resolving minification problems
MainCtrl.$inject = ['$scope', '$state', '$cookies', 'FormSrvc', 'SessionSrvc', 'UtilSrvc', '$timeout'];
controllersModule.controller('MainCtrl', MainCtrl);
