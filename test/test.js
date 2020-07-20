const test = require('ava');
const remark = require('remark');
const lint = require('remark-lint');
const doubleLink = require('..');

const processor = remark().use(lint).use(doubleLink);

const nok = `![img](./logo)
[super-link-1](http://link-1)
- [puper-link-1](http://link-1)
- [puper-link-1](http://link-2)
- [puper-link-1](http://link-2/index.php?foo=bar&ref=test_ref#content)`;

const ok = `- [puper-link-1](http://link-1)
- [puper-link-1](http://link-2)`;

test('remark-lint-double-link valid', t => {
  t.deepEqual(
    processor.processSync(ok).messages.map(String),
    [],
    'should work on valid fixtures'
  );
});

test('remark-lint-double-link invalid', t => {
  t.deepEqual(
    processor.processSync(nok).messages.map(String),
    [
      '2:1-2:30: http://link-1',
      '3:3-3:32: http://link-1',
      '4:3-4:32: http://link-2',
      '5:3-5:71: http://link-2/index.php?foo=bar&ref=test_ref#content'
    ],
    'should work on valid fixtures'
  );
});
