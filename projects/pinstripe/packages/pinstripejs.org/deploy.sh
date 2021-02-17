
rm -rf build
mkdir -p build
cd build
cp -R ../lib/* ./
git init
if [[ "$CI" = "true" ]]
then
    git config user.email "action@github.com"
    git config user.name "GitHub Action"
fi
git remote add origin git@github.com:blognami/pinstripejs.org.git
git checkout -b gh-pages
git add --all .
git commit -a -m 'deploy'
if [[ "$CI" = "true" ]]
then
    echo $WEBSITE_DEPLOY_KEY | base64 -d > ./id_rsa
    chmod 400 ./id_rsa
    ssh-agent sh -c 'ssh-add ./id_rsa; git push -u origin gh-pages --force'
else
    git push -u origin gh-pages --force
fi
