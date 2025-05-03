/**
 * Represents an option that can be selected by the module
 */
export interface ModuleOption {
  /**
   * The display label for the option
   */
  label: string;
  
  /**
   * Optional weight to influence selection probability (for weighted selection)
   */
  weight?: number;
  
  /**
   * Additional properties can be added as needed
   */
  [key: string]: any;
}