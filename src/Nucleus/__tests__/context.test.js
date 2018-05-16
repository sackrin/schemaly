import assert from 'assert';
import * as context from '../context';

describe('Nucleus Contexts', () => {
  it('string context is properly set up', () => {
    const stringContext = context.STRING;
    assert.equal(stringContext.code, 'string');
    assert.equal(stringContext.children, false);
    assert.equal(stringContext.repeater, false);
  });

  it('container context is properly set up', () => {
    const containerContext = context.CONTAINER;
    assert.equal(containerContext.code, 'container');
    assert.equal(containerContext.children, true);
    assert.equal(containerContext.repeater, false);
  });

  it('collection context is properly set up', () => {
    const collectionContext = context.COLLECTION;
    assert.equal(collectionContext.code, 'collection');
    assert.equal(collectionContext.children, true);
    assert.equal(collectionContext.repeater, true);
  });

  it('collection float is properly set up', () => {
    const floatContext = context.FLOAT;
    assert.equal(floatContext.code, 'float');
    assert.equal(floatContext.children, false);
    assert.equal(floatContext.repeater, false);
  });

  it('collection int is properly set up', () => {
    const intContext = context.INT;
    assert.equal(intContext.code, 'int');
    assert.equal(intContext.children, false);
    assert.equal(intContext.repeater, false);
  });

  it('collection boolean is properly set up', () => {
    const booleanContext = context.BOOLEAN;
    assert.equal(booleanContext.code, 'boolean');
    assert.equal(booleanContext.children, false);
    assert.equal(booleanContext.repeater, false);
  });
});
