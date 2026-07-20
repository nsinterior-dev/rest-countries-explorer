import axios from "axios";
import { SearchCountriesParams } from "./params";

const API_PATH = 'https://api.restcountries.com/countries/v5'
const AUTH = `Bearer ${process.env.NEXT_PUBLIC_REST_API_KEY}`

export async function listCountries(params: SearchCountriesParams) {
   const { q, ...rest } = params;
   const { data } = await axios(API_PATH, {
        params: q ? { q, ...rest } : rest,
        headers: {
            Authorization: AUTH
        }
    })
    return data;
}
