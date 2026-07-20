import axios from "axios";
import { SearchCountriesParams } from "./params";

const apiPath = 'https://api.restcountries.com/countries/v5'
const auth = `Bearer ${process.env.NEXT_PUBLIC_REST_API_KEY}`

export async function listCountries(params: SearchCountriesParams) {
   const { data } = await axios(apiPath, {
        params,
        headers: {
            Authorization: auth
        }
    })
    return data;
}
