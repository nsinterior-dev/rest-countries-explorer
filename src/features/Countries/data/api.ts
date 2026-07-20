import axios from "axios";
import { SearchCountriesParams , GetCountryParams, ListCountriesParams } from "./params";

const apiPath = 'https://api.restcountries.com/countries/v5'
const auth = `Bearer ${process.env.NEXT_PUBLIC_REST_API_KEY}`

export async function listCountries(params: SearchCountriesParams | ListCountriesParams) {
   const { data } = await axios(apiPath, {
        params,
        headers: {
            Authorization: auth
        }
    })
    return data;
}

export async function getCountry({ code }: GetCountryParams){
    const { data } = await axios(`${apiPath}/codes.alpha_2/${code}`, {
        headers: {
            Authorization: auth
        }
    })
    return data;
}