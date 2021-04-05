git是世界上目前**最先进的分布式版本控制系统,致力于团队、个人进行项目版本管理，**完美的解决难以比较代码、难以合并代码、难以取消修改、难以在写当前代码的过程中保存未完成的修改去修改线上版本的bug等的痛点。

## 一、创建版本库

* 创建版本库     							git init

* 显示 .git目录   						    ls -ah

* 添加文件									 git add  <file>

* 提交文件									 git commit -m <message>

  ***

  

## 二、时光穿梭

#### 1.版本回退

* 版本回退(上个版本)				   						    git reset --hard HEAD^

* 版本回退（通用）					                              git reset --hard commit_id

* 查看历史提交							                             git log

* 重返未来 查看命令历史			                            git `reflog`

#### 2.工作区和暂存区 

* 查看工作区状态						                              git status
* git add 后，文件被放在stage[^ 暂存区] 
* git commit后，文件被提交到当前分支中[^ 默认为master]，stage清空

#### 3.管理修改

* 查看工作区和版本库里面最新版本的区别			git diff HEAD --readme.txt

#### 4.撤销修改

* 撤销工作区的全部修改  [^ 从版本库中找到后来覆盖]      git checkout -- readme.txt
* 撤销暂存区的全部修改                                           git reset HEAD readme.txt

#### 5.删除文件

* 删除工作区的文件                                                   `rm` test.txt[^ 可直接在文件管理器中删除]
* 删除工作区文件时是误删，需要恢复                     git checkout -- test.txt[^ 用版本库中的文件覆盖工作区的文件]
* 删除版本库中的文件                                               git rm test.txt   +   git commit -m"remove test.txt"

***



## 三、远程仓库

#### 1.添加远程仓库

* git remote add origin https://github.com/ShuSheng-998/新建的仓库名.git
* git branch -M main
* git push -u origin main(以后的推送不加-u)

#### 2.从远程库克隆

* 找到要clone的库的地址
* bash里键入         git clone  https://github.com/ShuSheng-998/gitskills.git
* clone到当前bash的文件夹中

#### 3.拉代码

* 我在远程修改了文件，向`share_file.txt`加了一行内容`tom modify`，此时拉代码。

  * fetch 拉取远端代码到本地

  * rebase 把本地代码提交基于远端分支重新replay

***



## 四、分支管理

#### 1.创建分支

* ```js
  $ git checkout -b dev/pzqu origin/master
  Branch 'dev/pzqu' set up to track remote branch 'master' from 'origin'.
  Switched to a new branch 'dev/pzqu'
  
  $ git branch
  * dev/pzqu
    master
  ```

* 

* git checkout -b 分支名 其他分支

  -b代表创建并切换到此分支，分支名是创建的分支的名字，其他分支代表基于哪个分支来创建，这里基于远程的master分支`origin/master`，如果省略则代表基于当前分支

- `git branch`展示本地的分支情况，加`-a`参数可以展示全部的分支，包括远程分支
- `*`在分支前，指明了现在所在的分支是`dev/pzqu`

#### 2.切换分支

```
$ git checkout -b dev/pzqu2
Switched to a new branch 'dev/pzqu2'

$ git branch
  dev/pzqu
* dev/pzqu2
  master

$ git checkout dev/pzqu
Switched to branch 'dev/pzqu'
Your branch is up to date with 'origin/master'.

$ git branch
* dev/pzqu
  dev/pzqu2
  master
```

- 基于当前分支创建了一个新的分支并自动切换过去`dev/pzqu2`
- `git checkout 已存在的分支名`切换分支回到`dev/pzqu`

#### 3.删除分支

```
$ git branch
* dev/pzqu
  dev/pzqu2
  master
  
$ git branch -D dev/pzqu2
Deleted branch dev/pzqu2 (was 7c9be37).

$ git branch
* dev/pzqu
  master
  
复制代码
```

- 位于`dev/pzqu`，删除了`dev/pzqu2`分支

## 五、合并冲突

#### 1. 合并同一个分支的冲突（常见）

为了产生一个冲突，我在另一个地方向远程仓库提交了代码，更改`share_file.txt`文件，加了一行内容`tom add for merge`，

本地修改同一个文件加了一行`pzqu add for merge`，并提交到本地，这样一来，本地和远程仓库的同一个文件就不一样了，一会拉代码一定会产生一个冲突。效果如下：



