sudo ssh -i ~/projects/aws/aws-scrapbook-key-pair.pem ubuntu@ec2-18-169-193-110.eu-west-2.compute.amazonaws.com << EOF
cd ~/todobot

sudo forever stopall
sudo fuser -k -n tcp 80
sudo pkill node


eval "$(ssh-agent -s)"
git config --global --add safe.directory /home/ubuntu/todobot
git restore .
git pull origin main



npm install



sudo rm -rf /root/.forever/console.log
sudo forever start -l console.log -c "npm run todo-execute-job:local" .

# -- Help
# for running process on port 80
# sudo chown -R root .
# eval `ssh-agent -s`
# ssh-add ~/.ssh/github
# -- sudo vim ~/.ssh/config
# IdentityFile ~/.ssh/github

EOF