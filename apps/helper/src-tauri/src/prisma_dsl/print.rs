use crate::prisma_dsl::types::{
    Schema, DataSource, DataSourceProvider, DataSourceURLEnv, Model, ObjectField, ScalarField,
    FieldKind, BaseField, Generator, Enum, ReferentialActions, ScalarFieldDefault, is_call_expression
};
use prisma_internals::format_schema;
use std::error::Error;

type Relation = Option<RelationInfo>;

struct RelationInfo {
    name: Option<String>,
    fields: Option<Vec<String>>,
    references: Option<Vec<String>>,
}

/**
 * Prints Prisma schema code from AST representation.
 * The code is formatted using prisma-format.
 * @param schema the Prisma schema AST
 * @returns code of the Prisma schema
 */
pub async fn print(schema: Schema) -> Result<String, Box<dyn Error>> {
    let mut statements = Vec::new();
    if let Some(dataSource) = schema.data_source {
        statements.push(print_data_source(dataSource)?);
    }
    if !schema.generators.is_empty() {
        statements.extend(schema.generators.into_iter().map(print_generator));
    }
    let provider_type = schema.data_source.as_ref().map(|ds| ds.provider);

    statements.extend(schema.models.into_iter().map(|model| print_model(model, provider_type)));
    statements.extend(schema.enums.into_iter().map(print_enum));
    let schema_text = statements.join("\n");
    Ok(format_schema(&schema_text))
}

/**
 * Prints data source code from AST representation.
 * Note: the code is not formatted.
 * @param schema the data source AST
 * @returns code of the data source
 */
fn print_data_source(data_source: DataSource) -> Result<String, Box<dyn Error>> {
    let url = print_data_source_url(&data_source.url);
    Ok(format!(
        "datasource {} {{
  provider = \"{}\"
  url      = {}
}}",
        data_source.name, data_source.provider, url
    ))
}

fn print_data_source_url(url: &DataSourceURLEnv) -> String {
    if is_data_source_url_env(url) {
        format!("env(\"{}\")", url.name)
    } else {
        format!("\"{}\"", url)
    }
}

fn is_data_source_url_env(url: &DataSourceURLEnv) -> bool {
    matches!(url, DataSourceURLEnv::Env(_))
}

fn print_generator(generator: Generator) -> String {
    let mut fields = vec![format!("provider = \"{}\"", generator.provider)];
    if let Some(output) = generator.output {
        fields.push(format!("output = \"{}\"", output));
    }
    if !generator.binary_targets.is_empty() {
        fields.push(format!("binaryTargets = {}", serde_json::to_string(&generator.binary_targets).unwrap()));
    }
    format!(
        "generator {} {{
  {}
}}",
        generator.name,
        fields.join("\n  ")
    )
}

/**
 * Prints documentation code from AST representation
 * @param documentation the documentation AST representation
 * @returns code of the documentation
 */
fn print_documentation(documentation: &str) -> String {
    format!("/// {}", documentation)
}

/**
 * If defined, adds documentation to the provided code
 * @param documentation documentation of the provided node's code
 * @param code code of an AST node
 * @returns if defined, code with documentation, otherwise the code as is
 */
fn with_documentation(documentation: Option<&str>, code: String) -> String {
    if let Some(documentation) = documentation {
        format!("{}\n{}", print_documentation(documentation), code)
    } else {
        code
    }
}

/**
 * Prints enum code from AST representation
 * Node: the code is not formatted.
 * @param enum_ the enum AST
 * @returns code of the enum
 */
fn print_enum(enum_: Enum) -> String {
    let values_text = enum_.values.join("\n");
    with_documentation(
        enum_.documentation.as_deref(),
        format!("enum {} {{\n{}\n}}", enum_.name, values_text),
    )
}

/**
 * Prints model code from AST representation.
 * Note: the code is not formatted.
 * @param model the model AST
 * @returns code of the model
 */
fn print_model(model: Model, provider: Option<DataSourceProvider>) -> String {
    let field_texts: Vec<String> = model
        .fields
        .into_iter()
        .map(|field| print_field(field, &provider))
        .collect();
    let map = if let Some(map) = model.map {
        print_model_map(&map, true)
    } else {
        "".to_string()
    };
    let attributes_text = print_model_attributes(model.attributes);

    with_documentation(
        model.documentation.as_deref(),
        format!(
            "model {} {{
{}
{}
}}",
            model.name,
            field_texts.join("\n"),
            map,
            attributes_text
        ),
    )
}

fn print_model_attributes(attributes: Option<Vec<String>>) -> String {
    attributes.map_or_else(|| "".to_string(), |attrs| attrs.join("\n"))
}

/**
 * Prints model field code from AST representation.
 * Note: the code is not formatted.
 * @param field the field AST
 * @returns code of the field
 */
