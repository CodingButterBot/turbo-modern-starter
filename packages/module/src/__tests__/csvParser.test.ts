import { describe, it, expect } from 'vitest';
import { parseOptionsCSV } from '../csvParser';

describe('csvParser', () => {
  it('parses simple newline-separated items', () => {
    const csv = `Apple
Banana
Cherry`;
    
    const result = parseOptionsCSV(csv);
    
    expect(result).toHaveLength(3);
    expect(result[0].label).toBe('Apple');
    expect(result[1].label).toBe('Banana');
    expect(result[2].label).toBe('Cherry');
  });

  it('handles empty input', () => {
    expect(parseOptionsCSV('')).toEqual([]);
  });

  it('trims whitespace from labels', () => {
    const csv = ` Space Before
Space After   
  Both Spaces  `;
    
    const result = parseOptionsCSV(csv);
    
    expect(result).toHaveLength(3);
    expect(result[0].label).toBe('Space Before');
    expect(result[1].label).toBe('Space After');
    expect(result[2].label).toBe('Both Spaces');
  });

  it('skips empty lines', () => {
    const csv = `First

Second
`;
    
    const result = parseOptionsCSV(csv);
    
    expect(result).toHaveLength(2);
    expect(result[0].label).toBe('First');
    expect(result[1].label).toBe('Second');
  });

  it('parses CSV with header', () => {
    const csv = `label,weight
Option A,5
Option B,2`;
    
    const result = parseOptionsCSV(csv);
    
    expect(result).toHaveLength(2);
    expect(result[0].label).toBe('Option A');
    expect(result[0].weight).toBe(5);
    expect(result[1].label).toBe('Option B');
    expect(result[1].weight).toBe(2);
  });

  it('handles CSV without proper header', () => {
    const csv = `name,value
Option A,5
Option B,2`;
    
    const result = parseOptionsCSV(csv);
    
    // Should treat the first row as data since it doesn't have 'label'
    expect(result).toHaveLength(3);
    expect(result[0].label).toBe('name');
  });

  it('can handle different CSV formats', () => {
    const csv = `id,label,weight,other
1,Option A,5,xyz
2,Option B,2,abc`;
    
    const result = parseOptionsCSV(csv);
    
    expect(result).toHaveLength(2);
    expect(result[0].label).toBe('Option A');
    expect(result[0].weight).toBe(5);
    expect(result[1].label).toBe('Option B');
    expect(result[1].weight).toBe(2);
  });
});