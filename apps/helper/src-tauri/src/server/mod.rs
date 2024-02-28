use std::sync::Mutex;

use actix_web::{get, middleware, post, web, App, HttpResponse, HttpServer, Responder, Result};
use actix_files::NamedFile;
use tauri::AppHandle;
use std::path::PathBuf;

use actix_files as fs;


struct TauriAppState {
    app: Mutex<AppHandle>,
}

#[get("/hello")]
async fn hello() -> impl Responder {
    HttpResponse::Ok().body("Hello world!")
}

#[post("/echo")]
async fn echo(req_body: String) -> impl Responder {
    HttpResponse::Ok().body(req_body)
}


async fn index() -> Result<NamedFile> {
    let path: PathBuf = PathBuf::from("./web/index.html");
    Ok(NamedFile::open(path)?)
}

#[actix_web::main]
pub async fn init(app: AppHandle) -> std::io::Result<()> {

    let tauri_app = web::Data::new(TauriAppState {
        app: Mutex::new(app),
    });

    let host = "0.0.0.0:"; 
    let port = 8888; 
    let target = format!("{}{}", host, port);

    println!("\nServer ready at {}", format!("http://{}",&target));

    HttpServer::new(move || {
        App::new()
            .app_data(tauri_app.clone())
            .wrap(middleware::Logger::default())
            .service(hello)
            .service(echo)
            .route("/", web::get().to(index))
            .service(fs::Files::new("/", "./web").index_file("index.html"))
    })
    .bind(target)?
    .run()
    .await
}
