angular.module('dirt.profile', [
  'auth0'
])
  .controller('ProfileCtrl', function HomeController($scope, auth, $location, store) {
    $scope.profile = {}
  });

export default angular.module('dirt.profile');
