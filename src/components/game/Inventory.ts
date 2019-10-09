// TOOLBOX CLASS
// Toolbox class includes the various elements accessible to the player for a specific level.
// Sandbox mode would have infinite tools available to the player

export interface Tool {
  element: string;
  quantity: number;
}

export default class Inventory {
  tools: Tool[];

  constructor(tools: Tool[] = []) {
    this.tools = tools;
  }

  add(tool: Tool): void {
    // Check if element exists in list to update its value otherzise create it
    this.tools.push(tool);
  }

  toString(): string {
    let resultStr = "Toolbox contains:\n";
    this.tools.forEach((tool: Tool) => {
      resultStr += JSON.stringify(tool);
    });
    return resultStr;
  }
}
