# Authoring playbooks

A playbook is a directory containing an `index.md` entry point and optional sibling `.md` files. The `index.md` becomes the agent's first-contact prompt — it is loaded automatically at session start. Siblings are loaded only when `index.md` (or another already-loaded sibling) explicitly tells the agent to read them.

## Directory convention

Place the playbook directory under the project's `lib/playbooks/` directory (typically `.sartor/lib/playbooks/`). The directory name must be dashed-case:

```
lib/playbooks/my-workflow/index.md
```

The playbook name is the directory name. So `lib/playbooks/my-workflow/` registers as the `my-workflow` playbook. The canonical reference playbook is this very `sartor` playbook — study its other siblings when in doubt.

## The mandatory-read contract

At session start, the runtime emits a mandatory-read block listing every registered playbook's `index.md` path. The agent must read each one before doing anything else. The block ends with:

> These playbooks govern the session. Follow their instructions. Load sibling files only when a playbook tells you to.

This means `index.md` is always loaded; sibling files are never loaded automatically. Playbook authors control what the agent reads and when — `index.md` is the gatekeeper.

## Progressive reveal

Keep `index.md` short and pointer-shaped. Its job is to orient the agent and point at siblings for depth — not to carry dense reference content itself. Push detailed guidance into sibling files, one topic per sibling.

Cap each sibling at one logical screen of dense content. If a sibling grows beyond that, split it further and add a pointer from the parent sibling. The agent only loads what it needs for the current task, so smaller files mean faster, more focused reads.

The rule restated: the agent loads sibling files only when a playbook tells it to. Every pointer is a deliberate gate — don't point at a sibling unless the agent will need it for the task at hand.

## Worked example — focused playbook

A single-purpose playbook with just `index.md` and no siblings. This is appropriate when the guidance fits in one screen:

```
lib/playbooks/code-review/index.md
```

```markdown
You are a code reviewer. When the user asks you to review code, focus on correctness, readability, and security.

- Read the diff before commenting.
- Prefer inline suggestions over abstract criticism.
- If you spot a security issue, flag it first.
```

No siblings needed — the entire contract fits in `index.md`.

## Worked example — multi-sibling playbook

The host `sartor` playbook (the one this file belongs to) is the canonical multi-sibling example:

```
lib/playbooks/sartor/
├── index.md                    # pointer hub — greeting, output-format rules, entity pointers
├── authoring-md-commands.md    # dense reference for markdown command authoring
├── authoring-js-commands.md    # dense reference for JS command authoring
├── authoring-services.md       # dense reference for service authoring
└── authoring-playbooks.md      # this file
```

The `index.md` is a short hub: a greeting line, session-level instructions, and pointer bullets that say "read `authoring-md-commands.md`" or "read `authoring-services.md`." Each sibling is a self-contained reference doc, one logical screen of dense content. The agent loads a sibling only when the user's task matches — an agent helping with a service never loads the command-authoring doc.
