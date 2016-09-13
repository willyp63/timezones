import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service(),
  currentUser: Ember.inject.service(),
  actions: {
    invalidateSession() {
      this.get('session').invalidate();
    },
    timezoneChange (newTimezone) {
      console.log(newTimezone);
    }
  }
});
