"use client";

import React, { useEffect, useState } from "react";
import { User } from "@/api/user";
import { UserService } from "@/api";
import {Label} from "@/app/components/Label";
import {DisplayValue} from "@/app/components/DisplayValue";

export default function UserListPage() {
  const [userList, setUserList] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await UserService.list();
      setUserList(response);
    };
    fetchData();
  }, []);
  if (userList.length === 0) return <div>Loading...</div>;

  return (
    <div className="size-full lg:flex">
      <div className="lg:w-3/12 size-full flex justify-end"></div>
      <div className="lg:w-6/12 size-full">
        <ul className="flex flex-col gap-4 justify-center size-full">
          <li className="flex items-center gap-5 size-full">
            <div className="flex flex-1 gap-5">
              <div className="text-xl flex justify-start w-80">Email</div>
              <div className="text-xl flex-1">Username</div>
              <div className="text-xl flex justify-end w-20">Is admin</div>
            </div>
          </li>
          {userList.map((user) => (
            <li key={user.id} className="flex items-center gap-5 size-full">
              <div className="flex flex-1 gap-5">
                <Label label={user.email} textSize="text-l" />
                <DisplayValue
                  label={user.username}
                  textSize="text-l"
                  width={40}
                />
              </div>
              <div className="flex justify-end w-20">
                <input readOnly type="checkbox" checked={user.is_admin} />
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="lg:w-3/12 flex justify-end"></div>
    </div>
  );
}
