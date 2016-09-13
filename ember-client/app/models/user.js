import DS from 'ember-data';

export default DS.Model.extend({
  personId: DS.attr('string'),
  displayName: DS.attr('string'),
  timezone: DS.attr('string')
});
