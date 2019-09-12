# build flash

# compile the js files with google closure compiler
python compilejs.py >min.js

# concatenate and compile the css files
cat minimal/normaleyes.css minimal/minimal.css icon/icon.css css/theme.css css/flash.css css/desk.css |
    sed 's/+/%2b/g'  >min.css
wget --post-data="input=`cat min.css`" --output-document=min.css https://cssminifier.com/raw

# prepare index.php for production use
cp index.html index.php
sed -i -e 's/<!--<remove>//g' index.php
sed -i -e 's/<remove>-->//g' index.php