fn print_field(field: BaseField, provider: &Option<DataSourceProvider>) -> String {
    with_documentation(
        field.documentation.as_deref(),
        if let FieldKind::Scalar = field.kind {
            print_scalar_field(field.into(), provider)
        } else {
            print_object_field(field.into())
        },
    )
}

fn print_scalar_field(field: ScalarField, provider: &Option<DataSourceProvider>) -> String {
    let modifiers_text = print_field_modifiers(&field);
    let mut attributes = Vec::new();
    let is_mongodb_provider = provider.as_deref() == Some(DataSourceProvider::MongoDB);

    if !field_has_attribute(&field, "@id") && field.is_id {
        if is_mongodb_provider {
            attributes.push("@id @map(\"_id\") @db.ObjectId");
        } else {
            attributes.push("@id");
        }
    }

    if is_mongodb_provider && field.is_foreign_key {
        attributes.push("@db.ObjectId");
    }

    if field.is_unique {
        attributes.push("@unique");
    }
    if field.is_updated_at {
        attributes.push("@updatedAt");
    }
    if !field_has_attribute(&field, "@default") && field.default.is_some() {
        if !(is_mongodb_provider && field.is_id) {
            attributes.push(format!(
                "@default({})",
                print_scalar_default(field.default.unwrap())
            ));
        }
        if is_mongodb_provider && field.is_id {
            attributes.push("@default(auto())".to_string());
        }
    }

    if let Some(field_attributes) = field.attributes {
        attributes.extend_from_slice(&field_attributes);
    }

    let type_text = format!("{}{}", field.type_, modifiers_text);
    let attributes_text = attributes.join(" ");
    vec![field.name, type_text, attributes_text]
        .into_iter()
        .filter(|s| !s.is_empty())
        .collect::<Vec<String>>()
        .join(" ")
}

fn field_has_attribute(field: &ScalarField, attribute_name: &str) -> bool {
    field.attributes
        .as_ref()
        .map_or(false, |attributes| attributes.iter().any(|attribute| attribute.starts_with(attribute_name)))
}

fn print_scalar_default(value: ScalarFieldDefault) -> String {
    match value {
        ScalarFieldDefault::String(s) => s,
        ScalarFieldDefault::Boolean(b) => b.to_string(),
        ScalarFieldDefault::Number(n) => n.to_string(),
        ScalarFieldDefault::CallExpression(expr) => format!("{}()", expr.callee),
    }
}

fn print_object_field(field: ObjectField) -> String {
    let relation = RelationInfo {
        name: field.relation_name,
        fields: Some(field.relation_to_fields),
        references: Some(field.relation_to_references),
    };

    let mut attributes = Vec::new();
    if let Some(relation_attributes) = print_relation(relation, &field) {
        attributes.push(relation_attributes);
    }

    if let Some(field_attributes) = field.attributes {
        attributes.extend_from_slice(&field_attributes);
    }

    let type_text = format!("{}{}", field.type_, print_field_modifiers(&field));
    let attributes_text = attributes.join(" ");
    vec![field.name, type_text, attributes_text]
        .into_iter()
        .filter(|s| !s.is_empty())
        .collect::<Vec<String>>()
        .join(" ")
}

fn print_field_modifiers(field: &BaseField) -> String {
    let mut modifiers = Vec::new();
    if field.is_list {
        modifiers.push("[]");
    }
    if !field.is_required {
        modifiers.push("?");
    }
    modifiers.join("")
}

fn print_relation(relation: RelationInfo, field: &ObjectField) -> Option<String> {
    let name_text = relation.name.map_or_else(|| "".to_string(), |name| format!("name: \"{}\"", name));
    let fields_text = relation.fields.map_or_else(|| "".to_string(), |fields| format!("fields: [{}]", fields.join(", ")));
    let references_text = relation.references.map_or_else(|| "".to_string(), |references| format!("references: [{}]", references.join(", ")));

    let on_delete_action = if field.relation_on_delete != ReferentialActions::NONE {
        format!("onDelete: {}", field.relation_on_delete)
    } else {
        "".to_string()
    };

    let on_update_action = if field.relation_on_update != ReferentialActions::NONE {
        format!("onUpdate: {}", field.relation_on_update)
    } else {
        "".to_string()
    };

    Some(format!(
        "@relation({})",
        vec![name_text, fields_text, references_text, on_delete_action, on_update_action]
            .into_iter()
            .filter(|s| !s.is_empty())
            .collect::<Vec<String>>()
            .join(", ")
    ))
}

fn print_model_map(name: &str, prepend_new_lines: bool) -> String {
    let prefix = if prepend_new_lines { "\n\n" } else { "" };
    format!("@@map(\"{}\")", name)
}
