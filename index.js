const normalizeUrl = require('normalize-url');
const rule = require('unified-lint-rule');
var visit = require('unist-util-visit')

module.exports = rule(
  'remark-lint:double-link',
  processor,
);

function processor(tree, file) {
  const links = new Map();

  visit(tree, 'list', list => {
    for (const listItem of list.children) {
      const [paragraph] = listItem.children
      if (!paragraph || paragraph.type !== 'paragraph' || paragraph.children.length === 0) {
        continue
      }

      const [node] = paragraph.children
      if (node.type === 'text') {
        continue
      }

      const url = node.url.startsWith('#') ? node.url : normalizeUrl(node.url, {
        removeDirectoryIndex: true,
        stripHash: true,
        stripProtocol: true,
        // removeQueryParameters: [/\.*/i]
      })

      if (links.has(url)) {
        links.get(url).push(node)
      } else {
        links.set(url, [node])
      }
    }
  })

  links.forEach(nodes => {
    if (nodes.length > 1) {
      nodes.forEach(node => {
        file.message(node.url, node)
      })
    }
  })
}
