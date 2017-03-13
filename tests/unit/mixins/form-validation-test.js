import Ember from 'ember';
import FormValidationMixin from 'ember-form-validation/mixins/form-validation';
import { module, test } from 'qunit';

module('Unit | Mixin | form validation');

// Replace this with your real tests.
test('it works', function(assert) {
  let FormValidationObject = Ember.Object.extend(FormValidationMixin);
  let subject = FormValidationObject.create();
  assert.ok(subject);
});
