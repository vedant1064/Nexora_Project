import { useEffect, useState } from "react";

export default function Profile() {

  const [user, setUser] = useState(null);

  useEffect(() => {

    const bizId = localStorage.getItem("business_id");

    fetch(`${import.meta.env.API_URL}/me/${bizId}`)
      .then(res => res.json())
      .then(data => setUser(data));

  }, []);

  if (!user) {
    return <div className="text-white">Loading...</div>;
  }

  return (

    <div className="text-white">

      <h2 className="text-2xl mb-4">Profile</h2>

      <div className="bg-gray-900 p-4 rounded">

        <p><b>Name:</b> {user.name}</p>

        <p><b>Email:</b> {user.email}</p>

        <p><b>Business ID:</b> {user.business_id}</p>

      </div>

    </div>

  );

}
