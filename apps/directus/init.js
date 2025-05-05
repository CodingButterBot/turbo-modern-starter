/**
 * Directus Schema Initialization Script
 * 
 * This script can be run to programmatically set up the schema in Directus.
 * It requires the Directus SDK and an admin token to run.
 * 
 * Usage:
 * 1. Make sure Directus is running
 * 2. Set DIRECTUS_URL and ADMIN_TOKEN environment variables
 * 3. Run: node init.js
 */

const { Directus } = require('@directus/sdk');
const fs = require('fs');
const path = require('path');

// Configuration
const directusUrl = process.env.DIRECTUS_URL || 'http://localhost:8055';
const adminToken = process.env.ADMIN_TOKEN;

if (!adminToken) {
  console.error('Error: ADMIN_TOKEN environment variable is required');
  process.exit(1);
}

// Initialize Directus SDK client
const directus = new Directus(directusUrl, {
  auth: {
    staticToken: adminToken
  }
});

async function initializeSchema() {
  try {
    console.log('Initializing Directus schema...');

    // Create collections
    await createCollections();
    
    // Import sample data
    await importSampleData();
    
    console.log('Schema initialization completed successfully!');
  } catch (error) {
    console.error('Failed to initialize schema:', error);
    process.exit(1);
  }
}

