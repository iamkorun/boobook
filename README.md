# 🦉 boobook

> Pipe your logs through boobook and actually read them.

[![npm version](https://img.shields.io/npm/v/boobook.svg?color=e8b84a)](https://www.npmjs.com/package/boobook)
[![license](https://img.shields.io/badge/license-MIT-e8b84a.svg)](LICENSE)
[![CI](https://img.shields.io/badge/CI-passing-e8b84a.svg)](#)
[![Buy Me a Coffee](https://img.shields.io/badge/☕-Buy%20me%20a%20coffee-e8b84a.svg)](https://buymeacoffee.com/iamkorun)

A universal JSON log prettifier. Zero config. Streams stdin, colorizes levels,
formats timestamps, promotes the message field, filters noise. Works with
anything that emits NDJSON — pino, winston, bunyan, logrus, structlog, zap,
kubectl, docker.

---

## The problem

Your services emit JSON logs. Great for machines, awful for humans:

```
{"level":30,"time":1712635200123,"pid":4821,"hostname":"api-7f8b9","service":"checkout","msg":"order placed","orderId":"ord_8af2","userId":"usr_91","amountCents":4299}
{"level":40,"time":1712635201455,"pid":4821,"hostname":"api-7f8b9","service":"checkout","msg":"rate limit warning","userId":"usr_91","remaining":2}
{"level":50,"time":1712635202781,"pid":4821,"hostname":"api-7f8b9","service":"checkout","msg":"payment declined","orderId":"ord_8af2","code":"card_declined"}
```

## The solution

Pipe it through boobook:

```
14:00:00.123 INFO   order placed               service=checkout orderId=ord_8af2 userId=usr_91 amountCents=4299
14:00:01.455 WARN   rate limit warning         service=checkout userId=usr_91 remaining=2
14:00:02.781 ERROR  payment declined           service=checkout orderId=ord_8af2 code=card_declined
```

Level is colorized. Timestamp is a real clock. Noise (`pid`, `hostname`) is
filterable. Non-JSON lines pass through unchanged, so boobook never eats
stack traces or startup banners.

---

## Install

```sh
# one-off, no install
npx boobook

# or install globally
npm i -g boobook
```

Requires Node 18+.

## Usage

```sh
# basic: pipe anything NDJSON at it
my-app | boobook

# drop boilerplate fields
kubectl logs -f deploy/api | boobook --exclude hostname,pid,service

# only show fields you care about
docker logs -f web | boobook --include msg,userId,orderId

# hide low-severity noise
my-app | boobook --level warn

# single-line dense mode
my-app | boobook --compact

# disable color (for files / CI logs)
my-app | boobook --no-color > run.log
```

### Flags

| Flag | What it does |
| --- | --- |
| `--exclude <fields>` | comma-separated fields to strip from output |
| `--include <fields>` | comma-separated fields to keep (drops the rest) |
| `--level <lvl>` | suppress lines below this level (`trace`, `debug`, `info`, `warn`, `error`, `fatal`) |
| `--compact` | single-line dense mode |
| `--no-color` | disable ANSI color |
| `--version` | print version |
| `--help` | print help |

## Examples

### Kubernetes

```sh
kubectl logs -f deploy/api | boobook --exclude hostname,pid --level info
```

### Docker Compose

```sh
docker compose logs -f --no-log-prefix web | boobook
```

### pino

```sh
node app.js | boobook
```

### winston (JSON transport)

```sh
node server.js 2>&1 | boobook --include msg,level,userId,route
```

### Go / logrus / zap

```sh
./server 2>&1 | boobook --exclude caller,stacktrace
```

### structlog (Python)

```sh
python -m myapp | boobook --level warn
```

---

## Why boobook?

- **Universal.** Any NDJSON. No schema, no config file, no plugin system.
- **Tiny.** One binary, two deps (`chalk` + `commander`), < 50KB gzipped.
- **Safe.** Non-JSON lines pass through untouched — stack traces stay readable.
- **Streaming.** Backpressure-aware, handles unbounded pipes without buffering.
- **Boring.** Does one thing. Shuts up the rest of the time.

## How it compares

| Tool | Universal | Zero-config | Streaming | Non-JSON passthrough |
| --- | --- | --- | --- | --- |
| `jq` | ❌ needs query | ❌ | ✅ | ❌ |
| `pino-pretty` | ❌ pino only | ✅ | ✅ | ⚠️ |
| `bunyan` CLI | ❌ bunyan only | ✅ | ✅ | ⚠️ |
| `lnav` | ❌ schema-heavy | ❌ | ✅ | ✅ |
| **boobook** | ✅ | ✅ | ✅ | ✅ |

---

## Contributing

Issues and PRs welcome. This tool is intentionally small — new flags need a
real pipeline to justify them.

## License

MIT © [iamkorun](https://github.com/iamkorun)

## Support

If boobook saved you from `jq` one more time, [buy me a coffee ☕](https://buymeacoffee.com/iamkorun).

---

## Star history

[![Star History Chart](https://api.star-history.com/svg?repos=iamkorun/boobook&type=Date)](https://star-history.com/#iamkorun/boobook&Date)
