var sibellule = angular.module('sibellule', ['ngRoute']);

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
        templateUrl: 'assets/partials/category.html',
        controller: 'byCategory'
      })
      .otherwise({
        redirectTo: '/'
      });
  }])
  .run(['$rootScope', function($rootScope) {
    $rootScope.cart = [];
    $rootScope.products;
    $rootScope.clearBtn = false;
  }])
  .controller('allCategories', ['$scope', '$rootScope', '$http', function($scope, $rootScope, $http) {

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
    };

    $scope.clearTheCart = function() {
      $rootScope.clearBtn = false;
      $rootScope.cart.length = 0;
    }
  }])
  .controller('description', ['$scope', '$rootScope', '$routeParams', function($scope, $rootScope, $routeParams) {
    $scope.idProduct = $routeParams.idProduct;
  }])
  .controller('byCategory', ['$scope', '$rootScope', '$routeParams', function($scope, $rootScope, $routeParams) {
    $scope.productCategory = $routeParams.category;
  }]);
