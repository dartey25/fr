use crate::prisma_dsl::types::{
    DataSource, Model, Schema, ScalarField, ObjectField, ScalarType, FieldKind, 
    DataSourceProvider, DataSourceURLEnv, Generator, CUID, AUTO_INCREMENT, NOW, UUID, 
    ScalarFieldDefault, Enum, ReferentialActions, is_call_expression
};

static NAME_REGEXP: &str = r"[A-Za-z][A-Za-z0-9_]*";
static OPTIONAL_LIST_ERROR_MESSAGE: &str =
    "Invalid modifiers: You cannot combine isRequired: false and isList: true - optional lists are not supported.";

fn invalid_model_attributes_error_message(name: &str) -> String {
    format!("Invalid model {} attribute: all model attributes must start with @@.", name)
}

fn invalid_field_attributes_error_message(name: &str) -> String {
    format!("Invalid field {} attribute: all field attributes must start with @.", name)
}

/** Creates a schema AST object */
pub fn create_schema(models: Vec<Model>, enums: Vec<Enum>, data_source: Option<DataSource>, generators: Vec<Generator>) -> Result<Schema, String> {
    Ok(Schema {
        data_source,
        generators,
        enums,
        models,
    })
}

/** Creates an enum AST object */
pub fn create_enum(name: &str, values: Vec<&str>, documentation: Option<&str>) -> Result<Enum, String> {
    validate_name(name)?;
    Ok(Enum {
        name: name.to_string(),
        values: values.iter().map(|&s| s.to_string()).collect(),
        documentation: documentation.map(|s| s.to_string()),
    })
}

/** Creates a model AST object */
pub fn create_model(
    name: &str,
    fields: Vec<ScalarFieldOrObjectField>,
    documentation: Option<&str>,
    map: Option<&str>,
    attributes: Option<&str>,
) -> Result<Model, String> {
    validate_name(name)?;
    let prepared_attributes = validate_and_prepare_model_attributes(name, attributes);
    Ok(Model {
        name: name.to_string(),
        fields,
        documentation: documentation.map(|s| s.to_string()),
        map: map.map(|s| s.to_string()),
        attributes: prepared_attributes,
    })
}

#[derive(Debug)]
pub enum ScalarFieldOrObjectField {
    Scalar(ScalarField),
    Object(ObjectField),
}

/**
 * Creates a scalar field AST object
 * Validates given name argument
 */
pub fn create_scalar_field(
    name: &str,
    type_: ScalarType,
    is_list: bool,
    is_required: bool,
    is_unique: bool,
    is_id: bool,
    is_updated_at: bool,
    default_value: Option<ScalarFieldDefault>,
    documentation: Option<&str>,
    is_foreign_key: bool,
    attributes: Option<&str>,
) -> Result<ScalarField, String> {
    validate_name(name)?;
    validate_scalar_default(type_, &default_value)?;
    validate_modifiers(is_required, is_list)?;
    let prepared_attributes = validate_and_prepare_field_attributes(name, attributes);
    Ok(ScalarField {
        name: name.to_string(),
        is_list,
        is_required,
        is_unique,
        kind: FieldKind::Scalar,
        type_,
        is_id,
        is_updated_at,
        default: default_value,
        documentation: documentation.map(|s| s.to_string()),
        is_foreign_key,
        attributes: prepared_attributes,
    })
}

fn validate_scalar_default(type_: ScalarType, value: &Option<ScalarFieldDefault>) -> Result<(), String> {
    if let Some(value) = value {
        match type_ {
            ScalarType::String => {
                if !(value.is_string() || (is_call_expression(value) && (value.callee == UUID || value.callee == CUID))) {
                    return Err("Default must be a string or a call expression to uuid() or cuid()".to_string());
                }
            }
            ScalarType::Boolean => {
                if !value.is_boolean() {
                    return Err("Default must be a boolean".to_string());
                }
            }
            ScalarType::Int | ScalarType::BigInt => {
                if !(value.is_number() || (is_call_expression(value) && value.callee == AUTO_INCREMENT)) {
                    return Err("Default must be a number or call expression to autoincrement()".to_string());
                }
            }
            ScalarType::Float | ScalarType::Decimal => {
                if !value.is_number() {
                    return Err("Default must be a number".to_string());
                }
            }
            ScalarType::DateTime => {
                if !(value.is_string() || (is_call_expression(value) && value.callee == NOW)) {
                    return Err("Default must be a date-time string or a call expression to now()".to_string());
                }
            }
            ScalarType::Json => {
                if !value.is_string() {
                    return Err("Default must be a JSON string".to_string());
                }
            }
            _ => return Err(format!("Unknown type {}", type_)),
        }
    }
    Ok(())
}

