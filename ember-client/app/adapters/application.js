import DS from 'ember-data';

export default DS.RESTAdapter.extend({
  host: 'http://localhost:4500',
  namespace: 'api',
  session: Ember.inject.service(),
  headers: Ember.computed('session.data.authenticated.token', function () {
    return {
      'Authorization': `Bearer ${this.get('session.data.authenticated.token')}`
    };
  })
});
