// use static_files::resource_dir;
// -> std::io::Result<()>
fn main() {
    tauri_build::build();
    // resource_dir("./web").build()
}
