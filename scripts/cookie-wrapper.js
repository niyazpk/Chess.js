/* Cookie wrapper */
var Cookie = new function() {

    this.set = function(name, value, days) {
    if (typeof days !== 'undefined') {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            var expires = "; expires=" + date.toGMTString();
        } else {
            var expires = "";
        }
        document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/";
    }

    this.get = function(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            try {
                if (c.indexOf(nameEQ) == 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
            } catch (e) {
                
            }
        }
        return null;
    }

    this.clear = function(name) {
        Cookie.set(name, "", -1);
    }
};