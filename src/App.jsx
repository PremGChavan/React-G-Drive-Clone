import { useState } from "react";
import Data from "./components/Data";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { auth, provider } from "./firebase";
import LandingPage from "./components/LandingPage";

const App = () => {
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const signIn = () => {
    auth.signInWithPopup(provider)
      .then(({ user }) => setUser(user))
      .catch(err => alert(err));
  };

  const signOut = () => {
    auth.signOut()
      .then(() => setUser(null))
      .catch(err => alert(err));
  };

  return (
    <>
      {user ? (
        <>
          <Header 
            photoURL={user.photoURL} 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm}
            onLogout={signOut}
          />
          <div className="flex">
            <Sidebar />
            <Data />
          </div>
        </>
      ) : (
        <LandingPage signIn={signIn} />
      )}
    </>
  );
};

export default App;
