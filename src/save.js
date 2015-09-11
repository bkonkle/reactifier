import AWS from 'aws-sdk';
import yaml from 'js-yaml';
import {omit} from 'lodash';

export function saveFeed() {

}

export function getIndex() {

}

export function toIndex() {

}

export function saveIndex() {

}

export function toMarkdown(post) {
  // Exclude the metadata when creatin ghte post metadata
  const metadata = yaml.safeDump(omit(post, 'description'));
  return `---\n${metadata}---\n${post.description}\n`;
}

export function savePost() {

}
