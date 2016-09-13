import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service(),
  currentUser: Ember.inject.service(),
  actions: {
    invalidateSession() {
      this.get('session').invalidate();
    },
    timezoneChange (newTimezone) {
      const currentUser = this.get('currentUser.user');
      currentUser.set('timezone', newTimezone);
      currentUser.save();
    }
  }
});
