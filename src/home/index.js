import 'dirt.services';
import 'ngmap';

angular.module('dirt.home', [
  'dirt.services',
  'ngMap'
]);

function HomeController($scope, $q, $http, $location, store, APIReportService) {
  var geocoder = new google.maps.Geocoder();

  $scope.reports = [];

  refresh();

  $scope.reportIncident = function reportIncident() {
    var data = {
      type: 'accident',
      location: {
        latlng: [10, 106],
        spec: {
          placeid: 'APLACE01'
        }
      }
    };

    // Just call the API as you'd do using $http
    $http({
      url: API_BASE_URL + 'api/incidents',
      method: 'POST',
      data: data
    }).then(function (response) {
      var data = response.data;

      console.log("We got the secured data successfully", data);
    }, function (response) {
      if (response.status == 0) {
        alert("Please download the API seed so that you can call it.");
      }
      else {
        alert(response.data);
      }
    });
  };

  $scope.toggleDetails = function toggleDetails(report) {
    "use strict";

    const showing = !report.showingDetails;

    if (report.location.latlng) {
      report.showingDetails = showing;
      return;
    }
    else {
      report.busy = true;
    }

    if (showing) {
      geocoder.geocode(
        {
          placeId: report.location.placeid
        },
        function (results, status) {
          if (status === 'OK') {
            report.showingDetails = showing;

            const location = results[0].geometry.location;
            report.location.latlng = `${location.lat()},${location.lng()}`;
          }
          else {
            console.warn('[toggleDetails] Could not set location')
          }

          report.busy = false;
          $scope.$apply();
        }
      );
    }
    else {
      report.showingDetails = false;
    }
  };

  $scope.confirmReport = function confirmReport(reportID) {
    // Just call the API as you'd do using $http
    $http({
      url: API_BASE_URL + 'api/reports/' + reportID + '?verb=confirm',
      method: 'PUT'
    }).then(
      function (response) {
        var data = response.data;

        console.log('Report has been confirmed again. Thank you!');
        if (!$scope.reports) {
          return;
        }
        const report = $scope.reports.find(item => item._id === reportID);
        if (!report) {
          return;
        }

        report.confirmedByMe = true;
      },
      function (response) {
        console.error(JSON.stringify(response.data));
      }
    );
  };

  /**
   * PRIVATE
   */

  function refresh () {
    "use strict";

    APIReportService.query().then(reports => {
      $scope.reports = reports.map(item => {
        return angular.extend({}, item, {
          showingDetails: false
        });
      });
    });
  }
}
HomeController.$inject = ['$scope', '$q', '$http', '$location', 'store', 'APIReportService'];

angular.module('dirt.home').controller('HomeCtrl', HomeController);

const modName = 'dirt.home';
export default modName;
