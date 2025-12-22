import { type TreeItem } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts a record of files to a tree structure.
 * @param files - Record of file paths to content
 * @returns Tree structure for TreeView component
 *
 * @example
 * Input: {"src/Button.tsx": "...", "README.md": "..."}
 * Output: [["src", "Button.tsx"], "README.md"]
 */
export function convertFilesToTreeItems(files: {
  [path: string]: string;
}): TreeItem[] {
  // 1. Define the intermediate tree structure
  interface TreeNode {
    [key: string]: TreeNode | null;
  }

  const tree: TreeNode = {};
  const sortedPaths = Object.keys(files).sort();

  // 2. Build the intermediate dictionary tree
  for (const filePath of sortedPaths) {
    const parts = filePath.split("/");
    let current = tree;

    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!current[part]) {
        current[part] = {};
      }
      // We know this is safe because we just created it if it didn't exist
      current = current[part] as TreeNode;
    }

    const fileName = parts[parts.length - 1];
    current[fileName] = null; // null indicates a file
  }

  // 3. Recursive function to convert dictionary tree to TreeItem[]
  function buildTree(node: TreeNode): TreeItem[] {
    const items: TreeItem[] = [];

    for (const [key, value] of Object.entries(node)) {
      if (value === null) {
        // It's a file
        items.push(key);
      } else {
        // It's a folder
        const children = buildTree(value);
        // Folder structure: [folderName, ...children]
        items.push([key, ...children]);
      }
    }

    return items;
  }

  // 4. Return the result of the recursion on the root
  return buildTree(tree);
}