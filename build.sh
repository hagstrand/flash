# build flash

# compile the js files with google closure compiler
python compilejs.py >min.js

# concatenate and compile the css files
cat minimal/normaleyes.css minimal/minimal.css icon/icon.css css/theme.css css/flash.css css/desk.css >min.css
java -jar /home/jhagstrand/bin/yuicompressor/yuicompressor-2.4.2.jar min.css -o min.css --charset utf-8

# prepare index.php for production use
cp index.html index.php
sed -i -e 's/<!--<remove>//g' index.php
sed -i -e 's/<remove>-->//g' index.php
