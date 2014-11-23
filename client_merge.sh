#! /bin/bash

# use -e option for linefeed and carrage return
echo -e 'github auto client-remote merge\nver.0.1\n2014.11.23\nauthor : JuneyoungOh'

#remove sharp mark of A1 if you need new remote repository
#A1 - echo -e 'enter your remote address'
#A1 - read remoteaddr

echo -e 'enter commit message'
read commitmsg

# A1 - git remote add upstream $remoteaddr

git remote -v
git fetch upstream
git merge upstream/master
git commit -m $commitmsg
git push origin master


#Legacy code - if/else statement needs empty space bitween other
#if [ $# -ne 1 ]; 
#then 
# echo 'parameter is not available.\nusage : client_merge.sh <remote>'
#else
# echo 'execute commands.'
#fi
