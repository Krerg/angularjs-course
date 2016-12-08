var angular = require('angular');
var App = angular.module('app', []);
App.controller('ctrl', function($scope, $http, PetService) {
    $scope.animal = 'dog';
    $scope.data = {
        tool: 'apix',
        cost: 123,
        keepers: []
    };
    var pets = [];

    // var pet = {
    //     name: 'Fluffy',
    //     type: 'cat'
    // };
    // pets.push(pet);
    // pets.push(pet);
    // $scope.tracking = function(pet) {
    //     return Math.random()*12;
    // };
    // pets.push({
    //     name: 'Arnold',
    //     type: 'dog'
    // });
    $scope.pets = pets;


    $scope.addPet = function(name, type) {
        PetService.addPet(name,type).then(function(resp) {
            var response = resp.data;
            if (response && response.success) {
                $scope.pets.push({
                    id: response.data, // from server
                    name: name,
                    type: type
                });
            }
        })
    };

    $scope.savePet = function(pet) {
        PetService.savePet(pet).then(function(resp) {
            var response = resp.data;
            if (response && response.success) {
                alert('ok');
            }
        });
    };

    $scope.deletePet = function(pet) {
        $http.delete('http://localhost:8080/pet/' + pet.id).then(function(resp) {
            var response = resp.data;
            if (response && response.success) {
                $scope.pets.splice($scope.pets.indexOf(pet), 1);
            }
        });
    };

    $http.get('http://localhost:8080/pets').then(function(resp) {
        var response = resp.data;
        if (response && response.success) {
            var pets = response.data;
            pets.forEach(function(pet) {
                $scope.pets.push(pet);
            });
        }
    });

    $http.buyPet = function(pet) {
        var boughtPet = angular.copy(pet);
        boughtPet.price = (Math.random() * 200) + 15;
        $scope.boughtPet = boughtPet;
    };

    $scope.sortBy = function(prop) {
        if ($scope.sort == prop) {
            $scope.sort = prop;
            $scope.reverse = !$scope.reverse;
        } else {
            $scope.sort = prop;
            $scope.reverse = false;
        }
    }
});

App.factory('PetService', function($http, $q) {
    return {
        addPet: function(name, type) {
            var deferred = $q.defer();
            $http.post('http://localhost:8080/pet?name=' + name + '&type=' + type.toUpperCase()).then(function(resp) {
                deferred.resolve(resp);
            });
            return deferred.promise;
        },
        savePet: function(pet) {
            return $http.put('http://localhost:8080/pet/' + pet.id + '?name=' + pet.name + '&type=' + pet.type)
        }
    };
});