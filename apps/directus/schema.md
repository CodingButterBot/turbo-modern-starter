# Directus Data Schema

This document defines the data schema used in the Directus CMS for the Turbo Modern Starter project.

## Collections

### 1. module_options

This collection stores predefined sets of options that can be used in the module component.

**Fields:**
- `id` (Primary Key): Auto-incremented unique identifier
- `name` (String): Name of the module options set
- `description` (Text): Description of the module options set
- `status` (Status): Publication status (published, draft, archived)
- `user_created` (User): User who created the set
- `date_created` (Datetime): Date and time when the set was created
- `user_updated` (User): User who last updated the set
- `date_updated` (Datetime): Date and time when the set was last updated

### 2. module_option_items

This collection stores the individual items within each module options set.

**Fields:**
- `id` (Primary Key): Auto-incremented unique identifier
- `options_id` (M2O): Foreign key to module_options collection
- `label` (String): Display text for the option
- `weight` (Integer): Optional weight for probability calculation (defaults to 1)
- `color` (String): Optional color code for styling
- `sort` (Integer): Sorting order within the set
- `status` (Status): Publication status (published, draft, archived)

### 3. module_results

This collection tracks the results of module activations (spins).

**Fields:**
- `id` (Primary Key): Auto-incremented unique identifier
- `options_id` (M2O): Foreign key to module_options collection (which set was used)
- `result_item_id` (M2O): Foreign key to module_option_items (which item was selected)
- `date_created` (Datetime): When the result was generated
- `user_id` (User): Which user generated the result
- `device_info` (JSON): Information about the device/platform used
- `notes` (Text): Any additional notes about this result

### 4. user_preferences

This collection stores user-specific settings and preferences.

**Fields:**
- `id` (Primary Key): Auto-incremented unique identifier
- `user_id` (User): Foreign key to Directus users
- `theme` (String): Preferred theme (light/dark/system)
- `default_options_id` (M2O): Foreign key to preferred module_options set
- `settings` (JSON): Additional user settings as JSON

## Relationships

1. **module_options → module_option_items**: One-to-many relationship
   - A set of options contains multiple items
   - Field: `options_id` in module_option_items references `id` in module_options

2. **module_options → module_results**: One-to-many relationship
   - A set of options can be used in multiple results
   - Field: `options_id` in module_results references `id` in module_options

3. **module_option_items → module_results**: One-to-many relationship
   - An option item can be the result of multiple spins
   - Field: `result_item_id` in module_results references `id` in module_option_items

4. **users → user_preferences**: One-to-one relationship
   - Each user has one preferences record
   - Field: `user_id` in user_preferences references user ID

5. **module_options → user_preferences**: Many-to-many relationship
   - Users can have different default option sets
   - Field: `default_options_id` in user_preferences references `id` in module_options

## Roles and Permissions

1. **Administrator**: Full access to all collections and fields

2. **Editor**:
   - Full CRUD access to module_options and module_option_items
   - Read-only access to module_results
   - No access to user_preferences

3. **User**:
   - Read-only access to published module_options and module_option_items
   - Create access to module_results
   - Read/update access to their own user_preferences

## Sample Data

Upon installation, the following sample data will be created:

1. **Example Module Options Set**:
   - Name: "Sample Colors"
   - Items: Red, Green, Blue, Yellow
   
2. **Example Module Options Set**:
   - Name: "Team Members"
   - Items: Alice, Bob, Charlie, Diana

## Implementation Notes

When implementing this schema in Directus:

1. Create the collections in the order listed above
2. Setup the relationships after all collections are created
3. Configure permissions based on the roles defined
4. Import the sample data using Directus API or admin interface

To manually install this schema after launching Directus:

1. Navigate to Settings → Data Model
2. Create each collection and its fields
3. Set up relations between collections
4. Configure roles and permissions
5. Add sample data through the Content module