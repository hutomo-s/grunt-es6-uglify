/*
 * Created by : Harris V Sibuea (Intern)
 * Date : July 27, 2016
 * Faq and Feedback
 * Use Angular 1
 */
//=========================================================
/* Declare module FaqApp, use ['ngMaterial', 'ngRoute']
 * ngMaterial   for search suggesstion
 * ngRoute      for routing when go to detail article
 */
var FaqApp = angular.module('FaqApp', ['ngMaterial', 'ngRoute']);

//retrive data all articles (is,article_name) for search suggesstion
//data use in FaqSearchController
FaqApp.run(function ($http, $rootScope) {
    $http.get(base_url_all_article).then(function (successData) {
        $rootScope.repos = successData.data.data.map(function (repo) {
            repo.value = repo.article_name.toLowerCase();
            return repo;
        });
    }, function (errorResponse) {
        alert("something terrible has happened!");
    });

});

//routeProvider
FaqApp.config(['$routeProvider', function ($routeProvider) {
  var u_ = "";
   if (u != ''){
       var u_ = "&u="+u;
   }

    $routeProvider
            .when('/', {
                templateUrl: 'faq/index?app='+app_id+u_,
                replace: 'true',
            })
            .when('/:name/:id*', {
                templateUrl: function (param) {
                    return 'faq/detail_article/' + param.id +"?app="+app_id+u_;
                },
                replace: 'true',
                controller: 'FaqSearchController',
            }).
            otherwise({
                redirectTo: '/'
            });
}]);

//http request
FaqApp.service('FaqService', ['$http', function ($http) {
    //get list of article (id,article_name) each topic
    this.getTopicArticle = function ($id) {
        return $http.get(base_url_topic_article + '/' + $id);
    };
    //get all articles (id,article_name) for search suggestion
    this.getAllArticle = function () {
        return $http.get(base_url_all_article);
    };
    //get related article (id,article_name)
    this.getRelatedArticle = function($id){
        return $http.get(base_url_related_article + '/' + $id);
    };
    //action for survey (satisfy)
    this.actionThumbsUp = function($id){
        return $http.post(base_url_tumbsup + '/' + $id+"?u="+u);
    };
    //action for survey (unsatisfy)
    this.actionThumbsDown = function($id){
        return $http.post(base_url_tumbsdown + '/' + $id+"?u="+u);
    };
}]);

/* Controller FaqController use service and $scope
 * Main controller for Faq
 */
FaqApp.controller('FaqController', ['$scope', 'FaqService', function ($scope, FaqService) {

    //function for make slug url
    $scope.itemDetailUrl = function (itemName, itemId)
    {
        var str = convertToSlug(itemName) + "/" + itemId;
        return str;
    };

    //function for accordion
    //when show : true, hide : false
    //set icon  : ic_keyboard_arrow_down.svg
    $scope.accor = function () {
        for (var i in $scope.expanded) {
            $scope.expanded[i] = false;
            $scope.icon[i] = 'ic_keyboard_arrow_down.svg';
        }
    };

    //declare object
    $scope.icon = {};
    $scope.isiArticle = {};
    $scope.loading = {};
    $scope.expanded = {};

    //fucntion to get list article, params ($status, $id)
    //$status : true | false
    //$id     : topic_id
    $scope.hitTopicArticle = function ($status, $id) {

        //Reset all accordion to false
        for (var i in $scope.expanded) {
            if ($scope.expanded[i] != $status) {
                $scope.expanded[i] = false;
                $scope.icon[i] = 'ic_keyboard_arrow_down.svg';
            }
        }

        //when click accordion or show accordion
        if ($status === false) {
            //change state and icon
            $scope.expanded[$id] = true;
            $scope.icon[$id] = 'ic_keyboard_arrow_up.svg';

            $scope.listArticle = {};

            //for the 1st time, call service, and copy to isiArticle
            //when isiArticle defined, get list article from isiArticle
            //Jadi, nge-hit API hanya 1 kali untuk setiap topik
            if (typeof $scope.isiArticle[$id] == 'undefined') {
                //Set spinner true
                $scope.loading[$id] = true;

                //get list article
                FaqService.getTopicArticle($id).then(function (successData) {
                    $scope.listArticle[$id] = successData.data.data;
                    //when success, set spinner false
                    $scope.loading[$id] = false;
                    //copy object
                    $scope.isiArticle[$id] = angular.copy($scope.listArticle[$id]);
                }, function (errorResponse) {
                    alert("Maaf Sedang terjadi gangguan. Silahkan Coba kembali!");
                });
            } else {
                //get list article from isiArticle
                $scope.listArticle[$id] = $scope.isiArticle[$id];
            }
        } else {
            //when hide accordion
            $scope.expanded[$id] = false;
            $scope.icon[$id] = 'ic_keyboard_arrow_down.svg';
            $scope.listArticle = null;
        }
    };
}]);


