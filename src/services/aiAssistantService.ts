import { supabase } from '../utils/supabaseClient';

export interface AICommand {
  id: string;
  command: string;
  result: any;
  timestamp: Date;
  status: 'success' | 'error' | 'pending';
}

interface QueryResult {
  data?: any[];
  error?: string;
  message?: string;
  affectedRows?: number;
}

export class AIAssistantService {
  private commandHistory: AICommand[] = [];

  // Parse natural language commands to SQL/operations
  private parseCommand(command: string): {
    action: string;
    table: string;
    conditions?: any;
    updates?: any;
    data?: any;
  } | null {
    const lowerCommand = command.toLowerCase().trim();

    // Show/List commands
    if (lowerCommand.includes('show') || lowerCommand.includes('list') || lowerCommand.includes('find')) {
      return {
        action: 'select',
        table: this.extractTable(lowerCommand),
        conditions: this.extractConditions(lowerCommand)
      };
    }

    // Add/Create commands
    if (lowerCommand.includes('add') || lowerCommand.includes('create')) {
      return {
        action: 'insert',
        table: this.extractTable(lowerCommand),
        data: this.extractData(lowerCommand)
      };
    }

    // Update commands
    if (lowerCommand.includes('update') || lowerCommand.includes('change') || lowerCommand.includes('modify')) {
      return {
        action: 'update',
        table: this.extractTable(lowerCommand),
        conditions: this.extractConditions(lowerCommand),
        updates: this.extractUpdates(lowerCommand)
      };
    }

    // Delete commands
    if (lowerCommand.includes('delete') || lowerCommand.includes('remove')) {
      return {
        action: 'delete',
        table: this.extractTable(lowerCommand),
        conditions: this.extractConditions(lowerCommand)
      };
    }

    return null;
  }

  private extractTable(command: string): string {
    if (command.includes('product')) return 'products';
    if (command.includes('user')) return 'users';
    if (command.includes('category') || command.includes('categories')) return 'categories';
    if (command.includes('review')) return 'reviews';
    return 'products'; // default
  }

  private extractConditions(command: string): any {
    const conditions: any = {};

    // Rating conditions
    const ratingMatch = command.match(/rating\s*[><=]+\s*(\d+(?:\.\d+)?)/);
    if (ratingMatch) {
      const operator = command.includes('>') ? 'gt' : command.includes('<') ? 'lt' : 'eq';
      conditions.rating = { [operator]: parseFloat(ratingMatch[1]) };
    }

    // Price conditions
    const priceMatch = command.match(/price\s*[><=]+\s*\$?(\d+(?:\.\d+)?)/);
    if (priceMatch) {
      const operator = command.includes('>') ? 'gt' : command.includes('<') ? 'lt' : 'eq';
      conditions.price = { [operator]: parseFloat(priceMatch[1]) };
    }

    // Category conditions
    const categoryMatch = command.match(/category\s+["']?([^"'\s]+)["']?/);
    if (categoryMatch) {
      conditions.category = { eq: categoryMatch[1] };
    }

    // Brand conditions
    const brandMatch = command.match(/brand\s+["']?([^"'\s]+)["']?/);
    if (brandMatch) {
      conditions.brand = { eq: brandMatch[1] };
    }

    // No conditions - special keywords
    if (command.includes('all')) {
      return {}; // Return all
    }

    if (command.includes('no image') || command.includes('missing image')) {
      conditions.image = { eq: '' };
    }

    if (command.includes('no description') || command.includes('missing description')) {
      conditions.description = { eq: '' };
    }

    if (command.includes('no affiliate') || command.includes('missing affiliate')) {
      conditions.externalUrl = { eq: '' };
    }

    return conditions;
  }

  private extractUpdates(command: string): any {
    const updates: any = {};

    // Price updates
    const priceIncrease = command.match(/price\s*\+\s*(\d+(?:\.\d+)?)%?/);
    const priceDecrease = command.match(/price\s*-\s*(\d+(?:\.\d+)?)%?/);
    const priceSet = command.match(/price\s*=?\s*\$?(\d+(?:\.\d+)?)/);

    if (priceIncrease) {
      const percent = parseFloat(priceIncrease[1]);
      updates.priceMultiplier = command.includes('%') ? (1 + percent / 100) : percent;
    } else if (priceDecrease) {
      const percent = parseFloat(priceDecrease[1]);
      updates.priceMultiplier = command.includes('%') ? (1 - percent / 100) : -percent;
    } else if (priceSet) {
      updates.price = parseFloat(priceSet[1]);
    }

    // Category updates
    const categoryMatch = command.match(/category\s+(?:to\s+)?["']?([^"'\s]+)["']?/);
    if (categoryMatch) {
      updates.category = categoryMatch[1];
    }

    return updates;
  }

  private extractData(command: string): any {
    // For adding new products - basic extraction
    const data: any = {};

    const nameMatch = command.match(/(?:name|product)\s+["']([^"']+)["']/);
    if (nameMatch) {
      data.name = nameMatch[1];
    }

    const priceMatch = command.match(/price\s*\$?(\d+(?:\.\d+)?)/);
    if (priceMatch) {
      data.price = parseFloat(priceMatch[1]);
    }

    const categoryMatch = command.match(/category\s+["']?([^"'\s]+)["']?/);
    if (categoryMatch) {
      data.category = categoryMatch[1];
    }

    return data;
  }