/**
 * Creates an object field AST object
 * Validates given name argument
 */
pub fn create_object_field(
    name: &str,
    type_: &str,
    is_list: bool,
    is_required: bool,
    relation_name: Option<&str>,
    relation_fields: Vec<&str>,
    relation_references: Vec<&str>,
    relation_on_delete: ReferentialActions,
    relation_on_update: ReferentialActions,
    documentation: Option<&str>,
    attributes: Option<&str>,
) -> Result<ObjectField, String> {
    validate_name(name)?;
    validate_modifiers(is_required, is_list)?;
    let prepared_attributes = validate_and_prepare_field_attributes(name, attributes);

    Ok(ObjectField {
        name: name.to_string(),
        is_list,
        is_required,
        kind: FieldKind::Object,
        type_: type_.to_string(),
        relation_name: relation_name.map(|s| s.to_string()),
        relation_to_fields: relation_fields.iter().map(|&s| s.to_string()).collect(),
        relation_to_references: relation_references.iter().map(|&s| s.to_string()).collect(),
        relation_on_delete,
        relation_on_update,
        documentation: documentation.map(|s| s.to_string()),
        attributes: prepared_attributes,
    })
}

fn validate_name(name: &str) -> Result<(), String> {
    if !name.chars().next().map_or(false, |c| c.is_ascii_alphabetic())
        || !name.chars().all(|c| c.is_ascii_alphanumeric() || c == '_')
    {
        return Err(format!(
            "Invalid name: \"{}\". Name must start with a letter and can contain only letters, numbers, and underscores",
            name
        ));
    }
    Ok(())
}

fn validate_modifiers(is_required: bool, is_list: bool) -> Result<(), String> {
    if !is_required && is_list {
        return Err(OPTIONAL_LIST_ERROR_MESSAGE.to_string());
    }
    Ok(())
}

fn validate_and_prepare_attributes_prefix(
    attribute_prefix: &str,
    invalid_error_message: fn(&str) -> String,
    name: &str,
    attributes: Option<&str>,
) -> Result<Vec<String>, String> {
    if let Some(attributes) = attributes {
        let attributes = match attributes {
            s if s.is_string() => {
                let s = s.replace('\n', " ");
                let attributes: Vec<String> = s
                    .split(attribute_prefix)
                    .filter(|&s| !s.is_empty())
                    .map(|s| attribute_prefix.to_string() + s.trim())
                    .collect();
                attributes
            }
            _ => Vec::new(),
        };

        if !attributes.iter().all(|attribute| attribute.starts_with(attribute_prefix) && attribute.len() > attribute_prefix.len()) {
            return Err(invalid_error_message(name));
        }

        Ok(attributes)
    } else {
        Ok(Vec::new())
    }
}

fn validate_and_prepare_model_attributes(name: &str, attributes: Option<&str>) -> Vec<String> {
    validate_and_prepare_attributes_prefix("@@", invalid_model_attributes_error_message, name, attributes).unwrap_or_default()
}

fn validate_and_prepare_field_attributes(name: &str, attributes: Option<&str>) -> Vec<String> {
    validate_and_prepare_attributes_prefix("@", invalid_field_attributes_error_message, name, attributes).unwrap_or_default()
}

/** Creates a data source AST object */
pub fn create_data_source(name: &str, provider: DataSourceProvider, url: String) -> Result<DataSource, String> {
    Ok(DataSource {
        name: name.to_string(),
        provider,
        url,
    })
}

/** Creates a generator AST object */
pub fn create_generator(name: &str, provider: &str, output: Option<&str>, binary_targets: Vec<&str>) -> Result<Generator, String> {
    Ok(Generator {
        name: name.to_string(),
        provider: provider.to_string(),
        output: output.map(|s| s.to_string()),
        binary_targets: binary_targets.iter().map(|&s| s.to_string()).collect(),
    })
}