'use strict';

webappChart.controller('batteryLine',['$scope',batteryLine]);

//battery.html


function batteryLine($scope) {
    $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
    $scope.series = ['Series A'];
    $scope.data = [
        [65, 59, 80, 81, 56, 55, 40]
    ];
    $scope.onClick = function (points, evt) {
        console.log(points, evt);
    };
    $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }];
    $scope.options = {
        scales: {
            yAxes: [
                {
                    id: 'y-axis-1',
                    type: 'linear',
                    display: true,
                    position: 'left'
                }
            ]
        }
    };


}


webappChart.controller('batteryPie',['$scope',batteryPie]);

function batteryPie($scope) {
    $scope.labels = ["剩余", "消耗"];
    $scope.data = [80, 20];
}
