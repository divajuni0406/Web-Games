// set cookie
function setCookie(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

// get cookie
function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}
// erase cookie
function eraseCookie(type) {
  let cookies = document.cookie.split(';');
  cookies.forEach(cookie => {
    if(cookie.search('code-') > -1){
      let split = cookie.split('=');
      document.cookie = split[0] + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    }

    if(type == 'logout'){
      if(cookie.search('cookie') > -1){
        let split = cookie.split('=');
        document.cookie = split[0] + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      }
    }
  })
}

export { eraseCookie, getCookie, setCookie };
