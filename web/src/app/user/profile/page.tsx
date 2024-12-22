"use client";

import React, { useEffect, useState } from "react";
import { User } from "@/api/user";
import { UserService } from "@/api";

export default function UserPofilePage() {
  const [userList, setUserList] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await UserService.list(apiUrl);
      setUserList(response);
    };
    fetchData();
  }, [apiUrl]);
  if (userList.length === 0) return <div>Loading...</div>;

  return (
    <div className="lg:flex size-full">
      <div className="lg:w-4/12 width-full flex justify-end"></div>
      <div className="lg:w-6/12 width-full">
        <ul className="flex flex-col gap-4 justify-center width-full">
          <li className="flex items-center gap-5 width-full">
            <div className="flex flex-1 text-xl">
              <div className="text-xl w-40">Username</div>
              <div className="text-xl flex justify-start">Email</div>
            </div>
            <div className="text-xl text-center">Is admin</div>
          </li>
          {userList.map((user) => (
            <li key={user.id} className="flex items-center gap-5 width-full">
              <div className="flex flex-1 text-xl">
                <div className="text-xl w-40">{user.username}</div>
                <div className="text-xl flex justify-start">{user.email}</div>
              </div>
              <input
                readOnly
                type="checkbox"
                className="text-xl text-center"
                checked={user.is_admin}
              />
            </li>
          ))}
        </ul>
      </div>
      <div className="lg:w-4/12 flex justify-end"></div>
    </div>
  );
}
