// @ts-nocheck
import test from 'ava';
import { remark } from 'remark';
import lint from 'remark-lint';
import doubleLink from '../index.js';

const processor = remark().use(lint).use(doubleLink);

const nok = `![img](./logo)
[super-link-1](http://link-1)
- [puper-link-1](http://link-1)
- [puper-link-1](http://link-2)
- [puper-link-1](http://link-2/index.php?foo=bar&ref=test_ref#content)
- [AppImage discovery](#appimage-discovery)
- [AppImage discovery](#appimage-discovery)`;

const ok = `- [puper-link-1](http://link-1)
- [puper-link-1](http://link-2)`;

const ok2 = `- [hash-link-1](http://link#page#123)
- [hash-link-2](http://link#page#123)`;

test('remark-lint-double-link valid', t => {
  t.deepEqual(
    processor.processSync(ok).messages.map(String),
    [],
    'should work on valid fixtures'
  );

  t.deepEqual(
    processor.processSync(ok2).messages.map(String),
    [],
    'should not fail if there are multiple hashtags'
  );
});

test('remark-lint-double-link invalid', t => {
  t.deepEqual(
    processor.processSync(nok).messages.map(String),
    [
      '2:1-2:30: http://link-1',
      '3:3-3:32: http://link-1',
      '6:3-6:44: #appimage-discovery',
      '7:3-7:44: #appimage-discovery',
    ],
    'should work on valid fixtures'
  );
});
