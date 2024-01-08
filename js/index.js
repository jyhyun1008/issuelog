
var cssRoot = document.querySelector(':root');
cssRoot.style.setProperty('--accent', accentColor)

function parseMd(md){ // 깃허브 등에 사용하는 마크다운 파일을 html로 변환시켜 줍니다.
    // 정규식으로 되어 있습니다. 자세한 것은 정규식을 공부해 주세요.

    md = "\n"+md
    const md0 = md.replace(/\</gm,"&lt;").replace(/\>/gm, "&gt;");

    //루비
    md = md.replace(/\$\[ruby\s([^\]]+)\s([^\]]+)\]/gm, '<ruby>$1<rp>(</rp><rt>$2</rt><rp>)</rp></ruby>');

    //체크박스
    md = md.replace(/\n\[\]\s([^\]\[].+)/gm, '<p><input type="checkbox" class="checkbox" /> $1</p>')
  
    //ul
    md = md.replace(/^\s*\n\*\s/gm, '<ul">\n* ');
    md = md.replace(/^(\*\s.+)\s*\n([^\*])/gm, '$1\n</ul>\n\n$2');
    md = md.replace(/^\*\s(.+)/gm, '<li class="list before">$1</li>');
    
    //ul
    md = md.replace(/^\s*\n\-\s/gm, '<ul>\n* ');
    md = md.replace(/^(\-\s.+)\s*\n([^\-])/gm, '$1\n</ul>\n\n$2');
    md = md.replace(/^\-\s(.+)/gm, '<li class="list before">$1</li>');
    
    //ol
    md = md.replace(/^\s*\n\d\.\s/gm, '<ol>\n1. ');
    md = md.replace(/^(\d\.\s.+)\s*\n([^\d\.])/gm, '$1\n</ol>\n\n$2');
    md = md.replace(/^\d\.\s(.+)/gm, '<li>$1</li>');
    
    //blockquote
    md = md.replace(/^\>(.+)/gm, '<blockquote>$1</blockquote>');
    md = md.replace('</blockquote><blockquote>', '');
    md = md.replace('</blockquote>\n<blockquote>', '\n');

    //hr
    md = md.replace(/[\-]{3}/g, '</div></div><div class="item_wrap"><div class="line">✿</div><div class="item">');
    
    //h
    md = md.replace(/\n[\#]{6}(.+)/g, '<h6>$1</h6>');
    md = md.replace(/\n[\#]{5}(.+)/g, '<h5>$1</h5>');
    md = md.replace(/\n[\#]{4}(.+)/g, '<h4>$1</h4>');
    md = md.replace(/\n[\#]{3}(.+)/g, '<h3>$1</h3>');
    md = md.replace(/\n[\#]{2}(.+)/g, '<h2>$1</h2>');
    md = md.replace(/\n[\#]{1}(.+)/g, '</div><div class="item"><h1>$1</h1>');
    
    //images with links
    md = md.replace(/\!\[([^\]]+)\]\(([^\)]+)\)[\(]{1}([^\)\"]+)(\"(.+)\")?[\)]{1}/g, '<div class="gallery"><a href="$3"><img class="postimage" src="$2" alt="$1" width="100%" /></a></div>');
    
    //images
    md = md.replace(/\!\[([^\]]+)\]\(([^\)]+)\)/g, '<img class="postimage" src="$2" alt="$1" width="100%" />');
    
    //links
    md = md.replace(/[\[]{1}([^\]]+)[\]]{1}[\(]{1}([^\)\"]+)(\"(.+)\")?[\)]{1}/g, '<a href="$2" title="$4">$1</a>');
    //mentions
    md = md.replace(/\@([\-\_0-9A-z]+)\@([\-\_0-9A-z.]+)/gm, '<span class="handle"><a href="https://$2/@$1">@$1@$2</a></span>')
    
    //font styles
    md = md.replace(/[\*]{2}([^\*]+)[\*]{2}/g, '<strong>$1</strong>');
    md = md.replace(/[\*]{1}([^\*]+)[\*]{1}/g, '<i>$1</i>');
    md = md.replace(/[\~]{2}([^\~]+)[\~]{2}/g, '<del>$1</del>');


    //주석
    md = md.replace(/\n[\/]{2}(.+)/g, '');
    

    //code
    md = md.replace(/[\`]{1}([^\`\n]+)[\`]{1}/g, '<code>$1</code>');

    //pre
    
    var mdpos = [];
    var rawpos = [];
    let pos1 = -1;
    let k = 0;

    var diff = [0]

    while( (pos1 = md0.indexOf('\n```', pos1 + 1)) != -1 ) { 
        if (k % 2 == 0){
            rawpos[k] = pos1 + 4;
        } else {
            rawpos[k] = pos1;
        }
        k++;
    }

    let pos2 = -1;
    let l = 0;

    while( (pos2 = md.indexOf('\n```', pos2 + 1)) != -1 ) { 
        if (l % 2 == 0){
            mdpos[l] = pos2 - 1;
        } else {
            mdpos[l] = pos2 + 5;
        }
        l++;
    }

    for (var i = 0; i < mdpos.length; i++){
        if (i % 2 == 0){

            console.log(md.substring(mdpos[i] - diff[i], mdpos[i+1] - diff[i]))

            md = md.replace(md.substring(mdpos[i] - diff[i], mdpos[i+1] - diff[i]), '<pre class="code">'+md0.substring(rawpos[i], rawpos[i+1])+'</pre>');

            var mdSubStringLength = mdpos[i+1] - mdpos[i];
            var rawSubStringLength = rawpos[i+1] - rawpos[i] + '<pre class="code">'.length + '</pre>'.length;
            diff[i+2] = diff[i] + mdSubStringLength - rawSubStringLength;

            console.log(diff)
        }
    }

    //br
    md = md.replace(/\n\n\n/g, '</p><p> </p><p>');
    md = md.replace(/\n\n/g, '</p><p>');
    
    return md;
    
}

function parsePlainText(md) {
 // 깃허브 등에 사용하는 마크다운 파일을 html로 변환시켜 줍니다.
    // 정규식으로 되어 있습니다. 자세한 것은 정규식을 공부해 주세요.

    md = "\n"+md
    const md0 = md.replace(/\</gm,"&lt;").replace(/\>/gm, "&gt;");

    //루비
    md = md.replace(/\$\[ruby\s([^\]]+)\s([^\]]+)\]/gm, '<ruby>$1<rp>(</rp><rt>$2</rt><rp>)</rp></ruby>');

    //체크박스
    md = md.replace(/\n\[\]\s([^\]\[].+)/gm, '$1')
    
    //blockquote
    md = md.replace(/^\>(.+)/gm, '$1');

    //hr
    md = md.replace(/[\-]{3}/g, '');
    
    //h
    md = md.replace(/\n[\#]{6}(.+)/g, '$1');
    md = md.replace(/\n[\#]{5}(.+)/g, '$1');
    md = md.replace(/\n[\#]{4}(.+)/g, '$1');
    md = md.replace(/\n[\#]{3}(.+)/g, '$1');
    md = md.replace(/\n[\#]{2}(.+)/g, '$1');
    md = md.replace(/\n[\#]{1}(.+)/g, '$1');
    
    //images with links
    md = md.replace(/\!\[([^\]]+)\]\(([^\)]+)\)[\(]{1}([^\)\"]+)(\"(.+)\")?[\)]{1}/g, '');
    
    //images
    md = md.replace(/\!\[([^\]]+)\]\(([^\)]+)\)/g, '');
    
    //links
    md = md.replace(/[\[]{1}([^\]]+)[\]]{1}[\(]{1}([^\)\"]+)(\"(.+)\")?[\)]{1}/g, '$1');
    
    //font styles
    md = md.replace(/[\*]{2}([^\*]+)[\*]{2}/g, '$1');
    md = md.replace(/[\*]{1}([^\*]+)[\*]{1}/g, '$1');
    md = md.replace(/[\~]{2}([^\~]+)[\~]{2}/g, '$1');


    //주석
    md = md.replace(/\n[\/]{2}(.+)/g, '');
    

    //code
    md = md.replace(/[\`]{1}([^\`\n]+)[\`]{1}/g, '$1');

    //pre
    
    var mdpos = [];
    var rawpos = [];
    let pos1 = -1;
    let k = 0;

    var diff = [0]

    while( (pos1 = md0.indexOf('\n```', pos1 + 1)) != -1 ) { 
        if (k % 2 == 0){
            rawpos[k] = pos1 + 4;
        } else {
            rawpos[k] = pos1;
        }
        k++;
    }

    let pos2 = -1;
    let l = 0;

    while( (pos2 = md.indexOf('\n```', pos2 + 1)) != -1 ) { 
        if (l % 2 == 0){
            mdpos[l] = pos2 - 1;
        } else {
            mdpos[l] = pos2 + 5;
        }
        l++;
    }

    for (var i = 0; i < mdpos.length; i++){
        if (i % 2 == 0){

            console.log(md.substring(mdpos[i] - diff[i], mdpos[i+1] - diff[i]))

            md = md.replace(md.substring(mdpos[i] - diff[i], mdpos[i+1] - diff[i]), '');

            var mdSubStringLength = mdpos[i+1] - mdpos[i];
            var rawSubStringLength = rawpos[i+1] - rawpos[i];
            diff[i+2] = diff[i] + mdSubStringLength - rawSubStringLength;

        }
    }

    //br
    md = md.replace(/\n\n\n/g, ' ');
    md = md.replace(/\n\n/g, ' ');
    md = md.replace(/\n/g, ' ');
    
    return md;
    
}

function nothingHere() {
    document.querySelector("#page_content").innerHTML += '<div class="nothingHere"><div><i class="bx bx-message-alt-error"></i></div><div>여기는 아무것도 없어요!</div></div>'
}

function getQueryStringObject() {
    var a = window.location.search.substr(1).split('&');
    if (a == "") return {};
    var b = {};
    for (var i = 0; i < a.length; ++i) {
        var p = a[i].split('=', 2);
        if (p.length == 1)
            b[p[0]] = "";
        else
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return b;
}

var qs = getQueryStringObject();
var page = qs.p;
//var signinHost = qs.h;
var category = qs.cat;
var article = qs.a;
var index = qs.index;

if (!page && !category && !article) {
    var url = "https://raw.githubusercontent.com/"+githubUserName+"/"+githubRepoName+"/main/README.md"
    fetch(url)
    .then(res => res.text())
    .then((out) => {
        document.querySelector("#page_title").innerText = 'HOME'
        document.querySelector("#page_content").innerHTML += parseMd(out)
    })
} else if (page == 'blog') {
    var url = "https://api.github.com/repos/"+githubUserName+"/"+githubRepoName+"/issues"
    fetch(url)
    .then(res => res.text())
    .then((out) => {
        document.querySelector("#page_title").innerText = 'BLOG'
        var results = JSON.parse(out)

        function isUserName(result) {
            if (result.user.login == githubUserName) {
                return true
            }
        }

        filteredResults = results.filter(isUserName)
        console.log(filteredResults)

        for (let i = 0; i < filteredResults.length; i++) {
            var coverimg = filteredResults[i].body.split("![")[1].split("](")[1].split(")")[0]
            document.querySelector("#page_content").innerHTML += "<div class='postlist'><div class='coverimg' id='cover"+i+"'><a href='./?a="+filteredResults[i].number+"' class='nodeco'><img class='width200' src='"+coverimg+"'></a></div><div class='posttext' id='post"+i+"'></div><div>"
            if (filteredResults[i].labels.length > 0) {
                document.querySelector("#post"+i).innerHTML += "<a href='./?a="+filteredResults[i].number+"' class='nodeco'><h2>"+filteredResults[i].title+" ("+filteredResults[i].comments+")</h2></a><div><a href='./?cat="+filteredResults[i].labels[0].name+"' class='nodeco'><span class='category' style='background-color: #"+filteredResults[i].labels[0].color+"; color: white;'>"+filteredResults[i].labels[0].name+"</span></a></div><div class='description'>"+parsePlainText(filteredResults[i].body).substr(0, 100)+"...</div><div class='datetime'>"+filteredResults[i].created_at+"</div>"
            } else {
                document.querySelector("#post"+i).innerHTML += "<a href='./?a="+filteredResults[i].number+"' class='nodeco'><h2>"+filteredResults[i].title+" ("+filteredResults[i].comments+")</h2></a><div class='description'>"+parsePlainText(filteredResults[i].body).substr(0, 100)+"...</div><div class='datetime'>"+filteredResults[i].created_at+"</div>"
            }
        }
    })
}  else if (page == 'category') {
    var url = "https://api.github.com/repos/"+githubUserName+"/"+githubRepoName+"/labels"
    fetch(url)
    .then(res => res.text())
    .then((out) => {
        document.querySelector("#page_title").innerText = 'SERIES'
        console.log(out)
        var results = JSON.parse(out)
        for (let i = 0; i < results.length; i++) {
            document.querySelector("#page_content").innerHTML += "<div class='postlist'><div class='covercolor' style='background-color:#"+results[i].color+";'></div><div class='posttext' id='post"+i+"'></div><div>"
            document.querySelector("#post"+i).innerHTML += "<a href='./?cat="+results[i].name+"' class='nodeco'><h2>"+results[i].name+"</h2></a><div class='description'>"+results[i].description+"</div>"
        }
    })
} else if (category) {
    var url = "https://api.github.com/repos/"+githubUserName+"/"+githubRepoName+"/issues"
    fetch(url)
    .then(res => res.text())
    .then((out) => {
        document.querySelector("#page_title").innerText = category
        var results = JSON.parse(out)

        function isInCategory(result) {
            if (result.user.login == githubUserName) {
                if (result.labels.length > 0) {
                    if (result.labels[0].name == category) {
                        return true
                    }
                }
            }
        }

        filteredResults = results.filter(isInCategory)
        console.log(filteredResults)

        for (let i = 0; i < filteredResults.length; i++) {
            var coverimg = filteredResults[i].body.split("![")[1].split("](")[1].split(")")[0]
            document.querySelector("#page_content").innerHTML += "<div class='postlist'><div class='coverimg' id='cover"+i+"'><a href='./?a="+filteredResults[i].number+"' class='nodeco'><img class='width200' src='"+coverimg+"'></a></div><div class='posttext' id='post"+i+"'></div><div>"
            document.querySelector("#post"+i).innerHTML += "<a href='./?a="+filteredResults[i].number+"' class='nodeco'><h2>"+filteredResults[i].title+" ("+filteredResults[i].comments+")</h2></ㅁ><div class='description'>"+parsePlainText(filteredResults[i].body).substr(0, 100)+"...</div><div class='datetime'>"+filteredResults[i].created_at+"</div>"
        }
    })
} else if (article) {
    var url = "https://api.github.com/repos/"+githubUserName+"/"+githubRepoName+"/issues/"+article
    fetch(url)
    .then(res => res.text())
    .then((out) => {
        var result = JSON.parse(out)
        document.querySelector("#page_title").innerText = result.title

        console.log(result)

        document.querySelector("#page_content").innerHTML += "<div><a href='./?cat="+result.labels[0].name+"' class='nodeco'><span class='category' style='background-color: #"+result.labels[0].color+"; color: white;'>"+result.labels[0].name+"</span></a></div><div><p></p></div><div class='datetime'>"+result.created_at+"</div><div id='blogbody'></div><div id='blogcomments'></div>"
        document.querySelector("#blogbody").innerHTML += parseMd(result.body)
    })
} else if (page) {
    var url = "https://raw.githubusercontent.com/"+githubUserName+"/"+githubRepoName+"/main/pages/"+page+".md"
    fetch(url)
    .then(res => res.text())
    .then((out) => {
        document.querySelector("#page_title").innerText = page

        console.log(result)

        document.querySelector("#page_content").innerHTML += "<div id='blogbody'></div>"
        document.querySelector("#blogbody").innerHTML += parseMd(out)
    })
}