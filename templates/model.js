/**
 * Schema Definitions
 *
 */
import mongoose from 'mongoose';

const {schemaName} = new mongoose.Schema(
  {fields}
);

// Compiles the schema into a model, opening (or creating, if
//	nonexistent) the '{modelName}' collection in the MongoDB database
export default mongoose.model('{modelName}', {schemaName});

