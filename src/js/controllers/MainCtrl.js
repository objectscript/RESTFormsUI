/// Main controller
/// Controls the authentication. Loads all the worklists for user.
function MainCtrl($s, $state, $cookies, FormSrvc, SessionSrvc, UtilSrvc, $timeout, $root, $filter) {
    'use strict';

/*===============================================================
                       VARIABLES INITIALIZATION
===============================================================*/

    $root.server = location.hostname //"localhost";
    $root.port = location.port //"57772";
    $root.webapp = "forms";

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

    $root.timestampConfig = {
        type: 'datetime',
        firstDayOfWeek: 1,
        today: true,
        monthFirst: false,
        touchReadonly: false,
        on: 'click',
        text: UtilSrvc.getCalendarLocalization(),
        onChange: function(date) {
            ngModelCtrl.$setViewValue(date);
            ngModelCtrl.$render();
        },
        formatter: {
            datetime: function (date, settings) {
                if (!date) return '';
                return $filter('date')(date, 'yyyy-MM-dd HH:mm:ss');
            }
        }
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

    function getLanguageList() {
        return SessionSrvc.getLanguageList(main.authToken)
            .then(function(data) {
                var languages = data.languages || ['en'];

                languages = languages.map(function(lang) {
                    var domain = lang.split('-')[0];
                    return {
                        name: UtilSrvc.getLanguageName(domain),
                        lang: domain
                    }
                });

                main.languageList = languages;
                main.language = angular.fromJson(localStorage.rflanguage) || { lang: 'en', name: 'English' };
                localStorage.rflanguage = angular.toJson(main.language);
            });
    }

    $s.$watch('main.language', function(oldVal, newVal) {
        if (angular.isUndefinedOrNull(newVal)) {
            return;
        }

        localStorage.rflanguage = angular.toJson(main.language);
        if (oldVal != newVal) {
            $state.go($state.current, {}, {reload: true});
        }
    });

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
    main.doLogin = function(login, password, server, port, webapp) {

        $root.server = server;
        $root.port = port;
        $root.webapp = webapp;

        var authToken = makeBaseAuth(login, password);
        main.loading = true;
        main.loadingClass = 'loading';

        getLanguageList()
            .then(function() {
                return FormSrvc.getFormsList(authToken);
            })
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
                document.cookie = "CSPSESSIONID" + "=; Path=" + $root.webapp + "; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
                document.cookie = "CSPWSERVERID" + "=; Path=" + $root.webapp + "; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
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

        getLanguageList();
    };

    $s.init();
}

// resolving minification problems
MainCtrl.$inject = ['$scope', '$state', '$cookies', 'FormSrvc', 'SessionSrvc', 'UtilSrvc', '$timeout', '$rootScope', '$filter'];
controllersModule.controller('MainCtrl', MainCtrl);
