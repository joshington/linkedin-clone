import db, {auth, provider, storage} from '../firebase';
import { SET_USER, SET_LOADING_STATUS,GET_ARTICLES} from './actionTypes';



export const setUser = (payload) => ({
   type:SET_USER,
   user:payload 
})

//loading status
export const setLoading = (status) => ({
    type:SET_LOADING_STATUS,
    status:status

})

export const getArticles = (payload) => ({
    type:GET_ARTICLES,
    payload:payload
})

export function signInAPI(){
    return (dispatch) => {
        auth
        .signInWithPopup(provider)
        .then((payload) => {
            //console.log(payload)
            dispatch(setUser(payload.user));
        }).catch((error) => {
            alert(error.message);
        })
    }
}

export function getUserAuth(){
    return (dispatch) => {
        auth.onAuthStateChanged(async (user) => {
            if(user){
                //checking if user logged in
                dispatch(setUser(user))
            }
        })
    }
}

export function signOutAPI(){
    return (dispatch) => {
        auth.signOut().then(() => {
            dispatch(setUser(null))
        }).catch((error)=>{
            console.log(error.message);
        })
    }
}

export function postArticleAPI(payload){
    return(dispatch) => {
        dispatch(setLoading(true));//means to load
        if(payload.image != ''){
            const upload = storage
                .ref(`images/${payload.image.name}`)
                .put(payload.image);
                //helps us upload our image to the application
            upload.on('state_changed', (snapshot) => {
                const progress = ((snapshot.bytesTransferred / snapshot.totalBytes)*100)
                console.log(`progress: ${progress}%`);
                if(snapshot.state === 'RUNNING'){
                    console.log(`Progress: ${progress}%`)
                }
            }, error => console.log(error.code),
                async () => {
                    const downloadURL = await upload.snapshot.ref.getDownloadURL()
                    db.collection("articles").add({
                        actor:{
                            description:payload.user.email,
                            titlte: payload.user.displayName,
                            date:payload.timestamp,
                            image:payload.user.photoURL
                        },
                        video:payload.video,
                        sharedImg:downloadURL,
                        comments:0,
                        description:payload.description
                    });
                    dispatch(setLoading(false));
        //shows that we have finished the loading.
                }
                //need to show the url to our users of the app.
            )//helpful in displaying the loading bar.
            
        }else if(payload.video){
            db.collection("articles").add({
                actor:{
                    description: payload.user.email,
                    title:payload.user.displayName,
                    date:payload.timestamp,
                    image:payload.user.photoURL
                },
                video:payload.video,
                sharedImg:"",
                comments:0,
                description:payload.description
            });
            dispatch(setLoading(false));
        }
    }
} 


export function getArticlesAPI(){
    return(dispatch) => {
        let payload;
        //snapshot helps retrieve articles from firebase.
        db.collection('articles')
            .orderBy('actor.data','desc')
            .onSnapshot((snapshot) => {
                payload = snapshot.docs.map((doc) => doc.data());
                console.log(payload);
                dispatch(getArticles(payload))
            })
    }
}