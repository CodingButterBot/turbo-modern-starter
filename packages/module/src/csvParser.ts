import { ModuleOption } from './types';

/**
 * Parse a CSV string into an array of ModuleOption objects
 * 
 * @param csvData The CSV string to parse
 * @returns Array of ModuleOption objects
 * 
 * This is a simple implementation that handles:
 * - One item per line (simplest case)
 * - CSV with a header row (detects if first line contains "label")
 * - CSV with "label" and optional "weight" columns
 */
export function parseOptionsCSV(csvData: string): ModuleOption[] {
  // Split the CSV data into lines and trim whitespace
  const lines = csvData.split(/\r?\n/).map(l => l.trim()).filter(l => l);
  
  if (lines.length === 0) {
    return [];
  }

  // Check if the first line is a header
  const firstLine = lines[0].toLowerCase();
  const hasHeader = firstLine.includes('label');
  
  // Determine column indexes (for proper CSV with headers)
  let labelIndex = 0;
  let weightIndex = -1;
  
  if (hasHeader) {
    const headers = firstLine.split(',').map(h => h.trim().toLowerCase());
    labelIndex = headers.indexOf('label');
    weightIndex = headers.indexOf('weight');
    
    // If no 'label' column found, assume the first column is for labels
    if (labelIndex === -1) {
      labelIndex = 0;
    }
  }

  // Process the data lines (skip header if it exists)
  const dataLines = hasHeader ? lines.slice(1) : lines;
  
  return dataLines.map(line => {
    // Simple case: one item per line, no commas
    if (!line.includes(',')) {
      return { label: line };
    }
    
    // CSV case: split by commas
    const values = line.split(',').map(v => v.trim());
    
    const option: ModuleOption = {
      label: values[labelIndex] || `Option ${values[0]}`,
    };
    
    // Add weight if the column exists and has a valid value
    if (weightIndex !== -1 && values[weightIndex]) {
      const weight = parseFloat(values[weightIndex]);
      if (!isNaN(weight)) {
        option.weight = weight;
      }
    }
    
    return option;
  });
}