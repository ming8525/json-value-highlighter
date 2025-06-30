import * as vscode from 'vscode'

export function activate(context: vscode.ExtensionContext) {
  const decorationType = vscode.window.createTextEditorDecorationType({
    backgroundColor: 'rgba(255,255,0,0.3)', // light yellow background
    borderRadius: '2px',
    overviewRulerColor: 'yellow',
    overviewRulerLane: vscode.OverviewRulerLane.Right,
  })

  function updateDecorations(editor: vscode.TextEditor) {
    if (editor.document.languageId !== 'json') { return }

    const config = vscode.workspace.getConfiguration('jsonHighlighter')
    const patternStr = config.get<string>('pattern') ||
      ':\\s*\\"(var\\(--ref-palette-(primary|secondary|neutral|error|warning|info|success)-(100|200|300|400|500|600|700|800|900|1000|1100|1200|1300)\\))\\"'
		
			const message = config.get<string>('message') || 'Theme `--ref-palette` css vars should not be used, please use the `--sys-color` css vars instead.'

    let regEx: RegExp
    try {
      regEx = new RegExp(patternStr, 'g')
    } catch (error) {
      vscode.window.showErrorMessage(`Invalid regex pattern in setting 'jsonHighlighter.pattern': ${error}`)
      return
    }

    const text = editor.document.getText()
    const decorations: vscode.DecorationOptions[] = []

    let match
    while ((match = regEx.exec(text))) {
      const matchedText = match[1] // The first capture group
      if (!matchedText) { continue }

      const startIndex = match.index + match[0].indexOf(matchedText)
      const endIndex = startIndex + matchedText.length

      const startPos = editor.document.positionAt(startIndex)
      const endPos = editor.document.positionAt(endIndex)

      decorations.push({
        range: new vscode.Range(startPos, endPos),
        hoverMessage: `🔍 ${message}`
      })
    }

    editor.setDecorations(decorationType, decorations)
  }

  function triggerUpdate(editor?: vscode.TextEditor) {
    if (editor && editor.document.languageId === 'json') {
      updateDecorations(editor)
    }
  }

  if (vscode.window.activeTextEditor) {
    triggerUpdate(vscode.window.activeTextEditor)
  }
	
  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor(triggerUpdate),
    vscode.workspace.onDidChangeTextDocument(event => {
      if (vscode.window.activeTextEditor && event.document === vscode.window.activeTextEditor.document) {
        triggerUpdate(vscode.window.activeTextEditor)
      }
    }),
    vscode.workspace.onDidChangeConfiguration(event => {
      if (event.affectsConfiguration('jsonHighlighter.pattern') && vscode.window.activeTextEditor) {
        triggerUpdate(vscode.window.activeTextEditor)
      }
    })
  )
}

export function deactivate() {}
