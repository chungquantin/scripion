# <img width="35" alt="Group 97" src="https://github.com/nomadiz/scripion/assets/56880684/c097d4fe-386a-4c33-a280-e92f7308c852"> Sripion - Lightweight desktop script manager for MacOS

![Group 102](https://github.com/nomadiz/scripion/assets/56880684/89ca0b74-ac85-4d89-b6b0-43310babb9db)


Scripion is a versatile tool designed to streamline command management on your device. For developers and engineers who often find themselves navigating the intricacies of the shell and terminal, Scripion is a trusted companion. While these command-line interfaces are invaluable for complex tasks, not all commands require their full attention.

With Scripion, you can effortlessly organize and execute a wide range of commands without the need for constant terminal interaction. This user-friendly application simplifies the process of handling basic scripts, allowing you to focus your valuable terminal resources on more critical tasks.

# Installation
MacOS: [Scrripion Beta v0.0.1](https://github.com/nomadiz/scripion/releases/download/beta-v0.0.1/Scripion_beta_0.0.1_aarch64.dmg)

# Features
## Store commands in your workspace
![Group 98](https://github.com/nomadiz/scripion/assets/56880684/13835986-a107-4935-a04e-1e7326874e50)

Scripion allows you to store, update workspace names, and remove workspaces easily. Regarding privacy concerns, workspaces are stored locally on your device using SQLite3. 
### Integrate with different framework projects
Support: `package.json` projects
Scripion automatically reads package.json from the imported workspaces and stores them as Scripion's workspace scripts with interactive UI. To import the workspace, click on the **+ Add workspace** button. If the workspace is not a valid project, it won't be imported to Scripion.
## Execute command with one click
![Group 100](https://github.com/nomadiz/scripion/assets/56880684/05d4d7e1-28cd-4e43-bff0-3b6c7e18aef8)

## View script history of multiple shells
![Group 101](https://github.com/nomadiz/scripion/assets/56880684/341af1f2-a51c-4d1f-a305-1b38c8cf03ef)

Scripion streamlines script history management by offering a unified view of scripts executed across various shells. This feature simplifies record-keeping, ensuring that you can efficiently trace your scripting activities.

**📝 Scripion does not store your data**, it is designed to utilize the `history` command of the shell feature.

# Development
Scripion is built using Tauri + Rust for backend and React + Typescript for frontend.
## Getting started
Start building Scripion on local
```
cargo tauri dev
```
Build MacOS bundle
```
npm run tauri build
```
Format code
```
npm run prettier:fix
```
---------------------------
Scripion is developed and maintained under @nomadiz team wit love ❤️
