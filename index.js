/**
 * @typedef {import('unist').Node} Node
 * @typedef {import('vfile').VFile} VFile
 */
import normalizeUrl from 'normalize-url';
import { lintRule } from 'unified-lint-rule';
import { visit } from 'unist-util-visit';

export default lintRule(
  'remark-lint:double-link',
  processor,
);

/**
 * Check for repeated links.
 *
 * @param {Node} tree
 * @param {VFile} file
 * @returns {void}
 */
function processor(tree, file) {
  const links = new Map();

  /**
   * @param {any} node
   */
  function visitor(node) {
    const hashCount = node.url.split("#").length - 1
    if (hashCount > 1) {
      return
    }

    const url = node.url.startsWith('#') ? node.url : normalizeUrl(node.url, {
      removeDirectoryIndex: [/^index\.[a-z]+$/],
      stripHash: true,
      stripProtocol: true,
      // removeQueryParameters: [/\.*/i]
    });

    if (links.has(url)) {
      links.get(url).push(node)
    } else {
      links.set(url, [node])
    }
  }

  visit(tree, 'link', visitor)

  links.forEach(nodes => {
    if (nodes.length > 1) {
      // @ts-ignore
      nodes.forEach((node) => {
        file.message(node.url, node)
      })
    }
  })
}
