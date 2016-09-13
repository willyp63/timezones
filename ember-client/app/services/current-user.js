import Ember from 'ember';

const { inject: { service } } = Ember;

export default Ember.Service.extend({
  session: service(),
  store: service(),
  load() {
    if (this.get('session.isAuthenticated')) {
      this.get('store').find('user', 'me').then((user) => {
        this.set('user', user);
      }, function (error) {
        console.log(error);
      });
    }
  }
});
