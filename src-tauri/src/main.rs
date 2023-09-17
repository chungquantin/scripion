// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

extern crate base64;

use relative_path::RelativePath;
use rusqlite::{Connection, Result};

use base64::{engine::general_purpose, Engine};
use serde::Serialize;
use std::env::current_dir;
use std::fs::read_to_string;
use std::path::PathBuf;
use std::process::{Command, Stdio};
use tauri::{Manager, Window};

#[tauri::command]
fn get_shell_path() -> String {
    "/bin/sh".to_string()
}

const DATABASE_PATH: &str = "../scripion.db";

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct Workspace {
    id: i32,
    name: String,
    path: String,
}

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn execute_command(command: &str) -> Result<String, String> {
    println!("Execute command: {}", command);

    let mut command_builder = Command::new(get_shell_path());

    command_builder
        .stdin(Stdio::piped())
        .stderr(Stdio::piped())
        .stdout(Stdio::piped());

    command_builder.arg("-c").arg(command);
    let child = command_builder.spawn().unwrap();
    let output = child.wait_with_output().expect("Failed to wait on child");
    if output.status.success() {
        let base64_encoded = general_purpose::STANDARD.encode(output.stdout);
        Ok(format!("{:?}", base64_encoded))
    } else {
        let err = String::from_utf8(output.stderr).unwrap();
        Err(err)
    }
}

fn get_relative_path(path: &str) -> PathBuf {
    let relative_path = RelativePath::new(path);
    let full_path = relative_path.to_path(current_dir().unwrap());
    full_path
}
#[tauri::command]
fn get_all_workspaces() -> Vec<Workspace> {
    let conn = Connection::open(DATABASE_PATH).unwrap();
    let database_path = get_relative_path("sql/select-all-workspaces.sql");
    let mut workspaces: Vec<Workspace> = vec![];
    match read_to_string(database_path) {
        Ok(content) => {
            let mut stmt = conn.prepare(&content).unwrap();
            let rows = stmt
                .query_map((), |row| {
                    Ok(Workspace {
                        id: row.get(0)?,
                        name: row.get(1)?,
                        path: row.get(2)?,
                    })
                })
                .unwrap();
            for row in rows {
                workspaces.push(row.unwrap())
            }
        }
        Err(_) => {
            println!("Failed to initialize database");
        }
    };
    workspaces
}

#[tauri::command]
fn add_workspace(name: &str, path: &str) -> Result<String, String> {
    let conn = Connection::open(DATABASE_PATH).unwrap();
    let database_path = get_relative_path("sql/add-workspace.sql");
    match read_to_string(database_path) {
        Ok(content) => {
            conn.execute(&content, &[name, path]).unwrap();
        }
        Err(_) => println!("Failed to initialize database"),
    }

    Ok("Successfully add workspace".to_string())
}

fn initialize_database() {
    let conn = Connection::open(DATABASE_PATH).unwrap();
    let database_path = get_relative_path("sql/create-workspace-table.sql");
    print!("Database path {:?}", database_path);
    match read_to_string(database_path) {
        Ok(content) => {
            conn.execute(&content, ()).unwrap();
        }
        Err(_) => println!("Failed to initialize database"),
    }
}

fn main() {
    initialize_database();
    tauri::Builder::default()
        .setup(|app| {
            let _window: Window = app.get_window("main").unwrap();
            // Prevent initial shaking
            _window.show().unwrap();
            Ok(())
        })
        .on_window_event(|event| match event.event() {
            tauri::WindowEvent::CloseRequested { api, .. } => {
                #[cfg(target_os = "macos")]
                {
                    event.window().minimize().unwrap();
                }

                #[cfg(not(target_os = "macos"))]
                event.window().close().unwrap();

                api.prevent_close();
            }
            _ => {}
        })
        .invoke_handler(tauri::generate_handler![
            execute_command,
            get_shell_path,
            add_workspace,
            get_all_workspaces
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
