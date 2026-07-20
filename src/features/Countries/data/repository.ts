import { Country } from "../domain/types";
import { listCountries } from "./api";
import { toCountry } from "./mapper";


export async function searchCountries(query: string):Promise<Country[]>{
    try{
        const response = await listCountries({
            q: query,
            limit: 10
        })
        return response.data.objects.map(toCountry)
    }
    catch(e){
        console.error(e)
        return []
    }
}
