#!/usr/bin/env bun
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';

const name = prompt('Post title: ');
if (!name?.trim()) {
  console.error('Title is required.');
  process.exit(1);
}

const slug = name
  .trim()
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

const date = new Date().toISOString().split('T')[0];
const root = join(import.meta.dir, '..', 'src', 'content', 'blog');
const dir = join(root, slug);
const assetsDir = join(dir, 'assets');

await mkdir(assetsDir, { recursive: true });

const content = `---
title: "${name.trim()}"
date: ${date}
description: ""
tags: []
draft: true
---

## Introduction

Brief overview of what this post covers and why it matters.

## Background

Context and prior art — what led to this problem or topic.

## The Problem

What exactly needed solving, and why existing approaches fell short.

## The Solution

Walk through the approach, key decisions, and implementation details.

\`\`\`java
// example code block
\`\`\`

## Results

Benchmarks, outcomes, or observations from the solution.

## Conclusion

Key takeaways and what's next.
`;

await writeFile(join(dir, 'index.md'), content);
console.log(`\n✓ Created src/content/blog/${slug}/`);
console.log(`  index.md   ← write your post here`);
console.log(`  assets/    ← drop images here\n`);
console.log(`Remember to set draft: false when you're ready to publish.`);