![img](https://user-gold-cdn.xitu.io/2019/3/8/1695b6414aed945c?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

upload successful



- 一般rebase或pull冲突的时候，都会出现提示，然后git status会出现上图图示
- 这个时候不可以进行任何分支切换和commit操作，按照他提示进行处理
- **git status提示哪个文件是都被修改的**，both modified，然后**使用编辑器修改该文件，解决冲突**
- 解决完成后，**git add 添加该冲突文件**
- **git rebase --continue，并更新commit message，**完成整个rebase流程 我们来看看这个冲突的文件：



![img](https://user-gold-cdn.xitu.io/2019/3/8/1695b641517a2943?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

upload successful



Git用`<<<<<<<`，`=======`，`>>>>>>>`标记出不同分支的内容，我们修改如下后保存：



![img](https://user-gold-cdn.xitu.io/2019/3/8/1695b64196ae562b?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

upload successful



`git add`再`git rebase --continue`后完成rebase，效果如下，再`push`的远程仓库即可



![img](https://user-gold-cdn.xitu.io/2019/3/8/1695b641971f2a76?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

upload successful



#### 2.合并不同分支的代码产生冲突

关于怎么创建分支与切换分支见创建分支和切换分支,这里只讨论合并时产生的冲突的情况，我们已经基于`master`分支创建了一个`dev/pzqu`分支

```
$ git branch
* dev/pzqu
  master
复制代码
```

切换到`master`分支，加一行`master add for merge`并提交，文件内容如下：

```
$ cat share_file.txt
tom add
tom modify
tom add for merge
pzqu add for merge
master add for merge
复制代码
```

切换到`dev/pzqu`分支，向`share_file.txt`加入一行`dev/pzqu add for merge`并提交，现在`share_file.txt`内容如下：

```
$ cat share_file.txt
tom add
tom modify
tom add for merge
pzqu add for merge
dev/pzqu add for merge
复制代码
```

现在两个分支的同一个文件内容不一样了，现在我们在`dev/pzqu`分支上进行合并：

```
$ git merge master
Auto-merging share_file.txt
CONFLICT (content): Merge conflict in share_file.txt
Automatic merge failed; fix conflicts and then commit the result.

# pzqu @ pzqu-pc in ~/Documents/code/test/git_test on git:dev/pzqu x [11:17:31] C:1
$ git status
On branch dev/pzqu
Your branch is ahead of 'origin/master' by 1 commit.
  (use "git push" to publish your local commits)

You have unmerged paths.
  (fix conflicts and run "git commit")
  (use "git merge --abort" to abort the merge)

Unmerged paths:
  (use "git add <file>..." to mark resolution)

	both modified:   share_file.txt

no changes added to commit (use "git add" and/or "git commit -a")

$ cat share_file.txt
tom add
tom modify
tom add for merge
pzqu add for merge
<<<<<<< HEAD
dev/pzqu add for merge
=======
master add for merge
>>>>>>> master
复制代码
```

上图出现了一个冲突，是我们意料之中的，**修改`share_file.txt`文件，解决此冲突**：

```
$ cat share_file.txt
tom add
tom modify
tom add for merge
pzqu add for merge
dev/pzqu add for merge
master add for merge

$ git add share_file.txt

# pzqu @ pzqu-pc in ~/Documents/code/test/git_test on git:dev/pzqu x [11:22:40]
$ git commit -m "[*]merge master to dev/pzqu"
[dev/pzqu d9e018e] [*]merge master to dev/pzqu

# pzqu @ pzqu-pc in ~/Documents/code/test/git_test on git:dev/pzqu o [11:23:00]
$ git status
On branch dev/pzqu
Your branch is ahead of 'origin/master' by 3 commits.
  (use "git push" to publish your local commits)

nothing to commit, working tree clean
复制代码
```

冲突解决也提交了，看看我们现在的分支内容：



![img](https://user-gold-cdn.xitu.io/2019/3/8/1695b6419d207704?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

upload successful

上图我们可以看到：

- `master`分支比远程`origin/master`分支多一次提交，`dev/pzqu`分支由于是基于`origin/master`分支，合并了`master`分支的提交和当前`dev/pzqu`分支的提交，超出本地`master`两个提交，致此我们把`master`合并到`dev/pzqu`的操作就完成了。
- 通常我们开一个新的开发分支是为了在自己的分支上写代码，方便提交也不会把主线弄乱，现在我们用同样的方法将`dev/pzqu`合并到`master`分支，然后把两个分支都提交到远程。

```
$ git checkout master
Switched to branch 'master'
Your branch is ahead of 'origin/master' by 1 commit.
  (use "git push" to publish your local commits)

$ git merge dev/pzqu
Updating 58f047a..d9e018e
Fast-forward
 share_file.txt | 1 +
 1 file changed, 1 insertion(+)

$ git push origin master
Total 0 (delta 0), reused 0 (delta 0)
To github.com:pzqu/git_test.git
   7c9be37..d9e018e  master -> master
   
$ git push origin dev/pzqu
Counting objects: 9, done.
Delta compression using up to 8 threads.
Compressing objects: 100% (9/9), done.
Writing objects: 100% (9/9), 887 bytes | 887.00 KiB/s, done.
Total 9 (delta 2), reused 0 (delta 0)
remote: Resolving deltas: 100% (2/2), done.
remote:
remote: Create a pull request for 'dev/pzqu' on GitHub by visiting:
remote:      https://github.com/pzqu/git_test/pull/new/dev/pzqu
remote:
To github.com:pzqu/git_test.git
 * [new branch]      dev/pzqu -> dev/pzqu
复制代码
```

- 切换到`master`分支
- 合并`dev/pzqu`到`master`分支
- `master`推到远程仓库
- 如果`dev/pzqu`要保留，就可以推送到远程仓库。



![img](https://user-gold-cdn.xitu.io/2019/3/8/1695b641a2949930?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

upload successful



- 现在我们可以看到全部的分支都在一起了，强迫症都舒服了。

## 六、暂存代码保存现场

这种情况一般是出现在你正在完成一个功能，但是忽然线上发现了一个Bug，必须马上开一个新的分支来修复bug，但是现在的功能没写完不打算提交(commit)，现在怎么办？？不用怕暂存代码来帮助你。

```
$ git status
On branch dev/pzqu
Your branch is up to date with 'origin/master'.

Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

	new file:   need_stash.txt
	modified:   share_file.txt

$ git stash
Saved working directory and index state WIP on dev/pzqu: d9e018e [*]merge master to dev/pzqu

$ git stash list
stash@{0}: WIP on dev/pzqu: d9e018e [*]merge master to dev/pzqu

$ git status
On branch dev/pzqu
Your branch is up to date with 'origin/master'.

nothing to commit, working tree clean


//省略操作：去创建一个Bug分支，修复他并完成与主线的合并，删除Bug分支。
//省略操作：切回来当前分支继续开发
//下面来恢复现场


$ git stash apply stash@{0}
On branch dev/pzqu
Your branch is up to date with 'origin/master'.

Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

	new file:   need_stash.txt

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

	modified:   share_file.txt
复制代码
```

- `status`查看到有2个文件修改没有提交
- `stash`把修改放到暂存区，并生成一个id
- `stash list`列出暂存区所有内容
- `stash apply`重新把暂存区内容放到本地

这里的`stash apply`成功的把暂存区的一次暂存恢复到了本地，但是暂存区还有会保存这次暂存，如果想删除这次暂存要用`git stash drop`来删除；也可以用`git stash pop`，恢复最后一次暂存的同时把stash内容也删了。

```
$ git stash drop stash@{0}
Dropped stash@{0} (bfdc065df8adc44c8b69fa6826e75c5991e6cad0)

$ git stash list
复制代码
```

好了，暂存区清干净了。

​    注意：要放到暂存区的文件一定要先通过git add加到index

# 小结

本文阅读结束以后，我们学会了

- Git的基本概念，知道git的作用、历史；学会安装配置Git，使用Git创建项目托管以及工作区和暂存区的概念
- 学会Git的本地操作，提交、拉代码、创建切换删除分支操作，
- 多人合作时的代码版本控制，学会了不同情况下的合并冲突、暂存代码操作

##  同步分支及冲突解决

##### 1、说明

同步分支主要是用于多人合作开发， 单人开发的情况下， 也可以参考使用。

首先打开云平台，进入到项目仓库，可以在左上角看到默认的master分支， 可以之后可以通过下拉菜单管理分支。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3c51e6b860ac4c1bbbca26b952c70cde~tplv-k3u1fbpfcp-watermark.image)

多人开发时，建议创建dev临时分支用于开发， 基于dev分支下面的分支分配给各个开发人员使用

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/01d60dbed39c4a4abe5d5302bb39cc0d~tplv-k3u1fbpfcp-watermark.image)

##### 2、 本地同步分支

经过多次实验， 暂时没找到本地一次拉取分支的办法

> git checkout -b user1 origin/user1

该命令是拉取origin的user1分支到本地的user1分支，  本地的user1分支可以另命名。

多个分支， 就多执行几次， 切换对应的命名即可。

不小心创建了错误的本地分支执行下面的命令删除

> git branch -d <branch name>

##### 3、代码合并

**作为小组的负责人，合并代码有两种方式， 一种是在本地创建临时分支， 拉取远程仓库的各个开发人员的分支后进行合并。**

> git checkout -b temp origin/user1 // 此时会默认切换到temp分支

> git pull origin user1

> git checkout dev

> git merge temp

首次合并需要执行第一条命令， 然后拉取远程分支， 切换到dev开发分支并合并代码。

> git status

上述命令可以查看本地合并的变化， 绿色代表新增无冲突，  红色代码删除或冲突文件。

** 特别说明： 如果产生冲突， 命令行也会有提示需要你解决冲突。

下图中的master 会切换成 master | MERGEING **

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7ac32be52e9b45b1b029294b043b693c~tplv-k3u1fbpfcp-watermark.image)

如果出现`both modifed`的字样， 代表该文件与现有文件的代码冲突并无法直接合并，需要手动合并。

这是可以借助[vscode软件](https://code.visualstudio.com/)打开冲突文件， 自行决定代码合并的方式

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b07a36ba9873483782b7f99d256a2cc7~tplv-k3u1fbpfcp-watermark.image)

##### 4、解决冲突后上传

在上述操作解决完代码冲突后， 可以执行以下命令

> git status

查看是否还存在代码冲突的文件，  modify修改， delete删除类型的可以视情况忽略。

> git add .

> git commit -m '合并冲突'

> git push origin dev

## 5、结尾

以上步骤基本可以满足日常的开发需求，在完成一个阶段的开发后，可以在代码库以版本号创建一个分支，将当前代码推入到对应的版本分支当中，  完成版本管理的最后一步。