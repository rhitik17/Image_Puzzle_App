import React, { useState } from "react";

const Auth: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    const hashedPassword = btoa(password);
    sessionStorage.setItem(
      "auth",
      JSON.stringify({ username, hashedPassword })
    );
    alert("Logged in successfully!");
    window.location.href = "/puzzle";
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen md:bg-gradient-to-r from-blue-900 to-cyan-800 via-gray-800 ">
     <div className="w-full sm:w-5/12 lg:w-3/12 px-4 md:px-6 md:py-6 lg:py-8 space-y-6 flex flex-col md:shadow rounded-2xl justify-center items-center bg-white">
     <h1 className=" text-3xl font-bold mb-4">Login</h1>
    
      <div className="w-full  rounded flex flex-col relative border border-gray-300 py-2 ">
        <label htmlFor="username" className="absolute top-[-30%] left-[3%] bg-white px-2 font-semibold">Username</label>
        <input
          type="text"
        //   placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className=" w-full outline-none px-3 py-1 "
        />
      </div>
      <div className="w-full rounded flex flex-col relative border border-gray-300 py-2 ">
        <label htmlFor="username" className="absolute top-[-30%] left-[3%] bg-white px-2 font-semibold">Password</label>
        <input
          type="password"
        //   placeholder="Username"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full outline-none px-3 py-1"
        />
      </div>
     
      <button
        onClick={handleLogin}
        className="bg-gray-600 hover:bg-gray-700 hover:scale-105 text-white px-4 py-2 rounded"
      >
        Login
      </button>
     </div>
    </div>
  );
};

export default Auth;
