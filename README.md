# viewtree

Tool to describe vue components dependency (as DOT,Mermaid format)

## installation

In repository root, install by deno.

```shell
deno task install
```

## usage(example)

```shell
# Linux
viewtree | dot -Tsvg -o temp.svg && xdg-open temp.svg

# MacOS
viewtree | dot -Tsvg -o temp.svg && open temp.svg
```

- specify directory path

```shell
viewtree <vue-project-path> | dot -Tsvg -o temp.svg && xdg-open temp.svg
```

- Mermaid format output

```shell
viewtree test/resource --format mermaid
```

output:

```mermaid
---
title: ComponentDependency
---
graph TD
  ListView --> Header
  ListView --> Footer
  ListView --> Table
  DetailView --> DetailContainer
  Table --> TableHeader
  Table --> TableRow
  TableRow --> UserIcon
  DetailContainer --> UserIcon
```

---

- Show specific component dependencies using --root option

```shell
viewtree test/resource --root Table --format mermaid
```

output:

```mermaid
---
title: ComponentDependency root:Table
---
graph TD
  Table --> TableHeader
  Table --> TableRow
```

---

- Show inverse dependencies using --inverse option (with --root)

```shell
viewtree test/resource --root Table --inverse --format mermaid
```

output:

```mermaid
---
title: ComponentDependency root:UserIcon(inversed)
---
graph TD
  TableRow --> UserIcon
  Table --> TableRow
  ListView --> Table
  DetailContainer --> UserIcon
  DetailView --> DetailContainer
```

## for develop

### test

```shell
deno task test
```
