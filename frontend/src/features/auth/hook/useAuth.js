import {setProfile , setLoading , setError , setInitialized} from "../state/auth.slice"
import {register , login , getMe , logout} from "../service/auth.api"
import { useDispatch } from "react-redux"

export const useAuth = () => {
    const dispatch = useDispatch()

    async function handleRegister(formData){
        dispatch(setLoading(true))
        const data = await register(formData)
        dispatch(setProfile(data.user))
        dispatch(setLoading(false))
        return data.user
    }

    async function handleLogin(formData){
    try{
        dispatch(setLoading(true))

        const data = await login(formData)

        dispatch(setProfile(data.user))

        return data.user

    }catch(err){
        dispatch(setError(err.response?.data?.message))
        throw err

    }finally{
        dispatch(setLoading(false))
    }
}

    async function handleGetMe(){
        try {
            const data = await getMe()
            dispatch(setProfile(data.user))
            return data.user
        } catch {
            dispatch(setProfile(null))
            return null
        } finally {
            dispatch(setInitialized(true))
        }
    }

    async function handleLogout(){
        const data = await logout()
        dispatch(setProfile(null))
        return data?.user || null
    }

    return {handleRegister , handleLogin , handleGetMe , handleLogout}
}