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

* 重返未来 查看命令历史			                            git reflog

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

* 删除工作区的文件                                                   rm test.txt[^ 可直接在文件管理器中删除]
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

***



## 四、分支管理

#### 1.创建与合并分支

* 



