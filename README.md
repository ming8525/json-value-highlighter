# JSON Value Highlighter

Highlight specific JSON string values using a configurable regex.

## Configuration

| Setting | Description | Default |
|---------|-------------|---------|
| `jsonHighlighter.patterns[<index>].pattern` | Regular expression to match JSON values | `{{pattern}}` |
| `jsonHighlighter.patterns[<index>].message` | Message to display when a match is found | `{{message}}` |

## Example Match

```json
{
  "bg": "var(--ref-palette-primary-500)"
}
