import Link from "../helpers/links";

const Response = async (
    method,
    path,
    params,
    headerType = "application/x-www-form-urlencoded"
) => {
    const BASE_URL = Link.backendUrl;
    try {
        const response = await fetch(`${BASE_URL}/${path}`, {
            method: method,
            headers: { "Content-Type": headerType },
            body: params,
        });
        let jsonReponse = await response.json();
        return jsonReponse;
    } catch (err) {
        return err;
    }
};
export default Response;
