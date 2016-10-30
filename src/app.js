import 'login';
import 'home';
import 'profile';

angular.module('dirt', [
  'auth0',
  'ngRoute',
  'angular-storage',
  'angular-jwt',
  'ui.bootstrap',
  'dirt.login',
  'dirt.home',
  'dirt.profile'
])
  .config(function myAppConfig($routeProvider, authProvider, $httpProvider, $locationProvider,
                               jwtOptionsProvider,
                               jwtInterceptorProvider) {
    $routeProvider
      .when('/', {
        controller: 'HomeCtrl',
        templateUrl: 'home/template.html',
        pageTitle: 'Homepage',
        requiresLogin: true
      })
      .when('/login', {
        controller: 'LoginCtrl',
        templateUrl: 'login/login.html',
        pageTitle: 'Login'
      })
      .when('/profile', {
        controller: 'ProfileCtrl',
        templateUrl: 'profile/template.html',
        pageTitle: 'My Profile',
        requiresLogin: true
      });


    authProvider.init({
      domain: AUTH0_DOMAIN,
      clientID: AUTH0_CLIENT_ID,
      loginUrl: '/login'
    });

    // debugger;
    jwtOptionsProvider.config({
      whiteListedDomains: ['localhost']
    });

    jwtInterceptorProvider.tokenGetter = function (store) {
      return store.get('token');
    };

    // Add a simple interceptor that will fetch all requests and add the jwt token to its authorization header.
    // NOTE: in case you are calling APIs which expect a token signed with a different secret, you might
    // want to check the delegation-token example
    $httpProvider.interceptors.push('jwtInterceptor');
  }).run(function ($rootScope, auth, store, jwtHelper, $location) {
  $rootScope.$on('$locationChangeStart', function () {
    if (!auth.isAuthenticated) {
      var token = store.get('token');
      if (token) {
        if (!jwtHelper.isTokenExpired(token)) {
          auth.authenticate(store.get('profile'), token);
        } else {
          $location.path('/login');
        }
      }
    }
    else {
      $rootScope.auth = auth;
    }
  });
})
  .controller('AppCtrl', function AppCtrl($scope, $location) {
    $scope.logout = function () {
      auth.signout();
      store.remove('profile');
      store.remove('token');
      $location.path('/login');
    }

    $scope.$on('$routeChangeSuccess', function (e, nextRoute) {
      if (nextRoute.$$route && angular.isDefined(nextRoute.$$route.pageTitle)) {
        $scope.pageTitle = nextRoute.$$route.pageTitle + ' | Dirty Corners';
      }
    });
  })
  .filter('reportDate', function () {
    "use strict";
    const MONTHS = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    return function (input) {
      if (input.year && input.month && input.day) {
        return MONTHS[input.month] + ' ' + input.day + ', ' + input.year;
      }
      else if (input.year && input.month) {
        return MONTHS[input.month] + ' ' + input.year;
      }
      else if (input.year) {
        return input.year;
      }
    }
  })
;
