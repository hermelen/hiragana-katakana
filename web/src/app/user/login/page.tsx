"use client";

import React, { useState } from "react";
import { UserService } from "@/api";

export default function UserLoginPage() {
  const [username_or_email, setUsername_or_email] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const submitLogin = () => {
    UserService.login({ username_or_email, password });
  };

  return (
    <div className="lg:flex size-full">
      <div className="lg:w-4/12 size-full flex justify-end"></div>
      <div className="lg:w-6/12 size-full">
        <div className="flex gap-4">
          <ul className="flex flex-col gap-4 justify-center size-full">
            <li className="flex items-center gap-5 size-full">
              <div
                className={`text-2xl 
                            size-full
                            text-center
                            flex
                            items-center
                            justify-center
                            w-80 
                            h-10 
                            rounded-lg 
                            bg-gradient-to-b 
                            shadow-lg
                            from-indigo-500
                            to-stone-800`}
              >
                Username/Email
              </div>
              <input
                className="h-10 flex-1 text-center rounded-lg shadow-lg text-black text-xl size-full"
                type="text"
                value={username_or_email}
                onChange={(e) => setUsername_or_email(e.target.value)}
                placeholder="Type something..."
              />
            </li>
            <li className="flex items-center gap-5 size-full">
              <div
                className={`text-2xl 
                            size-full
                            text-center
                            flex
                            items-center
                            justify-center
                            w-80 
                            h-10 
                            rounded-lg 
                            bg-gradient-to-b 
                            shadow-lg
                            to-stone-800 
                            from-indigo-500`}
              >
                Password
              </div>
              <input
                className="h-10 flex-1 text-center rounded-lg shadow-lg text-black text-xl size-full"
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Type something..."
              />
            </li>
            <li className="flex items-center gap-5 size-full">
              <div className="w-80 h-10"></div>
              <button
                className={`h-10 
                            flex-1 
                            text-xl 
                            text-center
                            flex
                            items-center
                            justify-center
                            rounded-lg 
                            shadow-lg                                        
                            bg-gradient-to-b 
                            to-stone-800 
                            from-indigo-500`}
                onClick={() => submitLogin()}
              >
                Submit
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div className="lg:w-4/12 flex justify-end"></div>
    </div>
  );
}
