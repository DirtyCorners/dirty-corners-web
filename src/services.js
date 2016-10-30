angular.module('dirt.services', [
  'auth0',
]);

/**
 *
 * @param $http
 * @param $q
 * @return {{update: update, get: get}}
 * @constructor
 */
function APIUserService ($http, $q) {
  "use strict";

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
    return $http.get(API_BASE_URL + 'api/profile').then(res => res.data);
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

/**
 *
 * @param $http
 * @param $q
 * @return {{query: query}}
 * @constructor
 */
function APIReportService ($http, $q) {
  "use strict";

  return {
    query
  };

  function query ({limit = 10} = {}) {
    return $http.get(API_BASE_URL + 'api/reports').then(res => res.data.reports);
  }
}
APIReportService.$inject = ['$http', '$q'];
angular.module('dirt.services').service('APIReportService', APIReportService);
