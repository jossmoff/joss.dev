---
title: "Automating Mutation Testing with Mutmut and GitHub Actions"
date: 2023-11-12
description: "How to integrate mutmut into a CI/CD pipeline with smart GitHub Actions caching to make mutation testing fast and incremental."
tags: ["Testing", "Python", "GitHub Actions", "CI/CD", "Mutation Testing"]
draft: false
---

## What is Mutation Testing?

Mutation testing is a method to evaluate the quality of your test suite by introducing small changes (mutations) to your source code. These mutations simulate potential bugs and assess whether your tests are sensitive enough to detect them. If a mutation goes unnoticed by your test suite, it indicates a gap in your tests.

Let's look at an example. Here is a Python function that will tell us if a person can buy a beer in the UK, and the corresponding test suite:

```python
# Original function
def can_buy_beer_in_uk(age):
    return age >= 18

# Mutated function
def can_buy_beer_in_uk(age):
    return age > 18
    
# Tests
def test_cannot_buy_beer_when_17(): ...
def test_can_buy_beer_when_19(): ...
```

When undergoing mutation tests, the `>=` in the function would become `>`, and if we ran the test suite it would still pass. Those familiar with boundary value analysis will know that we should also have a test that checks when the age is 18. If we add this test and then run the mutation tests, the test suite will fail as the case where the person is 18 will now fail — the mutant is caught.

## What is Mutmut?

Mutmut is a mutation testing tool specifically designed for Python projects.[^1] For a deeper insight into getting started, there is a great article covering the basics of mutation testing in Python.

## Mutmut with GitHub Actions

Setting up a GitHub Action to run mutmut and generate a report to analyse is incredibly simple:

```yaml
- name: 🦠 Run Mutation Tests
  run: |
    mutmut run --no-progress --CI
    mutmut html

- name: 📤 Upload Mutation Test Report
  uses: actions/upload-artifact@v2
  with:
    name: mutmut-html-report
    path: html/my-project
```

This configuration is adequate for small projects, but how does it scale? One of the significant drawbacks of mutation testing is its time-intensive nature.[^2] Because the process involves introducing mutations into the codebase and rerunning the entire test suite for each mutation, it can take a long time. Mutmut provides a mechanism to cache the results of each mutant, enabling incremental analysis.

## GitHub Actions Caching Strategy

We have two criteria for our mutmut caching to enable incremental analysis:

- The first commit in a pull request uses the latest cache from the `main` branch.
- Minimise the number of caches stored — only generate a new cache when the source Python files have changed (i.e. when the hash of the files has changed).

We can accomplish this with GitHub Actions cache restore keys.[^3] Using `restore-keys`, we can specify a fallback order on a cache miss: restore the most recent cache for the current branch first, then fall back to the `main` branch cache. This satisfies both criteria:

```yaml
- name: 🗃️ Uncache Mutation Testing Artifacts
  uses: actions/cache/restore@v3
  with:
    path: .mutmut-cache
    key: mutmut-cache-${{ github.ref_name }}-${{ hashFiles('src/*.py') }}
    restore-keys: |
      mutmut-cache-${{ github.ref_name }}
      mutmut-cache-main

- name: 🦠 Run Mutation Tests
  run: |
    mutmut run --no-progress --CI
    mutmut html

- name: 📤 Upload Mutation Test Report
  uses: actions/upload-artifact@v2
  with:
    name: mutmut-html-report
    path: html/my-project

- name: 🗃️ Cache Mutation Test Artifacts
  uses: actions/cache/save@v3
  with:
    path: .mutmut-cache
    key: mutmut-cache-${{ github.ref_name }}-${{ hashFiles('src/*.py') }}
```

## Conclusion

Mutation testing has made significant progress since its inception. The process, which was once laborious and complicated, has now been simplified with tools like mutmut — tools that can significantly enhance a development team's testing maturity and efficiency, eliminating the pitfalls of common developer mistakes.

I have been using mutation testing as part of the CI/CD pipeline for a side project, and it has been a game-changer — significantly elevating the test suite by exposing subtle gaps in coverage and quality. I would highly recommend anyone who is serious or curious about mutation testing to set this up in their own repositories. Who knows what mutants you will find 🧟?

---

[^1]: K. Rana, "Mutation Testing - Complete Guide with Example," ArtOfTesting, Apr. 20, 2020. https://artoftesting.com/mutation-testing
[^2]: mutmut documentation. https://mutmut.readthedocs.io/en/latest/
[^3]: GitHub Docs, "Caching dependencies to speed up workflows." https://docs.github.com/en/actions/using-workflows/caching-dependencies-to-speed-up-workflows#matching-a-cache-key
