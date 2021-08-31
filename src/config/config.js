/* eslint-disable compat/compat */
/* eslint-disable promise/catch-or-return */
function GetConfig() {
    fetch('/config/host.json')
        .then(response => response.json())
        .then(data => {
            Object.keys(data).forEach(key => {
                localStorage.setItem(`greenfence.${key}`, data[key]);
            });
            return true;
        });
}

GetConfig();
