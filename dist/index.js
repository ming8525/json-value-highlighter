"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
function activate(context) {
    const decorationType = vscode.window.createTextEditorDecorationType({
        backgroundColor: 'rgba(255,255,0,0.3)',
        borderRadius: '2px',
        overviewRulerColor: 'yellow',
        overviewRulerLane: vscode.OverviewRulerLane.Right,
    });
    function updateDecorations(editor) {
        if (editor.document.languageId !== 'json') {
            return;
        }
        const config = vscode.workspace.getConfiguration('jsonHighlighter');
        const patternConfigs = config.get('patterns') || [];
        const text = editor.document.getText();
        const decorations = [];
        for (const { pattern, message } of patternConfigs) {
            let regEx;
            try {
                regEx = new RegExp(pattern, 'g');
            }
            catch (err) {
                vscode.window.showErrorMessage(`Invalid regex in jsonHighlighter.patterns: ${err}`);
                continue;
            }
            let match;
            while ((match = regEx.exec(text))) {
                const matchedText = match[1];
                if (!matchedText) {
                    continue;
                }
                const startIndex = match.index + match[0].indexOf(matchedText);
                const endIndex = startIndex + matchedText.length;
                const startPos = editor.document.positionAt(startIndex);
                const endPos = editor.document.positionAt(endIndex);
                decorations.push({
                    range: new vscode.Range(startPos, endPos),
                    hoverMessage: message || 'Matched pattern'
                });
            }
        }
        editor.setDecorations(decorationType, decorations);
    }
    function triggerUpdate(editor) {
        if (editor && editor.document.languageId === 'json') {
            updateDecorations(editor);
        }
    }
    if (vscode.window.activeTextEditor) {
        triggerUpdate(vscode.window.activeTextEditor);
    }
    context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(triggerUpdate), vscode.workspace.onDidChangeTextDocument(event => {
        if (vscode.window.activeTextEditor && event.document === vscode.window.activeTextEditor.document) {
            triggerUpdate(vscode.window.activeTextEditor);
        }
    }), vscode.workspace.onDidChangeConfiguration(event => {
        if (event.affectsConfiguration('jsonHighlighter.pattern') && vscode.window.activeTextEditor) {
            triggerUpdate(vscode.window.activeTextEditor);
        }
    }));
}
function deactivate() { }
//# sourceMappingURL=index.js.map