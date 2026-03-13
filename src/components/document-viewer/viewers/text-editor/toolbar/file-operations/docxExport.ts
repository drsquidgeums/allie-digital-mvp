
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  UnderlineType,
  ExternalHyperlink,
} from 'docx';
import { saveAs } from 'file-saver';

interface ParsedNode {
  type: 'paragraph' | 'heading' | 'list-item';
  level?: number;
  alignment?: typeof AlignmentType[keyof typeof AlignmentType];
  runs: ParsedRun[];
  ordered?: boolean;
  bulletLevel?: number;
}

interface ParsedRun {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strike?: boolean;
  color?: string;
  highlight?: string;
  fontSize?: number;
  fontFamily?: string;
  superScript?: boolean;
  subScript?: boolean;
  link?: string;
}

/**
 * Parse inline styles from an HTML element into run properties
 */
function getRunProps(element: HTMLElement): Partial<ParsedRun> {
  const props: Partial<ParsedRun> = {};
  const style = element.style;

  if (style.color) {
    // Convert color to hex without #
    props.color = colorToHex(style.color);
  }
  if (style.backgroundColor) {
    props.highlight = style.backgroundColor;
  }
  if (style.fontSize) {
    const size = parseInt(style.fontSize);
    if (!isNaN(size)) {
      // Convert px to half-points (1pt = 2 half-points, 1px ≈ 0.75pt)
      props.fontSize = Math.round(size * 0.75 * 2);
    }
  }
  if (style.fontFamily) {
    props.fontFamily = style.fontFamily.replace(/['"]/g, '').split(',')[0].trim();
  }
  if (style.textAlign) {
    // Alignment is handled at paragraph level
  }

  return props;
}

/**
 * Convert a CSS color value to hex (without #)
 */
function colorToHex(color: string): string {
  if (color.startsWith('#')) {
    return color.slice(1).padEnd(6, '0');
  }
  if (color.startsWith('rgb')) {
    const match = color.match(/(\d+)/g);
    if (match && match.length >= 3) {
      return match.slice(0, 3).map(n => parseInt(n).toString(16).padStart(2, '0')).join('');
    }
  }
  // Named colors fallback
  const colorMap: Record<string, string> = {
    red: 'FF0000', blue: '0000FF', green: '008000', yellow: 'FFFF00',
    black: '000000', white: 'FFFFFF', orange: 'FFA500', purple: '800080',
  };
  return colorMap[color.toLowerCase()] || '000000';
}

/**
 * Get alignment from style
 */
function getAlignment(element: HTMLElement): typeof AlignmentType[keyof typeof AlignmentType] | undefined {
  const align = element.style.textAlign || element.getAttribute('align');
  switch (align) {
    case 'center': return AlignmentType.CENTER;
    case 'right': return AlignmentType.RIGHT;
    case 'justify': return AlignmentType.JUSTIFIED;
    case 'left': return AlignmentType.LEFT;
    default: return undefined;
  }
}

/**
 * Recursively extract text runs from an HTML node
 */
function extractRuns(node: Node, inheritedProps: Partial<ParsedRun> = {}): ParsedRun[] {
  const runs: ParsedRun[] = [];

  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent || '';
    if (text) {
      runs.push({ text, ...inheritedProps });
    }
    return runs;
  }

  if (node.nodeType !== Node.ELEMENT_NODE) return runs;

  const el = node as HTMLElement;
  const tag = el.tagName.toLowerCase();
  const props = { ...inheritedProps };

  // Apply formatting based on tag
  switch (tag) {
    case 'strong': case 'b': props.bold = true; break;
    case 'em': case 'i': props.italic = true; break;
    case 'u': props.underline = true; break;
    case 's': case 'del': case 'strike': props.strike = true; break;
    case 'sup': props.superScript = true; break;
    case 'sub': props.subScript = true; break;
    case 'mark': {
      const bg = el.getAttribute('data-color') || el.style.backgroundColor;
      if (bg) props.highlight = bg;
      break;
    }
    case 'a': {
      const href = el.getAttribute('href');
      if (href) props.link = href;
      props.color = '0563C1';
      props.underline = true;
      break;
    }
    case 'span': {
      // Merge inline styles
      const spanProps = getRunProps(el);
      Object.assign(props, spanProps);
      break;
    }
  }

  // Recurse into children
  for (const child of Array.from(node.childNodes)) {
    runs.push(...extractRuns(child, props));
  }

  return runs;
}

/**
 * Parse HTML content into structured nodes for docx generation
 */
function parseHtml(html: string): ParsedNode[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const nodes: ParsedNode[] = [];

  function processElement(el: Element, listLevel = 0, ordered = false) {
    const tag = el.tagName.toLowerCase();

    if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)) {
      const level = parseInt(tag[1]);
      const headingMap: Record<number, typeof HeadingLevel[keyof typeof HeadingLevel]> = {
        1: HeadingLevel.HEADING_1,
        2: HeadingLevel.HEADING_2,
        3: HeadingLevel.HEADING_3,
        4: HeadingLevel.HEADING_4,
        5: HeadingLevel.HEADING_5,
        6: HeadingLevel.HEADING_6,
      };
      nodes.push({
        type: 'heading',
        level,
        runs: extractRuns(el),
        alignment: getAlignment(el as HTMLElement),
      });
    } else if (tag === 'p') {
      nodes.push({
        type: 'paragraph',
        runs: extractRuns(el),
        alignment: getAlignment(el as HTMLElement),
      });
    } else if (tag === 'ul' || tag === 'ol') {
      const isOrdered = tag === 'ol';
      for (const child of Array.from(el.children)) {
        if (child.tagName.toLowerCase() === 'li') {
          processElement(child, listLevel, isOrdered);
        }
      }
    } else if (tag === 'li') {
      nodes.push({
        type: 'list-item',
        runs: extractRuns(el),
        ordered,
        bulletLevel: listLevel,
        alignment: getAlignment(el as HTMLElement),
      });
      // Process nested lists
      for (const child of Array.from(el.children)) {
        const childTag = child.tagName.toLowerCase();
        if (childTag === 'ul' || childTag === 'ol') {
          processElement(child, listLevel + 1, childTag === 'ol');
        }
      }
    } else if (tag === 'blockquote') {
      for (const child of Array.from(el.children)) {
        processElement(child);
      }
    } else if (tag === 'br') {
      nodes.push({ type: 'paragraph', runs: [{ text: '' }] });
    } else if (tag === 'div') {
      for (const child of Array.from(el.children)) {
        processElement(child);
      }
    } else {
      // Fallback: treat as paragraph
      const runs = extractRuns(el);
      if (runs.length > 0 && runs.some(r => r.text.trim())) {
        nodes.push({ type: 'paragraph', runs, alignment: getAlignment(el as HTMLElement) });
      }
    }
  }

  for (const child of Array.from(doc.body.children)) {
    processElement(child);
  }

  // If no structured elements found, treat entire body as one paragraph
  if (nodes.length === 0 && doc.body.textContent?.trim()) {
    nodes.push({ type: 'paragraph', runs: extractRuns(doc.body) });
  }

  return nodes;
}

