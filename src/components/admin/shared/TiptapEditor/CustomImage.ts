import Image from '@tiptap/extension-image';

/**
 * CustomImage Extension - Enhanced image support for Tiptap
 * Adds alignment and original source attributes to images
 */
const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      originalSrc: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-original-src'),
        renderHTML: (attributes) => ({
          'data-original-src': attributes.originalSrc,
        }),
      },
      align: {
        default: 'center',
        parseHTML: (element) => element.getAttribute('data-align') || 'center',
        renderHTML: (attributes) => ({
          'data-align': attributes.align,
        }),
      },
      caption: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-caption'),
        renderHTML: (attributes) => ({
          'data-caption': attributes.caption,
        }),
      },
    };
  },

  renderHTML({ HTMLAttributes }) {
    // Wrap image in a container figure for alignment
    const align = HTMLAttributes['data-align'] || 'center';
    const containerClass = `tiptap-image-container align-${align}`;

    return [
      'figure',
      {
        class: containerClass,
        'data-align': align,
      },
      [
        'img',
        {
          ...HTMLAttributes,
        },
      ],
      [
        'figcaption',
        {
          class: 'tiptap-image-caption',
          contenteditable: 'true',
        },
      ],
    ];
  },
});

export default CustomImage;
