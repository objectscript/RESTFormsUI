'use strict';

var servicesModule    = angular.module('servicesModule',[]);
var controllersModule = angular.module('controllersModule', []);
var app = angular.module('app', ['ngRoute', 'ngCookies', 'servicesModule', 'controllersModule', 'ui.router', 'smart-table']);

app.config([ '$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/forms');

    $stateProvider.state('forms', { url: '/forms', templateUrl: 'partials/forms.csp', controller: 'FormsListCtrl', cache: false});
    $stateProvider.state('form', { url: '/form/:form', templateUrl: 'partials/form.csp', controller: 'FormCtrl', cache: false});
    $stateProvider.state('object', { abstract: true, url: '/obj', template: '<ui-view/>' });
    $stateProvider.state('object.create', { url: '/:form/object', templateUrl: 'partials/object.csp', controller: 'ObjectCtrl', cache: false});
    $stateProvider.state('object.edit', { url: '/:form/object/:id', templateUrl: 'partials/object.csp', controller: 'ObjectCtrl', cache: false});
    $stateProvider.state('object.open', { url: '/ro/:form/object/:id', templateUrl: 'partials/object.csp', controller: 'ObjectCtrl', cache: false});
}]);


app.directive('fileUpload', function () {
    return {
        scope: true,
        link: function (scope, el, attrs) {
            el.bind('change', function (event) {
                var files = event.target.files;

                for (var i = 0; i < files.length; i++) {
                    scope.$emit("fileSelected", { file: files[i], target: event.target });
                }
            });
        }
    };
});

app.directive('ngMultiselect', function ($timeout) {
    return {
        replace: true,
        restrict: 'E',
        scope: false,
        template: function (element, attrs) {
            return '<select class="ui ng-multiselect dropdown ' + attrs.class + ((attrs.disabled) ? ' disabled"' : '"') + 'name="' + attrs.name + 
                '" ng-model="' + attrs.model + '" ng-options="' + attrs.options + '"' + 'placeholder="' + attrs.placeholder + '" ng-disabled="' + attrs.ngDisabled + '"'
                + ((attrs.id) ? 'id="' + attrs.id + '"' : '') + ((attrs.required) ? ' required' : '') + '></select>';
        },
        link: function(scope, element, attrs) {
            scope.$watch(attrs.ngModel, function() {
                scope.$evalAsync(function() {
                    $('.ng-multiselect').dropdown();
                });
            });
        }
    }
});


app.directive('ngSearchSelect', function ($timeout) {
    return {
        replace: true,
        restrict: 'E',
        scope: false,
        template: function (element, attrs) {
            return '<select class="ui dropdown search ng-searchselect' + ((attrs.disabled) ? ' disabled"' : '"') + 'name="' + attrs.name +
                '" ng-model="' + attrs.model + '" ng-options="' + attrs.options + '"' + 'placeholder="' + attrs.placeholder + '"'
                + ((attrs.id) ? 'id="' + attrs.id + '"' : '') + ((attrs.required) ? ' required' : '') + '></select>';
        },
        link: function(scope, element, attrs) {
            scope.$watch(attrs.ngModel, function() {
                scope.$evalAsync(function() {
                    $('.ng-searchselect').dropdown({match: 'both'});
                });
            });
        }
    }
});


app.directive('xref',function($route, $location){
    return {
        link: function(scope, elm, attr) {
            elm.on('click', function() {

                if ( $location.path() === attr.xref ) {
                    $route.reload();
                } else {
                    scope.$apply(function() {
                        $location.path(attr.xref);
                    });
                }
            });
        }
    };
});


