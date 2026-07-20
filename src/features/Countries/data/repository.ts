import { Country } from "../domain";
import { listCountries } from "./api";
import { toCountry } from "./mapper";
import { SearchCountriesParams } from "./params";


export async function searchCountries(params: SearchCountriesParams){
    try{
        const response = await listCountries(params)
        return {
            countries: response.data.objects.map(toCountry),
            meta: response.data.meta
        }
    }
    catch(e){
        console.error(e)
        return {
            countries: [],
            meta: {}
        }
    }
}
