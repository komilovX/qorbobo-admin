export default function({store,redirect}){
    if (!store.getters['auth/isAuthticated']) {
        redirect('/login?message=login')
    }
}
