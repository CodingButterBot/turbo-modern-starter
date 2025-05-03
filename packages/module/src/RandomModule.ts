import { ModuleOption } from './types';

/**
 * Core module logic for randomly selecting from a list of options
 */
export class RandomModule {
  private options: ModuleOption[];

  /**
   * Create a new RandomModule with the given options
   * 
   * @param options Array of options to select from
   * @throws Error if options array is empty
   */
  constructor(options: ModuleOption[]) {
    if (!Array.isArray(options) || options.length === 0) {
      throw new Error('Module options must be a non-empty array');
    }
    this.options = options;
  }

  /**
   * Spin the wheel and pick a random option with uniform distribution
   * 
   * @returns The selected ModuleOption
   */
  spin(): ModuleOption {
    const idx = Math.floor(Math.random() * this.options.length);
    return this.options[idx];
  }

  /**
   * Spin the wheel taking weights into account if specified
   * 
   * @returns The selected ModuleOption
   */
  spinWeighted(): ModuleOption {
    // If no weights are specified, fall back to uniform distribution
    if (!this.options.some(option => option.weight !== undefined)) {
      return this.spin();
    }

    // Calculate total weight and ensure all options have a weight
    const optionsWithWeights = this.options.map(option => ({
      ...option,
      weight: option.weight ?? 1,
    }));

    const totalWeight = optionsWithWeights.reduce(
      (sum, option) => sum + option.weight!,
      0
    );

    // Generate a random value between 0 and total weight
    const randomValue = Math.random() * totalWeight;
    
    // Find the option that corresponds to the random value
    let cumulativeWeight = 0;
    for (const option of optionsWithWeights) {
      cumulativeWeight += option.weight!;
      if (randomValue <= cumulativeWeight) {
        return option;
      }
    }

    // Fallback (should never reach here if math is correct)
    return optionsWithWeights[optionsWithWeights.length - 1];
  }

  /**
   * Get all available options
   * 
   * @returns Array of all options
   */
  getOptions(): ModuleOption[] {
    return [...this.options];
  }

  /**
   * Add a new option to the existing list
   * 
   * @param option The option to add
   */
  addOption(option: ModuleOption): void {
    this.options.push(option);
  }

  /**
   * Remove an option by its label
   * 
   * @param label The label of the option to remove
   * @returns true if the option was found and removed, false otherwise
   */
  removeOption(label: string): boolean {
    const initialLength = this.options.length;
    this.options = this.options.filter(option => option.label !== label);
    return this.options.length < initialLength;
  }
}