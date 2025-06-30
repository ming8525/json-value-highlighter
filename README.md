# JSON Value Highlighter

Highlight specific JSON string values using a configurable regex.

## Version

**Current version:** `{{version}}`

## Configuration

| Setting | Description | Default |
|---------|-------------|---------|
| `jsonHighlighter.pattern` | Regular expression to match JSON values | `{{pattern}}` |
| `jsonHighlighter.message` | Message to display when a match is found | `{{message}}` |

## Example Match

```json
{
  "bg": "var(--ref-palette-primary-500)"
}
