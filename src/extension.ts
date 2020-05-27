// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as child from 'child_process';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "history-in-sublime-merge" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    'history-in-sublime-merge.helloWorld',
    () => {
      // The code you place here will be executed every time your command is executed

      if (vscode.window.activeTextEditor) {
				const filePath = vscode.window.activeTextEditor.document.uri.path;

				console.log(filePath);
				child.exec(`smerge log file ${filePath}`);

			}

      // Display a message box to the user
      vscode.window.showInformationMessage(
        'Hello World from History in Sublime Merge!'
      );
    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
