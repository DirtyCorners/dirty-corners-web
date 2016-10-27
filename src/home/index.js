angular.module( 'dirt.home', [
'auth0'
])
.controller( 'HomeCtrl', function HomeController( $scope, auth, $http, $location, store ) {
  $scope.auth = auth;

  var data = {
    type: 'accident',
    location: {
      latlng: [10, 106],
      spec: {
        placeid: 'APLACE01'
      }
    }
  };

  $scope.reportIncident = function reportIncident () {
    // Just call the API as you'd do using $http
    $http({
      url: API_BASE_URL + 'api/incidents',
      method: 'POST',
      data: data
    }).then(function(response) {
      var data = response.data;

      console.log("We got the secured data successfully", data);
    }, function(response) {
      if (response.status == 0) {
        alert("Please download the API seed so that you can call it.");
      }
      else {
        alert(response.data);
      }
    });
  };

  $scope.confirmReport = function confirmReport (reportID) {
    // Just call the API as you'd do using $http
    $http({
      url: API_BASE_URL + 'api/reports/' + reportID + '?verb=confirm',
      method: 'PUT'
    }).then(function(response) {
      var data = response.data;

      console.log("We got the secured data successfully", data);
    }, function(response) {
      if (response.status == 0) {
        alert("Please download the API seed so that you can call it.");
      }
      else {
        alert(response.data);
      }
    });
  };

  $scope.logout = function() {
    auth.signout();
    store.remove('profile');
    store.remove('token');
    $location.path('/login');
  }

});

const modName = 'dirt.home';
export default modName;
