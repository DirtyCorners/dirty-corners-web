import 'dirt.services';

angular.module('dirt.profile', [
  'auth0', 'dirt.services'
])
.controller('ProfileCtrl', ProfileCtrl);

ProfileCtrl.$inject = ['$scope', 'auth', 'APIUserService'];
function ProfileCtrl($scope, auth, apiUserService) {
  $scope.profile = {};
  referesh();

  /**
   * METHODS
   */
  $scope.save = () => {
    const {addresses, settings} = $scope.profile;
    apiUserService.update(
      {
        addresses,
        settings
      }
    ).then((profile) => {
      "use strict";

      console.log('[ProfileCtrl] Profile has been updated');
      $scope.profile = profile;
    });
  };

  function referesh () {
    apiUserService.get().then(profile => {
      $scope.profile = angular.extend({}, {settings: {}}, profile);
    });
  }
}

export default angular.module('dirt.profile');
