// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::process::{Command, Stdio};
use tauri::{Manager, Window};

#[tauri::command]
fn greet(name: &str) -> Result<String, String> {
    Ok(format!("{}", name))
}

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn execute_command(command: &str) -> Result<String, String> {
    let command_tokens: Vec<&str> = command.split(" ").collect();
    let mut command_builder: Command = Command::new(
        command_tokens
            .first()
            .expect("No primary command token found"),
    );

    command_builder
        .stdin(Stdio::piped())
        .stderr(Stdio::piped())
        .stdout(Stdio::piped());

    let command_arguments = &command_tokens[1..];
    command_builder.args(command_arguments);
    let child = command_builder.spawn().unwrap();
    let output = child.wait_with_output().expect("Failed to wait on child");
    if output.status.success() {
        let parsed_output = String::from_utf8(output.stdout).unwrap();
        Ok(format!("{:?}", parsed_output))
    } else {
        let err = String::from_utf8(output.stderr).unwrap();
        Err(err)
    }
}

fn main() {
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
        .invoke_handler(tauri::generate_handler![execute_command, greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