app.directive('ngCustomField', function ($compile) {
    var getTemplate = function(field, attrs) {
        switch(field.type) {
            case '%Library.Integer':
            case '%Library.Numeric':
                return '<div class="ui sixteen wide' + ((field.required) ? ' required' : '') + ' field">' +
                            '<label>' + field.displayName + '</label>' +
                            '<div class="ui input" style="vertical-align: top;">' +
                                '<input name="' + field.name + '" type="number" ' + ((!field.readonly) ? 'placeholder="Введите числовое значение"' : '') + ' ng-model="obj[\'' + field.name + '\']">' +
                            '</div>' +
                       '</div>';
            case '%Library.String':
                if (!field.valueList) {
                    return '<div class="ui sixteen wide' + ((field.required) ? ' required' : '') + ' field">' +
                                '<label>' + field.displayName + '</label>' +
                                '<div class="ui input" style="vertical-align: top;">' +
                                    '<input name="' + field.name + '" type="text" ' + ((!field.readonly) ? 'placeholder="Введите текст"' : '') + ' ng-model="obj[\'' + field.name + '\']">' +
                                '</div>' +
                           '</div>';
                } else {
                    if (!field.readonly) {
                        return '<div class="ui eight wide' + ((field.required) ? ' required' : '') + ' field">' +
                                    '<label>' + field.displayName + '</label>' +
                                    '<select name="' + field.name + '" class="ui dropdown" ng-model="obj[\'' + field.name + '\']">' +
                                        '<option value="" disabled selected hidden>Выберите значение</option>' +
                                        '<option value="{{val}}" ng-repeat="val in field.valueList">{{field.displayList[$index]}}</option>' +
                                    '</select>' +
                               '</div>';
                    } else {
                        return '<div class="ui sixteen wide' + ((field.required) ? ' required' : '') + ' field">' +
                                    '<label>' + field.displayName + '</label>' +
                                    '<div class="ui input" style="vertical-align: top;">' +
                                        '<input name="' + field.name + '" type="text" ng-value="field.displayList[obj[\'' + field.name + '\']]"' +
                                    '</div>' +
                               '</div>';
                    }
                }
            case '%Library.Date':
                if (!field.readonly) {
                    return '<div class="ui sixteen wide' + ((field.required) ? ' required' : '') + ' field">' +
                                '<label>' + field.displayName + '</label>' +
                                '<div class="ui input" style="vertical-align: top;">' +
                                    '<input name="' + field.name + '" type="date" placeholder="ГГГГ-ММ-ДД" ng-model="obj[\'' + field.name + '\']">' +
                                '</div>' +
                           '</div>';
                } else {
                    return '<div class="ui sixteen wide' + ((field.required) ? ' required' : '') + ' field">' +
                                '<label>' + field.displayName + '</label>' +
                                '<div class="ui input" style="vertical-align: top;">' +
                                    '<input name="' + field.name + '" type="text" ng-value="obj[\'' + field.name + '\'] | date:\'dd.MM.yyyy\'">' +
                                '</div>' +
                           '</div>';
                }
            default:
                if (field.category == 'form') {
                    if (!field.readonly) {
                        return '<div class="ui eight wide' + ((field.required) ? ' required' : '') + ' field">' +
                                    '<label>' + field.displayName + '</label>' +
                                    '<select name="' + field.name + '" class="ui dropdown" ng-model="obj[\'' + field.name + '\']"' +
                                            ((field.disabled) ? ' disabled' : '') + ((field.required) ? ' required' : '') + ((field.readonly) ? ' disabled' : '') +
                                            ' ng-options="val as val.displayName for val in catalogs[\'' + field.type + '\'] track by val._id">' +
                                        '<option value="" disabled selected hidden>Выберите значение</option>' +
                                    '</select>' +
                               '</div>';
                    } else {
                        return '<div class="ui sixteen wide' + ((field.required) ? ' required' : '') + ' field">' +
                                    '<label>' + field.displayName + '</label>' +
                                    '<div class="ui input" style="vertical-align: top;">' +
                                        '<input name="' + field.name + '" type="text" ng-value="obj[\'' + field.name + '\'][catalogsMeta[\'' + field.type + '\'].displayProperty]"' +
                                    '</div>' +
                               '</div>';
                    }
                }

                return '<div></div>';
        }
    };

    return {
        restrict: 'A',
        scope: {
            fieldData: '='
        },
        link: function (scope, element, attrs) {
            var elem;

            var result = $(getTemplate(scope.fieldData, attrs)).appendTo(element);

            if (scope.fieldData.category == 'form') {
                if (!scope.fieldData.readonly) {
                    try {
                        scope.$parent.loadCatalog(scope.fieldData.type, scope.fieldData.name);
                    } catch (err){
                        console.warn(err);
                    }
                } else {
                    try {
                        scope.$parent.loadCatalogMeta(scope.fieldData.type, scope.fieldData.name);
                    } catch (err) {
                        console.warn(err);
                    }
                    elem = element.find('input');
                    elem.attr('readonly', scope.fieldData.readonly);
                    elem.attr('disabled', scope.fieldData.disabled);
                }

            } else if (scope.fieldData.category == 'datatype') {

                if (!scope.fieldData.valueList || scope.fieldData.readonly) {
                    elem = element.find('input');
                    elem.attr('disabled', scope.fieldData.disabled);

                } else {
                    elem = element.find('select');
                    elem.attr('disabled', scope.fieldData.readonly);
                }

                elem.attr('readonly', scope.fieldData.readonly);
                elem.attr('required', scope.fieldData.required);
            }

            $compile(result)(scope.$parent);
        }
    }
});