  // Execute parsed command
  private async executeCommand(parsedCommand: any): Promise<QueryResult> {
    try {
      const { action, table, conditions, updates, data } = parsedCommand;

      switch (action) {
        case 'select':
          return await this.executeSelect(table, conditions);
        
        case 'update':
          return await this.executeUpdate(table, conditions, updates);
        
        case 'delete':
          return await this.executeDelete(table, conditions);
        
        case 'insert':
          return await this.executeInsert(table, data);
        
        default:
          return { error: 'Unknown action' };
      }
    } catch (error) {
      return { error: `Execution failed: ${error}` };
    }
  }

  private async executeSelect(table: string, conditions: any): Promise<QueryResult> {
    let query = supabase.from(table).select('*');

    // Apply conditions
    Object.entries(conditions).forEach(([field, condition]: [string, any]) => {
      if (typeof condition === 'object') {
        Object.entries(condition).forEach(([operator, value]) => {
          switch (operator) {
            case 'gt':
              query = query.gt(field, value);
              break;
            case 'lt':
              query = query.lt(field, value);
              break;
            case 'eq':
              query = query.eq(field, value);
              break;
          }
        });
      }
    });

    const { data, error } = await query.limit(100); // Limit for safety

    if (error) {
      return { error: error.message };
    }

    return { 
      data, 
      message: `Found ${data?.length || 0} records` 
    };
  }

  private async executeUpdate(table: string, conditions: any, updates: any): Promise<QueryResult> {
    // Handle special price multiplier
    if (updates.priceMultiplier) {
      const { data: products, error: selectError } = await supabase
        .from(table)
        .select('id, price');

      if (selectError) {
        return { error: selectError.message };
      }

      const updatePromises = products?.map(async (product) => {
        const newPrice = product.price * updates.priceMultiplier;
        return supabase
          .from(table)
          .update({ price: Math.round(newPrice * 100) / 100 })
          .eq('id', product.id);
      }) || [];

      const results = await Promise.all(updatePromises);
      const errors = results.filter(r => r.error);
      
      if (errors.length > 0) {
        return { error: `Failed to update ${errors.length} records` };
      }

      return { 
        affectedRows: products?.length || 0,
        message: `Updated ${products?.length || 0} products' prices` 
      };
    }

    // Regular update
    let query = supabase.from(table).update(updates);

    // Apply conditions
    Object.entries(conditions).forEach(([field, condition]: [string, any]) => {
      if (typeof condition === 'object') {
        Object.entries(condition).forEach(([operator, value]) => {
          switch (operator) {
            case 'gt':
              query = query.gt(field, value);
              break;
            case 'lt':
              query = query.lt(field, value);
              break;
            case 'eq':
              query = query.eq(field, value);
              break;
          }
        });
      }
    });

    const { data, error } = await query;

    if (error) {
      return { error: error.message };
    }

    return { 
      data,
      message: `Updated records successfully` 
    };
  }

  private async executeDelete(table: string, conditions: any): Promise<QueryResult> {
    let query = supabase.from(table).delete();

    // Apply conditions  
    Object.entries(conditions).forEach(([field, condition]: [string, any]) => {
      if (typeof condition === 'object') {
        Object.entries(condition).forEach(([operator, value]) => {
          switch (operator) {
            case 'gt':
              query = query.gt(field, value);
              break;
            case 'lt':
              query = query.lt(field, value);
              break;
            case 'eq':
              query = query.eq(field, value);
              break;
          }
        });
      }
    });

    const { data, error } = await query;

    if (error) {
      return { error: error.message };
    }

    return { 
      data,
      message: `Deleted records successfully` 
    };
  }

  private async executeInsert(table: string, data: any): Promise<QueryResult> {
    const { data: result, error } = await supabase
      .from(table)
      .insert([data]);

    if (error) {
      return { error: error.message };
    }

    return { 
      data: result,
      message: `Added new record successfully` 
    };
  }

  // Main public method
  public async processCommand(command: string): Promise<AICommand> {
    const commandId = Date.now().toString();
    const aiCommand: AICommand = {
      id: commandId,
      command,
      result: null,
      timestamp: new Date(),
      status: 'pending'
    };

    try {
      // Parse the command
      const parsedCommand = this.parseCommand(command);
      
      if (!parsedCommand) {
        aiCommand.result = { 
          error: 'Could not understand command. Try: "show all products", "update products price +10%", "find products rating > 4"' 
        };
        aiCommand.status = 'error';
      } else {
        // Execute the command
        const result = await this.executeCommand(parsedCommand);
        aiCommand.result = result;
        aiCommand.status = result.error ? 'error' : 'success';
      }
    } catch (error) {
      aiCommand.result = { error: `Command failed: ${error}` };
      aiCommand.status = 'error';
    }

    // Add to history
    this.commandHistory.unshift(aiCommand);
    
    // Keep only last 50 commands
    if (this.commandHistory.length > 50) {
      this.commandHistory = this.commandHistory.slice(0, 50);
    }

    return aiCommand;
  }

  public getCommandHistory(): AICommand[] {
    return this.commandHistory;
  }

  public getExampleCommands(): string[] {
    return [
      "Show all products",
      "Find products with rating > 4",
      "Show products with no images",
      "Update all Electronics category price +10%",
      "Find products missing affiliate links",
      "Show products price < $50",
      "Delete products with rating < 2",
      "Show all categories",
      "Find products with no description"
    ];
  }
}

export const aiAssistant = new AIAssistantService();
