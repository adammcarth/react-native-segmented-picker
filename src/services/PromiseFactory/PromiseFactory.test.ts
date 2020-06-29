/* eslint no-new: 0 */
import PromiseFactory from './PromiseFactory';

describe('Promise Factory Service', () => {
  it('Stores and retrieves a single promise', () => {
    const promiseFactory = new PromiseFactory();
    let promiseId;
    new Promise((resolve, reject) => {
      promiseId = promiseFactory.add({ resolve, reject });
    });
    expect(promiseFactory.get(promiseId)).toStrictEqual(
      expect.objectContaining({
        resolve: expect.any(Function),
        reject: expect.any(Function),
      }),
    );
  });

  it('Deletes a stored promise from the factory', () => {
    const promiseFactory = new PromiseFactory();
    let promiseId;
    new Promise((resolve, reject) => {
      promiseId = promiseFactory.add({ resolve, reject });
    });
    promiseFactory.delete(promiseId);
    expect(promiseFactory.get(promiseId)).not.toBeDefined();
  });

  it('Stores multiple promises against the correct id increments', async (done) => {
    const promiseFactory = new PromiseFactory();

    let promiseId1;
    const p1 = new Promise((resolve, reject) => {
      promiseId1 = promiseFactory.add({ resolve, reject });
    });
    promiseFactory.get(promiseId1).resolve('foo');

    let promiseId2;
    new Promise((resolve, reject) => {
      promiseId2 = promiseFactory.add({ resolve, reject });
    });
    promiseFactory.delete(promiseId2);

    let promiseId3;
    const p3 = new Promise((resolve, reject) => {
      promiseId3 = promiseFactory.add({ resolve, reject });
    });
    promiseFactory.get(promiseId3).resolve('bar');

    const promise1Value = await p1;
    expect(promise1Value).toBe('foo');
    expect(promiseFactory.get(promiseId2)).not.toBeDefined();
    const promise3Value = await p3;
    expect(promise3Value).toBe('bar');
    done();
  });
});
