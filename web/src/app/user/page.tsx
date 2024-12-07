"use client";

import React, { useEffect, useState } from "react";
import { User } from "@/api/user";
import { UserService } from "@/api";

export default function TranslateTrainingPage() {
  const [userList, setUserList] = useState<User[]>([]);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchData = async () => {
      const response = await UserService.list(apiUrl);
      setUserList(response);
    };
    fetchData();
  }, [apiUrl]);

  return <div>Loading...</div>;
}
