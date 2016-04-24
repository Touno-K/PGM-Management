// Template.registerHelper('TXT', function(keyname){
// 	keyname = keyname || '';
// 	return '';
// });

// if(Meteor.isServer){
// 	Meteor.startup(function () {
// 		// var mysqlStringConnection = 	"mysql://root:123567@pgm.ns.co.th:33061/ns_develop?debug=false&charset=utf8";
// 		// var db = Mysql.connect(mysqlStringConnection);
// 		//"posts" -> a table name inside your database. 
// 		Posts = db.meteorCollection("users", "postsCollection");

// 		Meteor.publish("allPosts", function(){
// 			console.log(Posts.find());
// 			return Posts.find();
// 		});
// 	});
// }
if (Meteor.isClient) {
// 	Posts = new Mongo.Collection("postsCollection");

// 	console.log(Posts, Meteor.subscribe('allPosts'));
	Meteor.startup(function () {
		$(window).resize(function(){ $('.login-image').height($(window).height() - 118); });

	});
}

Template.app.onRendered(function() {
	var onSignOut = function(){
    // $('.ui.dimmer.component').transition('hide');
    $('.ui.dimmer.prepare').fadeOut(300);
    $('.ui.panel.sign-in').fadeIn(300);
    $('.ui.access.grid').hide();
  }

  var eventBackSignIn = function() {
    $('.ui.button.sign-in').css({ 'border-radius': 0 });
    $('.ui.button.sign-back, .or.sign-or').hide();
  }

  $.when(
    (function(){
      Meteor.call("myip", function(error, results) {
        console.log(error); //results.data should be a JSON object
        console.log(results); //results.data should be a JSON object
      });
    })(),
    T.Init('<%= _SESSION.ID %>'),
    (function(){ // Prepare client feature.
      window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
      window.origin = 'pgm.ns.co.th' || window.location.origin;

      var feature = $.Deferred();
      if (localStorage == undefined) {
          feature.reject(new CallbackException("<%= _LANG.EXCEPTION.LOCALSTORAGE_TITLE %>", "<%= _LANG.EXCEPTION.LOCALSTORAGE_DESC %>"));
      } else if (console == undefined) {
          feature.reject(new CallbackException("<%= _LANG.EXCEPTION.CONSOLE_TITLE %>", "<%= _LANG.EXCEPTION.CONSOLE_DESC %>"));
      } else if (document.cookie == undefined) {
          feature.reject(new CallbackException("<%= _LANG.EXCEPTION.COOKIE_TITLE %>", "<%= _LANG.EXCEPTION.COOKIE_DESC %>"));
      } else if (window.indexedDB == undefined) {
          feature.reject(new CallbackException("<%= _LANG.EXCEPTION.INDEXED_TITLE %>", "<%= _LANG.EXCEPTION.INDEXED_DESC %>"));
      } else if (History == undefined) {
          feature.reject(new CallbackException("<%= _LANG.EXCEPTION.HISTORY_TITLE %>", "<%= _LANG.EXCEPTION.HISTORY_DESC %>"));
      } else if (/MSIE 5.0|MSIE 5.5|MSIE 6.0|MSIE 7.0|MSIE 8.0/g.exec(navigator.userAgent)) {
          feature.reject(new CallbackException("<%= _LANG.EXCEPTION.IE9_TITLE %>", "<%= _LANG.EXCEPTION.IE9_DESC %>"));
      } else {
          feature.resolve({ feature: true }); 
      }
      return feature.promise();
    })(),
    (function(){ 
      var session = $.Deferred();
      if("" !== "") session.reject(new CallbackException("<%= _SESSION.NAME %>", "<%= _SESSION.MESSAGE %>")); 
      session.resolve({ feature: true }); 
      return session.promise();
    })()
  ).fail(exModal).done(function (i, f, s) {
    var ex = new CallbackException(f);
    if(!ex.onError) {
      if(T.Storage('SESSION_CLIENT')) {
        // T.Call({ url: '/api/sign-access', data: { email: T.Storage('signin-username') } }).then(function(e, res){
        //   if(res.access) onAccess(res.user); else onSignOut();
        // });
        onSignOut();
      } else {
        onSignOut();
      }
    } else {
      exModal(ex); 
    }
  });
});

