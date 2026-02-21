export async function sendGetRequest(url, params = {}) {
    if (Object.keys(params).length != 0) {
        let queryString = new URLSearchParams(params);
        url += "?" + queryString.toString();
    }
    let response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    let data = await response.json();
    return data;
}

export async function sendPostRequest(url, obj) {
    let response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
    });

    let data = await response.json();

    return data;
}

export async function sendAuthGetRequest(url, token, params = {}) {
    if (Object.keys(params).length != 0) {
        let queryString = new URLSearchParams(params);
        url += "?" + queryString.toString();
    }
    let response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
    });

    let data = await response.json();
    return data;
}

export async function sendAuthPostData(url, obj, token) {

    let response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(obj),
    });

    let data = await response.json();
    // if (!response.ok) {
    //   throw new ValidationError(data.message, data.errors);

    // }
    return data;
}

export async function sendFormPutData(url, obj, token) {
    const _cookies = cookies();
    let response = await fetch(url, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: obj,
    });

    let data = await response.json();

    return data;
}

export async function sendFormPostData(url, obj, token) {
    const _cookies = cookies();
    let response = await fetch(url, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: obj,
    });

    // console.log('Response Body:', await response.text());
    // return;

    let data = await response.json();
    // if (!response.ok) {
    //   throw new ValidationError(data.message, data.errors);
    // }
    return data;
}
