/* eslint-disable @typescript-eslint/no-explicit-any */
import { Parent, Node } from 'unist'
import { visit } from 'unist-util-visit'

interface Data {
  value: any
  url: any
  depth: any
}

export default function remarkTocHeadings(options: { exportRef: Data[] }) {
  return (tree: Parent) =>
    visit(tree, 'heading', (node: Parent<Node & Data> & Data) => {
      options.exportRef.push({
        value: node.children[0].value || node.children[1].value,
        url: node.children[0].url || node.children[1].url,
        depth: node.depth,
      })
    })
}
