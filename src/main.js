const localSite = JSON.parse(localStorage.getItem("localSite")) || [
  { name:'github', logo: "G", url: "https://github.com/",img:"https://github.com/favicon.ico" },
  { name:'b站', logo: "B", url: "https://www.bilibili.com", img:"https://www.bilibili.com/favicon.ico" },
];
let $siteList = $(".siteList");
let $lastLi = $(".last");
const $modelWrap  = $('.modelWrap');
const $model = $('.model');

const isTouchDevice = "ontouchstart" in document.documentElement;

const manageLogo = (site) =>{
  if(site.img){
    return `<img src='${site.img}'/>`
  }else{
    return site.logo
  }
}

const simplyUrl = (url) => {
  return url
    .replace("https://", "")
    .replace("http://", "")
    .replace("www.", "")
    .replace(/\/.*/, "");
};

const renderSite = () => {
  $siteList.find('li:not(".last")').remove();
  localSite.forEach((site, index) => {
    let $site = $(`<li>
      <div class="site">
        <div class="logo">${manageLogo(site)}</div>
        <div class="link">${site.name}</div>
        <div class='delete ${isTouchDevice?'':'hide'}'>
          <svg class="icon">
            <use xlink:href="#icon-delete"></use>
          </svg>
        </div>
      </div>
    </li>`).insertBefore($lastLi);

    $site.on("click", (e) => {
      window.open(site.url);
    });

    $site.on("click", ".delete", (e) => {
      e.stopPropagation();
      localSite.splice(index, 1);
      renderSite();
      return;
    });
  });
  showOrHideAddButton()
};

const showOrHideAddButton  = () =>{
  if(localSite.length >= 10){
    $(".last").addClass('hide')
  }else{
    $(".last").removeClass('hide')
  }
}

$(".addButton").on("click", () => {
  $modelWrap.removeClass('hide')
});

$('.model .cancel-button').click(() => {
  $model.find('input[type=text]').val('')
  $modelWrap.addClass('hide')
})

$('.model .ensure-button').click(() => {
  let siteNameVal = $('[name=siteName]').val().trim()
  let siteUrlVal = $('[name=siteUrl]').val().trim()
  if(siteUrlVal.indexOf('https://') === -1){
    siteUrlVal = 'https://' + siteUrlVal
  }

  if(siteUrlVal[siteUrlVal.length - 1] !== '/'){
    siteUrlVal = siteUrlVal + '/'
  }

  let siteImg = siteUrlVal + 'favicon.ico'

  //测试图片
  img.setAttribute('src',siteImg);
  img.onload = ()=>{
    localSite.push({
      name:siteNameVal,
      logo: simplyUrl(siteUrlVal)[0].toUpperCase(),
      url: siteUrlVal,
      img: siteImg
    });
    render()
  }

  img.onerror = ()=>{
    localSite.push({
      name:siteNameVal,
      logo: simplyUrl(siteUrlVal)[0].toUpperCase(),
      url: siteUrlVal
    });
    render()
  }
  
  function render(){
    renderSite();
    $model.find('input[type=text]').val('')
    $modelWrap.addClass('hide')
  }
})

$model.find('input[type=text]').on('keyup',(e) => {
  let siteNameVal = $('[name=siteName]').val().trim()
  let siteUrlVal = $('[name=siteUrl]').val().trim()
  if(siteNameVal === '' || siteUrlVal === ''){
    $('.ensure-button').attr('disabled',true)
  }else{
    $('.ensure-button').removeAttr("disabled")
  }
})

renderSite();

window.onbeforeunload = function () {
  localStorage.setItem("localSite", JSON.stringify(localSite));
};

$(document).on('keypress',(e) =>{
  let targetName = e.target.getAttribute('name')
  if(targetName === 'wd' || targetName === 'siteName' || targetName === 'siteUrl') return

  const {key} = e
  localSite.forEach(site => {
    if(site.logo.toLowerCase() === key.toLowerCase()){
      window.open(site.url)
    }
  })
})
