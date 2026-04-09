# boobook

Pipe your logs through boobook and actually read them.

Universal JSON log prettifier. Reads NDJSON from stdin, pretty-prints with
level colors, formatted timestamps, promoted message, and field filtering.
Non-JSON lines pass through unchanged.

## Install

```sh
npm i -g boobook
```

## Usage

```sh
kubectl logs -f my-pod | boobook
my-app | boobook --level warn --exclude hostname,pid
```

## Flags

- `--exclude <fields>` comma-separated fields to strip
- `--include <fields>` only show these fields
- `--level <lvl>` suppress lines below this level
- `--compact` single-line dense mode
- `--no-color` disable color output
