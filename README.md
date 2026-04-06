# Platinum Apparel

## Pre-Commit Hooks

This project uses [pre-commit](https://pre-commit.com/) to run formatting and linting checks before each commit.

### Prerequisites

- [pre-commit](https://pre-commit.com/#install) (`brew install pre-commit` or `pip install pre-commit`)
- [golangci-lint](https://golangci-lint.run/welcome/install/) (`brew install golangci-lint`)
- [templ](https://templ.guide/) CLI (`go install github.com/a-h/templ/cmd/templ@latest`)

### Setup

```bash
pre-commit install
```

### Run manually

```bash
pre-commit run --all-files
```
