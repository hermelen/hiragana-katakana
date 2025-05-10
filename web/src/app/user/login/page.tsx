"use client";

import React, { useState } from "react";
import { UserService } from "@/api";
import { InputText } from "@/app/components/InputText";
import { BasicButton } from "@/app/components/BasicButton";

export default function UserLoginPage() {
  const [username_or_email, setUsernameOrEmail] = useState<string>("");
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
              <InputText
                value={username_or_email}
                placeholder="Type username or email"
                classValue="size-full"
                onChangeHandler={(e) => setUsernameOrEmail(e.target.value)}
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
              <InputText
                value={password}
                placeholder="Type password"
                classValue="size-full"
                onChangeHandler={(e) => setPassword(e.target.value)}
              />
            </li>
            <li className="flex items-center gap-5 size-full">
              <div className="w-80 h-10"></div>
              <BasicButton
                label="Submit"
                onClickHandler={() => submitLogin()}
              />
            </li>
          </ul>
        </div>
      </div>
      <div className="lg:w-4/12 flex justify-end"></div>
    </div>
  );
}
