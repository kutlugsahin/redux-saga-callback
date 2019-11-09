## redux-saga-callback

In a normal flow of a redux-saga application there might be some cases that you want get notified when a saga triggered by a dispatched action is completed. The purpose of this library is to provide some helper functions to achieve that functionalities.

### Install

```bash
npm i redux-saga-callback
```

### Usage
```js
import { putWait, withCallback } from 'redux-saga-callback';
```

Wrap your saga generator with withCallback
```js
takeEvery('FETCH_USERS', withCallback(fetchUsers));
```

Defined callback in your action if you need
```js
dispatch({type: 'FETCH_USERS', onComplete: ({error, cancelled, data}) => {

}})
```

In saga you can wait for it (no callback definition is needed with putWait)
```js
const users = yield putWait({type: 'FETCH_USERS'});
```

### API

#### withCallback

This is a higer order saga which will call the **onComplete** callback property of the action if defined.

_**onComplete**_

-   error: error which is thrown by the saga
-   cancelled: Will be true if the saga is cancelled
-   data: the data returned by the saga

```js
function onComplete({ error, cancelled, data }) {
    /* handle callback */
}
```

```js
function* fetchUsers() {
    const users = yield fetch('/users');

    // put users to store
    yield put(putUsers(users));

    // returned value will be passed to onComplete function as parameter
    // Exceptions will be handled by the withCallback and will also be passed to onComplete
    return users;
}

export function*(){
    yield all([
        takeEvery('FETCH_USERS', withCallback(fetchUsers))
    ])
}

// userSaga.js
```

```js
// Component to list users
export const Users = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [users, setUsers] = useState([]);

    const dispatch = useDispatch();

    function onUsersFetchCompleted({ error, cancelled, data }) {
        setIsLoading(false);
        if (!err && !cancelled) {
            setUsers(data);
        }
    }

    useEffect(() => {
        dispatch({
            type: 'FETCH_USERS',
            onComplete: onUsersFetchCompleted,
        });
    }, []);

    return isLoading ? (
        'Loading'
    ) : (
        <ul>
            {users.map(user => (
                <li>{user.name}</li>
            ))}
        </ul>
    );
};

// Users.jsx
```

#### putWait

An effect that dispatches the action (same as **put** effect) which you can yield and wait for that saga to be completed **only if** the saga is created using **withCallback** higher order saga

Example

```js
function* loadCurrentUserData() {
    const currentUserId = getCurrentUserId();

    let users = yield select(state => state.users);

    if(!users) {
        // waits until fetchUsers saga is completed
        // fetchUser saga is defined in userSaga.js above
        users = yield putWait({type: 'FETCH_USERS'});
    }

    return users.find(p => p.id === currentUserId);
}

export function*(){
    yield all([
        takeEvery('LOAD_CURRENT_USER', fetchUsers)
    ])
}

// userData.js
```
