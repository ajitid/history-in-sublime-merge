import * as child from "node:child_process";
import * as path from "node:path";

import * as vscode from "vscode";
import * as findUp from "find-up";
import * as cmdExists from "command-exists";

type AsyncFn = () => Promise<void>;

type FileDetails = {
  path: string;
  cursorLine: number;
  selectionStartLine: number;
  selectionEndLine: number;
  repository: string;
};

let SMERGE_BINARY_PATH: string;

/**
 * @param fullPath Accepts both file and folder path
 */
const getCurrentRepository = async (fullPath: string): Promise<string> => {
  const repository = await findUp(".git", {
    cwd: fullPath,
    type: "directory",
  });

  if (!repository) {
    return Promise.reject("Couldn't find repository.");
  }

  return path.dirname(repository);
};

const openSublimeMerge = (args: string[], repository: string): void => {
  child.execFile(SMERGE_BINARY_PATH, args, {
    cwd: repository,
  });
};

const getFileDetails = async (editor: vscode.TextEditor): Promise<FileDetails> => {
  const repository: string = await getCurrentRepository(editor.document.uri.path);

  return {
    path: editor.document.uri.path.replace(`${repository}/`, ""),
    cursorLine: editor.selection.active.line + 1,
    selectionStartLine: editor.selection.start.line + 1,
    selectionEndLine: editor.selection.end.line + 1,
    repository: repository ?? "",
  };
};

const viewFileHistory: AsyncFn = async () => {
  if (vscode.window.activeTextEditor) {
    const { path, repository } = await getFileDetails(vscode.window.activeTextEditor);

    openSublimeMerge(["search", `file:"${path}"`], repository);
  } else {
    return Promise.reject("An editor needs to be active for this command to work.");
  }
};

const viewLineHistory: AsyncFn = async () => {
  if (vscode.window.activeTextEditor) {
    const { path, repository, selectionStartLine, selectionEndLine } = await getFileDetails(
      vscode.window.activeTextEditor
    );

    openSublimeMerge(
      ["search", `file:"${path}" line:${selectionStartLine}-${selectionEndLine}`],
      repository
    );
  } else {
    return Promise.reject("An editor needs to be active for this command to work.");
  }
};

const blameLine: AsyncFn = async () => {
  if (vscode.window.activeTextEditor) {
    const { path, cursorLine, repository } = await getFileDetails(vscode.window.activeTextEditor);

    openSublimeMerge(["blame", path, cursorLine.toString(10)], repository);
  } else {
    return Promise.reject("An editor needs to be active for this command to work.");
  }
};

const openRepository: AsyncFn = async () => {
  let repository = "";
  const workspaces = vscode.workspace.workspaceFolders;

  if (vscode.window.activeTextEditor) {
    repository = await getCurrentRepository(vscode.window.activeTextEditor.document.uri.path);
  } else if (workspaces?.length) {
    repository = await getCurrentRepository(workspaces[0].uri.path);
  } else {
    return Promise.reject(
      "Can't open repository in Sublime Merge as there is no folder or a file open here."
    );
  }

  openSublimeMerge(["."], repository);
};

const getSmergeBinaryPath = async (): Promise<string> => {
  const customPath = vscode.workspace.getConfiguration().get<string>("sublime-merge-x.path");
  if (customPath) {
    return customPath;
  }

  let exists = await cmdExists("smerge");
  if (exists) {
    return exists;
  }

  exists = await cmdExists("sublime_merge");
  if (exists) {
    return exists;
  }

  // In case smerge cannot be found in $PATH, we'll still try to look into the default path
  if (process.platform === "darwin") {
    const defaultMacOsPath = "/Applications/Sublime Merge.app/Contents/SharedSupport/bin/smerge";
    exists = await cmdExists(defaultMacOsPath);
    if (exists) {
      return exists;
    }
  }

  return Promise.reject(
    "Couldn't find Sublime Merge (smerge or sublime_merge command). Please either add into it your `$PATH` or specify its path in `sublime-merge-x.path`."
  );
};

const wrapErr = (fn: AsyncFn): AsyncFn => {
  return async () => {
    try {
      await fn();
    } catch (err) {
      vscode.window.showInformationMessage(err as string);
    }
  };
};

export const activate = async (context: vscode.ExtensionContext): Promise<void> => {
  const extensionName = "sublime-merge-x";

  try {
    SMERGE_BINARY_PATH = await getSmergeBinaryPath();
  } catch (err) {
    vscode.window.showInformationMessage(err as string);
  }

  context.subscriptions.push(
    vscode.commands.registerCommand(`${extensionName}.viewFileHistory`, wrapErr(viewFileHistory))
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(`${extensionName}.viewLineHistory`, wrapErr(viewLineHistory))
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(`${extensionName}.blameLine`, wrapErr(blameLine))
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(`${extensionName}.openRepository`, wrapErr(openRepository))
  );
};

export const deactivate = (): void => {};
