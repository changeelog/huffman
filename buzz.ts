/**
 * Represents a node in the Huffman tree.
 * Each node contains a character (or an empty string for internal nodes),
 * its frequency, and references to its left and right child nodes.
 */
class HuffmanTreeNode {
  /**
   * Constructs a new HuffmanTreeNode.
   * @param character The character stored in this node. Empty string for internal nodes.
   * @param frequency The frequency of the character or the sum of frequencies of child nodes.
   * @param leftChild The left child node in the Huffman tree.
   * @param rightChild The right child node in the Huffman tree.
   */
  constructor(
      public character: string,
      public frequency: number,
      public leftChild: HuffmanTreeNode | null = null,
      public rightChild: HuffmanTreeNode | null = null
  ) {}
}

class HuffmanCompression {
  private root: HuffmanTreeNode | null = null;
  private encodingMap: { [char: string]: string } = {};

  /**
   * Builds a Huffman tree based on the input text.
   * This method performs the following steps:
   * 1. Calculate character frequencies
   * 2. Create initial nodes for each character
   * 3. Build the Huffman tree by repeatedly combining the two nodes with lowest frequencies
   * 
   * @param inputText The text to analyze and build the Huffman tree from.
   */
  public buildHuffmanTree(inputText: string): void {
      // Step 1: Calculate character frequencies
      const frequencyMap = this.calculateCharacterFrequencies(inputText);

      // Step 2: Create initial set of nodes
      let nodeQueue = this.createInitialNodeQueue(frequencyMap);

      // Step 3: Build the Huffman tree
      while (nodeQueue.length > 1) {
          // Sort the queue to easily access the two nodes with lowest frequencies
          nodeQueue.sort((a, b) => a.frequency - b.frequency);
          
          // Remove the two nodes with lowest frequencies
          const leftChild = nodeQueue.shift()!;
          const rightChild = nodeQueue.shift()!;
          
          // Create a new internal node with these two as children
          const parentNode = new HuffmanTreeNode(
              '',
              leftChild.frequency + rightChild.frequency,
              leftChild,
              rightChild
          );
          
          // Add the new internal node back to the queue
          nodeQueue.push(parentNode);
      }

      // The last remaining node is the root of the Huffman tree
      this.root = nodeQueue[0];
  }

  /**
   * Generates Huffman codes for each character in the tree.
   * This method initiates a recursive traversal of the Huffman tree,
   * assigning '0' for left branches and '1' for right branches.
   */
  public generateHuffmanCodes(): void {
      this.encodingMap = {};
      this.generateCodesRecursively(this.root, '');
  }

  /**
   * Encodes the input text using the generated Huffman codes.
   * Each character in the input text is replaced by its Huffman code.
   * 
   * @param inputText The text to encode.
   * @returns A string of '0's and '1's representing the encoded text.
   */
  public encodeText(inputText: string): string {
      let encodedText = '';
      for (const char of inputText) {
          encodedText += this.encodingMap[char] || '';
      }
      return encodedText;
  }

  /**
     * Decodes Huffman-encoded text back to its original form.
     * This method traverses the Huffman tree based on the input bits,
     * outputting a character each time a leaf node is reached.
     * 
     * @param encodedText The Huffman-encoded text (a string of '0's and '1's).
     * @returns The decoded original text.
     */
  public decodeText(encodedText: string): string {
    let decodedText = '';
    let currentNode = this.root;

    for (const bit of encodedText) {
        if (!currentNode) break;

        // Traverse left for '0', right for '1'
        if (bit === '0') {
            currentNode = currentNode.leftChild;
        } else {
            currentNode = currentNode.rightChild;
        }

        // If we've reached a leaf node (containing a character)
        if (currentNode && currentNode.character) {
            decodedText += currentNode.character;
            currentNode = this.root; // Reset to root for next character
        }
    }

    return decodedText;
}

/**
 * Calculates the frequency of each character in the given text.
 * 
 * @param text The input text to analyze.
 * @returns A map where keys are characters and values are their frequencies.
 */
private calculateCharacterFrequencies(text: string): Map<string, number> {
    const frequencyMap = new Map<string, number>();
    for (const char of text) {
        frequencyMap.set(char, (frequencyMap.get(char) || 0) + 1);
    }
    return frequencyMap;
}

/**
 * Creates the initial queue of Huffman tree nodes based on character frequencies.
 * 
 * @param frequencyMap A map of characters to their frequencies.
 * @returns An array of HuffmanTreeNode objects, one for each unique character.
 */
private createInitialNodeQueue(frequencyMap: Map<string, number>): HuffmanTreeNode[] {
    return Array.from(frequencyMap.entries()).map(
        ([char, freq]) => new HuffmanTreeNode(char, freq)
    );
}

/**
 * Recursively generates Huffman codes for each character in the tree.
 * This method performs a depth-first traversal of the Huffman tree,
 * building the code for each character as it goes.
 * 
 * @param node The current node in the traversal.
 * @param code The code built up to this node.
 */
private generateCodesRecursively(node: HuffmanTreeNode | null, code: string): void {
    if (!node) return;

    // If this is a leaf node (has a character), store its code
    if (node.character) {
        this.encodingMap[node.character] = code;
    }

    // Recursively traverse left (adding '0' to the code) and right (adding '1')
    this.generateCodesRecursively(node.leftChild, code + '0');
    this.generateCodesRecursively(node.rightChild, code + '1');
}
}

function demonstrateHuffmanCompression(): void {
const huffman = new HuffmanCompression();
const sampleText = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam mollitia ducimus sunt veniam, quaerat voluptate excepturi odit similique, quas error libero sapiente illo possimus magnam eligendi. Quod, incidunt. Quas, officiis.";

console.log("Original text:", sampleText);

huffman.buildHuffmanTree(sampleText);
huffman.generateHuffmanCodes();

const encodedText = huffman.encodeText(sampleText);
console.log("Encoded text:", encodedText);

const decodedText = huffman.decodeText(encodedText);
console.log("Decoded text:", decodedText);

console.log("Original length:", sampleText.length * 8, "bits");
console.log("Compressed length:", encodedText.length, "bits");
console.log("Compression ratio:", ((encodedText.length / (sampleText.length * 8)) * 100).toFixed(2) + "%");

console.log("Compression is lossless:", sampleText === decodedText);
}

demonstrateHuffmanCompression();