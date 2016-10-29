angular.module('dirt.services', [
  'auth0',
]);

function APIUserService ($http, $q) {
  "use strict";
  var API_PREFIX = '';

  return {
    update,
    get
  };

  /**
   * Response:
   * {
   *   address: '170 ABC Road, Virginia, US'
   * }
   * @return {*}
   */
  function get () {
    return $http.get(API_PREFIX + 'api/profile').then(res => res.data);
  }

  function update (profile) {
    if (!angular.isObject(profile)) {
      throw new Error('Profile is not an object');
    }

    return $http.put(API_PREFIX + 'api/profile', profile).then(res => res.data);
  }
}
APIUserService.$inject = ['$http', '$q'];
angular.module('dirt.services').service('APIUserService', APIUserService);