async function createCollections() {
  // Define collections
  const collectionsToCreate = [
    {
      collection: 'module_options',
      meta: {
        icon: 'list_alt',
        display_template: '{{name}}',
        sort_field: 'name'
      },
      schema: {
        name: 'module_options',
        comment: 'Module option sets'
      },
      fields: [
        {
          field: 'id',
          type: 'integer',
          meta: {
            hidden: true,
            interface: 'input',
            readonly: true
          },
          schema: {
            is_primary_key: true,
            has_auto_increment: true
          }
        },
        {
          field: 'name',
          type: 'string',
          meta: {
            interface: 'input',
            required: true
          },
          schema: {
            is_nullable: false
          }
        },
        {
          field: 'description',
          type: 'text',
          meta: {
            interface: 'input-multiline'
          }
        },
        {
          field: 'status',
          type: 'string',
          meta: {
            interface: 'select-dropdown',
            options: {
              choices: [
                { text: 'Published', value: 'published' },
                { text: 'Draft', value: 'draft' },
                { text: 'Archived', value: 'archived' }
              ]
            },
            required: true,
            width: 'half'
          },
          schema: {
            default_value: 'draft',
            is_nullable: false
          }
        },
        {
          field: 'user_created',
          type: 'user',
          meta: {
            interface: 'select-dropdown-m2o',
            hidden: true,
            readonly: true,
            width: 'half'
          }
        },
        {
          field: 'date_created',
          type: 'timestamp',
          meta: {
            interface: 'datetime',
            hidden: true,
            readonly: true,
            width: 'half'
          }
        },
        {
          field: 'user_updated',
          type: 'user',
          meta: {
            interface: 'select-dropdown-m2o',
            hidden: true,
            readonly: true,
            width: 'half'
          }
        },
        {
          field: 'date_updated',
          type: 'timestamp',
          meta: {
            interface: 'datetime',
            hidden: true,
            readonly: true,
            width: 'half'
          }
        }
      ]
    },
    {
      collection: 'module_option_items',
      meta: {
        icon: 'label',
        display_template: '{{label}}',
        sort_field: 'sort'
      },
      schema: {
        name: 'module_option_items',
        comment: 'Individual items in module option sets'
      },
      fields: [
        {
          field: 'id',
          type: 'integer',
          meta: {
            hidden: true,
            interface: 'input',
            readonly: true
          },
          schema: {
            is_primary_key: true,
            has_auto_increment: true
          }
        },
        {
          field: 'options_id',
          type: 'integer',
          meta: {
            interface: 'select-dropdown-m2o',
            options: {
              template: '{{name}}'
            },
            required: true,
            width: 'full'
          },
          schema: {
            is_nullable: false,
            foreign_key_table: 'module_options',
            foreign_key_column: 'id'
          }
        },
        {
          field: 'label',
          type: 'string',
          meta: {
            interface: 'input',
            required: true
          },
          schema: {
            is_nullable: false
          }
        },
        {
          field: 'weight',
          type: 'integer',
          meta: {
            interface: 'input',
            width: 'half'
          },
          schema: {
            default_value: 1,
            numeric_precision: 10,
            numeric_scale: 0
          }
        },
        {
          field: 'color',
          type: 'string',
          meta: {
            interface: 'color',
            width: 'half'
          }
        },
        {
          field: 'sort',
          type: 'integer',
          meta: {
            interface: 'input',
            width: 'half'
          }
        },
        {
          field: 'status',
          type: 'string',
          meta: {
            interface: 'select-dropdown',
            options: {
              choices: [
                { text: 'Published', value: 'published' },
                { text: 'Draft', value: 'draft' },
                { text: 'Archived', value: 'archived' }
              ]
            },
            required: true,
            width: 'half'
          },
          schema: {
            default_value: 'draft',
            is_nullable: false
          }
        }
      ]
    },
    {
      collection: 'module_results',
      meta: {
        icon: 'analytics',
        display_template: '{{id}} - {{date_created}}'
      },
      schema: {
        name: 'module_results',
        comment: 'Results of module activations'
      },
      fields: [
        {
          field: 'id',
          type: 'integer',
          meta: {
            hidden: true,
            interface: 'input',
            readonly: true
          },
          schema: {
            is_primary_key: true,
            has_auto_increment: true
          }
        },
        {
          field: 'options_id',
          type: 'integer',
          meta: {
            interface: 'select-dropdown-m2o',
            options: {
              template: '{{name}}'
            },
            required: true,
            width: 'half'
          },
          schema: {
            is_nullable: false,
            foreign_key_table: 'module_options',
            foreign_key_column: 'id'
          }
        },
        {
          field: 'result_item_id',
          type: 'integer',
          meta: {
            interface: 'select-dropdown-m2o',
            options: {
              template: '{{label}}'
            },
            required: true,
            width: 'half'
          },
          schema: {
            is_nullable: false,
            foreign_key_table: 'module_option_items',
            foreign_key_column: 'id'
          }
        },
        {
          field: 'date_created',
          type: 'timestamp',
          meta: {
            interface: 'datetime',
            readonly: true,
            width: 'half'
          },
          schema: {
            on_create: 'now()'
          }
        },
        {
          field: 'user_id',
          type: 'user',
          meta: {
            interface: 'select-dropdown-m2o',
            width: 'half'
          }
        },
        {
          field: 'device_info',
          type: 'json',
          meta: {
            interface: 'input-code',
            options: {
              language: 'json'
            }
          }
        },
        {
          field: 'notes',
          type: 'text',
          meta: {
            interface: 'input-multiline'
          }
        }
      ]
    },
    {
      collection: 'user_preferences',
      meta: {
        icon: 'settings',
        display_template: '{{user_id.email}}'
      },
      schema: {
        name: 'user_preferences',
        comment: 'User preferences and settings'
      },
      fields: [
        {
          field: 'id',
          type: 'integer',
          meta: {
            hidden: true,
            interface: 'input',
            readonly: true
          },
          schema: {
            is_primary_key: true,
            has_auto_increment: true
          }
        },
        {
          field: 'user_id',
          type: 'user',
          meta: {
            interface: 'select-dropdown-m2o',
            required: true,
            width: 'half'
          },
          schema: {
            is_nullable: false,
            unique: true
          }
        },
        {
          field: 'theme',
          type: 'string',
          meta: {
            interface: 'select-dropdown',
            options: {
              choices: [
                { text: 'Light', value: 'light' },
                { text: 'Dark', value: 'dark' },
                { text: 'System', value: 'system' }
              ]
            },
            width: 'half'
          },
          schema: {
            default_value: 'system'
          }
        },
        {
          field: 'default_options_id',
          type: 'integer',
          meta: {
            interface: 'select-dropdown-m2o',
            options: {
              template: '{{name}}'
            },
            width: 'half'
          },
          schema: {
            foreign_key_table: 'module_options',
            foreign_key_column: 'id'
          }
        },
        {
          field: 'settings',
          type: 'json',
          meta: {
            interface: 'input-code',
            options: {
              language: 'json'
            }
          }
        }
      ]
    }
  ];

  for (const collection of collectionsToCreate) {
    console.log(`Creating collection: ${collection.collection}`);
    
    try {
      // Create the collection
      await directus.collections.createOne(collection);
      console.log(`✓ Collection ${collection.collection} created successfully`);
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log(`! Collection ${collection.collection} already exists, skipping...`);
      } else {
        throw error;
      }
    }
  }

  // Create relations
  console.log('Setting up relationships between collections...');
  
  // Relations will be automatically created from the foreign key definitions in the schema
  console.log('✓ Relationships set up successfully');
}

async function importSampleData() {
  try {
    console.log('Importing sample data...');
    
    // Read sample data from the file
    const sampleDataPath = path.join(__dirname, 'sample-data.json');
    const sampleData = JSON.parse(fs.readFileSync(sampleDataPath, 'utf8'));
    
    // Import module_options
    for (const optionsSet of sampleData.module_options) {
      const { module_option_items, ...optionsData } = optionsSet;
      
      // Create the options set
      console.log(`Creating module options set: ${optionsData.name}`);
      const { id: optionsId } = await directus.items('module_options').createOne(optionsData);
      
      // Create all the option items with the parent options_id
      if (module_option_items && module_option_items.length > 0) {
        console.log(`Creating ${module_option_items.length} option items for set: ${optionsData.name}`);
        for (const item of module_option_items) {
          await directus.items('module_option_items').createOne({
            ...item,
            options_id: optionsId
          });
        }
      }
    }
    
    console.log('✓ Sample data imported successfully');
  } catch (error) {
    console.error('Error importing sample data:', error);
    throw error;
  }
}

// Run the initialization
initializeSchema()
  .then(() => {
    console.log('Directus schema setup completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to set up Directus schema:', error);
    process.exit(1);
  });