#if [ `uname` = 'Darwin' ];then
#    ROOT=$(/usr/bin/php -r "echo realpath('`dirname $0`/../');")
#else
#    ROOT=$(/Data/apps/php/bin/php -r "echo realpath('`dirname $0`/../');")
#fi

ROOT=$(/usr/local/php/bin/php -r "echo realpath('`dirname $0`/../');")

rm -rf $ROOT/cscope/cscope.*

find_files () {
    if [[ -d $1 ]];then
        if [ `uname` = 'Darwin' ];then
            find $1 -name "*.php"    >  $ROOT/cscope/cscope.files
            find $1 -name "*.js"     >> $ROOT/cscope/cscope.files                                                                           
            find $1 -name "*.sql"    >> $ROOT/cscope/cscope.files
            find $1 -name "*.sh"     >> $ROOT/cscope/cscope.files
            find $1 -name "*.conf"   >> $ROOT/cscope/cscope.files
        else
            find $1/ -type f -name "*.php" | grep -v "Zend" | grep -v "PHPUnit" | grep -v "vendor" >> $ROOT/cscope/cscope.files
            find $1/ -type f -name "*.js"                                       >> $ROOT/cscope/cscope.files
            find $1/ -type f -name "*.sql"                                      >> $ROOT/cscope/cscope.files
            find $1/ -type f -name "*.sh"                                       >> $ROOT/cscope/cscope.files
            find $1/ -type f -name "*.conf"                                     >> $ROOT/cscope/cscope.files
        fi  
    fi  
}

find_files $ROOT 
#find_files $ROOT/libs
#find_files $ROOT/sparta


#for service_name in `ls $ROOT/services`
#do
#    find_files $ROOT/services/$service_name
#done

cd $ROOT/cscope
cscope -b

ctags  -R --fields=+lS $ROOT 2>/dev/null
#ctags -R --languages=PHP --exclude=.svn --totals=yes --tag-relative=yes --PHP-kinds=+cf $ROOT 2>/dev/null
#ctags  -R --php-kinds=+cidfvj --fields=+afmikKlnsStz $ROOT
#ctags  -R --fields=+afmikKlnsStz $ROOT
#ctags  -R --fields=+afmikKlnsStz $ROOT               

