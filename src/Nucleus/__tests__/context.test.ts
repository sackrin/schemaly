import assert from 'assert';
import * as Context from '../Context';

describe('Nucleus Contexts', () => {
  it('string Context is properly set up', () => {
    const stringContext = Context.STRING;
    assert.equal(stringContext.code, 'string');
    assert.equal(stringContext.children, false);
    assert.equal(stringContext.repeater, false);
  });

  it('container Context is properly set up', () => {
    const containerContext = Context.CONTAINER;
    assert.equal(containerContext.code, 'container');
    assert.equal(containerContext.children, true);
    assert.equal(containerContext.repeater, false);
  });

  it('collection Context is properly set up', () => {
    const collectionContext = Context.COLLECTION;
    assert.equal(collectionContext.code, 'collection');
    assert.equal(collectionContext.children, true);
    assert.equal(collectionContext.repeater, true);
  });

  it('collection float is properly set up', () => {
    const floatContext = Context.FLOAT;
    assert.equal(floatContext.code, 'float');
    assert.equal(floatContext.children, false);
    assert.equal(floatContext.repeater, false);
  });

  it('collection int is properly set up', () => {
    const intContext = Context.INT;
    assert.equal(intContext.code, 'int');
    assert.equal(intContext.children, false);
    assert.equal(intContext.repeater, false);
  });

  it('collection boolean is properly set up', () => {
    const booleanContext = Context.BOOLEAN;
    assert.equal(booleanContext.code, 'boolean');
    assert.equal(booleanContext.children, false);
    assert.equal(booleanContext.repeater, false);
  });
});
