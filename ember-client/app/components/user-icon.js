import Ember from 'ember';

export default Ember.Component.extend({
  initials: Ember.computed('name', function () {
    if (this.get('name')) {
      const matchData = this.get('name').match(/(\w)[^\s]*\s(\w)/);
      return matchData[1] + matchData[2];
    } else {
      return '';
    }
  })
});
