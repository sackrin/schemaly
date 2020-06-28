import { expect } from 'chai';
import { uniqMerge } from '../index';

describe('Utils/uniqMerge', () => {
  it('can merge two simple objects together with revised object overwriting original', () => {
    const fakeMerged = uniqMerge(
      {
        title: 'mr',
        first_name: 'sandy',
        surname: 'ryans',
      },
      {
        first_name: 'jane',
        surname: 'bloggs',
      }
    );
    expect(fakeMerged).to.deep.equal({
      title: 'mr',
      first_name: 'jane',
      surname: 'bloggs',
    });
  });

  it('can merge two objects together with child objects', () => {
    const fakeMerged = uniqMerge(
      {
        id: 'fakerecordid',
        profile: {
          title: 'mr',
          first_name: 'sandy',
          surname: 'ryans',
        },
      },
      {
        profile: {
          first_name: 'john',
          dob: '02/05/1992',
        },
      }
    );
    expect(fakeMerged).to.deep.equal({
      id: 'fakerecordid',
      profile: {
        title: 'mr',
        first_name: 'john',
        surname: 'ryans',
        dob: '02/05/1992',
      },
    });
  });

  it('can merge two objects together with an array of child objects', () => {
    const fakeMerged = uniqMerge(
      {
        id: 'fakerecordid',
        emails: [
          {
            id: 'fakeemailone',
            label: 'Home Address',
            address: 'home@example.com',
          },
          {
            id: 'fakeemailtwo',
            label: 'Work Address',
            address: 'work@example.com',
          },
        ],
      },
      {
        emails: [
          {
            id: 'fakeemailtwo',
            label: 'Office Address',
          },
          {
            id: 'fakeemailfour',
            label: 'Fun Address',
            address: 'fun@example.com',
          },
        ],
      }
    );
    expect(fakeMerged).to.deep.equal({
      id: 'fakerecordid',
      emails: [
        {
          id: 'fakeemailone',
          label: 'Home Address',
          address: 'home@example.com',
        },
        {
          id: 'fakeemailtwo',
          label: 'Office Address',
          address: 'work@example.com',
        },
        {
          id: 'fakeemailfour',
          label: 'Fun Address',
          address: 'fun@example.com',
        },
      ],
    });
  });
});
