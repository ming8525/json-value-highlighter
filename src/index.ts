import * as vscode from 'vscode'

export function activate(context: vscode.ExtensionContext) {
  const decorationType = vscode.window.createTextEditorDecorationType({
    backgroundColor: 'rgba(255,255,0,0.3)',
    borderRadius: '2px',
    overviewRulerColor: 'yellow',
    overviewRulerLane: vscode.OverviewRulerLane.Right,
  })

  function updateDecorations(editor: vscode.TextEditor) {
    if (editor.document.languageId !== 'json') { return }

    const config = vscode.workspace.getConfiguration('jsonHighlighter')
    const patternConfigs = config.get<{ pattern: string; message?: string }[]>('patterns') || []

    const text = editor.document.getText()

    const decorations: vscode.DecorationOptions[] = []

    for (const { pattern, message } of patternConfigs) {
      let regEx: RegExp
      try {
        regEx = new RegExp(pattern, 'g')
      } catch (err) {
        vscode.window.showErrorMessage(`Invalid regex in jsonHighlighter.patterns: ${err}`)
        continue
      }

      let match: RegExpExecArray | null
      while ((match = regEx.exec(text))) {
        const matchedText = match[1]
        if (!matchedText) { continue }

        const startIndex = match.index + match[0].indexOf(matchedText)
        const endIndex = startIndex + matchedText.length

        const startPos = editor.document.positionAt(startIndex)
        const endPos = editor.document.positionAt(endIndex)

        decorations.push({
          range: new vscode.Range(startPos, endPos),
          hoverMessage: message || 'Matched pattern'
        })
      }
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

export function deactivate() { }
