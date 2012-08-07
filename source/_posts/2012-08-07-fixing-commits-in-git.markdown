---
layout: post
title: "Fixing commits in git"
date: 2012-08-07 22:46
comments: true
categories: [ git ]
---

You can fix your last commit in git by doing `git commit --amend`. For example, 
if you had a typo in your last commit message you could correct it by doing:

``` bash Fixing a typo with --amend
$ git commit -m "Oops, a typo"
$ git log --oneline
9e29e33 Oops, a typo

$ git commit --amend -m "New commit message without typos"
$ git log --oneline
aa7faf2 New commit message without typos
```
 
The previous commit will be replaced by the new one, which is based on the 
current contents of the index. For clarity, I'll add that the git index is the 
staging area, also known as everything that is currently being tracked by git. 
So if you forgot to add some file to the index in the last commit, you could do:

``` bash Adding a file 
$ git commit -am "Made some changes" # Forgot to add forgotten-file.txt
$ git add forgotten-file.txt
$ git commit --amend -m "Made some changes and added forgotten-file.txt"
```

###1 Already pushed the commit?

If you've already pushed your faulty commit then it's also best to first do 
something like: `git push -f origin HEAD^:master`. Pushing your HEAD at the 
previous commit and then doing the amend will prevent you from having to do a 
pull & merge just to fix something small like a typo.


``` bash 
$ git commit -am "Typo"
$ git push
$ # Realize you had a typo, so push again but send HEAD^ upstream 
$ # ( HEAD^ means the HEAD at the previous commit )
$ git push -f origin HEAD^:master
$ git commit --amend -m "Fixed Typo"
$ git push # No pull or merge needed
```


#### Documentation

Lastly here's the `--amend` option documentation from the [git-commit man page](http://linux.die.net/man/1/git-commit).

``` bash
--amend
    Used to amend the tip of the current branch. Prepare the tree object you would want to replace 
    the latest commit as usual (this includes the usual -i/-o and explicit paths), and the commit 
    log editor is seeded with the commit message from the tip of the current branch. The commit 
    you create replaces the current tip - if it was a merge, it will have the parents of the 
    current tip as parents - so the current top commit is discarded.
    It is a rough equivalent for:
    
        $ git reset --soft HEAD^
        $ ... do something else to come up with the right tree ...
        $ git commit -c ORIG_HEAD

    but can be used to amend a merge commit.
    You should understand the implications of rewriting history if you amend a commit that has 
    already been published. (See the "RECOVERING FROM UPSTREAM REBASE" section in git-rebase(1).)
```
