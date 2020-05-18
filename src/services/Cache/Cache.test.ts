import Cache from '.';

describe('Caching Service', () => {
  it('Can be initialised without an empty state', () => {
    const cache = new Cache();
    expect(cache.current).toEqual({});
  });

  it('Can be initialised with an initial state', () => {
    const cache = new Cache({ name: 'Amy' });
    expect(cache.get('name')).toEqual('Amy');
  });

  it('Correctly sets new values after initialising', () => {
    const cache = new Cache({ name: 'Amy' });
    cache.set('name', 'Adam');
    cache.set('city', 'Melbourne');
    expect(cache.get('name')).toEqual('Adam');
    expect(cache.get('city')).toEqual('Melbourne');
  });

  it('Returns undefined for values which are not set', () => {
    const cache = new Cache();
    expect(cache.get('unknown_key')).toBeNull();
  });

  it('Can purge the entire cache store data', () => {
    const cache = new Cache({ name: 'Amy' });
    cache.set('city', 'Melbourne');
    cache.purge();
    expect(cache.current).toEqual({});
  });
});