/* Controller FaqSearchController
 * use service, $timeout, $q, $log, $location, $rootScope, $templateCache
 */
FaqApp.controller('FaqSearchController', FaqSearchController);
function FaqSearchController($timeout, $q, $log, $location, $rootScope, $templateCache) {

    var self = this;

    self.simulateQuery = false;
    self.isDisabled = false;

    self.querySearch = querySearch;
    self.selectedItemChange = selectedItemChange;
    self.searchTextChange = searchTextChange;

    // ******************************
    // Internal methods
    // ******************************

    /**
     * Search for repos... use $timeout to simulate
     * remote dataservice call.
     */
    function querySearch(query) {
        var results = query ? $rootScope.repos.filter(createFilterFor(query)) : $rootScope.repos,
                deferred;
        //if simulateQuery true
        if (self.simulateQuery) {
            deferred = $q.defer();
            $timeout(function () {
                deferred.resolve(results);
            }, Math.random() * 1000, false);
            return deferred.promise;
        } else {
            return results;
        }
    }

    //function when typying word in search box
    function searchTextChange(text) {
        //$log.info('Text changed to ' + text);
    }

    //function when click item on list search suggesstion
    function selectedItemChange(itemname, itemid) {
        if (typeof itemname != 'undefined') {
            //make slug url
            var str = convertToSlug(itemname) + "/" + itemid;
            //reset all route from cache
            $templateCache.removeAll();
            //go to url
            $location.path(str);
        }
    }


    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);

        return function filterFn(item) {
            return (item.value.indexOf(lowercaseQuery) >= 0);
        };

    }
}

/* Controller FaqRelated use service and $scope
 * Call when go to detail article
 * Return list of related article for each article
 */
FaqApp.controller('FaqRelated',['$scope', 'FaqService', function ($scope, FaqService) {

    //id_article is global variable
    $scope.articleid=id_article;

    //function ng-click relatedUrl(itemName, itemId)
    $scope.relatedUrl = function (itemName, itemId){
        //convert itemName, itemId to slug url
        var str = convertToSlug(itemName) + "/" + itemId;
        return str;
    };

    //call service to get related article
    FaqService.getRelatedArticle($scope.articleid).then(function (successData) {
        $scope.related = successData.data.data;
    }, function (errorResponse) {
        alert("Maaf Sedang terjadi gangguan. Silahkan Coba kembali!");
    });

}]);

/* Controller FaqSurvey use service and $scope
 * Call when do survey
 */
FaqApp.controller('FaqSurvey',['$scope', 'FaqService', function ($scope, FaqService) {

    //when ng-click satisfy
    $scope.surveyUp = function ($id){
        FaqService.actionThumbsUp($id).then(function (successData) {
            $scope.berhasilUp = successData.data.data;
        }, function (errorResponse) {
            alert("Maaf Sedang terjadi gangguan. Silahkan Coba kembali!");
        });
    }

    //when ng-click unsatisfy
    $scope.surveyDown = function ($id){
        FaqService.actionThumbsDown($id).then(function (successData) {
            $scope.berhasilDown = successData.data.data;
        }, function (errorResponse) {
            alert("Maaf Sedang terjadi gangguan. Silahkan Coba kembali!");
        });
    }

}]);


//Global function to make slug url
function convertToSlug(Text)
{
    return Text.toString().toLowerCase()
                .replace(/\s+/g, '-')           // Replace spaces with -
                .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
                .replace(/\-\-+/g, '-')         // Replace multiple - with single -
                .replace(/^-+/, '')             // Trim - from start of text
                .replace(/-+$/, '');            // Trim - from end of text
}
//EOF
