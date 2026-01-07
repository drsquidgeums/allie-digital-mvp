import { Mark } from '@tiptap/core';

export const BeelineMark = Mark.create({
  name: 'beeline',

  addAttributes() {
    return {
      'data-beeline': {
        default: 'true',
        parseHTML: element => element.getAttribute('data-beeline'),
        renderHTML: attributes => {
          if (!attributes['data-beeline']) {
            return {};
          }
          return { 'data-beeline': attributes['data-beeline'] };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-beeline]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', HTMLAttributes, 0];
  },
});
