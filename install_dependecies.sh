#!/bin/bash

# Update package list
sudo yum -y update

# Install Python 3 and pip
sudo yum -y install python3 python3-pip

# Install Node.js and npm
curl -sL https://rpm.nodesource.com/setup_16.x | sudo bash -
sudo yum -y install nodejs

# Install Python libraries
pip3 install --user django boto3 requests drf_yasg

# Install Node.js libraries
sudo npm install -g react react-dom axios npm@9.6.5 react-scripts

npm install --save-dev babel-plugin-transform-class-properties


# Print versions
python3 --version
pip3 --version
node --version
npm --version



# Print installed Python libraries
pip3 freeze