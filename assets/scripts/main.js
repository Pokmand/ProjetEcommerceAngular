var sibellule = angular.module('sibellule', ['ngMessages', 'ngRoute']);

sibellule
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'assets/partials/products.html',
        controller: 'allCategories'
      })
      .when('/showProduct/:idProduct', {
        templateUrl: 'assets/partials/description.html',
        controller: 'description'
      })
      .when('/showCategory/:category', {
        templateUrl: 'assets/partials/bycategory.html',
        controller: 'byCategory'
      })
      .otherwise({
        redirectTo: '/'
      });
  }])
  .run(['$rootScope',
    function($rootScope) {
      $rootScope.cart = [];
      $rootScope.products;
      $rootScope.clearBtn = false;
    }
  ])
  .controller('scrollController', ['$scope', '$window',
    function($scope, $window) {
      $scope.goToTop = function() {
        $window.scrollTo(0,428);
      }
    }
  ])
  .controller('allCategories', ['$scope', '$rootScope', '$http',
    function($scope, $rootScope, $http) {

      $http.get('product.json')
        .then(function(response) {
          $rootScope.products = response.data;
        })
        .catch(function(response) {
          console.error('JSON error : ' + response.status, response.data);
        });

      $scope.addToCart = function(itemToCart) {
        var itemFound = $rootScope.cart.find(x => x.id === itemToCart.id);

        if (itemFound) {
          var indexItem = $rootScope.cart.indexOf(itemFound);
          $rootScope.cart[indexItem].qty++;
        } else {
          $rootScope.cart.push(angular.copy(itemToCart));
          $rootScope.clearBtn = true;
        }
      };

      $scope.totalCart = function() {
        var total = 0;
        angular.forEach($rootScope.cart, function(value, key) {
          total += value.qty * value.price;
        })

        return total;
      };

      $scope.removeFromCart = function(removeItemFromCart) {
        var indexItem = $rootScope.cart.indexOf(removeItemFromCart);

        $rootScope.cart.splice(indexItem, 1);
        if (!$rootScope.cart.length) {
          $rootScope.clearBtn = false;
        }
      };

      $scope.clearTheCart = function() {
        $rootScope.clearBtn = false;
        $rootScope.cart.length = 0;
      }
    }
  ])
  .controller('description', ['$scope', '$rootScope', '$routeParams',
    function($scope, $rootScope, $routeParams) {
      $scope.idProduct = $routeParams.idProduct;
      $scope.qty = 1;

      $scope.addToCart = function(itemToCart) {
        var itemFound = $rootScope.cart.find(x => x.id === itemToCart.id);

        if (itemFound) {
          var indexItem = $rootScope.cart.indexOf(itemFound);
          if ($scope.qty > 1) {
            $rootScope.cart[indexItem].qty += $scope.qty;
            $scope.qty = 1;
          } else {
            $rootScope.cart[indexItem].qty++;
          }
        } else {
          $rootScope.cart.push(angular.copy(itemToCart));
          if ($scope.qty > 1) {
            $rootScope.cart[$rootScope.cart.length - 1].qty = $scope.qty;
            $scope.qty = 1;
          }
          $rootScope.clearBtn = true;
        }
      };
    }
  ])
  .controller('byCategory', ['$scope', '$rootScope', '$routeParams',
    function($scope, $rootScope, $routeParams) {
      $scope.productCategory = $routeParams.category;

      $scope.addToCart = function(itemToCart) {
        var itemFound = $rootScope.cart.find(x => x.id === itemToCart.id);

        if (itemFound) {
          var indexItem = $rootScope.cart.indexOf(itemFound);
          $rootScope.cart[indexItem].qty++;
        } else {
          $rootScope.cart.push(angular.copy(itemToCart));
          $rootScope.clearBtn = true;
        }
      };
    }
  ]);
