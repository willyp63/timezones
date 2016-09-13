import Ember from 'ember';

import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin, {
  session: Ember.inject.service(),
  currentUser: Ember.inject.service(),
  beforeModel() {
    this._loadCurrentUser();
  },
  model () {
    return this.get('store').findAll('user');
  },
  sessionAuthenticated() {
    this._super(...arguments);
    this._loadCurrentUser();
  },
  _loadCurrentUser() {
    this.get('currentUser').load();
  },
  actions: {
    sessionRequiresAuthentication: function() {
      var that = this;
      this.get('torii')
          .open('google-oauth2-bearer')
          .then(function(googleAuth){
              var googleToken = googleAuth.authorizationToken.access_token;
              console.log('Google authentication successful.');
              that.get('session').authenticate('authenticator:jwt', {password: googleToken})
                 .then(function(){
                   console.log('custom token authentication successful!');
                 }, function (error) {
                   console.log('custom token authentication failed!', error.message);
                 });
          }, function (error) {
              console.error('Google auth failed: ', error.message);
          });
    }
  }
});
