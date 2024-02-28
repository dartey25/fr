#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod server;

use homedir::get_my_home;
use std::process::Command;
use std::thread;
use which::which;

#[tauri::command]
fn connect_to_database(// provider: String,
    // host: String,
    // port: u32,
    // username: String,
    // password: String,
    // database: String,
    // connectionUrl: String,
    // backUpPath: Option<String>
) -> Result<String, String> {
    let prisma_dir = std::path::Path::new(get_my_home().unwrap().unwrap().as_path())
        .join("AppData")
        .join("Roaming")
        .join("MD-Web-Extended")
        .join("EUR")
        .join("server")
        .join("prisma");
    let npx_path = match which("npx") {
        Ok(path) => path,
        Err(err) => return Err(format!("Error: npx command not found in PATH, {:?}", err)),
    };
    let output = Command::new(npx_path)
        .arg("prisma")
        .arg("db")
        .arg("push")
        .arg("--accept-data-loss")
        .current_dir(&prisma_dir)
        .output();

    match output {
        Ok(output) => {
            println!("stdout: {}", String::from_utf8_lossy(&output.stdout));
            println!("stderr: {}", String::from_utf8_lossy(&output.stderr));

            if output.status.success() {
                return Ok("Command executed successfully".into());
            } else {
                return Err(format!(
                    "Error: Command failed with exit code {}",
                    output.status.code().unwrap_or_default()
                ));
            }
        }
        Err(err) => {
            eprintln!("{err}");
            return Err(format!("Error: Failed to execute command - {}", err));
        }
    }
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let handle = app.handle();
            let boxed_handle = Box::new(handle);

            thread::spawn(move || {
                server::init(*boxed_handle).unwrap();
            });
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![connect_to_database])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