/**
 * Convert a ParsedRun to a docx TextRun
 */
function createTextRun(run: ParsedRun): TextRun {
  const options: any = {
    text: run.text,
    bold: run.bold,
    italics: run.italic,
    strike: run.strike,
    superScript: run.superScript,
    subScript: run.subScript,
    color: run.color,
    size: run.fontSize,
    font: run.fontFamily,
  };

  if (run.underline) {
    options.underline = { type: UnderlineType.SINGLE };
  }

  if (run.highlight) {
    // docx library expects highlight color names
    options.shading = { fill: colorToHex(run.highlight) };
  }

  return new TextRun(options);
}

/**
 * Export editor HTML content as a proper .docx file
 */
export async function exportAsDocx(html: string, title: string): Promise<void> {
  const parsedNodes = parseHtml(html);

  const children = parsedNodes.map(node => {
    const textRuns = node.runs.map(run => {
      if (run.link) {
        return new ExternalHyperlink({
          children: [createTextRun({ ...run, link: undefined })],
          link: run.link,
        });
      }
      return createTextRun(run);
    });

    const paragraphOptions: any = {
      children: textRuns,
      alignment: node.alignment,
    };

    if (node.type === 'heading') {
      const headingMap: Record<number, typeof HeadingLevel[keyof typeof HeadingLevel]> = {
        1: HeadingLevel.HEADING_1,
        2: HeadingLevel.HEADING_2,
        3: HeadingLevel.HEADING_3,
        4: HeadingLevel.HEADING_4,
        5: HeadingLevel.HEADING_5,
        6: HeadingLevel.HEADING_6,
      };
      paragraphOptions.heading = headingMap[node.level || 1];
    }

    if (node.type === 'list-item') {
      paragraphOptions.bullet = { level: node.bulletLevel || 0 };
      if (node.ordered) {
        paragraphOptions.numbering = {
          reference: 'default-numbering',
          level: node.bulletLevel || 0,
        };
        delete paragraphOptions.bullet;
      }
    }

    return new Paragraph(paragraphOptions);
  });

  const doc = new Document({
    title,
    creator: 'Allie.ai',
    description: `Document exported from Allie.ai editor`,
    numbering: {
      config: [{
        reference: 'default-numbering',
        levels: [
          { level: 0, format: 'decimal', text: '%1.', alignment: AlignmentType.START },
          { level: 1, format: 'lowerLetter', text: '%2.', alignment: AlignmentType.START },
          { level: 2, format: 'lowerRoman', text: '%3.', alignment: AlignmentType.START },
        ],
      }],
    },
    sections: [{
      properties: {
        page: {
          margin: {
            top: 1440,    // 1 inch
            right: 1440,
            bottom: 1440,
            left: 1440,
          },
        },
      },
      children,
    }],
  });

  const buffer = await Packer.toBlob(doc);
  
  const cleanTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  const timestamp = new Date().toISOString().split('T')[0];
  const fileName = `${cleanTitle}_${timestamp}.docx`;
  
  saveAs(buffer, fileName);
}
