import Ember from 'ember';

export default Ember.Component.extend({
  timezones: ['PST', 'ANS', 'QSW', 'RFT'],
  selectedTimezone: null,
  actions: {
    timezoneChange (newTimezone) {
      this.sendAction('action', newTimezone);
    }
  }
});
