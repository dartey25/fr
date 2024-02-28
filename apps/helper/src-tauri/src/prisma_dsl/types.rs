/// Prisma's Schema data source provider
/// [See Prisma Documentation](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-schema/data-sources#fields)
#[derive(Debug, PartialEq, Eq)]
pub enum DataSourceProvider {
    PostgreSQL,
    MySQL,
    SQLite,
    MongoDB,
    MSSQLServer,
}

/// Prisma's Schema data source URL environment variable
/// [See Prisma Documentation](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-schema/data-sources#examples)
#[derive(Debug, PartialEq, Eq)]
pub struct DataSourceURLEnv {
    pub name: String,
}

/// Checks if the provided URL is a Prisma data source URL environment variable
pub fn is_data_source_url_env(url: &str) -> bool {
    serde_json::from_str::<DataSourceURLEnv>(url).is_ok()
}

/// Prisma's Schema data source
/// [See Prisma Documentation](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-schema/data-sources)
#[derive(Debug, PartialEq, Eq)]
pub struct DataSource {
    pub name: String,
    pub provider: DataSourceProvider,
    pub url: String,
}

/// Prisma's Schema generator
/// [See Prisma Documentation](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-schema/generators)
#[derive(Debug, PartialEq, Eq)]
pub struct Generator {
    pub name: String,
    pub provider: String,
    pub output: Option<String>,
    pub binary_targets: Option<Vec<String>>,
}

/// Prisma's data model scalar types
/// [See Prisma Documentation](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-schema/data-model#scalar-types)
#[derive(Debug, PartialEq, Eq)]
pub enum ScalarType {
    String,
    Boolean,
    Int,
    BigInt,
    Float,
    Decimal,
    DateTime,
    Json,
}

/// Prisma's referential actions
/// [See Prisma Documentation](https://www.prisma.io/docs/concepts/components/prisma-schema/relations/referential-actions#types-of-referential-actions)
#[derive(Debug, PartialEq, Eq)]
pub enum ReferentialActions {
    NONE,
    Cascade,
    Restrict,
    NoAction,
    SetNull,
    SetDefault,
}

/// Create a sequence of integers in the underlying database and assign the incremented values
/// to the ID values of the created records based on the sequence
pub const AUTO_INCREMENT: &str = "autoincrement";

/// Set a timestamp of the time when a record is created.
pub const NOW: &str = "now";

/// Generate a globally unique identifier based on the cuid spec
pub const CUID: &str = "cuid";

/// Generate a globally unique identifier based on the UUID spec.
pub const UUID: &str = "uuid";

/// Represents default values that can't be expressed in the Prisma schema.
/// Only available after introspection.
pub const DB_GENERATED: &str = "dbgenerated";

/// Represents a function call expression
#[derive(Debug, PartialEq, Eq)]
pub struct CallExpression {
    pub callee: String,
}

/// Checks if the provided object is a CallExpression
pub fn is_call_expression(object: &serde_json::Value) -> bool {
    object.get("callee").is_some()
}

/// Enum representing field kinds in Prisma schema
#[derive(Debug, PartialEq, Eq)]
pub enum FieldKind {
    Scalar,
    Object,
}

/// Represents a base field in Prisma schema
#[derive(Debug, PartialEq, Eq)]
pub struct BaseField {
    pub name: String,
    pub is_list: bool,
    pub is_required: bool,
    pub documentation: Option<String>,
    pub attributes: Option<Vec<String>>,
}

/// Represents default values for scalar fields in Prisma schema
#[derive(Debug, PartialEq, Eq)]
pub enum ScalarFieldDefault {
    Null,
    Boolean(bool),
    CallExpression(CallExpression),
    Number(i64),
    String(String),
}

/// Represents a scalar field in Prisma schema
#[derive(Debug, PartialEq, Eq)]
pub struct ScalarField {
    pub kind: FieldKind,
    pub type_: ScalarType,
    pub is_id: bool,
    pub is_unique: bool,
    pub is_updated_at: bool,
    pub default: ScalarFieldDefault,
    pub is_foreign_key: bool,
    pub name: String,
    pub is_list: bool,
    pub is_required: bool,
    pub documentation: Option<String>,
    pub attributes: Option<Vec<String>>,
}

/// Represents an object field in Prisma schema
#[derive(Debug, PartialEq, Eq)]
pub struct ObjectField {
    pub kind: FieldKind,
    pub type_: String,
    pub relation_name: Option<String>,
    pub relation_to_fields: Vec<String>,
    pub relation_to_references: Vec<String>,
    pub relation_on_delete: Option<ReferentialActions>,
    pub relation_on_update: Option<ReferentialActions>,
    pub name: String,
    pub is_list: bool,
    pub is_required: bool,
    pub documentation: Option<String>,
    pub attributes: Option<Vec<String>>,
}

/// Represents a data model in Prisma schema
#[derive(Debug, PartialEq, Eq)]
pub struct Model {
    pub name: String,
    pub fields: Vec<BaseField>,
    pub map: Option<String>,
    pub documentation: Option<String>,
    pub attributes: Option<Vec<String>>,
}

/// Represents an enum in Prisma schema
#[derive(Debug, PartialEq, Eq)]
pub struct Enum {
    pub name: String,
    pub values: Vec<String>,
    pub documentation: Option<String>,
}

/// Represents a Prisma schema
#[derive(Debug, PartialEq, Eq)]
pub struct Schema {
    pub models: Vec<Model>,
    pub enums: Vec<Enum>,
    pub data_source: Option<DataSource>,
    pub generators: Vec<Generator>,
}